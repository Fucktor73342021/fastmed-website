'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { uploadPrescription } from '../../../lib/api';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot, query, where, doc, onSnapshot as docSnapshot } from 'firebase/firestore';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://api.flashmed.in';

/* ── Geohash encoder (same logic as the app) ── */
const GH_BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';
function encodeGeohash(lat: number, lng: number, precision = 5): string | null {
  try {
    if (!isFinite(lat) || !isFinite(lng)) return null;
    let mnLat = -90, mxLat = 90, mnLng = -180, mxLng = 180;
    let hash = '', bits = 0, hv = 0, isEven = true;
    while (hash.length < precision) {
      if (isEven) {
        const m = (mnLng + mxLng) / 2;
        if (lng >= m) { hv = (hv << 1) | 1; mnLng = m; } else { hv <<= 1; mxLng = m; }
      } else {
        const m = (mnLat + mxLat) / 2;
        if (lat >= m) { hv = (hv << 1) | 1; mnLat = m; } else { hv <<= 1; mxLat = m; }
      }
      isEven = !isEven; bits++;
      if (bits === 5) { hash += GH_BASE32[hv]; bits = 0; hv = 0; }
    }
    return hash || null;
  } catch { return null; }
}

const LAB_TESTS = [
  { id: 'cbc', name: 'Complete Blood Count (CBC)', desc: 'Full blood health snapshot', fasting: 'Not required', time: 'Same day' },
  { id: 'lipid', name: 'Lipid Profile', desc: 'Heart disease risk assessment', fasting: '10-12 hours', time: 'Same day' },
  { id: 'thyroid', name: 'Thyroid Profile (T3, T4, TSH)', desc: 'Thyroid function check', fasting: 'Not required', time: 'Same day' },
  { id: 'diabetes', name: 'Diabetes Screening (HbA1c)', desc: '3-month blood sugar average', fasting: 'Not required', time: 'Same day' },
  { id: 'liver', name: 'Liver Function Test', desc: 'Liver health evaluation', fasting: 'Not required', time: '24 hours' },
  { id: 'kidney', name: 'Kidney Function Test', desc: 'Kidney filtration check', fasting: 'Not required', time: '24 hours' },
  { id: 'vitamin_d', name: 'Vitamin D Total', desc: 'Bone health & immunity', fasting: 'Not required', time: '48 hours' },
  { id: 'full_body', name: 'Full Body Basic', desc: '30+ parameters covered', fasting: '10-12 hours', time: '24 hours' },
];

const LAB_SLOTS = [
  { id: '07-09', label: '7:00 – 9:00 AM' },
  { id: '09-12', label: '9:00 AM – 12:00 PM' },
  { id: '12-15', label: '12:00 – 3:00 PM' },
  { id: '15-18', label: '3:00 – 6:00 PM' },
  { id: '18-20', label: '6:00 – 8:00 PM' },
];

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  /* ── Form state ── */
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState<string | null>(null);
  const [houseNo, setHouseNo] = useState('');
  const [locality, setLocality] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [district, setDistrict] = useState('');
  const [note, setNote] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [coordinates, setCoordinates] = useState<{latitude: number; longitude: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Lab order state ── */
  const [labModalOpen, setLabModalOpen] = useState(false);
  const [labFile, setLabFile] = useState<File | null>(null);
  const [labPreview, setLabPreview] = useState<string | null>(null);
  const [labHouseNo, setLabHouseNo] = useState('');
  const [labLocality, setLabLocality] = useState('');
  const [labLandmark, setLabLandmark] = useState('');
  const [labPinCode, setLabPinCode] = useState('');
  const [labDistrict, setLabDistrict] = useState('');
  const [labNote, setLabNote] = useState('');
  const [labDate, setLabDate] = useState('');
  const [labSlot, setLabSlot] = useState('09-12');
  const [labSubmitting, setLabSubmitting] = useState(false);
  const labSubmittingRef = useRef(false);
  const labFileRef = useRef<HTMLInputElement>(null);

  /* ── Wallet strip ── */
  const [walletStrip, setWalletStrip] = useState({ cashback: 0, referral: 0, refund: 0 });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [featureFlags, setFeatureFlags] = useState({
    pharmacy_enabled: true,
    blood_sos_enabled: true,
    doctor_booking_enabled: true,
    lab_booking_enabled: true,
  });
  const [activeDoctorBookings, setActiveDoctorBookings] = useState<any[]>([]);

  /* ── Error/success ── */
  const [toast, setToast] = useState<{type: 'success'|'error'|'info'; title: string; msg: string} | null>(null);

  const showToast = (type: 'success'|'error'|'info', title: string, msg = '') => {
    setToast({ type, title, msg });
    setTimeout(() => setToast(null), 4000);
  };

  /* ── Load wallet + feature flags from Firestore ── */
  useEffect(() => {
    if (!user?.uid) return;
    let unsub: (() => void) | null = null;
    try {
      unsub = docSnapshot(doc(db, 'wallets', user.uid), (snap) => {
        if (!snap.exists()) return;
        const d = snap.data();
        setWalletStrip({
          cashback: Number(d.cashbackBalance) || 0,
          referral: Number(d.referralBalance) || 0,
          refund: Number(d.refundBalance) || 0,
        });
        setIsSubscribed(!!d.isSubscribed);
      });
    } catch {}
    return () => { try { unsub?.(); } catch {} };
  }, [user?.uid]);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    try {
      unsub = docSnapshot(doc(db, 'appConfig', 'featureFlags'), (snap) => {
        if (snap.exists()) {
          setFeatureFlags(prev => ({ ...prev, ...snap.data() }));
        }
      });
    } catch {}
    return () => { try { unsub?.(); } catch {} };
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    let unsub: (() => void) | null = null;
    try {
      const ACTIVE = new Set(['BOOKING_SENT', 'PAYMENT_PENDING', 'BOOKING_CONFIRMED', 'VISITED', 'RESCHEDULED']);
      const q = query(collection(db, 'doctorBookings'), where('customerId', '==', user.uid));
      unsub = onSnapshot(q, (snap) => {
        const list = snap.docs.map(d => ({ ...(d.data() as any), id: d.id }))
          .filter(b => ACTIVE.has(String(b?.status || '').toUpperCase()));
        setActiveDoctorBookings(list);
      });
    } catch {}
    return () => { try { unsub?.(); } catch {} };
  }, [user?.uid]);

  /* ── Auto-fill address from profile ── */
  useEffect(() => {
    if (!user) return;
    const addr = user.defaultAddress === 'work' ? user.workAddress
      : user.defaultAddress === 'other' ? user.otherAddress
      : user.homeAddress;
    if (addr?.houseNo) {
      setHouseNo(addr.houseNo || '');
      setLocality(addr.locality || '');
      setLandmark(addr.landmark || '');
      setPinCode(addr.pinCode || '');
      setDistrict(addr.district || '');
    }
  }, [user]);

  /* ── GPS ── */
  const fetchLocation = useCallback(async () => {
    if (!navigator.geolocation) { showToast('error', 'Not supported', 'Geolocation not available in this browser'); return; }
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setCoordinates({ latitude, longitude });
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, { headers: { 'User-Agent': 'flashmed-web/1.0' } });
        const data = await res.json();
        if (data.address) {
          const a = data.address;
          setHouseNo(a.house_number ? `${a.house_number}, ${a.road || ''}` : (a.road || a.amenity || ''));
          setLocality(a.suburb || a.neighbourhood || a.city_district || a.town || '');
          setLandmark(a.building || a.leisure || '');
          setPinCode(a.postcode || '');
          setDistrict(a.city || a.county || a.state_district || '');
          showToast('success', 'Location fetched', 'Please verify and edit if needed');
        }
      } catch {}
      setFetchingLocation(false);
    }, () => {
      showToast('error', 'Location denied', 'Please allow location access and try again');
      setFetchingLocation(false);
    }, { enableHighAccuracy: true, timeout: 15000 });
  }, []);

  /* ── File pick ── */
  const handleFileChange = (file: File | null | undefined) => {
    if (!file) return;
    setPrescriptionFile(file);
    const url = URL.createObjectURL(file);
    setPrescriptionPreview(url);
  };

  const handleLabFileChange = (file: File | null | undefined) => {
    if (!file) return;
    setLabFile(file);
    const url = URL.createObjectURL(file);
    setLabPreview(url);
  };

  /* ── Submit pharmacy order ── */
  const handleSubmitOrder = async () => {
    if (isSubmittingRef.current) return;
    if (!prescriptionFile) { showToast('error', 'Missing', 'Please upload your prescription first'); return; }
    if (!houseNo.trim() && !locality.trim()) { showToast('error', 'Missing', 'Please enter house no. and locality'); return; }
    if (!coordinates) { showToast('error', 'Location required', 'Please fetch your location using GPS first'); return; }

    isSubmittingRef.current = true;
    setOrderSubmitting(true);

    const token = user?.token || localStorage.getItem('fm_token') || '';
    try {
      /* 1. Upload prescription */
      let prescriptionUri = '';
      try {
        const result = await uploadPrescription(prescriptionFile, token);
        prescriptionUri = result.prescriptionUri;
      } catch (err: any) {
        showToast('error', 'Upload Failed', err.message || 'Could not upload prescription');
        return;
      }

      const idemKey = 'phm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
      const snap = { houseNo: houseNo.trim(), locality: locality.trim(), landmark: landmark.trim(), pinCode: pinCode.trim(), district: district.trim(), note: note.trim(), deliveryPhone: deliveryPhone.trim() };
      const fullAddress = `${snap.houseNo}, ${snap.locality}${snap.landmark ? ', Near ' + snap.landmark : ''}, ${snap.district} - ${snap.pinCode}`.trim();
      const uid = user?.uid || 'guest';

      /* 2. Place order */
      const res = await fetch(`${BACKEND}/api/orders/place-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Idempotency-Key': idemKey,
        },
        body: JSON.stringify({
          prescriptionUri,
          coordinates,
          address: { houseNo: snap.houseNo, locality: snap.locality, landmark: snap.landmark, pinCode: snap.pinCode, district: snap.district },
          note: snap.note,
          deliveryPhone: snap.deliveryPhone || undefined,
          paymentMethod: 'online',
          orderServiceType: 'pharmacy',
          customerName: user?.name || 'Customer',
          customerPhone: user?.phoneNumber || uid,
        }),
      });

      const j = await res.json().catch(() => ({}));
      if (res.ok && j?.orderId) {
        showToast('success', '🎉 Order Placed!', 'Nearby pharmacies are being notified!');
        setPrescriptionFile(null); setPrescriptionPreview(null);
        setHouseNo(''); setLocality(''); setLandmark(''); setPinCode(''); setDistrict(''); setNote(''); setDeliveryPhone('');
        setCoordinates(null);
        setTimeout(() => router.push('/orders'), 1500);
      } else {
        showToast('error', 'Order Failed', j?.error || 'Something went wrong. Please try again.');
      }
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Could not place order');
    } finally {
      setOrderSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  /* ── Submit lab order ── */
  const handleSubmitLabOrder = async () => {
    if (labSubmittingRef.current) return;
    if (!labFile) { showToast('error', 'Missing', 'Please upload your test prescription'); return; }
    if (!labHouseNo.trim() && !labLocality.trim()) { showToast('error', 'Missing', 'Enter address details'); return; }
    if (!labDate) { showToast('error', 'Missing', 'Choose a preferred collection date'); return; }
    const d = new Date(labDate + 'T12:00:00');
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (d < today) { showToast('error', 'Invalid date', 'Choose today or a future date'); return; }

    labSubmittingRef.current = true;
    setLabSubmitting(true);

    const token = user?.token || localStorage.getItem('fm_token') || '';
    try {
      const result = await uploadPrescription(labFile, token);
      const prescriptionUri = result.prescriptionUri;
      const idemKey = 'lab_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
      const labSnap = { houseNo: labHouseNo.trim(), locality: labLocality.trim(), landmark: labLandmark.trim(), pinCode: labPinCode.trim(), district: labDistrict.trim(), note: labNote.trim() };

      const res = await fetch(`${BACKEND}/api/orders/place-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Idempotency-Key': idemKey },
        body: JSON.stringify({
          prescriptionUri,
          coordinates: null,
          address: { houseNo: labSnap.houseNo, locality: labSnap.locality, landmark: labSnap.landmark, pinCode: labSnap.pinCode, district: labSnap.district },
          note: labSnap.note,
          paymentMethod: 'online',
          orderServiceType: 'lab',
          labPreferredDate: labDate,
          labPreferredSlot: labSlot,
          customerName: user?.name || 'Customer',
          customerPhone: user?.phoneNumber || user?.uid || 'guest',
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j?.orderId) {
        showToast('success', '✅ Lab Request Submitted!', 'Nearby labs will contact you to confirm');
        setLabFile(null); setLabPreview(null);
        setLabHouseNo(''); setLabLocality(''); setLabLandmark(''); setLabPinCode(''); setLabDistrict(''); setLabNote(''); setLabDate(''); setLabSlot('09-12');
        setLabModalOpen(false);
        setTimeout(() => router.push('/orders'), 1500);
      } else {
        showToast('error', 'Submission Failed', j?.error || 'Please try again');
      }
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Could not submit lab order');
    } finally {
      setLabSubmitting(false);
      labSubmittingRef.current = false;
    }
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 21) return 'Good evening';
    return 'Good night';
  };

  const SERVICE_CARDS = [
    {
      icon: '💊', title: 'Healthcare Product',
      subtitle: featureFlags.pharmacy_enabled ? 'Upload prescription · Local pharmacy delivers' : 'Currently unavailable',
      color: featureFlags.pharmacy_enabled ? '#059669' : '#6B7280',
      bg: featureFlags.pharmacy_enabled ? 'linear-gradient(135deg, #059669, #047857)' : 'linear-gradient(135deg, #6B7280, #4B5563)',
      action: () => { if (!featureFlags.pharmacy_enabled) { showToast('error', 'Service Unavailable', 'Healthcare ordering is temporarily unavailable'); return; } document.getElementById('rx-upload')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); },
    },
    {
      icon: '🩸', title: 'Blood Bank',
      subtitle: featureFlags.blood_sos_enabled ? 'Emergency SOS · 24/7 blood availability' : 'Currently unavailable',
      color: featureFlags.blood_sos_enabled ? '#DC2626' : '#6B7280',
      bg: featureFlags.blood_sos_enabled ? 'linear-gradient(135deg, #DC2626, #B91C1C)' : 'linear-gradient(135deg, #6B7280, #4B5563)',
      action: () => {
        if (!featureFlags.blood_sos_enabled) { showToast('error', 'Service Unavailable', 'Blood SOS is temporarily unavailable'); return; }
        router.push('/blood-sos');
      },
    },
    {
      icon: '🩺', title: 'Doctor',
      subtitle: featureFlags.doctor_booking_enabled ? 'Nearby clinics & appointments' : 'Currently unavailable',
      color: featureFlags.doctor_booking_enabled ? '#2563EB' : '#6B7280',
      bg: featureFlags.doctor_booking_enabled ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' : 'linear-gradient(135deg, #6B7280, #4B5563)',
      badge: featureFlags.doctor_booking_enabled ? 'New' : undefined,
      action: () => { if (!featureFlags.doctor_booking_enabled) { showToast('error', 'Service Unavailable', 'Doctor booking is temporarily unavailable'); return; } router.push('/doctor'); },
    },
    {
      icon: '🔬', title: 'Lab Tests',
      subtitle: featureFlags.lab_booking_enabled ? 'Home sample collection' : 'Currently unavailable',
      color: featureFlags.lab_booking_enabled ? '#7C3AED' : '#6B7280',
      bg: featureFlags.lab_booking_enabled ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'linear-gradient(135deg, #6B7280, #4B5563)',
      badge: featureFlags.lab_booking_enabled ? 'New' : undefined,
      action: () => { if (!featureFlags.lab_booking_enabled) { showToast('error', 'Service Unavailable', 'Lab booking is temporarily unavailable'); return; } setLabModalOpen(true); },
    },
  ];

  const totalWallet = walletStrip.cashback + walletStrip.referral + walletStrip.refund;

  return (
    <div className="page-content">
      {/* ── Toast ── */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type} animate-bounce-in`}>
            <div className="toast-icon">{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}</div>
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              {toast.msg && <div className="toast-msg">{toast.msg}</div>}
            </div>
            <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 16 }}>✕</button>
          </div>
        </div>
      )}

      {/* ── Loading Overlay ── */}
      {orderSubmitting && (
        <div className="loading-overlay">
          <div className="loading-card">
            <div style={{ fontSize: 40 }}>💊</div>
            <div className="spinner spinner-lg" />
            <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--color-text)', textAlign: 'center' }}>Placing Your Order</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center' }}>Uploading prescription and notifying nearby pharmacies…</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(5,150,105,0.10)', borderRadius: 20, padding: '8px 16px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', animation: 'pulse 1s ease infinite' }} />
              <span style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 700 }}>Please wait — do not close this tab</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero / Greeting ── */}
      <div className="fade-up" style={{ marginBottom: 24 }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          borderRadius: 24, padding: '28px 28px', color: 'white',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 14, opacity: 0.85, fontWeight: 600, marginBottom: 4 }}>{getGreeting()},</p>
            <h1 className="h3" style={{ color: 'white', marginBottom: 6 }}>{user?.name || 'Welcome'}! 👋</h1>
            <p style={{ opacity: 0.80, fontSize: 14 }}>
              {user?.homeAddress?.locality || user?.homeAddress?.district ? `📍 ${user.homeAddress.locality || user.homeAddress.district}` : 'What do you need today?'}
            </p>
            {isSubscribed && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(212,175,55,0.25)', borderRadius: 20, padding: '5px 14px', marginTop: 12, border: '1px solid rgba(212,175,55,0.40)' }}>
                <span>⭐</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#FCD34D' }}>FlashMed Premium Member</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Offers / delivery strip ── */}
      <div className="glass-card fade-up" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(5,150,105,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>⚡</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--color-text)' }}>10–40 Min Delivery</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{user?.homeAddress?.locality || user?.homeAddress?.district || 'Your area'} · Verified Pharmacies</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={fetchLocation} disabled={fetchingLocation}>
          {fetchingLocation ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : '📍 GPS'}
        </button>
      </div>

      {/* ── Active Doctor Booking Banner ── */}
      {activeDoctorBookings.map((booking) => {
        const STATUS_LABELS: Record<string, string> = { BOOKING_SENT: 'Pending', PAYMENT_PENDING: 'Awaiting Payment', BOOKING_CONFIRMED: 'Confirmed ✓', VISITED: 'Visit in Progress' };
        const STATUS_COLORS: Record<string, string> = { BOOKING_SENT: '#F59E0B', PAYMENT_PENDING: '#EF4444', BOOKING_CONFIRMED: '#10B981', VISITED: '#8B5CF6' };
        const status = String(booking.status || '').toUpperCase();
        return (
          <div key={booking.id} className="glass-card fade-up" style={{ padding: '16px 20px', marginBottom: 16, cursor: 'pointer', borderLeft: '4px solid #2563EB' }} onClick={() => router.push('/orders')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 24 }}>🩺</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Dr. {booking.doctorName || 'Doctor'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span className="badge" style={{ background: `${STATUS_COLORS[status] || '#6B7280'}20`, color: STATUS_COLORS[status] || '#6B7280' }}>
                    {STATUS_LABELS[status] || booking.status}
                  </span>
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); router.push('/orders'); }}>View →</button>
            </div>
          </div>
        );
      })}

      {/* ── 4 Service Cards ── */}
      <div className="grid-2 fade-up" style={{ marginBottom: 24, gap: 16 }}>
        {SERVICE_CARDS.map((card) => (
          <button
            key={card.title}
            className="service-card"
            style={{ background: card.bg, boxShadow: `0 16px 40px ${card.color}40`, border: 'none' }}
            onClick={card.action}
          >
            {card.badge && <div className="service-badge">{card.badge}</div>}
            <div className="service-card-icon">{card.icon}</div>
            <div>
              <div className="service-card-title">{card.title}</div>
              <div className="service-card-subtitle">{card.subtitle}</div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Wallet Strip ── */}
      {totalWallet > 0 && (
        <div className="glass-card fade-up" style={{ padding: '16px 20px', marginBottom: 20, cursor: 'pointer' }} onClick={() => router.push('/wallet')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>💰 Wallet</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Tap for details · updates live</div>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {walletStrip.cashback > 0 && <div style={{ textAlign: 'right' }}><div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-success)' }}>₹{walletStrip.cashback.toFixed(0)}</div><div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Savings</div></div>}
              {walletStrip.referral > 0 && <div style={{ textAlign: 'right' }}><div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-primary)' }}>₹{walletStrip.referral.toFixed(0)}</div><div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Referral</div></div>}
              {walletStrip.refund > 0 && <div style={{ textAlign: 'right' }}><div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-warning)' }}>₹{walletStrip.refund.toFixed(0)}</div><div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Refund</div></div>}
              <span style={{ color: 'var(--color-primary)', fontSize: 20 }}>›</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Refer & Earn ── */}
      <div className="glass-card fade-up" style={{ padding: '18px 20px', marginBottom: 24, cursor: 'pointer' }} onClick={() => router.push('/referral')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🎁</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Refer & Earn</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>₹100 credit after friend completes 3 orders of ₹500+</div>
          </div>
          <span style={{ color: 'var(--color-primary)', fontSize: 22, fontWeight: 700 }}>›</span>
        </div>
        {user?.referralCode && (
          <div style={{ marginTop: 12, background: 'rgba(99,102,241,0.08)', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)' }}>Your code:</span>
            <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: 2, color: 'var(--color-accent)' }}>{user.referralCode}</span>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
           PRESCRIPTION UPLOAD + ORDER FORM
           ═══════════════════════════════════════════════════════════ */}
      <div id="rx-upload" className="glass-card fade-up" style={{ padding: '24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(5,150,105,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📋</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>Upload Prescription</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Order medicines from local pharmacies</div>
          </div>
        </div>

        {/* Upload Zone */}
        {!prescriptionPreview ? (
          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files?.[0]); }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon">📸</div>
            <div className="upload-title">Drag & drop or click to upload</div>
            <div className="upload-sub">JPG, PNG or PDF · Max 10 MB</div>
            <input ref={fileInputRef} type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={e => handleFileChange(e.target.files?.[0])} />
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            {prescriptionFile?.type === 'application/pdf' ? (
              <div style={{ background: 'var(--color-surface)', borderRadius: 14, padding: '20px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📄</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{prescriptionFile.name}</div>
              </div>
            ) : (
              <img src={prescriptionPreview} alt="Prescription" style={{ width: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: 14, border: '1px solid var(--color-border)' }} />
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => { setPrescriptionFile(null); setPrescriptionPreview(null); }} style={{ flex: 1, color: 'var(--color-error)', borderColor: 'rgba(239,68,68,0.30)' }}>
                🔄 Re-upload
              </button>
            </div>
            <div style={{ marginTop: 10, background: 'rgba(16,185,129,0.08)', borderRadius: 10, padding: '8px 14px', fontSize: 13, color: 'var(--color-success)', fontWeight: 600 }}>
              ✅ Prescription ready to submit
            </div>
          </div>
        )}

        {/* Address form */}
        <div style={{ marginTop: 20, borderTop: '1px solid var(--color-border)', paddingTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>📍 Delivery Address</div>
            <button className="btn btn-primary btn-sm" onClick={fetchLocation} disabled={fetchingLocation}>
              {fetchingLocation ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : '🎯 Use GPS'}
            </button>
          </div>

          {/* Saved addresses quick-fill */}
          {user?.homeAddress?.houseNo && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {user.homeAddress?.houseNo && (
                <button className="btn btn-ghost btn-sm" onClick={() => { const a = user.homeAddress!; setHouseNo(a.houseNo||''); setLocality(a.locality||''); setLandmark(a.landmark||''); setPinCode(a.pinCode||''); setDistrict(a.district||''); }}>
                  🏠 Home
                </button>
              )}
              {user.workAddress?.houseNo && (
                <button className="btn btn-ghost btn-sm" onClick={() => { const a = user.workAddress!; setHouseNo(a.houseNo||''); setLocality(a.locality||''); setLandmark(a.landmark||''); setPinCode(a.pinCode||''); setDistrict(a.district||''); }}>
                  🏢 Work
                </button>
              )}
            </div>
          )}

          {coordinates && (
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.20)', borderRadius: 10, padding: '8px 14px', marginBottom: 14, fontSize: 12, color: 'var(--color-success)', fontWeight: 600 }}>
              📌 Location pinned: {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="field-group">
              <label className="field-label">House / Flat No. *</label>
              <input className="input" placeholder="e.g. Flat 204, Block A" value={houseNo} onChange={e => setHouseNo(e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Locality / Area *</label>
              <input className="input" placeholder="e.g. Salt Lake, Sector V" value={locality} onChange={e => setLocality(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="field-group">
              <label className="field-label">Landmark</label>
              <input className="input" placeholder="Near hospital" value={landmark} onChange={e => setLandmark(e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">PIN Code</label>
              <input className="input" inputMode="numeric" maxLength={6} placeholder="700001" value={pinCode} onChange={e => setPinCode(e.target.value.replace(/\D/g, ''))} />
            </div>
            <div className="field-group">
              <label className="field-label">District</label>
              <input className="input" placeholder="Kolkata" value={district} onChange={e => setDistrict(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div className="field-group">
              <label className="field-label">Special Note (Optional)</label>
              <input className="input" placeholder="Any special instructions…" value={note} onChange={e => setNote(e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Alternate Phone (Optional)</label>
              <input className="input" inputMode="numeric" maxLength={10} placeholder="Delivery contact" value={deliveryPhone} onChange={e => setDeliveryPhone(e.target.value.replace(/\D/g, ''))} />
            </div>
          </div>

          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={handleSubmitOrder}
            disabled={orderSubmitting || !prescriptionFile}
            style={{ fontSize: 17, fontWeight: 800 }}
          >
            {orderSubmitting ? <span className="spinner" style={{ width: 22, height: 22, borderWidth: 3 }} /> : '🚀 Place Order'}
          </button>

          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 10 }}>
            FlashMed is a technology intermediary. Licensed pharmacy partners fulfill your order.
          </p>
        </div>
      </div>

      {/* ── Lab Tests Info Cards ── */}
      <div className="fade-up" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="h4">🔬 Popular Lab Tests</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => setLabModalOpen(true)}>Book Now →</button>
        </div>
        <div className="carousel">
          {LAB_TESTS.map((test) => (
            <div key={test.id} className="carousel-item" style={{ width: 220 }}>
              <div className="glass-card" style={{ padding: '16px', height: '100%' }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: 'var(--color-text)' }}>{test.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>{test.desc}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(5,150,105,0.10)', color: 'var(--color-primary)', borderRadius: 8, padding: '2px 8px' }}>⏱ {test.time}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(245,158,11,0.10)', color: '#D97706', borderRadius: 8, padding: '2px 8px' }}>🍽 {test.fasting}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
           LAB ORDER MODAL
           ═══════════════════════════════════════════════════════════ */}
      {labModalOpen && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setLabModalOpen(false); }}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">🔬 Book Lab Test</h2>
              <button className="modal-close" onClick={() => setLabModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              {/* Upload prescription */}
              <div style={{ marginBottom: 20 }}>
                <div className="field-label" style={{ marginBottom: 8 }}>Upload Doctor's Prescription / Lab Order *</div>
                {!labPreview ? (
                  <div
                    className="upload-zone"
                    style={{ padding: '24px' }}
                    onClick={() => labFileRef.current?.click()}
                  >
                    <div className="upload-icon">🧪</div>
                    <div className="upload-title">Upload prescription</div>
                    <div className="upload-sub">JPG, PNG or PDF</div>
                    <input ref={labFileRef} type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={e => handleLabFileChange(e.target.files?.[0])} />
                  </div>
                ) : (
                  <div>
                    <img src={labPreview} alt="Lab Rx" style={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 12 }} />
                    <button className="btn btn-ghost btn-sm" style={{ marginTop: 8, width: '100%', color: 'var(--color-error)' }} onClick={() => { setLabFile(null); setLabPreview(null); }}>Re-upload</button>
                  </div>
                )}
              </div>

              {/* Preferred slot */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div className="field-group">
                  <label className="field-label">Preferred Date *</label>
                  <input type="date" className="input" min={new Date().toISOString().split('T')[0]} value={labDate} onChange={e => setLabDate(e.target.value)} />
                </div>
                <div className="field-group">
                  <label className="field-label">Time Slot</label>
                  <select className="input" value={labSlot} onChange={e => setLabSlot(e.target.value)} style={{ cursor: 'pointer' }}>
                    {LAB_SLOTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="field-label" style={{ marginBottom: 12 }}>Sample Collection Address *</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="field-group">
                  <label className="field-label">House / Flat No.</label>
                  <input className="input" placeholder="e.g. Flat 204" value={labHouseNo} onChange={e => setLabHouseNo(e.target.value)} />
                </div>
                <div className="field-group">
                  <label className="field-label">Locality / Area</label>
                  <input className="input" placeholder="e.g. Salt Lake" value={labLocality} onChange={e => setLabLocality(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="field-group">
                  <label className="field-label">Landmark</label>
                  <input className="input" placeholder="Near hospital" value={labLandmark} onChange={e => setLabLandmark(e.target.value)} />
                </div>
                <div className="field-group">
                  <label className="field-label">PIN Code</label>
                  <input className="input" inputMode="numeric" maxLength={6} placeholder="700001" value={labPinCode} onChange={e => setLabPinCode(e.target.value.replace(/\D/g, ''))} />
                </div>
                <div className="field-group">
                  <label className="field-label">District</label>
                  <input className="input" placeholder="Kolkata" value={labDistrict} onChange={e => setLabDistrict(e.target.value)} />
                </div>
              </div>

              <div className="field-group" style={{ marginBottom: 20 }}>
                <label className="field-label">Notes (Optional)</label>
                <input className="input" placeholder="Any special notes for the lab…" value={labNote} onChange={e => setLabNote(e.target.value)} />
              </div>

              <button
                className="btn btn-primary btn-full btn-lg"
                onClick={handleSubmitLabOrder}
                disabled={labSubmitting}
              >
                {labSubmitting ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : '✅ Submit Lab Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
