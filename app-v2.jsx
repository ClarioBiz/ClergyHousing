// Clergy Housing — main App

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "clario",
  "headingFont": "Source Serif 4",
  "view": "app",
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
          <div className="brand-sub">Housing Worksheet</div>
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
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>tom@gracecovenant.org</div>
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

  const [view, setView] = React.useState(t.view); // 'landing' | 'auth' | 'app' | 'paywall'
  const [authMode, setAuthMode] = React.useState('signup');
  const [route, setRoute] = React.useState('dashboard');

  const [expenses, setExpenses] = React.useState(SAMPLE_EXPENSES.map(e => ({ ...e, source: 'manual', receipt: ['e02','e03','e05','e06','e08'].includes(e.id) ? { name: e.id + '-receipt.pdf' } : null })));
  const [settings, setSettings] = React.useState({
    firstName: 'Thomas',
    lastName:  'Whitfield',
    ministerName: 'Rev. Thomas R. Whitfield',
    churchName: 'Grace Covenant Church · Greenville, SC',
    taxYear: 2025,
    designated: 36000,
    designatedSetOn: 'Dec 14, 2024',
    fairRentalValue: 38400,
  });

  // subscription state — controlled by tweak
  const subscription = React.useMemo(() => {
    if (t.trialState === 'ending') {
      return { plan: 'trial', daysLeft: 12, trialEnd: '2025-12-08' };
    }
    if (t.trialState === 'ended') {
      return { plan: 'trial', daysLeft: 0, trialEnd: '2025-11-04' };
    }
    if (t.trialState === 'monthly') {
      return { plan: 'monthly', amount: 12.00, nextBilling: '2025-12-04' };
    }
    if (t.trialState === 'annual') {
      return { plan: 'annual', amount: 120.00, nextBilling: '2026-08-04' };
    }
    return { plan: 'trial', daysLeft: 47, trialEnd: '2026-01-12' };
  }, [t.trialState]);

  const [modal, setModal] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [pendingTxns, setPendingTxns] = React.useState(PENDING_TXNS);
  const [drawer, setDrawer] = React.useState(false);

  // Close drawer when route changes
  const go = React.useCallback((r) => {
    setRoute(r);
    setDrawer(false);
  }, []);

  // Sync view tweak (so verifier / direct manipulation can jump screens)
  React.useEffect(() => { setView(t.view); }, [t.view]);
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

  const handleSaveExpense = (entry) => {
    setExpenses(prev => {
      const exists = prev.some(e => e.id === entry.id);
      return exists ? prev.map(e => e.id === entry.id ? entry : e) : [entry, ...prev];
    });
    setModal(null);
    showToast(modal?.mode === 'edit' ? 'Expense updated' : 'Expense added to ledger');
  };

  const handleDeleteExpense = (entry) => {
    setExpenses(prev => prev.filter(e => e.id !== entry.id));
    setModal(null);
    showToast('Expense removed');
  };

  const handleBulkDelete = (ids) => {
    setExpenses(prev => prev.filter(e => !ids.includes(e.id)));
    showToast(`${ids.length} entries removed`);
  };

  const handleAddBankExpenses = (entries) => {
    setExpenses(prev => [...entries, ...prev]);
    setPendingTxns(prev => prev.filter(t => !entries.find(e => e.id === 'tx-' + t.id)));
    showToast(`${entries.length} bank transactions added to ledger`);
  };

  const handleSaveSettings = (s) => {
    setSettings(prev => ({ ...prev, ...s }));
    showToast('Settings saved');
  };

  const handleSubscribe = (planId) => {
    setTweak('trialState', planId);
    if (view === 'paywall') setView('app');
    showToast(`Subscribed · ${planId === 'monthly' ? 'Monthly' : 'Annual'} plan active`);
  };

  // ── Render by view ────────────────────────────────────────────────────
  if (view === 'landing') {
    return (
      <>
        <Landing onStart={() => { setAuthMode('signup'); setTweak('view', 'auth'); }}
                 onSignIn={() => { setAuthMode('signin'); setTweak('view', 'auth'); }} />
        <AppTweaks t={t} setTweak={setTweak} />
      </>
    );
  }
  if (view === 'auth') {
    return (
      <>
        <AuthScreen mode={authMode} onComplete={() => setTweak('view', 'app')} onBackToLanding={() => setTweak('view', 'landing')} />
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
                  onTrialClick={() => {}} onSignOut={() => setTweak('view', 'landing')}
                  onMenu={() => setDrawer(true)} />
          <Paywall
            summary={{ expenses: expenses.length, reports: 1, receipts: expenses.filter(e => e.receipt).length }}
            onSubscribe={handleSubscribe}
            onSignOut={() => setTweak('view', 'landing')}
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
                onSignOut={() => setTweak('view', 'landing')}
                onMenu={() => setDrawer(true)} />

        {route === 'dashboard' && (
          <Dashboard2 settings={settings} expenses={expenses} subscription={subscription}
                      onAdd={() => setModal({ mode: 'add' })} onGo={go} />
        )}
        {route === 'log' && (
          <ExpenseLog2 expenses={expenses}
                       onAdd={() => setModal({ mode: 'add' })}
                       onEdit={(e) => setModal({ mode: 'edit', expense: e })}
                       onDelete={handleDeleteExpense}
                       onBulkDelete={handleBulkDelete} />
        )}
        {route === 'banks' && (
          <BankAccounts banks={BANKS} pendingTxns={pendingTxns} onAddExpenses={handleAddBankExpenses} />
        )}
        {route === 'report' && (
          <TaxReport2 settings={settings} expenses={expenses} onUpdateSettings={handleSaveSettings} />
        )}
        {route === 'documents' && (
          <Documents documents={DOCUMENTS} />
        )}
        {route === 'billing' && (
          <Billing subscription={subscription} onSubscribe={handleSubscribe} />
        )}
        {route === 'settings' && (
          <SettingsPage2 settings={settings} onSave={handleSaveSettings}
                        onSignOut={() => setTweak('view', 'landing')} />
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
