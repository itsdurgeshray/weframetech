'use client';

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { getOffer, DEFAULT_OFFER } from '@/lib/offers';
import type { Answers, DetailField, MultiQuestion, Option, Question } from '@/lib/offers/types';
import { COUNTRY_CODES, isValidPhone, toE164 } from '@/lib/phone';
import { inr } from '@/lib/offers/consult';
import { NextStepNote, TrustStrip } from '@/components/consult/Consult';

const BackIcon = () => <svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>;
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_LIKE = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i;
const post = (url: string, body: unknown) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

const CONTACT_PREFS: Option[] = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'call', label: 'Phone Call' },
  { value: 'email', label: 'Email' },
];

/** What the form keeps in sessionStorage so "back" from Razorpay reopens the details step, filled in. */
type Saved = {
  answers: Answers; labels: Record<string, string[]>; multi: Record<string, string[]>;
  name: string; company: string; website: string; cc: string; phone: string; email: string; pref: string;
};

type Errors = { name?: boolean; company?: boolean; email?: boolean; website?: boolean; pref?: boolean; phone?: string };

/** The gated qualifier for any offer. Questions, gates and details fields come from lib/offers/<slug>. */
export default function Qualifier({ slug }: { slug: string }) {
  const offer = getOffer(slug) ?? DEFAULT_OFFER;
  const Q = offer.qualifier;
  const first = Q.questions[0].id;
  const totalBars = Math.max(...Q.questions.map((q) => q.bar)) + 1;
  const has = (f: DetailField) => Q.details.fields.includes(f);

  const formRef = useRef<HTMLFormElement>(null);
  const [cur, setCur] = useState<string>(first);
  const history = useRef<string[]>([first]);
  const [answers, setAnswers] = useState<Answers>({});
  const [labels, setLabels] = useState<Record<string, string[]>>({});
  const [gate, setGate] = useState<string>(Object.keys(Q.notFit)[0]);
  const lock = useRef(false);
  const mounted = useRef(false);

  // multi-select drafts (chips toggled before Continue)
  const [multi, setMulti] = useState<Record<string, string[]>>({});
  const [multiErr, setMultiErr] = useState('');

  // details step
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [cc, setCc] = useState('+91');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pref, setPref] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);

  // checkout handoff
  const [payUrl, setPayUrl] = useState('');
  const [payDemo, setPayDemo] = useState(false);
  const [payErr, setPayErr] = useState('');
  const [restored, setRestored] = useState(false);
  const formKey = `wft_form_${offer.slug}`;
  const checkoutKey = `wft_checkout_${offer.slug}`;
  const price = inr(offer.consult.price);

  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- navigation ---------- */
  const go = (id: string) => { history.current.push(id); setCur(id); };
  const back = () => {
    history.current.pop();
    setMultiErr('');
    setCur(history.current[history.current.length - 1] ?? first);
  };

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const form = formRef.current;
    if (!form) return;
    const el = form.querySelector('.step.cur, .result.cur');
    const h = el?.querySelector<HTMLElement>('.variant.cur h3, :scope > .step-head h3, :scope > h3');
    h?.focus({ preventScroll: true });
    const r = form.getBoundingClientRect();
    if (r.top < 0 || r.top > innerHeight * 0.4) form.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });
  }, [cur]);

  const advance = (step: string, nextA: Answers) => {
    const n = Q.next(step, nextA);
    if ('notFit' in n) { setGate(n.notFit); history.current.push('no'); setCur('no'); }
    else go(n.go);
  };

  /* ---------- single-answer questions auto-advance ---------- */
  const answer = (q: Question, opt: Option) => {
    if (lock.current) return;
    const nextA = { ...answers, [q.id]: opt.value };
    // a follow-up keyed on this answer must be re-asked
    Q.questions.forEach((x) => { if (x.kind === 'variant' && x.dependsOn === q.id && answers[q.id] !== opt.value) delete nextA[x.id]; });
    setAnswers(nextA);
    setLabels((l) => ({ ...l, [q.id]: [opt.label] }));
    lock.current = true;
    setTimeout(() => { lock.current = false; advance(q.id, nextA); }, reduce() ? 0 : 280);
  };

  /* ---------- multi-select questions ---------- */
  const toggle = (q: MultiQuestion, value: string) => {
    setMultiErr('');
    setMulti((m) => {
      const picked = m[q.id] ?? [];
      if (picked.includes(value)) return { ...m, [q.id]: picked.filter((v) => v !== value) };
      if (q.max && picked.length >= q.max) { setMultiErr(`You can pick up to ${q.max}. Unselect one to change it.`); return m; }
      return { ...m, [q.id]: [...picked, value] };
    });
  };
  const continueMulti = (q: MultiQuestion) => {
    const picked = multi[q.id] ?? [];
    if (!picked.length) { setMultiErr('Select at least one option to continue.'); return; }
    const nextA = { ...answers, [q.id]: picked.join('|') };
    setAnswers(nextA);
    setLabels((l) => ({ ...l, [q.id]: q.options.filter((o) => picked.includes(o.value)).map((o) => o.label) }));
    advance(q.id, nextA);
  };

  /* the "how it works" rail beside the form highlights the current step */
  useEffect(() => {
    const phase = cur === 'no' ? 'no' : cur === 'contact' || cur === 'pay' ? 'details' : 'questions';
    document.getElementById('apply')?.setAttribute('data-phase', phase);
  }, [cur]);

  /* ---------- back from Razorpay without paying: reopen the details step with everything kept ---------- */
  const reopenDetails = () => {
    history.current = [first, 'contact'];
    setSending(false);
    setRestored(true);
    setCur('contact');
  };
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(formKey) || 'null') as Saved | null;
      if (saved) {
        setAnswers(saved.answers); setLabels(saved.labels); setMulti(saved.multi);
        setName(saved.name); setCompany(saved.company); setWebsite(saved.website);
        setCc(saved.cc); setPhone(saved.phone); setEmail(saved.email); setPref(saved.pref);
        reopenDetails();
        // land on the form, after the browser's own scroll restoration
        setTimeout(() => document.getElementById('qform')?.scrollIntoView({ block: 'start' }), 350);
      }
    } catch { /* storage blocked: start fresh */ }
    // page restored from the back/forward cache while showing the redirect screen
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) reopenDetails(); };
    addEventListener('pageshow', onShow);
    return () => removeEventListener('pageshow', onShow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- checkout: save the lead, then hand over to Razorpay ---------- */
  const toCheckout = async () => {
    const e: Errors = {
      name: name.trim().length < 2,
      company: has('company') && company.trim().length < 2,
      phone: isValidPhone(cc, phone) ? undefined : 'Please enter a valid phone number.',
      email: !EMAIL.test(email.trim()),
      website: has('website') && website.trim() !== '' && !URL_LIKE.test(website.trim()),
      pref: has('contactPref') && !pref,
    };
    setErrors(e);
    setPayErr('');
    const form = formRef.current!;
    const firstBad = (['name', 'company', 'phone', 'email', 'website'] as const).find((k) => e[k]);
    if (firstBad) return form.querySelector<HTMLElement>(`#f-${firstBad}`)?.focus();
    if (e.pref) return form.querySelector<HTMLElement>('#pref-field .ans')?.focus();

    setSending(true);
    const lead = {
      offer: offer.slug, answers,
      name: name.trim(), email: email.trim(), phone: toE164(cc, phone),
      ...(has('company') ? { company } : {}),
      ...(has('website') ? { website } : {}),
      ...(has('contactPref') ? { contact_pref: pref } : {}),
    };
    try {
      const r = await post('/api/checkout', { lead });
      if (!r.ok) throw new Error(r.status === 429 ? 'Too many attempts. Please try again in a few minutes.' : 'We could not open the payment page. Please try again in a moment.');
      const data = (await r.json()) as { url: string; demo: boolean; leadId: string };
      try {
        const saved: Saved = { answers, labels, multi, name, company, website, cc, phone, email, pref };
        sessionStorage.setItem(formKey, JSON.stringify(saved));
        sessionStorage.setItem(checkoutKey, JSON.stringify({ url: data.url, leadId: data.leadId, name: lead.name, email: lead.email, demo: data.demo }));
      } catch { /* storage blocked: the redirect still works */ }
      setPayUrl(data.url);
      setPayDemo(data.demo);
      go('pay');
      setTimeout(() => { location.href = data.url; }, reduce() ? 300 : 1400);
    } catch (err) {
      setPayErr((err as Error).message);
      setSending(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (cur === 'contact') toCheckout();
  };

  const order = (['name', 'company', 'phone', 'email', 'website'] as const).filter((f) => has(f));
  const nextOnEnter = (f: string) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const i = order.indexOf(f as (typeof order)[number]);
    if (i >= 0 && i < order.length - 1) { e.preventDefault(); formRef.current?.querySelector<HTMLElement>(`#f-${order[i + 1]}`)?.focus(); }
  };

  /* ---------- render ---------- */
  const filled = cur === 'no' || cur === 'contact' || cur === 'pay' ? totalBars : Q.questions.find((q) => q.id === cur)?.bar ?? 1;

  const singleOpts = (q: Question, options: Option[]) => (
    <div className="opts stack" role="group">
      {options.map((o) => (
        <button key={o.value} type="button" className="ans" data-name={q.id} data-value={o.value}
          aria-pressed={answers[q.id] === o.value ? 'true' : 'false'} onClick={() => answer(q, o)}>
          {o.label}
        </button>
      ))}
    </div>
  );

  const backBtn = <div className="step-foot"><button type="button" className="back" data-back="" onClick={back}><BackIcon />Back</button></div>;

  const renderStep = (q: Question) => {
    const cls = `step${cur === q.id ? ' cur' : ''}`;
    if (q.kind === 'variant') {
      return (
        <div key={q.id} role="group" className={cls} data-step={q.id} data-bar={q.bar}>
          {Object.entries(q.variants).map(([key, v]) => (
            <div key={key} className={`variant${answers[q.dependsOn] === key ? ' cur' : ''}`} data-for={key}>
              <div className="step-head">
                <span className="count">{q.count}</span>
                <h3 tabIndex={-1}>{v.title}</h3>
                {v.help && <p>{v.help}</p>}
              </div>
              <div style={{ marginTop: '28px' }}>{singleOpts(q, v.options)}</div>
            </div>
          ))}
          {backBtn}
        </div>
      );
    }
    if (q.kind === 'multi') {
      const picked = multi[q.id] ?? [];
      return (
        <div key={q.id} role="group" className={`${cls} multi`} data-step={q.id} data-bar={q.bar}>
          <div className="step-head">
            <span className="count">{q.count}</span>
            <h3 tabIndex={-1}>{q.title}</h3>
            {q.help && <p>{q.help}{q.max ? <span className="pick-count"> {picked.length}/{q.max} selected</span> : picked.length ? <span className="pick-count"> {picked.length} selected</span> : null}</p>}
          </div>
          <div className="opts chips" role="group" aria-label={q.title}>
            {q.options.map((o) => {
              const on = picked.includes(o.value);
              return (
                <button key={o.value} type="button" className="ans" data-name={q.id} data-value={o.value} aria-pressed={on ? 'true' : 'false'}
                  disabled={!on && !!q.max && picked.length >= q.max} onClick={() => toggle(q, o.value)}>
                  {o.label}
                </button>
              );
            })}
          </div>
          <span className="multi-err" role="alert">{cur === q.id ? multiErr : ''}</span>
          <div className="step-foot">
            <button type="button" className="btn" onClick={() => continueMulti(q)} disabled={!picked.length}>Continue <ArrowIcon /></button>
            {q.back !== false && <button type="button" className="back" data-back="" onClick={back}><BackIcon />Back</button>}
          </div>
        </div>
      );
    }
    return (
      <div key={q.id} role="group" className={cls} data-step={q.id} data-bar={q.bar}>
        <div className="step-head">
          <span className="count">{q.count}</span>
          <h3 tabIndex={-1}>{q.title}</h3>
          {q.help && <p>{q.help}</p>}
        </div>
        {singleOpts(q, q.options)}
        {q.back !== false && backBtn}
      </div>
    );
  };

  const nf = Q.notFit[gate] ?? Object.values(Q.notFit)[0];
  const clear = (k: keyof Errors) => setErrors((x) => ({ ...x, [k]: undefined }));

  return (
    <form className="form" id="qform" noValidate aria-label="See if you qualify" ref={formRef} onSubmit={onSubmit}>
      <div className="in">
        <div className="prog" aria-hidden="true">
          {Array.from({ length: totalBars }, (_, k) => <i key={k} className={k < filled ? 'on' : undefined}></i>)}
        </div>

        {Q.questions.map(renderStep)}

        {/* Final step: details (qualified) */}
        <div role="group" className={`step${cur === 'contact' ? ' cur' : ''}`} data-step="contact" data-bar={totalBars}>
          <div className="step-head">
            <span className="count">Final step</span>
            <h3 tabIndex={-1}>You May Be A Good Fit</h3>
            <p>{Q.details.intro}</p>
          </div>
          {restored && <p className="restored" role="status">Welcome back. Your answers are saved, so you can go straight to payment.</p>}
          <NextStepNote consult={offer.consult} />
          <div className="fields">
            <div className={`field full${errors.name ? ' bad' : ''}`}>
              <label htmlFor="f-name">Name</label>
              <input id="f-name" name="name" autoComplete="name" autoCapitalize="words" enterKeyHint="next" placeholder="Enter your name" required
                value={name} onChange={(e) => { setName(e.target.value); clear('name'); }} onKeyDown={nextOnEnter('name')} />
              <span className="err">Please add your name.</span>
            </div>
            {has('company') && (
              <div className={`field full${errors.company ? ' bad' : ''}`}>
                <label htmlFor="f-company">Company Name</label>
                <input id="f-company" name="company" autoComplete="organization" enterKeyHint="next" placeholder="Enter your company name" required
                  value={company} onChange={(e) => { setCompany(e.target.value); clear('company'); }} onKeyDown={nextOnEnter('company')} />
                <span className="err">Please add your company name.</span>
              </div>
            )}
            <div className={`field full phone-field${errors.phone ? ' bad' : ''}`} id="phone-field">
              <label htmlFor="f-phone">Phone Number</label>
              <div className="phone">
                <select id="f-cc" name="cc" aria-label="Country code" value={cc} onChange={(e) => setCc(e.target.value)}>
                  {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code} aria-label={`${c.name} ${c.code}`}>{c.code}</option>)}
                </select>
                <span className="sep" aria-hidden="true"></span>
                <input id="f-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" enterKeyHint="next" placeholder="Enter your phone number" required
                  value={phone} onChange={(e) => { setPhone(e.target.value); clear('phone'); }} onKeyDown={nextOnEnter('phone')} />
              </div>
              <span className="err" id="phone-err" role="alert">{errors.phone || 'Please enter a valid phone number.'}</span>
            </div>
            <div className={`field full${errors.email ? ' bad' : ''}`}>
              <label htmlFor="f-email">Email Address</label>
              <input id="f-email" name="email" type="email" inputMode="email" autoCapitalize="off" spellCheck="false" autoComplete="email" enterKeyHint={has('website') ? 'next' : 'go'} placeholder="Enter your email" required
                value={email} onChange={(e) => { setEmail(e.target.value); clear('email'); }} onKeyDown={nextOnEnter('email')} />
              <span className="err">Please use a valid email address.</span>
            </div>
            {has('website') && (
              <div className={`field full${errors.website ? ' bad' : ''}`}>
                <label htmlFor="f-website">Company Website</label>
                <input id="f-website" name="website" type="url" inputMode="url" autoCapitalize="off" spellCheck="false" autoComplete="url" enterKeyHint="go" placeholder="Enter your company website"
                  value={website} onChange={(e) => { setWebsite(e.target.value); clear('website'); }} />
                <span className="err">Please check the website address.</span>
              </div>
            )}
            {has('contactPref') && (
              <div className={`field full pref-field${errors.pref ? ' bad' : ''}`} id="pref-field">
                <span className="lbl" id="pref-lbl">How would you prefer us to contact you?</span>
                <div className="opts" role="group" aria-labelledby="pref-lbl">
                  {CONTACT_PREFS.map((o) => (
                    <button key={o.value} type="button" className="ans" data-name="contact_pref" data-value={o.value}
                      aria-pressed={pref === o.value ? 'true' : 'false'} onClick={() => { setPref(o.value); clear('pref'); }}>
                      {o.label}
                    </button>
                  ))}
                </div>
                <span className="err">Please choose how we should contact you.</span>
              </div>
            )}
          </div>
          <div className="step-foot">
            <button type="submit" className="btn" id="send-btn" aria-busy={sending}>
              {sending ? 'Opening secure checkout...' : <><LockIcon />Continue to secure payment · {price}</>}
            </button>
            <button type="button" className="back" data-back="" onClick={back}><BackIcon />Back</button>
          </div>
          <span className="err pay-err" role="alert">{payErr}</span>
          <p className="form-fine">Secure payment on Razorpay: UPI, cards or netbanking. Right after paying, you pick your time.</p>
        </div>

        {/* Handing over to Razorpay */}
        <div className={`result pay${cur === 'pay' ? ' cur' : ''}`} data-result="pay" role="status" aria-live="polite">
          <span className="pay-orb" aria-hidden="true"><LockIcon /></span>
          <h3 tabIndex={-1}>Taking You To Secure Checkout</h3>
          <p><b>{price}</b> · {offer.consult.name}, 30 minutes with our CEO</p>
          <ol className="pay-steps">
            <li><b>Pay on Razorpay</b><span>UPI, cards or netbanking. Your details are already filled in.</span></li>
            <li><b>Come straight back here</b><span>and pick a time that suits you.</span></li>
          </ol>
          {payDemo && <p className="otp-demo">Demo mode: no real payment is taken.</p>}
          <a className="pay-fallback" href={payUrl || '#'}>Not moving? Continue to payment</a>
        </div>

        {/* Not a fit (text per gate) */}
        <div className={`result${cur === 'no' ? ' cur' : ''}`} data-result="no" role="status" aria-live="polite">
          <h3 tabIndex={-1} data-nf-title="">{nf.title}</h3>
          <p data-nf-text="">{nf.text}</p>
          <div className="step-foot" style={{ marginTop: '8px' }}>
            <a className="btn" href="#how">{Q.notFitCta ?? 'Watch the video'}</a>
            <button type="button" className="back" data-back="" onClick={back}><BackIcon />Change my answer</button>
          </div>
        </div>

        <TrustStrip quote={cur === 'contact'} />
      </div>
    </form>
  );
}
