/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react';
import Marquee from '@/components/ui/Marquee';
import { inr } from '@/lib/offers/consult';
import type { Consult } from '@/lib/offers/types';
import './consult.css';

const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);

/** Full "what you get" card for the paid strategy session (qualify section, thank-you page). */
export function ConsultCard({ consult, className = '', children }: { consult: Consult; className?: string; children?: ReactNode }) {
  return (
    <div className={`consult glass ${className}`}>
      <div className="in">
        <div className="c-head">
          <div>
            <span className="c-kicker">For qualified applicants</span>
            <h3>{consult.name}</h3>
            <p className="c-sub">30 minutes, one-on-one with our CEO</p>
          </div>
          <div className="c-price" aria-label={`${inr(consult.price)} one-time fee`}>
            <b>{inr(consult.price)}</b>
            <span>one-time</span>
          </div>
        </div>
        <p className="c-label">What you walk away with</p>
        <ul className="c-list">
          {consult.includes.map((it) => (
            <li key={it.title}><span className="c-ck"><Check /></span><div><b>{it.title}</b><span>{it.text}</span></div></li>
          ))}
        </ul>
        <p className="c-why"><b>Why a fee?</b> It keeps our CEO&apos;s calendar for business owners who are serious about building. Everything above is yours to keep, whether or not we work together.</p>
        {children}
      </div>
    </div>
  );
}

/** Compact version for the form's final step: price + the deliverables as chips. */
export function ConsultStrip({ consult }: { consult: Consult }) {
  return (
    <div className="c-strip">
      <div className="c-strip-top">
        <p><span>Your next step</span><b>30-min strategy session with our CEO</b></p>
        <span className="c-tag">{inr(consult.price)}</span>
      </div>
      <ul className="c-chips">
        <li>Planning</li>
        <li>Proposal &amp; research</li>
        <li>Audit</li>
        <li>Marketing strategy</li>
        <li>Reports</li>
        <li>Case studies</li>
        <li>5-min industry video</li>
      </ul>
    </div>
  );
}

const AVATARS = ['t-bernd.jpg', 't-ty.jpg', 't-derin.jpg', 't-jake.jpg', 't-micha.jpg'];

/** Client logos + social proof at the foot of the form (and on the thank-you page). */
export function TrustStrip({ quote = false, moving = true }: { quote?: boolean; moving?: boolean }) {
  const logos = (
    <>
      <img src="/assets/cl-3.svg" width={102.798} height={32} alt="Bentley" />
      <img className="tall" src="/assets/l-ferrari.png" width={40} height={62} alt="Ferrari" />
      <img src="/assets/l-samsung.png" width={131} height={21} alt="Samsung" />
      <img src="/assets/cl-4.svg" width={142.222} height={32} alt="OnePlus" />
      <img className="tall" src="/assets/l-lamborghini.png" width={55} height={62} alt="Lamborghini" />
      <img src="/assets/cl-1.svg" width={155.259} height={32.0002} alt="Insta360" />
      <img src="/assets/cl-2.svg" width={84.0328} height={32} alt="Visit Dubai" />
      <img src="/assets/l-lulu.png" width={128} height={49} alt="Lulu Mall" />
    </>
  );
  return (
    <div className="trust">
      {quote && (
        <figure className="t-quote">
          <blockquote>&ldquo;They acted as builders, but also consultants.&rdquo;</blockquote>
          <figcaption><img src="/assets/t-ty.jpg" width={400} height={400} alt="" /><span><b>TY Robins</b> CEO, Comeata</span></figcaption>
        </figure>
      )}
      <div className="t-top">
        <span className="t-avs" aria-hidden="true">
          {AVATARS.map((a) => <img key={a} src={`/assets/${a}`} width={400} height={400} alt="" />)}
        </span>
        <p><b>300+ companies</b> trust WeframeTech, including teams backed by YC, Sequoia and Accel.</p>
      </div>
      {moving
        ? <Marquee className="t-logos" speed={26} aria-label="Clients">{logos}</Marquee>
        : <div className="t-logos static" aria-label="Clients"><div className="set">{logos}</div></div>}
    </div>
  );
}
