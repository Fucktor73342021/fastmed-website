'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { setToken } from '../../lib/api';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://api.flashmed.in';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const router = useRouter();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) { setError('Enter a valid 10-digit phone number'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json().catch(() => ({ error: 'Server error' }));
      if (!res.ok) {
        setError(data.error || 'Login failed. Please check your credentials.');
        return;
      }
      const userData = data.user;
      if (userData.role === 'seller' || userData.role === 'pharmacy' || userData.role === 'delivery' || userData.role === 'delivery_partner') {
        setError('This platform is for customers only.');
        return;
      }
      setToken(data.token);
      setUser({ uid: 'user_' + phone, phoneNumber: '+91' + phone, ...userData, token: data.token, firebaseToken: data.firebaseToken });
      router.replace('/home');
    } catch {
      setError('Connection error. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (phone.length < 10) { setError('Enter a valid 10-digit phone number'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, purpose: 'login' }),
      });
      const data = await res.json().catch(() => ({ error: 'Failed to send OTP' }));
      if (!res.ok) { setError(data.error || 'Failed to send OTP'); return; }
      setSessionId(data.sessionId || '');
      setOtpSent(true);
    } catch {
      setError('Could not send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) { setError('Enter the OTP received on your phone'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, sessionId, purpose: 'login' }),
      });
      const data = await res.json().catch(() => ({ error: 'Verification failed' }));
      if (!res.ok) { setError(data.error || 'Incorrect OTP. Please try again.'); return; }
      const userData = data.user;
      setToken(data.token);
      setUser({ uid: 'user_' + phone, phoneNumber: '+91' + phone, ...userData, token: data.token, firebaseToken: data.firebaseToken });
      router.replace('/home');
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="mesh-gradient"><div className="mesh-orb-3" /></div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 5,
      }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 22,
              background: 'linear-gradient(135deg, #059669, #047857)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 34, margin: '0 auto 16px',
              boxShadow: '0 16px 40px rgba(5,150,105,0.30)',
              animation: 'bounceIn 0.6s ease',
            }}>💊</div>
            <h1 className="h2" style={{ color: 'var(--color-text)', marginBottom: 6 }}>Welcome Back</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Sign in to your FlashMed account</p>
          </div>

          {/* Card */}
          <div className="glass-card" style={{ padding: '28px 28px 24px', position: 'relative' }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 4,
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
              borderRadius: '20px 20px 0 0',
            }} />

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 12, padding: '10px 14px', marginBottom: 16,
                fontSize: 13, color: 'var(--color-error)', fontWeight: 600,
              }}>⚠️ {error}</div>
            )}

            {/* Phone */}
            <div className="field-group" style={{ marginBottom: 16 }}>
              <label className="field-label">Phone Number</label>
              <div className="phone-row">
                <div className="country-code">+91</div>
                <input
                  type="tel"
                  inputMode="numeric"
                  className="input phone-input"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  disabled={otpSent}
                />
              </div>
            </div>

            {!otpSent ? (
              <>
                {/* Password */}
                <div className="field-group" style={{ marginBottom: 8 }}>
                  <label className="field-label">Password</label>
                  <div className="password-wrap">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input"
                      placeholder="Enter your password"
                      maxLength={16}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button className="eye-btn" type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <Link href="/forgot-password" style={{ display: 'block', textAlign: 'right', marginBottom: 20, fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>
                  Forgot Password?
                </Link>

                <button
                  className="btn btn-primary btn-full btn-lg"
                  onClick={handlePasswordLogin}
                  disabled={loading}
                  style={{ marginBottom: 16 }}
                >
                  {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Continue'}
                </button>

                <div className="divider" style={{ marginBottom: 16 }}>OR</div>

                <button
                  className="btn btn-full"
                  style={{
                    border: '2px solid var(--color-success)',
                    background: 'rgba(16,185,129,0.06)',
                    color: 'var(--color-success)',
                    fontWeight: 800,
                    padding: '16px',
                    borderRadius: 14,
                  }}
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  🔐 Login with OTP · No password needed
                </button>
              </>
            ) : (
              <>
                <div style={{
                  background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)',
                  borderRadius: 12, padding: '10px 14px', marginBottom: 16,
                  fontSize: 13, color: 'var(--color-primary)', fontWeight: 600,
                }}>✅ OTP sent to +91 {phone}</div>

                <div className="field-group" style={{ marginBottom: 20 }}>
                  <label className="field-label">Enter OTP</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    className="input"
                    placeholder="4–6 digit OTP"
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{ textAlign: 'center', fontSize: 20, letterSpacing: 8, fontWeight: 800 }}
                  />
                </div>

                <button
                  className="btn btn-primary btn-full btn-lg"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  style={{ marginBottom: 12 }}
                >
                  {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Verify & Login'}
                </button>

                <button
                  className="btn btn-ghost btn-full"
                  onClick={() => { setOtpSent(false); setOtp(''); setError(''); }}
                  style={{ fontSize: 13 }}
                >
                  ← Back to password login
                </button>
              </>
            )}
          </div>

          {/* Register link */}
          <div className="divider" style={{ margin: '24px 0 16px' }}>NEW USER?</div>
          <Link href="/register">
            <div className="glass-card" style={{
              padding: '18px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer',
            }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: 15 }}>Create an Account</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Connect with local pharmacy, book blood & more</div>
              </div>
              <span style={{ fontSize: 22, color: 'var(--color-primary)' }}>›</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
