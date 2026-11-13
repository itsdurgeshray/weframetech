import type { Offer } from '@/lib/offers';

/** Offer-specific "from / to" section: a flow of chips, or replace-this-with-that rows. */
export default function Shift({ offer }: { offer: Offer }) {
  const s = offer.shift;
  if (!s) return null;
  return (
    <section className="sec shift" aria-labelledby="s-title">
      <div className="wrap">
        <div className="head">
          <h2 className="h2 rv" id="s-title">{s.title}</h2>
          <p className="shift-sub rv d1">{s.subtitle}</p>
          {s.intro}
        </div>
        {s.kind === 'flow' ? (
          <ol className="shift-flow rv d1">
            {s.items.map((t, i) => (
              <li key={t}>
                <span className="glass sm"><span className="in"><span className="n">0{i + 1}</span>{t}</span></span>
              </li>
            ))}
          </ol>
        ) : (
          <ul className="shift-rows glass rv d1">
            <li className="in">
              {s.rows.map(([from, to]) => (
                <div className="row" key={from}>
                  <span className="from">{from}</span>
                  <span className="arrow" aria-label="becomes"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></span>
                  <span className="to">{to}</span>
                </div>
              ))}
            </li>
          </ul>
        )}
      </div>
    </section>
  );
}
