'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://api.flashmed.in';

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const ADDRESS_TYPES = ['home', 'work', 'other'] as const;

interface AddrFields { houseNo: string; locality: string; landmark: string; pinCode: string; district: string; state: string; name: string; phone: string; }
const emptyAddr = (): AddrFields => ({ houseNo: '', locality: '', landmark: '', pinCode: '', district: '', state: '', name: '', phone: '' });

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [age, setAge] = useState(user?.age || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || '');
  const [defaultAddress, setDefaultAddress] = useState<'home'|'work'|'other'>(user?.defaultAddress as any || 'home');
  const [addresses, setAddresses] = useState<Record<string, AddrFields>>({
    home: { ...emptyAddr(), ...((user?.homeAddress as any) || {}) },
    work: { ...emptyAddr(), ...((user?.workAddress as any) || {}) },
    other: { ...emptyAddr(), ...((user?.otherAddress as any) || {}) },
  });
  const [activeAddrTab, setActiveAddrTab] = useState<typeof ADDRESS_TYPES[number]>('home');
  const [saving, setSaving] = useState(false);
  const [savingAddr, setSavingAddr] = useState(false);
  const [fetchingLoc, setFetchingLoc] = useState(false);
  const [toast, setToast] = useState<{type: string; msg: string} | null>(null);

  const showToast = (type: 'success'|'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync with Firestore live
  useEffect(() => {
    if (!user?.uid) return;
    let unsub: (() => void) | null = null;
    try {
      unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
        if (!snap.exists()) return;
        const d = snap.data();
        if (d.homeAddress) setAddresses(prev => ({ ...prev, home: { ...emptyAddr(), ...d.homeAddress } }));
        if (d.workAddress) setAddresses(prev => ({ ...prev, work: { ...emptyAddr(), ...d.workAddress } }));
        if (d.otherAddress) setAddresses(prev => ({ ...prev, other: { ...emptyAddr(), ...d.otherAddress } }));
        if (d.defaultAddress) setDefaultAddress(d.defaultAddress);
        if (d.name) setName(d.name);
        if (d.email) setEmail(d.email);
        if (d.age) setAge(d.age);
        if (d.gender) setGender(d.gender);
        if (d.bloodGroup) setBloodGroup(d.bloodGroup);
      });
    } catch {}
    return () => { try { unsub?.(); } catch {} };
  }, [user?.uid]);

  const updateAddrField = (key: keyof AddrFields, value: string) => {
    setAddresses(prev => ({ ...prev, [activeAddrTab]: { ...prev[activeAddrTab], [key]: value } }));
  };

  const fetchLocationForAddr = () => {
    if (!navigator.geolocation) { showToast('error', 'Geolocation not supported'); return; }
    setFetchingLoc(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, { headers: { 'User-Agent': 'flashmed-web/1.0' } });
        const data = await res.json();
        if (data.address) {
          const a = data.address;
          setAddresses(prev => ({
            ...prev,
            [activeAddrTab]: {
              ...prev[activeAddrTab],
              houseNo: a.house_number ? `${a.house_number}, ${a.road || ''}` : (a.road || ''),
              locality: a.suburb || a.neighbourhood || a.city_district || '',
              landmark: a.building || '',
              pinCode: a.postcode || '',
              district: a.city || a.county || '',
              state: a.state || '',
            }
          }));
          showToast('success', 'Location auto-filled. Please verify!');
        }
      } catch {}
      setFetchingLoc(false);
    }, () => { showToast('error', 'Location denied'); setFetchingLoc(false); }, { enableHighAccuracy: true });
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) { showToast('error', 'Name cannot be empty'); return; }
    setSaving(true);
    try {
      const token = user?.token || localStorage.getItem('fm_token') || '';
      const res = await fetch(`${BACKEND}/api/customer/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: name.trim(), email: email.trim() || undefined, age: age || undefined, gender: gender || undefined, bloodGroup: bloodGroup || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setUser({ ...user!, name: name.trim(), email: email.trim(), age, gender, bloodGroup });
        showToast('success', 'Profile updated successfully!');
      } else {
        showToast('error', data.error || 'Update failed');
      }
    } catch {
      showToast('error', 'Connection error');
    } finally { setSaving(false); }
  };

  const handleSaveAddress = async () => {
    const addr = addresses[activeAddrTab];
    if (!addr.houseNo.trim() && !addr.locality.trim()) { showToast('error', 'Enter at least house no. and locality'); return; }
    setSavingAddr(true);
    try {
      const token = user?.token || localStorage.getItem('fm_token') || '';
      const key = `${activeAddrTab}Address`;
      const res = await fetch(`${BACKEND}/api/customer/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ [key]: addr, defaultAddress }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setUser({ ...user!, [`${activeAddrTab}Address`]: addr, defaultAddress });
        showToast('success', 'Address saved!');
      } else {
        showToast('error', data.error || 'Address save failed');
      }
    } catch {
      showToast('error', 'Connection error');
    } finally { setSavingAddr(false); }
  };

  const addr = addresses[activeAddrTab];
  const ADDR_LABELS: Record<string, string> = { home: '🏠 Home', work: '🏢 Work', other: '📌 Other' };

  return (
    <div className="page-content">
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <div className="toast-icon">{toast.type === 'success' ? '✅' : '❌'}</div>
            <div className="toast-content"><div className="toast-title">{toast.msg}</div></div>
            <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>
        </div>
      )}

      <h1 className="page-title">My Profile</h1>
      <p className="page-subtitle">Update your personal information and addresses</p>

      {/* Avatar */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 900, color: 'white',
            boxShadow: 'var(--shadow-primary)', flexShrink: 0,
          }}>
            {name.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 20 }}>{user?.name || 'My Account'}</div>
            <div style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 2 }}>📱 +91 {String(user?.phoneNumber || '').replace('+91', '')}</div>
            {user?.referralCode && <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700, color: 'var(--color-accent)' }}>🎁 Ref: {user.referralCode}</div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div className="field-group">
            <label className="field-label">Full Name *</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">Email</label>
            <input type="email" className="input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div className="field-group">
            <label className="field-label">Age</label>
            <input type="number" className="input" min={1} max={120} value={age} onChange={e => setAge(e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">Gender</label>
            <select className="input" value={gender} onChange={e => setGender(e.target.value)} style={{ cursor: 'pointer' }}>
              <option value="">Select</option>
              {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">Blood Group</label>
            <select className="input" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} style={{ cursor: 'pointer' }}>
              <option value="">Select</option>
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
        </div>

        <button className="btn btn-primary btn-full" onClick={handleSaveProfile} disabled={saving}>
          {saving ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : '💾 Save Profile'}
        </button>
      </div>

      {/* Addresses */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="h4">📍 Delivery Addresses</h2>
          <button className="btn btn-primary btn-sm" onClick={fetchLocationForAddr} disabled={fetchingLoc}>
            {fetchingLoc ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : '🎯 GPS'}
          </button>
        </div>

        {/* Address type tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {ADDRESS_TYPES.map(t => (
            <button
              key={t}
              className={`btn btn-sm ${activeAddrTab === t ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveAddrTab(t)}
            >
              {ADDR_LABELS[t]}
              {defaultAddress === t && <span style={{ marginLeft: 6, fontSize: 10, background: 'rgba(255,255,255,0.3)', borderRadius: 6, padding: '1px 5px' }}>DEFAULT</span>}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div className="field-group">
            <label className="field-label">Recipient Name</label>
            <input className="input" placeholder="Name at this address" value={addr.name} onChange={e => updateAddrField('name', e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">Phone</label>
            <input type="tel" inputMode="numeric" className="input" placeholder="Contact number" maxLength={10} value={addr.phone} onChange={e => updateAddrField('phone', e.target.value.replace(/\D/g, ''))} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div className="field-group">
            <label className="field-label">House / Flat No.</label>
            <input className="input" placeholder="e.g. Flat 204, Block A" value={addr.houseNo} onChange={e => updateAddrField('houseNo', e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">Locality / Area</label>
            <input className="input" placeholder="e.g. Salt Lake Sector V" value={addr.locality} onChange={e => updateAddrField('locality', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div className="field-group">
            <label className="field-label">Landmark</label>
            <input className="input" placeholder="Near hospital" value={addr.landmark} onChange={e => updateAddrField('landmark', e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">PIN Code</label>
            <input inputMode="numeric" className="input" maxLength={6} placeholder="700001" value={addr.pinCode} onChange={e => updateAddrField('pinCode', e.target.value.replace(/\D/g, ''))} />
          </div>
          <div className="field-group">
            <label className="field-label">District</label>
            <input className="input" placeholder="Kolkata" value={addr.district} onChange={e => updateAddrField('district', e.target.value)} />
          </div>
        </div>

        <div className="field-group" style={{ marginBottom: 16 }}>
          <label className="field-label">State</label>
          <input className="input" placeholder="West Bengal" value={addr.state} onChange={e => updateAddrField('state', e.target.value)} />
        </div>

        <div className="field-group" style={{ marginBottom: 20 }}>
          <label className="field-label">Set as Default</label>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            {ADDRESS_TYPES.map(t => (
              <button
                key={t}
                className={`btn btn-sm ${defaultAddress === t ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setDefaultAddress(t)}
              >
                {ADDR_LABELS[t]} {defaultAddress === t && '✓'}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary btn-full" onClick={handleSaveAddress} disabled={savingAddr}>
          {savingAddr ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : '📍 Save Address'}
        </button>
      </div>

      {/* Account Actions */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: 24 }}>
        <h2 className="h4" style={{ marginBottom: 16 }}>Account</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a href="/subscription"><button className="btn btn-secondary btn-full" style={{ justifyContent: 'space-between' }}>⭐ Subscription <span>›</span></button></a>
          <a href="/referral"><button className="btn btn-secondary btn-full" style={{ justifyContent: 'space-between' }}>🎁 Referral Program <span>›</span></button></a>
          <a href="/wallet"><button className="btn btn-secondary btn-full" style={{ justifyContent: 'space-between' }}>💰 Wallet <span>›</span></button></a>
          <button
            className="btn btn-full"
            style={{ border: '1.5px solid rgba(239,68,68,0.30)', color: 'var(--color-error)', background: 'rgba(239,68,68,0.06)', justifyContent: 'center' }}
            onClick={logout}
          >
            🚪 Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
