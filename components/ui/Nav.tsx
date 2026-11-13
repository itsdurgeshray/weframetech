'use client';

import { useEffect, useState } from 'react';
import QualifyLink from './QualifyLink';

/** Sticky header; turns to frosted glass once the page scrolls. */
export default function Nav() {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const onScroll = () => setStuck(scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav${stuck ? ' stuck' : ''}`} id="nav">
      <div className="wrap">
        <a href="#top" className="logo" aria-label="WeframeTech home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mk" src="/assets/logo-mark.svg" width={47.4195} height={26.6307} alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="wd" src="/assets/logo-word.svg" width={111.81} height={11.9351} alt="" />
        </a>
        <QualifyLink className="btn">See if you qualify</QualifyLink>
      </div>
    </header>
  );
}
