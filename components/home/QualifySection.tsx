/* eslint-disable @next/next/no-img-element */
import Qualifier from '@/components/qualifier/Qualifier';
import { ConsultCard } from '@/components/consult/Consult';
import type { Offer } from '@/lib/offers';

export default function QualifySection({ offer }: { offer: Offer }) {
  const q = offer.qualify;
  return (
    <section className="qualify" id="qualify" aria-labelledby="q-title">
      <div className="wrap q-grid">
        <div className="q-copy">
          <h2 className="h2 rv" id="q-title">See If You <span className="accent">Qualify</span></h2>
          {q.intro}
          <ol className="q-steps rv d2">
            {q.steps.map((s, i) => (
              <li key={s.title}><span className="n">0{i + 1}</span><div><b>{s.title}</b><span>{s.text}</span></div></li>
            ))}
          </ol>
          {q.flow && (
            <p className="flowline q-flow rv d2">
              {q.flow.map((t, i) => <span key={t}>{i > 0 && <i aria-hidden="true">→</i>}<b>{t}</b></span>)}
            </p>
          )}
          <ConsultCard consult={offer.consult} className="rv d2" />
          <div className={`claim mini${q.claim.stacked ? ' stacked' : ''} rv d3`}>
            <img src="/assets/claim-photo.jpg" width={2200} height={1238} alt="" />
            <div className="tx">
              <b>{q.claim.title}</b>
              {q.claim.lines.map((l, i) => <span key={i}>{l}</span>)}
            </div>
          </div>
        </div>

        <Qualifier slug={offer.slug} />
      </div>
    </section>
  );
}
