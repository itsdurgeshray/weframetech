import Qualifier from '@/components/qualifier/Qualifier';

export default function QualifySection() {
  return (
    <section className="qualify" id="qualify" aria-labelledby="q-title">
      <div className="wrap q-grid">
        <div className="q-copy">
              <h2 className="h2 rv" id="q-title">See If You <span className="accent">Qualify</span></h2>
              <p className="lede rv d1">We partner with doctors and healthcare professionals who already have a clear vision for building their own healthcare business.</p>
              <div className="important rv d1">
                <p><b>Important:</b> You must have your own business idea, brand, product, software concept or telehealth business plan. You should know what you want to build and have a clear direction. We provide the technology, development and marketing expertise to help you execute and grow it.</p>
                <p className="sm">If you don't have a clear business idea or plan yet, this partnership may not be the right fit.</p>
              </div>
              <ol className="q-steps rv d2">
                <li><span className="n">01</span><div><b>Answer 6 quick questions</b><span>Tell us about your healthcare expertise, business idea, current income, goals and investment readiness.</span></div></li>
                <li><span className="n">02</span><div><b>Get an instant eligibility check</b><span>Find out if you qualify for our telehealth business partnership.</span></div></li>
                <li><span className="n">03</span><div><b>Book your strategy call</b><span>Discuss the business model, investment, case studies and end-to-end execution roadmap with our team.</span></div></li>
              </ol>
              <div className="claim mini rv d3">
                <img src="/assets/claim-photo.jpg" width={2200} height={1238} alt="" />
                <div className="tx"><b>BUILD YOUR OWN TELEHEALTH BUSINESS</b><span>Technology, platform development and marketing handled by our team of 50+ experts.</span><span>You bring the business idea, healthcare expertise and manage operations. We help you build and grow it.</span></div>
              </div>
            </div>

        <Qualifier />
      </div>
    </section>
  );
}
