import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function TermsAndConditionsScreen({ navigation }) {
  const { theme } = useTheme();
  const s = getStyles(theme);

  return (
    <View style={[s.root, { backgroundColor: theme.colors.bg }]}>
      <View style={[s.header, { backgroundColor: theme.colors.cardBg, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={{ fontSize: 22, color: theme.colors.primary }}>←</Text>
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
          Terms & Conditions
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[s.heading, { color: theme.colors.primary }]}>FLASHMED PLATFORM TERMS & CONDITIONS</Text>
        <Text style={[s.subheading, { color: theme.colors.textMuted }]}>
          UDYAM-WB-13-0148760{'\n'}
          Effective Date: 27 April 2026 | Version 1.0 | Last Updated: 27 April 2026
        </Text>

        <Section theme={theme} title="1. PLATFORM NATURE — TECHNOLOGY INTERMEDIARY">
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

        <Section theme={theme} title="2. DEFINITIONS">
          <Bullet>"<Bold>Platform</Bold>" – FlashMed mobile application and all associated services.</Bullet>
          <Bullet>"<Bold>Customer</Bold>" – a user who places orders or uses any service.</Bullet>
          <Bullet>"<Bold>Pharmacy Partner</Bold>" – a licensed retail pharmacy possessing valid drug licences under the Drugs and Cosmetics Act, 1940.</Bullet>
          <Bullet>"<Bold>Delivery Partner</Bold>" – an independent third‑party logistics provider responsible for transporting orders.</Bullet>
          <Bullet>"<Bold>Lab Partner</Bold>" – a registered diagnostic laboratory providing sample collection/testing.</Bullet>
          <Bullet>"<Bold>Blood SOS</Bold>" – the emergency service that alerts voluntary donors and connects requesters to licensed blood banks.</Bullet>
        </Section>

        <Section theme={theme} title="3. ELIGIBILITY AND REGISTRATION">
          <Bullet>You must be at least 18 years of age to use FlashMed.</Bullet>
          <Bullet>You must provide accurate, complete, and current information. Fake or duplicate accounts will be suspended.</Bullet>
        </Section>

        <Section theme={theme} title="4. MEDICINE ORDERS – PHARMACY PARTNER LIABILITY">
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

        <Section theme={theme} title="5. BLOOD SOS – COMMUNITY EMERGENCY SERVICE">
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

        <Section theme={theme} title="6. DELIVERY SERVICES – INDEPENDENT CONTRACTORS">
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

        <Section theme={theme} title="7. LAB TESTS – DIAGNOSTIC SERVICES">
          <Bullet>All diagnostic tests are performed by independent registered Lab Partners. FlashMed only facilitates booking and result delivery.</Bullet>
          <Bullet>FlashMed does not interpret test results or provide medical diagnoses.</Bullet>
        </Section>

        <Section theme={theme} title="8. FEES AND CHARGES">
          <Bullet>
            <Bold>Delivery charges (by distance):</Bold>
            • 0‑1 km: ₹25
            • 1‑2 km: ₹30
            • 2‑3 km: ₹35
            • 3‑4 km: ₹40
            • 4‑5 km: ₹45{'\n'}
            <Bold>Priority Express Fee (Late Night/Weather):</Bold> ₹30{'\n'}
          </Bullet>
          <Bullet><Bold>Platform fee:</Bold> ₹6 per order.</Bullet>
          <Bullet><Bold>Blood SOS service fee:</Bold> ₹299 per request (facilitation charge only).</Bullet>
          <Bullet><Bold>FlashMed Care (yearly subscription):</Bold> ₹399 – includes 5% extra discount on eligible medicines (capped) and 3 free deliveries per month. Savings credited to in‑app wallet.</Bullet>
          <Bullet><Bold>Refer & Earn:</Bold> ₹100 wallet credit for each successful referral.</Bullet>
        </Section>

        <Section theme={theme} title="9. USER CONDUCT AND PROHIBITED ACTIVITIES">
          <Bullet>You agree NOT to: upload fake/forged prescriptions; order controlled substances; misuse Blood SOS for non‑emergencies; harass any partner; create multiple accounts; reverse‑engineer the Platform.</Bullet>
          <Bullet>Violations may lead to permanent account ban and legal action under the Indian Penal Code, 1860.</Bullet>
        </Section>

        <Section theme={theme} title="10. INTELLECTUAL PROPERTY">
          <Bullet>All Platform content, software, and branding are the exclusive property of FlashMed (Nahid Hasan). Unauthorised use is prohibited.</Bullet>
        </Section>

        <Section theme={theme} title="11. DISCLAIMERS AND LIMITATION OF LIABILITY">
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

        <Section theme={theme} title="12. GOVERNING LAW AND DISPUTE RESOLUTION">
          <Bullet>These Terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts in Murshidabad, West Bengal.</Bullet>
          <Bullet>Before initiating legal proceedings, users must first contact the Grievance Officer for resolution.</Bullet>
        </Section>

        <Section theme={theme} title="13. GRIEVANCE OFFICER">
          <Bullet><Bold>Name:</Bold> Nahid Hasan</Bullet>
          <Bullet><Bold>UDYAM Registration:</Bold> UDYAM-WB-13-0148760</Bullet>
          <Bullet><Bold>Address:</Bold> 091 Ratanpur, Bidhanchandra Road, Samserganj, Murshidabad, West Bengal — 742202</Bullet>
          <Bullet><Bold>Email:</Bold> support@flashmed.in</Bullet>
          <Bullet><Bold>Phone:</Bold> +91 92425 45884</Bullet>
          <Bullet><Bold>Response Time:</Bold> Acknowledgment within 24 hours; resolution aimed within 48 hours.</Bullet>
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function Section({ theme, title, children }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={[{ fontSize: 15, fontWeight: '800', color: theme.colors.text, marginBottom: 10, marginTop: 4 }]}>{title}</Text>
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