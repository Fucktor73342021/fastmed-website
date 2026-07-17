'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.flashmed.in';

const STATUS_STEPS = ['PENDING', 'ACCEPTED', 'PREPARING', 'DISPATCHED', 'DELIVERED'];
const STATUS_COLORS: Record<string, string> = {
  PENDING: '#F59E0B',
  ACCEPTED: '#3B82F6',
  PREPARING: '#8B5CF6',
  DISPATCHED: '#0EA5E9',
  DELIVERED: '#10B981',
  CANCELLED: '#EF4444',
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: '⏳ Pending',
  ACCEPTED: '✅ Accepted',
  PREPARING: '🔵 Preparing',
  DISPATCHED: '🚴 On the way',
  DELIVERED: '🎉 Delivered',
  CANCELLED: '❌ Cancelled',
  PAYMENT_PENDING: '💳 Payment Pending',
  BOOKING_SENT: '📨 Booking Sent',
  BOOKING_CONFIRMED: '✅ Confirmed',
};

function formatDate(ts: number | any): string {
  try {
    const d = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    if (isNaN(d.getTime())) return '—';
    const h = d.getHours(), m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hh = h % 12 || 12;
    const mm = String(m).padStart(2, '0');
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${d.getDate()} ${MONTHS[d.getMonth()]} · ${hh}:${mm} ${ampm}`;
  } catch { return '—'; }
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [pastOrders, setPastOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [refreshing, setRefreshing] = useState(false);

  /* ── Real-time order listener from Firestore ── */
  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    const TERMINAL = new Set(['DELIVERED', 'CANCELLED']);
    let unsub: (() => void) | null = null;
    try {
      const q = query(
        collection(db, 'orders'),
        where('customerId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      unsub = onSnapshot(q, (snap) => {
        const orders = snap.docs.map(d => ({ ...(d.data() as any), firestoreId: d.id }));
        setActiveOrders(orders.filter(o => !TERMINAL.has(String(o.status || '').toUpperCase())));
        setPastOrders(orders.filter(o => TERMINAL.has(String(o.status || '').toUpperCase())));
        setLoading(false);
      }, () => setLoading(false));
    } catch { setLoading(false); }
    return () => { try { unsub?.(); } catch {} };
  }, [user?.uid]);

  /* ── Also fetch from backend ── */
  const fetchOrders = async () => {
    if (!user?.uid) return;
    setRefreshing(true);
    try {
      const token = user.token || localStorage.getItem('fm_token') || '';
      const res = await fetch(`${API_BASE}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.orders?.length) {
          const TERMINAL = new Set(['DELIVERED', 'CANCELLED']);
          const all = data.orders;
          setActiveOrders(prev => {
            const ids = new Set(prev.map((o: any) => o.firestoreId || o.id));
            const newOrders = all.filter((o: any) => !ids.has(o.id)).filter((o: any) => !TERMINAL.has(String(o.status || '').toUpperCase()));
            return [...prev, ...newOrders];
          });
        }
      }
    } catch {}
    setRefreshing(false);
  };

  useEffect(() => { fetchOrders(); }, [user?.uid]);

  const renderProgressBar = (status: string) => {
    const idx = STATUS_STEPS.indexOf(status.toUpperCase());
    if (idx === -1) return null;
    return (
      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {STATUS_STEPS.map((step, i) => (
            <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: i <= idx ? STATUS_COLORS[status] || 'var(--color-primary)' : 'var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: i <= idx ? 'white' : 'var(--color-text-muted)',
                fontWeight: 800, transition: 'all 0.3s ease',
                boxShadow: i === idx ? `0 0 12px ${STATUS_COLORS[status] || 'var(--color-primary)'}60` : 'none',
              }}>
                {i < idx ? '✓' : i + 1}
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div style={{ position: 'relative', width: '100%', height: 3, background: 'var(--color-border)', margin: '14px -50% 0', zIndex: 0 }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: i < idx ? '100%' : '0%', background: STATUS_COLORS[status] || 'var(--color-primary)', transition: 'width 0.5s ease' }} />
                </div>
              )}
              <div style={{ fontSize: 9, fontWeight: 700, color: i <= idx ? STATUS_COLORS[status] || 'var(--color-primary)' : 'var(--color-text-muted)', marginTop: 6, textAlign: 'center' }}>
                {step.charAt(0) + step.slice(1).toLowerCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const OrderCard = ({ order }: { order: any }) => {
    const status = String(order.status || 'PENDING').toUpperCase();
    const color = STATUS_COLORS[status] || '#6B7280';
    const isTerminal = ['DELIVERED', 'CANCELLED'].includes(status);
    const isLab = order.orderServiceType === 'lab' || order.sellerType === 'lab';
    const isDoctor = order.orderServiceType === 'doctor_booking' || order.type === 'doctor_booking';

    return (
      <div
        className="order-card"
        style={{ borderLeft: `4px solid ${color}`, cursor: 'pointer' }}
        onClick={() => setSelectedOrder(selectedOrder?.firestoreId === order.firestoreId ? null : order)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{isLab ? '🔬' : isDoctor ? '🩺' : '💊'}</span>
              <span style={{ fontWeight: 800, fontSize: 14 }}>
                {isLab ? 'Lab Test' : isDoctor ? 'Doctor Booking' : 'Medicine Order'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>
              📍 {order.address || `${order.houseNo || ''}, ${order.locality || ''}`}
            </div>
            {order.price && (
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>₹{order.price}</div>
            )}
            {order.labPreferredDate && (
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>📅 {order.labPreferredDate} · {order.labPreferredSlot}</div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span className={`badge badge-${status.toLowerCase().replace('_','-')}`} style={{ background: `${color}20`, color }}>
              {STATUS_LABELS[status] || status}
            </span>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{formatDate(order.createdAt)}</div>
          </div>
        </div>

        {/* Expand: progress + details */}
        {selectedOrder?.firestoreId === order.firestoreId && !isTerminal && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
            {!isLab && !isDoctor && renderProgressBar(status)}

            {order.sellerName && (
              <div style={{ marginTop: 14, background: 'var(--color-surface)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>🏪 Pharmacy: {order.sellerName}</div>
                {order.sellerPhone && (
                  <a href={`tel:${order.sellerPhone}`} style={{ color: 'var(--color-primary)', fontSize: 13, fontWeight: 600 }}>📞 Call Pharmacy</a>
                )}
              </div>
            )}

            {order.riderPhone && (
              <div style={{ marginTop: 10, background: 'var(--color-surface)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>🚴 Rider assigned</div>
                <a href={`tel:${order.riderPhone}`} style={{ color: 'var(--color-primary)', fontSize: 13, fontWeight: 600 }}>📞 Call Rider</a>
              </div>
            )}

            {order.paymentStatus && (
              <div style={{ marginTop: 10, background: 'var(--color-surface)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
                <span style={{ fontWeight: 700 }}>💳 Payment: </span>
                <span style={{ color: order.paymentStatus === 'PAID' ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 700 }}>
                  {order.paymentStatus}
                </span>
              </div>
            )}
          </div>
        )}

        {selectedOrder?.firestoreId === order.firestoreId && isTerminal && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--color-border)' }}>
            {status === 'DELIVERED' && (
              <div style={{ background: 'rgba(16,185,129,0.08)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>🎉</div>
                <div style={{ fontWeight: 800, color: 'var(--color-success)' }}>Order Delivered!</div>
                {order.price && <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>Total: ₹{order.price}</div>}
              </div>
            )}
            {status === 'CANCELLED' && (
              <div style={{ background: 'rgba(239,68,68,0.08)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>❌</div>
                <div style={{ fontWeight: 800, color: 'var(--color-error)' }}>Order Cancelled</div>
                {order.cancellationReason && <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>{order.cancellationReason}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <h1 className="page-title">My Orders</h1>
        <button className="btn btn-ghost btn-sm" onClick={fetchOrders} disabled={refreshing}>
          {refreshing ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : '🔄 Refresh'}
        </button>
      </div>
      <p className="page-subtitle">Real-time tracking · Tap any order for details</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['active', 'past'] as const).map(tab => (
          <button
            key={tab}
            className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'active' ? `🟢 Active (${activeOrders.length})` : `📦 Past (${pastOrders.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14 }} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {activeTab === 'active' && (
            activeOrders.length === 0 ? (
              <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📦</div>
                <h3 className="h4" style={{ marginBottom: 8 }}>No active orders</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>Place your first order from the Home tab</p>
                <a href="/home"><button className="btn btn-primary">Order Medicines →</button></a>
              </div>
            ) : activeOrders.map(order => <OrderCard key={order.firestoreId || order.id} order={order} />)
          )}

          {activeTab === 'past' && (
            pastOrders.length === 0 ? (
              <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🗂️</div>
                <h3 className="h4">No past orders</h3>
                <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>Your completed orders will appear here</p>
              </div>
            ) : pastOrders.map(order => <OrderCard key={order.firestoreId || order.id} order={order} />)
          )}
        </div>
      )}
    </div>
  );
}
