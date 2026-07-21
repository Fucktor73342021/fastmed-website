import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment & Refund Policy — FlashMed',
  description: 'FlashMed™ Payment & Refund Policy — CIN: U73100WB2026PTC276243 | UDYAM: WB-13-0148760 | Effective Date: 20 May 2026 | Version 3.0. Payment Processing Partner: Cashfree Payments (RBI‑authorised payment aggregator, PCI‑DSS Compliant).',
  alternates: { canonical: 'https://flashmed.in/paymentandrefundpolicy' },
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

export default function PaymentAndRefundPolicy() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0d1117 0%,#0f1b2d 100%)', color: '#D1D5DB', fontFamily: "'Inter',system-ui,sans-serif", padding: '0 0 48px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', padding: '48px 0 36px' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#059669,#047857)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💊</div>
            <span style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#059669,#34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FlashMed</span>
          </a>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#059669', marginBottom: 4, marginTop: 0 }}>FLASHMED™ PAYMENT &amp; REFUND POLICY</h1>
          <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: '18px', margin: 0 }}>
            CIN: U73100WB2026PTC276243 | UDYAM: WB-13-0148760 | Effective Date: 20 May 2026 | Version 3.0<br />
            FlashMed™ is a product of Flashverse Labs Private Limited<br />
            Payment Processing Partner: Cashfree Payments (RBI‑authorised payment aggregator, PCI‑DSS Compliant)
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.96)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px' }}>

          <Section title="1. PLATFORM ROLE — PAYMENT INTERMEDIARY">
            <Bullet><Bold>FlashMed™ does not process payments directly.</Bold> All payments are processed exclusively through our third‑party payment gateway partner, <Bold>Cashfree Payments</Bold>, which is a payment aggregator authorised by the Reserve Bank of India (RBI) under the Payment and Settlement Systems Act, 2007, and is certified PCI‑DSS Level 1 compliant.</Bullet>
            <Bullet><Bold>FlashMed™ never stores</Bold> your credit card numbers, debit card numbers, CVV codes, card expiry dates, net banking passwords, UPI PINs, or any other sensitive payment credentials. All cardholder data is tokenised and handled by Cashfree&apos;s secure infrastructure in accordance with RBI&apos;s guidelines on card tokenisation and data localisation.</Bullet>
            <Bullet><Bold>FlashMed™ (a product of Flashverse Labs Private Limited) is not a bank, wallet issuer, payment system provider, or financial institution.</Bold> We merely facilitate the payment flow between you (the Customer) and the Pharmacy Partner / Lab Partner via Cashfree. FlashMed™ does not hold client funds at any stage.</Bullet>
          </Section>

          <Section title="2. ACCEPTED PAYMENT METHODS">
            <Bullet>UPI (all UPI apps including Google Pay, PhonePe, Paytm, BHIM)</Bullet>
            <Bullet>Credit Cards – Visa, Mastercard, RuPay</Bullet>
            <Bullet>Debit Cards – all major banks</Bullet>
            <Bullet>Net Banking – all major Indian banks</Bullet>
            <Bullet>Cashfree Wallet and other wallets permitted by RBI</Bullet>
            <Bullet>Cash on Delivery (COD) – available only where supported by the Pharmacy Partner</Bullet>
          </Section>

          <Section title="3. PRICING AND BILLING">
            <Bullet><Bold>Dynamic Pricing Notice:</Bold> All charges on the FlashMed platform are dynamic and vary based on location, distance, time of day, season, weather conditions, order type, applicable taxes, and periodic updates managed by FlashMed administration. No fixed price is guaranteed. The exact charges applicable to a specific transaction are always those displayed to you at the time of checkout or service initiation — those are the binding amounts.</Bullet>
            <Bullet><Bold>Medicine prices</Bold> are set independently by each Pharmacy Partner and may vary between partners based on their own pricing policies, supplier costs, and current discounts. FlashMed does not control, set, or guarantee medicine pricing, in compliance with the Consumer Protection (E‑Commerce) Rules, 2020.</Bullet>
            <Bullet><Bold>Delivery charges</Bold> are computed based on the distance between the Pharmacy Partner and the delivery address. Surcharges may apply for night‑time deliveries, adverse weather, cold‑chain handling, and other operational factors. All applicable delivery charges are shown transparently at checkout before payment.</Bullet>
            <Bullet><Bold>Platform Convenience Fee:</Bold> A platform service fee per order may be charged to cover technology and coordination costs. This fee is subject to change from time to time and varies by location and order type. The applicable amount is always displayed on the checkout screen before payment.</Bullet>
            <Bullet><Bold>FlashMed Premium (Subscription):</Bold> Subscription plan pricing, plan types, and associated benefits are subject to change at FlashMed&apos;s discretion. Current pricing and plan details are displayed within the app at the time of subscription. Benefits may include delivery charge waivers, in‑app wallet cashback, and other promotional benefits as communicated within the app. Existing subscribers will receive advance notice of any material pricing changes.</Bullet>
            <Bullet><Bold>Refer &amp; Earn:</Bold> Referral bonus amounts and eligibility criteria are subject to change at FlashMed&apos;s discretion. Current terms are available within the app&apos;s Referral section. Wallet credits earned through referrals are non‑refundable and usable only for future FlashMed orders.</Bullet>
            <Bullet><Bold>Blood SOS technology facilitation fee:</Bold> A technology coordination fee applies for initiating a Blood SOS request. The amount is displayed at the time of request, varies by location and prevailing conditions, and is managed by FlashMed administration. This is a facilitation charge only; no blood is sold or supplied by FlashMed.</Bullet>
            <Bullet><Bold>GST and other taxes:</Bold> Applied as per Central and State tax laws at prevailing rates. Tax invoices are generated directly by the Pharmacy Partner or Lab Partner.</Bullet>
          </Section>

          <Section title="4. PAYMENT SECURITY">
            <Bullet>All transactions are secured with TLS 1.3 encryption and processed through Cashfree&apos;s PCI‑DSS compliant environment. FlashMed is never in possession of your complete card or banking credentials, in line with RBI&apos;s digital payment security framework.</Bullet>
            <Bullet>In case of suspected fraudulent activity, Cashfree&apos;s risk engine may temporarily hold the transaction for verification. FlashMed will notify you promptly.</Bullet>
          </Section>

          <Section title="5. REFUND POLICY">
            <Bullet>
              <Bold>5.1 Order Cancellation (Before Dispatch):</Bold><br />
              • If you cancel an order before it is dispatched by the Pharmacy Partner, a full refund (including platform fee) is initiated within 24 hours.<br />
              • Refunds are credited to the original payment method. UPI and card refunds typically reflect in 2‑5 business days; net banking may take 7‑10 business days.
            </Bullet>
            <Bullet>
              <Bold>5.2 Wrong / Damaged / Expired Items:</Bold><br />
              • Must be reported with photographic proof within 24 hours of delivery.<br />
              • After verification by FlashMed support, the full amount will be refunded or a replacement will be arranged. FlashMed coordinates with the Pharmacy Partner; the Partner bears ultimate liability for product quality under the Drugs and Cosmetics Act, 1940.
            </Bullet>
            <Bullet>
              <Bold>5.3 Prescription Rejection:</Bold><br />
              • If a Pharmacy Partner rejects the order due to invalid / missing / fake prescription, a full refund is processed within 24 hours, including the platform fee.
            </Bullet>
            <Bullet>
              <Bold>5.4 Out of Stock:</Bold><br />
              • If the ordered medicine is out of stock after payment, a full refund is automatically initiated within 24 hours.
            </Bullet>
            <Bullet>
              <Bold>5.5 Lab Test Cancellation:</Bold><br />
              • Cancellation before sample collection qualifies for a full refund within 24 hours.<br />
              • Once sample collection has occurred, no refund is applicable.
            </Bullet>
            <Bullet>
              <Bold>5.6 Cash on Delivery (COD):</Bold><br />
              • No advance payment is taken for COD orders. If you refuse delivery, no refund arises as no payment was made.<br />
              • If you had previously paid online but later opted for COD, the online amount will be refunded within 5‑7 business days.
            </Bullet>
            <Bullet>
              <Bold>5.7 No‑Show / Failed Delivery:</Bold><br />
              • After 3 unsuccessful delivery attempts, the order may be returned to the Pharmacy Partner.<br />
              • A refund of the product amount (less delivery charges and platform fee) will be initiated within 48 hours.
            </Bullet>
          </Section>

          <Section title="6. REFUND PROCESSING TIMES">
            <Bullet>
              <Bold>Refund initiation:</Bold> Within 24 hours of approval<br />
              <Bold>UPI refunds:</Bold> 2‑5 business days<br />
              <Bold>Card refunds:</Bold> 5‑10 business days (depending on issuing bank)<br />
              <Bold>Net banking refunds:</Bold> 7‑10 business days<br />
              <Bold>Wallet refunds:</Bold> Instant to 24 hours
            </Bullet>
            <Bullet>If you do not receive the refund within the stated timeframe, contact support@flashmed.in with your order ID and transaction reference.</Bullet>
          </Section>

          <Section title="7. FLASHMED TOKENS AND REWARDS">
            <Bullet>FlashMed may issue platform tokens, credits, or reward points as part of promotional campaigns, subscription benefits, or referral programs.</Bullet>
            <Bullet>Tokens have no cash value and cannot be redeemed for cash. They are only usable for discounts on future orders.</Bullet>
            <Bullet>Tokens expire according to the specific campaign terms. Expired tokens are non‑refundable.</Bullet>
          </Section>

          <Section title="8. DISPUTES AND CHARGEBACKS">
            <Bullet>Before filing a chargeback with your bank, please contact FlashMed support to attempt resolution. Chargebacks raised fraudulently may lead to account suspension.</Bullet>
            <Bullet>FlashMed reserves the right to permanently ban users found guilty of abusive chargebacks or payment fraud, and to pursue legal remedies under applicable criminal law.</Bullet>
          </Section>

          <Section title="9. GRIEVANCE OFFICER — PAYMENTS">
            <Bullet><Bold>Name:</Bold> Nahid Hasan</Bullet>
            <Bullet><Bold>Designation:</Bold> Director, Chairman &amp; CEO, Flashverse Labs Private Limited</Bullet>
            <Bullet><Bold>Email:</Bold> support@flashmed.in</Bullet>
            <Bullet><Bold>Phone:</Bold> +91 9144150105</Bullet>
            <Bullet><Bold>Address:</Bold> 12 Md Asfaque Akhtar, New Dakbanglow Bus Stand, Dhuliyan, Murshidabad, West Bengal — 742202</Bullet>
            <Bullet><Bold>Response Time:</Bold> Payment‑related grievances will be acknowledged within 24 hours and resolved within 7 business days.</Bullet>
          </Section>

        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a href="/" style={{ color: '#059669', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
