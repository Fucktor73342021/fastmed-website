import { redirect } from 'next/navigation';
import DeepLinkBridge from '@/components/DeepLinkBridge';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return {
    title: 'Book Doctor — FlashMed',
    description: 'Book this doctor online via FlashMed. Fast, easy, and trusted healthcare.',
    robots: { index: false, follow: false },
    openGraph: {
      title: 'Book Doctor on FlashMed',
      description: 'Book appointments, consult online & manage your health.',
      siteName: 'FlashMed',
    },
  };
}

export default async function DoctorDeepLink({ params }: Props) {
  const { id } = await params;

  // Strict ID validation — prevent injection/traversal attacks
  if (!id || !/^[a-zA-Z0-9_\-]{1,128}$/.test(id)) {
    redirect('/');
  }

  return (
    <DeepLinkBridge
      type="doctor"
      id={id}
      ctaLabel="Book this doctor online on FlashMed"
      intentPath={`d/${id}`}
    />
  );
}
