import Qualifier from '@/components/qualifier/Qualifier';
import { OfferPanel, RailQuote } from '@/components/consult/Consult';
import type { Offer } from '@/lib/offers';

const Tick = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>;

/**
 * One apply panel: the "how it works" rail (3 steps + the paid session) beside the form.
 * The rail highlights the visitor's current step: Qualifier sets data-phase on #apply.
 */
export default function QualifySection({ offer }: { offer: Offer }) {
  const q = offer.qualify;
  return (
    <section className="qualify" id="qualify" aria-labelledby="q-title">
      <div className="wrap">
        <div className="q-head">
          <h2 className="h2 rv" id="q-title">See If You <span className="accent">Qualify</span></h2>
          {q.intro}
          {q.flow && (
            <p className="flowline q-flow rv d2">
              {q.flow.map((t, i) => <span key={t}>{i > 0 && <i aria-hidden="true">→</i>}<b>{t}</b></span>)}
            </p>
          )}
        </div>

        <div className="apply glass rv d1" id="apply" data-phase="questions">
          <div className="in">
            <aside className="ap-rail" aria-label="How it works">
              <div className="ap-how">
                <span className="ap-kicker">How it works</span>
                <ol className="rail">
                  {q.steps.map((s, i) => (
                    <li key={s.title} className="rs">
                      <span className="rs-n"><i>{i + 1}</i><Tick /></span>
                      <div><b>{s.title}</b><span>{s.text}</span></div>
                    </li>
                  ))}
                </ol>
              </div>
              <OfferPanel consult={offer.consult} className="ap-offer" />
              <RailQuote />
            </aside>
            <Qualifier slug={offer.slug} />
          </div>
        </div>

        {q.note && <div className="q-note">{q.note}</div>}
      </div>
    </section>
  );
}
