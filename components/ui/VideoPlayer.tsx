'use client';

import { useRef, useState } from 'react';

type Props = {
  id: string;
  videoId: string;
  label: string;
  poster: string;
  posterWidth: number;
  posterHeight: number;
  /** Shown briefly when clicked before a video ID is set. */
  note: string;
};

/** Poster + YouTube play badge; swaps to a privacy-friendly YouTube embed on click. */
export default function VideoPlayer({ id, videoId, label, poster, posterWidth, posterHeight, note }: Props) {
  const [playing, setPlaying] = useState(false);
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const onClick = () => {
    if (videoId) return setPlaying(true);
    setPending(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPending(false), 2200);
  };

  return (
    <button className={`player${pending ? ' nolink' : ''}`} type="button" id={id} aria-label={label} onClick={onClick}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="poster" src={poster} width={posterWidth} height={posterHeight} alt="" />
      <span className="shade"></span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="yt" src="/assets/ic-youtube.svg" width={88} height={88} alt="" />
      <span className="note">{note}</span>
      {playing && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title="Video"
        />
      )}
    </button>
  );
}
