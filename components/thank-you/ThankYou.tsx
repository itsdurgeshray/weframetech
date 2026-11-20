/* eslint-disable @next/next/no-img-element */
import BookingCta from './BookingCta';
import LeadSummary from './LeadSummary';
import { OfferPanel, TrustStrip } from '@/components/consult/Consult';
import { inr } from '@/lib/offers/consult';
import type { Offer } from '@/lib/offers';

export default function ThankYou({ offer }: { offer: Offer }) {
  const t = offer.thankYou;
  const c = offer.consult;
  const cta = <BookingCta url={c.bookingUrl} label={`Book my ${inr(c.price)} session`} />;
  return (
    <>
      <header className="nav">
        <a href={offer.path} className="logo" aria-label="WeframeTech home">
          <img className="mk" src="/assets/logo-mark.svg" width={47.4195} height={26.6307} alt="" />
          <img className="wd" src="/assets/logo-word.svg" width={111.81} height={11.9351} alt="" />
        </a>
        <a href={offer.path} className="home"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>Back to site</a>
      </header>

      <main>
        <section className="head" aria-labelledby="ty-title">
          <span className="orb" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg></span>
          <span className="chip"><span className="dot"></span>{t.badge}</span>
          <h1 id="ty-title">Thank You.</h1>
          {t.ledes.map((l, i) => <p key={i} className="lede">{l}</p>)}
          <LeadSummary />
        </section>

        <section className="book" aria-labelledby="book-title">
          <div className="book-intro">
            <h2 id="book-title">Book Your Strategy Session</h2>
            {t.book.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <OfferPanel consult={c} detailed>
            <div className="c-cta">{cta}</div>
          </OfferPanel>
          <TrustStrip moving={false} />
        </section>

        <section className="next" aria-labelledby="next-title">
          <h3 id="next-title">What Happens Next</h3>
          <ol>
            {t.next.map((s, i) => (
              <li key={s.title}><span className="n">0{i + 1}</span><div><b>{s.title}</b><span>{s.text}</span></div></li>
            ))}
          </ol>
        </section>

        <section className="ready glass" aria-labelledby="ready-title">
          <div className="in">
            <h2 id="ready-title">{t.ready.title}</h2>
            {t.ready.body}
            {cta}
          </div>
        </section>
      </main>

      <p className="foot">© 2026 WeframeTech. All rights reserved.</p>
    </>
  );
}
