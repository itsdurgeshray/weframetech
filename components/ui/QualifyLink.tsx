'use client';

import type { AnchorHTMLAttributes, MouseEvent } from 'react';

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
