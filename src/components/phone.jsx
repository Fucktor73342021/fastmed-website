import React, { useState as useS_p, useEffect as useE_p } from 'react';
import { Sparkle, Capsule, Tablet, Lucide } from './primitives.jsx';

/* Animated app preview phone — courier drives along a path; ETA ticks down. */
function Phone() {
  const [progress, setProgress] = useS_p(0); // 0 → 1
  const [eta, setEta] = useS_p(8 * 60 + 24); // 8:24 in seconds

  useE_p(() => {
    const iv = setInterval(() => {
      setProgress((p) => {
        const np = p + 0.012;
        return np > 1 ? 0 : np;
      });
    }, 150);
    return () => clearInterval(iv);
  }, []);

  useE_p(() => {
    const iv = setInterval(() => {
      setEta((e) => (e <= 1 ? 8 * 60 + 24 : e - 1));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const m = Math.floor(eta / 60);
  const s = eta % 60;
  const etaStr = `${m}:${String(s).padStart(2, "0")}`;

  // Courier path coordinates (follow the SVG path)
  const path = [
    [30, 220], [70, 200], [110, 170], [150, 150], [190, 130],
    [220, 110], [250, 90], [280, 70], [300, 60]
  ];
  const idx = Math.min(path.length - 1, Math.floor(progress * (path.length - 1)));
  const next = Math.min(path.length - 1, idx + 1);
  const f = (progress * (path.length - 1)) - idx;
  const cx = path[idx][0] + (path[next][0] - path[idx][0]) * f;
  const cy = path[idx][1] + (path[next][1] - path[idx][1]) * f;

  return (
    <div className="phone">
      <div className="phone-screen">
        <div className="phone-notch" />

        {/* status bar */}
        <div className="phone-status">
          <span>9:41</span>
          <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <Lucide name="signal" size={14} />
            <Lucide name="wifi" size={14} />
            <Lucide name="battery-full" size={16} />
          </span>
        </div>

        {/* hero status header */}
        <div style={{ padding: "12px 18px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--slate-500)" }}>
              Order #FM-2401
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-success-dark)" }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--color-success)" }} />
              EN ROUTE
            </span>
          </div>

          <div style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 28, letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1 }}>
            Arriving in
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
            <span style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 56, letterSpacing: "-0.04em", color: "var(--sky-600)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {etaStr}
            </span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--slate-400)" }}>
              min
            </span>
          </div>
        </div>

        {/* mini map */}
        <div style={{ margin: "12px 14px", height: 230, borderRadius: 18, overflow: "hidden", border: "1px solid rgba(14,165,233,0.18)", position: "relative", background: "linear-gradient(180deg, #E0F2FE 0%, #F0F9FF 100%)" }}>
          {/* gridded "streets" */}
          <svg viewBox="0 0 320 240" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <defs>
              <pattern id="grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M0 0 H32 M0 0 V32" stroke="rgba(14,165,233,0.18)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="320" height="240" fill="url(#grid)" />
            {/* roads */}
            <path d="M0 200 Q 80 200 130 160 T 260 70 L 320 50" stroke="#fff" strokeWidth="14" fill="none" strokeLinecap="round" />
            <path d="M0 200 Q 80 200 130 160 T 260 70 L 320 50" stroke="rgba(14,165,233,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="4 6" />

            {/* pharmacy origin */}
            <g transform="translate(30, 220)">
              <circle r="10" fill="#fff" stroke="var(--ink)" strokeWidth="2" />
              <text textAnchor="middle" y="3.5" fontFamily="var(--display)" fontWeight="800" fontSize="11" fill="var(--ink)">℞</text>
            </g>
            {/* destination */}
            <g transform="translate(300, 60)">
              <circle r="11" fill="var(--coral)" stroke="var(--ink)" strokeWidth="2" />
              <circle r="3" fill="#fff" />
            </g>

            {/* courier */}
            <g transform={`translate(${cx}, ${cy})`}>
              <circle r="15" fill="var(--acid)" stroke="var(--ink)" strokeWidth="2" />
              <text textAnchor="middle" y="4" fontSize="14">🛵</text>
              <circle r="20" fill="none" stroke="var(--acid)" strokeWidth="2" opacity="0.5">
                <animate attributeName="r" from="15" to="28" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="1.6s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </div>

        {/* courier card */}
        <div style={{ margin: "0 14px", padding: 12, background: "#fff", borderRadius: 16, border: "1px solid rgba(14,165,233,0.18)", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 2px 8px rgba(14,165,233,0.08)" }}>
          <div style={{ width: 40, height: 40, borderRadius: 999, background: "linear-gradient(135deg, var(--sky-300), var(--sky-500))", display: "grid", placeItems: "center", color: "#fff", fontFamily: "var(--display)", fontWeight: 800 }}>R</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>Riya • Courier</div>
            <div style={{ fontSize: 11, color: "var(--slate-500)" }}>From Apollo Pharmacy, MG Rd</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={{ width: 32, height: 32, borderRadius: 999, border: "1px solid var(--slate-200)", background: "#fff", display: "grid", placeItems: "center" }}>
              <Lucide name="phone" size={14} color="var(--sky-600)" />
            </button>
            <button style={{ width: 32, height: 32, borderRadius: 999, border: "1px solid var(--slate-200)", background: "#fff", display: "grid", placeItems: "center" }}>
              <Lucide name="message-circle" size={14} color="var(--sky-600)" />
            </button>
          </div>
        </div>

        {/* progress steps */}
        <div style={{ margin: "12px 14px 0", display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { l: "Order placed", d: "Just now", ok: true },
            { l: "Pharmacy confirmed", d: "8:38 am", ok: true },
            { l: "Courier picked up", d: "8:41 am", ok: true },
            { l: "On the way", d: `ETA ${etaStr}`, active: true },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{
                width: 14, height: 14, borderRadius: 999,
                background: s.active ? "var(--acid)" : s.ok ? "var(--sky-500)" : "var(--slate-200)",
                border: "1.5px solid var(--ink)",
                boxShadow: s.active ? "0 0 0 3px rgba(198,255,61,0.4)" : "none"
              }} />
              <div style={{ flex: 1, fontFamily: "var(--body)", fontSize: 12, color: "var(--ink)", fontWeight: s.active ? 700 : 500 }}>{s.l}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--slate-500)" }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { Phone };
