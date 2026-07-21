import { redirect } from 'next/navigation';
import DeepLinkBridge from '@/components/DeepLinkBridge';

interface Props {
  params: Promise<{ uid: string }>;
}

export default async function PharmacyDeepLink({ params }: Props) {
  const { uid } = await params;

  if (!uid || !/^[a-zA-Z0-9_\-]{1,128}$/.test(uid)) {
    redirect('/');
  }

  return (
    <DeepLinkBridge
      type="pharmacy"
      id={uid}
      ctaLabel="Order from this pharmacy on FlashMed"
      intentPath={`p/${uid}`}
    />
  );
}
