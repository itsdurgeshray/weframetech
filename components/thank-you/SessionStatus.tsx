'use client';

import { useEffect, useState, type ReactNode } from 'react';

type Checkout = { url?: string; leadId?: string; name?: string; email?: string; demo?: boolean };
type State =
  | { kind: 'checking' }
  | { kind: 'paid'; paymentId?: string; demo?: boolean; name?: string; email?: string }
  | { kind: 'unpaid'; reason: 'failed' | 'pending'; retryUrl: string; demo?: boolean }
  | { kind: 'none'; invalid?: boolean };

const CALLBACK_KEYS = ['razorpay_payment_id', 'razorpay_payment_link_id', 'razorpay_payment_link_reference_id', 'razorpay_payment_link_status', 'razorpay_signature', 'demo', 'ref'];

const Check = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>;
const Alert = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8v5" /><path d="M12 16.5v.01" /><circle cx="12" cy="12" r="9" /></svg>;
const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;

function Stepper({ at }: { at: 2 | 3 }) {
  const steps = ['Qualified', 'Payment', 'Pick your time'];
  return (
    <ol className="ss-steps" aria-label="Your progress">
      {steps.map((s, i) => {
        const n = i + 1;
        const state = n < at ? 'done' : n === at ? 'on' : '';
        return (
          <li key={s} className={state} aria-current={n === at ? 'step' : undefined}>
            <span className="ss-n">{n < at ? <Check /> : n}</span>{s}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * The page Razorpay returns to. Verifies the payment on the server, then shows one of:
 * paid (receipt + calendar), unpaid (retry), or no session (start the application).
 * Static parts come from the server as slots so the copy stays in lib/offers.
 */
export default function SessionStatus({
  slug, price, bookingUrl, landing, offerCard, offerCardPaid, after, trust,
}: {
  slug: string; price: string; bookingUrl: string; landing: string;
  offerCard: ReactNode; offerCardPaid: ReactNode; after: ReactNode; trust: ReactNode;
}) {
  const [state, setState] = useState<State>({ kind: 'checking' });
  const checkoutKey = `wft_checkout_${slug}`;

  useEffect(() => {
    let checkout: Checkout = {};
    try { checkout = JSON.parse(sessionStorage.getItem(checkoutKey) || '{}') as Checkout; } catch { /* storage blocked */ }
    const params = new URLSearchParams(location.search);
    const fromRazorpay = params.has('razorpay_payment_link_id') || params.has('demo');
    const retryUrl = checkout.url && !checkout.url.startsWith('/') ? checkout.url : `${landing}#apply`;

    if (!fromRazorpay) {
      setState(checkout.url ? { kind: 'unpaid', reason: 'pending', retryUrl, demo: checkout.demo } : { kind: 'none' });
      return;
    }
    const q: Record<string, string> = {};
    CALLBACK_KEYS.forEach((k) => { const v = params.get(k); if (v) q[k] = v; });
    fetch('/api/payment/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(q) })
      .then((r) => r.json())
      .then((r: { status: 'paid' | 'unpaid' | 'invalid'; demo?: boolean; paymentId?: string; name?: string; email?: string }) => {
        if (r.status === 'paid') {
          setState({ kind: 'paid', demo: r.demo, paymentId: r.paymentId, name: r.name || checkout.name, email: r.email || checkout.email });
          try { sessionStorage.removeItem(checkoutKey); sessionStorage.removeItem(`wft_form_${slug}`); } catch { /* ignore */ }
          history.replaceState(null, '', location.pathname); // a refresh or shared link doesn't re-verify
        } else if (r.status === 'unpaid') {
          setState({ kind: 'unpaid', reason: 'failed', retryUrl, demo: r.demo });
        } else {
          setState({ kind: 'none', invalid: true });
        }
      })
      .catch(() => setState({ kind: 'unpaid', reason: 'failed', retryUrl }));
  }, [checkoutKey, landing, slug]);

  if (state.kind === 'checking') {
    return (
      <section className="head ss-checking" aria-live="polite">
        <span className="ss-spin" aria-hidden="true" />
        <h1 className="ss-h">Confirming Your Payment</h1>
        <p className="lede">This takes a second. Please don&apos;t close this page.</p>
      </section>
    );
  }

  if (state.kind === 'paid') {
    const cal = bookingUrl ? new URL(bookingUrl) : null;
    if (cal && state.name) cal.searchParams.set('name', state.name);
    if (cal && state.email) cal.searchParams.set('email', state.email);
    return (
      <>
        <section className="head" aria-labelledby="ty-title">
          <span className="orb" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg></span>
          <span className="chip"><span className="dot"></span>Payment received · {price}{state.paymentId ? ` · ${state.paymentId}` : ''}</span>
          <h1 id="ty-title">You&apos;re In. Now Pick Your Time.</h1>
          <p className="lede">Your 30-minute session with our CEO is paid for. Choose a slot below. It takes about 20 seconds.</p>
          {state.demo && <p className="ss-demo">Demo mode: no real payment was taken.</p>}
          <Stepper at={3} />
        </section>

        <section className="cal glass" aria-labelledby="cal-title">
          <div className="in">
            <div className="cal-head">
              <h2 id="cal-title">Pick Your Time</h2>
              <p>All times are shown in your time zone.</p>
            </div>
            {cal ? (
              <>
                <iframe className="cal-frame" src={cal.toString()} title="Pick a time for your strategy session" loading="eager" />
                <a className="cal-open" href={cal.toString()} target="_blank" rel="noopener">Calendar not loading? Open it in a new tab <Arrow /></a>
              </>
            ) : (
              <p className="cal-empty">The booking calendar will appear here once its link is added (NEXT_PUBLIC_*_BOOKING_URL).</p>
            )}
          </div>
        </section>

        {offerCardPaid}
        {after}
        {trust}
      </>
    );
  }

  if (state.kind === 'unpaid') {
    const pending = state.reason === 'pending';
    return (
      <>
        <section className="head" aria-labelledby="ty-title">
          <span className="orb warn" aria-hidden="true"><Alert /></span>
          <h1 id="ty-title" className="ss-h">{pending ? 'Finish Securing Your Session' : 'Your Payment Didn’t Go Through'}</h1>
          <p className="lede">
            {pending
              ? 'You qualified, and your answers are saved. One step left: secure your session, then pick your time.'
              : 'Your answers are saved, so it takes one step to try again. If money left your account, failed payments are reversed by your bank automatically.'}
          </p>
          <Stepper at={2} />
          <div className="ss-actions">
            <a className="btn" href={state.retryUrl}>{pending ? 'Continue to payment' : 'Try payment again'} · {price} <Arrow /></a>
            <a className="ss-link" href={`${landing}#apply`}>Change my details</a>
          </div>
          {!state.demo && <p className="ss-fine">We&apos;ve also sent this payment link to your phone and email.</p>}
        </section>
        {offerCard}
        {trust}
      </>
    );
  }

  return (
    <section className="head" aria-labelledby="ty-title">
      <h1 id="ty-title" className="ss-h">{state.invalid ? 'We Couldn’t Confirm This Payment' : 'Start Your Application'}</h1>
      <p className="lede">
        {state.invalid
          ? 'If you paid, your Razorpay receipt has the details and our team will reach out to schedule your session.'
          : 'Answer a few quick questions to see if you qualify for a strategy session with our CEO.'}
      </p>
      <div className="ss-actions"><a className="btn" href={`${landing}#apply`}>See if you qualify <Arrow /></a></div>
    </section>
  );
}
