'use client';

import { useEffect, useState } from 'react';
import QualifyLink from './QualifyLink';

/**
 * Phone/tablet thumb-zone CTA (CSS shows it at 820px and below).
 * Visible once the hero CTA has scrolled away; steps aside while the form, the closing CTA
 * or any in-page "See if you qualify" button is on screen.
 */
export default function StickyBar() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('figma')) return;
    const heroCta = document.querySelector('.hero-cta');
    const zones = [document.getElementById('qualify'), document.querySelector('.closing')].filter(Boolean) as Element[];
    const inline = [...document.querySelectorAll('.hiw-cta, .team-cta')];
    const vis = (el: Element, m = 0) => { const r = el.getBoundingClientRect(); return r.bottom > m && r.top < innerHeight - m; };
    const update = () => {
      const heroGone = !!heroCta && heroCta.getBoundingClientRect().bottom < 0;
      setOn(heroGone && !zones.some((z) => vis(z, innerHeight * 0.2)) && !inline.some((el) => vis(el)));
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update); };
  }, []);

  return (
    <div className={`mbar${on ? ' on' : ''}`} id="mbar" aria-hidden={!on}>
      <QualifyLink className="btn" tabIndex={on ? 0 : -1}>
        See if you qualify
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
      </QualifyLink>
      <small>Takes 60 seconds. For doctors and healthcare professionals.</small>
    </div>
  );
}
