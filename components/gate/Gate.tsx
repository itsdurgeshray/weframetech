'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { site } from '@/lib/site';

/**
 * Video gate: the qualifier and every "See if you qualify" CTA stay locked until the visitor
 * has actually watched `site.unlockPercent` of a video (real seconds played, seeking ahead doesn't count).
 * Progress is remembered in localStorage so returning visitors stay unlocked.
 */
type Gate = {
  progress: number;            // 0..1, best across videos
  unlocked: boolean;
  report: (videoKey: string, fraction: number) => void;
  nudge: () => void;           // scroll to the video and flash the meter
  nudged: number;
};

const GateCtx = createContext<Gate | null>(null);

export function GateProvider({ children, storageKey = 'wft_vsl_gate' }: { children: ReactNode; storageKey?: string }) {
  const target = site.unlockPercent / 100;
  const [byVideo, setByVideo] = useState<Record<string, number>>({});
  const [nudged, setNudged] = useState(0);
  const [figma, setFigma] = useState(false);

  useEffect(() => {
    setFigma(document.documentElement.classList.contains('figma'));
    try { setByVideo(JSON.parse(localStorage.getItem(storageKey) || '{}')); } catch { /* storage blocked */ }
  }, [storageKey]);

  const report = useCallback((videoKey: string, fraction: number) => {
    setByVideo((prev) => {
      const f = Math.min(1, Math.max(prev[videoKey] ?? 0, fraction));
      if (f === prev[videoKey]) return prev;
      const next = { ...prev, [videoKey]: f };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* storage blocked */ }
      return next;
    });
  }, [storageKey]);

  const progress = Math.max(0, ...Object.values(byVideo));
  const unlocked = figma || target <= 0 || progress >= target;

  const nudge = useCallback(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('vsl')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    setNudged((n) => n + 1);
  }, []);

  const value = useMemo(() => ({ progress, unlocked, report, nudge, nudged }), [progress, unlocked, report, nudge, nudged]);
  return <GateCtx.Provider value={value}>{children}</GateCtx.Provider>;
}

export function useGate(): Gate {
  const g = useContext(GateCtx);
  if (!g) throw new Error('useGate must be used inside <GateProvider>');
  return g;
}

const LockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
);
const UnlockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 7.5-2" /></svg>
);

/** Progress meter shown under the hero VSL and inside the form lock panel. */
export function GateMeter({ compact = false }: { compact?: boolean }) {
  const { progress, unlocked, nudged } = useGate();
  const pct = Math.round(progress * 100);
  const need = site.unlockPercent;
  return (
    <div className={`gate-meter${unlocked ? ' done' : ''}${compact ? ' compact' : ''}`} key={unlocked ? 'u' : `n${nudged}`} data-flash={nudged > 0 && !unlocked ? '' : undefined} role="status" aria-live="polite">
      <span className="gm-ico">{unlocked ? <UnlockIcon /> : <LockIcon />}</span>
      <div className="gm-body">
        <p>{unlocked ? <><b>Unlocked.</b> You can now see if you qualify.</> : <><b>Watch {need}% of the video</b> to unlock your application.</>}</p>
        <div className="gm-bar" aria-hidden="true"><i style={{ width: `${Math.min(100, (pct / need) * 100)}%` }} /></div>
      </div>
      <span className="gm-pct">{unlocked ? '100%' : `${pct}%`}</span>
    </div>
  );
}

export { LockIcon };
