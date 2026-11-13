import type { Metadata } from 'next';
import ThankYou from '@/components/thank-you/ThankYou';
import { DEFAULT_OFFER } from '@/lib/offers';
import './thank-you.css';

/** Kept for links to the original /thank-you (telehealth). */
export const metadata: Metadata = { title: 'Thank You | WeframeTech Telehealth Partnership', robots: { index: false, follow: false } };

export default function ThankYouPage() {
  return <ThankYou offer={DEFAULT_OFFER} />;
}
