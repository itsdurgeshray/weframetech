'use client';

import { useEffect, useRef, useState } from 'react';
import { useGate } from '@/components/gate/Gate';

type Props = {
  id: string;
  videoId: string;
  label: string;
  poster: string;
  posterWidth: number;
  posterHeight: number;
  note: string;
};

/* Minimal YouTube IFrame API typing */
type YTPlayer = { getCurrentTime(): number; getDuration(): number; getPlayerState(): number; destroy(): void };
type YTNamespace = { Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer };
declare global { interface Window { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void } }

let ytReady: Promise<YTNamespace> | null = null;
function loadYouTube(): Promise<YTNamespace> {
  if (ytReady) return ytReady;
  ytReady = new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(window.YT!); };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  });
  return ytReady;
}

const SIM_SECONDS = 20; // preview playback length when no video ID is set yet

/**
 * Poster + play badge. On click: real YouTube player (tracked through the IFrame API), or,
 * before a video ID is configured, a labelled simulated playback so the unlock flow can be previewed.
 * Only seconds actually played count toward the gate; skipping ahead does not.
 */
export default function VideoPlayer({ id, videoId, label, poster, posterWidth, posterHeight, note }: Props) {
  const { report } = useGate();
  const [playing, setPlaying] = useState(false);
  const [sim, setSim] = useState(0); // 0..1 simulated progress
  const host = useRef<HTMLDivElement>(null);
  const key = videoId || `preview-${id}`;

  // real video: count watched seconds
  useEffect(() => {
    if (!playing || !videoId || !host.current) return;
    let player: YTPlayer | null = null;
    let watched = 0, last = 0;
    let poll: ReturnType<typeof setInterval>;
    let alive = true;
    loadYouTube().then((YT) => {
      if (!alive || !host.current) return;
      const el = document.createElement('div'); // YouTube replaces this node; React owns only the wrapper
      host.current.appendChild(el);
      player = new YT.Player(el, {
        videoId,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1 },
        host: 'https://www.youtube-nocookie.com',
      });
      poll = setInterval(() => {
        if (!player || typeof player.getPlayerState !== 'function') return;
        const t = player.getCurrentTime();
        const d = t - last;
        // 1 = playing. A 1s poll moves up to ~2s at 2x speed; anything bigger is a seek and doesn't count.
        if (player.getPlayerState() === 1 && d > 0 && d <= 2.6) watched += d;
        last = t;
        const dur = player.getDuration();
        if (dur > 0) report(key, watched / dur);
      }, 1000);
    });
    return () => { alive = false; clearInterval(poll); player?.destroy(); };
  }, [playing, videoId, key, report]);

  // preview: simulated playback
  useEffect(() => {
    if (!playing || videoId) return;
    const t = setInterval(() => setSim((s) => Math.min(1, s + 1 / SIM_SECONDS)), 1000);
    return () => clearInterval(t);
  }, [playing, videoId]);
  useEffect(() => { if (sim > 0) report(key, sim); }, [sim, key, report]);

  return (
    <button className={`player${playing ? ' is-playing' : ''}`} type="button" id={id} aria-label={label} onClick={() => setPlaying(true)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="poster" src={poster} width={posterWidth} height={posterHeight} alt="" />
      <span className="shade"></span>
      {!playing && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img className="yt" src="/assets/ic-youtube.svg" width={88} height={88} alt="" />
      )}
      {playing && videoId && <div className="yt-host" ref={host} />}
      {playing && !videoId && (
        <span className="sim" aria-live="polite">
          <span className="sim-tag">Preview: simulated playback ({note.toLowerCase()})</span>
          <span className="sim-bar"><i style={{ width: `${sim * 100}%` }} /></span>
        </span>
      )}
    </button>
  );
}
