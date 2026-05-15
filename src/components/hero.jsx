import React, { useState as useS_h, useEffect as useE_h, useRef as useR_h } from 'react';
import { Reveal, Sparkle, Star, Capsule, Tablet, Lucide } from './primitives.jsx';

/* ─── Live 10-min countdown that resets on hit zero ──────────── */
function useCountdown(initialSeconds = 600) {
  const [s, setS] = useS_h(initialSeconds);
  useE_h(() => {
    const iv = setInterval(() => {
      setS((cur) => (cur <= 0 ? initialSeconds : cur - 1));
    }, 1000);
    return () => clearInterval(iv);
  }, [initialSeconds]);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

/* ─── Mouse-driven parallax for floaters ────────────────────── */
function useParallax() {
  const [m, setM] = useS_h({ x: 0, y: 0 });
  useE_h(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setM({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return m;
}

function Hero() {
  const time = useCountdown(600);
  const par = useParallax();

  const px = (mult = 20) => ({
    transform: `translate3d(${par.x * mult}px, ${par.y * mult}px, 0)`,
    transition: "transform .12s linear",
  });

  return (
    <section className="hero">
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* top eyebrow row */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 28 }}>
          <span className="sticker acid">
            <Sparkle size={12} /> Now live in 18 cities
          </span>
          <span className="sticker">
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--coral)", boxShadow: "0 0 0 3px rgba(255,92,138,0.25)" }} />
            We connect — pharmacies prescribe
          </span>
          <span className="sticker chrome">
            <Sparkle size={12} color="var(--sky-700)" /> 4.9 ★ on the App Store
          </span>
        </div>

        <Reveal as="div" className="hero-headline">
          <div className="display-xl">
            <span className="italic">Meds.</span>
          </div>
          <div className="display-xl" style={{ display: "flex", alignItems: "baseline", gap: "0.18em", flexWrap: "wrap" }}>
            <span>In a</span>
            <span className="fill-iri italic">flash</span>
            <span style={{ position: "relative" }}>
              <Sparkle
                size={36}
                color="var(--coral)"
                style={{ position: "absolute", right: -28, top: -8 }}
              />
              .
            </span>
          </div>
          <div className="display-xl outlined" style={{ marginTop: 4 }}>
            10 min flat<span style={{ color: "var(--coral)", WebkitTextStroke: 0 }}>.</span>
          </div>
        </Reveal>

        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "end" }}
             className="hero-grid">
          <Reveal delay={150}>
            <p className="hero-sub">
              FlashMed connects you to <strong>real local pharmacies</strong> in your
              neighbourhood — they fulfil, a courier sprints, and your medicine
              lands at your door before the kettle boils. We don't sell. We don't
              store. We just <em>move.</em>
            </p>

            <div style={{ display: "flex", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
              <a href="#download" className="btn-chrome acid">
                <Lucide name="smartphone" size={18} /> Get the app
              </a>
              <a href="#partners" className="btn-chrome ghost">
                <Lucide name="store" size={18} /> Partner pharmacies
              </a>
            </div>

            <div style={{ display: "flex", gap: 32, marginTop: 36, flexWrap: "wrap" }}>
              <div className="stat"><span className="v">9:42</span><span className="l">Avg. delivery</span></div>
              <div className="stat"><span className="v">2.1k+</span><span className="l">Local pharmacies</span></div>
              <div className="stat"><span className="v">24/7</span><span className="l">Always on</span></div>
            </div>
          </Reveal>

          {/* countdown card */}
          <Reveal delay={300} style={{ display: "flex", justifyContent: "flex-end" }}>
            <div className="countdown" style={{ flexDirection: "column", alignItems: "flex-start", gap: 6, minWidth: 280 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
                ⏱ Order placed → at your door
              </span>
              <div className="digits">{time}</div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "var(--mono)", letterSpacing: "0.1em" }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--acid)", boxShadow: "0 0 8px var(--acid)" }} />
                LIVE • Courier en route
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* floating decorations */}
      <div className="float-layer">
        <Capsule variant="acid" size="lg" className="drift" style={{ ...px(28), top: "8%", right: "6%", "--r": "18deg" }} />
        <Capsule variant="coral" size="md" className="drift slow" style={{ ...px(40), top: "32%", right: "2%", "--r": "-22deg", transform: undefined }} />
        <Capsule variant="sky" size="sm" className="drift fast" style={{ ...px(20), top: "54%", left: "3%", "--r": "12deg" }} />
        <Capsule variant="dark" size="md" className="drift" style={{ ...px(34), bottom: "12%", right: "12%", "--r": "-8deg" }} />

        <Tablet variant="acid" className="drift slow" style={{ ...px(22), top: "18%", left: "2%" }} />
        <Tablet variant="coral" className="drift" style={{ ...px(30), bottom: "8%", left: "10%" }} />

        <Star size={36} color="var(--coral)" style={{ position: "absolute", top: "70%", right: "20%", animation: "spin360 14s linear infinite" }} />
        <Star size={20} color="var(--ink)" style={{ position: "absolute", top: "12%", left: "42%", animation: "spin360 10s linear infinite reverse" }} />
        <Sparkle size={26} color="var(--sky-500)" style={{ position: "absolute", top: "44%", right: "44%", animation: "spark 2.4s ease-in-out infinite" }} />
        <Sparkle size={18} color="var(--acid-deep)" style={{ position: "absolute", bottom: "28%", left: "32%", animation: "spark 3s ease-in-out infinite" }} />

        {/* big circular sticker */}
        <div className="badge-circle drift slow" style={{ position: "absolute", top: "6%", right: "30%", transform: "rotate(-12deg)", fontSize: 18 }}>
          <div>
            <div style={{ fontSize: 12, fontFamily: "var(--mono)", letterSpacing: "0.16em", opacity: 0.85 }}>
              ★ NEW ★
            </div>
            <div style={{ fontSize: 24, marginTop: 2 }}>FREE<br/>FIRST<br/>DROP</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Hero };
