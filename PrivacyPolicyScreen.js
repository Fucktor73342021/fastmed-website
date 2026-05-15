import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function PrivacyPolicyScreen({ navigation }) {
  const { theme } = useTheme();
  const s = getStyles(theme);

  return (
    <View style={[s.root, { backgroundColor: theme.colors.bg }]}>
      <View style={[s.header, { backgroundColor: theme.colors.cardBg, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={{ fontSize: 22, color: theme.colors.primary }}>←</Text>
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[s.heading, { color: theme.colors.primary }]}>FLASHMED PRIVACY POLICY</Text>
        <Text style={[s.subheading, { color: theme.colors.textMuted }]}>
          UDYAM-WB-13-0148760 | Effective Date: 27 April 2026 | Version 1.0{'\n'}
          Compliant with: Information Technology Act, 2000 | Digital Personal Data Protection Act, 2023
        </Text>

        <Section theme={theme} title="1. WHO WE ARE">
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

        <Section theme={theme} title="2. WHAT DATA WE COLLECT">
          <Bullet><Bold>2.1 Identity Data:</Bold> Full name, date of birth, gender.</Bullet>
          <Bullet><Bold>2.2 Contact Data:</Bold> Mobile number, email address, delivery address, billing address.</Bullet>
          <Bullet><Bold>2.3 Health Data:</Bold> Prescription images (uploaded solely for the Pharmacy Partner’s verification), medicine order history, blood type (voluntary, for Blood SOS), known allergies (voluntary).</Bullet>
          <Bullet><Bold>2.4 Location Data:</Bold> Real‑time GPS with explicit consent, used only for delivery coordination and proximity‑based Blood SOS alerts. Approximate location may be used to find nearby Pharmacy/Lab Partners.</Bullet>
          <Bullet><Bold>2.5 Payment Data:</Bold> Transaction references, UPI IDs, payment tokens. <Bold>We NEVER store</Bold> full card numbers, CVV, expiry, or banking passwords. All payment processing is handled by Cashfree Payments, an RBI‑authorised PCI‑DSS compliant aggregator.</Bullet>
          <Bullet><Bold>2.6 Device Data:</Bold> Device ID, OS version, app version, push notification token, crash logs – for technical support and performance improvement only.</Bullet>
          <Bullet><Bold>2.7 We explicitly DO NOT collect:</Bold> Aadhaar number, PAN, biometric data, racial/ethnic origin, religious or political beliefs, sexual orientation, or any data unnecessary for the described services.</Bullet>
        </Section>

        <Section theme={theme} title="3. HOW WE USE YOUR DATA">
          <Bullet><Bold>3.1 Order Fulfillment:</Bold> To transmit your order and prescription to licensed Pharmacy Partners, coordinate delivery, and process payments.</Bullet>
          <Bullet><Bold>3.2 Blood SOS Alerts:</Bold> To send time‑bound alerts to voluntary donors within a 5‑km radius. Location data is used <Bold>only during the SOS event</Bold> and not retained beyond its duration.</Bullet>
          <Bullet><Bold>3.3 Customer Support:</Bold> To resolve grievances, process refunds, and investigate disputes.</Bullet>
          <Bullet><Bold>3.4 Safety & Compliance:</Bold> To prevent fraud, detect fake prescriptions, comply with legal obligations (including lawful government requests under the Code of Criminal Procedure, 1973), and enforce our Terms.</Bullet>
          <Bullet><Bold>3.5 Service Improvement:</Bold> Only anonymised, aggregated statistics for app performance. <Bold>No individual profiling or automated decision‑making</Bold> is performed for advertising.</Bullet>
          <Bullet><Bold>3.6 ABSOLUTE PROHIBITION ON SALE OF DATA:</Bold> We will <Bold>never</Bold> sell, rent, trade, or monetise your personal data to any third party for any commercial purpose.</Bullet>
        </Section>

        <Section theme={theme} title="4. DATA STORAGE AND LOCALISATION">
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
            <Bold>4.3 Data Retention Schedule:</Bold>{'\n'}
            • Order data: 7 years (statutory requirement){'\n'}
            • Account data: Until deletion request is processed{'\n'}
            • Location data: Deleted within 24 hours of order completion/SOS closure{'\n'}
            • Prescription images: Deleted 90 days after order completion, unless needed for dispute resolution{'\n'}
            • Crash logs: 90 days
          </Bullet>
          <Bullet>
            <Bold>4.4 Cross‑border transfer:</Bold> We do not transfer personal data
            outside India except where technically necessary (e.g., Firebase backend)
            and only with appropriate DPDP‑compliant safeguards.
          </Bullet>
        </Section>

        <Section theme={theme} title="5. DATA SHARING — LIMITED AND PURPOSEFUL">
          <Bullet><Bold>5.1 Pharmacy Partners:</Bold> Name, delivery address, prescription image, contact number – solely for order fulfilment. They are contractually bound to use this data only for that purpose.</Bullet>
          <Bullet><Bold>5.2 Delivery Partners:</Bold> Name, address, contact number – only for the specific delivery. They are prohibited from retaining or reusing this data.</Bullet>
          <Bullet><Bold>5.3 Lab Partners:</Bold> Name, contact, address (for home collection), test requirements – for the booked service only.</Bullet>
          <Bullet><Bold>5.4 Payment Processors (Cashfree):</Bold> Only payment amount and transaction metadata; <Bold>never</Bold> prescription or health data.</Bullet>
          <Bullet><Bold>5.5 Government Authorities:</Bold> Disclosure only when required by a legally valid order under Indian law.</Bullet>
          <Bullet><Bold>5.6 No commercial disclosure:</Bold> Prescriptions, health history, blood type, or medical information will never be shared with third‑party marketers.</Bullet>
        </Section>

        <Section theme={theme} title="6. YOUR RIGHTS UNDER DPDP ACT 2023">
          <Bullet>As a data principal, you have the right to:</Bullet>
          <Bullet><Bold>6.1 Access</Bold> – Obtain a copy of your personal data.</Bullet>
          <Bullet><Bold>6.2 Correction</Bold> – Correct inaccurate or misleading data.</Bullet>
          <Bullet><Bold>6.3 Erasure</Bold> – Request deletion (subject to legal retention).</Bullet>
          <Bullet><Bold>6.4 Grievance Redressal</Bold> – File a complaint with our Grievance Officer.</Bullet>
          <Bullet><Bold>6.5 Nomination</Bold> – Nominate an individual to exercise rights on your behalf.</Bullet>
          <Bullet><Bold>6.6 How to exercise:</Bold> Email support@flashmed.in with subject “DPDP Rights Request – [Your Phone Number]”. We will respond within 30 days.</Bullet>
        </Section>

        <Section theme={theme} title="7. CHILDREN’S PRIVACY">
          <Bullet>FlashMed services are <Bold>not directed at persons under 18</Bold>. If we inadvertently collect data from a minor, we will delete it within 72 hours of discovery.</Bullet>
        </Section>

        <Section theme={theme} title="8. COOKIES AND TRACKING">
          <Bullet>Our app does not use traditional cookies. We use Firebase Analytics for anonymised usage statistics; you can disable analytics in your device settings.</Bullet>
        </Section>

        <Section theme={theme} title="9. DATA BREACH NOTIFICATION">
          <Bullet>In case of a personal data breach, we will notify the Data Protection Board of India and all affected users within 72 hours, as required by Rule 9 of the DPDP Rules.</Bullet>
        </Section>

        <Section theme={theme} title="10. GRIEVANCE OFFICER — PRIVACY">
          <Bullet><Bold>Name:</Bold> Nahid Hasan</Bullet>
          <Bullet><Bold>Designation:</Bold> Proprietor, FlashMed</Bullet>
          <Bullet><Bold>Email:</Bold> support@flashmed.in</Bullet>
          <Bullet><Bold>Phone:</Bold> +91 92425 45884</Bullet>
          <Bullet><Bold>Address:</Bold> 091 Ratanpur, Bidhanchandra Road, Samserganj, Murshidabad, West Bengal — 742202</Bullet>
          <Bullet><Bold>Response Time:</Bold> Acknowledgment within 24 hours; resolution aimed within 7 days.</Bullet>
        </Section>

        <Section theme={theme} title="11. CHANGES TO THIS POLICY">
          <Bullet>We may update this Privacy Policy from time to time. Material changes will be notified via app notification or email at least 7 days before they take effect.</Bullet>
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