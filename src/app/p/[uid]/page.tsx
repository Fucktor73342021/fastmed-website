import { redirect } from 'next/navigation';
import DeepLinkBridge from '@/components/DeepLinkBridge';

interface Props {
  params: Promise<{ uid: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { uid } = await params;
  return {
    title: 'Opening Pharmacy Profile — FlashMed',
    description: 'Order medicine from this pharmacy via FlashMed',
    robots: { index: false },
  };
}

export default async function PharmacyDeepLink({ params }: Props) {
  const { uid } = await params;
  // Strict ID validation — prevent injection/traversal attacks
  if (!uid || !/^[a-zA-Z0-9_\-]{1,128}$/.test(uid)) {
    redirect('/');
  }
  return (
    <DeepLinkBridge
      type="pharmacy"
      id={uid}
      ctaLabel="Order medicine from this pharmacy on FlashMed"
      intentPath={`pharmacy/${uid}`}
    />
  );
}
