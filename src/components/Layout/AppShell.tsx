'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const NAV_ITEMS = [
  { href: '/home', icon: '🏠', label: 'Home' },
  { href: '/orders', icon: '📦', label: 'Orders' },
  { href: '/wallet', icon: '💰', label: 'Wallet' },
  { href: '/profile', icon: '👤', label: 'Profile' },
];

const SIDEBAR_ITEMS = [
  { href: '/home', icon: '🏠', label: 'Home' },
  { href: '/orders', icon: '📦', label: 'My Orders' },
  { href: '/doctor', icon: '🩺', label: 'Find Doctor' },
  { href: '/blood-sos', icon: '🩸', label: 'Blood SOS' },
  { href: '/wallet', icon: '💰', label: 'Wallet' },
  { href: '/referral', icon: '🎁', label: 'Refer & Earn' },
  { href: '/subscription', icon: '⭐', label: 'Subscription' },
  { href: '/notifications', icon: '🔔', label: 'Notifications' },
  { href: '/profile', icon: '👤', label: 'Profile' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      {/* Mesh gradient background */}
      <div className="mesh-gradient">
        <div className="mesh-orb-3" />
      </div>

      {/* ── Desktop Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">💊</div>
          <div className="sidebar-logo-text">
            <div className="sidebar-logo-name">FlashMed</div>
            <div className="sidebar-logo-sub">Healthcare · Fast</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="nav-item"
            style={{ width: '100%', marginBottom: 8 }}
            onClick={toggleTheme}
          >
            <span className="nav-icon">{isDark ? '☀️' : '🌙'}</span>
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            className="nav-item"
            style={{ width: '100%', color: 'var(--color-error)' }}
            onClick={logout}
          >
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="main-content">
        {/* Top Header */}
        <header className="top-header">
          {/* Mobile: logo */}
          <div className="header-logo" style={{ display: 'flex' }}>
            <div className="header-logo-icon">💊</div>
            <span style={{ marginLeft: 8 }}>FlashMed</span>
          </div>

          <div className="header-search" style={{ display: 'flex' }}>
            <input
              className="input"
              placeholder="Search medicines, doctors, labs..."
              style={{ borderRadius: 10, fontSize: 14, padding: '10px 16px' }}
            />
          </div>

          <div className="header-actions">
            <button className="header-icon-btn" onClick={toggleTheme} title="Toggle theme">
              {isDark ? '☀️' : '🌙'}
            </button>
            <Link href="/notifications">
              <button className="header-icon-btn" title="Notifications">
                🔔
              </button>
            </Link>
            <Link href="/profile">
              <div className="avatar-btn" title="Profile">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          {children}
        </main>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
