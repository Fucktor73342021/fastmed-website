'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://api.flashmed.in';

export default function ReferralPage() {
  const { user } = useAuth();
  const [referralStats, setReferralStats] = useState({ totalReferred: 0, qualifiedReferrals: 0, totalEarned: 0, pendingEarnings: 0 });
  const [referralCode, setReferralCode] = useState(user?.referralCode || '');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    let unsub: (() => void) | null = null;
    try {
      unsub = onSnapshot(doc(db, 'referrals', user.uid), (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setReferralCode(d.referralCode || user?.referralCode || '');
          setReferralStats({
            totalReferred: Number(d.totalReferred) || 0,
            qualifiedReferrals: Number(d.qualifiedReferrals) || 0,
            totalEarned: Number(d.totalEarned) || 0,
            pendingEarnings: Number(d.pendingEarnings) || 0,
          });
        }
        setLoading(false);
      }, () => setLoading(false));
    } catch { setLoading(false); }
    return () => { try { unsub?.(); } catch {} };
  }, [user?.uid]);

  const handleCopy = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const el = document.createElement('textarea');
      el.value = referralCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareText = `🚀 Order medicines in 10 min with FlashMed!\nUse my code: ${referralCode || 'FLASHMED'} to get ₹50 off your first order.\nDownload: https://flashmed.in`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Join FlashMed', text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="page-content">
      <h1 className="page-title">🎁 Refer & Earn</h1>
      <p className="page-subtitle">Earn ₹100 for every friend who orders ₹500+ three times</p>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        borderRadius: 24, padding: '28px 24px', marginBottom: 24, color: 'white',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🎁</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, marginBottom: 8, letterSpacing: -0.5 }}>Invite Friends · Earn ₹100</h2>
          <p style={{ opacity: 0.85, fontSize: 14, lineHeight: 1.6 }}>
            Your friend gets ₹50 off their first order, and you earn ₹100 in wallet credit once they complete 3 orders of ₹500 or more.
          </p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: 24 }}>
        <h2 className="h4" style={{ marginBottom: 16 }}>Your Referral Code</h2>
        {!referralCode ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--color-text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
            <p style={{ marginTop: 12, fontSize: 13 }}>Loading your referral code…</p>
          </div>
        ) : (
          <>
            <div style={{
              background: 'var(--color-surface)',
              border: '2px dashed var(--color-border-strong)',
              borderRadius: 14, padding: '20px',
              textAlign: 'center', marginBottom: 16, cursor: 'pointer',
            }} onClick={handleCopy}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 34, fontWeight: 900,
                letterSpacing: 6, color: 'var(--color-accent)',
              }}>{referralCode}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8 }}>Tap to copy</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button
                className="btn btn-primary"
                onClick={handleCopy}
                style={{ borderRadius: 12 }}
              >
                {copied ? '✅ Copied!' : '📋 Copy Code'}
              </button>
              <button
                className="btn"
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: 'white', borderRadius: 12 }}
                onClick={handleShare}
              >
                📤 Share Now
              </button>
            </div>
          </>
        )}
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid-2" style={{ marginBottom: 24 }}>
          {[
            { icon: '👥', val: referralStats.totalReferred, label: 'Friends Invited', color: 'var(--color-accent)' },
            { icon: '✅', val: referralStats.qualifiedReferrals, label: 'Qualified', color: 'var(--color-success)' },
            { icon: '💰', val: `₹${referralStats.totalEarned.toFixed(0)}`, label: 'Total Earned', color: 'var(--color-primary)' },
            { icon: '⏳', val: `₹${referralStats.pendingEarnings.toFixed(0)}`, label: 'Pending', color: 'var(--color-warning)' },
          ].map(stat => (
            <div key={stat.label} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontWeight: 900, fontSize: 24, color: stat.color, fontFamily: 'var(--font-display)' }}>{stat.val}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* How it works */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 className="h4" style={{ marginBottom: 16 }}>📖 How It Works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { step: '1', icon: '📤', title: 'Share your code', desc: 'Share your unique referral code with friends via WhatsApp, SMS, or any channel' },
            { step: '2', icon: '📦', title: 'Friend orders', desc: 'Your friend downloads the app or visits the website and places 3 orders of ₹500 or more each' },
            { step: '3', icon: '💰', title: 'You earn ₹100', desc: 'Once your friend qualifies, ₹100 is credited to your wallet automatically' },
          ].map(item => (
            <div key={item.step} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, color: 'white',
              }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
