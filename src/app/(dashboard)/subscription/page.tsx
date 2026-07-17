'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://api.flashmed.in';

const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 99,
    period: 'month',
    features: ['Free delivery on all orders', '5% cashback on pharmacy', 'Priority support', 'Lab test discounts'],
    color: '#059669',
    bg: 'linear-gradient(135deg, #059669, #047857)',
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: 249,
    period: '3 months',
    features: ['All Monthly benefits', '8% cashback on pharmacy', 'Exclusive lab offers', 'Doctor consultation discount'],
    color: '#6366f1',
    bg: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    badge: 'Best Value',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 799,
    period: 'year',
    features: ['All Quarterly benefits', '12% cashback on pharmacy', 'Free lab tests (2/year)', 'Dedicated support line'],
    color: '#D97706',
    bg: 'linear-gradient(135deg, #D97706, #B45309)',
    badge: 'Best Deal',
  },
];

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [toast, setToast] = useState<{type: string; msg: string} | null>(null);

  const showToast = (type: 'success'|'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    let unsub: (() => void) | null = null;
    try {
      unsub = onSnapshot(doc(db, 'wallets', user.uid), (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setIsSubscribed(!!d.isSubscribed);
          setSubscriptionPlan(d.subscriptionPlan || '');
          if (d.subscriptionExpiry?.seconds) {
            const exp = new Date(d.subscriptionExpiry.seconds * 1000);
            setExpiryDate(exp.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }));
          }
        }
        setLoading(false);
      }, () => setLoading(false));
    } catch { setLoading(false); }
    return () => { try { unsub?.(); } catch {} };
  }, [user?.uid]);

  const handlePurchase = async (plan: typeof PLANS[0]) => {
    setPurchasing(true);
    try {
      const token = user?.token || localStorage.getItem('fm_token') || '';
      const res = await fetch(`${BACKEND}/api/subscription/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planId: plan.id, planName: plan.name, amount: plan.price }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.paymentUrl) {
        // Redirect to Cashfree / payment URL
        window.location.href = data.paymentUrl;
      } else {
        showToast('error', data.error || 'Could not initiate payment');
      }
    } catch {
      showToast('error', 'Connection error. Please try again.');
    } finally { setPurchasing(false); }
  };

  if (loading) {
    return (
      <div className="page-content">
        <h1 className="page-title">Subscription</h1>
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 20, marginBottom: 16 }} />)}
      </div>
    );
  }

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

      <h1 className="page-title">⭐ FlashMed Premium</h1>
      <p className="page-subtitle">Unlock cashback, free delivery, and exclusive benefits</p>

      {/* Active subscription */}
      {isSubscribed && (
        <div style={{
          background: 'linear-gradient(135deg, #D97706, #B45309)',
          borderRadius: 20, padding: '20px 24px', marginBottom: 24, color: 'white',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>⭐</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20 }}>Premium Member</span>
          </div>
          <div style={{ fontSize: 14, opacity: 0.85 }}>Plan: <strong>{subscriptionPlan || 'Active'}</strong></div>
          {expiryDate && <div style={{ fontSize: 13, opacity: 0.80, marginTop: 4 }}>Valid until: {expiryDate}</div>}
        </div>
      )}

      {/* Plans */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="glass-card"
            style={{
              padding: '24px',
              border: selectedPlan?.id === plan.id ? `2px solid ${plan.color}` : undefined,
              cursor: 'pointer',
              transform: selectedPlan?.id === plan.id ? 'scale(1.01)' : undefined,
            }}
            onClick={() => setSelectedPlan(plan)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20 }}>{plan.name}</span>
                  {plan.badge && <span className="badge" style={{ background: `${plan.color}20`, color: plan.color }}>{plan.badge}</span>}
                  {isSubscribed && subscriptionPlan === plan.name && <span className="badge badge-confirmed">Active</span>}
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>per {plan.period}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, color: plan.color }}>₹{plan.price}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: plan.color, fontWeight: 900, fontSize: 16 }}>✓</span>
                  <span style={{ fontSize: 14, color: 'var(--color-text)' }}>{f}</span>
                </div>
              ))}
            </div>

            <button
              className="btn btn-full"
              style={{ background: plan.bg, color: 'white', fontWeight: 800, boxShadow: `0 8px 24px ${plan.color}40` }}
              onClick={e => { e.stopPropagation(); handlePurchase(plan); }}
              disabled={purchasing}
            >
              {purchasing ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : isSubscribed ? `Upgrade to ${plan.name}` : `Get ${plan.name} Plan`}
            </button>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' }}>
        Payments secured by Cashfree · Cancel anytime · Instant activation
      </p>
    </div>
  );
}
