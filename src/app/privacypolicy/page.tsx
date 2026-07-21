import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — FlashMed',
  description: 'FlashMed™ Privacy Policy — CIN: U73100WB2026PTC276243 | UDYAM: WB-13-0148760 | Effective Date: 20 May 2026 | Version 3.0. Compliant with: Information Technology Act, 2000 | Digital Personal Data Protection Act, 2023.',
  alternates: { canonical: 'https://flashmed.in/privacypolicy' },
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 20 }}>
    <h2 style={{ fontSize: 15, fontWeight: 800, color: '#F9FAFB', marginBottom: 10, marginTop: 4 }}>{title}</h2>
    {children}
  </div>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 13, lineHeight: '20px', color: '#444', marginBottom: 8, paddingLeft: 14 }}>• {children}</p>
);

const Bold = ({ children }: { children: React.ReactNode }) => (
  <strong style={{ fontWeight: 800, color: '#1a1a2e' }}>{children}</strong>
);

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0d1117 0%,#0f1b2d 100%)', color: '#D1D5DB', fontFamily: "'Inter',system-ui,sans-serif", padding: '0 0 48px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', padding: '48px 0 36px' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#059669,#047857)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💊</div>
            <span style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#059669,#34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FlashMed</span>
          </a>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#059669', marginBottom: 4, marginTop: 0 }}>FLASHMED™ PRIVACY POLICY</h1>
          <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: '18px', margin: 0 }}>
            CIN: U73100WB2026PTC276243 | UDYAM: WB-13-0148760 | Effective Date: 20 May 2026 | Version 3.0<br />
            FlashMed™ is a product of Flashverse Labs Private Limited<br />
            Compliant with: Information Technology Act, 2000 | Digital Personal Data Protection Act, 2023
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.96)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px' }}>

          <Section title="1. WHO WE ARE — TECHNOLOGY AGGREGATOR AND CONNECTOR">
            <Bullet><Bold>FlashMed™</Bold> is a product and registered trademark of <Bold>Flashverse Labs Private Limited</Bold>, a company incorporated under the Companies Act, 2013, with CIN: U73100WB2026PTC276243 and UDYAM Registration No. WB-13-0148760. FlashMed™ operates exclusively as a <Bold>technology aggregator and connector platform</Bold> under Section 79 of the Information Technology Act, 2000, and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.</Bullet>
            <Bullet><Bold>FLASHMED™ IS NOT AN E-PHARMACY.</Bold> FlashMed™ does not hold any drug licence and does not engage in any activity requiring one. FlashMed™ does not procure, stock, store, dispense, or sell any medicine or pharmaceutical product. All such activities are performed exclusively by independent licensed Pharmacy Partners in their own capacity as licensed retailers under the Drugs and Cosmetics Act, 1940, and the Pharmacy Act, 1948. FlashMed™ merely provides a technology platform for customers to discover and connect with such pharmacies.</Bullet>
            <Bullet><Bold>Registered Office:</Bold> 12 Md Asfaque Akhtar, New Dakbanglow Bus Stand, Dhuliyan, Murshidabad, West Bengal — 742202, India.</Bullet>
            <Bullet><Bold>Contact for Privacy Matters:</Bold> support@flashmed.in</Bullet>
            <Bullet>FlashMed™&apos;s sole role is to <Bold>connect</Bold> customers with independent licensed Pharmacy Partners, diagnostic laboratories, and registered medical practitioners; coordinate delivery through independent Delivery Partners; and facilitate emergency blood request alerts. FlashMed™ is a technology aggregator and connector — not a principal in any healthcare transaction, and does not practice pharmacy or medicine.</Bullet>
          </Section>

          <Section title="2. WHAT DATA WE COLLECT">
            <Bullet><Bold>2.1 Identity Data:</Bold> Full name, date of birth, gender.</Bullet>
            <Bullet><Bold>2.2 Contact Data:</Bold> Mobile number, email address, delivery address, billing address.</Bullet>
            <Bullet><Bold>2.3 Health Data:</Bold> Prescription images (uploaded solely for the Pharmacy Partner&apos;s verification), product order history, blood type (voluntary, for Blood SOS), known allergies (voluntary).</Bullet>
            <Bullet><Bold>2.4 Location Data:</Bold> Real‑time GPS with explicit consent, used only for delivery coordination and proximity‑based Blood SOS alerts. Approximate location may be used to find nearby Pharmacy/Lab Partners.</Bullet>
            <Bullet><Bold>2.5 Payment Data:</Bold> Transaction references, UPI IDs, payment tokens. <Bold>We NEVER store</Bold> full card numbers, CVV, expiry, or banking passwords. All payment processing is handled by Cashfree Payments, an RBI‑authorised PCI‑DSS compliant aggregator.</Bullet>
            <Bullet><Bold>2.6 Device Data:</Bold> Device ID, OS version, app version, push notification token, crash logs – for technical support and performance improvement only.</Bullet>
            <Bullet><Bold>2.7 We explicitly DO NOT collect:</Bold> Aadhaar number, PAN, biometric data, racial/ethnic origin, religious or political beliefs, sexual orientation, or any data unnecessary for the described services.</Bullet>
          </Section>

          <Section title="3. HOW WE USE YOUR DATA">
            <Bullet><Bold>3.1 Order Fulfillment:</Bold> To transmit your order and prescription to licensed Pharmacy Partners, coordinate delivery, and process payments.</Bullet>
            <Bullet><Bold>3.2 Blood SOS Alerts:</Bold> To send time‑bound alerts to voluntary donors within a 5‑km radius. Location data is used <Bold>only during the SOS event</Bold> and not retained beyond its duration.</Bullet>
            <Bullet><Bold>3.3 Customer Support:</Bold> To resolve grievances, process refunds, and investigate disputes.</Bullet>
            <Bullet><Bold>3.4 Safety &amp; Compliance:</Bold> To prevent fraud, detect fake prescriptions, comply with legal obligations (including lawful government requests under the Code of Criminal Procedure, 1973), and enforce our Terms.</Bullet>
            <Bullet><Bold>3.5 Service Improvement:</Bold> Only anonymised, aggregated statistics for app performance. <Bold>No individual profiling or automated decision‑making</Bold> is performed for advertising.</Bullet>
            <Bullet><Bold>3.6 ABSOLUTE PROHIBITION ON SALE OF DATA:</Bold> We will <Bold>never</Bold> sell, rent, trade, or monetise your personal data to any third party for any commercial purpose.</Bullet>
          </Section>

          <Section title="4. DATA STORAGE AND LOCALISATION">
            <Bullet><Bold>4.1 All personal data</Bold> is stored exclusively on servers located within India, in compliance with the DPDP Act, 2023, and RBI&apos;s data localisation directives.</Bullet>
            <Bullet><Bold>4.2 Primary storage:</Bold> User data, order records, and transaction history are stored in encrypted <Bold>PostgreSQL databases</Bold> hosted on cloud infrastructure within India. Firebase (asia‑south1 / Mumbai region) is used for real-time communication, push notifications, and authentication only. Prescription images are stored on Cloudinary (India region). All data is encrypted at rest using AES‑256 and in transit using TLS 1.3.</Bullet>
            <Bullet>
              <Bold>4.3 Data Retention Schedule:</Bold><br />
              • Order data: 7 years (statutory requirement)<br />
              • Account data: Until deletion request is processed<br />
              • Location data: Deleted within 24 hours of order completion/SOS closure<br />
              • Prescription images: Deleted 90 days after order completion, unless needed for dispute resolution<br />
              • Crash logs: 90 days
            </Bullet>
            <Bullet><Bold>4.4 Cross‑border transfer:</Bold> We do not transfer personal data outside India except where technically necessary (e.g., Firebase backend) and only with appropriate DPDP‑compliant safeguards.</Bullet>
          </Section>

          <Section title="5. DATA SHARING — LIMITED AND PURPOSEFUL">
            <Bullet><Bold>5.1 Pharmacy Partners:</Bold> Name, delivery address, prescription image, contact number – solely for order fulfilment. They are contractually bound to use this data only for that purpose.</Bullet>
            <Bullet><Bold>5.2 Delivery Partners:</Bold> Name, address, contact number – only for the specific delivery. They are prohibited from retaining or reusing this data.</Bullet>
            <Bullet><Bold>5.3 Lab Partners:</Bold> Name, contact, address (for home collection), test requirements – for the booked service only.</Bullet>
            <Bullet><Bold>5.4 Payment Processors (Cashfree):</Bold> Only payment amount and transaction metadata; <Bold>never</Bold> prescription or health data.</Bullet>
            <Bullet><Bold>5.5 Government Authorities:</Bold> Disclosure only when required by a legally valid order under Indian law.</Bullet>
            <Bullet><Bold>5.6 No commercial disclosure:</Bold> Prescriptions, health history, blood type, or medical information will never be shared with third‑party marketers.</Bullet>
          </Section>

          <Section title="6. YOUR RIGHTS UNDER DPDP ACT 2023">
            <Bullet>As a data principal, you have the right to:</Bullet>
            <Bullet><Bold>6.1 Access</Bold> – Obtain a copy of your personal data.</Bullet>
            <Bullet><Bold>6.2 Correction</Bold> – Correct inaccurate or misleading data.</Bullet>
            <Bullet><Bold>6.3 Erasure</Bold> – Request deletion (subject to legal retention).</Bullet>
            <Bullet><Bold>6.4 Grievance Redressal</Bold> – File a complaint with our Grievance Officer.</Bullet>
            <Bullet><Bold>6.5 Nomination</Bold> – Nominate an individual to exercise rights on your behalf.</Bullet>
            <Bullet><Bold>6.6 How to exercise:</Bold> Email support@flashmed.in with subject &quot;DPDP Rights Request – [Your Phone Number]&quot;. We will respond within 30 days.</Bullet>
          </Section>

          <Section title="7. CHILDREN'S PRIVACY">
            <Bullet>FlashMed services are <Bold>not directed at persons under 18</Bold>. If we inadvertently collect data from a minor, we will delete it within 72 hours of discovery.</Bullet>
          </Section>

          <Section title="8. COOKIES AND TRACKING">
            <Bullet>Our app does not use traditional cookies. We use Firebase Analytics for anonymised usage statistics; you can disable analytics in your device settings.</Bullet>
          </Section>

          <Section title="9. DATA BREACH NOTIFICATION">
            <Bullet>In case of a personal data breach, we will notify the Data Protection Board of India and all affected users within 72 hours, as required by Rule 9 of the DPDP Rules.</Bullet>
          </Section>

          <Section title="10. GRIEVANCE OFFICER — PRIVACY">
            <Bullet><Bold>Name:</Bold> Nahid Hasan</Bullet>
            <Bullet><Bold>Designation:</Bold> Director, Chairman &amp; CEO, Flashverse Labs Private Limited</Bullet>
            <Bullet><Bold>Email:</Bold> support@flashmed.in</Bullet>
            <Bullet><Bold>Phone:</Bold> +91 9144150105</Bullet>
            <Bullet><Bold>Address:</Bold> 12 Md Asfaque Akhtar, New Dakbanglow Bus Stand, Dhuliyan, Murshidabad, West Bengal — 742202</Bullet>
            <Bullet><Bold>Response Time:</Bold> Acknowledgment within 24 hours; resolution aimed within 7 days.</Bullet>
          </Section>

          <Section title="11. CHANGES TO THIS POLICY">
            <Bullet>We may update this Privacy Policy from time to time. Material changes will be notified via app notification or email at least 7 days before they take effect.</Bullet>
          </Section>

        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a href="/" style={{ color: '#059669', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
