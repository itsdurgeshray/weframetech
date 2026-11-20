/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react';
import Marquee from '@/components/ui/Marquee';
import { inr } from '@/lib/offers/consult';
import type { Consult } from '@/lib/offers/types';
import './consult.css';

const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);

/**
 * The paid strategy session: headline, price, deliverables.
 * Dark teal card; inside the apply rail it turns translucent. `detailed` adds a line under each deliverable.
 */
export function OfferPanel({ consult, detailed = false, paid = false, className = '', children }: { consult: Consult; detailed?: boolean; paid?: boolean; className?: string; children?: ReactNode }) {
  return (
    <div className={`offer ${className}`}>
      <div className="of-head">
        <span className="of-kicker">{consult.name}</span>
        <h3>30 minutes, one-on-one with our CEO</h3>
      </div>
      <div className="of-price">
        <b>{inr(consult.price)}</b>
        {paid ? <span>Paid in full<br />Now pick your time</span> : <span>One-time fee<br />Qualified applicants only</span>}
      </div>
      <ul className="of-list" aria-label="What you walk away with">
        {consult.includes.map((it) => (
          <li key={it.title}>
            <span className="of-ck"><Check /></span>
            <div><b>{it.title}</b>{detailed && <span>{it.text}</span>}</div>
          </li>
        ))}
      </ul>
      {!paid && <p className="of-why">The fee keeps our CEO&apos;s calendar for serious founders. Everything above is yours to keep, whether or not we work together.</p>}
      {children}
    </div>
  );
}

/** Reminder on the form's final step (the full card is in the rail, or below the form on phones). */
export function NextStepNote({ consult }: { consult: Consult }) {
  return (
    <div className="c-next">
      <span className="c-next-ico" aria-hidden="true">
        <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
      </span>
      <p>Last step: secure your <b>30-min session with our CEO</b>, then pick your time</p>
      <b className="c-next-price">{inr(consult.price)}</b>
    </div>
  );
}

const AVATARS = ['t-bernd.jpg', 't-ty.jpg', 't-derin.jpg', 't-jake.jpg', 't-micha.jpg'];

/** Client logos + social proof (foot of the form, thank-you page). */
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
