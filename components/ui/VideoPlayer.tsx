'use client';

import { useState } from 'react';

type Props = {
  id: string;
  videoId: string;
  label: string;
  poster: string;
  posterWidth: number;
  posterHeight: number;
  note: string;
};

/**
 * Poster + play badge. On click the YouTube video plays in place (privacy-enhanced embed).
 * With a video ID the poster is the video's own YouTube thumbnail; without one, the design
 * poster shows with a "coming soon" note.
 */
export default function VideoPlayer({ id, videoId, label, poster, posterWidth, posterHeight, note }: Props) {
  const [playing, setPlaying] = useState(false);
  const src = videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : poster;

  return (
    <button
      className={`player${playing ? ' is-playing' : ''}${videoId ? ' has-yt' : ' nolink'}`}
      type="button"
      id={id}
      aria-label={label}
      onClick={() => { if (videoId) setPlaying(true); }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="poster" src={src} width={videoId ? 1280 : posterWidth} height={videoId ? 720 : posterHeight} alt="" />
      <span className="shade"></span>
      {!playing && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img className="yt" src="/assets/ic-youtube.svg" width={88} height={88} alt="" />
      )}
      {!videoId && <span className="note">{note}</span>}
      {playing && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={label}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      )}
    </button>
  );
}
