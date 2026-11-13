'use client';

import { useState } from 'react';
import { site } from '@/lib/site';

/** "Book your strategy call" button. Until NEXT_PUBLIC_BOOKING_URL is set it shows a short note instead of a dead link. */
export default function BookingCta() {
  const [note, setNote] = useState(false);
  const url = site.bookingUrl;
  return (
    <>
      <a
        className="btn"
        data-book=""
        href={url || '#'}
        {...(url ? { target: '_blank', rel: 'noopener' } : {})}
        onClick={(e) => { if (!url) { e.preventDefault(); setNote(true); } }}
      >
        Book your strategy call <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
      </a>
      <p className={`note${note ? ' on' : ''}`} role="status">The booking link will be added here before launch.</p>
    </>
  );
}
