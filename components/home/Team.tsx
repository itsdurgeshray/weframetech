import QualifyLink from '@/components/ui/QualifyLink';

export default function Team() {
  return (
    <section className="sec" id="team" aria-labelledby="t-title">
      <div className="wrap">
        <div className="team-grid">
          <div className="story glass rv">
            <div className="in">
              <h2 className="h2" id="t-title">We're Not Just A Tech Or Marketing Company. We're Your Venture-Building Partner.</h2>
              <p>WeframeTech brings together technology, marketing, strategy, and execution to help healthcare professionals build their own digital healthcare businesses.</p>
              <p>We partner with doctors, healthcare professionals, and healthcare founders who bring the healthcare expertise and manage operations. Our 50+ member team works across technology, product, marketing, and growth to build and launch your business.</p>
              <p>You don't need to build a technology or marketing team from scratch. We become the execution team behind your venture, helping turn your healthcare expertise into a scalable digital healthcare business.</p>
              <div className="sig"><span className="chip on"><span className="dot"></span>50+ in-house experts across technology, product &amp; marketing</span></div>
            </div>
          </div>
          <div className="photo glass rv d1">
            <div className="in">
              <img src="/assets/claim-photo.jpg" width={2200} height={1238} alt="Two WeframeTech engineers planning a build at a whiteboard" />
              <div className="cap"><span className="chip">Strategy session at the WeframeTech studio</span></div>
            </div>
          </div>
        </div>
        <div className="stats">
          <div className="stat glass sm rv"><div className="in"><b>50+</b><span>Experts across technology, marketing &amp; growth</span></div></div>
          <div className="stat glass sm rv d1"><div className="in"><b>3-4 Months</b><span>Target launch timeline</span></div></div>
          <div className="stat glass sm rv d2"><div className="in"><b>₹1-10 Cr</b><span>Monthly revenue ambition</span></div></div>
          <div className="stat glass sm rv d1"><div className="in"><b>₹10-15 Lakh</b><span>Starting investment</span></div></div>
          <div className="stat glass sm rv d2"><div className="in"><b>End-to-End</b><span>Strategy + Technology + Marketing + Execution</span></div></div>
        </div>
        <div className="team-cta rv"><QualifyLink className="btn">See if you qualify</QualifyLink></div>
      </div>
    </section>
  );
}
