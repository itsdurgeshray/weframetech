/* eslint-disable @next/next/no-img-element */
import SessionStatus from './SessionStatus';
import { OfferPanel, TrustStrip } from '@/components/consult/Consult';
import { inr } from '@/lib/offers/consult';
import type { Offer } from '@/lib/offers';

/**
 * Where Razorpay sends the visitor back. Paid: receipt + calendar to pick a time.
 * Not paid: retry. No session: link back to the application.
 */
export default function ThankYou({ offer }: { offer: Offer }) {
  const t = offer.thankYou;
  const c = offer.consult;
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
        <SessionStatus
          slug={offer.slug}
          price={inr(c.price)}
          bookingUrl={c.bookingUrl}
          landing={offer.path}
          offerCard={<OfferPanel consult={c} detailed />}
          offerCardPaid={<OfferPanel consult={c} detailed paid />}
          after={
            <>
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
                </div>
              </section>
            </>
          }
          trust={<TrustStrip moving={false} />}
        />
      </main>

      <p className="foot">© 2026 WeframeTech. All rights reserved.</p>
    </>
  );
}
