import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function PaymentRefundPolicyScreen({ navigation }) {
  const { theme } = useTheme();
  const s = getStyles(theme);

  return (
    <View style={[s.root, { backgroundColor: theme.colors.bg }]}>
      <View style={[s.header, { backgroundColor: theme.colors.cardBg, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={{ fontSize: 22, color: theme.colors.primary }}>←</Text>
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>Payment & Refund Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[s.heading, { color: theme.colors.primary }]}>FLASHMED PAYMENT & REFUND POLICY</Text>
        <Text style={[s.subheading, { color: theme.colors.textMuted }]}>
          UDYAM-WB-13-0148760 | Effective Date: 27 April 2026 | Version 1.0{'\n'}
          Payment Processing Partner: Cashfree Payments (RBI‑authorised payment aggregator, PCI‑DSS Compliant)
        </Text>

        <Section theme={theme} title="1. PLATFORM ROLE — PAYMENT INTERMEDIARY">
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

        <Section theme={theme} title="2. ACCEPTED PAYMENT METHODS">
          <Bullet>UPI (all UPI apps including Google Pay, PhonePe, Paytm, BHIM)</Bullet>
          <Bullet>Credit Cards – Visa, Mastercard, RuPay</Bullet>
          <Bullet>Debit Cards – all major banks</Bullet>
          <Bullet>Net Banking – all major Indian banks</Bullet>
          <Bullet>Cashfree Wallet and other wallets permitted by RBI</Bullet>
          <Bullet>Cash on Delivery (COD) – available only where supported by the Pharmacy Partner</Bullet>
        </Section>

        <Section theme={theme} title="3. PRICING AND BILLING">
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
            <Bold>Delivery charges</Bold> are calculated as follows (in INR):
            • Up to 1 km: ₹25
            • Up to 2 km: ₹30
            • Up to 3 km: ₹35
            • Up to 4 km: ₹40
            • Up to 5 km: ₹45{'\n'}
            Additional surcharges:
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

        <Section theme={theme} title="4. PAYMENT SECURITY">
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

        <Section theme={theme} title="5. REFUND POLICY">
          <Bullet>
            <Bold>5.1 Order Cancellation (Before Dispatch):</Bold>{'\n'}
            • If you cancel an order before it is dispatched by the Pharmacy Partner,
              a full refund (including platform fee) is initiated within 24 hours.{'\n'}
            • Refunds are credited to the original payment method. UPI and card refunds
              typically reflect in 2‑5 business days; net banking may take 7‑10 business
              days.
          </Bullet>
          <Bullet>
            <Bold>5.2 Wrong / Damaged / Expired Items:</Bold>{'\n'}
            • Must be reported with photographic proof within 24 hours of delivery.{'\n'}
            • After verification by FlashMed support, the full amount will be refunded or
              a replacement will be arranged. FlashMed coordinates with the Pharmacy
              Partner; the Partner bears ultimate liability for product quality under
              the Drugs and Cosmetics Act, 1940.
          </Bullet>
          <Bullet>
            <Bold>5.3 Prescription Rejection:</Bold>{'\n'}
            • If a Pharmacy Partner rejects the order due to invalid / missing / fake
              prescription, a full refund is processed within 24 hours, including
              the platform fee.
          </Bullet>
          <Bullet>
            <Bold>5.4 Out of Stock:</Bold>{'\n'}
            • If the ordered medicine is out of stock after payment, a full refund
              is automatically initiated within 24 hours.
          </Bullet>
          <Bullet>
            <Bold>5.5 Lab Test Cancellation:</Bold>{'\n'}
            • Cancellation before sample collection qualifies for a full refund within
              24 hours.{'\n'}
            • Once sample collection has occurred, no refund is applicable.
          </Bullet>
          <Bullet>
            <Bold>5.6 Cash on Delivery (COD):</Bold>{'\n'}
            • No advance payment is taken for COD orders. If you refuse delivery, no
              refund arises as no payment was made.{'\n'}
            • If you had previously paid online but later opted for COD, the online amount
              will be refunded within 5‑7 business days.
          </Bullet>
          <Bullet>
            <Bold>5.7 No‑Show / Failed Delivery:</Bold>{'\n'}
            • After 3 unsuccessful delivery attempts, the order may be returned to the
              Pharmacy Partner.{'\n'}
            • A refund of the product amount (less delivery charges and platform fee)
              will be initiated within 48 hours.
          </Bullet>
        </Section>

        <Section theme={theme} title="6. REFUND PROCESSING TIMES">
          <Bullet>
            <Bold>Refund initiation:</Bold> Within 24 hours of approval{'\n'}
            <Bold>UPI refunds:</Bold> 2‑5 business days{'\n'}
            <Bold>Card refunds:</Bold> 5‑10 business days (depending on issuing bank){'\n'}
            <Bold>Net banking refunds:</Bold> 7‑10 business days{'\n'}
            <Bold>Wallet refunds:</Bold> Instant to 24 hours
          </Bullet>
          <Bullet>
            If you do not receive the refund within the stated timeframe, contact
            support@flashmed.in with your order ID and transaction reference.
          </Bullet>
        </Section>

        <Section theme={theme} title="7. FLASHMED TOKENS AND REWARDS">
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

        <Section theme={theme} title="8. DISPUTES AND CHARGEBACKS">
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

        <Section theme={theme} title="9. GRIEVANCE OFFICER — PAYMENTS">
          <Bullet><Bold>Name:</Bold> Nahid Hasan</Bullet>
          <Bullet><Bold>Email:</Bold> support@flashmed.in</Bullet>
          <Bullet><Bold>Phone:</Bold> +91 92425 45884</Bullet>
          <Bullet><Bold>Response Time:</Bold> Payment‑related grievances will be acknowledged within 24 hours and resolved within 7 business days.</Bullet>
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function Section({ theme, title, children }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 15, fontWeight: '800', color: theme.colors.text, marginBottom: 10, marginTop: 4 }}>{title}</Text>
      {children}
    </View>
  );
}

function Bullet({ children }) {
  return (
    <Text style={{ fontSize: 13, lineHeight: 20, color: '#444', marginBottom: 8, paddingLeft: 14 }}>
      • {children}
    </Text>
  );
}

function Bold({ children }) {
  return <Text style={{ fontWeight: '800', color: '#1a1a2e' }}>{children}</Text>;
}

const getStyles = (theme) => StyleSheet.create({
  root:        { flex: 1 },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 50 : 30, paddingBottom: 12, borderBottomWidth: 1 },
  backBtn:     { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', flex: 1, textAlign: 'center' },
  scroll:      { padding: 20, paddingTop: 16 },
  heading:     { fontSize: 20, fontWeight: '900', marginBottom: 4 },
  subheading:  { fontSize: 12, lineHeight: 18, marginBottom: 20 },
});