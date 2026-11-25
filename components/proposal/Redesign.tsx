'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import type { Proposal } from '@/lib/proposals/types';

/** "We already redesigned your homepage": browser frame with a Today / Redesign toggle. */
export default function Redesign({ company, redesign }: { company: string; redesign: NonNullable<Proposal['redesign']> }) {
  const [view, setView] = useState<'after' | 'before'>('after');
  const src = view === 'after' || !redesign.before ? redesign.after : redesign.before;
  return (
    <div className="rd rv d1">
      {redesign.before && (
        <div className="rd-tabs" role="tablist" aria-label="Homepage version">
          <button role="tab" aria-selected={view === 'before'} className="ans" onClick={() => setView('before')}>Today</button>
          <button role="tab" aria-selected={view === 'after'} className="ans" onClick={() => setView('after')}>Our redesign</button>
        </div>
      )}
      <div className="rd-frame glass">
        <div className="in">
          <div className="rd-bar" aria-hidden="true"><i /><i /><i /><span>{company.toLowerCase().replace(/\s+/g, '')}.com</span></div>
          <div className="rd-shot"><img key={src} src={src} alt={`${company} homepage, ${view === 'after' ? 'redesigned by WeframeTech' : 'as it is today'}`} /></div>
        </div>
      </div>
      {(redesign.caption || redesign.previewUrl) && (
        <p className="rd-cap">
          {redesign.caption}
          {redesign.previewUrl && <> <a className="link" href={redesign.previewUrl} target="_blank" rel="noopener">Open the live preview</a></>}
        </p>
      )}
    </div>
  );
}
