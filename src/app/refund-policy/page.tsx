import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Payment Policy — FlashMed',
  description: 'FlashMed Refund and Payment Policy — full refund process, timelines, and payment security details.',
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

export default function RefundPolicy() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0d1117 0%,#0f1b2d 100%)', color: '#D1D5DB', fontFamily: "'Inter',system-ui,sans-serif", padding: '0 0 48px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', padding: '48px 0 36px' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#059669,#047857)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💊</div>
            <span style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#059669,#34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FlashMed</span>
          </a>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#F9FAFB', marginBottom: 8, marginTop: 0 }}>Refund &amp; Payment Policy</h1>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
            Effective Date: 1 June 2025 &nbsp;|&nbsp; Flashverse Labs Private Limited (CIN: U73100WB2026PTC276243)
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px' }}>

          <Section title="1. PAYMENT METHODS">
            <Bullet>FlashMed accepts: UPI (GPay, PhonePe, Paytm, BHIM), Debit/Credit Cards (Visa, Mastercard, RuPay), Net Banking, and Cash on Delivery (COD) where available.</Bullet>
            <Bullet>All online transactions are processed through <Bold>Cashfree Payments</Bold>, an RBI-authorised payment aggregator. We comply fully with RBI's Payment Aggregator Guidelines (2020) and PCI‑DSS security standards.</Bullet>
          </Section>

          <Section title="2. PAYMENT SECURITY">
            <Bullet>All transactions are secured with TLS 1.3 encryption and processed through Cashfree's PCI‑DSS compliant environment. FlashMed is never in possession of your complete card or banking credentials.</Bullet>
          </Section>

          <Section title="3. PRICING">
            <Bullet><Bold>Dynamic Pricing Notice:</Bold> All charges on the FlashMed platform are dynamic in nature. Fees vary based on location, distance, time of day, season, weather, order type, applicable taxes, and periodic revisions. The exact charges applicable to a specific order are those displayed at checkout.</Bullet>
            <Bullet><Bold>Delivery charges</Bold> are computed based on distance between the Pharmacy Partner and the delivery address. Additional surcharges may apply for night‑time deliveries, adverse weather, and cold‑chain requirements.</Bullet>
            <Bullet><Bold>Platform Convenience Fee:</Bold> A platform service fee per order may be charged. The applicable amount is always displayed on the checkout screen before payment.</Bullet>
            <Bullet><Bold>FlashMed Premium (Subscription):</Bold> Subscription plan pricing and benefits are subject to change at FlashMed's discretion. Benefits may include delivery charge waivers, in‑app wallet cashback, and other promotional benefits.</Bullet>
            <Bullet><Bold>Refer &amp; Earn:</Bold> Referral bonus amounts are subject to change. Wallet credits earned through referrals are non‑refundable and usable only for future FlashMed orders.</Bullet>
            <Bullet><Bold>Blood SOS technology facilitation fee:</Bold> A technology coordination fee applies for initiating a Blood SOS request. No blood is sold or supplied by FlashMed.</Bullet>
            <Bullet><Bold>GST and other taxes:</Bold> Applied as per Central and State tax laws at prevailing rates. Tax invoices are generated directly by the Pharmacy Partner or Lab Partner.</Bullet>
          </Section>

          <Section title="4. REFUND POLICY">
            <Bullet><Bold>4.1 Order Cancellation (Before Dispatch):</Bold><br/>• If you cancel an order before it is dispatched by the Pharmacy Partner, a full refund (including platform fee) is initiated within 24 hours.<br/>• Refunds are credited to the original payment method. UPI and card refunds typically reflect in 2‑5 business days; net banking may take 7‑10 business days.</Bullet>
            <Bullet><Bold>4.2 Wrong / Damaged / Expired Items:</Bold><br/>• Must be reported with photographic proof within 24 hours of delivery.<br/>• After verification by FlashMed support, the full amount will be refunded or a replacement will be arranged.</Bullet>
            <Bullet><Bold>4.3 Prescription Rejection:</Bold><br/>• If a Pharmacy Partner rejects the order due to invalid / missing / fake prescription, a full refund is processed within 24 hours, including the platform fee.</Bullet>
            <Bullet><Bold>4.4 Out of Stock:</Bold><br/>• If the ordered medicine is out of stock after payment, a full refund is automatically initiated within 24 hours.</Bullet>
            <Bullet><Bold>4.5 Lab Test Cancellation:</Bold><br/>• Cancellation before sample collection qualifies for a full refund within 24 hours.<br/>• Once sample collection has occurred, no refund is applicable.</Bullet>
            <Bullet><Bold>4.6 Cash on Delivery (COD):</Bold><br/>• No advance payment is taken for COD orders. If you refuse delivery, no refund arises as no payment was made.</Bullet>
            <Bullet><Bold>4.7 No‑Show / Failed Delivery:</Bold><br/>• After 3 unsuccessful delivery attempts, the order may be returned to the Pharmacy Partner.<br/>• A refund of the product amount (less delivery charges and platform fee) will be initiated within 48 hours.</Bullet>
          </Section>

          <Section title="5. REFUND PROCESSING TIMES">
            <Bullet>
              <Bold>Refund initiation:</Bold> Within 24 hours of approval<br/>
              <Bold>UPI refunds:</Bold> 2‑5 business days<br/>
              <Bold>Card refunds:</Bold> 5‑10 business days (depending on issuing bank)<br/>
              <Bold>Net banking refunds:</Bold> 7‑10 business days<br/>
              <Bold>Wallet refunds:</Bold> Instant to 24 hours
            </Bullet>
            <Bullet>If you do not receive the refund within the stated timeframe, contact support@flashmed.in with your order ID and transaction reference.</Bullet>
          </Section>

          <Section title="6. DISPUTES AND CHARGEBACKS">
            <Bullet>Before filing a chargeback with your bank, please contact FlashMed support to attempt resolution. Chargebacks raised fraudulently may lead to account suspension.</Bullet>
          </Section>

          <Section title="7. GRIEVANCE OFFICER — PAYMENTS">
            <Bullet><Bold>Name:</Bold> Nahid Hasan</Bullet>
            <Bullet><Bold>Designation:</Bold> Director, Chairman &amp; CEO, Flashverse Labs Private Limited</Bullet>
            <Bullet><Bold>Email:</Bold> support@flashmed.in</Bullet>
            <Bullet><Bold>Phone:</Bold> +91 9144150105</Bullet>
            <Bullet><Bold>Address:</Bold> 12 Md Asfaque Akhtar, New Dakbanglow Bus Stand, Dhuliyan, Murshidabad, West Bengal — 742202</Bullet>
            <Bullet><Bold>Response Time:</Bold> Acknowledgment within 24 hours; resolution within 7 business days.</Bullet>
          </Section>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a href="/" style={{ color: '#059669', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
