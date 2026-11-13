import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OfferPage from '@/components/home/OfferPage';
import { OFFERS, getOffer } from '@/lib/offers';
import '../home.css';

export const dynamicParams = false;
export const generateStaticParams = () => OFFERS.map((o) => ({ offer: o.slug }));

type Props = { params: Promise<{ offer: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const offer = getOffer((await params).offer);
  return offer ? offer.meta : {};
}

export default async function Page({ params }: Props) {
  const offer = getOffer((await params).offer);
  if (!offer) notFound();
  return <OfferPage offer={offer} />;
}
