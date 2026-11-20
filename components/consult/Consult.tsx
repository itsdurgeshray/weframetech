/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react';
import Marquee from '@/components/ui/Marquee';
import { inr } from '@/lib/offers/consult';
import type { Consult } from '@/lib/offers/types';
import './consult.css';

export const CEO = { name: 'Bishen Ponnanna', photo: '/assets/ceo.jpg', linkedin: 'https://www.linkedin.com/in/ponnanna27/' };

const LinkedIn = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.25 7a1.97 1.97 0 0 0 0-3.94ZM20.44 13.4c0-3.1-1.65-4.55-3.86-4.55a3.33 3.33 0 0 0-3.02 1.66V8.5h-3.24c.04.95 0 11.5 0 11.5h3.24v-6.42c0-.34.03-.69.13-.93.27-.69.9-1.4 1.95-1.4 1.38 0 1.93 1.05 1.93 2.6V20h3.37v-6.6Z" /></svg>
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
