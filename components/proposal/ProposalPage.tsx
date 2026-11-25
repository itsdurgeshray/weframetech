/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react';
import Reveal from '@/components/ui/Reveal';
import Timeline from '@/components/ui/Timeline';
import Clients from '@/components/home/Clients';
import Testimonials from '@/components/home/Testimonials';
import Footer from '@/components/home/Footer';
import { CEO } from '@/components/consult/Consult';
import { BUILD, FLOW, GLOBAL_FACTORS, OUTCOMES, SCOPE, priceOf } from '@/lib/proposals/plan';
import type { Proposal } from '@/lib/proposals/types';
import ProposalNav, { JumpLink, ProposalBar } from './ProposalNav';
import PlanBuilder from './PlanBuilder';
import Redesign from './Redesign';

const Arrow = ({ down = false }: { down?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {down ? <><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></> : <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>}
  </svg>
);

/* line icons, one per outcome / insight */
const ICONS = [
  <svg key="a" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>,
  <svg key="b" viewBox="0 0 24 24"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>,
  <svg key="c" viewBox="0 0 24 24"><path d="M3 9h18l-1.5 11a1 1 0 0 1-1 .9H5.5a1 1 0 0 1-1-.9L3 9Z" /><path d="M8 9V7a4 4 0 0 1 8 0v2" /></svg>,
  <svg key="d" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18" /><path d="M12 3a14 14 0 0 0 0 18" /></svg>,
];

const HERO_STATS = [
  { value: '80–100', label: 'qualified B2B enquiries every month' },
  { value: '80%', label: 'of repetitive manual work automated' },
  { value: '$200K', label: 'per month target in direct sales' },
  { value: 'Global', label: 'a repeatable system for new markets' },
];

const fmtDate = (iso: string, addDays = 0) => {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + addDays);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
};

export default function ProposalPage({ proposal: pr, bookingUrl }: { proposal: Proposal; bookingUrl?: string }) {
  const first = pr.preparedFor?.name.split(' ')[0];
  return (
    <>
      <ProposalNav company={pr.company} />
      <main id="top" className="proposal">
        {/* ---------- hero ---------- */}
        <section className="hero p-hero" aria-labelledby="hero-title">
          <div className="wrap">
            <div className="hero-copy">
              <span className="chip on p-for rv"><span className="dot" />Private proposal · Prepared for {pr.company}</span>
              <h1 className="h1 rv" id="hero-title">The <span className="accent">$5M Growth Plan</span> <span className="p-co">for {pr.company}</span></h1>
              <p className="lede rv d1">A simple four-part plan to help {pr.company} build toward <b>$5M in annual revenue within 12 months</b>.</p>
              <p className="lede hero-note rv d1">We don&apos;t want to sell you individual services. <b>We want to take responsibility for the complete growth system</b>, from getting customers to automating operations and building new sales channels.</p>
            </div>

            <ol className="p-kpis rv d2" aria-label="The four outcomes">
              {HERO_STATS.map((s, i) => (
                <li key={s.value}>
                  <JumpLink to={`o-${OUTCOMES[i].id}`} className="p-kpi glass sm">
                    <span className="in">
                      <small>Outcome {OUTCOMES[i].n}</small>
                      <b>{s.value}</b>
                      <span>{s.label}</span>
                      <i aria-hidden="true"><Arrow down /></i>
                    </span>
                  </JumpLink>
                </li>
              ))}
            </ol>

            <div className="hero-cta rv d2">
              <div className="p-ctas">
                <JumpLink to="plan" className="btn">Build your plan <Arrow /></JumpLink>
                <JumpLink to="opportunity" className="btn p-ghost">Read the proposal <Arrow down /></JumpLink>
              </div>
              <small className="p-meta">
                {pr.preparedFor && <>For {pr.preparedFor.name}{pr.preparedFor.role && `, ${pr.preparedFor.role}`} · </>}
                {fmtDate(pr.date)} · Pricing valid until {fmtDate(pr.date, pr.validDays)}
              </small>
            </div>
          </div>
        </section>

        {/* ---------- why we believe ---------- */}
        <section className="sec" id="opportunity" aria-labelledby="op-title">
          <div className="wrap">
            <div className="head">
              <span className="p-kick rv">Why {pr.company}</span>
              <h2 className="h2 rv" id="op-title">Where we see the <span className="accent">biggest opportunity</span></h2>
              <p className="lede rv d1">Before writing this, we studied {pr.company}&apos;s website, search presence, buying journey and sales channels. Here&apos;s what stood out, and why we believe we can create real business impact.</p>
            </div>
            <ul className="p-insights">
              {pr.insights.map((it, i) => (
                <li key={it.title} className={`glass rv${i ? ` d${i}` : ''}`}>
                  <div className="in">
                    <span className="orb sm" aria-hidden="true">{ICONS[i % ICONS.length]}</span>
                    <small>Finding 0{i + 1}</small>
                    <h3 className="h3">{it.title}</h3>
                    <p>{it.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            {pr.redesign && (
              <div className="p-redesign">
                <div className="head">
                  <h3 className="h2 rv">We&apos;ve already redesigned your homepage</h3>
                  <p className="lede rv d1">A first look at how {pr.company} could present itself to buyers: clearer products, faster enquiries, built to rank on Google and AI search.</p>
                </div>
                <Redesign company={pr.company} redesign={pr.redesign} />
              </div>
            )}
          </div>
        </section>

        {/* ---------- four outcomes ---------- */}
        <section className="sec" id="outcomes" aria-labelledby="oc-title">
          <div className="wrap">
            <div className="head">
              <span className="p-kick rv">Recommended scope</span>
              <h2 className="h2 rv" id="oc-title">Four outcomes. <span className="accent">One growth system.</span></h2>
              <p className="lede rv d1">Each outcome has a clear target, a clear investment and a clear return. Take all four, or only the ones you need.</p>
            </div>
            <div className="p-outs">
              {OUTCOMES.map((o, i) => {
                const price = priceOf(o.id, pr.pricing);
                return (
                  <article key={o.id} id={`o-${o.id}`} className="oc glass rv" aria-labelledby={`o-${o.id}-t`}>
                    <div className="in">
                      <div className="oc-body">
                        <div className="oc-top">
                          <span className="orb" aria-hidden="true">{ICONS[i]}</span>
                          <span className="oc-n">Outcome {o.n}</span>
                        </div>
                        <h3 className="oc-title" id={`o-${o.id}-t`}>{o.title}</h3>
                        <p className="oc-intro">{o.intro}</p>
                        <div className="oc-list">
                          <span>{o.listLabel}</span>
                          <ul className="taglist">{o.items.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
                        </div>
                        {o.extra && <p className="oc-extra">{o.extra}</p>}
                      </div>
                      <dl className="oc-side">
                        <div>
                          <dt>{o.target.label}</dt>
                          <dd><b>{o.target.value}</b><span>{o.target.note}</span></dd>
                        </div>
                        <div>
                          <dt>Investment</dt>
                          <dd>
                            <b>{price.value}</b>
                            {o.id === 'global'
                              ? <ul className="oc-factors">{GLOBAL_FACTORS.map((f) => <li key={f}>{f}</li>)}</ul>
                              : <span>{price.note}</span>}
                          </dd>
                        </div>
                        <div>
                          <dt>{o.roi.label}</dt>
                          <dd><b>{o.roi.value}</b><span>{o.roi.note}</span></dd>
                        </div>
                      </dl>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- 12-month plan ---------- */}
        <section className="p-band" aria-labelledby="pl-title">
          <div className="wrap">
            <div className="head">
              <span className="p-kick rv">The 12-month $5M plan</span>
              <h2 className="h2 rv" id="pl-title">The four outcomes <span className="accent">work together</span></h2>
              <p className="lede rv d1">Each step makes the next one possible, compounding toward one number.</p>
            </div>
            <ol className="ladder rv d1">
              {FLOW.map((f, i) => (
                <li key={f} style={{ '--h': `${22 + i * 11}%` } as CSSProperties}>
                  <span className="lad-bar"><i>0{i + 1}</i></span>
                  <span className="lad-tx">{f}</span>
                </li>
              ))}
              <li className="top" style={{ '--h': '100%' } as CSSProperties}>
                <span className="lad-bar"><i>$5M+</i></span>
                <span className="lad-tx">Annual revenue ambition</span>
              </li>
            </ol>
            <div className="p-claim rv">
              <p>The objective is not simply to redesign a website.</p>
              <b>The objective is to build the marketing, technology, automation and sales infrastructure required to scale {pr.company} toward $5M+ in annual revenue.</b>
            </div>
          </div>
        </section>

        {/* ---------- what we take care of ---------- */}
        <section className="sec" id="scope" aria-labelledby="sc-title">
          <div className="wrap p-scope">
            <div className="p-scope-copy">
              <span className="p-kick rv">What WeframeTech takes care of</span>
              <h2 className="h2 rv" id="sc-title">One partner for the <span className="accent">complete execution layer</span></h2>
              <p className="lede rv d1">You don&apos;t need to coordinate multiple agencies for each of these areas. WeframeTech becomes the single technology + growth partner responsible for bringing the system together.</p>
              <div className="p-vs rv d1">
                <div><small>Without us</small><b>5–6 agencies, freelancers &amp; tools</b><span>to brief, align and chase</span></div>
                <div className="on"><small>With WeframeTech</small><b>One accountable team</b><span>50+ in-house experts, one plan, one number</span></div>
              </div>
            </div>
            <ul className="p-grid glass rv d1">
              <li className="in">
                {SCOPE.map((s) => <span key={s}><i className="of-ck" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg></i>{s}</span>)}
              </li>
            </ul>
          </div>
        </section>

        {/* ---------- 4-month build ---------- */}
        <section className="sec" id="build" aria-labelledby="bd-title">
          <div className="wrap">
            <div className="head">
              <span className="p-kick rv">Timeline</span>
              <h2 className="h2 rv" id="bd-title">The <span className="accent">4-month</span> initial build</h2>
              <p className="lede rv d1">Four months to put the whole system in place. After month four, the focus moves from <b>building → scaling</b>.</p>
            </div>
            <Timeline steps={BUILD} label="Month" labelledBy="bd-title" />
            <div className="p-next rv">
              <span className="chip on"><span className="dot" />Month 5 onward: scale acquisition, the direct channel and new markets</span>
            </div>
          </div>
        </section>

        {/* ---------- proof ---------- */}
        <div id="work" className="p-work">
          <Clients />
          <div className="wrap">
            <div className="stats p-stats">
              {[
                { value: '300+', label: 'Companies served, incl. teams backed by YC, Sequoia & Accel' },
                { value: '50+', label: 'In-house experts across technology, AI, marketing & growth' },
                { value: '4 Months', label: 'From kickoff to a working growth system' },
                { value: 'End-to-End', label: 'Strategy, brand, tech, AI, marketing & execution' },
              ].map((s, i) => (
                <div key={s.value} className={`stat glass sm rv${i ? ` d${((i - 1) % 2) + 1}` : ''}`}><div className="in"><b>{s.value}</b><span>{s.label}</span></div></div>
              ))}
            </div>
          </div>
          <Testimonials />
        </div>

        {/* ---------- build your plan ---------- */}
        <section className="sec" id="plan" aria-labelledby="pb-title">
          <div className="wrap">
            <div className="head">
              <span className="p-kick rv">Build your own plan</span>
              <h2 className="h2 rv" id="pb-title">Make this plan <span className="accent">yours</span></h2>
              <p className="lede rv d1">Keep the outcomes you want, remove the ones you don&apos;t, add anything we missed. The investment, timeline and ROI update as you go.</p>
            </div>
            <div className="rv d1"><PlanBuilder proposal={pr} bookingUrl={bookingUrl} /></div>
          </div>
        </section>

        {/* ---------- closing ---------- */}
        <section className="closing p-close" aria-labelledby="cl-title">
          <div className="wrap">
            <figure className="p-ceo rv">
              <img src={CEO.photo} width={240} height={240} alt={`${CEO.name}, CEO of WeframeTech`} />
              <figcaption><b>{CEO.name}</b><span>CEO, WeframeTech</span></figcaption>
            </figure>
            <h2 className="h2 rv" id="cl-title">{first ? `${first}, let's` : "Let's"} build {pr.company}&apos;s growth system together</h2>
            <p className="lede rv d1">We put this plan together specifically for {pr.company}. If even one of these outcomes matters to you, let&apos;s spend 30 minutes walking through the numbers.</p>
            <div className="p-ctas rv d2">
              <JumpLink to="plan" className="btn">Build your plan <Arrow /></JumpLink>
              {bookingUrl && <a className="btn p-ghost" href={bookingUrl} target="_blank" rel="noopener">Book a 30-min call</a>}
            </div>
          </div>
        </section>
      </main>
      <ProposalBar note={`Prepared for ${pr.company} · Pricing updates live`} />
      <Footer />
      <Reveal />
    </>
  );
}
