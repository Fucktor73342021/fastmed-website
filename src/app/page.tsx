'use client';
import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Mesh gradient */}
      <div className="mesh-gradient"><div className="mesh-orb-3" /></div>

      {/* Header */}
      <header style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 32px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-glass)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--color-text)' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: 'linear-gradient(135deg, #059669, #047857)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: 'var(--shadow-primary)',
          }}>💊</div>
          FlashMed
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/login">
            <button className="btn btn-ghost btn-sm">Login</button>
          </Link>
          <Link href="/register">
            <button className="btn btn-primary btn-sm">Get Started</button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        position: 'relative', zIndex: 5,
        textAlign: 'center',
        padding: 'clamp(60px, 10vh, 120px) 24px 80px',
        maxWidth: 800, margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(5,150,105,0.10)',
          border: '1px solid rgba(5,150,105,0.25)',
          borderRadius: 20, padding: '6px 16px', marginBottom: 28,
          fontSize: 13, fontWeight: 700, color: 'var(--color-primary)',
        }}>
          ⚡ 10–40 Min Delivery · Verified Pharmacies
        </div>

        <h1 className="h1" style={{ marginBottom: 20, color: 'var(--color-text)' }}>
          Healthcare <span style={{ color: 'var(--color-primary)' }}>Delivered</span><br />
          at Lightning Speed
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--color-text-muted)',
          lineHeight: 1.6, maxWidth: 560, margin: '0 auto 40px',
        }}>
          Order medicines, book lab tests at home, consult doctors,
          and request emergency blood — all from one place.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register">
            <button className="btn btn-primary btn-lg" style={{ minWidth: 200 }}>
              🚀 Order Medicines Now
            </button>
          </Link>
          <Link href="/login">
            <button className="btn btn-secondary btn-lg" style={{ minWidth: 160 }}>
              Sign In
            </button>
          </Link>
        </div>
      </section>

      {/* Services grid */}
      <section style={{ position: 'relative', zIndex: 5, padding: '0 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 className="h3" style={{ textAlign: 'center', marginBottom: 32, color: 'var(--color-text)' }}>
          Everything Healthcare, One App
        </h2>
        <div className="grid-4" style={{ gap: 20 }}>
          {[
            { color: '#059669', bg: 'linear-gradient(135deg, #059669, #047857)', icon: '💊', title: 'Medicines', desc: 'Upload prescription · Local pharmacy delivers' },
            { color: '#DC2626', bg: 'linear-gradient(135deg, #DC2626, #B91C1C)', icon: '🩸', title: 'Blood Bank', desc: 'Emergency SOS · 24/7 blood availability' },
            { color: '#2563EB', bg: 'linear-gradient(135deg, #2563EB, #1D4ED8)', icon: '🩺', title: 'Doctor', desc: 'Nearby clinics · Instant appointments' },
            { color: '#7C3AED', bg: 'linear-gradient(135deg, #7C3AED, #6D28D9)', icon: '🔬', title: 'Lab Tests', desc: 'Home sample collection · Same-day reports' },
          ].map((s) => (
            <div
              key={s.title}
              className="service-card fade-up"
              style={{ background: s.bg, boxShadow: `0 16px 40px ${s.color}40` }}
            >
              <div className="service-card-icon">{s.icon}</div>
              <div>
                <div className="service-card-title">{s.title}</div>
                <div className="service-card-subtitle">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ position: 'relative', zIndex: 5, padding: '0 24px 100px', maxWidth: 900, margin: '0 auto' }}>
        <h2 className="h3" style={{ textAlign: 'center', marginBottom: 48, color: 'var(--color-text)' }}>How It Works</h2>
        <div className="grid-3" style={{ gap: 28 }}>
          {[
            { step: '1', icon: '📸', title: 'Upload Prescription', desc: 'Take a photo of your doctor\'s prescription or upload from gallery' },
            { step: '2', icon: '🏪', title: 'Pharmacy Accepts', desc: 'Verified local pharmacies receive your order and confirm availability' },
            { step: '3', icon: '🚴', title: 'Fast Delivery', desc: 'Get your medicines delivered to your door in 10–40 minutes' },
          ].map((step) => (
            <div key={step.step} className="glass-card" style={{ padding: '28px 24px', textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, color: 'white',
                margin: '0 auto 16px', fontSize: 24,
              }}>{step.icon}</div>
              <div style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(5,150,105,0.12)', borderRadius: 20,
                padding: '2px 10px', fontSize: 11, fontWeight: 800, color: 'var(--color-primary)',
              }}>Step {step.step}</div>
              <h3 className="h5" style={{ marginBottom: 8 }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        position: 'relative', zIndex: 5,
        textAlign: 'center', padding: '60px 24px 80px',
        background: 'linear-gradient(135deg, rgba(5,150,105,0.08), rgba(99,102,241,0.06))',
        borderTop: '1px solid var(--color-border)',
      }}>
        <h2 className="h2" style={{ marginBottom: 12, color: 'var(--color-text)' }}>Ready to get started?</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 32, fontSize: 16 }}>Join thousands of customers ordering medicines online</p>
        <Link href="/register">
          <button className="btn btn-primary btn-lg">Create Free Account →</button>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 5,
        padding: '24px 32px',
        borderTop: '1px solid var(--color-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
        color: 'var(--color-text-muted)', fontSize: 13,
      }}>
        <div>© 2025 FlashMed · Healthcare Fast</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="#" style={{ color: 'var(--color-text-muted)' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--color-text-muted)' }}>Terms of Service</a>
          <a href="mailto:support@flashmed.in" style={{ color: 'var(--color-primary)' }}>Support</a>
        </div>
      </footer>
    </div>
  );
}
