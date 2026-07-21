import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions — FlashMed',
  description: 'FlashMed™ Platform Terms & Conditions — CIN: U73100WB2026PTC276243 | UDYAM: WB-13-0148760. FlashMed™ is a product of Flashverse Labs Private Limited. Effective Date: 20 May 2026 | Version 3.0.',
  alternates: { canonical: 'https://flashmed.in/termsandconditions' },
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

export default function TermsAndConditions() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0d1117 0%,#0f1b2d 100%)', color: '#D1D5DB', fontFamily: "'Inter',system-ui,sans-serif", padding: '0 0 48px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', padding: '48px 0 36px' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#059669,#047857)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💊</div>
            <span style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#059669,#34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FlashMed</span>
          </a>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#059669', marginBottom: 4, marginTop: 0 }}>FLASHMED™ PLATFORM TERMS &amp; CONDITIONS</h1>
          <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: '18px', margin: 0 }}>
            CIN: U73100WB2026PTC276243 | UDYAM: WB-13-0148760<br />
            FlashMed™ is a product of Flashverse Labs Private Limited<br />
            Effective Date: 20 May 2026 | Version 3.0 | Last Updated: 01 July 2026
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.96)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px' }}>

          <Section title="1. PLATFORM NATURE — TECHNOLOGY INTERMEDIARY">
            <Bullet><Bold>FLASHMED™ IS A TECHNOLOGY INTERMEDIARY ONLY.</Bold> FlashMed™ is a product and registered trademark of <Bold>Flashverse Labs Private Limited</Bold> (CIN: U73100WB2026PTC276243), a company incorporated under the Companies Act, 2013. We operate as a digital marketplace and logistics coordination platform under <Bold>Section 79 of the Information Technology Act, 2000</Bold> and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. We are not a pharmacy, clinic, blood bank, or healthcare provider.</Bullet>
            <Bullet><Bold>WE DO NOT SELL MEDICINES.</Bold> All medicines and pharmaceutical products are sold, stocked, and dispensed exclusively by independent licensed Pharmacy Partners registered under the Drugs and Cosmetics Act, 1940, and the Pharmacy Act, 1948. FlashMed™ does not possess a drug license and does not engage in any activity requiring one.</Bullet>
            <Bullet><Bold>WE DO NOT PRACTICE MEDICINE.</Bold> FlashMed™ does not employ doctors, pharmacists, or medical professionals. Prescription verification is the sole responsibility of the Pharmacy Partner, in compliance with the Drugs and Cosmetics Rules, 1945.</Bullet>
            <Bullet><Bold>WE DO NOT SELL, STORE, OR TRANSFUSE BLOOD.</Bold> The Blood SOS feature connects requesters with registered, licensed blood banks. Blood banks are regulated under the Drugs and Cosmetics Act, 1940 (Schedule F, Part XII‑B) and the National Blood Transfusion Council guidelines. FlashMed™ does not handle any blood products.</Bullet>
            <Bullet>FlashMed™&apos;s sole role is to <Bold>connect</Bold> (i) customers with licensed pharmacies, diagnostics labs, and medical practitioners; (ii) coordinate delivery through independent Delivery Partners; and (iii) facilitate emergency blood request alerts.</Bullet>
          </Section>

          <Section title="2. DEFINITIONS">
            <Bullet>&quot;<Bold>Platform</Bold>&quot; – FlashMed mobile application and all associated services.</Bullet>
            <Bullet>&quot;<Bold>Customer</Bold>&quot; – a user who places orders or uses any service.</Bullet>
            <Bullet>&quot;<Bold>Pharmacy Partner</Bold>&quot; – a licensed retail pharmacy possessing valid drug licences under the Drugs and Cosmetics Act, 1940.</Bullet>
            <Bullet>&quot;<Bold>Delivery Partner</Bold>&quot; – an independent third‑party logistics provider responsible for transporting orders.</Bullet>
            <Bullet>&quot;<Bold>Lab Partner</Bold>&quot; – a registered diagnostic laboratory providing sample collection/testing.</Bullet>
            <Bullet>&quot;<Bold>Blood SOS</Bold>&quot; – the emergency service that alerts voluntary donors and connects requesters to licensed blood banks.</Bullet>
          </Section>

          <Section title="3. ELIGIBILITY AND REGISTRATION">
            <Bullet>You must be at least 18 years of age to use FlashMed.</Bullet>
            <Bullet>You must provide accurate, complete, and current information. Fake or duplicate accounts will be suspended.</Bullet>
          </Section>

          <Section title="4. MEDICINE ORDERS – PHARMACY PARTNER LIABILITY">
            <Bullet><Bold>FlashMed&apos;s workflow:</Bold> Customer uploads prescription → all licensed pharmacies within 5 km are notified → the Pharmacy Partner verifies the prescription&apos;s authenticity, checks medicine availability, and provides a price quote including delivery charges and fees → the quote is displayed to the Customer → upon payment, the Pharmacy Partner prepares the order (using cold‑chain insulated packaging with ice pads if required) → the Delivery Partner picks up and delivers the package.</Bullet>
            <Bullet><Bold>Prescription verification</Bold> is the exclusive responsibility of the Pharmacy Partner. FlashMed does not validate, authenticate, or approve any prescription. The Pharmacy Partner must comply with the Drugs and Cosmetics Act, 1940, and the Drugs and Cosmetics Rules, 1945.</Bullet>
            <Bullet><Bold>Schedule H, H1, and prescription‑only medicines</Bold> require a valid prescription from a registered medical practitioner. Orders for such medicines without a valid prescription will be rejected.</Bullet>
            <Bullet>FlashMed is <Bold>not liable</Bold> for: (a) the quality, efficacy, or genuineness of any medicine; (b) any adverse drug reaction; (c) the professional conduct of any Pharmacy Partner.</Bullet>
          </Section>

          <Section title="5. BLOOD SOS – COMMUNITY EMERGENCY SERVICE">
            <Bullet>Blood SOS is a <Bold>facilitation service only</Bold>. FlashMed does not procure, test, store, or transfuse blood. We only connect requesters to registered blood banks and voluntary donors.</Bullet>
            <Bullet>All blood‑related activities are performed by licensed blood banks holding a valid licence under the Drugs and Cosmetics Act (Schedule F, Part XII‑B). Blood banks independently verify the prescription/medical necessity before releasing blood.</Bullet>
            <Bullet>FlashMed <Bold>does not guarantee</Bold> donor response, blood type match, or availability. Users must independently verify donor identity and medical fitness. Blood transfusion must be performed only by licensed medical professionals.</Bullet>
          </Section>

          <Section title="6. DELIVERY SERVICES – INDEPENDENT CONTRACTORS">
            <Bullet>Delivery Partners are independent contractors, not employees of FlashMed. They are responsible for maintaining valid licences, handling medicines with care (including maintaining cold chain where applicable), and complying with all traffic and safety laws.</Bullet>
            <Bullet>FlashMed is not liable for any loss, damage, theft, or delay caused by the Delivery Partner during transit.</Bullet>
          </Section>

          <Section title="7. LAB TESTS – DIAGNOSTIC SERVICES">
            <Bullet>All diagnostic tests are performed by independent registered Lab Partners. FlashMed only facilitates booking and result delivery.</Bullet>
            <Bullet>FlashMed does not interpret test results or provide medical diagnoses.</Bullet>
          </Section>

          <Section title="8. FEES AND CHARGES">
            <Bullet><Bold>Important Notice — Dynamic Pricing:</Bold> All charges on the FlashMed platform are dynamic in nature. Fees vary based on factors including but not limited to location, distance, time of day, season, weather conditions, order type, applicable taxes, and periodic revisions by FlashMed. No fixed prices are guaranteed. The exact charges applicable to a specific order are always those displayed to the user at the time of order placement or service initiation, and those are the binding amounts.</Bullet>
            <Bullet><Bold>Delivery charges</Bold> are computed based on distance between the Pharmacy Partner and the delivery address. Additional surcharges may apply for conditions such as night‑time deliveries, adverse weather, cold‑chain requirements, and other operational factors. All applicable delivery charges are displayed transparently at checkout before payment.</Bullet>
            <Bullet><Bold>Platform Convenience Fee:</Bold> A platform service fee per order may be charged. This fee is subject to change from time to time depending on location and service type. The applicable amount is always shown at checkout.</Bullet>
            <Bullet><Bold>Blood SOS technology facilitation fee:</Bold> A technology facilitation fee applies for initiating a Blood SOS request. The amount is displayed at the time of request, is subject to change, and varies by location and prevailing conditions. This is a technology coordination charge only. FlashMed does not sell, supply, store, or transfuse blood.</Bullet>
            <Bullet><Bold>FlashMed Premium (Subscription):</Bold> Subscription plans and their pricing are subject to change at FlashMed&apos;s discretion. Current pricing, plan details, and benefits are displayed within the app at the time of subscription. Existing subscribers will receive advance notice of any material pricing changes. Benefits may include delivery charge waivers, in‑app wallet cashback, and other promotional benefits as communicated within the app.</Bullet>
            <Bullet><Bold>Refer &amp; Earn:</Bold> Referral bonus amounts and eligibility criteria are subject to change at FlashMed&apos;s discretion. Current terms are available within the app&apos;s Referral section. Wallet credits earned through referrals are non‑refundable and usable only for future FlashMed orders.</Bullet>
            <Bullet>All charges attract applicable GST and statutory taxes at prevailing rates. FlashMed reserves the right to modify, introduce, or discontinue any fee or charge with prior notice where required by law.</Bullet>
          </Section>

          <Section title="9. USER CONDUCT AND PROHIBITED ACTIVITIES">
            <Bullet>You agree NOT to: upload fake/forged prescriptions; order controlled substances; misuse Blood SOS for non‑emergencies; harass any partner; create multiple accounts; reverse‑engineer the Platform.</Bullet>
            <Bullet>Violations may lead to permanent account ban and legal action under the Indian Penal Code, 1860.</Bullet>
          </Section>

          <Section title="10. INTELLECTUAL PROPERTY">
            <Bullet>FlashMed™ is a registered trademark and product of Flashverse Labs Private Limited (CIN: U73100WB2026PTC276243). All Platform content, software, and branding are the exclusive property of Flashverse Labs Private Limited. Unauthorised use is prohibited.</Bullet>
          </Section>

          <Section title="11. DISCLAIMERS AND LIMITATION OF LIABILITY">
            <Bullet>THE PLATFORM IS PROVIDED &quot;AS IS&quot;. FLASHMED DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING FITNESS FOR A PARTICULAR PURPOSE.</Bullet>
            <Bullet>FLASHMED&apos;S TOTAL LIABILITY TO ANY USER SHALL NOT EXCEED THE AMOUNT PAID BY THAT USER FOR THE SPECIFIC ORDER IN QUESTION.</Bullet>
            <Bullet>FLASHMED SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, OR FOR LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM THE USE OF THE PLATFORM OR THIRD‑PARTY SERVICES.</Bullet>
          </Section>

          <Section title="12. GOVERNING LAW AND DISPUTE RESOLUTION">
            <Bullet>These Terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts in Murshidabad, West Bengal.</Bullet>
            <Bullet>Before initiating legal proceedings, users must first contact the Grievance Officer for resolution.</Bullet>
          </Section>

          <Section title="13. GRIEVANCE OFFICER">
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
