'use client';

import { useEffect, useState } from 'react';

const LINKS = [
  { id: 'opportunity', label: 'Opportunity' },
  { id: 'outcomes', label: 'The plan' },
  { id: 'build', label: 'Timeline' },
  { id: 'work', label: 'Our work' },
];

export function goTo(id: string) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

/** Sticky header with section links (active one highlighted) and the plan-builder CTA. */
export default function ProposalNav({ company }: { company: string }) {
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const ids = [...LINKS.map((l) => l.id), 'plan'];
    const onScroll = () => {
      setStuck(scrollY > 8);
      // the last section whose top has passed 40% of the viewport; none while in the hero, none on the plan builder
      let cur = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.4) cur = id;
      }
      setActive(cur === 'plan' ? '' : cur);
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); };
  }, []);

  return (
    <header className={`nav p-nav${stuck ? ' stuck' : ''}`}>
      <div className="wrap">
        <a href="#top" className="logo" aria-label="WeframeTech: back to top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mk" src="/assets/logo-mark.svg" width={47.4195} height={26.6307} alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="wd" src="/assets/logo-word.svg" width={111.81} height={11.9351} alt="" />
        </a>
        <nav className="p-links" aria-label={`Proposal for ${company}`}>
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} aria-current={active === l.id ? 'true' : undefined} onClick={(e) => { e.preventDefault(); goTo(l.id); }}>{l.label}</a>
          ))}
        </nav>
        <a href="#plan" className="btn sm" onClick={(e) => { e.preventDefault(); goTo('plan'); }}>Build your plan</a>
      </div>
    </header>
  );
}

/** Phone thumb-zone CTA: shows after the hero, hides while the plan builder is on screen. */
export function ProposalBar({ note }: { note: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const hero = document.querySelector('.p-hero .hero-cta');
    const zones = [document.getElementById('plan'), document.querySelector('.closing')].filter(Boolean) as Element[];
    const update = () => {
      const past = !!hero && hero.getBoundingClientRect().bottom < 0;
      const inZone = zones.some((z) => { const r = z.getBoundingClientRect(); return r.bottom > innerHeight * 0.2 && r.top < innerHeight * 0.8; });
      setOn(past && !inZone);
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update); };
  }, []);
  return (
    <div className={`mbar${on ? ' on' : ''}`} aria-hidden={!on}>
      <a href="#plan" className="btn" tabIndex={on ? 0 : -1} onClick={(e) => { e.preventDefault(); goTo('plan'); }}>
        Build your plan
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
      </a>
      <small>{note}</small>
    </div>
  );
}

/** In-page jump link (server components can't attach handlers). */
export function JumpLink({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) {
  return <a href={`#${to}`} className={className} onClick={(e) => { e.preventDefault(); goTo(to); }}>{children}</a>;
}
