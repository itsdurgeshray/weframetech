'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';


/**
 * "How Our Partnership Works". The line fills with scroll and each node activates as the fill reaches it.
 * Horizontal on desktop, vertical (line from node 1 to node 5 only) at 820px and below.
 */
export default function Timeline({ steps, label = 'Step', labelledBy = 'p-title' }: { steps: { title: string; text: string }[]; label?: string; labelledBy?: string }) {
  const tlRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [cur, setCur] = useState(0);

  useEffect(() => {
    if (document.documentElement.classList.contains('figma')) return;
    const tl = tlRef.current!;
    const fill = fillRef.current!;
    const nodes = nodeRefs.current.filter(Boolean) as HTMLSpanElement[];
    const vertical = () => matchMedia('(max-width:820px)').matches;
    let t0 = 0, tlen = 0;

    const measure = () => {
      if (!vertical()) {
        tl.style.removeProperty('--t0'); tl.style.removeProperty('--tlen'); fill.style.height = '';
        return;
      }
      const base = tl.getBoundingClientRect().top;
      const c = (n: HTMLElement) => { const r = n.getBoundingClientRect(); return r.top + r.height / 2 - base; };
      t0 = c(nodes[0]); tlen = c(nodes[nodes.length - 1]) - t0;
      tl.style.setProperty('--t0', t0 + 'px');
      tl.style.setProperty('--tlen', tlen + 'px');
      fill.style.width = '';
    };
    const onScroll = () => {
      if (vertical()) {
        const line = innerHeight * 0.55;
        fill.style.height = Math.max(0, Math.min(tlen, line - tl.getBoundingClientRect().top - t0)) + 'px';
        let i = 0;
        nodes.forEach((n, k) => { const r = n.getBoundingClientRect(); if (r.top + r.height / 2 <= line + 1) i = k; });
        setCur(i);
      } else {
        // progress runs while the timeline travels from 80% to 35% of the viewport
        const p = Math.max(0, Math.min(1, (innerHeight * 0.8 - tl.getBoundingClientRect().top) / (innerHeight * 0.45)));
        fill.style.width = p * 100 + '%';
        setCur(Math.min(nodes.length - 1, Math.floor(p * (nodes.length - 1) + 0.001)));
      }
    };
    const relayout = () => { measure(); onScroll(); };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', relayout);
    document.fonts?.ready.then(relayout);
    relayout();
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', relayout); };
  }, []);

  return (
    <div className="tl rv d1" ref={tlRef} style={{ '--n': steps.length } as CSSProperties}>
      <div className="tl-track" aria-hidden="true"><i ref={fillRef}></i></div>
      <ol aria-labelledby={labelledBy}>
        {steps.map((s, k) => (
          <li key={s.title}>
            <div className={`tl-step${k < cur ? ' done' : ''}`} aria-current={k === cur ? 'step' : undefined}>
              <span className="tl-node" aria-hidden="true" ref={(el) => { nodeRefs.current[k] = el; }}>0{k + 1}</span>
              <span className="tl-txt"><small>{label} 0{k + 1}</small><b>{s.title}</b><span>{s.text}</span></span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
