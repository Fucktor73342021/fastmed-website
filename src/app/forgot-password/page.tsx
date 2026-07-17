'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://api.flashmed.in';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'phone' | 'otp' | 'newpass' | 'done'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    if (phone.length < 10) { setError('Enter a valid 10-digit phone number'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, purpose: 'forgot_password' }),
      });
      const data = await res.json().catch(() => ({ error: 'Failed' }));
      if (!res.ok) { setError(data.error || 'Failed to send OTP'); return; }
      setSessionId(data.sessionId || '');
      setStep('otp');
    } catch {
      setError('Connection error. Please try again.');
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (otp.length < 4) { setError('Enter the OTP received'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, sessionId, purpose: 'forgot_password' }),
      });
      const data = await res.json().catch(() => ({ error: 'Verification failed' }));
      if (!res.ok) { setError(data.error || 'Incorrect OTP'); return; }
      setStep('newpass');
    } catch {
      setError('Connection error. Please try again.');
    } finally { setLoading(false); }
  };

  const resetPassword = async () => {
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, sessionId, newPassword }),
      });
      const data = await res.json().catch(() => ({ error: 'Reset failed' }));
      if (!res.ok) { setError(data.error || 'Password reset failed'); return; }
      setStep('done');
    } catch {
      setError('Connection error. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
      <div className="mesh-gradient"><div className="mesh-orb-3" /></div>
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 5 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
          <h1 className="h2" style={{ color: 'var(--color-text)', marginBottom: 6 }}>
            {step === 'done' ? 'Password Reset!' : 'Forgot Password'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
            {step === 'phone' && "We'll send an OTP to your registered phone"}
            {step === 'otp' && `OTP sent to +91 ${phone}`}
            {step === 'newpass' && 'Set your new password'}
            {step === 'done' && 'Your password has been reset successfully'}
          </p>
        </div>

        <div className="glass-card" style={{ padding: 28 }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--color-error)', fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          {step === 'phone' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="field-group">
                <label className="field-label">Phone Number</label>
                <div className="phone-row">
                  <div className="country-code">+91</div>
                  <input type="tel" inputMode="numeric" className="input phone-input" placeholder="10-digit number" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} />
                </div>
              </div>
              <button className="btn btn-primary btn-full btn-lg" onClick={sendOtp} disabled={loading}>
                {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Send OTP'}
              </button>
            </div>
          )}

          {step === 'otp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="field-group">
                <label className="field-label">Enter OTP</label>
                <input type="tel" inputMode="numeric" className="input" placeholder="OTP" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} style={{ textAlign: 'center', fontSize: 24, letterSpacing: 10, fontWeight: 800 }} autoFocus />
              </div>
              <button className="btn btn-primary btn-full btn-lg" onClick={verifyOtp} disabled={loading}>
                {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Verify OTP'}
              </button>
              <button className="btn btn-ghost btn-full" onClick={() => { setStep('phone'); setOtp(''); setError(''); }}>← Back</button>
            </div>
          )}

          {step === 'newpass' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="field-group">
                <label className="field-label">New Password</label>
                <input type="password" className="input" placeholder="Min 6 characters" maxLength={16} value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div className="field-group">
                <label className="field-label">Confirm New Password</label>
                <input type="password" className="input" placeholder="Re-enter new password" maxLength={16} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
              <button className="btn btn-primary btn-full btn-lg" onClick={resetPassword} disabled={loading}>
                {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : '🔐 Reset Password'}
              </button>
            </div>
          )}

          {step === 'done' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>You can now sign in with your new password.</p>
              <Link href="/login"><button className="btn btn-primary btn-full btn-lg">Sign In →</button></Link>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 14 }}>← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
