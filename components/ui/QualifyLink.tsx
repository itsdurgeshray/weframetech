'use client';

import type { AnchorHTMLAttributes, MouseEvent } from 'react';

/**
 * Every "See if you qualify" CTA. Smooth-scrolls to the qualifier:
 * lands on the apply panel (how-it-works steps + form).
 */
export function scrollToQualifier() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('apply')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  setTimeout(() => {
    const first = document.querySelector<HTMLElement>('#qform .step.cur .ans, #qform .result.cur a');
    first?.focus({ preventScroll: true });
  }, reduce ? 0 : 700);
}

export default function QualifyLink({ onClick, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href="#qualify"
      data-qualify=""
      {...props}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onClick?.(e);
        scrollToQualifier();
      }}
    >
      {children}
    </a>
  );
}
