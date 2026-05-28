// Enhanced screens for the full Clergy Housing app

// ─────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────
function Dashboard2({ settings, expenses, subscription, pendingTxns = [], onAdd, onGo }) {
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const designated = settings.designated;
  const remaining = designated - totalSpent;
  const pct = Math.min(100, (totalSpent / designated) * 100);
  const recent = [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const exclusion = Math.min(designated, totalSpent, settings.fairRentalValue);

  const spentParts = fmtMoneyParts(totalSpent);
  const designatedParts = fmtMoneyParts(designated);
  const remainingParts = fmtMoneyParts(remaining);
  const exclusionParts = fmtMoneyParts(exclusion);

  const trialEnding = subscription.plan === 'trial' && subscription.daysLeft <= 30;

  return (
    <div className="page" data-screen-label="Dashboard">
      <div className="page-head">
        <div>
          <div className="page-title">
            {settings.firstName
              ? `${(()=>{const h=new Date().getHours();return h<12?'Good morning':h<17?'Good afternoon':'Good evening'})()}, ${settings.firstName}.`
              : 'Housing Allowance Dashboard'}
          </div>
          <div className="page-sub">Tracking your housing allowance expenses for tax year {settings.taxYear}.</div>
        </div>
        <button className="btn btn-primary" onClick={onAdd}>
          <Icon.Plus /> Add expense
        </button>
      </div>

      {trialEnding && (
        <div className="banner">
          <div className="banner-icon"><Icon.Sparkle /></div>
          <div className="banner-body">
            <strong>{subscription.daysLeft} days left in your free trial.</strong>{' '}
            Subscribe to keep adding expenses, syncing your bank, and exporting reports past {fmtDateLong(subscription.trialEnd)}.
          </div>
          <button className="btn btn-brass" onClick={() => onGo('billing')}>Choose a plan</button>
        </div>
      )}

      {/* Top stats */}
      <div className="stat-grid">
        <div className="card stat feature">
          <div className="stat-label">Designated allowance · {settings.taxYear}</div>
          <div className="stat-val">
            {designatedParts.whole}<span className="cents">{designatedParts.cents}</span>
          </div>
          <div className="stat-foot">Set by church board, {settings.designatedSetOn}</div>
        </div>
        <div className="card stat">
          <div className="stat-label">Total logged</div>
          <div className="stat-val">
            {spentParts.whole}<span className="cents">{spentParts.cents}</span>
          </div>
          <div className="stat-foot">{expenses.length} entries · {pct.toFixed(0)}% of allowance</div>
        </div>
        <div className="card stat">
          <div className="stat-label">Remaining balance</div>
          <div className="stat-val" style={{ color: remaining < 0 ? 'var(--plum)' : undefined }}>
            {remaining < 0 ? '–' : ''}{remainingParts.whole}<span className="cents">{remainingParts.cents}</span>
          </div>
          <div className="stat-foot">
            {remaining >= 0 ? 'Available to log further' : <span className="delta-neg">Spent exceeds allowance</span>}
          </div>
        </div>
        <div className="card stat">
          <div className="stat-label">IRS exclusion · estimate</div>
          <div className="stat-val">
            {exclusionParts.whole}<span className="cents">{exclusionParts.cents}</span>
          </div>
          <div className="stat-foot">Lesser of designated, spent, or FRV</div>
        </div>
      </div>

      {/* Progress card */}
      <div className="card progress-card" style={{ marginBottom: 14 }}>
        <div className="progress-head">
          <div>
            <div className="progress-title">Annual exclusion progress</div>
            <div className="page-sub" style={{ marginTop: 2, fontSize: 12.5 }}>
              The IRS housing allowance exclusion is limited to the lesser of designated, actually spent, or fair rental value.
            </div>
          </div>
          <div className="progress-figures">
            {spentParts.whole}<span className="of"> of {designatedParts.whole}</span>
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: pct + '%' }} />
          <div className="progress-marks"><i/><i/><i/><i/></div>
        </div>
        <div className="progress-legend">
          <span>$0</span>
          <span>{fmtMoney(designated * 0.25, { sign: true })}</span>
          <span>{fmtMoney(designated * 0.5, { sign: true })}</span>
          <span>{fmtMoney(designated * 0.75, { sign: true })}</span>
          <span>{fmtMoney(designated, { sign: true })}</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="qa-grid">
        <button className="qa" onClick={onAdd}>
          <div className="qa-icon"><Icon.Plus /></div>
          <div className="qa-body">
            <div className="qa-title">Add expense</div>
            <div className="qa-sub">Log a new housing expense manually</div>
          </div>
          <div className="qa-arrow"><Icon.Chevron /></div>
        </button>
        <button className="qa" onClick={() => onGo('banks')}>
          <div className="qa-icon"><Icon.Bank /></div>
          <div className="qa-body">
            <div className="qa-title">Connect bank</div>
            <div className="qa-sub">
              {pendingTxns.length > 0
                ? `${pendingTxns.length} transaction${pendingTxns.length === 1 ? '' : 's'} awaiting review`
                : 'Import transactions automatically via Plaid'}
            </div>
          </div>
          <div className="qa-arrow"><Icon.Chevron /></div>
        </button>
        <button className="qa" onClick={() => onGo('report')}>
          <div className="qa-icon"><Icon.Report /></div>
          <div className="qa-body">
            <div className="qa-title">Generate report</div>
            <div className="qa-sub">Year-end summary for {settings.taxYear}</div>
          </div>
          <div className="qa-arrow"><Icon.Chevron /></div>
        </button>
      </div>

      {/* Recent + by category */}
      <div className="dash-grid">
        <div className="col">
          <div className="card">
            <div className="card-hd">
              <h3>Recent activity</h3>
              <button className="btn btn-ghost" onClick={() => onGo('log')}>
                See all <Icon.Chevron />
              </button>
            </div>
            <div className="exp-list">
              {recent.map(e => {
                const cat = CAT_BY_ID[e.categoryId];
                const md = fmtDateMonthDay(e.date);
                return (
                  <div className="exp-row" key={e.id}>
                    <div className="exp-date">
                      {md.mon}<strong>{md.day}</strong>
                    </div>
                    <div className="exp-mid">
                      <div className="exp-desc">{e.description}</div>
                      <div className="exp-cat">
                        <span className="dot" style={{ background: cat.color }} />
                        {cat.name}{e.source === 'bank' && <> · <Icon.Bank /> Bank sync</>}
                      </div>
                    </div>
                    <div className="exp-amt">{fmtMoney(e.amount)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col">
          <ByCategory expenses={expenses} />
        </div>
      </div>
    </div>
  );
}

function ByCategory({ expenses }) {
  const catTotals = {};
  expenses.forEach(e => { catTotals[e.categoryId] = (catTotals[e.categoryId] || 0) + e.amount; });
  const cats = Object.entries(catTotals)
    .map(([id, amt]) => ({ ...CAT_BY_ID[id], amt }))
    .sort((a, b) => b.amt - a.amt);
  const catMax = cats[0]?.amt || 1;
  return (
    <div className="card">
      <div className="card-hd">
        <h3>By category</h3>
        <span className="meta">YTD</span>
      </div>
      <div className="cat-list">
        {cats.slice(0, 6).map(c => (
          <div className="cat-row" key={c.id} style={{ color: c.color }}>
            <div className="name">
              <span className="dot" style={{ background: c.color }} />
              <span style={{ color: 'var(--ink)' }}>{c.name}</span>
            </div>
            <div className="amt">{fmtMoney(c.amt)}</div>
            <div className="cat-bar"><i style={{ width: (c.amt / catMax * 100) + '%' }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Expense Log
// ─────────────────────────────────────────────────────────────────────────
function ExpenseLog2({ expenses, onAdd, onEdit, onDelete, onBulkDelete }) {
  const [catFilter, setCatFilter] = React.useState('all');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [q, setQ] = React.useState('');
  const [source, setSource] = React.useState('all');
  const [selected, setSelected] = React.useState(new Set());
  const [page, setPage] = React.useState(1);
  const PER_PAGE = 10;

  const filtered = expenses
    .filter(e => catFilter === 'all' || e.categoryId === catFilter)
    .filter(e => !from || e.date >= from)
    .filter(e => !to || e.date <= to)
    .filter(e => !q || e.description.toLowerCase().includes(q.toLowerCase()))
    .filter(e => source === 'all' || (e.source || 'manual') === source)
    .sort((a, b) => b.date.localeCompare(a.date));

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageStart = (page - 1) * PER_PAGE;
  const paged = filtered.slice(pageStart, pageStart + PER_PAGE);

  React.useEffect(() => { setPage(1); }, [catFilter, from, to, q, source]);

  const total = filtered.reduce((s, e) => s + e.amount, 0);
  const allOnPageSelected = paged.length > 0 && paged.every(e => selected.has(e.id));

  const togglePage = () => {
    setSelected(prev => {
      const n = new Set(prev);
      if (allOnPageSelected) paged.forEach(e => n.delete(e.id));
      else paged.forEach(e => n.add(e.id));
      return n;
    });
  };
  const toggle = (id) => {
    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  return (
    <div className="page" data-screen-label="Expense Log">
      <div className="page-head">
        <div>
          <div className="page-title">Expense ledger</div>
          <div className="page-sub">Every housing expense logged this tax year. Filter, search, or edit entries directly.</div>
        </div>
        <button className="btn btn-primary" onClick={onAdd}>
          <Icon.Plus /> Add expense
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-input">
          <Icon.Search />
          <input className="input" type="text" placeholder="Search description…"
                 value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <span className="label">Category</span>
        <select className="select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji}  {c.name}</option>)}
        </select>
        <span className="label">Source</span>
        <select className="select" value={source} onChange={e => setSource(e.target.value)}>
          <option value="all">All sources</option>
          <option value="manual">Manual</option>
          <option value="bank">Bank synced</option>
        </select>
        <span className="label">From</span>
        <input className="input" type="date" value={from} onChange={e => setFrom(e.target.value)} />
        <span className="label">To</span>
        <input className="input" type="date" value={to} onChange={e => setTo(e.target.value)} />
        {(q || from || to || catFilter !== 'all' || source !== 'all') && (
          <button className="btn btn-ghost" onClick={() => { setQ(''); setFrom(''); setTo(''); setCatFilter('all'); setSource('all'); }}>Reset</button>
        )}
      </div>

      {selected.size > 0 && (
        <div className="filter-bar" style={{ background: 'rgba(110,46,42,.06)', borderColor: 'rgba(110,46,42,.25)' }}>
          <strong style={{ fontSize: 13, color: 'var(--ink-2)' }}>{selected.size} selected</strong>
          <span style={{ flex: 1 }}></span>
          <button className="btn btn-ghost" onClick={() => setSelected(new Set())}>Clear selection</button>
          <button className="btn btn-danger" onClick={() => { onBulkDelete([...selected]); setSelected(new Set()); }}>
            <Icon.Trash /> Delete selected
          </button>
        </div>
      )}

      <div className="card table-card">
        <div className="table-wrap">
          <table className="expenses">
            <thead>
              <tr>
                <th style={{ width: 40 }}><input type="checkbox" className="ck" checked={allOnPageSelected} onChange={togglePage} /></th>
                <th style={{ width: 110 }}>Date</th>
                <th style={{ width: 200 }}>Category</th>
                <th>Description</th>
                <th style={{ width: 110 }}>Source</th>
                <th style={{ width: 70, textAlign: 'center' }}>Receipt</th>
                <th className="right" style={{ width: 120 }}>Amount</th>
                <th className="right" style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr><td colSpan="8">
                  <div className="empty">
                    <div className="glyph">✦</div>
                    No expenses match your filters.
                  </div>
                </td></tr>
              )}
              {paged.map(e => {
                const cat = CAT_BY_ID[e.categoryId];
                const isBank = e.source === 'bank';
                return (
                  <tr key={e.id}>
                    <td><input type="checkbox" className="ck" checked={selected.has(e.id)} onChange={() => toggle(e.id)} /></td>
                    <td className="col-date">{fmtDateNumeric(e.date)}</td>
                    <td>
                      <span className="cat-tag">
                        <span className="cat-emoji">{cat?.emoji}</span>
                        {cat?.name}
                      </span>
                    </td>
                    <td>{e.description}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--ink-3)' }}>
                        {isBank ? <><Icon.Bank /> Bank sync</> : <><Icon.Edit /> Manual</>}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {e.receipt ? (
                        <span title="Receipt attached" style={{ color: 'var(--forest-3)', display: 'inline-flex', width: 18, height: 18 }}>
                          <Icon.Receipt width={18} height={18} />
                        </span>
                      ) : (
                        <span style={{ color: 'var(--ink-4)' }}>—</span>
                      )}
                    </td>
                    <td className="col-amt">{fmtMoney(e.amount)}</td>
                    <td className="col-actions">
                      <div className="row-actions">
                        <button className="btn btn-icon" aria-label="Edit" onClick={() => onEdit(e)}><Icon.Edit /></button>
                        <button className="btn btn-icon" aria-label="Delete" onClick={() => onDelete(e)}><Icon.Trash /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="table-foot">
          <span>{filtered.length} {filtered.length === 1 ? 'entry' : 'entries'} · showing {pageStart + 1}–{Math.min(filtered.length, pageStart + PER_PAGE)}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span>Total: <span className="total">{fmtMoney(total)}</span></span>
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                <button key={n} className={n === page ? 'active' : ''} onClick={() => setPage(n)}>{n}</button>
              ))}
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Category Picker with info popup
// ─────────────────────────────────────────────────────────────────────────
function CategoryPicker({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const cat = CAT_BY_ID[value] || CATEGORIES[0];

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <select
          className="select"
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(false); }}
          style={{ flex: 1 }}
        >
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.emoji}  {c.name}</option>
          ))}
        </select>
        <button
          type="button"
          className="cat-info-btn"
          onClick={() => setOpen(v => !v)}
          title="What qualifies for this category?"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </button>
      </div>
      {open && (
        <div className="cat-info-popup">
          <div className="cat-info-head">
            <span className="cat-info-emoji">{cat.emoji}</span>
            <strong className="cat-info-name">{cat.name}</strong>
            <button className="cat-info-close" onClick={() => setOpen(false)}>×</button>
          </div>
          <p className="cat-info-label">Qualifying expenses include:</p>
          <ul className="cat-info-list">
            {cat.description.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          <p className="cat-info-irs">Per IRS Publication 517 · IRC §107</p>
        </div>
      )}
    </div>
  );
}

// Expense Form (modal)
// ─────────────────────────────────────────────────────────────────────────
function ExpenseForm2({ initial, onSave, onCancel, onDelete }) {
  const isEdit = !!initial?.id;
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = React.useState(initial?.date || today);
  const [categoryId, setCategoryId] = React.useState(initial?.categoryId || 'mortgage');
  const [description, setDescription] = React.useState(initial?.description || '');
  const [amount, setAmount] = React.useState(initial?.amount?.toFixed(2) || '');
  const [notes, setNotes] = React.useState(initial?.notes || '');
  const [receipt, setReceipt] = React.useState(initial?.receipt || null);
  const [receiptFile, setReceiptFile] = React.useState(null);
  const [err, setErr] = React.useState({});
  const fileRef = React.useRef(null);

  const submit = (e) => {
    e?.preventDefault();
    const errs = {};
    if (!date) errs.date = 'Required';
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) errs.amount = 'Enter a valid amount';
    if (Object.keys(errs).length) { setErr(errs); return; }
    onSave({
      id: initial?.id || ('e' + Date.now()),
      date, categoryId,
      description: description.trim(),
      amount: num,
      notes: notes.trim(),
      receipt,
      receiptFile, // the actual File object — uploaded to S3 in handleSaveExpense
      source: initial?.source || 'manual',
    });
  };

  const onPick = (file) => {
    if (!file) return;
    setReceiptFile(file);
    setReceipt({ name: file.name, size: file.size });
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <form className="modal" style={{ width: 580 }} onClick={e => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-hd">
          <div>
            <h2>{isEdit ? 'Edit expense' : 'Add expense'}</h2>
            <div className="sub">A single line item against your housing allowance.</div>
          </div>
          <button type="button" className="btn btn-icon" onClick={onCancel} aria-label="Close"><Icon.Cross /></button>
        </div>

        <div className="modal-body">
          <div className="field-row">
            <div className="field">
              <label>Date</label>
              <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
              {err.date && <div className="hint" style={{ color: 'var(--plum)' }}>{err.date}</div>}
            </div>
            <div className="field">
              <label>Category</label>
              <CategoryPicker value={categoryId} onChange={setCategoryId} />
            </div>
          </div>

          <div className="field">
            <label>Description</label>
            <input className="input" type="text" placeholder="e.g. November mortgage — principal & interest"
                   value={description} onChange={e => setDescription(e.target.value)} />
            {err.description && <div className="hint" style={{ color: 'var(--plum)' }}>{err.description}</div>}
          </div>

          <div className="field-row">
            <div className="field">
              <label>Amount <span className="secure-lbl"><Icon.Lock /> encrypted</span></label>
              <div className="amount-input">
                <span>$</span>
                <input className="input" type="text" inputMode="decimal" placeholder="0.00"
                       value={amount} onChange={e => setAmount(e.target.value.replace(/[^\d.]/g, ''))} />
              </div>
              {err.amount && <div className="hint" style={{ color: 'var(--plum)' }}>{err.amount}</div>}
            </div>
            <div className="field">
              <label>Notes <span style={{ color: 'var(--ink-4)', fontWeight: 400 }}>· optional</span></label>
              <input className="input" type="text" placeholder="Any context for your records…"
                     value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label>Receipt <span style={{ color: 'var(--ink-4)', fontWeight: 400 }}>· stored encrypted in AWS S3</span></label>
            <div className={'upload-zone' + (receipt ? ' has-file' : '')}
                 onClick={() => fileRef.current?.click()}
                 onDragOver={e => e.preventDefault()}
                 onDrop={e => { e.preventDefault(); onPick(e.dataTransfer.files[0]); }}>
              <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                     onChange={e => onPick(e.target.files[0])} />
              {receipt ? (
                <>
                  <div className="icon" style={{ color: 'var(--forest-3)' }}><Icon.Receipt /></div>
                  <div className="label"><strong>{receipt.name}</strong></div>
                  <div className="hint">{receipt.size ? fmtSize(receipt.size) : 'Attached'} · click to replace</div>
                </>
              ) : (
                <>
                  <div className="icon"><Icon.Upload /></div>
                  <div className="label"><strong>Click to upload</strong> or drag & drop</div>
                  <div className="hint">PDF, JPG, PNG up to 10 MB</div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <div>
            {isEdit && (
              <button type="button" className="btn btn-ghost" style={{ color: 'var(--plum)' }} onClick={() => onDelete(initial)}>
                <Icon.Trash /> Delete entry
              </button>
            )}
          </div>
          <div className="actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Icon.Check /> {isEdit ? 'Save changes' : 'Save expense'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Tax Report (with editable header + FRV input)
// ─────────────────────────────────────────────────────────────────────────
function TaxReport2({ settings, expenses, onUpdateSettings }) {
  const [editing, setEditing] = React.useState(false);
  const [local, setLocal] = React.useState({
    ministerName: settings.ministerName,
    churchName: settings.churchName,
    taxYear: settings.taxYear,
    fairRentalValue: settings.fairRentalValue,
  });

  const byCat = CATEGORIES.map(c => ({
    ...c,
    items: expenses
      .filter(e => e.categoryId === c.id)
      .sort((a, b) => a.date.localeCompare(b.date)),
  })).filter(c => c.items.length > 0);

  const grand = expenses.reduce((s, e) => s + e.amount, 0);
  const frv = editing ? local.fairRentalValue : settings.fairRentalValue;
  const exclusion = Math.min(settings.designated, grand, frv);
  const taxable = settings.designated > exclusion ? settings.designated - exclusion : 0;

  const handlePrint = () => window.print();
  const save = () => {
    onUpdateSettings(local);
    setEditing(false);
  };

  return (
    <div className="page" data-screen-label="Year-End Report">
      <div className="page-head">
        <div>
          <div className="page-title">Year-end tax report</div>
          <div className="page-sub">Print-ready summary for tax year {settings.taxYear}. Grouped by category with your IRC §107 exclusion calculated.</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setEditing(e => !e)}>
            <Icon.Edit /> {editing ? 'Done editing' : 'Edit header'}
          </button>
          <button className="btn btn-secondary"><Icon.Download /> Export PDF</button>
          <button className="btn btn-primary" onClick={handlePrint}><Icon.Print /> Print report</button>
        </div>
      </div>

      {editing && (
        <div className="card" style={{ padding: 22, marginBottom: 14, background: 'rgba(168,133,66,.06)', borderColor: 'rgba(168,133,66,.3)' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: 12 }}>
            Editing report header
          </div>
          <div className="field-row" style={{ marginBottom: 14 }}>
            <div className="field">
              <label>Minister name</label>
              <input className="input" value={local.ministerName} onChange={e => setLocal({ ...local, ministerName: e.target.value })} />
            </div>
            <div className="field">
              <label>Church name</label>
              <input className="input" value={local.churchName} onChange={e => setLocal({ ...local, churchName: e.target.value })} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Tax year</label>
              <select className="select" value={local.taxYear} onChange={e => setLocal({ ...local, taxYear: Number(e.target.value) })}>
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Fair rental value of home (furnished, + utilities) <span className="secure-lbl"><Icon.Lock /> required for IRS calc</span></label>
              <div className="amount-input">
                <span>$</span>
                <input className="input" type="text" inputMode="decimal" value={local.fairRentalValue}
                       onChange={e => setLocal({ ...local, fairRentalValue: parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0 })} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}><Icon.Check /> Save changes</button>
          </div>
        </div>
      )}

      <div className="report-page">
        <div className="report-hd">
          <div className="report-eyebrow">Minister's Housing Allowance · Worksheet</div>
          <div className="report-title">{(editing ? local.ministerName : settings.ministerName)}<br/>
            <span style={{ fontSize: 24, color: 'var(--ink-3)' }}>Tax Year {editing ? local.taxYear : settings.taxYear}</span>
          </div>
        </div>

        <dl className="report-meta">
          <div><dt>Church</dt><dd>{editing ? local.churchName : settings.churchName}</dd></div>
          <div><dt>Designated allowance</dt><dd>{fmtMoney(settings.designated)}</dd></div>
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
            <span className="val">{fmtMoney(settings.designated)}</span>
          </div>
          <div className="summary-row">
            <span className="label">B. Actual housing expenses (this report)</span>
            <span className="val">{fmtMoney(grand)}</span>
          </div>
          <div className="summary-row">
            <span className="label">C. Fair rental value of home, furnished, + utilities</span>
            <span className="val">{fmtMoney(frv)}</span>
          </div>
          <div className="summary-row exclusion">
            <span className="label"><strong style={{ color: 'var(--ink)', fontFamily: 'var(--serif)' }}>IRS allowable exclusion</strong> · the lesser of A, B, or C</span>
            <span className="val" style={{ fontFamily: 'var(--serif)', fontSize: 17 }}><strong>{fmtMoney(exclusion)}</strong></span>
          </div>
          <div className="summary-row grand">
            <span className="label">Taxable portion of allowance</span>
            <span className="val">{fmtMoney(taxable)}</span>
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

// ─────────────────────────────────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────────────────────────────────
function SettingsPage2({ settings, onSave, onSignOut }) {
  const [s, setS] = React.useState(settings);
  const [savedAt, setSavedAt] = React.useState(null);
  const [notifs, setNotifs] = React.useState({ trialEnding: true, monthlySummary: true, reportReady: true, productUpdates: false });
  const set = (k, v) => setS(prev => ({ ...prev, [k]: v }));

  const save = (e) => {
    e?.preventDefault();
    onSave(s);
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 2500);
  };

  return (
    <div className="page" data-screen-label="Settings">
      <div className="page-head">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-sub">Profile, tax year, notifications, security, and account data.</div>
        </div>
      </div>

      <form onSubmit={save} className="settings-grid">
        <aside className="settings-aside">
          <h4>Account</h4>
          <p>Personal details, tax-year configuration, and the account security tools used at sign-in.</p>
        </aside>

        <div className="card settings-card">
          <h3>Profile</h3>
          <div className="field-row">
            <div className="field">
              <label>First name</label>
              <input className="input" value={s.firstName} onChange={e => set('firstName', e.target.value)} />
            </div>
            <div className="field">
              <label>Last name</label>
              <input className="input" value={s.lastName} onChange={e => set('lastName', e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Full name on tax return</label>
              <input className="input" value={s.ministerName} onChange={e => set('ministerName', e.target.value)} />
            </div>
            <div className="field">
              <label>Church / Ministry</label>
              <input className="input" value={s.churchName} onChange={e => set('churchName', e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Email <span className="secure-lbl"><Icon.Lock /> encrypted</span></label>
              <input className="input" type="email" value={Auth.getEmail()} readOnly
                style={{ background: 'var(--paper-2)', color: 'var(--ink-3)', cursor: 'default' }} />
            </div>
            <div className="field">
              <label>Password</label>
              {Auth.getEmail() && TokenStore.isGoogleUser() ? (
                <div style={{ fontSize: 13, color: 'var(--ink-3)', paddingTop: 8 }}>
                  Signed in with Google — no password needed.
                </div>
              ) : (
                <button type="button" className="btn btn-secondary" style={{ width: 'fit-content' }}>
                  Change password
                </button>
              )}
            </div>
          </div>

          <h3 style={{ marginTop: 6 }}>Tax settings · {s.taxYear}</h3>
          <div className="field-row">
            <div className="field">
              <label>Tax year</label>
              <select className="select" value={s.taxYear} onChange={e => set('taxYear', Number(e.target.value))}>
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Designated allowance</label>
              <div className="amount-input">
                <span>$</span>
                <input className="input" type="text" inputMode="decimal" value={s.designated}
                       onChange={e => set('designated', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)} />
              </div>
              <div className="hint">Total amount your board designated for housing this year.</div>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Board designation date</label>
              <input className="input" value={s.designatedSetOn} onChange={e => set('designatedSetOn', e.target.value)} />
              <div className="hint">Must be set in advance of payment.</div>
            </div>
            <div className="field">
              <label>Fair rental value (furnished + utilities)</label>
              <div className="amount-input">
                <span>$</span>
                <input className="input" type="text" inputMode="decimal" value={s.fairRentalValue}
                       onChange={e => set('fairRentalValue', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)} />
              </div>
              <div className="hint">Used as a ceiling on your exclusion.</div>
            </div>
          </div>

          {/* Notifications */}
          <h3 style={{ marginTop: 10 }}>Notifications</h3>
          <div>
            {[
              ['trialEnding',    'Trial ending reminder',    'Email reminder 30 days, 7 days, and 1 day before trial ends.'],
              ['monthlySummary', 'Monthly summary',          'A gentle recap of expenses logged each month.'],
              ['reportReady',    'Report ready alert',       'Notify when your year-end report has been generated.'],
              ['productUpdates', 'Product updates',          'Occasional notes about new features and improvements.'],
            ].map(([k, t, d]) => (
              <div className="setting-row" key={k}>
                <Icon.Bell />
                <div className="body">
                  <div className="title">{t}</div>
                  <div className="desc">{d}</div>
                </div>
                <button type="button" className={'switch' + (notifs[k] ? ' on' : '')}
                        onClick={() => setNotifs(prev => ({ ...prev, [k]: !prev[k] }))} />
              </div>
            ))}
          </div>

          {/* Security */}
          <h3 style={{ marginTop: 10 }}>Security · AWS Cognito</h3>
          <div className="setting-row">
            <Icon.ShieldCheck />
            <div className="body">
              <div className="title">Two-factor authentication <span className="secure-lbl" style={{ color: 'var(--forest-3)' }}>Enabled</span></div>
              <div className="desc">Authenticator app · Last verified Nov 3, 2025</div>
            </div>
            <button type="button" className="btn btn-secondary">Manage</button>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8, marginTop: 10 }}>
              Active sessions
            </div>
            <div className="setting-row" style={{ borderTop: '1px solid var(--hairline-2)' }}>
              <div className="body">
                <div className="title">
                  {(() => {
                    const ua = navigator.userAgent;
                    const browser = ua.includes('Edg') ? 'Edge' : ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') ? 'Safari' : 'Browser';
                    const device  = ua.includes('iPhone') ? 'iPhone' : ua.includes('iPad') ? 'iPad' : ua.includes('Android') ? 'Android' : ua.includes('Mac') ? 'Mac' : 'Windows PC';
                    return `${device} · ${browser}`;
                  })()}
                  <span style={{ color: 'var(--forest-3)', fontSize: 11, marginLeft: 6 }}>· Current</span>
                </div>
                <div className="desc">Active now</div>
              </div>
            </div>
          </div>

          {/* Data & Storage */}
          <h3 style={{ marginTop: 10 }}>Data & storage</h3>
          <div className="setting-row">
            <Icon.Doc />
            <div className="body">
              <div className="title">AWS S3 storage · 4.2 MB of 1 GB used</div>
              <div className="storage-bar" style={{ marginTop: 6 }}><i style={{ width: '0.4%' }} /></div>
            </div>
          </div>
          <div className="setting-row">
            <Icon.Download />
            <div className="body">
              <div className="title">Export all data as CSV</div>
              <div className="desc">Download a copy of every expense logged, with metadata.</div>
            </div>
            <button type="button" className="btn btn-secondary">Export CSV</button>
          </div>

          <div className="settings-foot">
            {savedAt && (
              <span style={{ color: 'var(--forest-3)', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 'auto' }}>
                <Icon.Check /> Saved
              </span>
            )}
            <button type="button" className="btn btn-secondary" onClick={() => setS(settings)}>Discard</button>
            <button type="submit" className="btn btn-primary">Save changes</button>
          </div>
        </div>

        {/* Danger zone — full width below */}
        <div></div>
        <div className="danger-zone">
          <h3>Danger zone</h3>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: '0 0 14px', lineHeight: 1.5 }}>
            Deleting your account is permanent. All expenses, receipts, and reports will be removed from our servers within 30 days.
          </p>
          <button type="button" className="btn btn-danger">
            <Icon.Trash /> Delete account…
          </button>
        </div>
      </form>
    </div>
  );
}

Object.assign(window, { Dashboard2, ExpenseLog2, ExpenseForm2, TaxReport2, SettingsPage2 });
