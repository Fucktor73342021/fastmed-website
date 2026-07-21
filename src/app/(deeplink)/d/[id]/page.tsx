import { redirect } from 'next/navigation';
import DeepLinkBridge from '@/components/DeepLinkBridge';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DoctorDeepLink({ params }: Props) {
  const { id } = await params;

  // UUID / Firestore doc IDs: alphanumeric + hyphen + underscore
  if (!id || !/^[a-zA-Z0-9_\-]{1,128}$/.test(id)) {
    redirect('/');
  }

  return (
    <DeepLinkBridge
      type="doctor"
      id={id}
      ctaLabel="Book this doctor on FlashMed"
      intentPath={`d/${id}`}
    />
  );
}
