'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { MODELS, OUTCOMES, priceOf, usd, usdK } from '@/lib/proposals/plan';
import type { CommercialModel, OutcomeId, Proposal } from '@/lib/proposals/types';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const Check = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>;
const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** "Build your own plan": pick outcomes, see investment/timeline/ROI update live, send it to WeframeTech. */
export default function PlanBuilder({ proposal, bookingUrl }: { proposal: Proposal; bookingUrl?: string }) {
  const p = proposal.pricing;
  const [picked, setPicked] = useState<Set<OutcomeId>>(() => new Set(proposal.recommended ?? OUTCOMES.map((o) => o.id)));
  const [model, setModel] = useState<CommercialModel>('retainer');
  const [otherOn, setOtherOn] = useState(false);
  const [other, setOther] = useState('');
  const [name, setName] = useState(proposal.preparedFor?.name ?? '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<Status>('idle');

  const toggle = (id: OutcomeId) => setPicked((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const selected = OUTCOMES.filter((o) => picked.has(o.id));
  const custom = otherOn ? other.trim() : '';

  const sum = useMemo(() => {
    const oneTime = (picked.has('automation') ? p.automation.oneTime : 0) + (picked.has('channel') ? p.channel.oneTime : 0);
    const months = Math.max(0, ...selected.map((o) => o.months));
    const buildMonths = months ? 4 : 0;
    let monthly: { value: string; note: string } | null = null;
    if (picked.has('enquiries')) {
      monthly = model === 'retainer'
        ? { value: `${usd(p.enquiries.monthly)}/mo`, note: '+ advertising spend' }
        : model === 'per-enquiry'
          ? { value: `${usd(p.enquiries.perEnquiry)}/enquiry`, note: `≈ ${usdK(p.enquiries.perEnquiry * 80)}–${usdK(p.enquiries.perEnquiry * 100)}/mo at target volume` }
          : { value: 'Performance', note: 'Base + share of revenue, agreed together' };
    }
    const firstPhase = oneTime + (picked.has('enquiries') && model === 'retainer' ? p.enquiries.monthly * buildMonths : 0);
    const timeline = !selected.length
      ? '—'
      : months === 0
        ? 'Scoped together'
        : `${buildMonths}-month initial build`;
    const notes: string[] = [];
    if (months === 0 && selected.length) notes.push('Country-by-country plan after discovery');
    if (picked.has('automation') || picked.has('enquiries')) notes.push('first systems live in month 2–3');
    if (picked.has('channel')) notes.push('direct channel live after month 4');
    if (picked.has('global') && months > 0) notes.push('global rollout from month 5');
    const timelineNote = notes.join(' · ').replace(/^./, (c) => c.toUpperCase());
    return { oneTime, monthly, firstPhase, timeline, timelineNote };
  }, [picked, model, p, selected]);

  const commercial = picked.has('enquiries') ? MODELS.find((m) => m.id === model)!.label : picked.size ? 'Fixed-scope build' : '—';
  const errs = { name: name.trim().length < 2, email: !EMAIL.test(email.trim()), plan: !selected.length && !custom };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setTried(true);
    if (errs.name || errs.email || errs.plan) {
      const target = errs.plan ? '.pb-opt input' : errs.name ? '#pb-name' : '#pb-email';
      document.querySelector<HTMLElement>(target)?.focus();
      return;
    }
    setStatus('sending');
    try {
      const r = await fetch('/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: proposal.slug, outcomes: [...picked], model: picked.has('enquiries') ? model : undefined, custom, name, email, phone }),
      });
      setStatus(r.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const summary = (
    <dl className="pb-sum">
      <div className="pb-row">
        <dt>Selected outcomes</dt>
        <dd>
          {selected.length || custom ? (
            <ul className="pb-picked">
              {selected.map((o) => <li key={o.id}><span className="of-ck"><Check /></span>{o.short}</li>)}
              {custom && <li><span className="of-ck"><Check /></span>Custom requirement</li>}
            </ul>
          ) : <span className="pb-empty">Pick at least one outcome</span>}
        </dd>
      </div>
      <div className="pb-row pb-inv" key={`${sum.oneTime}-${model}-${picked.size}`}>
        <dt>Investment</dt>
        <dd>
          {sum.oneTime > 0 && <p><b>{usd(sum.oneTime)}</b><span>one-time build</span></p>}
          {sum.monthly && <p><b>{sum.monthly.value}</b><span>{sum.monthly.note}</span></p>}
          {picked.has('global') && <p><b>Custom</b><span>global expansion, scoped per country</span></p>}
          {!sum.oneTime && !sum.monthly && !picked.has('global') && <p><b>—</b></p>}
        </dd>
      </div>
      {sum.firstPhase > 0 && (
        <div className="pb-row pb-total">
          <dt>First 4 months, est.</dt>
          <dd><b>{usd(sum.firstPhase)}</b><span>excl. ad spend &amp; software</span></dd>
        </div>
      )}
      <div className="pb-row">
        <dt>Expected timeline</dt>
        <dd><b>{sum.timeline}</b>{sum.timelineNote && <span>{sum.timelineNote}</span>}</dd>
      </div>
      <div className="pb-row">
        <dt>Commercial model</dt>
        <dd><b>{commercial}</b></dd>
      </div>
      <div className="pb-row">
        <dt>Potential ROI</dt>
        <dd>
          {selected.length ? (
            <ul className="pb-roi">
              {selected.map((o) => <li key={o.id}><b>{o.id === 'channel' ? '$200K/mo' : o.roi.value}</b><span>{o.id === 'enquiries' ? '80–100 qualified enquiries/mo' : o.id === 'automation' ? 'hours of capacity recovered/yr' : o.id === 'channel' ? 'target direct sales ($2.4M/yr)' : 'and a larger addressable market'}</span></li>)}
            </ul>
          ) : <span className="pb-empty">—</span>}
        </dd>
      </div>
      {custom && (
        <div className="pb-row">
          <dt>Custom requirements</dt>
          <dd><span className="pb-custom">{custom}</span></dd>
        </div>
      )}
    </dl>
  );

  if (status === 'sent') {
    return (
      <div className="pb pb-done glass">
        <div className="in">
          <div className="pay-orb" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></div>
          <h3 className="h3" tabIndex={-1} ref={(el) => el?.focus()}>Your plan is with WeframeTech</h3>
          <p>Thanks, {name.split(' ')[0]}. We&apos;ll review your selection and come back to <b>{email}</b> with the detailed scope, the numbers modelled for {proposal.company}, and a time to walk through it.</p>
          <div className="pb-done-sum">{summary}</div>
          <div className="pb-done-cta">
            {bookingUrl && <a className="btn" href={bookingUrl} target="_blank" rel="noopener">Book a call now <Arrow /></a>}
            <button type="button" className="back" onClick={() => setStatus('idle')}>Edit my plan</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="pb glass" onSubmit={submit} noValidate>
      <div className="in">
        <div className="pb-main">
          <fieldset className="pb-step">
            <legend><span className="pb-n">1</span>Choose your outcomes</legend>
            <p className="pb-help">Everything we recommend is ticked. Remove what you don&apos;t need; the pricing updates as you go.</p>
            <div className="pb-opts">
              {OUTCOMES.map((o) => {
                const on = picked.has(o.id);
                const price = priceOf(o.id, p);
                return (
                  <div key={o.id} className={`pb-opt${on ? ' on' : ''}`}>
                    <label>
                      <input type="checkbox" checked={on} onChange={() => toggle(o.id)} aria-invalid={tried && errs.plan ? 'true' : undefined} />
                      <span className="pb-box" aria-hidden="true"><Check /></span>
                      <span className="pb-txt">
                        <small>Outcome {o.n}</small>
                        <b>{o.short}</b>
                        <span>{o.timeline}</span>
                      </span>
                      <span className="pb-price"><b>{price.value}</b><span>{o.id === 'enquiries' ? '+ ad spend' : o.id === 'global' ? 'scoped per country' : 'one-time'}</span></span>
                    </label>
                    {o.id === 'enquiries' && on && (
                      <div className="pb-models" role="radiogroup" aria-label="Commercial model for enquiries">
                        {MODELS.map((m) => (
                          <button key={m.id} type="button" role="radio" aria-checked={model === m.id} className="ans" onClick={() => setModel(m.id)}>
                            <span><b>{m.label}</b><small>{m.id === 'retainer' ? `${usd(p.enquiries.monthly)}/mo + ads` : m.id === 'per-enquiry' ? `${usd(p.enquiries.perEnquiry)} per enquiry` : m.hint}</small></span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className={`pb-opt pb-other${otherOn ? ' on' : ''}`}>
                <label>
                  <input type="checkbox" checked={otherOn} onChange={() => setOtherOn((v) => !v)} />
                  <span className="pb-box" aria-hidden="true"><Check /></span>
                  <span className="pb-txt"><small>Add your own</small><b>Something else we need…</b><span>Describe it and we&apos;ll scope it in</span></span>
                </label>
                {otherOn && (
                  <textarea className="pb-area" rows={3} maxLength={800} autoFocus value={other} onChange={(e) => setOther(e.target.value)} placeholder="e.g. A dealer app for our 120 distributors, ERP integration, a new product launch…" aria-label="Describe your requirement" />
                )}
              </div>
            </div>
            {tried && errs.plan && <p className="pb-err" role="alert">Pick at least one outcome, or describe what you need.</p>}
          </fieldset>

          <fieldset className="pb-step">
            <legend><span className="pb-n">2</span>Where should we send the detailed scope?</legend>
            <div className="fields">
              <div className={`field${tried && errs.name ? ' bad' : ''}`}>
                <label htmlFor="pb-name">Your name</label>
                <input id="pb-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={tried && errs.name ? 'true' : undefined} />
                <span className="err">Please enter your name</span>
              </div>
              <div className={`field${tried && errs.email ? ' bad' : ''}`}>
                <label htmlFor="pb-email">Work email</label>
                <input id="pb-email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" aria-invalid={tried && errs.email ? 'true' : undefined} />
                <span className="err">Please enter a valid email</span>
              </div>
              <div className="field full">
                <label htmlFor="pb-phone">Phone / WhatsApp <span className="pb-opt-l">(optional)</span></label>
                <input id="pb-phone" type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
            </div>
          </fieldset>
        </div>

        <aside className="pb-rail" aria-label="Your plan summary">
          <div className="pb-stick" aria-live="polite">
          <span className="ap-kicker">Your plan for {proposal.company}</span>
          {summary}
          <div className="pb-submit">
            <button className="btn block" type="submit" aria-busy={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : <>Send my plan to WeframeTech <Arrow /></>}
            </button>
            {status === 'error' && <p className="pb-err on-dark" role="alert">Couldn&apos;t send just now. Please try again in a moment.</p>}
            <small>No commitment. We reply with a detailed scope and the numbers modelled for your business.</small>
          </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
