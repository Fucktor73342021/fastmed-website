import { redirect } from 'next/navigation';
import DeepLinkBridge from '@/components/DeepLinkBridge';

interface Props {
  params: Promise<{ uid: string }>;
}

export default async function ClinicDeepLink({ params }: Props) {
  const { uid } = await params;

  if (!uid || !/^[a-zA-Z0-9_\-]{1,128}$/.test(uid)) {
    redirect('/');
  }

  return (
    <DeepLinkBridge
      type="clinic"
      id={uid}
      ctaLabel="Book this clinic on FlashMed"
      intentPath={`c/${uid}`}
    />
  );
}
