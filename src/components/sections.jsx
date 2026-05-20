import React, { useState as useS_s, useEffect as useE_s } from 'react';
import { Reveal, Sparkle, Star, Capsule, Tablet, Lucide, Marquee } from './primitives.jsx';
import { Phone } from './phone.jsx';

/* ─── Marquee strip(s) ───────────────────────────────────────── */
function MarqueeStrip() {
  return (
    <div style={{ position: "relative", margin: "0 0 64px" }}>
      <div className="marquee" style={{ background: "var(--ink)", color: "var(--acid)", transform: "rotate(-2.4deg)", borderRadius: 4 }}>
        <div className="marquee-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span className="marquee-item" key={i}>
              <Sparkle size={20} color="var(--acid)" />
              <span style={{ fontStyle: "italic" }}>10 min flat</span>
              <Sparkle size={20} color="var(--coral)" />
              <span>real local pharmacies</span>
              <Sparkle size={20} color="var(--acid)" />
              <span>no warehouse, no markup</span>
              <Sparkle size={20} color="var(--coral)" />
              <span style={{ fontStyle: "italic" }}>open 24/7</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── How it works ──────────────────────────────────────────── */
function HowItWorks() {
  return (
    <section id="how" className="section-pad" style={{ position: "relative" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 56 }}>
          <Reveal>
            <span className="eyebrow"><span className="dot" /> How it works</span>
            <h2 className="display-md" style={{ marginTop: 16, maxWidth: 760 }}>
              Three taps. <span className="italic fill-sky">One sprint.</span> Zero faff.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p style={{ maxWidth: 380, color: "rgba(10,21,48,0.65)", fontSize: 17, lineHeight: 1.55 }}>
              We're a connector — your local pharmacist still fills the bag.
              We just match you to the closest one with stock and dispatch a
              courier the second they confirm.
            </p>
          </Reveal>
        </div>

        <div className="steps">
          <Reveal delay={0}>
            <div className="step sky">
              <span className="num">01</span>
              <span className="chip sky" style={{ alignSelf: "flex-start" }}>Tap → Search</span>
              <h3>Snap, type, or scan.</h3>
              <p>Photograph your prescription, type a brand, or scan an old box. Our match engine reads handwriting, generics, dosages — even the bad doctor scrawl.</p>
              <div className="illo">
                <StepIlloSearch />
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="step acid">
              <span className="num">02</span>
              <span className="chip acid" style={{ alignSelf: "flex-start" }}>We match you locally</span>
              <h3>The closest pharmacy with stock wins.</h3>
              <p>We ping every partner pharmacy within 2.5 km in real time. The first to confirm <em>and</em> have it on the shelf takes your order.</p>
              <div className="illo">
                <StepIlloMatch />
              </div>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="step coral">
              <span className="num">03</span>
              <span className="chip coral" style={{ alignSelf: "flex-start" }}>Courier sprints</span>
              <h3>At your door before the kettle boils.</h3>
              <p>A FlashMed courier picks up, you watch them on the map, they ring the bell. Average door-to-door: 9 minutes 42 seconds.</p>
              <div className="illo">
                <StepIlloDeliver />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function StepIlloSearch() {
  return (
    <svg viewBox="0 0 280 110" width="100%" height="100%">
      <rect x="20" y="20" width="180" height="70" rx="14" fill="#fff" stroke="var(--ink)" strokeWidth="2" />
      <circle cx="44" cy="55" r="14" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
      <line x1="55" y1="65" x2="68" y2="78" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      <rect x="70" y="46" width="116" height="8" rx="4" fill="var(--sky-200)" />
      <rect x="70" y="60" width="80" height="6" rx="3" fill="var(--sky-100)" />
      <g transform="translate(210, 30) rotate(12)">
        <rect width="50" height="22" rx="11" fill="var(--coral)" stroke="var(--ink)" strokeWidth="2" />
        <line x1="25" y1="0" x2="25" y2="22" stroke="var(--ink)" strokeWidth="2" />
      </g>
    </svg>
  );
}

function StepIlloMatch() {
  return (
    <svg viewBox="0 0 280 110" width="100%" height="100%">
      <circle cx="140" cy="60" r="10" fill="var(--coral)" stroke="var(--ink)" strokeWidth="2" />
      {[35, 50, 65].map((r, i) => (
        <circle key={i} cx="140" cy="60" r={r} fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 4" opacity={0.3 + i * 0.2}>
          <animate attributeName="r" from={r} to={r + 8} dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" from={0.6} to={0} dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* pharmacy markers */}
      {[[60, 30], [220, 40], [70, 90], [210, 88]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <rect x="-12" y="-12" width="24" height="24" rx="6" fill="#fff" stroke="var(--ink)" strokeWidth="2" />
          <text textAnchor="middle" y="5" fontFamily="var(--display)" fontWeight="800" fontSize="14" fill="var(--ink)">℞</text>
        </g>
      ))}
    </svg>
  );
}

function StepIlloDeliver() {
  return (
    <svg viewBox="0 0 280 110" width="100%" height="100%">
      {/* road */}
      <line x1="0" y1="80" x2="280" y2="80" stroke="var(--ink)" strokeWidth="2" />
      <line x1="0" y1="80" x2="280" y2="80" stroke="var(--ink)" strokeWidth="1" strokeDasharray="6 8" transform="translate(0, 6)" />

      {/* house */}
      <g transform="translate(220, 32)">
        <polygon points="0,18 24,0 48,18 48,48 0,48" fill="#fff" stroke="var(--ink)" strokeWidth="2" />
        <rect x="18" y="28" width="12" height="20" fill="var(--coral)" stroke="var(--ink)" strokeWidth="2" />
      </g>

      {/* scooter */}
      <g style={{ animation: "drift 3s ease-in-out infinite" }}>
        <g transform="translate(50, 50)">
          <rect x="0" y="0" width="44" height="22" rx="6" fill="var(--acid)" stroke="var(--ink)" strokeWidth="2" />
          <circle cx="8" cy="28" r="8" fill="#fff" stroke="var(--ink)" strokeWidth="2" />
          <circle cx="36" cy="28" r="8" fill="#fff" stroke="var(--ink)" strokeWidth="2" />
          <rect x="14" y="-8" width="14" height="10" rx="3" fill="var(--coral)" stroke="var(--ink)" strokeWidth="2" />
          <text x="22" y="14" textAnchor="middle" fontFamily="var(--display)" fontWeight="800" fontSize="10" fill="var(--ink)">FM</text>
        </g>
        {/* speed lines */}
        <line x1="-6" y1="56" x2="34" y2="56" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="68" x2="42" y2="68" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ─── Why us / value props ──────────────────────────────────── */
function WhyUs() {
  return (
    <section id="why" className="section-pad" style={{ position: "relative" }}>
      <div className="container">
        <div style={{ marginBottom: 56, maxWidth: 880 }}>
          <Reveal>
            <span className="eyebrow"><span className="dot" /> Why FlashMed</span>
            <h2 className="display-md" style={{ marginTop: 16 }}>
              We don't run a warehouse. <br />
              <span className="italic fill-coral">We run the streets.</span>
            </h2>
          </Reveal>
        </div>

        <div className="values">
          <Reveal className="value sky">
            <div className="icon"><Lucide name="zap" size={28} /></div>
            <h4>10-minute promise</h4>
            <p>If we miss 10 minutes within city limits, the delivery's on us. No fine print, no escape clauses.</p>
            <Sparkle size={18} color="rgba(255,255,255,0.6)" style={{ position: "absolute", top: 20, right: 20 }} />
          </Reveal>

          <Reveal delay={80} className="value">
            <div className="icon"><Lucide name="store" size={28} /></div>
            <h4>Real local pharmacies</h4>
            <p>Every order is filled by a licensed pharmacist round the corner — not a dark store, not a warehouse, not us.</p>
          </Reveal>

          <Reveal delay={160} className="value coral">
            <div className="icon"><Lucide name="shield-check" size={28} color="var(--coral-deep)" /></div>
            <h4>Cold chain, kept</h4>
            <p>Insulin, vaccines, biologics — sealed in a 2–8°C box, logged end-to-end, photographed at handover.</p>
          </Reveal>

          <Reveal className="value">
            <div className="icon" style={{ background: "var(--cyan-400)" }}><Lucide name="receipt" size={28} /></div>
            <h4>MRP, not markup</h4>
            <p>We charge a flat delivery fee. Your medicine is sold at the printed price — same as walking in.</p>
          </Reveal>

          <Reveal delay={80} className="value">
            <div className="icon" style={{ background: "var(--coral)", color: "#fff" }}><Lucide name="user-round-cog" size={28} /></div>
            <h4>Pharmacist on call</h4>
            <p>Real questions get real answers. Tap "Ask a pharmacist" — a licensed one replies in under 2 min.</p>
          </Reveal>

          <Reveal delay={160} className="value dark">
            <div className="icon" style={{ background: "var(--acid)", color: "var(--ink)" }}><Lucide name="map-pin" size={28} /></div>
            <h4>Live on the map</h4>
            <p>You see exactly where your courier is — no "out for delivery" black box, no support tickets.</p>
            <Sparkle size={18} color="var(--acid)" style={{ position: "absolute", top: 20, right: 20 }} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Phone preview section ─────────────────────────────────── */
function PhoneSection() {
  return (
    <section className="section-pad" style={{ position: "relative" }}>
      <div className="container">
        <div className="phone-section">
          <div>
            <Reveal>
              <span className="eyebrow"><span className="dot" /> Live tracking</span>
              <h2 className="display-md" style={{ marginTop: 16 }}>
                Watch your meds <br />
                <span className="italic fill-sky">come to you.</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p style={{ marginTop: 24, maxWidth: 480, fontSize: 18, lineHeight: 1.55, color: "rgba(10,21,48,0.7)" }}>
                Once a pharmacy confirms, the map opens. You see the courier
                turn the corner. ETA updates every second — not "soon," not
                "shortly," but <strong>3:14</strong>.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
                <span className="sticker acid"><Lucide name="navigation" size={14} /> Turn-by-turn ETA</span>
                <span className="sticker"><Lucide name="phone" size={14} /> Tap to call your courier</span>
                <span className="sticker coral"><Lucide name="camera" size={14} /> Handover photo proof</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} style={{ position: "relative" }}>
            <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
              <Phone />
              {/* floating bits around phone */}
              <Capsule variant="acid" size="md" className="drift" style={{ position: "absolute", top: 40, left: -20, "--r": "-18deg", transform: "rotate(-18deg)" }} />
              <Capsule variant="coral" size="lg" className="drift slow" style={{ position: "absolute", bottom: 60, right: -30, "--r": "22deg", transform: "rotate(22deg)" }} />
              <Sparkle size={28} color="var(--coral)" style={{ position: "absolute", top: 0, right: 30, animation: "spark 2.6s ease-in-out infinite" }} />
              <Star size={24} color="var(--ink)" style={{ position: "absolute", bottom: 30, left: 0, animation: "spin360 12s linear infinite" }} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Coverage / cities ─────────────────────────────────────── */
function Coverage() {
  const cities = [
    { name: "Bengaluru", x: "22%", y: "44%", v: "" },
    { name: "Mumbai", x: "16%", y: "30%", v: "coral" },
    { name: "Delhi NCR", x: "30%", y: "16%", v: "sky" },
    { name: "Hyderabad", x: "44%", y: "54%", v: "" },
    { name: "Chennai", x: "58%", y: "70%", v: "coral" },
    { name: "Pune", x: "22%", y: "62%", v: "sky" },
    { name: "Kolkata", x: "62%", y: "26%", v: "" },
    { name: "Ahmedabad", x: "12%", y: "20%", v: "sky" },
    { name: "Jaipur", x: "38%", y: "32%", v: "coral" },
    { name: "Lucknow", x: "52%", y: "20%", v: "" },
    { name: "Coimbatore", x: "70%", y: "62%", v: "sky" },
    { name: "Indore", x: "32%", y: "48%", v: "coral" },
  ];

  return (
    <section id="coverage" className="section-pad">
      <div className="container">
        <Reveal>
          <div className="coverage">
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 32 }}>
              <div>
                <span className="eyebrow" style={{ color: "var(--acid)" }}>
                  <span className="dot" /> Coverage
                </span>
                <h2 className="display-md" style={{ marginTop: 16, color: "#fff", maxWidth: 720 }}>
                  Live in <span className="fill-iri">18 cities</span> <br />
                  rolling out to <span className="italic">42 more</span>.
                </h2>
              </div>
              <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div className="stat dark"><span className="v">2.1k</span><span className="l">Pharmacies</span></div>
                <div className="stat dark"><span className="v">14k</span><span className="l">Couriers</span></div>
                <div className="stat dark"><span className="v">1.2M</span><span className="l">Deliveries / mo</span></div>
              </div>
            </div>

            <div className="map">
              <div className="grid-bg" />
              {/* abstract country blob */}
              <svg viewBox="0 0 800 480" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 }}>
                <path
                  d="M180 60 Q 320 30 460 50 Q 600 70 680 130 Q 760 200 720 290 Q 690 380 580 420 Q 460 450 360 430 Q 240 410 160 340 Q 90 270 110 180 Q 130 100 180 60 Z"
                  fill="rgba(56,189,248,0.06)" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5" strokeDasharray="6 8"
                />
              </svg>

              {cities.map((c) => (
                <div className={`pin ${c.v}`} key={c.name} style={{ left: c.x, top: c.y }}>
                  <span className="ping" />
                  <span className="label">{c.name}</span>
                </div>
              ))}

              {/* big sticker on map */}
              <div style={{ position: "absolute", right: 32, bottom: 32, transform: "rotate(-6deg)" }}>
                <div className="badge-circle" style={{ width: 130, height: 130, background: "var(--acid)", color: "var(--ink)" }}>
                  <div>
                    <div style={{ fontSize: 11, fontFamily: "var(--mono)", letterSpacing: "0.18em" }}>EXPANDING</div>
                    <div style={{ fontSize: 22, marginTop: 2 }}>+42<br />cities<br /><span style={{ fontSize: 12 }}>by Q4</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Partners ──────────────────────────────────────────────── */
function Partners() {
  const logos = ["MediCare", "WellCorner", "PharmaPlus", "Apollo Local", "Greenleaf Rx", "Quik Chemist"];
  return (
    <section id="partners" className="section-pad">
      <div className="container">
        <div className="partners">
          <Reveal>
            <div className="partner-card">
              <span className="eyebrow"><span className="dot" /> For Pharmacies</span>
              <h2 className="display-md" style={{ marginTop: 16, color: "var(--ink)" }}>
                Your shelf, <span className="italic">our streets.</span>
              </h2>
              <p style={{ marginTop: 20, fontSize: 17, lineHeight: 1.55, color: "rgba(10,21,48,0.75)", maxWidth: 460 }}>
                We're not opening dark stores next to you — we're sending you orders. Plug in your inventory, accept what you can fulfil, we handle the rest. Average partner does 38 extra orders a day.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
                <a href="#" className="btn-chrome">
                  <Lucide name="store" size={18} /> Become a partner
                </a>
                <a href="#" className="btn-chrome ghost">
                  <Lucide name="line-chart" size={18} /> See partner economics
                </a>
              </div>
              <div className="dotted-divider" />
              <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                <div className="stat"><span className="v">+38</span><span className="l">Orders/day avg.</span></div>
                <div className="stat"><span className="v">0%</span><span className="l">Setup fee</span></div>
                <div className="stat"><span className="v">T+1</span><span className="l">Settlement</span></div>
              </div>

              <Sparkle size={22} color="var(--ink)" style={{ position: "absolute", top: 24, right: 32, animation: "spin360 12s linear infinite" }} />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="partner-card dark">
              <span className="eyebrow" style={{ color: "var(--acid)" }}><span className="dot" /> Already with us</span>
              <h3 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 28, letterSpacing: "-0.02em", marginTop: 16, color: "#fff" }}>
                2,143 pharmacies and counting.
              </h3>
              <p style={{ marginTop: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.55 }}>
                From neighbourhood chemists to city-wide chains.
              </p>
              <div className="partner-grid">
                {logos.map((l) => (
                  <div className="partner-logo" key={l}>{l}</div>
                ))}
              </div>
              <div style={{ marginTop: 24, fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--acid)" }}>
                + 2,137 more →
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Download CTA ──────────────────────────────────────────── */
function Download() {
  return (
    <section id="download" className="section-pad">
      <div className="container">
        <Reveal>
          <div className="download">
            <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems: "center" }}>
              <div>
                <span className="eyebrow" style={{ color: "rgba(255,255,255,0.85)" }}>
                  <span className="dot" /> Get the app
                </span>
                <h2 className="display-lg" style={{ color: "#fff", marginTop: 16 }}>
                  Need it now? <br />
                  <span className="italic outlined" style={{ WebkitTextStroke: "2px #fff" }}>Get the app.</span>
                </h2>
                <p style={{ marginTop: 20, fontSize: 18, lineHeight: 1.5, color: "rgba(255,255,255,0.85)", maxWidth: 480 }}>
                  Free download. No subscription. First delivery on us.
                </p>

                <div className="app-buttons" style={{ marginTop: 32 }}>
                  <a href="#" className="app-btn">
                    <Lucide name="apple" size={28} />
                    <div>
                      <div className="small">Download on the</div>
                      <div className="big">App Store</div>
                    </div>
                  </a>
                  <a href="#" className="app-btn light">
                    <Lucide name="play" size={28} />
                    <div>
                      <div className="small">Get it on</div>
                      <div className="big">Google Play</div>
                    </div>
                  </a>
                </div>

                <div style={{ marginTop: 20, display: "flex", gap: 16, flexWrap: "wrap", color: "rgba(255,255,255,0.85)", fontSize: 14, fontFamily: "var(--mono)", letterSpacing: "0.06em" }}>
                  <span>★ 4.9 — 88k ratings</span>
                  <span>·</span>
                  <span>Editor's Choice 2025</span>
                </div>
              </div>

              {/* QR + decoration */}
              <div style={{ position: "relative", display: "flex", justifyContent: "flex-end" }}>
                <div style={{ position: "relative", padding: 20, background: "#fff", borderRadius: 24, border: "2px solid var(--ink)", boxShadow: "8px 8px 0 var(--ink)", transform: "rotate(4deg)" }}>
                  <QRBlock />
                  <div style={{ marginTop: 12, fontFamily: "var(--display)", fontWeight: 800, fontSize: 14, color: "var(--ink)", letterSpacing: "-0.01em", textAlign: "center" }}>
                    Scan to download →
                  </div>
                </div>
                <div className="badge-circle" style={{
                  position: "absolute", top: -30, left: -40,
                  width: 110, height: 110,
                  background: "var(--acid)", color: "var(--ink)",
                  fontSize: 14,
                  transform: "rotate(-14deg)",
                  animation: "drift 6s ease-in-out infinite"
                }}>
                  <div>
                    <div style={{ fontSize: 10, fontFamily: "var(--mono)", letterSpacing: "0.18em" }}>FREE</div>
                    <div style={{ fontSize: 18, marginTop: 2 }}>1st<br />drop</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function QRBlock() {
  // pseudo QR: 13x13 grid of randomly filled cells (deterministic for stability)
  const N = 17;
  const seed = (i) => ((i * 9301 + 49297) % 233280) / 233280;
  const cells = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const isCorner =
      (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
    const v = isCorner
      ? (
        (x === 0 || x === 6 || y === 0 || y === 6) ||
          (x >= 2 && x <= 4 && y >= 2 && y <= 4)
          ? 1 : 0
      )
        ? 1 : 0
      : seed(x * N + y) > 0.55 ? 1 : 0;
    if (v) cells.push([x, y]);
  }
  // corner finders
  const finder = (cx, cy) => (
    <>
      <rect x={cx} y={cy} width="7" height="7" fill="var(--ink)" />
      <rect x={cx + 1} y={cy + 1} width="5" height="5" fill="#fff" />
      <rect x={cx + 2} y={cy + 2} width="3" height="3" fill="var(--ink)" />
    </>
  );
  return (
    <svg viewBox={`0 0 ${N} ${N}`} width="160" height="160">
      <rect width={N} height={N} fill="#fff" />
      {cells.map(([x, y], i) => (
        (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7) ? null :
          <rect key={i} x={x} y={y} width="1" height="1" fill="var(--ink)" />
      ))}
      {finder(0, 0)}
      {finder(N - 7, 0)}
      {finder(0, N - 7)}
      {/* center logo */}
      <rect x={(N - 5) / 2} y={(N - 5) / 2} width="5" height="5" fill="#fff" />
      <rect x={(N - 5) / 2 + 1} y={(N - 5) / 2 + 1} width="3" height="3" fill="var(--coral)" />
    </svg>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────── */
function FAQ() {
  const [open, setOpen] = useS_s(0);
  const items = [
    {
      q: "Do you sell or store medicine yourselves?",
      a: "No. FlashMed is strictly a connector — we never own, store, or sell medicine. Every order is filled and dispensed by a licensed local pharmacy. We just handle the matching, the courier, and the app.",
    },
    {
      q: "What about prescription medicines?",
      a: "Prescription items require a valid Rx, uploaded in the app or on file with the pharmacy. The pharmacist verifies it before dispensing — same as walking in, just faster.",
    },
    {
      q: "What if you miss the 10-minute promise?",
      a: "The 10-minute goal is a benchmark for speed — not pressure. We never expect our delivery partners to risk their safety or break traffic rules. Delays due to traffic, weather, safety, or pharmacy preparation can happen, and responsible delivery always comes first.",
    },
    {
      q: "How are prices set?",
      a: "All medicine is sold at the printed MRP — same price you'd pay at the counter. We charge a flat ₹19 delivery fee, waived on your first order and on orders over ₹299.",
    },
    {
      q: "Cold-chain items — insulin, vaccines?",
      a: "We use validated 2–8°C insulated boxes with temperature loggers. Each handover includes a timestamped photo and the temperature reading. Available in all 18 cities.",
    },
    {
      q: "Where do you operate?",
      a: "18 cities across India today, expanding to 60 by end of year. See the coverage map above for current zones — service hours are 24/7 in all live cities.",
    },
  ];

  return (
    <section id="faq" className="section-pad">
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 56 }}>
        <Reveal>
          <div style={{ position: "sticky", top: 100 }}>
            <span className="eyebrow"><span className="dot" /> FAQ</span>
            <h2 className="display-md" style={{ marginTop: 16 }}>
              Questions, <br />
              <span className="italic fill-coral">answered.</span>
            </h2>
            <p style={{ marginTop: 16, color: "rgba(10,21,48,0.65)", maxWidth: 360 }}>
              Anything we missed? Tap "Ask a pharmacist" in the app — a real one replies in under 2 min.
            </p>
            <div style={{ marginTop: 24 }}>
              <a href="#" className="btn-chrome ghost">
                <Lucide name="message-circle" size={16} /> Contact support
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="faq">
            {items.map((it, i) => (
              <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
                <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                  <span>{it.q}</span>
                  <span className="chev"><Lucide name="plus" size={16} /></span>
                </button>
                <div className="faq-a">
                  <div className="faq-a-inner">{it.a}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Footer ───────────────────────────────────────────────── */
function Footer({ onOpenLegal }) {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 64 }}>
          <h2 className="display-lg" style={{ maxWidth: 900 }}>
            <span className="italic fill-iri">Fast.</span> &nbsp;
            <span className="outlined" style={{ WebkitTextStroke: "2px var(--cream)" }}>Local.</span> &nbsp;
            <span style={{ color: "var(--acid)" }}>Always on.</span>
          </h2>
          <a href="#download" className="btn-chrome acid">
            <Lucide name="smartphone" size={18} /> Get the app
          </a>
        </div>

        <div className="columns">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ display: "inline-grid", placeItems: "center", width: 36, height: 36, borderRadius: 999, background: "var(--acid)", border: "1.5px solid var(--cream)", color: "var(--ink)" }}>
                <Lucide name="zap" size={18} />
              </span>
              <span style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em" }}>
                Flash<span style={{ fontStyle: "italic" }}>Med</span><span style={{ color: "var(--coral)" }}>.</span>
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.6, maxWidth: 320 }}>
              FlashMed connects you to licensed local pharmacies. We do not sell, dispense, or store any medicine. Pharmacy partners are independently regulated.
            </p>
          </div>
          <div>
            <h5>For You</h5>
            <ul>
              <li><a href="#">How it works</a></li>
              <li><a href="#">Coverage</a></li>
              <li><a href="#">Download app</a></li>
              <li><a href="#">Help center</a></li>
            </ul>
          </div>
          <div>
            <h5>For Pharmacies</h5>
            <ul>
              <li><a href="#">Become a partner</a></li>
              <li><a href="#">Partner login</a></li>
              <li><a href="#">Economics</a></li>
              <li><a href="#">Compliance</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onOpenLegal('contact'); }}>Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="legal">
          <span>Connector platform · We do not sell medicine</span>
          <span>
            <a href="#" onClick={(e) => { e.preventDefault(); onOpenLegal('privacy'); }} style={{ color: "rgba(255,255,255,0.5)" }}>Privacy</a> ·{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); onOpenLegal('terms'); }} style={{ color: "rgba(255,255,255,0.5)" }}>Terms</a> ·{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); onOpenLegal('payment'); }} style={{ color: "rgba(255,255,255,0.5)" }}>Payment & Refunds</a> ·{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); onOpenLegal('compliance'); }} style={{ color: "rgba(255,255,255,0.5)" }}>Drugs Act compliance</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export { MarqueeStrip, HowItWorks, WhyUs, PhoneSection, Coverage, Partners, Download, FAQ, Footer };
