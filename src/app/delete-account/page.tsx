'use client';

import { useState, useRef } from 'react';

/* ─── 5-step confirmation — matches the mobile app exactly ─── */
const STEPS = [
  {
    emoji: '😢',
    title: 'Are you sure you want to leave?',
    body: 'Your account and all your order history, wallet balance, and data will be deactivated. You will no longer be able to log in.',
    confirm: 'Yes, I understand',
    cancel: 'No, keep my account',
  },
  {
    emoji: '💸',
    title: 'Wallet & Earnings',
    body: 'Any wallet balance, cashback, referral credits, or pending earnings in your account will be forfeited and cannot be recovered after deactivation.',
    confirm: 'I understand and agree',
    cancel: 'Go back',
  },
  {
    emoji: '📋',
    title: 'Your data is retained',
    body: 'FlashMed retains your account data (orders, transactions, KYC documents) for up to 7 years as required by law and for fraud prevention. Data is NOT deleted — only your access is removed.',
    confirm: 'I acknowledge this',
    cancel: 'Go back',
  },
  {
    emoji: '⚠️',
    title: 'This action cannot be undone',
    body: 'Once deactivated, you cannot reactivate your account yourself. You would need to register a new account. Any active orders or ongoing deliveries linked to your account may be affected.',
    confirm: 'I still want to continue',
    cancel: 'Go back',
  },
  {
    emoji: '🔐',
    title: 'Final confirmation',
    body: 'Type "DELETE MY ACCOUNT" below to permanently deactivate your account.',
    confirm: 'Deactivate my account',
    cancel: 'Cancel',
    requiresTyping: true,
  },
];

type Phase = 'login' | 'steps' | 'done' | 'error';

export default function DeleteAccountPage() {
  /* ── Login phase state ── */
  const [phone, setPhone]     = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  /* ── Step phase state ── */
  const [phase, setPhase]   = useState<Phase>('login');
  const [step, setStep]     = useState(0);
  const [typed, setTyped]   = useState('');
  const [stepLoading, setStepLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const tokenRef = useRef<string | null>(null);

  /* ────────── STEP 1: LOGIN ────────── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    if (!/^\d{10}$/.test(phone.trim())) {
      setLoginError('Enter a valid 10-digit phone number.');
      return;
    }
    if (password.length < 6) {
      setLoginError('Password must be at least 6 characters.');
      return;
    }
    setLoginLoading(true);
    try {
      const res = await fetch('/api/proxy/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone: phone.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Login failed. Check your credentials.');
        return;
      }
      /* store token for the deactivate call */
      tokenRef.current = data.token || null;
      setPhase('steps');
      setStep(0);
    } catch {
      setLoginError('Network error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  }

  /* ────────── STEP 2–6: CONFIRMATION FLOW ────────── */
  async function handleNext() {
    const current = STEPS[step];

    if (current.requiresTyping && typed.trim() !== 'DELETE MY ACCOUNT') {
      setErrorMsg('Please type exactly: DELETE MY ACCOUNT');
      return;
    }
    setErrorMsg('');

    if (step < STEPS.length - 1) {
      setStep(step + 1);
      setTyped('');
      return;
    }

    /* Final step — call backend */
    setStepLoading(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (tokenRef.current) headers['Authorization'] = `Bearer ${tokenRef.current}`;

      const res = await fetch('/api/proxy/auth/deactivate-account', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ reason: 'User requested via web delete-account page' }),
      });
      const data = await res.json();

      if (data.success || res.ok) {
        setPhase('done');
      } else {
        setErrorMsg(data.error || 'Could not deactivate account. Please try again.');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
    } finally {
      setStepLoading(false);
    }
  }

  function handleBack() {
    if (step === 0) {
      setPhase('login');
      setPhone('');
      setPassword('');
    } else {
      setStep(step - 1);
      setTyped('');
      setErrorMsg('');
    }
  }

  /* ─── shared container ─── */
  const wrap: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0d1117 0%,#0f1b2d 100%)',
    color: '#D1D5DB',
    fontFamily: "'Inter',system-ui,sans-serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
  };
  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: '36px 32px',
    width: '100%',
    maxWidth: 480,
  };

  /* ─── LOGO ─── */
  const Logo = () => (
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#059669,#047857)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💊</div>
        <span style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#059669,#34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FlashMed</span>
      </a>
    </div>
  );

  /* ═══════════════════════════════════════
     PHASE: LOGIN
  ═══════════════════════════════════════ */
  if (phase === 'login') {
    return (
      <div style={wrap}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <Logo />
          <div style={card}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: '#F9FAFB', margin: '0 0 8px' }}>Delete Your Account</h1>
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0, lineHeight: 1.7 }}>
                Sign in to verify it&apos;s you, then follow the steps to permanently deactivate your account.
              </p>
            </div>

            {/* Warning banner */}
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 24 }}>
              <p style={{ margin: 0, fontSize: 12, color: '#FCA5A5', lineHeight: 1.7 }}>
                ⚠️ <strong style={{ color: '#FCA5A5' }}>This cannot be undone.</strong> Unused wallet balance and referral credits will be forfeited. Order data is retained for 7 years as required by Indian law.
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontSize: 14 }}>+91</span>
                  <input
                    id="phone-input"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number"
                    required
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 12, padding: '13px 14px 13px 46px',
                      color: '#F9FAFB', fontSize: 15, outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Password</label>
                <input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your FlashMed password"
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 12, padding: '13px 14px',
                    color: '#F9FAFB', fontSize: 15, outline: 'none',
                  }}
                />
              </div>

              {loginError && (
                <p style={{ margin: 0, fontSize: 13, color: '#F87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px' }}>
                  {loginError}
                </p>
              )}

              <button
                id="login-submit"
                type="submit"
                disabled={loginLoading}
                style={{
                  background: loginLoading ? 'rgba(239,68,68,0.4)' : 'linear-gradient(135deg,#dc2626,#b91c1c)',
                  border: 'none', borderRadius: 12, padding: '14px',
                  color: '#fff', fontSize: 15, fontWeight: 800,
                  cursor: loginLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {loginLoading ? 'Verifying…' : 'Verify & Continue →'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <a href="/" style={{ color: '#6B7280', textDecoration: 'none', fontSize: 13 }}>← Back to Home</a>
            </div>
          </div>

          {/* What happens section */}
          <div style={{ ...card, marginTop: 16, padding: '20px 24px' }}>
            <h3 style={{ margin: '0 0 12px', color: '#FCA5A5', fontSize: 14, fontWeight: 700 }}>⚠️ What Happens When You Delete</h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#9CA3AF', fontSize: 13, lineHeight: 1.9 }}>
              <li>Your account will be <strong style={{ color: '#F9FAFB' }}>permanently deactivated</strong></li>
              <li>Personal data (name, phone, address) will be <strong style={{ color: '#F9FAFB' }}>removed</strong></li>
              <li>Order history &amp; financial records <strong style={{ color: '#F9FAFB' }}>retained 7 years</strong> (Indian tax law)</li>
              <li>Wallet balance &amp; referral credits will be <strong style={{ color: '#F9FAFB' }}>forfeited</strong></li>
              <li>Active orders must be completed or cancelled first</li>
            </ul>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, color: '#4B5563', fontSize: 12 }}>
            Need help? <a href="mailto:support@flashmed.in" style={{ color: '#059669', textDecoration: 'none' }}>support@flashmed.in</a> · +91 9144150105
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     PHASE: STEPS (5-step confirmation)
  ═══════════════════════════════════════ */
  if (phase === 'steps') {
    const current = STEPS[step];
    const isLast  = step === STEPS.length - 1;

    return (
      <div style={wrap}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <Logo />
          <div style={card}>
            {/* Step dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: 4,
                  background: i <= step ? '#ef4444' : 'rgba(255,255,255,0.15)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>

            {/* Step label */}
            <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 800, color: '#ef4444', letterSpacing: 1, textTransform: 'uppercase' }}>
              Step {step + 1} of {STEPS.length}
            </p>

            {/* Emoji */}
            <div style={{ fontSize: 40, marginBottom: 12 }}>{current.emoji}</div>

            {/* Title */}
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#F9FAFB', margin: '0 0 14px', lineHeight: 1.3 }}>
              {current.title}
            </h2>

            {/* Body */}
            <p style={{ fontSize: 14, lineHeight: 1.75, color: '#9CA3AF', margin: '0 0 20px' }}>
              {current.body}
            </p>

            {/* Typing field (final step) */}
            {current.requiresTyping && (
              <input
                id="confirm-type-input"
                type="text"
                value={typed}
                onChange={e => { setTyped(e.target.value.toUpperCase()); setErrorMsg(''); }}
                placeholder="Type: DELETE MY ACCOUNT"
                autoCapitalize="characters"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 12, padding: '13px 14px',
                  color: '#F9FAFB', fontSize: 14, outline: 'none',
                  marginBottom: 16,
                  fontFamily: 'monospace',
                  letterSpacing: 1,
                }}
              />
            )}

            {/* Error */}
            {errorMsg && (
              <p style={{ margin: '0 0 16px', fontSize: 13, color: '#F87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px' }}>
                {errorMsg}
              </p>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                id="step-back-btn"
                onClick={handleBack}
                disabled={stepLoading}
                style={{
                  flex: 1, background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12,
                  padding: '13px 14px', color: '#9CA3AF',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}
              >
                {current.cancel}
              </button>
              <button
                id="step-next-btn"
                onClick={handleNext}
                disabled={stepLoading}
                style={{
                  flex: 1.5,
                  background: isLast
                    ? (stepLoading ? 'rgba(239,68,68,0.4)' : 'linear-gradient(135deg,#dc2626,#b91c1c)')
                    : 'rgba(239,68,68,0.15)',
                  border: isLast ? 'none' : '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 12,
                  padding: '13px 14px',
                  color: isLast ? '#fff' : '#ef4444',
                  fontSize: 14, fontWeight: 800,
                  cursor: stepLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {stepLoading ? 'Deactivating…' : current.confirm}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, color: '#4B5563', fontSize: 12 }}>
            Need help? <a href="mailto:support@flashmed.in" style={{ color: '#059669', textDecoration: 'none' }}>support@flashmed.in</a>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     PHASE: DONE ✅
  ═══════════════════════════════════════ */
  if (phase === 'done') {
    return (
      <div style={wrap}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <Logo />
          <div style={{ ...card, textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#F9FAFB', margin: '0 0 12px' }}>Account Deactivated</h1>
            <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.75, margin: '0 0 28px' }}>
              Your FlashMed account has been successfully deactivated. Your personal data has been removed, though order and financial records are retained for 7 years as required by Indian law.
            </p>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px' }}>
              We&apos;re sorry to see you go. If you ever want to use FlashMed again, you can create a new account.
            </p>
            <a
              href="/"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg,#059669,#047857)',
                color: '#fff', textDecoration: 'none',
                borderRadius: 12, padding: '13px 32px',
                fontSize: 15, fontWeight: 800,
              }}
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
