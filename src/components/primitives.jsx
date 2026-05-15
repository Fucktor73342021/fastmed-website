import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import * as icons from 'lucide-react';

/* ─── Logo mark ────────────────────────────────────────────── */
function LogoMark({ size = 28 }) {
  return (
    <div className="mark" style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L4.5 13.5h6L9 22l9.5-12.5h-6L14 2z" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}

function Wordmark({ color = "var(--ink)" }) {
  return (
    <span style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em", color }}>
      Flash<span style={{ fontStyle: "italic" }}>Med</span>
      <span style={{ color: "var(--coral)" }}>.</span>
    </span>
  );
}

function Lucide({ name, size = 20, color = "currentColor", strokeWidth = 2, style }) {
  // Convert kebab-case to PascalCase
  const componentName = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  const IconComponent = icons[componentName];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} strokeWidth={strokeWidth} style={style} />;
}

/* ─── 4-point sparkle SVG ────────────────────────────────────── */
function Sparkle({ size = 28, color = "var(--ink)", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" style={style}>
      <path
        d="M14 0 C14 8 14 8 28 14 C14 20 14 20 14 28 C14 20 14 20 0 14 C14 8 14 8 14 0 Z"
        fill={color}
      />
    </svg>
  );
}

/* ─── Star (5 point) ─────────────────────────────────────────── */
function Star({ size = 32, color = "var(--ink)", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={style}>
      <path
        d="M32 0 L40 24 L64 32 L40 40 L32 64 L24 40 L0 32 L24 24 Z"
        fill={color}
      />
    </svg>
  );
}

/* ─── Capsule pill component ────────────────────────────────── */
function Capsule({ variant = "coral", size = "md", className = "", style = {} }) {
  return <div className={`capsule ${variant} ${size === "lg" ? "lg" : size === "sm" ? "sm" : ""} ${className}`} style={style} />;
}
function Tablet({ variant = "", className = "", style = {} }) {
  return <div className={`tablet ${variant} ${className}`} style={style} />;
}

/* ─── Reveal-on-scroll wrapper ──────────────────────────────── */
function Reveal({ children, delay = 0, className = "", as: As = "div", ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => setShown(true), delay);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <As ref={ref} className={`reveal ${shown ? "in" : ""} ${className}`} {...rest}>
      {children}
    </As>
  );
}

/* ─── Marquee ────────────────────────────────────────────────── */
function Marquee({ items, variant = "", speed = "" }) {
  const all = [...items, ...items, ...items, ...items];
  return (
    <div className={`marquee ${variant} ${speed}`}>
      <div className="marquee-track">
        {all.map((it, i) => (
          <span className="marquee-item" key={i}>
            <Sparkle size={18} color="currentColor" />
            <span>{it}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export { LogoMark, Wordmark, Lucide, Sparkle, Star, Capsule, Tablet, Reveal, Marquee };
