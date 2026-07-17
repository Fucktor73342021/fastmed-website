'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://api.flashmed.in';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodSOSPage() {
  const { user } = useAuth();
  const [requestType, setRequestType] = useState<'find' | 'sos'>('find');
  const [requiredBloodGroup, setRequiredBloodGroup] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [hospital, setHospital] = useState('');
  const [district, setDistrict] = useState('');
  const [units, setUnits] = useState('1');
  const [urgency, setUrgency] = useState<'URGENT' | 'CRITICAL' | 'NORMAL'>('URGENT');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [donors, setDonors] = useState<any[]>([]);
  const [loadingDonors, setLoadingDonors] = useState(false);
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [toast, setToast] = useState<{type: string; msg: string} | null>(null);

  const showToast = (type: 'success'|'error'|'info', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (user) {
      setPatientName(user.name || '');
      setPatientPhone(String(user.phoneNumber || '').replace('+91', ''));
      setDistrict(user.homeAddress?.district || '');
      if (user.bloodGroup) setRequiredBloodGroup(user.bloodGroup);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.uid) return;
    let unsub: (() => void) | null = null;
    try {
      const ACTIVE = new Set(['PENDING', 'BROADCAST', 'ACCEPTED']);
      const q = query(collection(db, 'bloodRequests'), where('requesterId', '==', user.uid));
      unsub = onSnapshot(q, snap => {
        setActiveRequests(snap.docs.map(d => ({ ...(d.data() as any), id: d.id })).filter((r: any) => ACTIVE.has(String(r.status||'').toUpperCase())));
      });
    } catch {}
    return () => { try { unsub?.(); } catch {} };
  }, [user?.uid]);

  const searchDonors = async () => {
    if (!requiredBloodGroup) { showToast('error', 'Select blood group'); return; }
    setLoadingDonors(true);
    try {
      const token = user?.token || localStorage.getItem('fm_token') || '';
      const res = await fetch(`${BACKEND}/api/blood/donors?bloodGroup=${encodeURIComponent(requiredBloodGroup)}&district=${encodeURIComponent(district || '')}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({ donors: [] }));
        setDonors(data.donors || data || []);
      } else { setDonors([]); }
    } catch { setDonors([]); }
    setLoadingDonors(false);
  };

  const handleSOS = async () => {
    if (isSubmittingRef.current) return;
    if (!requiredBloodGroup) { showToast('error', 'Select required blood group'); return; }
    if (!patientName.trim()) { showToast('error', 'Enter patient name'); return; }
    if (!hospital.trim()) { showToast('error', 'Enter hospital name'); return; }
    isSubmittingRef.current = true;
    setSubmitting(true);
    try {
      const token = user?.token || localStorage.getItem('fm_token') || '';
      const res = await fetch(`${BACKEND}/api/blood/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          bloodGroup: requiredBloodGroup,
          patientName: patientName.trim(),
          patientPhone: patientPhone.trim(),
          hospital: hospital.trim(),
          district: district.trim(),
          units: Number(units) || 1,
          urgency,
          note: note.trim() || undefined,
          requesterId: user?.uid,
          requesterName: user?.name,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showToast('success', '🩸 SOS Broadcast Sent! Nearby donors are being notified.');
        setNote(''); setHospital(''); setUnits('1');
      } else {
        showToast('error', data.error || 'Could not send SOS. Try again.');
      }
    } catch {
      showToast('error', 'Connection error. Please try again.');
    } finally {
      setSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

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

      <h1 className="page-title">🩸 Blood Bank</h1>
      <p className="page-subtitle">Emergency SOS · Find donors · 24/7 availability</p>

      {/* SOS Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
        borderRadius: 20, padding: '20px 24px', marginBottom: 24, color: 'white',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ fontSize: 28, marginBottom: 8 }}>🚨 Blood Emergency?</div>
        <p style={{ opacity: 0.85, fontSize: 14, marginBottom: 16 }}>Send an SOS broadcast to nearby verified blood donors instantly</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className={`btn btn-sm ${requestType === 'sos' ? 'btn-secondary' : ''}`}
            style={{ background: requestType === 'sos' ? 'white' : 'rgba(255,255,255,0.2)', color: requestType === 'sos' ? '#DC2626' : 'white', fontWeight: 800 }}
            onClick={() => setRequestType('sos')}
          >
            🩸 Send SOS
          </button>
          <button
            className="btn btn-sm"
            style={{ background: requestType === 'find' ? 'white' : 'rgba(255,255,255,0.2)', color: requestType === 'find' ? '#DC2626' : 'white', fontWeight: 800 }}
            onClick={() => setRequestType('find')}
          >
            🔍 Find Donor
          </button>
        </div>
      </div>

      {/* Active requests */}
      {activeRequests.map(r => (
        <div key={r.id} className="glass-card" style={{ padding: '16px 20px', marginBottom: 16, borderLeft: '4px solid #DC2626' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 28 }}>🩸</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800 }}>SOS: {r.bloodGroup} · {r.units} unit{Number(r.units) > 1 ? 's' : ''}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Status: <strong style={{ color: '#DC2626' }}>{r.status}</strong></div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>🏥 {r.hospital}</div>
            </div>
          </div>
        </div>
      ))}

      {requestType === 'sos' ? (
        <div className="glass-card" style={{ padding: '24px', marginBottom: 24 }}>
          <h2 className="h4" style={{ marginBottom: 20 }}>🆘 Emergency SOS Request</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field-group">
                <label className="field-label">Required Blood Group *</label>
                <select className="input" value={requiredBloodGroup} onChange={e => setRequiredBloodGroup(e.target.value)} style={{ cursor: 'pointer' }}>
                  <option value="">Select</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">Units Required</label>
                <input type="number" className="input" min={1} max={20} value={units} onChange={e => setUnits(e.target.value)} />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Patient Name *</label>
              <input className="input" placeholder="Patient's full name" value={patientName} onChange={e => setPatientName(e.target.value)} />
            </div>

            <div className="field-group">
              <label className="field-label">Contact Phone</label>
              <div className="phone-row">
                <div className="country-code">+91</div>
                <input type="tel" className="input phone-input" maxLength={10} value={patientPhone} onChange={e => setPatientPhone(e.target.value.replace(/\D/g, ''))} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field-group">
                <label className="field-label">Hospital Name *</label>
                <input className="input" placeholder="e.g. SSKM Hospital" value={hospital} onChange={e => setHospital(e.target.value)} />
              </div>
              <div className="field-group">
                <label className="field-label">District</label>
                <input className="input" placeholder="e.g. Kolkata" value={district} onChange={e => setDistrict(e.target.value)} />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Urgency Level</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['URGENT', 'CRITICAL', 'NORMAL'] as const).map(u => (
                  <button
                    key={u}
                    className={`btn btn-sm ${urgency === u ? 'btn-danger' : 'btn-ghost'}`}
                    style={urgency === u ? {} : { color: 'var(--color-text-muted)' }}
                    onClick={() => setUrgency(u)}
                  >{u}</button>
                ))}
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Additional Note</label>
              <input className="input" placeholder="Any extra information…" value={note} onChange={e => setNote(e.target.value)} />
            </div>

            <button
              className="btn btn-full btn-lg"
              style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)', color: 'white', boxShadow: '0 8px 24px rgba(220,38,38,0.35)' }}
              onClick={handleSOS}
              disabled={submitting}
            >
              {submitting ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : '🚨 Broadcast SOS Now'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="glass-card" style={{ padding: '20px', marginBottom: 24 }}>
            <h2 className="h4" style={{ marginBottom: 16 }}>🔍 Find Blood Donors</h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div className="field-group" style={{ flex: 1, minWidth: 140 }}>
                <label className="field-label">Blood Group</label>
                <select className="input" value={requiredBloodGroup} onChange={e => setRequiredBloodGroup(e.target.value)} style={{ cursor: 'pointer' }}>
                  <option value="">Any</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div className="field-group" style={{ flex: 1, minWidth: 140 }}>
                <label className="field-label">District</label>
                <input className="input" placeholder="e.g. Kolkata" value={district} onChange={e => setDistrict(e.target.value)} />
              </div>
              <button className="btn btn-primary" style={{ paddingTop: 14, paddingBottom: 14, alignSelf: 'flex-end' }} onClick={searchDonors} disabled={loadingDonors}>
                {loadingDonors ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : '🔍 Search'}
              </button>
            </div>
          </div>

          {loadingDonors ? (
            <div className="grid-3">{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 14 }} />)}</div>
          ) : donors.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🩸</div>
              <h3 className="h4">No donors found</h3>
              <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>Try a different blood group or use SOS to broadcast</p>
            </div>
          ) : (
            <div className="grid-3">
              {donors.map((donor: any) => (
                <div key={donor.id} className="glass-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 900, color: 'white',
                    }}>{donor.bloodGroup}</div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{donor.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>📍 {donor.district || 'Location available'}</div>
                      {donor.lastDonated && <div style={{ fontSize: 11, color: 'var(--color-text-light)' }}>Last donated: {donor.lastDonated}</div>}
                    </div>
                  </div>
                  {donor.phone && (
                    <a href={`tel:+91${donor.phone}`} className="btn btn-full btn-sm" style={{ background: 'rgba(220,38,38,0.10)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.30)', borderRadius: 10, textAlign: 'center', padding: '8px' }}>
                      📞 Call Donor
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
