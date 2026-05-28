// Clergy Housing — Lambda API Handler
// Handles all API routes for the app

const { Client } = require('pg');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const DB_CONFIG = {
  host:     process.env.DB_HOST,
  port:     5432,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl:      { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
};

const S3  = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const SES = new SESClient({ region: 'us-east-1' });
const BUCKET        = process.env.S3_BUCKET;
const USER_POOL_ID  = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID     = process.env.COGNITO_CLIENT_ID;
const CONTACT_EMAIL = 'hello@clergyhousing.com';

const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse:   'access',
  clientId:   CLIENT_ID,
});

// ── Helpers ────────────────────────────────────────────────────────────────

function resp(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

async function getDb() {
  const client = new Client(DB_CONFIG);
  await client.connect();
  return client;
}

async function verifyToken(event) {
  const auth = event.headers?.authorization || event.headers?.Authorization || '';
  const token = auth.replace('Bearer ', '');
  if (!token) throw new Error('No token');
  const payload = await verifier.verify(token);
  return payload.sub; // Cognito user ID
}

async function getOrCreateUser(db, cognitoSub, email) {
  const existing = await db.query('SELECT * FROM users WHERE cognito_sub = $1', [cognitoSub]);
  if (existing.rows.length > 0) return existing.rows[0];
  const created = await db.query(
    `INSERT INTO users (cognito_sub, email, tax_year)
     VALUES ($1, $2, $3) RETURNING *`,
    [cognitoSub, email || '', new Date().getFullYear()]
  );
  return created.rows[0];
}

// ── Contact Form ───────────────────────────────────────────────────────────

async function sendContactEmail({ name, email, subject, message }) {
  const safeSubject = (subject || 'General Inquiry').substring(0, 200);
  const bodyText =
    `New contact form submission — Clergy Housing\n` +
    `${'─'.repeat(48)}\n` +
    `Name:     ${name}\n` +
    `Email:    ${email}\n` +
    `Subject:  ${safeSubject}\n` +
    `${'─'.repeat(48)}\n\n` +
    `${message}\n\n` +
    `${'─'.repeat(48)}\n` +
    `Sent via clergyhousing.com/contact.html`;

  await SES.send(new SendEmailCommand({
    Source:           `Clergy Housing <${CONTACT_EMAIL}>`,
    Destination:      { ToAddresses: [CONTACT_EMAIL] },
    ReplyToAddresses: [email],
    Message: {
      Subject: { Data: `[Contact] ${safeSubject}`, Charset: 'UTF-8' },
      Body:    { Text: { Data: bodyText, Charset: 'UTF-8' } },
    },
  }));
}

// ── Route Handlers ─────────────────────────────────────────────────────────

// GET /profile
async function getProfile(db, userId) {
  const r = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
  return r.rows[0] || null;
}

// PUT /profile
async function updateProfile(db, userId, body) {
  const { firstName, lastName, ministerName, churchName, taxYear, designated, designatedSetOn, fairRentalValue } = body;
  // Convert empty strings to null so PostgreSQL DATE/NUMERIC columns don't reject them
  const toStr  = v => (v !== undefined && v !== null && v !== '') ? v : null;
  const toNum  = v => (v !== undefined && v !== null && v !== '') ? parseFloat(v) : null;
  const toInt  = v => (v !== undefined && v !== null && v !== '') ? parseInt(v, 10) : null;
  const r = await db.query(
    `UPDATE users SET
      first_name        = $1,
      last_name         = $2,
      minister_name     = $3,
      church_name       = $4,
      tax_year          = COALESCE($5, tax_year),
      designated        = COALESCE($6, designated),
      designated_set_on = $7,
      fair_rental_value = COALESCE($8, fair_rental_value)
    WHERE id = $9 RETURNING *`,
    [toStr(firstName), toStr(lastName), toStr(ministerName), toStr(churchName),
     toInt(taxYear), toNum(designated), toStr(designatedSetOn) || null, toNum(fairRentalValue), userId]
  );
  return r.rows[0];
}

// GET /expenses
async function getExpenses(db, userId, taxYear) {
  const r = await db.query(
    `SELECT * FROM expenses
     WHERE user_id = $1
       AND ($2::int IS NULL OR EXTRACT(YEAR FROM date) = $2)
     ORDER BY date DESC`,
    [userId, taxYear || null]
  );
  return r.rows;
}

// POST /expenses
async function createExpense(db, userId, body) {
  const { date, categoryId, description, amount, receiptS3Key } = body;
  const r = await db.query(
    `INSERT INTO expenses (user_id, date, category_id, description, amount, receipt_s3_key)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, date, categoryId, description, amount, receiptS3Key || null]
  );
  return r.rows[0];
}

// PUT /expenses/:id
async function updateExpense(db, userId, expenseId, body) {
  const { date, categoryId, description, amount, receiptS3Key } = body;
  const r = await db.query(
    `UPDATE expenses SET
      date            = COALESCE($1, date),
      category_id     = COALESCE($2, category_id),
      description     = COALESCE($3, description),
      amount          = COALESCE($4, amount),
      receipt_s3_key  = COALESCE($5, receipt_s3_key)
    WHERE id = $6 AND user_id = $7 RETURNING *`,
    [date, categoryId, description, amount, receiptS3Key || null, expenseId, userId]
  );
  return r.rows[0];
}

// DELETE /expenses/:id
async function deleteExpense(db, userId, expenseId) {
  await db.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2', [expenseId, userId]);
  return { deleted: true };
}

// GET /documents
async function getDocuments(db, userId) {
  const r = await db.query(
    'SELECT * FROM documents WHERE user_id = $1 ORDER BY date DESC',
    [userId]
  );
  return r.rows;
}

// POST /documents/upload-url — get a presigned S3 URL to upload a file
async function getUploadUrl(userId, fileName, contentType) {
  const key = `users/${userId}/receipts/${Date.now()}-${fileName}`;
  const cmd = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
  const url = await getSignedUrl(S3, cmd, { expiresIn: 300 });
  return { uploadUrl: url, s3Key: key };
}

// DELETE /documents/:id
async function deleteDocument(db, userId, docId) {
  const r = await db.query(
    'DELETE FROM documents WHERE id = $1 AND user_id = $2 RETURNING s3_key',
    [docId, userId]
  );
  // Optionally delete from S3 too (best-effort, don't fail if it errors)
  if (r.rows[0]?.s3_key && BUCKET) {
    try {
      await S3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: r.rows[0].s3_key }));
    } catch (_) {}
  }
  return { deleted: true };
}

// POST /documents — record a file after it has been uploaded to S3
async function createDocument(db, userId, body) {
  const { fileName, s3Key, sizeBytes, category } = body;
  const r = await db.query(
    `INSERT INTO documents (user_id, name, s3_key, size_bytes, category, kind, date)
     VALUES ($1, $2, $3, $4, $5, 'receipt', CURRENT_DATE) RETURNING *`,
    [userId, fileName, s3Key, sizeBytes || 0, category || 'other']
  );
  return r.rows[0];
}

// GET /subscription
async function getSubscription(db, userId) {
  const r = await db.query('SELECT * FROM subscriptions WHERE user_id = $1', [userId]);
  if (r.rows.length === 0) {
    // Create default trial subscription
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 90);
    const created = await db.query(
      `INSERT INTO subscriptions (user_id, plan, status, trial_end)
       VALUES ($1, 'trial', 'active', $2) RETURNING *`,
      [userId, trialEnd.toISOString().split('T')[0]]
    );
    return created.rows[0];
  }
  return r.rows[0];
}

// GET /invoices
async function getInvoices(db, userId) {
  const r = await db.query(
    'SELECT * FROM invoices WHERE user_id = $1 ORDER BY date DESC',
    [userId]
  );
  return r.rows;
}

// ── Main Handler ───────────────────────────────────────────────────────────

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.requestContext?.http?.method === 'OPTIONS' || event.httpMethod === 'OPTIONS') {
    return resp(200, {});
  }

  const method = event.requestContext?.http?.method || event.httpMethod;
  const rawPath = event.requestContext?.http?.path || event.path || '/';
  // Strip leading /api if present
  const path = rawPath.replace(/^\/api/, '');

  // ── Public routes (no auth required) ──
  const method0 = event.requestContext?.http?.method || event.httpMethod;
  const rawPath0 = (event.requestContext?.http?.path || event.path || '/').replace(/^\/api/, '');

  if (method0 === 'POST' && rawPath0 === '/contact') {
    let db0;
    try {
      const b = event.body ? JSON.parse(event.body) : {};
      const { name, email, subject, message } = b;
      if (!name || !email || !message) return resp(400, { error: 'Name, email, and message are required.' });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return resp(400, { error: 'Please enter a valid email address.' });
      if (message.length > 5000) return resp(400, { error: 'Message is too long.' });

      // Save to database
      db0 = await getDb();
      const saved = await db0.query(
        `INSERT INTO contacts (name, email, subject, message)
         VALUES ($1, $2, $3, $4) RETURNING id, created_at`,
        [name, email, subject || 'General Inquiry', message]
      );
      const contactId = saved.rows[0].id;

      // Send email notification
      await sendContactEmail({ name, email, subject, message });

      return resp(200, { ok: true, id: contactId });
    } catch (e) {
      console.error('Contact form error:', e);
      return resp(500, { error: 'Failed to send message. Please try again.' });
    } finally {
      if (db0) await db0.end();
    }
  }

  let db;
  try {
    // Verify auth token
    let cognitoSub, userEmail;
    try {
      cognitoSub = await verifyToken(event);
      userEmail  = event.requestContext?.authorizer?.jwt?.claims?.email || '';
    } catch (e) {
      return resp(401, { error: 'Unauthorized' });
    }

    db = await getDb();
    const user = await getOrCreateUser(db, cognitoSub, userEmail);
    const userId = user.id;
    const body = event.body ? JSON.parse(event.body) : {};
    const params = event.pathParameters || {};
    const qs = event.queryStringParameters || {};

    // ── Routes ──
    if (method === 'GET'  && path === '/profile')          return resp(200, await getProfile(db, userId));
    if (method === 'PUT'  && path === '/profile')          return resp(200, await updateProfile(db, userId, body));

    if (method === 'GET'  && path === '/expenses')         return resp(200, await getExpenses(db, userId, qs.taxYear));
    if (method === 'POST' && path === '/expenses')         return resp(201, await createExpense(db, userId, body));
    if (method === 'PUT'  && path.startsWith('/expenses/')) return resp(200, await updateExpense(db, userId, params.id || path.split('/')[2], body));
    if (method === 'DELETE' && path.startsWith('/expenses/')) return resp(200, await deleteExpense(db, userId, params.id || path.split('/')[2]));

    if (method === 'GET'    && path === '/documents')              return resp(200, await getDocuments(db, userId));
    if (method === 'POST'   && path === '/documents/upload-url')  return resp(200, await getUploadUrl(userId, body.fileName, body.contentType));
    if (method === 'POST'   && path === '/documents')             return resp(201, await createDocument(db, userId, body));
    if (method === 'DELETE' && path.startsWith('/documents/'))    return resp(200, await deleteDocument(db, userId, params.id || path.split('/')[2]));

    if (method === 'GET'  && path === '/subscription')     return resp(200, await getSubscription(db, userId));
    if (method === 'GET'  && path === '/invoices')         return resp(200, await getInvoices(db, userId));

    return resp(404, { error: 'Route not found', path, method });

  } catch (err) {
    console.error('Handler error:', err);
    return resp(500, { error: err.message });
  } finally {
    if (db) await db.end();
  }
};
