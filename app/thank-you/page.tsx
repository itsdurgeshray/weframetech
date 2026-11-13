/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import BookingCta from '@/components/thank-you/BookingCta';
import LeadSummary from '@/components/thank-you/LeadSummary';
import './thank-you.css';

export const metadata: Metadata = {
  title: 'Thank You | WeframeTech Telehealth Partnership',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <>
      <header className="nav">
        <a href="/" className="logo" aria-label="WeframeTech home">
          <img className="mk" src="/assets/logo-mark.svg" width={47.4195} height={26.6307} alt="" />
          <img className="wd" src="/assets/logo-word.svg" width={111.81} height={11.9351} alt="" />
        </a>
        <a href="/" className="home"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>Back to site</a>
      </header>

      <main>
        <section className="head" aria-labelledby="ty-title">
          <span className="orb" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg></span>
          <span className="chip"><span className="dot"></span>Application received. You&apos;re one step closer.</span>
          <h1 id="ty-title">Thank You.</h1>
          <p className="lede">We&apos;ve received your application. Based on your answers, you may be a good fit for our healthcare venture partnership.</p>
          <p className="lede">A member of the WeframeTech team will review your application and reach out within 24 hours.</p>
          <LeadSummary />
        </section>

        <section className="book glass" aria-labelledby="book-title">
          <div className="in">
            <div>
              <h2 id="book-title">Book Your Strategy Call</h2>
              <p>Don&apos;t wait for our team to reach out. Choose a convenient time to speak with us and explore your healthcare business opportunity.</p>
              <p>On the call, we&apos;ll discuss your business idea, revenue goals, investment, and how we can help you build and launch.</p>
            </div>
            <BookingCta />
          </div>
        </section>

        <section className="next" aria-labelledby="next-title">
          <h3 id="next-title">What Happens Next</h3>
          <ol>
            <li><span className="n">01</span><div><b>We Review Your Application</b><span>Our team reviews your healthcare experience, business goals, investment readiness, and answers.</span></div></li>
            <li><span className="n">02</span><div><b>Strategy Call</b><span>We discuss your idea, business model, revenue ambition, and the opportunity we see for your venture.</span></div></li>
            <li><span className="n">03</span><div><b>Build Your Roadmap</b><span>If there&apos;s a strong fit, we outline how our 50+ person team can support your technology, marketing, and execution.</span></div></li>
          </ol>
        </section>

        <section className="ready glass" aria-labelledby="ready-title">
          <div className="in">
            <h2 id="ready-title">Ready To Build Your Healthcare Business?</h2>
            <p>You bring the healthcare expertise.<br /><b>We bring the team, technology, marketing, and execution.</b></p>
            <BookingCta />
          </div>
        </section>
      </main>

      <p className="foot">© 2026 WeframeTech. All rights reserved.</p>
    </>
  );
}
