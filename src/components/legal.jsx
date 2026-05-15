import React from 'react';
import { Lucide } from './primitives.jsx';

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)", marginBottom: 12, marginTop: 8 }}>{title}</h3>
      {children}
    </div>
  );
}

function Bullet({ children }) {
  return (
    <div style={{ display: 'flex', marginBottom: 10, fontSize: 15, lineHeight: 1.6, color: "rgba(10,21,48,0.75)" }}>
      <span style={{ marginRight: 10 }}>•</span>
      <div>{children}</div>
    </div>
  );
}

function Bold({ children }) {
  return <strong style={{ fontWeight: 800, color: "var(--ink)" }}>{children}</strong>;
}

function PaymentRefundPolicy() {
  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, color: "var(--ink)" }}>FLASHMED PAYMENT & REFUND POLICY</h2>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(10,21,48,0.6)", marginBottom: 32 }}>
        UDYAM-WB-13-0148760 | Effective Date: 27 April 2026 | Version 1.0<br/>
        Payment Processing Partner: Cashfree Payments (RBI‑authorised payment aggregator, PCI‑DSS Compliant)
      </p>

      <Section title="1. PLATFORM ROLE — PAYMENT INTERMEDIARY">
        <Bullet>
          <Bold>FlashMed does not process payments directly.</Bold> All payments are
          processed exclusively through our third‑party payment gateway partner,
          <Bold> Cashfree Payments</Bold>, which is a payment aggregator authorised by the
          Reserve Bank of India (RBI) under the Payment and Settlement Systems Act, 2007,
          and is certified PCI‑DSS Level 1 compliant.
        </Bullet>
        <Bullet>
          <Bold>FlashMed never stores</Bold> your credit card numbers, debit card numbers,
          CVV codes, card expiry dates, net banking passwords, UPI PINs, or any other
          sensitive payment credentials. All cardholder data is tokenised and handled
          by Cashfree’s secure infrastructure in accordance with RBI’s guidelines on
          card tokenisation and data localisation.
        </Bullet>
        <Bullet>
          <Bold>FlashMed is not a bank, wallet issuer, payment system provider, or
          financial institution.</Bold> We merely facilitate the payment flow between
          you (the Customer) and the Pharmacy Partner / Lab Partner via Cashfree.
          FlashMed does not hold client funds at any stage.
        </Bullet>
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
        <Bullet>
          <Bold>All prices</Bold> displayed on the Platform are set independently by the
          respective Pharmacy Partners and Lab Partners. FlashMed does not control, set,
          or guarantee any pricing, in compliance with the Consumer Protection
          (E‑Commerce) Rules, 2020.
        </Bullet>
        <Bullet>
          <Bold>Medicine prices</Bold> may vary between Pharmacy Partners based on their
          own pricing policies, supplier costs, and current discounts.
        </Bullet>
        <Bullet>
          <Bold>Delivery charges</Bold> are calculated as follows (in INR):<br/>
          • Up to 1 km: ₹25<br/>
          • Up to 2 km: ₹30<br/>
          • Up to 3 km: ₹35<br/>
          • Up to 4 km: ₹40<br/>
          • Up to 5 km: ₹45<br/>
          Additional surcharges:<br/>
          • Priority Express Fee (Late Night/Weather when applicable): ₹30
        </Bullet>
        <Bullet>
          <Bold>Subscription (FlashMed Care):</Bold> Yearly subscription of ₹399 entitles
          subscribers to an additional 5% discount on eligible medicine orders (capped)
          and three free deliveries per month. The 5% saving is credited to the user’s
          in‑app wallet and can be used for future orders.
        </Bullet>
        <Bullet>
          <Bold>Refer & Earn:</Bold> ₹100 is credited to the referrer’s wallet upon the
          first successful order of the referred user. Wallet balance is non‑refundable
          and can only be applied toward future orders.
        </Bullet>
        <Bullet>
          <Bold>Blood SOS service fee:</Bold> A flat fee of ₹299 is applicable for using
          the emergency blood assistance service to connect a requestor with a registered
          blood bank. This is a technology facilitation fee only; no blood is sold.
        </Bullet>
        <Bullet>
          <Bold>GST and other taxes:</Bold> Applied as per Central and State tax laws.
          Tax invoices are generated directly by the Pharmacy Partner or Lab Partner.
        </Bullet>
      </Section>

      <Section title="4. PAYMENT SECURITY">
        <Bullet>
          All transactions are secured with TLS 1.3 encryption and processed through
          Cashfree’s PCI‑DSS compliant environment. FlashMed is never in possession of
          your complete card or banking credentials, in line with RBI’s digital payment
          security framework.
        </Bullet>
        <Bullet>
          In case of suspected fraudulent activity, Cashfree’s risk engine may
          temporarily hold the transaction for verification. FlashMed will notify you
          promptly.
        </Bullet>
      </Section>

      <Section title="5. REFUND POLICY">
        <Bullet>
          <Bold>5.1 Order Cancellation (Before Dispatch):</Bold><br/>
          • If you cancel an order before it is dispatched by the Pharmacy Partner,
            a full refund (including platform fee) is initiated within 24 hours.<br/>
          • Refunds are credited to the original payment method. UPI and card refunds
            typically reflect in 2‑5 business days; net banking may take 7‑10 business
            days.
        </Bullet>
        <Bullet>
          <Bold>5.2 Wrong / Damaged / Expired Items:</Bold><br/>
          • Must be reported with photographic proof within 24 hours of delivery.<br/>
          • After verification by FlashMed support, the full amount will be refunded or
            a replacement will be arranged. FlashMed coordinates with the Pharmacy
            Partner; the Partner bears ultimate liability for product quality under
            the Drugs and Cosmetics Act, 1940.
        </Bullet>
        <Bullet>
          <Bold>5.3 Prescription Rejection:</Bold><br/>
          • If a Pharmacy Partner rejects the order due to invalid / missing / fake
            prescription, a full refund is processed within 24 hours, including
            the platform fee.
        </Bullet>
        <Bullet>
          <Bold>5.4 Out of Stock:</Bold><br/>
          • If the ordered medicine is out of stock after payment, a full refund
            is automatically initiated within 24 hours.
        </Bullet>
        <Bullet>
          <Bold>5.5 Lab Test Cancellation:</Bold><br/>
          • Cancellation before sample collection qualifies for a full refund within
            24 hours.<br/>
          • Once sample collection has occurred, no refund is applicable.
        </Bullet>
        <Bullet>
          <Bold>5.6 Cash on Delivery (COD):</Bold><br/>
          • No advance payment is taken for COD orders. If you refuse delivery, no
            refund arises as no payment was made.<br/>
          • If you had previously paid online but later opted for COD, the online amount
            will be refunded within 5‑7 business days.
        </Bullet>
        <Bullet>
          <Bold>5.7 No‑Show / Failed Delivery:</Bold><br/>
          • After 3 unsuccessful delivery attempts, the order may be returned to the
            Pharmacy Partner.<br/>
          • A refund of the product amount (less delivery charges and platform fee)
            will be initiated within 48 hours.
        </Bullet>
      </Section>

      <Section title="6. REFUND PROCESSING TIMES">
        <Bullet>
          <Bold>Refund initiation:</Bold> Within 24 hours of approval<br/>
          <Bold>UPI refunds:</Bold> 2‑5 business days<br/>
          <Bold>Card refunds:</Bold> 5‑10 business days (depending on issuing bank)<br/>
          <Bold>Net banking refunds:</Bold> 7‑10 business days<br/>
          <Bold>Wallet refunds:</Bold> Instant to 24 hours
        </Bullet>
        <Bullet>
          If you do not receive the refund within the stated timeframe, contact
          support@flashmed.in with your order ID and transaction reference.
        </Bullet>
      </Section>

      <Section title="7. FLASHMED TOKENS AND REWARDS">
        <Bullet>
          FlashMed may issue platform tokens, credits, or reward points as part of
          promotional campaigns, subscription benefits, or referral programs.
        </Bullet>
        <Bullet>
          Tokens have no cash value and cannot be redeemed for cash. They are only
          usable for discounts on future orders.
        </Bullet>
        <Bullet>
          Tokens expire according to the specific campaign terms. Expired tokens are
          non‑refundable.
        </Bullet>
      </Section>

      <Section title="8. DISPUTES AND CHARGEBACKS">
        <Bullet>
          Before filing a chargeback with your bank, please contact FlashMed support
          to attempt resolution. Chargebacks raised fraudulently may lead to account
          suspension.
        </Bullet>
        <Bullet>
          FlashMed reserves the right to permanently ban users found guilty of
          abusive chargebacks or payment fraud, and to pursue legal remedies
          under applicable criminal law.
        </Bullet>
      </Section>

      <Section title="9. GRIEVANCE OFFICER — PAYMENTS">
        <Bullet><Bold>Name:</Bold> Nahid Hasan</Bullet>
        <Bullet><Bold>Email:</Bold> support@flashmed.in</Bullet>
        <Bullet><Bold>Phone:</Bold> +91 92425 45884</Bullet>
        <Bullet><Bold>Response Time:</Bold> Payment‑related grievances will be acknowledged within 24 hours and resolved within 7 business days.</Bullet>
      </Section>
    </>
  );
}

function PrivacyPolicy() {
  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, color: "var(--ink)" }}>FLASHMED PRIVACY POLICY</h2>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(10,21,48,0.6)", marginBottom: 32 }}>
        UDYAM-WB-13-0148760 | Effective Date: 27 April 2026 | Version 1.0<br/>
        Compliant with: Information Technology Act, 2000 | Digital Personal Data Protection Act, 2023
      </p>

      <Section title="1. WHO WE ARE">
        <Bullet>
          <Bold>FlashMed</Bold> is a sole proprietorship owned by <Bold>Nahid Hasan</Bold>,
          registered under UDYAM-WB-13-0148760. FlashMed operates exclusively as a
          <Bold> technology intermediary platform</Bold> under Section 79 of the
          Information Technology Act, 2000, and the Information Technology
          (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.
        </Bullet>
        <Bullet>
          <Bold>Operating Address:</Bold> 091 Ratanpur, Bidhanchandra Road, Samserganj,
          Murshidabad, West Bengal — 742202, India.
        </Bullet>
        <Bullet>
          <Bold>Contact for Privacy Matters:</Bold> support@flashmed.in
        </Bullet>
        <Bullet>
          FlashMed <Bold>does not sell, manufacture, stock, dispense, or deliver
          medicines</Bold>. We connect users with independent licensed pharmacies,
          diagnostic laboratories, and registered medical practitioners. We do not
          practice pharmacy or medicine.
        </Bullet>
      </Section>

      <Section title="2. WHAT DATA WE COLLECT">
        <Bullet><Bold>2.1 Identity Data:</Bold> Full name, date of birth, gender.</Bullet>
        <Bullet><Bold>2.2 Contact Data:</Bold> Mobile number, email address, delivery address, billing address.</Bullet>
        <Bullet><Bold>2.3 Health Data:</Bold> Prescription images (uploaded solely for the Pharmacy Partner’s verification), medicine order history, blood type (voluntary, for Blood SOS), known allergies (voluntary).</Bullet>
        <Bullet><Bold>2.4 Location Data:</Bold> Real‑time GPS with explicit consent, used only for delivery coordination and proximity‑based Blood SOS alerts. Approximate location may be used to find nearby Pharmacy/Lab Partners.</Bullet>
        <Bullet><Bold>2.5 Payment Data:</Bold> Transaction references, UPI IDs, payment tokens. <Bold>We NEVER store</Bold> full card numbers, CVV, expiry, or banking passwords. All payment processing is handled by Cashfree Payments, an RBI‑authorised PCI‑DSS compliant aggregator.</Bullet>
        <Bullet><Bold>2.6 Device Data:</Bold> Device ID, OS version, app version, push notification token, crash logs – for technical support and performance improvement only.</Bullet>
        <Bullet><Bold>2.7 We explicitly DO NOT collect:</Bold> Aadhaar number, PAN, biometric data, racial/ethnic origin, religious or political beliefs, sexual orientation, or any data unnecessary for the described services.</Bullet>
      </Section>

      <Section title="3. HOW WE USE YOUR DATA">
        <Bullet><Bold>3.1 Order Fulfillment:</Bold> To transmit your order and prescription to licensed Pharmacy Partners, coordinate delivery, and process payments.</Bullet>
        <Bullet><Bold>3.2 Blood SOS Alerts:</Bold> To send time‑bound alerts to voluntary donors within a 5‑km radius. Location data is used <Bold>only during the SOS event</Bold> and not retained beyond its duration.</Bullet>
        <Bullet><Bold>3.3 Customer Support:</Bold> To resolve grievances, process refunds, and investigate disputes.</Bullet>
        <Bullet><Bold>3.4 Safety & Compliance:</Bold> To prevent fraud, detect fake prescriptions, comply with legal obligations (including lawful government requests under the Code of Criminal Procedure, 1973), and enforce our Terms.</Bullet>
        <Bullet><Bold>3.5 Service Improvement:</Bold> Only anonymised, aggregated statistics for app performance. <Bold>No individual profiling or automated decision‑making</Bold> is performed for advertising.</Bullet>
        <Bullet><Bold>3.6 ABSOLUTE PROHIBITION ON SALE OF DATA:</Bold> We will <Bold>never</Bold> sell, rent, trade, or monetise your personal data to any third party for any commercial purpose.</Bullet>
      </Section>

      <Section title="4. DATA STORAGE AND LOCALISATION">
        <Bullet>
          <Bold>4.1 All personal data</Bold> is stored exclusively on servers
          located within India, in compliance with the DPDP Act, 2023, and RBI’s
          data localisation directives.
        </Bullet>
        <Bullet>
          <Bold>4.2 Primary storage:</Bold> Google Firebase (asia‑south1 / Mumbai
          region) and Cloudinary. Data is encrypted at rest using AES‑256 and in
          transit using TLS 1.3.
        </Bullet>
        <Bullet>
          <Bold>4.3 Data Retention Schedule:</Bold><br/>
          • Order data: 7 years (statutory requirement)<br/>
          • Account data: Until deletion request is processed<br/>
          • Location data: Deleted within 24 hours of order completion/SOS closure<br/>
          • Prescription images: Deleted 90 days after order completion, unless needed for dispute resolution<br/>
          • Crash logs: 90 days
        </Bullet>
        <Bullet>
          <Bold>4.4 Cross‑border transfer:</Bold> We do not transfer personal data
          outside India except where technically necessary (e.g., Firebase backend)
          and only with appropriate DPDP‑compliant safeguards.
        </Bullet>
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
        <Bullet><Bold>6.6 How to exercise:</Bold> Email support@flashmed.in with subject “DPDP Rights Request – [Your Phone Number]”. We will respond within 30 days.</Bullet>
      </Section>

      <Section title="7. CHILDREN’S PRIVACY">
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
        <Bullet><Bold>Designation:</Bold> Proprietor, FlashMed</Bullet>
        <Bullet><Bold>Email:</Bold> support@flashmed.in</Bullet>
        <Bullet><Bold>Phone:</Bold> +91 92425 45884</Bullet>
        <Bullet><Bold>Address:</Bold> 091 Ratanpur, Bidhanchandra Road, Samserganj, Murshidabad, West Bengal — 742202</Bullet>
        <Bullet><Bold>Response Time:</Bold> Acknowledgment within 24 hours; resolution aimed within 7 days.</Bullet>
      </Section>

      <Section title="11. CHANGES TO THIS POLICY">
        <Bullet>We may update this Privacy Policy from time to time. Material changes will be notified via app notification or email at least 7 days before they take effect.</Bullet>
      </Section>
    </>
  );
}

function TermsAndConditions() {
  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, color: "var(--ink)" }}>FLASHMED PLATFORM TERMS & CONDITIONS</h2>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(10,21,48,0.6)", marginBottom: 32 }}>
        UDYAM-WB-13-0148760<br/>
        Effective Date: 27 April 2026 | Version 1.0 | Last Updated: 27 April 2026
      </p>

      <Section title="1. PLATFORM NATURE — TECHNOLOGY INTERMEDIARY">
        <Bullet>
          <Bold>FLASHMED IS A TECHNOLOGY INTERMEDIARY ONLY.</Bold> We operate as a
          digital marketplace and logistics coordination platform under
          <Bold> Section 79 of the Information Technology Act, 2000</Bold> and the
          Information Technology (Intermediary Guidelines and Digital Media Ethics
          Code) Rules, 2021. We are not a pharmacy, clinic, blood bank, or
          healthcare provider.
        </Bullet>
        <Bullet>
          <Bold>WE DO NOT SELL MEDICINES.</Bold> All medicines and pharmaceutical
          products are sold, stocked, and dispensed exclusively by independent
          licensed Pharmacy Partners registered under the Drugs and Cosmetics Act,
          1940, and the Pharmacy Act, 1948. FlashMed does not possess a drug
          license and does not engage in any activity requiring one.
        </Bullet>
        <Bullet>
          <Bold>WE DO NOT PRACTICE MEDICINE.</Bold> FlashMed does not employ
          doctors, pharmacists, or medical professionals. Prescription verification
          is the sole responsibility of the Pharmacy Partner, in compliance with
          the Drugs and Cosmetics Rules, 1945.
        </Bullet>
        <Bullet>
          <Bold>WE DO NOT SELL, STORE, OR TRANSFUSE BLOOD.</Bold> The Blood SOS
          feature connects requesters with registered, licensed blood banks.
          Blood banks are regulated under the Drugs and Cosmetics Act, 1940
          (Schedule F, Part XII‑B) and the National Blood Transfusion Council
          guidelines. FlashMed does not handle any blood products.
        </Bullet>
        <Bullet>
          FlashMed’s sole role is to <Bold>connect</Bold> (i) customers with
          licensed pharmacies, diagnostics labs, and medical practitioners;
          (ii) coordinate delivery through independent Delivery Partners;
          and (iii) facilitate emergency blood request alerts.
        </Bullet>
      </Section>

      <Section title="2. DEFINITIONS">
        <Bullet>"<Bold>Platform</Bold>" – FlashMed mobile application and all associated services.</Bullet>
        <Bullet>"<Bold>Customer</Bold>" – a user who places orders or uses any service.</Bullet>
        <Bullet>"<Bold>Pharmacy Partner</Bold>" – a licensed retail pharmacy possessing valid drug licences under the Drugs and Cosmetics Act, 1940.</Bullet>
        <Bullet>"<Bold>Delivery Partner</Bold>" – an independent third‑party logistics provider responsible for transporting orders.</Bullet>
        <Bullet>"<Bold>Lab Partner</Bold>" – a registered diagnostic laboratory providing sample collection/testing.</Bullet>
        <Bullet>"<Bold>Blood SOS</Bold>" – the emergency service that alerts voluntary donors and connects requesters to licensed blood banks.</Bullet>
      </Section>

      <Section title="3. ELIGIBILITY AND REGISTRATION">
        <Bullet>You must be at least 18 years of age to use FlashMed.</Bullet>
        <Bullet>You must provide accurate, complete, and current information. Fake or duplicate accounts will be suspended.</Bullet>
      </Section>

      <Section title="4. MEDICINE ORDERS – PHARMACY PARTNER LIABILITY">
        <Bullet>
          <Bold>FlashMed’s workflow:</Bold> Customer uploads prescription → all
          licensed pharmacies within 5 km are notified → the Pharmacy Partner
          verifies the prescription’s authenticity, checks medicine availability,
          and provides a price quote including delivery charges and fees → the
          quote is displayed to the Customer → upon payment, the Pharmacy Partner
          prepares the order (using cold‑chain insulated packaging with ice pads
          if required) → the Delivery Partner picks up and delivers the package.
        </Bullet>
        <Bullet>
          <Bold>Prescription verification</Bold> is the exclusive responsibility
          of the Pharmacy Partner. FlashMed does not validate, authenticate, or
          approve any prescription. The Pharmacy Partner must comply with the
          Drugs and Cosmetics Act, 1940, and the Drugs and Cosmetics Rules, 1945.
        </Bullet>
        <Bullet>
          <Bold>Schedule H, H1, and prescription‑only medicines</Bold> require a
          valid prescription from a registered medical practitioner. Orders for
          such medicines without a valid prescription will be rejected.
        </Bullet>
        <Bullet>
          FlashMed is <Bold>not liable</Bold> for: (a) the quality, efficacy, or
          genuineness of any medicine; (b) any adverse drug reaction; (c) the
          professional conduct of any Pharmacy Partner.
        </Bullet>
      </Section>

      <Section title="5. BLOOD SOS – COMMUNITY EMERGENCY SERVICE">
        <Bullet>
          Blood SOS is a <Bold>facilitation service only</Bold>. FlashMed does
          not procure, test, store, or transfuse blood. We only connect requesters
          to registered blood banks and voluntary donors.
        </Bullet>
        <Bullet>
          All blood‑related activities are performed by licensed blood banks
          holding a valid licence under the Drugs and Cosmetics Act (Schedule F,
          Part XII‑B). Blood banks independently verify the prescription/medical
          necessity before releasing blood.
        </Bullet>
        <Bullet>
          FlashMed <Bold>does not guarantee</Bold> donor response, blood type
          match, or availability. Users must independently verify donor identity
          and medical fitness. Blood transfusion must be performed only by licensed
          medical professionals.
        </Bullet>
      </Section>

      <Section title="6. DELIVERY SERVICES – INDEPENDENT CONTRACTORS">
        <Bullet>
          Delivery Partners are independent contractors, not employees of FlashMed.
          They are responsible for maintaining valid licences, handling medicines
          with care (including maintaining cold chain where applicable), and
          complying with all traffic and safety laws.
        </Bullet>
        <Bullet>
          FlashMed is not liable for any loss, damage, theft, or delay caused
          by the Delivery Partner during transit.
        </Bullet>
      </Section>

      <Section title="7. LAB TESTS – DIAGNOSTIC SERVICES">
        <Bullet>All diagnostic tests are performed by independent registered Lab Partners. FlashMed only facilitates booking and result delivery.</Bullet>
        <Bullet>FlashMed does not interpret test results or provide medical diagnoses.</Bullet>
      </Section>

      <Section title="8. FEES AND CHARGES">
        <Bullet>
          <Bold>Delivery charges (by distance):</Bold><br/>
          • 0‑1 km: ₹25<br/>
          • 1‑2 km: ₹30<br/>
          • 2‑3 km: ₹35<br/>
          • 3‑4 km: ₹40<br/>
          • 4‑5 km: ₹45<br/>
          <Bold>Priority Express Fee (Late Night/Weather):</Bold> ₹30<br/>
        </Bullet>
        <Bullet><Bold>Platform fee:</Bold> ₹6 per order.</Bullet>
        <Bullet><Bold>Blood SOS service fee:</Bold> ₹299 per request (facilitation charge only).</Bullet>
        <Bullet><Bold>FlashMed Care (yearly subscription):</Bold> ₹399 – includes 5% extra discount on eligible medicines (capped) and 3 free deliveries per month. Savings credited to in‑app wallet.</Bullet>
        <Bullet><Bold>Refer & Earn:</Bold> ₹100 wallet credit for each successful referral.</Bullet>
      </Section>

      <Section title="9. USER CONDUCT AND PROHIBITED ACTIVITIES">
        <Bullet>You agree NOT to: upload fake/forged prescriptions; order controlled substances; misuse Blood SOS for non‑emergencies; harass any partner; create multiple accounts; reverse‑engineer the Platform.</Bullet>
        <Bullet>Violations may lead to permanent account ban and legal action under the Indian Penal Code, 1860.</Bullet>
      </Section>

      <Section title="10. INTELLECTUAL PROPERTY">
        <Bullet>All Platform content, software, and branding are the exclusive property of FlashMed (Nahid Hasan). Unauthorised use is prohibited.</Bullet>
      </Section>

      <Section title="11. DISCLAIMERS AND LIMITATION OF LIABILITY">
        <Bullet>
          THE PLATFORM IS PROVIDED “AS IS”. FLASHMED DISCLAIMS ALL WARRANTIES,
          EXPRESS OR IMPLIED, INCLUDING FITNESS FOR A PARTICULAR PURPOSE.
        </Bullet>
        <Bullet>
          FLASHMED’S TOTAL LIABILITY TO ANY USER SHALL NOT EXCEED THE AMOUNT PAID
          BY THAT USER FOR THE SPECIFIC ORDER IN QUESTION.
        </Bullet>
        <Bullet>
          FLASHMED SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR
          CONSEQUENTIAL DAMAGES, OR FOR LOSS OF PROFITS, DATA, OR GOODWILL,
          ARISING FROM THE USE OF THE PLATFORM OR THIRD‑PARTY SERVICES.
        </Bullet>
      </Section>

      <Section title="12. GOVERNING LAW AND DISPUTE RESOLUTION">
        <Bullet>These Terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts in Murshidabad, West Bengal.</Bullet>
        <Bullet>Before initiating legal proceedings, users must first contact the Grievance Officer for resolution.</Bullet>
      </Section>

      <Section title="13. GRIEVANCE OFFICER">
        <Bullet><Bold>Name:</Bold> Nahid Hasan</Bullet>
        <Bullet><Bold>UDYAM Registration:</Bold> UDYAM-WB-13-0148760</Bullet>
        <Bullet><Bold>Address:</Bold> 091 Ratanpur, Bidhanchandra Road, Samserganj, Murshidabad, West Bengal — 742202</Bullet>
        <Bullet><Bold>Email:</Bold> support@flashmed.in</Bullet>
        <Bullet><Bold>Phone:</Bold> +91 92425 45884</Bullet>
        <Bullet><Bold>Response Time:</Bold> Acknowledgment within 24 hours; resolution aimed within 48 hours.</Bullet>
      </Section>
    </>
  );
}

function ContactInfo() {
  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24, color: "var(--ink)" }}>CONTACT US</h2>
      
      <Section title="Get in Touch">
        <Bullet>
          <Bold>Number:</Bold> +919242545884
        </Bullet>
        <Bullet>
          <Bold>Email:</Bold> <a href="mailto:support@flashmed.in" style={{ color: "var(--sky)", textDecoration: "none" }}>support@flashmed.in</a>
        </Bullet>
        <Bullet>
          <Bold>Address:</Bold> 091, Ratanpur, Samserganj, West Bengal-742202
        </Bullet>
      </Section>
    </>
  );
}

function DrugsActCompliance() {
  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, color: "var(--ink)" }}>DRUGS & COSMETICS ACT COMPLIANCE</h2>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(10,21,48,0.6)", marginBottom: 32 }}>
        UDYAM-WB-13-0148760 | Statutory Declaration of Intermediary Status
      </p>

      <Section title="1. TECHNOLOGY INTERMEDIARY STATUS (IT ACT, 2000)">
        <Bullet>
          <Bold>Safe Harbour Protection:</Bold> FlashMed operates strictly as a technology intermediary under <Bold>Section 79 of the Information Technology Act, 2000</Bold>. We provide a digital platform to connect users with independent, licensed retail pharmacies (Pharmacy Partners).
        </Bullet>
        <Bullet>
          <Bold>No Pharmacy Operations:</Bold> FlashMed is not an e-pharmacy, online pharmacy, or medical retailer. We do not engage in the sale, purchase, stocking, exhibition, or distribution of any drugs or cosmetics.
        </Bullet>
      </Section>

      <Section title="2. COMPLIANCE WITH DRUGS & COSMETICS ACT, 1940">
        <Bullet>
          <Bold>No Drug License Required:</Bold> Since FlashMed does not take title to any medicine at any point, nor do we stock or dispense drugs, we are not required to hold a drug license under the <Bold>Drugs and Cosmetics Act, 1940</Bold> or the <Bold>Drugs and Cosmetics Rules, 1945</Bold>.
        </Bullet>
        <Bullet>
          <Bold>Licensed Pharmacy Partners:</Bold> Every order placed through the Platform is routed to and fulfilled by a retail pharmacy holding a valid, active license (Form 20, 21, etc.) issued by the State Drugs Control Administration. The legal contract of sale is exclusively between the Customer and the Pharmacy Partner.
        </Bullet>
        <Bullet>
          <Bold>Compliance Liability:</Bold> The Pharmacy Partner bears the absolute statutory responsibility for ensuring that the drugs dispensed are genuine, unexpired, and sold in accordance with the Act.
        </Bullet>
      </Section>

      <Section title="3. PRESCRIPTION DRUGS (SCHEDULE H, H1, X)">
        <Bullet>
          <Bold>Mandatory Prescription Upload:</Bold> For medicines classified under Schedule H, H1, or other restricted categories, FlashMed's platform requires the user to upload a valid prescription generated by a Registered Medical Practitioner (RMP).
        </Bullet>
        <Bullet>
          <Bold>Verification by Pharmacist:</Bold> Under <Bold>Rule 65 of the Drugs and Cosmetics Rules, 1945</Bold> and the <Bold>Pharmacy Practice Regulations, 2015</Bold>, the duty to verify the authenticity, dosage, and validity of the prescription lies solely with the Registered Pharmacist employed by the Pharmacy Partner.
        </Bullet>
        <Bullet>
          FlashMed does not validate or approve prescriptions. If the Pharmacy Partner's pharmacist determines a prescription is invalid, expired, or fraudulent, they retain the absolute right to reject the order.
        </Bullet>
      </Section>

      <Section title="4. BLOOD BANK FACILITATION (SCHEDULE F COMPLIANCE)">
        <Bullet>
          <Bold>No Handling of Blood Products:</Bold> The "Blood SOS" feature is an emergency notification tool. FlashMed does not collect, test, process, store, or distribute human blood or blood components.
        </Bullet>
        <Bullet>
          <Bold>Licensed Facilities Only:</Bold> FlashMed connects requesters exclusively with voluntary donors or blood banks licensed under <Bold>Schedule F, Part XII-B of the Drugs and Cosmetics Rules</Bold>. All blood compatibility testing and transfusions are conducted strictly by licensed medical professionals at authorized clinical establishments.
        </Bullet>
      </Section>

      <Section title="5. LOGISTICS AND COLD CHAIN (RULE 65)">
        <Bullet>
          <Bold>Independent Delivery Partners:</Bold> Delivery personnel act as independent agents of the Customer to transport the sealed package from the Pharmacy Partner to the delivery address.
        </Bullet>
        <Bullet>
          <Bold>Cold Chain Maintenance:</Bold> For thermolabile drugs (e.g., insulin, vaccines requiring 2–8°C), FlashMed mandates that the Pharmacy Partner package the items in validated insulated boxes with coolants before handover, ensuring the biological efficacy of the drug is maintained during the short transit window.
        </Bullet>
      </Section>

      <Section title="6. LIMITATION OF LIABILITY">
        <Bullet>
          As an intermediary exercising due diligence under the <Bold>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</Bold>, FlashMed is exempt from liability regarding the quality, safety, efficacy, or side effects of any pharmaceutical product dispensed by a Pharmacy Partner.
        </Bullet>
      </Section>
    </>
  );
}

function LegalModal({ page, onClose }) {
  // Prevent scrolling when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(10,21,48,0.6)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: 24,
        width: '100%',
        maxWidth: 800,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
      }}>
        <div style={{ 
          padding: '24px 32px', 
          borderBottom: '1px solid rgba(10,21,48,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "var(--ink)" }}>
            {page === 'privacy' && 'Privacy Policy'}
            {page === 'terms' && 'Terms & Conditions'}
            {page === 'payment' && 'Payment & Refund Policy'}
            {page === 'contact' && 'Contact Us'}
            {page === 'compliance' && 'Drugs Act Compliance'}
          </div>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', 
              padding: 8, margin: -8, color: "rgba(10,21,48,0.5)"
            }}
          >
            <Lucide name="x" size={24} />
          </button>
        </div>
        
        <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
          {page === 'privacy' && <PrivacyPolicy />}
          {page === 'terms' && <TermsAndConditions />}
          {page === 'payment' && <PaymentRefundPolicy />}
          {page === 'contact' && <ContactInfo />}
          {page === 'compliance' && <DrugsActCompliance />}
        </div>
      </div>
    </div>
  );
}

export { LegalModal };
