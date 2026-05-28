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
              <Icon.ShieldCheck /> <strong style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 500 }}>How bank sync works</strong>
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
          <div className="page-title">Subscription & billing</div>
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
              <Icon.Lock /> Card details are stored by Stripe, never on our servers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BankAccounts, Documents, Billing });
