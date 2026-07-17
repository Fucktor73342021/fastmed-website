import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rider Privacy Policy — FlashMed',
  description: 'FlashMed Rider (Delivery Partner) Privacy Policy — how we handle delivery partner data.',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 28 }}>
    <h2 style={{ fontSize: 17, fontWeight: 700, color: '#059669', marginBottom: 10, marginTop: 0 }}>{title}</h2>
    {children}
  </div>
);
const Bullet = ({ children }: { children: React.ReactNode }) => (
  <p style={{ marginBottom: 8, lineHeight: 1.75, paddingLeft: 16, borderLeft: '2px solid rgba(5,150,105,0.2)', color: '#D1D5DB', fontSize: 14 }}>{children}</p>
);
const Bold = ({ children }: { children: React.ReactNode }) => (
  <strong style={{ color: '#F9FAFB', fontWeight: 700 }}>{children}</strong>
);

export default function RiderPrivacyPolicy() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0d1117 0%,#0f1b2d 100%)', color: '#D1D5DB', fontFamily: "'Inter',system-ui,sans-serif", padding: '0 0 48px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', padding: '48px 0 36px' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#059669,#047857)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💊</div>
            <span style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#059669,#34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FlashMed</span>
          </a>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#F9FAFB', marginBottom: 8, marginTop: 0 }}>Rider Privacy Policy</h1>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
            Effective Date: 1 June 2025 &nbsp;|&nbsp; Flashverse Labs Private Limited (CIN: U73100WB2026PTC276243)
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px' }}>

          <Section title="1. SCOPE">
            <Bullet>This Rider Privacy Policy applies to Delivery Partners ("Riders") who use the FlashMed Delivery Partner application operated by Flashverse Labs Private Limited.</Bullet>
            <Bullet>By registering as a Delivery Partner, you consent to the collection and processing of your personal data as described herein.</Bullet>
          </Section>

          <Section title="2. DATA WE COLLECT FROM RIDERS">
            <Bullet><Bold>2.1 Identity Data:</Bold> Full name, date of birth, government-issued ID (Aadhaar card number for KYC verification only, not stored post-verification), PAN card for tax purposes.</Bullet>
            <Bullet><Bold>2.2 Contact Data:</Bold> Mobile number, email address, home address.</Bullet>
            <Bullet><Bold>2.3 Vehicle Data:</Bold> Vehicle registration number, type, and driving licence number.</Bullet>
            <Bullet><Bold>2.4 Real-Time Location:</Bold> GPS location during active delivery shifts only. Location tracking stops when you go offline.</Bullet>
            <Bullet><Bold>2.5 Financial Data:</Bold> Bank account details and UPI ID for earnings disbursement. This data is encrypted and never shared with third parties other than our payment processor.</Bullet>
            <Bullet><Bold>2.6 Performance Data:</Bold> Delivery completion rates, customer ratings, delivery times — used for platform quality and incentive calculations.</Bullet>
          </Section>

          <Section title="3. HOW WE USE RIDER DATA">
            <Bullet><Bold>3.1 Order Assignment:</Bold> To match and assign nearby deliveries based on your real-time location.</Bullet>
            <Bullet><Bold>3.2 Earnings &amp; Payments:</Bold> To calculate and disburse earnings, incentives, and bonuses.</Bullet>
            <Bullet><Bold>3.3 Safety &amp; Verification:</Bold> Background verification and ongoing compliance checks.</Bullet>
            <Bullet><Bold>3.4 Customer Communication:</Bold> To share your first name and vehicle details with customers for delivery tracking.</Bullet>
            <Bullet><Bold>3.5 ABSOLUTE PROHIBITION:</Bold> We will <Bold>never</Bold> sell or share your personal data for advertising or commercial purposes.</Bullet>
          </Section>

          <Section title="4. DATA RETENTION">
            <Bullet>Active rider data: Retained during the partnership and for 3 years post-termination for legal compliance.</Bullet>
            <Bullet>Location history: Deleted within 90 days after each delivery.</Bullet>
            <Bullet>Financial records: Retained for 7 years as required by Indian tax law.</Bullet>
          </Section>

          <Section title="5. YOUR RIGHTS AS A RIDER">
            <Bullet>You may request access to, correction of, or deletion of your personal data by emailing support@flashmed.in with subject "Rider Data Request – [Your Registered Phone Number]".</Bullet>
            <Bullet>Requests will be acknowledged within 24 hours and resolved within 30 days.</Bullet>
          </Section>

          <Section title="6. GRIEVANCE OFFICER">
            <Bullet><Bold>Name:</Bold> Nahid Hasan</Bullet>
            <Bullet><Bold>Email:</Bold> support@flashmed.in</Bullet>
            <Bullet><Bold>Phone:</Bold> +91 9144150105</Bullet>
            <Bullet><Bold>Address:</Bold> 12 Md Asfaque Akhtar, New Dakbanglow Bus Stand, Dhuliyan, Murshidabad, West Bengal — 742202</Bullet>
          </Section>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a href="/" style={{ color: '#059669', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
