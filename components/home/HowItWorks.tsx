import QualifyLink from '@/components/ui/QualifyLink';
import VideoPlayer from '@/components/ui/VideoPlayer';
import Timeline from '@/components/ui/Timeline';
import { site } from '@/lib/site';

export default function HowItWorks() {
  return (
    <section className="sec" id="how" aria-labelledby="h-title">
      <div className="wrap">
        <div className="head">
          <h2 className="h2 rv" id="h-title">Watch the 7-Minute Video Before Applying</h2>
          <p className="lede rv d1">Get answers to all your FAQs, see real client case studies, live proof, revenue results, and understand exactly how our telehealth business partnership works from start to finish.</p>
        </div>
        <div className="vsl glass rv">
          <div className="in">
            <VideoPlayer id="hplayer" videoId={site.explainerId} label="Play the 7-minute video" poster="/assets/claim-photo.jpg" posterWidth={2200} posterHeight={1238} note="Video link pending" />
          </div>
        </div>
        <h3 className="h2 tl-title rv" id="p-title">How Our Partnership Works</h3>
        <Timeline />
        <div className="hiw-cta rv"><QualifyLink className="btn">See if you qualify</QualifyLink></div>
      </div>
    </section>
  );
}
