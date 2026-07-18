'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { setToken } from '../../lib/api';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://api.flashmed.in';

export default function RegisterPage() {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [form, setForm] = useState({
    name: '', phone: '', password: '', confirmPassword: '',
    email: '', age: '', gender: '', bloodGroup: '',
  });
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const router = useRouter();

  const update = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Please enter your name'); return; }
    if (form.phone.length < 10) { setError('Enter a valid 10-digit phone number'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      // Send OTP first
      const otpRes = await fetch(`${BACKEND}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone, purpose: 'register' }),
      });
      const otpData = await otpRes.json().catch(() => ({ error: 'Failed' }));
      if (!otpRes.ok) { setError(otpData.error || 'Failed to send OTP'); return; }
      setSessionId(otpData.sessionId || '');
      setStep('otp');
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    if (otp.length < 4) { setError('Enter the OTP received'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone,
          password: form.password,
          email: form.email.trim() || undefined,
          age: form.age || undefined,
          gender: form.gender || undefined,
          bloodGroup: form.bloodGroup || undefined,
          role: 'customer',
          otp, sessionId,
        }),
      });
      const data = await res.json().catch(() => ({ error: 'Registration failed' }));
      if (!res.ok) { setError(data.error || 'Registration failed. Please try again.'); return; }
      setToken(data.token);
      setUser({ uid: 'user_' + form.phone, phoneNumber: '+91' + form.phone, ...data.user, token: data.token, firebaseToken: data.firebaseToken });
      router.replace('/home');
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="mesh-gradient"><div className="mesh-orb-3" /></div>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px', position: 'relative', zIndex: 5,
      }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'linear-gradient(135deg, #059669, #047857)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 30, margin: '0 auto 14px',
              boxShadow: '0 16px 40px rgba(5,150,105,0.30)',
            }}>💊</div>
            <h1 className="h2" style={{ color: 'var(--color-text)', marginBottom: 6 }}>
              {step === 'form' ? 'Create Account' : 'Verify Phone'}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
              {step === 'form' ? 'Join FlashMed — Healthcare fast' : `OTP sent to +91 ${form.phone}`}
            </p>
          </div>

          <div className="glass-card" style={{ padding: '28px', position: 'relative' }}>
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

            {step === 'form' ? (
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="field-group">
                  <label className="field-label">Full Name *</label>
                  <input className="input" placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => update('name', e.target.value)} required />
                </div>

                <div className="field-group">
                  <label className="field-label">Phone Number *</label>
                  <div className="phone-row">
                    <div className="country-code">+91</div>
                    <input type="tel" inputMode="numeric" className="input phone-input" placeholder="10-digit number" maxLength={10} value={form.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, ''))} required />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Email (Optional)</label>
                  <input type="email" className="input" placeholder="your@email.com" value={form.email} onChange={e => update('email', e.target.value)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="field-group">
                    <label className="field-label">Password *</label>
                    <input type="password" className="input" placeholder="Min 6 characters" maxLength={16} value={form.password} onChange={e => update('password', e.target.value)} required />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Confirm Password *</label>
                    <input type="password" className="input" placeholder="Re-enter password" maxLength={16} value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div className="field-group">
                    <label className="field-label">Age</label>
                    <input type="number" className="input" placeholder="25" min={1} max={120} value={form.age} onChange={e => update('age', e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Gender</label>
                    <select className="input" value={form.gender} onChange={e => update('gender', e.target.value)} style={{ cursor: 'pointer' }}>
                      <option value="">Select</option>
                      {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Blood Group</label>
                    <select className="input" value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)} style={{ cursor: 'pointer' }}>
                      <option value="">Select</option>
                      {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
                  {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Send OTP & Continue →'}
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="field-group">
                  <label className="field-label">Enter OTP</label>
                  <input
                    type="tel" inputMode="numeric" className="input"
                    placeholder="OTP received on your phone"
                    maxLength={6} value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{ textAlign: 'center', fontSize: 24, letterSpacing: 10, fontWeight: 800 }}
                    autoFocus
                  />
                </div>

                <button className="btn btn-primary btn-full btn-lg" onClick={handleVerifyAndRegister} disabled={loading}>
                  {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : '✅ Verify & Create Account'}
                </button>

                <button className="btn btn-ghost btn-full" onClick={() => { setStep('form'); setOtp(''); setError(''); }}>
                  ← Edit details
                </button>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, color: 'var(--color-text-muted)', fontSize: 14 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
