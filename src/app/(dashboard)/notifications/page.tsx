'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';

function formatDate(ts: any): string {
  try {
    const d = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    if (isNaN(d.getTime())) return '—';
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (mins < 2) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch { return '—'; }
}

const NOTIF_ICONS: Record<string, string> = {
  ORDER: '📦',
  PAYMENT: '💳',
  DELIVERY: '🚴',
  PROMOTION: '🎁',
  REFERRAL: '👥',
  WALLET: '💰',
  SYSTEM: 'ℹ️',
  DOCTOR: '🩺',
  LAB: '🔬',
  BLOOD: '🩸',
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    let unsub: (() => void) | null = null;
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      unsub = onSnapshot(q, (snap) => {
        setNotifications(snap.docs.map(d => ({ ...(d.data() as any), id: d.id })));
        setLoading(false);
      }, () => setLoading(false));
    } catch { setLoading(false); }
    return () => { try { unsub?.(); } catch {} };
  }, [user?.uid]);

  const filtered = filter === 'ALL' ? notifications : notifications.filter(n => (n.type || 'SYSTEM') === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const FILTERS = ['ALL', 'ORDER', 'PAYMENT', 'DELIVERY', 'WALLET', 'REFERRAL', 'DOCTOR', 'LAB'];

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <h1 className="page-title">Notifications</h1>
        {unreadCount > 0 && (
          <span className="badge" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--color-error)', fontSize: 13 }}>
            {unreadCount} new
          </span>
        )}
      </div>
      <p className="page-subtitle">Real-time updates for all your orders and activity</p>

      {/* Filters */}
      <div className="carousel" style={{ marginBottom: 20, paddingBottom: 4 }}>
        {FILTERS.map(f => (
          <div key={f} className="carousel-item">
            <button
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(f)}
            >
              {NOTIF_ICONS[f] || '🔔'} {f}
            </button>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 14 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔔</div>
          <h3 className="h4" style={{ marginBottom: 8 }}>No notifications</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {filter === 'ALL' ? "You're all caught up! Notifications will appear here." : `No ${filter.toLowerCase()} notifications yet`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((notif) => {
            const type = notif.type || 'SYSTEM';
            const isUnread = !notif.read;
            return (
              <div
                key={notif.id}
                className="glass-card"
                style={{
                  padding: '16px 20px',
                  borderLeft: isUnread ? '4px solid var(--color-primary)' : '4px solid transparent',
                  opacity: 1,
                }}
              >
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: isUnread ? 'rgba(5,150,105,0.12)' : 'var(--color-surface)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                  }}>
                    {NOTIF_ICONS[type] || '🔔'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: isUnread ? 800 : 600, fontSize: 14, marginBottom: 3 }}>
                      {notif.title || 'FlashMed Update'}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                      {notif.body || notif.message || ''}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-light)', marginTop: 6 }}>
                      {formatDate(notif.createdAt)}
                    </div>
                  </div>
                  {isUnread && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 6 }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
