// Extra screens — Bank Accounts, Documents, Billing

// ─────────────────────────────────────────────────────────────────────────
// Bank Accounts (Plaid)
// ─────────────────────────────────────────────────────────────────────────
function BankAccounts({ banks, pendingTxns, onAddExpenses }) {
  const [selected, setSelected] = React.useState(new Set([pendingTxns[0]?.id, pendingTxns[2]?.id, pendingTxns[5]?.id].filter(Boolean)));
  const [cats, setCats] = React.useState(Object.fromEntries(pendingTxns.map(t => [t.id, t.suggestedCat || 'other'])));
  const [syncing, setSyncing] = React.useState(false);

  const toggle = (id) => {
    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const triggerSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1400);
  };

  const acceptSelected = () => {
    const chosen = pendingTxns
      .filter(t => selected.has(t.id))
      .map(t => ({
        id: 'tx-' + t.id, date: t.date, categoryId: cats[t.id] || 'other',
        description: t.desc, amount: t.amount, source: 'bank',
      }));
    onAddExpenses(chosen);
    setSelected(new Set());
  };

  return (
    <div className="page" data-screen-label="Bank Accounts">
      <div className="page-head">
        <div>
          <div className="page-title">Bank accounts</div>
          <div className="page-sub">
            Connect your accounts through Plaid. Review every imported transaction and confirm which
            ones qualify as housing expenses before they enter your ledger.
          </div>
        </div>
        <button className="btn btn-primary" onClick={triggerSync}>
          <Icon.Refresh /> {syncing ? 'Syncing…' : 'Sync now'}
        </button>
      </div>

      <div className="banks-grid">
        <div>
          {banks.length === 0 && (
            <div style={{ padding: '18px 20px', background: 'var(--card)', border: '1px solid var(--hairline)', borderRadius: 10, marginBottom: 10, color: 'var(--ink-3)', fontSize: 13, textAlign: 'center' }}>
              No bank accounts connected yet. Use the button below to link your first account.
            </div>
          )}
          {banks.map(b => (
            <div className="bank-card" key={b.id}>
              <div className="bank-logo" style={{ background: b.color }}>{b.initial}</div>
              <div className="bank-body">
                <div className="name">{b.name}</div>
                <div className="meta">{b.accountType} · Last synced {b.lastSync}</div>
              </div>
              <span className="bank-status"><span className="dot" /> Connected</span>
              <button className="btn btn-icon" aria-label="Disconnect"><Icon.Cross /></button>
            </div>
          ))}
          <div className="connect-card" style={{ marginTop: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--brass)', fontFamily: 'var(--serif)', fontSize: 16 }}>
              <Icon.Link /> Connect a new account
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: '8px 0 14px', lineHeight: 1.5, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
              Plaid will open a secure window to link your bank. Clergy Housing never sees your password.
            </p>
            <button className="btn btn-brass"><Icon.Plus /> Connect via Plaid</button>
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ width: 16, height: 16, display: 'inline-flex', flexShrink: 0 }}><Icon.ShieldCheck /></span>
              <strong style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 500 }}>How bank sync works</strong>
            </div>
            <ol style={{ paddingLeft: 18, margin: 0, fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.65 }}>
              <li>Plaid securely links your bank, read-only.</li>
              <li>New transactions appear in your review queue.</li>
              <li>You confirm which qualify before they're added.</li>
              <li>Nothing is logged automatically — every entry is intentional.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Transaction review */}
      {pendingTxns.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--ink-3)', fontSize: 13, background: 'var(--card)', border: '1px solid var(--hairline)', borderRadius: 12, marginTop: 16 }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 15, color: 'var(--ink-2)', marginBottom: 6 }}>No transactions to review</div>
          Connect a bank account above and sync to see new transactions here.
        </div>
      )}
      {pendingTxns.length > 0 && <div className="txn-review">
        <div className="txn-review-hd">
          <div>
            <h3>Awaiting your review</h3>
            <div className="count">{pendingTxns.length} new transactions from your linked accounts · {selected.size} selected</div>
          </div>
          <button className="btn btn-primary" disabled={selected.size === 0} onClick={acceptSelected}>
            <Icon.Check /> Add {selected.size} to ledger
          </button>
        </div>

        {pendingTxns.map(t => {
          const cat = CAT_BY_ID[cats[t.id]] || CAT_BY_ID.other;
          const on = selected.has(t.id);
          return (
            <div className={'txn-row' + (on ? ' qualified' : '')} key={t.id}>
              <input className="ck" type="checkbox" checked={on} onChange={() => toggle(t.id)} />
              <div style={{ fontFamily: 'var(--serif)', fontSize: 13, color: 'var(--ink)' }}>
                {fmtDateNumeric(t.date)}
              </div>
              <div>
                <div style={{ fontSize: 13.5, color: 'var(--ink)', marginBottom: 2 }}>{t.desc}</div>
                <div className="txn-bank-pill"><Icon.Bank /> {t.bank}</div>
              </div>
              <div>
                <select className="select" style={{ fontSize: 12 }} value={cats[t.id] || 'other'}
                        onChange={e => setCats(prev => ({ ...prev, [t.id]: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="txn-amt">{fmtMoney(t.amount)}</div>
            </div>
          );
        })}
      </div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Documents & Receipts
// ─────────────────────────────────────────────────────────────────────────
function Documents({ documents, onDocumentUploaded, onDocumentDeleted }) {
  const [view, setView] = React.useState('grid');
  const [year, setYear] = React.useState(new Date().getFullYear().toString());
  const [uploading, setUploading] = React.useState(false);
  const [deleting, setDeleting] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const handleDelete = async (doc) => {
    if (!confirm(`Delete "${doc.name}"? This cannot be undone.`)) return;
    setDeleting(doc.id);
    try {
      await API.deleteDocument(doc.id);
      if (onDocumentDeleted) onDocumentDeleted(doc.id);
    } catch (err) {
      alert('Could not delete: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { uploadUrl, s3Key } = await API.getUploadUrl(file.name, file.type);
      const s3Res = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      if (!s3Res.ok) throw new Error('S3 upload failed (' + s3Res.status + ')');
      const doc = await API.createDocument({ fileName: file.name, s3Key, sizeBytes: file.size, category: 'receipts' });
      if (onDocumentUploaded) onDocumentUploaded(doc);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // group by category
  const byCat = {};
  documents.forEach(d => {
    const key = d.category;
    (byCat[key] = byCat[key] || []).push(d);
  });
  const totalSize = documents.reduce((s, d) => s + d.size, 0);
  const limitMB = 1024;
  const usedMB = totalSize / 1024 / 1024;

  const catLabel = (key) => {
    if (key === 'reports') return 'Tax Reports';
    if (key === 'receipts') return 'Receipts';
    return CAT_BY_ID[key]?.name || 'Other';
  };

  return (
    <div className="page" data-screen-label="Documents">
      <div className="page-head">
        <div>
          <div className="page-title">Documents & receipts</div>
          <div className="page-sub">Every uploaded receipt and exported report, organized by tax year and category. Stored encrypted in AWS S3.</div>
        </div>
        <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileChange}
               accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx" />
        <button className="btn btn-primary" onClick={handleUploadClick} disabled={uploading}>
          <Icon.Upload /> {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </div>

      <div className="docs-toolbar">
        <select className="select" value={year} onChange={e => setYear(e.target.value)}>
          <option value="2025">Tax Year 2025</option>
          <option value="2024">Tax Year 2024</option>
        </select>
        <div className="search-input" style={{ maxWidth: 280 }}>
          <Icon.Search />
          <input className="input" type="text" placeholder="Search files…" />
        </div>
        <div className="meta" style={{ textAlign: 'right' }}>
          <div><span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{fmtSize(totalSize)}</span> of {limitMB} MB used</div>
          <div className="storage-bar"><i style={{ width: (usedMB / limitMB * 100).toFixed(1) + '%' }} /></div>
        </div>
      </div>

      {documents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--ink-3)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--paper-2)', border: '1px solid var(--hairline)', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
            <Icon.Doc />
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 16, color: 'var(--ink-2)', marginBottom: 6 }}>No documents yet</div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            Upload receipts using the button above, or attach them directly<br />to individual expenses in your ledger.
          </div>
        </div>
      ) : Object.entries(byCat).map(([cat, docs]) => (
        <div className="doc-section" key={cat}>
          <h3>
            <span>{catLabel(cat)}</span>
            <span style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--sans)' }}>{docs.length} file{docs.length === 1 ? '' : 's'}</span>
          </h3>
          <div className="doc-grid">
            {docs.map(d => (
              <div className="doc" key={d.id}>
                <div className="doc-thumb">
                  {d.kind === 'report' ? (
                    <>
                      <span className="ribbon">Report</span>
                      <svg viewBox="0 0 24 24" className="glyph" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h8l4 4v14H7Z" /><path d="M15 3v4h4" /><path d="M10 12h6M10 16h6M10 8h2" /></svg>
                    </>
                  ) : d.name.endsWith('.jpg') || d.name.endsWith('.png') ? (
                    <Icon.Image />
                  ) : (
                    <div className="receipt-slip" />
                  )}
                </div>
                <div className="doc-body">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4 }}>
                    <div className="doc-name" style={{ flex: 1 }}>{d.name}</div>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(d); }}
                      disabled={deleting === d.id}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', padding: '0 2px', lineHeight: 1, flexShrink: 0 }}
                      title="Delete file"
                      aria-label="Delete file">
                      {deleting === d.id ? '…' : '×'}
                    </button>
                  </div>
                  <div className="doc-meta">
                    <span>{fmtDateShort(d.date)}</span><i />
                    <span>{fmtSize(d.size)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Billing
// ─────────────────────────────────────────────────────────────────────────
function Billing({ subscription, invoices = [], onSubscribe }) {
  return (
    <div className="page" data-screen-label="Billing">
      <div className="page-head">
        <div>
          <div className="page-title">Subscription & Billing</div>
          <div className="page-sub">Manage your Clergy Housing plan. Payments are processed securely by Stripe.</div>
        </div>
      </div>

      {/* Current status banner */}
      <div className="card" style={{ padding: '22px 26px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(168,133,66,.14)', border: '1px solid rgba(168,133,66,.3)', display: 'grid', placeItems: 'center', color: 'var(--brass)' }}>
          <Icon.Sparkle />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 18, marginBottom: 2 }}>
            {subscription.plan === 'trial' ? 'Free trial' : subscription.plan === 'monthly' ? 'Monthly plan' : 'Annual plan'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
            {subscription.plan === 'trial'
              ? <>{subscription.daysLeft} days remaining · Trial ends {fmtDateLong(subscription.trialEnd)}</>
              : <>Renews {fmtDateLong(subscription.nextBilling)} · ${subscription.amount.toFixed(2)} {subscription.plan === 'annual' ? 'per year' : 'per month'}</>}
          </div>
        </div>
        <button className="btn btn-secondary" disabled title="Online billing coming soon — contact support@clergyhousing.com to subscribe"><Icon.External /> Manage billing</button>
      </div>

      <div className="plan-grid">
        {PLANS.map(p => {
          const isCurrent = p.id === subscription.plan;
          return (
            <div key={p.id} className={'plan' + (p.featured ? ' featured' : '')}>
              {p.featured && <div className="plan-tag">Best value</div>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-desc">{p.desc}</div>
              <div className="plan-price">${p.price}<span className="unit">{p.unit}</span></div>
              {p.save && <div className="plan-save">{p.save}</div>}
              {!p.save && <div className="plan-save" style={{ visibility: 'hidden' }}>—</div>}
              <ul className="plan-feat">
                {p.feats.map(f => <li key={f}><Icon.Check />{f}</li>)}
              </ul>
              <div className="plan-cta">
                {isCurrent ? (
                  <button className="btn btn-secondary" disabled style={{ opacity: .65 }}>Current plan</button>
                ) : p.id === 'trial' ? (
                  <button className="btn btn-secondary" disabled style={{ opacity: .65 }}>Current plan</button>
                ) : (
                  <button className={'btn ' + (p.featured ? 'btn-brass' : 'btn-primary')}
                          onClick={() => alert('To subscribe, please contact us at support@clergyhousing.com — online payments coming soon!')}>
                    Upgrade
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="billing-grid">
        <div className="card" style={{ padding: 0 }}>
          <div className="card-hd"><h3>Billing history</h3><span className="meta">Stripe-issued</span></div>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--ink-3)', padding: '28px 0', fontSize: 13 }}>
                    No invoices yet. Charges will appear here once you subscribe.
                  </td>
                </tr>
              ) : invoices.map(i => (
                <tr key={i.id}>
                  <td>{fmtDateNumeric(i.date)}</td>
                  <td>{i.plan || i.description}</td>
                  <td>${(parseFloat(i.amount) || 0).toFixed(2)}</td>
                  <td>
                    <span className={'status-pill' + (i.status === 'failed' ? ' failed' : '')}>
                      <span className="dot" />
                      {i.status === 'paid' ? 'Paid' : 'Failed'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-icon" aria-label="Download invoice"><Icon.Download /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div className="payment-method">
            <div style={{ fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>
              Payment method
            </div>
            <div style={{ border: '1px dashed var(--hairline-2)', borderRadius: 10, padding: '22px 16px', textAlign: 'center', marginBottom: 14 }}>
              <div style={{ color: 'var(--ink-3)', fontSize: 13, marginBottom: 6 }}>No payment method on file.</div>
              <div style={{ color: 'var(--ink-3)', fontSize: 12 }}>Add a card to subscribe when your trial ends.</div>
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              <Icon.Card /> Add payment method
            </button>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 16, height: 16, display: 'inline-flex', flexShrink: 0 }}><Icon.Lock /></span> Card details are stored by Stripe, never on our servers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Year History & Comparison
// ─────────────────────────────────────────────────────────────────────────

const DEV_HISTORY_EXPENSES = {
  2023: [
    { id:'y23_01', date:'2023-01-04', categoryId:'mortgage',  description:'January mortgage',            amount:1642.50 },
    { id:'y23_02', date:'2023-02-04', categoryId:'mortgage',  description:'February mortgage',           amount:1642.50 },
    { id:'y23_03', date:'2023-03-04', categoryId:'mortgage',  description:'March mortgage',              amount:1642.50 },
    { id:'y23_04', date:'2023-04-04', categoryId:'mortgage',  description:'April mortgage',              amount:1642.50 },
    { id:'y23_05', date:'2023-05-04', categoryId:'mortgage',  description:'May mortgage',                amount:1642.50 },
    { id:'y23_06', date:'2023-06-04', categoryId:'mortgage',  description:'June mortgage',               amount:1642.50 },
    { id:'y23_07', date:'2023-07-04', categoryId:'mortgage',  description:'July mortgage',               amount:1642.50 },
    { id:'y23_08', date:'2023-08-04', categoryId:'mortgage',  description:'August mortgage',             amount:1642.50 },
    { id:'y23_09', date:'2023-09-04', categoryId:'mortgage',  description:'September mortgage',          amount:1642.50 },
    { id:'y23_10', date:'2023-10-04', categoryId:'mortgage',  description:'October mortgage',            amount:1642.50 },
    { id:'y23_11', date:'2023-11-04', categoryId:'mortgage',  description:'November mortgage',           amount:1642.50 },
    { id:'y23_12', date:'2023-12-04', categoryId:'mortgage',  description:'December mortgage',           amount:1642.50 },
    { id:'y23_13', date:'2023-02-15', categoryId:'utilities', description:'Duke Energy — electric',     amount:156.40 },
    { id:'y23_14', date:'2023-05-15', categoryId:'utilities', description:'Duke Energy — electric',     amount:134.20 },
    { id:'y23_15', date:'2023-08-15', categoryId:'utilities', description:'Duke Energy — electric',     amount:198.60 },
    { id:'y23_16', date:'2023-11-15', categoryId:'utilities', description:'Duke Energy — electric',     amount:162.30 },
    { id:'y23_17', date:'2023-03-20', categoryId:'utilities', description:'City Water & Sewer',         amount:84.10 },
    { id:'y23_18', date:'2023-09-20', categoryId:'utilities', description:'City Water & Sewer',         amount:79.80 },
    { id:'y23_19', date:'2023-04-01', categoryId:'insurance', description:'State Farm — homeowners Q1', amount:558.00 },
    { id:'y23_20', date:'2023-07-01', categoryId:'insurance', description:'State Farm — homeowners Q2', amount:558.00 },
    { id:'y23_21', date:'2023-10-01', categoryId:'insurance', description:'State Farm — homeowners Q3', amount:558.00 },
    { id:'y23_22', date:'2023-09-30', categoryId:'tax',       description:'Pickens County property tax',amount:1380.00 },
    { id:'y23_23', date:'2023-06-14', categoryId:'repairs',   description:'HVAC annual service',        amount:340.00 },
    { id:'y23_24', date:'2023-10-22', categoryId:'repairs',   description:'Gutter cleaning & repair',   amount:285.00 },
  ],
  2024: [
    { id:'y24_01', date:'2024-01-04', categoryId:'mortgage',  description:'January mortgage',            amount:1742.50 },
    { id:'y24_02', date:'2024-02-04', categoryId:'mortgage',  description:'February mortgage',           amount:1742.50 },
    { id:'y24_03', date:'2024-03-04', categoryId:'mortgage',  description:'March mortgage',              amount:1742.50 },
    { id:'y24_04', date:'2024-04-04', categoryId:'mortgage',  description:'April mortgage',              amount:1742.50 },
    { id:'y24_05', date:'2024-05-04', categoryId:'mortgage',  description:'May mortgage',                amount:1742.50 },
    { id:'y24_06', date:'2024-06-04', categoryId:'mortgage',  description:'June mortgage',               amount:1742.50 },
    { id:'y24_07', date:'2024-07-04', categoryId:'mortgage',  description:'July mortgage',               amount:1742.50 },
    { id:'y24_08', date:'2024-08-04', categoryId:'mortgage',  description:'August mortgage',             amount:1742.50 },
    { id:'y24_09', date:'2024-09-04', categoryId:'mortgage',  description:'September mortgage',          amount:1742.50 },
    { id:'y24_10', date:'2024-10-04', categoryId:'mortgage',  description:'October mortgage',            amount:1742.50 },
    { id:'y24_11', date:'2024-11-04', categoryId:'mortgage',  description:'November mortgage',           amount:1742.50 },
    { id:'y24_12', date:'2024-12-04', categoryId:'mortgage',  description:'December mortgage',           amount:1742.50 },
    { id:'y24_13', date:'2024-01-22', categoryId:'utilities', description:'Duke Energy — electric',     amount:178.40 },
    { id:'y24_14', date:'2024-04-22', categoryId:'utilities', description:'Duke Energy — electric',     amount:142.60 },
    { id:'y24_15', date:'2024-07-22', categoryId:'utilities', description:'Duke Energy — electric',     amount:214.80 },
    { id:'y24_16', date:'2024-10-22', categoryId:'utilities', description:'Duke Energy — electric',     amount:184.27 },
    { id:'y24_17', date:'2024-02-18', categoryId:'utilities', description:'City Water & Sewer',         amount:88.40 },
    { id:'y24_18', date:'2024-08-18', categoryId:'utilities', description:'City Water & Sewer',         amount:92.10 },
    { id:'y24_19', date:'2024-01-01', categoryId:'insurance', description:'State Farm — homeowners Q1', amount:582.00 },
    { id:'y24_20', date:'2024-04-01', categoryId:'insurance', description:'State Farm — homeowners Q2', amount:582.00 },
    { id:'y24_21', date:'2024-07-01', categoryId:'insurance', description:'State Farm — homeowners Q3', amount:582.00 },
    { id:'y24_22', date:'2024-10-01', categoryId:'insurance', description:'State Farm — homeowners Q4', amount:582.00 },
    { id:'y24_23', date:'2024-09-30', categoryId:'tax',       description:'Pickens County property tax',amount:1430.00 },
    { id:'y24_24', date:'2024-03-15', categoryId:'repairs',   description:'Roof inspection & repair',   amount:780.00 },
    { id:'y24_25', date:'2024-07-08', categoryId:'repairs',   description:'HVAC annual service',        amount:365.00 },
    { id:'y24_26', date:'2024-05-20', categoryId:'furnish',   description:'Replacement refrigerator',   amount:1248.00 },
    { id:'y24_27', date:'2024-09-14', categoryId:'yard',      description:'Greenbrier HOA — Q3',        amount:285.00 },
  ],
};

function YearHistory({ settings, expenses: currentExpenses, onGoReport }) {
  const currentYear = Number(settings.taxYear);
  const years = [currentYear - 2, currentYear - 1, currentYear];
  const isDevMode = window.location.hostname === 'localhost';

  const [expensesByYear, setExpensesByYear] = React.useState({ [currentYear]: currentExpenses });
  const [loading, setLoading] = React.useState(true);
  const [modal, setModal] = React.useState(null);       // { year, initial }
  const [reportYear, setReportYear] = React.useState(null); // prior year to print
  const [importYear, setImportYear] = React.useState(null); // prior year for CSV import

  React.useEffect(() => {
    const load = async () => {
      if (isDevMode && !Auth.isLoggedIn()) {
        const vals = Object.values(DEV_HISTORY_EXPENSES);
        setExpensesByYear({
          [currentYear - 2]: DEV_HISTORY_EXPENSES[currentYear - 2] || vals[0] || [],
          [currentYear - 1]: DEV_HISTORY_EXPENSES[currentYear - 1] || vals[1] || [],
          [currentYear]: currentExpenses,
        });
        setLoading(false);
        return;
      }
      try {
        const norm = (list) => (list || []).map(e => ({
          id: e.id,
          date: e.date ? e.date.toString().split('T')[0] : '',
          categoryId: e.category_id,
          description: e.description,
          amount: parseFloat(e.amount),
        }));
        const [p2, p1] = await Promise.all([
          API.getExpenses(currentYear - 2).catch(() => []),
          API.getExpenses(currentYear - 1).catch(() => []),
        ]);
        setExpensesByYear({
          [currentYear - 2]: norm(p2),
          [currentYear - 1]: norm(p1),
          [currentYear]: currentExpenses,
        });
      } catch (_) {}
      finally { setLoading(false); }
    };
    load();
  }, [currentYear]);

  const handleSave = async (year, data, isEdit) => {
    if (isDevMode && !Auth.isLoggedIn()) {
      setExpensesByYear(prev => {
        const list = prev[year] || [];
        if (isEdit) {
          return { ...prev, [year]: list.map(e => e.id === data.id ? data : e) };
        }
        return { ...prev, [year]: [{ ...data, id: 'h_' + Date.now() }, ...list] };
      });
      setModal(null);
      return;
    }
    try {
      if (isEdit) {
        await API.updateExpense(data.id, {
          date: data.date, categoryId: data.categoryId,
          description: data.description, amount: data.amount,
        });
        setExpensesByYear(prev => ({ ...prev, [year]: (prev[year] || []).map(e => e.id === data.id ? data : e) }));
      } else {
        const created = await API.createExpense({
          date: data.date, categoryId: data.categoryId,
          description: data.description, amount: data.amount,
        });
        setExpensesByYear(prev => ({ ...prev, [year]: [{ ...data, id: created.id }, ...(prev[year] || [])] }));
      }
    } catch (err) { alert('Error saving expense: ' + (err.message || err)); }
    setModal(null);
  };

  const handleDelete = async (year, id) => {
    if (isDevMode && !Auth.isLoggedIn()) {
      setExpensesByYear(prev => ({ ...prev, [year]: (prev[year] || []).filter(e => e.id !== id) }));
      setModal(null);
      return;
    }
    try { await API.deleteExpense(id); } catch (_) { alert('Error deleting expense.'); return; }
    setExpensesByYear(prev => ({ ...prev, [year]: (prev[year] || []).filter(e => e.id !== id) }));
    setModal(null);
  };

  const handleImport = async (year, rows) => {
    const now = Date.now();
    if (isDevMode && !Auth.isLoggedIn()) {
      setExpensesByYear(prev => ({
        ...prev,
        [year]: [...rows.map((r, i) => ({ ...r, id: `csv_${now}_${i}` })), ...(prev[year] || [])],
      }));
      setImportYear(null);
      return;
    }
    try {
      const created = await Promise.all(rows.map(r => API.createExpense({
        date: r.date, categoryId: r.categoryId,
        description: r.description, amount: r.amount,
      })));
      setExpensesByYear(prev => ({
        ...prev,
        [year]: [...created.map((c, i) => ({ ...rows[i], id: c.id })), ...(prev[year] || [])],
      }));
    } catch (err) { alert('Import failed: ' + (err.message || err)); }
    setImportYear(null);
  };

  const totals = years.map(y => (expensesByYear[y] || []).reduce((s, e) => s + e.amount, 0));

  // Prior-year report takes over the whole page
  if (reportYear !== null) {
    return (
      <HistoryReportPage
        year={reportYear}
        expenses={expensesByYear[reportYear] || []}
        settings={settings}
        onBack={() => setReportYear(null)}
      />
    );
  }

  return (
    <div className="page" data-screen-label="History">
      <div className="page-head">
        <div>
          <div className="page-title">3-Year History</div>
          <div className="page-sub">Compare your housing allowance across the last three tax years.</div>
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--ink-3)', padding: 48, textAlign: 'center' }}>Loading history…</div>
      ) : (
        <>
          <div className="history-grid">
            {years.map((year, i) => (
              <YearCard key={year}
                year={year}
                expenses={expensesByYear[year] || []}
                settings={year === currentYear ? settings : null}
                isCurrent={year === currentYear}
                prevTotal={i > 0 ? totals[i - 1] : null}
                ownTotal={totals[i]}
                onAddExpense={() => setModal({ year, initial: null })}
                onImportCsv={() => setImportYear(year)}
                onEditExpense={(exp) => setModal({ year, initial: exp })}
                onPrintReport={year === currentYear ? onGoReport : () => setReportYear(year)}
              />
            ))}
          </div>
          <CategoryComparisonTable years={years} expensesByYear={expensesByYear} />
        </>
      )}

      {importYear !== null && (
        <CsvImportModal
          taxYear={importYear}
          onImport={rows => handleImport(importYear, rows)}
          onClose={() => setImportYear(null)}
        />
      )}

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet-head">
              <span>{modal.initial ? 'Edit expense' : 'Add expense'} — {modal.year}</span>
              <button className="btn btn-ghost btn-icon" onClick={() => setModal(null)}>
                <Icon.X />
              </button>
            </div>
            <ExpenseForm2
              initial={modal.initial}
              taxYear={modal.year}
              onSave={data => handleSave(modal.year, data, !!modal.initial)}
              onCancel={() => setModal(null)}
              onDelete={modal.initial ? () => handleDelete(modal.year, modal.initial.id) : null}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function YearCard({ year, expenses, settings, isCurrent, prevTotal, ownTotal, onAddExpense, onImportCsv, onEditExpense, onPrintReport }) {
  const designated   = settings?.designated     || null;
  const frv          = settings?.fairRentalValue || null;
  const exclusion    = (designated && frv) ? Math.min(designated, ownTotal, frv) : null;
  const remaining    = designated ? Math.max(0, designated - ownTotal) : null;
  const delta        = (prevTotal && prevTotal > 0)
    ? ((ownTotal - prevTotal) / prevTotal) * 100 : null;

  const [listOpen, setListOpen] = React.useState(false);

  const byCategory = {};
  expenses.forEach(e => { byCategory[e.categoryId] = (byCategory[e.categoryId] || 0) + e.amount; });
  const topCats    = Object.entries(byCategory).sort(([,a],[,b]) => b - a).slice(0, 5);
  const maxCatAmt  = topCats[0]?.[1] || 1;
  const parts      = fmtMoneyParts(ownTotal);
  const sorted     = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className={`card history-card${isCurrent ? ' history-card-current' : ''}`}>
      <div className="history-card-head">
        <span className="history-year-label">{year}</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {isCurrent
            ? <span className="history-current-badge">Current</span>
            : <>
                <button className="btn btn-xs btn-ghost" onClick={onAddExpense}>+ Add</button>
                <button className="btn btn-xs btn-ghost" onClick={onImportCsv}>+ Import</button>
              </>
          }
          <button className="btn btn-xs btn-secondary" onClick={onPrintReport} title={`Print ${year} tax report`}>
            <Icon.Print /> Report
          </button>
        </div>
      </div>

      <div className="history-total">
        {parts.whole}<span className="history-cents">{parts.cents}</span>
      </div>
      <div className="history-total-sub">
        total logged · {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
        {delta !== null && (
          <span className={'history-delta ' + (delta >= 0 ? 'up' : 'down')}>
            {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
          </span>
        )}
      </div>

      <div className="history-stats">
        {isCurrent && designated ? (
          <>
            <div className="history-stat-row"><span>Designated</span><span>{fmtMoney(designated)}</span></div>
            <div className="history-stat-row">
              <span>Remaining</span>
              <span style={{ color: remaining < 1000 ? 'var(--brass)' : undefined }}>{fmtMoney(remaining)}</span>
            </div>
            {exclusion !== null && (
              <div className="history-stat-row">
                <span>Est. exclusion</span>
                <span style={{ color: 'var(--forest-3)', fontWeight: 600 }}>{fmtMoney(exclusion)}</span>
              </div>
            )}
          </>
        ) : (
          <div style={{ fontSize: 11.5, color: 'var(--ink-4)', fontStyle: 'italic', padding: '6px 0' }}>
            Designated amount not on record
          </div>
        )}
      </div>

      {topCats.length > 0 && (
        <div className="history-cats">
          <div className="history-cats-label">Top categories</div>
          {topCats.map(([catId, amount]) => {
            const cat = CAT_BY_ID[catId];
            return (
              <div className="history-cat-row" key={catId}>
                <div className="history-cat-name">{cat?.emoji} {cat?.name || catId}</div>
                <div className="history-cat-bar-wrap">
                  <div className="history-cat-bar" style={{ width: ((amount / maxCatAmt) * 100) + '%' }} />
                </div>
                <div className="history-cat-amt">{fmtMoney(amount)}</div>
              </div>
            );
          })}
        </div>
      )}

      {!isCurrent && expenses.length > 0 && (
        <div className="history-card-footer">
          <button className="btn btn-ghost btn-xs history-list-toggle" onClick={() => setListOpen(o => !o)}>
            {listOpen ? 'Hide' : 'View all'} {expenses.length} expenses
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ width: 12, height: 12, marginLeft: 4, transform: listOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {listOpen && (
            <div className="history-expense-list">
              {sorted.map(e => {
                const cat = CAT_BY_ID[e.categoryId];
                return (
                  <button key={e.id} className="history-expense-row" onClick={() => onEditExpense(e)}>
                    <span className="history-expense-cat">{cat?.emoji}</span>
                    <span className="history-expense-desc">{e.description || cat?.name}</span>
                    <span className="history-expense-date">{fmtDateShort(e.date)}</span>
                    <span className="history-expense-amt">{fmtMoney(e.amount)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HistoryReportPage({ year, expenses, settings, onBack }) {
  const [designatedStr, setDesignatedStr] = React.useState('');
  const [frvStr, setFrvStr] = React.useState('');

  const designated = parseFloat(designatedStr.replace(/[^\d.]/g, '')) || 0;
  const frv        = parseFloat(frvStr.replace(/[^\d.]/g, ''))        || 0;
  const hasValues  = designated > 0 && frv > 0;

  const grand     = expenses.reduce((s, e) => s + e.amount, 0);
  const exclusion = hasValues ? Math.min(designated, grand, frv) : null;
  const taxable   = hasValues ? Math.max(0, designated - exclusion) : null;

  const byCat = CATEGORIES.map(c => ({
    ...c,
    items: expenses.filter(e => e.categoryId === c.id).sort((a, b) => a.date.localeCompare(b.date)),
  })).filter(c => c.items.length > 0);

  return (
    <div className="page" data-screen-label="Prior Year Report">
      <div className="page-head no-print">
        <div>
          <div className="page-title">{year} Tax Report</div>
          <div className="page-sub">Year-end housing allowance worksheet for tax year {year}.</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={onBack}>
            ← Back to History
          </button>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Icon.Download /> Export PDF
          </button>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Icon.Print /> Print report
          </button>
        </div>
      </div>

      <div className="card no-print" style={{ padding: 22, marginBottom: 14, background: 'rgba(168,133,66,.06)', borderColor: 'rgba(168,133,66,.3)' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: 12 }}>
          {year} allowance values — used only for this report, not saved
        </div>
        <div className="field-row">
          <div className="field">
            <label>Designated housing allowance ({year})</label>
            <div className="amount-input">
              <span>$</span>
              <input className="input" type="text" inputMode="decimal" placeholder="0.00"
                value={designatedStr}
                onChange={e => setDesignatedStr(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Fair rental value — furnished + utilities ({year})</label>
            <div className="amount-input">
              <span>$</span>
              <input className="input" type="text" inputMode="decimal" placeholder="0.00"
                value={frvStr}
                onChange={e => setFrvStr(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="report-page">
        <div className="report-hd">
          <div className="report-eyebrow">Minister's Housing Allowance · Worksheet</div>
          <div className="report-title">{settings.ministerName}<br/>
            <span style={{ fontSize: 24, color: 'var(--ink-3)' }}>Tax Year {year}</span>
          </div>
        </div>
        <dl className="report-meta">
          <div><dt>Church</dt><dd>{settings.churchName}</dd></div>
          <div><dt>Designated allowance</dt><dd>{designated > 0 ? fmtMoney(designated) : '—'}</dd></div>
          <div><dt>Prepared</dt><dd>{fmtDateLong(new Date().toISOString().slice(0,10))}</dd></div>
        </dl>

        {byCat.map(c => {
          const sub = c.items.reduce((s, e) => s + e.amount, 0);
          return (
            <div className="report-cat" key={c.id}>
              <div className="report-cat-hd">
                <h4>{c.name}</h4>
                <div className="sub-amt">{fmtMoney(sub)}</div>
              </div>
              <table>
                <tbody>
                  {c.items.map(e => (
                    <tr key={e.id}>
                      <td className="d">{fmtDateNumeric(e.date)}</td>
                      <td>{e.description}</td>
                      <td className="a">{fmtMoney(e.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}

        <div className="report-summary">
          <div className="summary-row">
            <span className="label">A. Designated housing allowance</span>
            <span className="val">{designated > 0 ? fmtMoney(designated) : '—'}</span>
          </div>
          <div className="summary-row">
            <span className="label">B. Actual housing expenses (this report)</span>
            <span className="val">{fmtMoney(grand)}</span>
          </div>
          <div className="summary-row">
            <span className="label">C. Fair rental value of home, furnished, + utilities</span>
            <span className="val">{frv > 0 ? fmtMoney(frv) : '—'}</span>
          </div>
          <div className="summary-row exclusion">
            <span className="label"><strong style={{ color: 'var(--ink)', fontFamily: 'var(--serif)' }}>IRS allowable exclusion</strong> · the lesser of A, B, or C</span>
            <span className="val" style={{ fontFamily: 'var(--serif)', fontSize: 17 }}>
              {hasValues
                ? <strong>{fmtMoney(exclusion)}</strong>
                : <span style={{ color: 'var(--ink-4)', fontSize: 13 }}>Enter A and C in the panel above</span>
              }
            </span>
          </div>
          <div className="summary-row grand">
            <span className="label">Taxable portion of allowance</span>
            <span className="val">{hasValues ? fmtMoney(taxable) : '—'}</span>
          </div>
        </div>

        <div className="report-footer">
          Prepared from records kept by {settings.ministerName}. Substantiating receipts retained per IRS requirements.<br/>
          This worksheet is for personal tax preparation; consult a qualified tax professional regarding your individual circumstances.
        </div>
      </div>
    </div>
  );
}

function CategoryComparisonTable({ years, expensesByYear }) {
  const allCatIds = new Set();
  years.forEach(y => (expensesByYear[y] || []).forEach(e => allCatIds.add(e.categoryId)));

  const data = {};
  allCatIds.forEach(catId => {
    data[catId] = {};
    years.forEach(y => {
      data[catId][y] = (expensesByYear[y] || [])
        .filter(e => e.categoryId === catId)
        .reduce((s, e) => s + e.amount, 0);
    });
  });

  const sorted = [...allCatIds].sort((a, b) =>
    years.reduce((s, y) => s + (data[b][y] || 0), 0) -
    years.reduce((s, y) => s + (data[a][y] || 0), 0)
  );
  const yearTotals = years.map(y => (expensesByYear[y] || []).reduce((s, e) => s + e.amount, 0));

  return (
    <div className="card" style={{ marginTop: 14, overflow: 'auto' }}>
      <div style={{ padding: '18px 24px 10px', borderBottom: '1px solid var(--hairline-2)' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 500 }}>Category breakdown</div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>All spending by category across all three years.</div>
      </div>
      <table className="history-table">
        <thead>
          <tr>
            <th>Category</th>
            {years.map(y => <th key={y}>{y}</th>)}
            <th>3-yr total</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(catId => {
            const cat = CAT_BY_ID[catId];
            const total3yr = years.reduce((s, y) => s + (data[catId][y] || 0), 0);
            return (
              <tr key={catId}>
                <td>
                  <span className="history-cat-chip" style={{ background: (cat?.color || '#888') + '22', color: cat?.color || 'var(--ink)' }}>
                    {cat?.emoji} {cat?.name || catId}
                  </span>
                </td>
                {years.map(y => (
                  <td key={y} className="history-table-amt">
                    {data[catId][y] > 0 ? fmtMoney(data[catId][y]) : <span style={{ color: 'var(--ink-4)' }}>—</span>}
                  </td>
                ))}
                <td className="history-table-amt history-table-total">{fmtMoney(total3yr)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td><strong>Total</strong></td>
            {yearTotals.map((t, i) => <td key={i} className="history-table-amt"><strong>{fmtMoney(t)}</strong></td>)}
            <td className="history-table-amt"><strong>{fmtMoney(yearTotals.reduce((s, t) => s + t, 0))}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

Object.assign(window, { BankAccounts, Documents, Billing, YearHistory });
