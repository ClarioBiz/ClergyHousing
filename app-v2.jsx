// Clergy Housing — main App

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "clario",
  "headingFont": "Source Serif 4",
  "view": "landing",
  "trialState": "active"
}/*EDITMODE-END*/;

const PALETTES = {
  clario: {
    name: 'Clario',
    '--paper': '#F4F5F7', '--paper-2': '#E9ECF0',
    '--card': '#FFFFFF', '--card-2': '#F7F9FB',
    '--hairline': '#DDE1E6', '--hairline-2': '#EAEDF1',
    '--ink': '#15163A', '--ink-2': '#272A52', '--ink-3': '#6A6F86', '--ink-4': '#9DA3B8',
    '--forest': '#25215d',   // Pantone 273 — Azul Marino
    '--forest-2': '#005cb9', // Pantone 300 — Azul (primary)
    '--forest-3': '#6fcfeb', // Pantone Blue 0821 — Celeste
    '--brass': '#ec7625',    // Pantone 158 — Naranja
    '--brass-2': '#ffcf01',  // Pantone 116 — Amarillo
  },
  forest: { name: 'Cream & Forest', '--paper': '#F2EBDC', '--card': '#FBF7EC', '--forest': '#1E3A2E', '--forest-2': '#284A3B', '--forest-3': '#3B6A56', '--brass': '#A88542', '--brass-2': '#C9A968' },
  navy:   { name: 'Cream & Navy',   '--paper': '#F2EBDC', '--card': '#FBF7EC', '--forest': '#1B2B47', '--forest-2': '#243A5C', '--forest-3': '#43608A', '--brass': '#A88542', '--brass-2': '#C9A968' },
  oxblood:{ name: 'Cream & Oxblood','--paper': '#F2EBDC', '--card': '#FBF7EC', '--forest': '#4A1F1D', '--forest-2': '#5E2A26', '--forest-3': '#8C453E', '--brass': '#A88542', '--brass-2': '#C9A968' },
  stone:  { name: 'Linen & Slate',  '--paper': '#EFEBE0', '--card': '#F8F5EB', '--forest': '#2F3A3A', '--forest-2': '#3E4A4A', '--forest-3': '#5F706E', '--brass': '#967E4E', '--brass-2': '#B8A077' },
};

const HEADING_FONTS = {
  'Source Serif 4': '"Source Serif 4", Georgia, serif',
  'Cormorant Garamond': '"Cormorant Garamond", Georgia, serif',
  'Newsreader': '"Newsreader", Georgia, serif',
  'Montserrat (Clario brand)': '"Montserrat", ui-sans-serif, system-ui, sans-serif',
};

// ─────────────────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────────────────
function Sidebar({ route, onGo, settings }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard',     icon: <Icon.Home /> },
    { id: 'log',       label: 'Expenses',      icon: <Icon.Ledger /> },
    { id: 'banks',     label: 'Bank Accounts', icon: <Icon.Bank /> },
    { id: 'report',    label: 'Tax Report',    icon: <Icon.Report /> },
    { id: 'documents', label: 'Documents',     icon: <Icon.Doc /> },
  ];
  const accountItems = [
    { id: 'billing',   label: 'Billing',       icon: <Icon.Card /> },
    { id: 'settings',  label: 'Settings',      icon: <Icon.Cog /> },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Icon.Logo /></div>
        <div>
          <div className="brand-name">Clergy Housing</div>
          <div className="brand-sub">By Clario Consulting</div>
        </div>
      </div>

      <nav className="nav">
        <div className="nav-label">Records</div>
        {items.map(it => (
          <button key={it.id}
            className={'nav-item' + (route === it.id ? ' active' : '')}
            onClick={() => onGo(it.id)}>
            {it.icon}{it.label}
          </button>
        ))}
        <div className="nav-label" style={{ marginTop: 18 }}>Account</div>
        {accountItems.map(it => (
          <button key={it.id}
            className={'nav-item' + (route === it.id ? ' active' : '')}
            onClick={() => onGo(it.id)}>
            {it.icon}{it.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <strong>{settings.ministerName}</strong><br/>
        {settings.churchName}<br/>
        <span className="yr">Tax Year {settings.taxYear}</span>
        <div className="sidebar-legal">
          <a href="/privacy.html" target="_blank" rel="noopener">Privacy</a>
          <span>·</span>
          <a href="/terms.html" target="_blank" rel="noopener">Terms</a>
          <span>·</span>
          <a href="/cookies.html" target="_blank" rel="noopener">Cookies</a>
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Top bar
// ─────────────────────────────────────────────────────────────────────────
function TopBar({ route, subscription, settings, onTrialClick, onSignOut, onMenu }) {
  const labels = {
    dashboard: 'Dashboard', log: 'Expenses', banks: 'Bank Accounts',
    report: 'Tax Report', documents: 'Documents',
    billing: 'Billing', settings: 'Settings',
  };
  const [menuOpen, setMenuOpen] = React.useState(false);
  const initials = settings.firstName[0] + settings.lastName[0];

  return (
    <div className="topbar-2">
      <div className="left">
        <button className="menu-trigger" onClick={onMenu} aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
        <span>Clergy Housing</span>
        <span className="sep">·</span>
        <span className="crumb-active">{labels[route]}</span>
      </div>
      <div className="right">
        {subscription.plan === 'trial' && (
          <button className="trial-badge" onClick={onTrialClick}>
            <span className="pulse" />
            <span><span className="full">Trial · </span>{subscription.daysLeft} days left</span>
          </button>
        )}
        <div style={{ position: 'relative' }}>
          <div className="avatar" onClick={() => setMenuOpen(o => !o)}>{initials}</div>
          {menuOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 1 }} onClick={() => setMenuOpen(false)} />
              <div style={{ position: 'absolute', top: 40, right: 0, width: 220, background: 'var(--card)', border: '1px solid var(--hairline)', borderRadius: 10, boxShadow: 'var(--shadow-elev)', padding: 8, zIndex: 2 }}>
                <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--hairline-2)', marginBottom: 6 }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 14 }}>{settings.ministerName}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{Auth.getEmail()}</div>
                </div>
                <button className="nav-item" style={{ color: 'var(--ink-2)', width: '100%' }} onClick={() => { setMenuOpen(false); onSignOut(); }}>
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // If user is already logged in, go straight to app
  const initialView = Auth.isLoggedIn() ? 'app' : (t.view === 'app' ? 'landing' : t.view);
  const [view, setView] = React.useState(initialView);
  const [authMode, setAuthMode] = React.useState('signup');
  const [route, setRoute] = React.useState(() => {
    const saved = localStorage.getItem('ch_route');
    const valid = ['dashboard','log','banks','report','documents','billing','settings'];
    return (saved && valid.includes(saved)) ? saved : 'dashboard';
  });
  const [loading, setLoading] = React.useState(false);

  const [expenses, setExpenses] = React.useState([]);
  const [settings, setSettings] = React.useState({
    firstName: '', lastName: '', ministerName: '', churchName: '',
    taxYear: new Date().getFullYear(),
    designated: 0, designatedSetOn: '', fairRentalValue: 0,
  });
  const [subscription, setSubscription] = React.useState({ plan: 'trial', daysLeft: 90 });
  const [invoices, setInvoices] = React.useState([]);
  const [documents, setDocuments] = React.useState([]);

  const [modal, setModal] = React.useState(null);
  const [previewReceipt, setPreviewReceipt] = React.useState(null); // { s3Key, fileName }
  const [toast, setToast] = React.useState(null);
  const [pendingTxns, setPendingTxns] = React.useState([]);
  const [drawer, setDrawer] = React.useState(false);

  // Load real data from API after login
  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [profile, expensesData, sub, invoicesData, docsData] = await Promise.all([
        API.getProfile(),
        API.getExpenses(),
        API.getSubscription(),
        API.getInvoices().catch(() => []),
        API.getDocuments().catch(() => []),
      ]);
      if (profile) {
        setSettings({
          firstName:       profile.first_name  || '',
          lastName:        profile.last_name   || '',
          ministerName:    profile.minister_name || '',
          churchName:      profile.church_name || '',
          taxYear:         profile.tax_year    || new Date().getFullYear(),
          designated:      parseFloat(profile.designated)       || 0,
          designatedSetOn: profile.designated_set_on ? profile.designated_set_on.toString().split('T')[0] : '',
          fairRentalValue: parseFloat(profile.fair_rental_value)|| 0,
        });
      }
      if (expensesData) {
        setExpenses(expensesData.map(e => ({
          id:          e.id,
          date:        e.date ? e.date.toString().split('T')[0] : '',
          categoryId:  e.category_id,
          description: e.description,
          amount:      parseFloat(e.amount),
          source:      e.source,
          receipt:     e.receipt_s3_key ? { name: e.receipt_s3_key.split('/').pop(), s3Key: e.receipt_s3_key } : null,
        })));
      }
      if (sub) {
        const trialEnd  = sub.trial_end ? new Date(sub.trial_end) : null;
        const daysLeft  = trialEnd ? Math.max(0, Math.ceil((trialEnd - new Date()) / 86400000)) : 0;
        setSubscription({
          plan:       sub.plan,
          status:     sub.status,
          daysLeft,
          trialEnd:   sub.trial_end ? sub.trial_end.toString().split('T')[0] : '',
        });
      }
      if (Array.isArray(invoicesData)) {
        setInvoices(invoicesData);
      }
      if (Array.isArray(docsData)) {
        setDocuments(docsData.map(d => ({
          id:       d.id,
          name:     d.name || d.s3_key?.split('/').pop() || 'file',
          date:     d.date ? d.date.toString().split('T')[0] : '',
          size:     parseInt(d.size_bytes) || 0,
          category: d.category || 'other',
          kind:     d.kind || 'receipt',
        })));
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle Google OAuth callback (code in URL after redirect from Google)
  React.useEffect(() => {
    if (window.location.search.includes('code=')) {
      Auth.handleOAuthCallback().then(success => {
        if (success) setView('app');
      });
    }
  }, []);

  // Load data when entering app view
  React.useEffect(() => {
    if (view === 'app') loadData();
  }, [view]);

  // Close drawer when route changes, and persist selection to survive refresh
  const go = React.useCallback((r) => {
    setRoute(r);
    localStorage.setItem('ch_route', r);
    setDrawer(false);
  }, []);

  // Sync view tweak (dev tool only — never send unauthenticated users to app)
  React.useEffect(() => {
    if (t.view !== 'app' || Auth.isLoggedIn()) {
      setView(t.view);
    }
  }, [t.view]);
  // Force paywall if trial ended
  React.useEffect(() => {
    if (t.trialState === 'ended' && t.view === 'app') {
      setView('paywall');
    }
  }, [t.trialState, t.view]);

  React.useEffect(() => {
    const palette = PALETTES[t.palette] || PALETTES.forest;
    const root = document.documentElement;
    // Clear any palette overrides set by a previous palette so unused keys revert to :root defaults
    ['--paper','--paper-2','--card','--card-2','--hairline','--hairline-2',
     '--ink','--ink-2','--ink-3','--ink-4',
     '--forest','--forest-2','--forest-3','--brass','--brass-2'].forEach(k => root.style.removeProperty(k));
    Object.entries(palette).forEach(([k, v]) => {
      if (k.startsWith('--')) root.style.setProperty(k, v);
    });
    root.style.setProperty('--serif', HEADING_FONTS[t.headingFont] || HEADING_FONTS['Source Serif 4']);
  }, [t.palette, t.headingFont]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const handleSaveExpense = async (entry) => {
    try {
      // Upload receipt file to S3 if one was picked
      let receiptS3Key = entry.receipt?.s3Key || null;
      if (entry.receiptFile) {
        const { uploadUrl, s3Key } = await API.getUploadUrl(entry.receiptFile.name, entry.receiptFile.type);
        await fetch(uploadUrl, { method: 'PUT', body: entry.receiptFile, headers: { 'Content-Type': entry.receiptFile.type } });
        receiptS3Key = s3Key;
        // Record in Documents section too
        const doc = await API.createDocument({
          fileName: entry.receiptFile.name, s3Key, sizeBytes: entry.receiptFile.size,
          category: entry.categoryId,
        });
        setDocuments(prev => [{
          id: doc.id, name: doc.name || entry.receiptFile.name,
          date: new Date().toISOString().split('T')[0],
          size: entry.receiptFile.size, category: entry.categoryId, kind: 'receipt',
        }, ...prev]);
      }
      const body = {
        date: entry.date, categoryId: entry.categoryId,
        description: entry.description, amount: entry.amount,
        receiptS3Key,
      };
      if (modal?.mode === 'edit') {
        await API.updateExpense(entry.id, body);
        setExpenses(prev => prev.map(e => e.id === entry.id ? { ...e, ...entry, receipt: receiptS3Key ? { name: entry.receiptFile?.name || entry.receipt?.name, s3Key: receiptS3Key } : entry.receipt } : e));
        showToast('Expense updated');
      } else {
        const created = await API.createExpense(body);
        setExpenses(prev => [{ ...entry, id: created.id, receipt: receiptS3Key ? { name: entry.receiptFile?.name, s3Key: receiptS3Key } : null }, ...prev]);
        showToast('Expense added to ledger');
      }
      setModal(null);
    } catch (err) {
      console.error(err);
      showToast('Error saving expense');
    }
  };

  const handleDeleteExpense = async (entry) => {
    try {
      await API.deleteExpense(entry.id);
      setExpenses(prev => prev.filter(e => e.id !== entry.id));
      setModal(null);
      showToast('Expense removed');
    } catch (err) {
      showToast('Error deleting expense');
    }
  };

  const handleBulkDelete = async (ids) => {
    try {
      await Promise.all(ids.map(id => API.deleteExpense(id)));
      setExpenses(prev => prev.filter(e => !ids.includes(e.id)));
      showToast(`${ids.length} entries removed`);
    } catch (err) {
      showToast('Error removing expenses');
    }
  };

  const handleAddBankExpenses = async (entries) => {
    try {
      const created = await Promise.all(entries.map(e => API.createExpense({
        date: e.date, categoryId: e.categoryId,
        description: e.description, amount: e.amount,
      })));
      setExpenses(prev => [...created.map((c, i) => ({ ...entries[i], id: c.id })), ...prev]);
      setPendingTxns(prev => prev.filter(t => !entries.find(e => e.id === 'tx-' + t.id)));
      showToast(`${entries.length} bank transactions added to ledger`);
    } catch (err) {
      showToast('Error adding bank transactions');
    }
  };

  const handleSaveSettings = async (s) => {
    try {
      await API.updateProfile({
        firstName: s.firstName, lastName: s.lastName,
        ministerName: s.ministerName, churchName: s.churchName,
        taxYear: s.taxYear, designated: s.designated,
        designatedSetOn: s.designatedSetOn, fairRentalValue: s.fairRentalValue,
      });
      setSettings(prev => ({ ...prev, ...s }));
      showToast('Settings saved');
    } catch (err) {
      showToast('Error saving settings');
    }
  };

  const handleSubscribe = (planId) => {
    setTweak('trialState', planId);
    if (view === 'paywall') setView('app');
    showToast(`Subscribed · ${planId === 'monthly' ? 'Monthly' : 'Annual'} plan active`);
  };

  // ── Render by view ────────────────────────────────────────────────────
  const handleSignOut = () => {
    Auth.signOut();
    localStorage.removeItem('ch_route');
    setExpenses([]);
    setView('landing');
  };

  if (view === 'landing') {
    return (
      <>
        <Landing onStart={() => { setAuthMode('signup'); setView('auth'); }}
                 onSignIn={() => { setAuthMode('signin'); setView('auth'); }} />
        <AppTweaks t={t} setTweak={setTweak} />
      </>
    );
  }
  if (view === 'auth') {
    return (
      <>
        <AuthScreen mode={authMode}
          onComplete={async (signupInfo) => {
            if (signupInfo && (signupInfo.name || signupInfo.church)) {
              const nameParts = (signupInfo.name || '').trim().split(' ');
              await API.updateProfile({
                firstName:    nameParts[0] || '',
                lastName:     nameParts.slice(1).join(' ') || '',
                ministerName: signupInfo.name || '',
                churchName:   signupInfo.church || '',
              }).catch(() => {});
            }
            setView('app');
          }}
          onBackToLanding={() => setView('landing')} />
        <AppTweaks t={t} setTweak={setTweak} />
      </>
    );
  }
  if (view === 'paywall') {
    return (
      <div className="app" data-drawer={drawer ? 'open' : 'closed'}>
        <div className="sidebar-overlay" onClick={() => setDrawer(false)} />
        <Sidebar route={route} onGo={go} settings={settings} />
        <main className="main">
          <TopBar route={route} subscription={subscription} settings={settings}
                  onTrialClick={() => {}} onSignOut={handleSignOut}
                  onMenu={() => setDrawer(true)} />
          <Paywall
            summary={{ expenses: expenses.length, reports: 1, receipts: expenses.filter(e => e.receipt).length }}
            onSubscribe={handleSubscribe}
            onSignOut={handleSignOut}
          />
        </main>
        <AppTweaks t={t} setTweak={setTweak} />
        {toast && <div className="toast"><Icon.Check /> {toast}</div>}
      </div>
    );
  }

  return (
    <div className="app" data-drawer={drawer ? 'open' : 'closed'}>
      <div className="sidebar-overlay" onClick={() => setDrawer(false)} />
      <Sidebar route={route} onGo={go} settings={settings} />
      <main className="main">
        <TopBar route={route} subscription={subscription} settings={settings}
                onTrialClick={() => go('billing')}
                onSignOut={handleSignOut}
                onMenu={() => setDrawer(true)} />

        {route === 'dashboard' && (
          <Dashboard2 settings={settings} expenses={expenses} subscription={subscription}
                      pendingTxns={pendingTxns}
                      onAdd={() => setModal({ mode: 'add' })} onGo={go} />
        )}
        {route === 'log' && (
          <ExpenseLog2 expenses={expenses}
                       onAdd={() => setModal({ mode: 'add' })}
                       onEdit={(e) => setModal({ mode: 'edit', expense: e })}
                       onDelete={handleDeleteExpense}
                       onBulkDelete={handleBulkDelete}
                       onPreviewReceipt={(s3Key, fileName) => setPreviewReceipt({ s3Key, fileName })} />
        )}
        {route === 'banks' && (
          <BankAccounts banks={[]} pendingTxns={pendingTxns} onAddExpenses={handleAddBankExpenses} />
        )}
        {route === 'report' && (
          <TaxReport2 settings={settings} expenses={expenses} onUpdateSettings={handleSaveSettings} />
        )}
        {route === 'documents' && (
          <Documents
            documents={documents}
            onDocumentUploaded={(doc) => {
              setDocuments(prev => [{
                id: doc.id, name: doc.name || doc.s3_key?.split('/').pop() || 'file',
                date: doc.date ? doc.date.toString().split('T')[0] : new Date().toISOString().split('T')[0],
                size: parseInt(doc.size_bytes) || 0, category: doc.category || 'receipts', kind: doc.kind || 'receipt',
              }, ...prev]);
            }}
            onDocumentDeleted={(id) => setDocuments(prev => prev.filter(d => d.id !== id))}
          />
        )}
        {route === 'billing' && (
          <Billing subscription={subscription} invoices={invoices} onSubscribe={handleSubscribe} />
        )}
        {route === 'settings' && (
          <SettingsPage2 settings={settings} onSave={handleSaveSettings}
                        onSignOut={handleSignOut} />
        )}
      </main>

      {modal && (
        <ExpenseForm2
          initial={modal.mode === 'edit' ? modal.expense : null}
          onSave={handleSaveExpense}
          onCancel={() => setModal(null)}
          onDelete={handleDeleteExpense}
        />
      )}

      {previewReceipt && (
        <ReceiptPreviewModal
          s3Key={previewReceipt.s3Key}
          fileName={previewReceipt.fileName}
          onClose={() => setPreviewReceipt(null)}
        />
      )}

      {toast && (
        <div className="toast">
          <Icon.Check /> {toast}
        </div>
      )}

      <AppTweaks t={t} setTweak={setTweak} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Tweaks panel
// ─────────────────────────────────────────────────────────────────────────
function AppTweaks({ t, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Navigate" />
      <TweakSelect label="View" value={t.view}
        options={[
          { value: 'landing', label: 'Landing page' },
          { value: 'auth',    label: 'Sign up / sign in' },
          { value: 'app',     label: 'In-app (signed in)' },
          { value: 'paywall', label: 'Paywall / trial ended' },
        ]}
        onChange={(v) => setTweak('view', v)} />

      <TweakSelect label="Trial state" value={t.trialState}
        options={[
          { value: 'active', label: 'Active (47 days left)' },
          { value: 'ending', label: 'Ending soon (12 days)' },
          { value: 'ended',  label: 'Trial ended' },
          { value: 'monthly', label: 'Subscribed · Monthly' },
          { value: 'annual',  label: 'Subscribed · Annual' },
        ]}
        onChange={(v) => setTweak('trialState', v)} />

      <TweakSection label="Palette" />
      <TweakSelect label="Theme" value={t.palette}
        options={Object.entries(PALETTES).map(([id, p]) => ({ value: id, label: p.name }))}
        onChange={(v) => setTweak('palette', v)} />

      <TweakSection label="Typography" />
      <TweakSelect label="Headings" value={t.headingFont}
        options={Object.keys(HEADING_FONTS)}
        onChange={(v) => setTweak('headingFont', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
