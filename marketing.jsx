// Marketing pages — Landing, Auth, Paywall

// ─────────────────────────────────────────────────────────────────────────
// Landing
// ─────────────────────────────────────────────────────────────────────────
function Landing({ onStart, onSignIn }) {
  return (
    <div className="land">
      <header className="land-nav">
        <div className="land-brand">
          <img src="logo-color.png" alt="Clergy Housing" className="land-logo" />
        </div>
        <div className="links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="/contact.html">Contact</a>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={onSignIn}>Sign in</button>
          <button className="btn btn-primary" onClick={onStart}>Start free trial</button>
        </div>
      </header>

      <section className="land-hero">
        <div className="land-eyebrow">Built for Ministry Professionals</div>
        <h1 className="land-h1">
          Keep your Housing Allowance in good order.
        </h1>
        <p className="land-lede">
          An easy-to-use, precise ledger for your Housing Allowance. Track expenses, sync your bank account
          and generate a year-end report your CPA or Tax Preparer will recognize at a glance.
        </p>
        <div className="land-cta">
          <button className="btn btn-primary" onClick={onStart}>
            <Icon.Sparkle /> Start your free 3-month trial
          </button>
          <div className="ghost-meta">
            <strong>No credit card</strong> required · Cancel anytime
          </div>
        </div>

        <div className="land-trust" id="security">
          <span className="item"><Icon.ShieldCheck /> Secure AWS infrastructure</span>
          <span className="item"><Icon.Lock /> Bank-level encryption</span>
          <span className="item"><Icon.Star /> Trusted by ministry professionals</span>
        </div>
      </section>

      <section className="land-section" id="features">
        <div className="land-section-eyebrow">A complete worksheet</div>
        <h2 className="land-section-h">Everything you need for clean records — nothing you don't.</h2>
        <div className="feat-grid">
          <div className="feat">
            <div className="feat-icon"><Icon.Ledger /></div>
            <h3 className="feat-h">Expense tracking</h3>
            <p className="feat-p">
              Log every mortgage payment, utility bill, and repair against the nine IRS-qualifying
              categories. Attach receipts directly to each entry.
            </p>
          </div>
          <div className="feat">
            <div className="feat-icon"><Icon.Bank /></div>
            <h3 className="feat-h">Bank sync</h3>
            <p className="feat-p">
              Connect your accounts through Plaid. Review imported transactions and confirm which
              ones qualify before they enter your ledger — never a surprise.
            </p>
          </div>
          <div className="feat">
            <div className="feat-icon"><Icon.Report /></div>
            <h3 className="feat-h">Year-end report</h3>
            <p className="feat-p">
              One click produces a print-ready worksheet grouped by category, with your Housing Allowance
              exclusion calculated. Save as PDF, hand to your CPA or Tax Preparer.
            </p>
          </div>
        </div>
      </section>

      <section className="land-section" id="pricing">
        <div className="land-section-eyebrow">Simple, fair pricing</div>
        <h2 className="land-section-h">Pay only when you're certain it serves you.</h2>
        <div className="plan-grid">
          {PLANS.map(p => (
            <div key={p.id} className={'plan' + (p.featured ? ' featured' : '')}>
              {p.featured && <div className="plan-tag">Best value</div>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-desc">{p.desc}</div>
              <div className="plan-price">
                ${p.price}<span className="unit">{p.unit || ''}</span>
              </div>
              {p.save && <div className="plan-save">{p.save}</div>}
              {!p.save && <div className="plan-save" style={{ visibility: 'hidden' }}>—</div>}
              <ul className="plan-feat">
                {p.feats.map(f => (
                  <li key={f}><Icon.Check />{f}</li>
                ))}
              </ul>
              <div className="plan-cta">
                <button className={'btn ' + (p.featured ? 'btn-brass' : 'btn-secondary')}
                        onClick={onStart}>
                  {p.id === 'trial' ? 'Start free trial' : p.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="land-footer">
        <div className="links">
          <a href="/privacy.html">Privacy Policy</a>
          <a href="/terms.html">Terms of Service</a>
          <a href="/cookies.html">Cookies Policy</a>
          <a href="/sms-terms.html">SMS Terms</a>
          <a href="/contact.html">Contact</a>
        </div>
        <div>© 2026 Clario Consulting Corporation. All rights reserved.</div>
        <div className="footer-clario">
          <span>A product of</span>
          <a href="https://clarioconsulting.com" target="_blank" rel="noopener noreferrer">
            <img src="https://clarioconsulting.com/wp-content/uploads/2022/12/Logo-Clario-e1768800479993.png" alt="Clario Consulting" className="footer-clario-logo" />
          </a>
          <a href="https://clarioconsulting.com" target="_blank" rel="noopener noreferrer" className="footer-clario-link">Clario Consulting</a>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Auth (Sign Up / Sign In)
// ─────────────────────────────────────────────────────────────────────────
function AuthScreen({ mode: initialMode, onComplete, onBackToLanding }) {
  const [mode, setMode] = React.useState(initialMode || 'signup');
  const [step, setStep] = React.useState('form'); // 'form' | 'confirm' | 'welcome'
  const [name, setName] = React.useState('');
  const [church, setChurch] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        await Auth.signUp(email, password, name, church);
        setStep('confirm');
      } else {
        await Auth.signIn(email, password);
        onComplete();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await Auth.confirmSignUp(email, code);
      await Auth.signIn(email, password);
      setStep('welcome');
      // Store for onComplete
      window._signupInfo = { name, church };
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <aside className="auth-aside">
        <div>
          <img src="logo-light.png" alt="Clergy Housing" className="sidebar-logo" />
          <h2>The dignified way to keep your Housing Allowance records.</h2>
        </div>
        <div className="quote">
          "Finally a tool that doesn't feel like wrestling with a spreadsheet.
          My CPA recognized the report format on first glance."
          <div className="quote-att">Rev. John Steward — Asheville, NC</div>
        </div>
      </aside>

      <main className="auth-main">
        {step === 'form' && (
          <form className="auth-form" onSubmit={submit}>
            <h1>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
            <div className="sub">
              {mode === 'signup'
                ? 'Three months free. No card required.'
                : 'Sign in to your housing worksheet.'}
            </div>

            <button type="button" className="btn btn-google" onClick={() => Auth.signInWithGoogle()}>
              <Icon.Google /> Continue with Google
            </button>

            <div className="auth-divider">or with email</div>

            <div className="fields">
              {mode === 'signup' && (
                <>
                  <div className="field">
                    <label>Full name</label>
                    <input className="input" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Church or organization</label>
                    <input className="input" value={church} onChange={e => setChurch(e.target.value)} />
                  </div>
                </>
              )}
              <div className="field">
                <label>Email <span className="secure-lbl"><Icon.Lock /> encrypted</span></label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="field">
                <label>Password</label>
                <input className="input" type="password" placeholder="••••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                {mode === 'signup' && (
                  <div className="hint">At least 10 characters, with one number and one symbol.</div>
                )}
              </div>
            </div>

            {error && (
              <div style={{ color: '#c0392b', fontSize: 13, padding: '8px 12px', background: '#fdf0ee', borderRadius: 8, marginBottom: 4 }}>
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Please wait…' : (mode === 'signup' ? 'Create account & start trial' : 'Sign in')}
            </button>

            <div className="auth-foot">
              {mode === 'signup' ? (
                <>Already have an account? <button onClick={() => setMode('signin')}>Sign in</button></>
              ) : (
                <>New to Clergy Housing? <button onClick={() => setMode('signup')}>Create an account</button></>
              )}
              <br/>
              <button onClick={onBackToLanding} style={{ marginTop: 6, color: 'var(--ink-3)', fontWeight: 400 }}>← Back to home</button>
            </div>
          </form>
        )}

        {step === 'confirm' && (
          <form className="auth-form" onSubmit={confirmCode}>
            <h1>Check your email</h1>
            <div className="sub">We sent a 6-digit code to <strong>{email}</strong>. Enter it below to verify your account.</div>

            <div className="fields">
              <div className="field">
                <label>Verification code</label>
                <input className="input" type="text" inputMode="numeric" maxLength={6}
                  placeholder="123456" value={code} onChange={e => setCode(e.target.value)} autoFocus />
              </div>
            </div>

            {error && (
              <div style={{ color: '#c0392b', fontSize: 13, padding: '8px 12px', background: '#fdf0ee', borderRadius: 8, marginBottom: 4 }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify & continue'}
            </button>

            <div className="auth-foot">
              <button type="button" onClick={async () => { await Auth.resendCode(email); }} style={{ color: 'var(--ink-3)', fontWeight: 400 }}>
                Resend code
              </button>
            </div>
          </form>
        )}

        {step === 'welcome' && (
          <div className="auth-form" style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(59,106,86,.12)', border: '1px solid rgba(59,106,86,.3)', margin: '0 auto 20px', display: 'grid', placeItems: 'center', color: 'var(--forest-3)' }}>
              <Icon.Check />
            </div>
            <h1>Your trial has begun.</h1>
            <div className="sub" style={{ marginBottom: 24 }}>
              Three months of full access — no credit card needed. We'll send a gentle reminder before your trial ends so nothing surprises you.
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onComplete(window._signupInfo)}>
              Enter your dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Paywall (Trial ended)
// ─────────────────────────────────────────────────────────────────────────
function Paywall({ summary, onSubscribe, onSignOut }) {
  return (
    <div className="page" data-screen-label="Paywall">
      <div className="paywall">
        <div className="paywall-icon"><Icon.Sparkle /></div>
        <div className="title">Your free trial has ended.</div>
        <div className="sub">
          Thank you for trying Clergy Housing. Your records are safe and waiting —
          subscribe to keep tracking and generate your year-end report.
        </div>

        <div className="paywall-summary">
          <div>
            <div className="v">{summary.expenses}</div>
            <div className="k">Expenses logged</div>
          </div>
          <div>
            <div className="v">{summary.reports}</div>
            <div className="k">Reports saved</div>
          </div>
          <div>
            <div className="v">{summary.receipts}</div>
            <div className="k">Receipts stored</div>
          </div>
        </div>

        <div className="plan-grid" style={{ marginBottom: 0 }}>
          {PLANS.filter(p => p.id !== 'trial').map(p => (
            <div key={p.id} className={'plan' + (p.featured ? ' featured' : '')}>
              {p.featured && <div className="plan-tag">Best value</div>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-desc">{p.desc}</div>
              <div className="plan-price">${p.price}<span className="unit">{p.unit}</span></div>
              {p.save && <div className="plan-save">{p.save}</div>}
              {!p.save && <div className="plan-save" style={{ visibility: 'hidden' }}>—</div>}
              <ul className="plan-feat">
                {p.feats.slice(0, 4).map(f => <li key={f}><Icon.Check />{f}</li>)}
              </ul>
              <div className="plan-cta">
                <button className={'btn ' + (p.featured ? 'btn-brass' : 'btn-secondary')}
                        onClick={() => onSubscribe(p.id)}>
                  Subscribe now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="locked-features">
          <div className="locked-feat">
            <div className="lock"><Icon.Lock /></div>
            <div className="name">Add new expenses</div>
            <div className="desc">Read-only access until you subscribe.</div>
          </div>
          <div className="locked-feat">
            <div className="lock"><Icon.Lock /></div>
            <div className="name">Sync bank transactions</div>
            <div className="desc">Plaid connections paused.</div>
          </div>
          <div className="locked-feat">
            <div className="lock"><Icon.Lock /></div>
            <div className="name">Export tax report</div>
            <div className="desc">Generate and download paused.</div>
          </div>
        </div>

        <div style={{ marginTop: 30, fontSize: 13, color: 'var(--ink-3)' }}>
          Need help deciding? <a href="#" style={{ color: 'var(--forest)' }}>Talk to our team</a>
          <span style={{ margin: '0 8px' }}>·</span>
          <button className="btn-ghost" style={{ border: 0, background: 'none', padding: 0, font: 'inherit', color: 'var(--ink-3)', cursor: 'pointer' }} onClick={onSignOut}>Sign out</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Onboarding Wizard (shown once after signup, before entering the dashboard)
// ─────────────────────────────────────────────────────────────────────────
function OnboardingWizard({ onComplete }) {
  const [step, setStep] = React.useState(1);
  // Step 1 — personal info
  const [firstName, setFirstName]       = React.useState('');
  const [lastName, setLastName]         = React.useState('');
  const [ministerName, setMinisterName] = React.useState('');
  const [churchName, setChurchName]     = React.useState('');
  // Step 2 — allowance details
  const [taxYear, setTaxYear]           = React.useState(new Date().getFullYear());
  const [designated, setDesignated]     = React.useState('');
  const [designatedSetOn, setDesignatedSetOn] = React.useState('');
  // Step 3 — fair rental value
  const [fairRentalValue, setFairRentalValue] = React.useState('');
  const [loading, setLoading]           = React.useState(false);
  const [dateError, setDateError]       = React.useState('');

  const parseAmount = (v) => parseFloat(String(v).replace(/[^\d.]/g, '')) || 0;

  const validateStep2 = (e) => {
    e.preventDefault();
    if (designatedSetOn) {
      const parsed = new Date(designatedSetOn);
      const cutoff = new Date(`${Number(taxYear)}-01-01T00:00:00`);
      if (isNaN(parsed.getTime()) || parsed >= cutoff) {
        setDateError(`Please enter a date before January 1, ${Number(taxYear)}. The board must approve the allowance before the tax year it covers begins.`);
        return;
      }
    }
    setDateError('');
    setStep(3);
  };

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      firstName, lastName, ministerName, churchName,
      taxYear:        Number(taxYear),
      designated:     parseAmount(designated),
      designatedSetOn,
      fairRentalValue: parseAmount(fairRentalValue),
    };
    try { await API.updateProfile(data); } catch (_) {}
    onComplete(data);
  };

  return (
    <div className="onboarding-wrap">
      <div className="onboarding-card" style={{ animation: 'slideUp .24s cubic-bezier(.3,.7,.4,1)' }}>

        <div className="onboarding-steps">
          <div className={'onboarding-step' + (step >= 1 ? ' active' : '')} />
          <div className={'onboarding-step' + (step >= 2 ? ' active' : '')} />
          <div className={'onboarding-step' + (step >= 3 ? ' active' : '')} />
        </div>

        {step === 1 && (
          <form onSubmit={e => { e.preventDefault(); setStep(2); }}>
            <div className="onboarding-icon"><Icon.Logo /></div>
            <h2>Tell us about yourself</h2>
            <p className="onboarding-sub">
              This information will appear on your year-end tax report and all official records.
            </p>

            <div className="field-row" style={{ marginBottom: 14 }}>
              <div className="field">
                <label>First name</label>
                <input className="input" type="text" placeholder="John"
                  value={firstName} onChange={e => setFirstName(e.target.value)} required autoFocus />
              </div>
              <div className="field">
                <label>Last name</label>
                <input className="input" type="text" placeholder="Smith"
                  value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
            </div>

            <div className="field" style={{ marginBottom: 14 }}>
              <label>Name as it appears on your income tax return</label>
              <input className="input" type="text" placeholder="Rev. John Smith"
                value={ministerName} onChange={e => setMinisterName(e.target.value)} required />
              <div className="hint">Use the exact name on file with the IRS — including title if applicable.</div>
            </div>

            <div className="field" style={{ marginBottom: 24 }}>
              <label>Church or ministry name</label>
              <input className="input" type="text" placeholder="Grace Community Church"
                value={churchName} onChange={e => setChurchName(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Continue →
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={validateStep2}>
            <div className="onboarding-icon"><Icon.Report /></div>
            <h2>Your housing allowance</h2>
            <p className="onboarding-sub">
              Your church board must formally designate your housing allowance each year.
              We need these details to track your IRS §107 exclusion accurately.
            </p>

            <div className="field" style={{ marginBottom: 14 }}>
              <label>Tax year</label>
              <select className="select" value={taxYear} onChange={e => { setTaxYear(e.target.value); setDateError(''); }}>
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="field" style={{ marginBottom: 14 }}>
              <label>Designated allowance</label>
              <div className="amount-input">
                <span>$</span>
                <input className="input" type="text" inputMode="decimal"
                  placeholder="36,000" value={designated}
                  onChange={e => setDesignated(e.target.value)} required />
              </div>
              <div className="hint">Total amount your board designated for housing this year.</div>
            </div>

            <div className="field" style={{ marginBottom: 24 }}>
              <label>Date the board approved the housing allowance</label>
              <input className="input" type="text"
                placeholder={`December 31, ${Number(taxYear) - 1}`}
                value={designatedSetOn}
                onChange={e => { setDesignatedSetOn(e.target.value); setDateError(''); }}
                style={dateError ? { borderColor: 'var(--danger)' } : {}} />
              <div className="hint">
                Must be before January 1, {Number(taxYear)} — for {Number(taxYear)}, the latest valid date is December 31, {Number(taxYear) - 1}.
              </div>
              {dateError && <div className="onboarding-field-error">{dateError}</div>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Continue →
            </button>
            <button type="button" onClick={() => setStep(1)}
              style={{ display: 'block', margin: '12px auto 0', background: 'none', border: 'none',
                       color: 'var(--ink-3)', fontSize: 13, cursor: 'pointer' }}>
              ← Back
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={save}>
            <div className="onboarding-icon"><Icon.Home /></div>
            <h2>Fair rental value</h2>
            <p className="onboarding-sub">
              The IRS limits your tax-free exclusion to what it would cost to rent your home
              for the year — fully furnished, with utilities included. Enter your best
              annual estimate. If you are unsure, check local rental listings or ask a real
              estate agent for a comparable figure.
            </p>

            <div className="field" style={{ marginBottom: 24 }}>
              <label>Annual fair rental value (furnished + utilities)</label>
              <div className="amount-input">
                <span>$</span>
                <input className="input" type="text" inputMode="decimal"
                  placeholder="24,000" value={fairRentalValue}
                  onChange={e => setFairRentalValue(e.target.value)}
                  autoFocus />
              </div>
              <div className="hint">You can update this at any time in Settings.</div>
            </div>

            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Saving…' : 'Save & enter dashboard →'}
            </button>
            <button type="button" onClick={() => setStep(2)}
              style={{ display: 'block', margin: '12px auto 0', background: 'none', border: 'none',
                       color: 'var(--ink-3)', fontSize: 13, cursor: 'pointer' }}>
              ← Back
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

Object.assign(window, { Landing, AuthScreen, Paywall, OnboardingWizard });
