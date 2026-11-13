'use client';

import { useEffect } from 'react';

/** Fades .rv elements in as they enter the viewport (skipped in ?figma static mode). */
export default function Reveal() {
  useEffect(() => {
    if (document.documentElement.classList.contains('figma')) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      }),
      { rootMargin: '0px 0px -8% 0px' },
    );
    document.querySelectorAll('.rv').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
