import QualifyLink from '@/components/ui/QualifyLink';
import type { Offer } from '@/lib/offers';

export default function Closing({ offer }: { offer: Offer }) {
  return (
    <section className="closing" aria-labelledby="cl-title">
      <div className="wrap">
        <h2 className="h2 rv" id="cl-title">{offer.closing.title}</h2>
        {offer.closing.body}
        <QualifyLink className="btn rv d2">See if you qualify <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></QualifyLink>
      </div>
    </section>
  );
}
