/* global React, ReactDOM, LogoMark, Wordmark, Lucide, Marquee, Hero, MarqueeStrip, HowItWorks, WhyUs, PhoneSection, Coverage, Partners, Download, FAQ, Footer */
const { useEffect: useE_a } = React;

function Nav() {
  return (
    <div className="nav-wrap" style={{ paddingTop: 16 }}>
      <div className="nav">
        <a href="#top" className="logo">
          <LogoMark />
          <Wordmark />
        </a>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#why">Why us</a>
          <a href="#coverage">Coverage</a>
          <a href="#partners">Pharmacies</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="nav-cta">
          <a href="#partners" className="btn-mini">For pharmacies</a>
          <a href="#download" className="btn-mini dark">Get the app</a>
        </div>
      </div>
    </div>
  );
}

function App() {
  useE_a(() => {
    if (window.lucide) window.lucide.createIcons();
    // re-run lucide on next tick to catch React-mounted icons
    const t = setTimeout(() => window.lucide && window.lucide.createIcons(), 100);
    return () => clearTimeout(t);
  });

  return (
    <div id="top">
      <Nav />
      <Hero />

      <Marquee
        items={[
          "10 min flat",
          "real local pharmacies",
          "no warehouse, no markup",
          "open 24/7",
          "cold chain kept",
          "MRP. always.",
        ]}
        variant="acid fast"
      />

      <HowItWorks />

      <Marquee
        items={[
          "we don't sell medicine",
          "we connect you to licensed local pharmacies",
          "your pharmacist fills it",
          "our courier sprints it",
          "you watch it arrive",
        ]}
        variant="cream reverse"
      />

      <WhyUs />
      <PhoneSection />
      <Coverage />
      <Partners />

      <Marquee
        items={[
          "★ 4.9 on the App Store",
          "Editor's Choice 2025",
          "1.2M deliveries / month",
          "9:42 avg. door-to-door",
          "18 cities live",
          "+42 cities by Q4",
        ]}
        variant="sky fast"
      />

      <Download />
      <FAQ />
      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
