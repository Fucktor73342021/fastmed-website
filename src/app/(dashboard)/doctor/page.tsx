'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { uploadPrescription } from '../../../lib/api';
import { db } from '../../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://api.flashmed.in';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const SPECIALIZATIONS = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Orthopedic',
  'Pediatrician', 'Gynecologist', 'Neurologist', 'Diabetologist',
  'ENT Specialist', 'Ophthalmologist', 'Psychiatrist', 'Urologist',
];

export default function DoctorPage() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [specialization, setSpecialization] = useState('');
  const [searching, setSearching] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [toast, setToast] = useState<{type: string; msg: string} | null>(null);
  const [activeBookings, setActiveBookings] = useState<any[]>([]);

  const showToast = (type: 'success'|'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // Pre-fill patient info from user
  useEffect(() => {
    if (user) {
      setPatientName(user.name || '');
      setPatientPhone(String(user.phoneNumber || user.phone || '').replace('+91', ''));
    }
  }, [user]);

  // Real-time active bookings
  useEffect(() => {
    if (!user?.uid) return;
    let unsub: (() => void) | null = null;
    try {
      const ACTIVE = new Set(['BOOKING_SENT', 'PAYMENT_PENDING', 'BOOKING_CONFIRMED']);
      const q = query(collection(db, 'doctorBookings'), where('customerId', '==', user.uid));
      unsub = onSnapshot(q, snap => {
        setActiveBookings(snap.docs.map(d => ({ ...(d.data() as any), id: d.id })).filter((b: any) => ACTIVE.has(String(b.status||'').toUpperCase())));
      });
    } catch {}
    return () => { try { unsub?.(); } catch {} };
  }, [user?.uid]);

  const searchDoctors = async () => {
    setSearching(true);
    try {
      const token = user?.token || localStorage.getItem('fm_token') || '';
      const q = specialization ? `?specialization=${encodeURIComponent(specialization)}` : '';
      const res = await fetch(`${BACKEND}/api/doctors${q}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json().catch(() => ({ doctors: [] }));
        setDoctors(data.doctors || data || []);
      } else {
        setDoctors([]);
      }
    } catch { setDoctors([]); }
    setSearching(false);
  };

  useEffect(() => { searchDoctors(); }, []);

  const handleBooking = async () => {
    if (isSubmittingRef.current) return;
    if (!selectedDoctor) { showToast('error', 'Please select a doctor'); return; }
    if (!patientName.trim()) { showToast('error', 'Enter patient name'); return; }
    if (!symptoms.trim()) { showToast('error', 'Describe your symptoms'); return; }
    isSubmittingRef.current = true;
    setSubmitting(true);
    try {
      const token = user?.token || localStorage.getItem('fm_token') || '';
      const res = await fetch(`${BACKEND}/api/doctor-bookings/place-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          doctorId: selectedDoctor.id || selectedDoctor.uid,
          doctorName: selectedDoctor.name,
          patientName: patientName.trim(),
          patientPhone: patientPhone.trim(),
          symptoms: symptoms.trim(),
          preferredDate: preferredDate || undefined,
          preferredTime: preferredTime || undefined,
          note: note.trim() || undefined,
          customerId: user?.uid,
          customerName: user?.name,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showToast('success', '✅ Booking request sent! Doctor will contact you shortly.');
        setBookingOpen(false);
        setSymptoms(''); setNote(''); setPreferredDate(''); setPreferredTime('');
      } else {
        showToast('error', data.error || 'Booking failed. Try again.');
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
      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <div className="toast-icon">{toast.type === 'success' ? '✅' : '❌'}</div>
            <div className="toast-content"><div className="toast-title">{toast.msg}</div></div>
            <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>
        </div>
      )}

      <h1 className="page-title">Find a Doctor</h1>
      <p className="page-subtitle">Search nearby clinics · Book instant appointments</p>

      {/* Active bookings */}
      {activeBookings.map(b => (
        <div key={b.id} className="glass-card" style={{ padding: '16px 20px', marginBottom: 16, borderLeft: '4px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 28 }}>🩺</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800 }}>Dr. {b.doctorName}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Status: <strong style={{ color: 'var(--color-primary)' }}>{b.status}</strong></div>
            </div>
          </div>
        </div>
      ))}

      {/* Filter */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="field-group" style={{ flex: 1, minWidth: 200 }}>
            <label className="field-label">Specialization</label>
            <select className="input" value={specialization} onChange={e => setSpecialization(e.target.value)} style={{ cursor: 'pointer' }}>
              <option value="">All Specializations</option>
              {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={searchDoctors} disabled={searching} style={{ paddingTop: 14, paddingBottom: 14 }}>
            {searching ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : '🔍 Search'}
          </button>
        </div>
      </div>

      {/* Doctor List */}
      {searching ? (
        <div className="grid-3">
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 180, borderRadius: 14 }} />)}
        </div>
      ) : doctors.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🩺</div>
          <h3 className="h4" style={{ marginBottom: 8 }}>No doctors found in your area</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Try a different specialization or check back later</p>
        </div>
      ) : (
        <div className="grid-3" style={{ marginBottom: 24 }}>
          {doctors.map((doc: any) => (
            <div
              key={doc.id || doc.uid}
              className="glass-card"
              style={{
                padding: '20px',
                cursor: 'pointer',
                border: selectedDoctor?.id === doc.id ? '2px solid var(--color-primary)' : undefined,
                transform: selectedDoctor?.id === doc.id ? 'scale(1.02)' : undefined,
              }}
              onClick={() => { setSelectedDoctor(doc); setBookingOpen(true); }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, color: 'white', fontWeight: 800, flexShrink: 0,
                }}>
                  {doc.name?.charAt(0) || '👨‍⚕️'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>Dr. {doc.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 700, marginTop: 2 }}>{doc.specialization}</div>
                  {doc.qualification && <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{doc.qualification}</div>}
                  {doc.clinicAddress && <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>📍 {doc.clinicAddress}</div>}
                  {doc.consultationFee && <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-success)', marginTop: 6 }}>₹{doc.consultationFee} consultation</div>}
                </div>
              </div>
              <button
                className="btn btn-primary btn-full btn-sm"
                style={{ marginTop: 14 }}
                onClick={e => { e.stopPropagation(); setSelectedDoctor(doc); setBookingOpen(true); }}
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingOpen && selectedDoctor && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setBookingOpen(false); }}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">📅 Book: Dr. {selectedDoctor.name}</h2>
              <button className="modal-close" onClick={() => setBookingOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              {selectedDoctor.clinicAddress && <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 16 }}>📍 {selectedDoctor.clinicAddress}</p>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="field-group">
                  <label className="field-label">Patient Name *</label>
                  <input className="input" placeholder="Full name" value={patientName} onChange={e => setPatientName(e.target.value)} />
                </div>
                <div className="field-group">
                  <label className="field-label">Contact Phone *</label>
                  <div className="phone-row">
                    <div className="country-code">+91</div>
                    <input type="tel" className="input phone-input" maxLength={10} placeholder="10-digit number" value={patientPhone} onChange={e => setPatientPhone(e.target.value.replace(/\D/g, ''))} />
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">Symptoms / Reason *</label>
                  <textarea className="input" rows={3} placeholder="Describe your symptoms or reason for visit…" value={symptoms} onChange={e => setSymptoms(e.target.value)} style={{ resize: 'vertical', minHeight: 80 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="field-group">
                    <label className="field-label">Preferred Date</label>
                    <input type="date" className="input" min={new Date().toISOString().split('T')[0]} value={preferredDate} onChange={e => setPreferredDate(e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Preferred Time</label>
                    <input type="time" className="input" value={preferredTime} onChange={e => setPreferredTime(e.target.value)} />
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">Additional Note</label>
                  <input className="input" placeholder="Any other info for the doctor…" value={note} onChange={e => setNote(e.target.value)} />
                </div>
                {selectedDoctor.consultationFee && (
                  <div style={{ background: 'rgba(5,150,105,0.08)', borderRadius: 12, padding: '12px 16px', fontSize: 14, fontWeight: 700 }}>
                    💰 Consultation Fee: <span style={{ color: 'var(--color-primary)' }}>₹{selectedDoctor.consultationFee}</span>
                  </div>
                )}
                <button className="btn btn-primary btn-full btn-lg" onClick={handleBooking} disabled={submitting}>
                  {submitting ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : '📨 Send Booking Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
