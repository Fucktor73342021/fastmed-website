import { redirect } from 'next/navigation';
import DeepLinkBridge from '@/components/DeepLinkBridge';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return {
    title: 'Opening Doctor Profile — FlashMed',
    description: 'Book this doctor online via FlashMed',
    robots: { index: false },
  };
}

export default async function DoctorDeepLink({ params }: Props) {
  const { id } = await params;
  if (!id || !/^[a-zA-Z0-9_\-\.]{1,128}$/.test(id)) {
    redirect('/');
  }
  return (
    <DeepLinkBridge
      type="doctor"
      id={id}
      ctaLabel="Book this doctor online on FlashMed"
      intentPath={`doctor/${id}`}
    />
  );
}
