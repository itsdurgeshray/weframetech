import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ThankYou from '@/components/thank-you/ThankYou';
import { OFFERS, getOffer } from '@/lib/offers';
import '../../thank-you/thank-you.css';

export const dynamicParams = false;
export const generateStaticParams = () => OFFERS.map((o) => ({ offer: o.slug }));

export const metadata: Metadata = { title: 'Thank You | WeframeTech', robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ offer: string }> }) {
  const offer = getOffer((await params).offer);
  if (!offer) notFound();
  return <ThankYou offer={offer} />;
}
