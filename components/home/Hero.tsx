import QualifyLink from '@/components/ui/QualifyLink';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { site } from '@/lib/site';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap">
        <div className="hero-copy">
          <h1 className="h1 rv" id="hero-title">Build a ₹1-10 Crore/Month Telehealth Business of Your Own</h1>
          <p className="lede rv d1">For doctors and healthcare professionals earning <b>₹2-10 lakh per month.</b> Watch real client proof, case studies, and see how this partnership works.</p>
        </div>

        <div className="vsl glass rv d2">
          <div className="in">
            <VideoPlayer id="vsl" videoId={site.vslId} label="Play the WeframeTech video" poster="/assets/video-thumb.jpg" posterWidth={1280} posterHeight={720} note="Final VSL embeds here" />
          </div>
        </div>

        <div className="hero-cta rv d2">
          <QualifyLink className="btn">See if you qualify <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg></QualifyLink>
          <small>Takes 60 seconds. 6 quick questions.</small>
        </div>

        <div className="vcs rv">
          <p>clients backed by top VCs</p>
          <div className="vc-row">
            <img src="/assets/vc-yc.svg" width={108} height={26} alt="Y Combinator" />
            <img src="/assets/vc-accel.svg" width={62.3487} height={19.579} alt="Accel" />
            <img src="/assets/vc-sequoia.svg" width={144.225} height={20} alt="Sequoia Capital" />
            <img src="/assets/vc-techstars.svg" width={112.131} height={20} alt="Techstars" />
            <span className="elev" role="img" aria-label="Elevation Capital">
              <img className="m" src="/assets/vc-elevation-mark.svg" width={17.1867} height={20.0001} alt="" />
              <img className="w" src="/assets/vc-elevation-word.svg" width={63.6509} height={7.88375} alt="" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
