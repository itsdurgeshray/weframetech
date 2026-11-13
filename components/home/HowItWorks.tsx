import QualifyLink from '@/components/ui/QualifyLink';
import VideoPlayer from '@/components/ui/VideoPlayer';
import Timeline from '@/components/ui/Timeline';
import type { Offer } from '@/lib/offers';

export default function HowItWorks({ offer }: { offer: Offer }) {
  const h = offer.how;
  return (
    <section className="sec" id="how" aria-labelledby="h-title">
      <div className="wrap">
        <div className="head">
          <h2 className="h2 rv" id="h-title">{h.title}</h2>
          {h.body}
        </div>
        <div className="vsl glass rv">
          <div className="in">
            <VideoPlayer id="hplayer" videoId={offer.video.explainerId} label={`Play: ${h.title}`} poster="/assets/claim-photo.jpg" posterWidth={2200} posterHeight={1238} note="Video link pending" />
          </div>
        </div>
        <h3 className="h2 tl-title rv" id="p-title">{h.timelineTitle}</h3>
        <Timeline steps={h.steps} />
        <div className="hiw-cta rv"><QualifyLink className="btn">See if you qualify</QualifyLink></div>
      </div>
    </section>
  );
}
