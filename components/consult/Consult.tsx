/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react';
import Marquee from '@/components/ui/Marquee';
import { inr } from '@/lib/offers/consult';
import type { Consult } from '@/lib/offers/types';
import './consult.css';

export const CEO = { name: 'Bishen Ponnanna', photo: '/assets/ceo.jpg', linkedin: 'https://www.linkedin.com/in/ponnanna27/' };

const LinkedIn = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
);

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
        <div className="of-ceo">
          <img src={CEO.photo} width={240} height={240} alt={`${CEO.name}, CEO of WeframeTech`} />
          <h3>30 minutes, 1-1 with our CEO</h3>
          <a className="of-li" href={CEO.linkedin} target="_blank" rel="noopener" aria-label={`${CEO.name} on LinkedIn`}><LinkedIn /></a>
        </div>
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

/** Checkout-style total right above the pay button on the form's final step. */
export function DueToday({ consult }: { consult: Consult }) {
  return (
    <div className="due">
      <p><span>Due today</span><b>30-min 1-1 with our CEO</b></p>
      <b className="due-price">{inr(consult.price)}</b>
    </div>
  );
}

/** Client quote shown under the session card while the visitor fills in their details. */
export function RailQuote() {
  return (
    <figure className="ap-quote">
      <blockquote>&ldquo;They didn&apos;t just build what we told them to build, rather, they gave excellent advice on what to change, and why they were recommending it, which is extremely valuable to us.&rdquo;</blockquote>
      <figcaption><img src="/assets/t-ty.jpg" width={400} height={400} alt="" /><span><b>TY Robins</b>CEO, Comeata</span></figcaption>
    </figure>
  );
}

const AVATARS = ['t-bernd.jpg', 't-ty.jpg', 't-derin.jpg', 't-jake.jpg', 't-micha.jpg'];

/** Client logos + social proof (foot of the form, thank-you page). */
export function TrustStrip({ moving = true }: { moving?: boolean }) {
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
