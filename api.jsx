// Clergy Housing — API & Auth layer
// Talks to Cognito for auth, Lambda for data

const AUTH_CONFIG = {
  region:    'us-east-1',
  clientId:  'bdu43kd9f7cabta3jt0r6c0pm',
  endpoint:  'https://cognito-idp.us-east-1.amazonaws.com/',
  hostedUI:  'https://clergy-housing-auth.auth.us-east-1.amazoncognito.com',
  redirectUri: 'https://clergyhousing.com',
};
const API_BASE = 'https://hy8fdgwatb.execute-api.us-east-1.amazonaws.com';

// ── Token storage ─────────────────────────────────────────────────────────

const TokenStore = {
  save(tokens, provider = 'email') {
    localStorage.setItem('ch_access',   tokens.AccessToken);
    localStorage.setItem('ch_id',       tokens.IdToken);
    localStorage.setItem('ch_refresh',  tokens.RefreshToken);
    localStorage.setItem('ch_email',    tokens.email || '');
    localStorage.setItem('ch_provider', provider);
  },
  getAccess()  { return localStorage.getItem('ch_access'); },
  getEmail()   { return localStorage.getItem('ch_email'); },
  clear() {
    ['ch_access','ch_id','ch_refresh','ch_email','ch_provider'].forEach(k => localStorage.removeItem(k));
  },
  isLoggedIn()   { return !!localStorage.getItem('ch_access'); },
  isGoogleUser() { return localStorage.getItem('ch_provider') === 'google'; },
};

// ── Cognito helper ────────────────────────────────────────────────────────

async function cognitoRequest(target, body) {
  const res = await fetch(AUTH_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${target}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data.message || data.Message || 'Authentication error';
    throw new Error(msg);
  }
  return data;
}

// ── Auth functions ────────────────────────────────────────────────────────

const Auth = {
  // Create a new account
  async signUp(email, password, name, church) {
    await cognitoRequest('SignUp', {
      ClientId: AUTH_CONFIG.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name',  Value: name },
      ],
    });
    return { email };
  },

  // Confirm sign up with 6-digit code from email
  async confirmSignUp(email, code) {
    await cognitoRequest('ConfirmSignUp', {
      ClientId: AUTH_CONFIG.clientId,
      Username: email,
      ConfirmationCode: code,
    });
  },

  // Resend confirmation code
  async resendCode(email) {
    await cognitoRequest('ResendConfirmationCode', {
      ClientId: AUTH_CONFIG.clientId,
      Username: email,
    });
  },

  // Sign in
  async signIn(email, password) {
    const data = await cognitoRequest('InitiateAuth', {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId:  AUTH_CONFIG.clientId,
      AuthParameters: { USERNAME: email, PASSWORD: password },
    });
    const tokens = data.AuthenticationResult;
    TokenStore.save({ ...tokens, email });
    return tokens;
  },

  // Sign in with Google — redirects to Google via Cognito hosted UI
  signInWithGoogle() {
    const params = new URLSearchParams({
      client_id:     AUTH_CONFIG.clientId,
      response_type: 'code',
      scope:         'email openid profile',
      redirect_uri:  AUTH_CONFIG.redirectUri,
      identity_provider: 'Google',
    });
    window.location.href = `${AUTH_CONFIG.hostedUI}/oauth2/authorize?${params}`;
  },

  // Exchange OAuth code for tokens (called on redirect back from Google)
  async handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (!code) return false;

    const res = await fetch(`${AUTH_CONFIG.hostedUI}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:   'authorization_code',
        client_id:    AUTH_CONFIG.clientId,
        code,
        redirect_uri: AUTH_CONFIG.redirectUri,
      }),
    });
    const tokens = await res.json();
    if (tokens.access_token) {
      // Decode email from ID token
      const payload = JSON.parse(atob(tokens.id_token.split('.')[1]));
      TokenStore.save({
        AccessToken:  tokens.access_token,
        IdToken:      tokens.id_token,
        RefreshToken: tokens.refresh_token || '',
        email:        payload.email || '',
      }, 'google');
      // Clean the URL
      window.history.replaceState({}, document.title, '/');
      return true;
    }
    return false;
  },

  // Sign out
  signOut() {
    TokenStore.clear();
  },

  isLoggedIn: () => TokenStore.isLoggedIn(),
  getToken:   () => TokenStore.getAccess(),
  getEmail:   () => TokenStore.getEmail(),
};

// ── API fetch helper ──────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const token = Auth.getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
}

// ── API functions ─────────────────────────────────────────────────────────

const API = {
  // Profile
  getProfile:    ()       => apiFetch('/profile'),
  updateProfile: (body)   => apiFetch('/profile', { method: 'PUT', body }),

  // Expenses
  getExpenses:   (taxYear) => apiFetch(`/expenses${taxYear ? `?taxYear=${taxYear}` : ''}`),
  createExpense: (body)    => apiFetch('/expenses', { method: 'POST', body }),
  updateExpense: (id, body)=> apiFetch(`/expenses/${id}`, { method: 'PUT', body }),
  deleteExpense: (id)      => apiFetch(`/expenses/${id}`, { method: 'DELETE' }),

  // Documents
  getDocuments:      ()       => apiFetch('/documents'),
  getUploadUrl:      (fileName, contentType) =>
    apiFetch('/documents/upload-url', { method: 'POST', body: { fileName, contentType } }),
  getReceiptUrl:     (s3Key)  => apiFetch('/documents/view-url', { method: 'POST', body: { s3Key } }),
  createDocument:    (body)   => apiFetch('/documents', { method: 'POST', body }),
  deleteDocument:    (id)     => apiFetch(`/documents/${id}`, { method: 'DELETE' }),

  // Subscription & billing
  getSubscription: () => apiFetch('/subscription'),
  getInvoices:     () => apiFetch('/invoices'),
};

// Expose globally for use in other JSX files
Object.assign(window, { Auth, API, TokenStore });
