/* eslint-disable @next/next/no-img-element */
import QualifyLink from '@/components/ui/QualifyLink';
import type { Offer } from '@/lib/offers';

export default function Team({ offer }: { offer: Offer }) {
  const t = offer.team;
  return (
    <section className="sec" id="team" aria-labelledby="t-title">
      <div className="wrap">
        <div className="team-grid">
          <div className="story glass rv">
            <div className="in">
              <h2 className="h2" id="t-title">{t.title}</h2>
              {t.subtitle && <p className="story-sub">{t.subtitle}</p>}
              {t.body}
              <div className="sig"><span className="chip on"><span className="dot"></span>{t.chip}</span></div>
            </div>
          </div>
          <div className="photo glass rv d1">
            <div className="in">
              <img src="/assets/claim-photo.jpg" width={2200} height={1238} alt="Two WeframeTech engineers planning a build at a whiteboard" />
              <div className="cap"><span className="chip">Strategy session at the WeframeTech studio</span></div>
            </div>
          </div>
        </div>
        {t.statsTitle && <h3 className="h2 stats-title rv">{t.statsTitle}</h3>}
        <div className="stats">
          {t.stats.map((s, i) => (
            <div key={s.value} className={`stat glass sm rv${i ? ` d${((i - 1) % 2) + 1}` : ''}`}><div className="in"><b>{s.value}</b><span>{s.label}</span></div></div>
          ))}
        </div>
        <div className="team-cta rv"><QualifyLink className="btn">See if you qualify</QualifyLink></div>
      </div>
    </section>
  );
}
