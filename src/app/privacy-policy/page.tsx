import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — FlashMed',
  description: 'FlashMed Privacy Policy — how we collect, use, and protect your personal data under the DPDP Act 2023.',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 28 }}>
    <h2 style={{ fontSize: 17, fontWeight: 700, color: '#059669', marginBottom: 10, marginTop: 0 }}>{title}</h2>
    {children}
  </div>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <p style={{ marginBottom: 8, lineHeight: 1.75, paddingLeft: 16, borderLeft: '2px solid rgba(5,150,105,0.2)', color: '#D1D5DB', fontSize: 14 }}>
    {children}
  </p>
);

const Bold = ({ children }: { children: React.ReactNode }) => (
  <strong style={{ color: '#F9FAFB', fontWeight: 700 }}>{children}</strong>
);

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0d1117 0%,#0f1b2d 100%)', color: '#D1D5DB', fontFamily: "'Inter',system-ui,sans-serif", padding: '0 0 48px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', padding: '48px 0 36px' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#059669,#047857)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💊</div>
            <span style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#059669,#34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FlashMed</span>
          </a>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#F9FAFB', marginBottom: 8, marginTop: 0 }}>Privacy Policy</h1>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
            Effective Date: 1 June 2025 &nbsp;|&nbsp; Issued by Flashverse Labs Private Limited (CIN: U73100WB2026PTC276243)
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px' }}>

          <Section title="1. SCOPE AND CONSENT">
            <Bullet>This Privacy Policy applies to the FlashMed mobile application, website (flashmed.in), and all related services operated by Flashverse Labs Private Limited ("FlashMed", "we", "us").</Bullet>
            <Bullet>By using FlashMed, you explicitly consent to the collection and processing of your personal data as described herein, in accordance with the <Bold>Digital Personal Data Protection Act, 2023 (DPDP Act)</Bold> and the Information Technology Act, 2000.</Bullet>
          </Section>

          <Section title="2. WHAT DATA WE COLLECT">
            <Bullet><Bold>2.1 Identity Data:</Bold> Full name, date of birth, gender.</Bullet>
            <Bullet><Bold>2.2 Contact Data:</Bold> Mobile number, email address, delivery address, billing address.</Bullet>
            <Bullet><Bold>2.3 Health Data:</Bold> Prescription images (uploaded solely for the Pharmacy Partner's verification), product order history, blood type (voluntary, for Blood SOS), known allergies (voluntary).</Bullet>
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
            <Bullet><Bold>4.1</Bold> All personal data is stored exclusively on servers located within India, in compliance with the DPDP Act, 2023, and RBI's data localisation directives.</Bullet>
            <Bullet><Bold>4.2 Primary storage:</Bold> User data, order records, and transaction history are stored in encrypted PostgreSQL databases hosted on cloud infrastructure within India. Firebase (asia‑south1 / Mumbai region) is used for real-time communication, push notifications, and authentication only. Prescription images are stored on Cloudinary (India region). All data is encrypted at rest using AES‑256 and in transit using TLS 1.3.</Bullet>
            <Bullet><Bold>4.3 Data Retention Schedule:</Bold><br/>• Order data: 7 years (statutory requirement)<br/>• Account data: Until deletion request is processed<br/>• Location data: Deleted within 24 hours of order completion/SOS closure<br/>• Prescription images: Deleted 90 days after order completion<br/>• Crash logs: 90 days</Bullet>
          </Section>

          <Section title="5. DATA SHARING — LIMITED AND PURPOSEFUL">
            <Bullet><Bold>5.1 Pharmacy Partners:</Bold> Name, delivery address, prescription image, contact number – solely for order fulfilment.</Bullet>
            <Bullet><Bold>5.2 Delivery Partners:</Bold> Name, address, contact number – only for the specific delivery.</Bullet>
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
            <Bullet><Bold>6.5 How to exercise:</Bold> Email support@flashmed.in with subject "DPDP Rights Request – [Your Phone Number]". We will respond within 30 days.</Bullet>
          </Section>

          <Section title="7. CHILDREN'S PRIVACY">
            <Bullet>FlashMed services are <Bold>not directed at persons under 18</Bold>. If we inadvertently collect data from a minor, we will delete it within 72 hours of discovery.</Bullet>
          </Section>

          <Section title="8. DATA BREACH NOTIFICATION">
            <Bullet>In case of a personal data breach, we will notify the Data Protection Board of India and all affected users within 72 hours, as required by Rule 9 of the DPDP Rules.</Bullet>
          </Section>

          <Section title="9. GRIEVANCE OFFICER — PRIVACY">
            <Bullet><Bold>Name:</Bold> Nahid Hasan</Bullet>
            <Bullet><Bold>Designation:</Bold> Director, Chairman &amp; CEO, Flashverse Labs Private Limited</Bullet>
            <Bullet><Bold>Email:</Bold> support@flashmed.in</Bullet>
            <Bullet><Bold>Phone:</Bold> +91 9144150105</Bullet>
            <Bullet><Bold>Address:</Bold> 12 Md Asfaque Akhtar, New Dakbanglow Bus Stand, Dhuliyan, Murshidabad, West Bengal — 742202</Bullet>
            <Bullet><Bold>Response Time:</Bold> Acknowledgment within 24 hours; resolution aimed within 7 days.</Bullet>
          </Section>

          <Section title="10. CHANGES TO THIS POLICY">
            <Bullet>We may update this Privacy Policy from time to time. Material changes will be notified via app notification or email at least 7 days before they take effect.</Bullet>
          </Section>

          <div style={{ height: 16 }} />
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a href="/" style={{ color: '#059669', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
