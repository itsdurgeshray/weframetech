import type { Metadata } from 'next';
import OfferPage from '@/components/home/OfferPage';
import { DEFAULT_OFFER } from '@/lib/offers';
import './home.css';

/** "/" serves the telehealth offer (same page as /telehealth). */
export const metadata: Metadata = DEFAULT_OFFER.meta;

export default function HomePage() {
  return <OfferPage offer={DEFAULT_OFFER} />;
}
