'use client';

import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { LockIcon, useGate } from '@/components/gate/Gate';

/**
 * Every "See if you qualify" CTA. Smooth-scrolls to the qualifier:
 * desktop centres the whole section, tablet/phone lands on the form card itself.
 */
export function scrollToQualifier() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = innerWidth < 1180;
  const target = narrow ? document.getElementById('qform') : document.getElementById('qualify');
  target?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: narrow ? 'start' : 'center' });
  setTimeout(() => {
    const first = document.querySelector<HTMLElement>('#qform .step.cur .ans, #qform .result.cur a');
    first?.focus({ preventScroll: true });
  }, reduce ? 0 : 700);
}

/** Locked until the video gate opens: then it scrolls to the video and flashes the progress meter instead. */
export default function QualifyLink({ onClick, className, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { unlocked, nudge } = useGate();
  return (
    <a
      href={unlocked ? '#qualify' : '#vsl'}
      data-qualify=""
      data-locked={unlocked ? undefined : ''}
      aria-describedby={unlocked ? undefined : 'gate-hint'}
      className={`${className ?? ''}${unlocked ? '' : ' is-locked'}`}
      {...props}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onClick?.(e);
        if (unlocked) scrollToQualifier(); else nudge();
      }}
    >
      {!unlocked && <span className="lk"><LockIcon /></span>}
      {children}
    </a>
  );
}
