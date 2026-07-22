import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Delete Account — FlashMed',
  description: 'Permanently delete your FlashMed account and personal data. Sign in to verify your identity, then follow the confirmation steps.',
  robots: { index: false, follow: false },
};

export default function DeleteAccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
