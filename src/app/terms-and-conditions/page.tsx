import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions — FlashMed',
  description: 'FlashMed Terms and Conditions — user agreement for FlashMed medicine delivery, lab booking, doctor consultation, and Blood SOS services.',
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

export default function TermsAndConditions() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0d1117 0%,#0f1b2d 100%)', color: '#D1D5DB', fontFamily: "'Inter',system-ui,sans-serif", padding: '0 0 48px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', padding: '48px 0 36px' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#059669,#047857)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💊</div>
            <span style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#059669,#34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FlashMed</span>
          </a>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#F9FAFB', marginBottom: 8, marginTop: 0 }}>Terms &amp; Conditions</h1>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
            Effective Date: 1 June 2025 &nbsp;|&nbsp; Flashverse Labs Private Limited (CIN: U73100WB2026PTC276243)
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px' }}>

          <Section title="1. ACCEPTANCE OF TERMS">
            <Bullet>By downloading, installing, or using the FlashMed application or website (collectively, the "Platform"), you agree to be bound by these Terms and Conditions.</Bullet>
            <Bullet>If you do not agree to these Terms, you must immediately cease use of the Platform.</Bullet>
          </Section>

          <Section title="2. ABOUT FLASHMED">
            <Bullet>FlashMed is a technology platform operated by <Bold>Flashverse Labs Private Limited</Bold> (CIN: U73100WB2026PTC276243; UDYAM: WB-13-0148760) that connects customers with licensed Pharmacy Partners, Lab Partners, Blood Banks, and independent Delivery Partners.</Bullet>
            <Bullet>FlashMed is a <Bold>marketplace facilitator only</Bold>. We do not manufacture, stock, or directly sell any medicines, lab reagents, or blood products. All products are sold by licensed Pharmacy Partners or Lab Partners.</Bullet>
          </Section>

          <Section title="3. PRESCRIPTION MEDICINES — REGULATORY COMPLIANCE">
            <Bullet>The sale of prescription medicines is governed by the Drugs and Cosmetics Act, 1940 and applicable State Drug Rules. A valid prescription from a registered medical practitioner is mandatory for all Schedule H, H1, and X drugs.</Bullet>
            <Bullet>By uploading a prescription, you declare it is <Bold>genuine, legally obtained, and not forged</Bold>. Uploading a fake or forged prescription constitutes a criminal offence under the IPC and the Drugs and Cosmetics Act.</Bullet>
            <Bullet>FlashMed is <Bold>not liable</Bold> for: (a) the quality, efficacy, or genuineness of any medicine; (b) any adverse drug reaction; (c) the professional conduct of any Pharmacy Partner.</Bullet>
          </Section>

          <Section title="4. BLOOD SOS – COMMUNITY EMERGENCY SERVICE">
            <Bullet>Blood SOS is a <Bold>facilitation service only</Bold>. FlashMed does not procure, test, store, or transfuse blood. We only connect requesters to registered blood banks and voluntary donors.</Bullet>
            <Bullet>All blood‑related activities are performed by licensed blood banks holding a valid licence under the Drugs and Cosmetics Act (Schedule F, Part XII‑B).</Bullet>
            <Bullet>FlashMed <Bold>does not guarantee</Bold> donor response, blood type match, or availability. Users must independently verify donor identity and medical fitness.</Bullet>
          </Section>

          <Section title="5. DELIVERY SERVICES – INDEPENDENT CONTRACTORS">
            <Bullet>Delivery Partners are independent contractors, not employees of FlashMed. They are responsible for maintaining valid licences, handling medicines with care, and complying with all traffic and safety laws.</Bullet>
            <Bullet>FlashMed is not liable for any loss, damage, theft, or delay caused by the Delivery Partner during transit.</Bullet>
          </Section>

          <Section title="6. LAB TESTS – DIAGNOSTIC SERVICES">
            <Bullet>All diagnostic tests are performed by independent registered Lab Partners. FlashMed only facilitates booking and result delivery.</Bullet>
            <Bullet>FlashMed does not interpret test results or provide medical diagnoses.</Bullet>
          </Section>

          <Section title="7. FEES AND CHARGES">
            <Bullet><Bold>Important Notice — Dynamic Pricing:</Bold> All charges on the FlashMed platform are dynamic in nature. Fees vary based on location, distance, time of day, season, weather conditions, order type, applicable taxes, and periodic revisions by FlashMed. The exact charges applicable to a specific order are those displayed at the time of order placement.</Bullet>
            <Bullet><Bold>Delivery charges</Bold> are computed based on distance between the Pharmacy Partner and the delivery address. Additional surcharges may apply for night‑time deliveries, adverse weather, cold‑chain requirements, and other operational factors.</Bullet>
            <Bullet><Bold>Platform Convenience Fee:</Bold> A platform service fee per order may be charged. The applicable amount is always shown at checkout.</Bullet>
            <Bullet><Bold>Blood SOS technology facilitation fee:</Bold> A technology facilitation fee applies for initiating a Blood SOS request. The amount is displayed at the time of request. This is a technology coordination charge only. FlashMed does not sell, supply, store, or transfuse blood.</Bullet>
            <Bullet><Bold>FlashMed Premium (Subscription):</Bold> Subscription plans and their pricing are subject to change at FlashMed's discretion. Benefits may include delivery charge waivers, in‑app wallet cashback, and other promotional benefits.</Bullet>
            <Bullet><Bold>Refer &amp; Earn:</Bold> Referral bonus amounts and eligibility criteria are subject to change. Wallet credits earned through referrals are non‑refundable and usable only for future FlashMed orders.</Bullet>
            <Bullet>All charges attract applicable GST and statutory taxes at prevailing rates.</Bullet>
          </Section>

          <Section title="8. USER CONDUCT AND PROHIBITED ACTIVITIES">
            <Bullet>You agree NOT to: upload fake/forged prescriptions; order controlled substances; misuse Blood SOS for non‑emergencies; harass any partner; create multiple accounts; reverse‑engineer the Platform.</Bullet>
            <Bullet>Violations may lead to permanent account ban and legal action under the Indian Penal Code, 1860.</Bullet>
          </Section>

          <Section title="9. INTELLECTUAL PROPERTY">
            <Bullet>FlashMed™ is a registered trademark and product of Flashverse Labs Private Limited (CIN: U73100WB2026PTC276243). All Platform content, software, and branding are the exclusive property of Flashverse Labs Private Limited. Unauthorised use is prohibited.</Bullet>
          </Section>

          <Section title="10. DISCLAIMERS AND LIMITATION OF LIABILITY">
            <Bullet>THE PLATFORM IS PROVIDED "AS IS". FLASHMED DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING FITNESS FOR A PARTICULAR PURPOSE.</Bullet>
            <Bullet>FLASHMED'S TOTAL LIABILITY TO ANY USER SHALL NOT EXCEED THE AMOUNT PAID BY THAT USER FOR THE SPECIFIC ORDER IN QUESTION.</Bullet>
            <Bullet>FLASHMED SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM THE USE OF THE PLATFORM OR THIRD‑PARTY SERVICES.</Bullet>
          </Section>

          <Section title="11. GOVERNING LAW AND DISPUTE RESOLUTION">
            <Bullet>These Terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts in Murshidabad, West Bengal.</Bullet>
            <Bullet>Before initiating legal proceedings, users must first contact the Grievance Officer for resolution.</Bullet>
          </Section>

          <Section title="12. GRIEVANCE OFFICER">
            <Bullet><Bold>Name:</Bold> Nahid Hasan</Bullet>
            <Bullet><Bold>Designation:</Bold> Director, Chairman &amp; CEO, Flashverse Labs Private Limited</Bullet>
            <Bullet><Bold>CIN:</Bold> U73100WB2026PTC276243</Bullet>
            <Bullet><Bold>UDYAM Registration:</Bold> WB-13-0148760</Bullet>
            <Bullet><Bold>Address:</Bold> 12 Md Asfaque Akhtar, New Dakbanglow Bus Stand, Dhuliyan, Murshidabad, West Bengal — 742202</Bullet>
            <Bullet><Bold>Email:</Bold> support@flashmed.in</Bullet>
            <Bullet><Bold>Phone:</Bold> +91 9144150105</Bullet>
            <Bullet><Bold>Response Time:</Bold> Acknowledgment within 24 hours; resolution aimed within 48 hours.</Bullet>
          </Section>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a href="/" style={{ color: '#059669', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
