import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delete Account — FlashMed',
  description: 'Request deletion of your FlashMed account and personal data.',
};

export default function DeleteAccount() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0d1117 0%,#0f1b2d 100%)', color: '#D1D5DB', fontFamily: "'Inter',system-ui,sans-serif", padding: '0 0 48px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', padding: '48px 0 36px' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#059669,#047857)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💊</div>
            <span style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#059669,#34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FlashMed</span>
          </a>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🗑️</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#F9FAFB', marginBottom: 8, marginTop: 0 }}>Delete Your Account</h1>
          <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7, margin: 0 }}>
            We're sorry to see you go. Your data privacy is our priority.
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#F9FAFB', marginBottom: 16, marginTop: 0 }}>How to Delete Your Account</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { step: '1', title: 'Via the App (Recommended)', desc: 'Open FlashMed App → Profile → Settings → Delete Account. Your account will be scheduled for deletion within 7 days.' },
              { step: '2', title: 'Via Email Request', desc: 'Send an email to support@flashmed.in with subject line: "Account Deletion Request – [Your Registered Phone Number]". We will process it within 7 business days.' },
              { step: '3', title: 'Via Phone', desc: 'Call +91 9144150105 between 9 AM – 6 PM (IST), Monday–Saturday.' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#059669,#047857)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, flexShrink: 0 }}>{item.step}</div>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#F9FAFB', fontSize: 14 }}>{item.title}</p>
                  <p style={{ margin: 0, color: '#9CA3AF', fontSize: 13, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: '20px 24px', marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 12px', color: '#FCA5A5', fontSize: 15, fontWeight: 700 }}>⚠️ What Happens When You Delete</h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#D1D5DB', fontSize: 13, lineHeight: 1.8 }}>
            <li>Your account will be <strong style={{ color: '#F9FAFB' }}>permanently deactivated</strong> within 7 days</li>
            <li>Personal data (name, phone, address, health data) will be <strong style={{ color: '#F9FAFB' }}>deleted immediately</strong> after deactivation</li>
            <li>Order history and financial records are <strong style={{ color: '#F9FAFB' }}>retained for 7 years</strong> as required by Indian tax law</li>
            <li>Unused wallet balance and referral credits will be <strong style={{ color: '#F9FAFB' }}>forfeited</strong> upon deletion</li>
            <li>Active orders must be completed or cancelled before account deletion</li>
          </ul>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#F9FAFB', fontSize: 14 }}>Need Help? Contact Us</p>
          <p style={{ margin: 0, color: '#9CA3AF', fontSize: 13, lineHeight: 1.8 }}>
            📧 support@flashmed.in<br />
            📞 +91 9144150105<br />
            🕘 Mon–Sat, 9 AM – 6 PM IST
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a href="/" style={{ color: '#059669', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
