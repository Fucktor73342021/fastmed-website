'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase';
import { doc, onSnapshot, collection, query, where, orderBy, limit } from 'firebase/firestore';

export default function WalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState({ cashbackBalance: 0, referralBalance: 0, refundBalance: 0, totalEarned: 0, totalRedeemed: 0, isSubscribed: false });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    let unsub: (() => void) | null = null;
    try {
      unsub = onSnapshot(doc(db, 'wallets', user.uid), (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setWallet({
            cashbackBalance: Number(d.cashbackBalance) || 0,
            referralBalance: Number(d.referralBalance) || 0,
            refundBalance: Number(d.refundBalance) || 0,
            totalEarned: Number(d.totalEarned) || 0,
            totalRedeemed: Number(d.totalRedeemed) || 0,
            isSubscribed: !!d.isSubscribed,
          });
        }
        setLoading(false);
      }, () => setLoading(false));
    } catch { setLoading(false); }
    return () => { try { unsub?.(); } catch {} };
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    let unsub: (() => void) | null = null;
    try {
      const q = query(
        collection(db, 'walletTransactions'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(30)
      );
      unsub = onSnapshot(q, (snap) => {
        setTransactions(snap.docs.map(d => ({ ...(d.data() as any), id: d.id })));
      });
    } catch {}
    return () => { try { unsub?.(); } catch {} };
  }, [user?.uid]);

  const totalBalance = wallet.cashbackBalance + wallet.referralBalance + wallet.refundBalance;

  function formatDate(ts: any) {
    try {
      const d = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
      if (isNaN(d.getTime())) return '—';
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return '—'; }
  }

  if (loading) {
    return (
      <div className="page-content">
        <h1 className="page-title">Wallet</h1>
        <div className="skeleton" style={{ height: 200, borderRadius: 20, marginBottom: 20 }} />
        <div className="skeleton" style={{ height: 400, borderRadius: 14 }} />
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1 className="page-title">My Wallet</h1>
      <p className="page-subtitle">Balance updates in real-time · Auto-applied at checkout</p>

      {/* Total balance hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
        borderRadius: 24, padding: '32px 28px', marginBottom: 24, color: 'white',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <p style={{ fontSize: 14, opacity: 0.80, fontWeight: 600 }}>Total Balance</p>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 900, margin: '4px 0 16px', letterSpacing: -1 }}>
          ₹{totalBalance.toFixed(2)}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: '10px 16px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 11, opacity: 0.80, fontWeight: 600 }}>Savings</div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>₹{wallet.cashbackBalance.toFixed(2)}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: '10px 16px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 11, opacity: 0.80, fontWeight: 600 }}>Referral</div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>₹{wallet.referralBalance.toFixed(2)}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: '10px 16px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 11, opacity: 0.80, fontWeight: 600 }}>Refund</div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>₹{wallet.refundBalance.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📈</div>
          <div style={{ fontWeight: 900, fontSize: 22, color: 'var(--color-success)' }}>₹{wallet.totalEarned.toFixed(2)}</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>Total Earned</div>
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🛍️</div>
          <div style={{ fontWeight: 900, fontSize: 22, color: 'var(--color-warning)' }}>₹{wallet.totalRedeemed.toFixed(2)}</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>Total Used</div>
        </div>
      </div>

      {/* How it works */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: 24 }}>
        <h2 className="h5" style={{ marginBottom: 12 }}>💡 How Wallet Works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '💊', text: 'Savings: Auto-applied when you place a medicine order' },
            { icon: '🎁', text: 'Referral: Earned when your friend completes 3 orders of ₹500+' },
            { icon: '↩️', text: 'Refund: Credited when an order is cancelled after payment' },
          ].map(item => (
            <div key={item.icon} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 className="h4" style={{ marginBottom: 16 }}>📋 Transaction History</h2>
        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p style={{ color: 'var(--color-text-muted)' }}>No transactions yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {transactions.map((txn) => {
              const isCredit = txn.type === 'CREDIT' || txn.amount > 0;
              return (
                <div key={txn.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: isCredit ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.10)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
                  }}>
                    {isCredit ? '💰' : '🛍️'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{txn.description || (isCredit ? 'Credit' : 'Debit')}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{formatDate(txn.createdAt)}</div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 16, color: isCredit ? 'var(--color-success)' : 'var(--color-error)' }}>
                    {isCredit ? '+' : '-'}₹{Math.abs(Number(txn.amount) || 0).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
