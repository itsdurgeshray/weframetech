'use client';

import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react';
import { getOffer, DEFAULT_OFFER } from '@/lib/offers';
import type { Answers, DetailField, MultiQuestion, Option, Question } from '@/lib/offers/types';
import { COUNTRY_CODES, isValidPhone, toE164 } from '@/lib/phone';
import { site } from '@/lib/site';
import { inr } from '@/lib/offers/consult';
import { ConsultStrip, TrustStrip } from '@/components/consult/Consult';

const BackIcon = () => <svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>;
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
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

  // verify step
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpErr, setOtpErr] = useState('');
  const [verifyLabel, setVerifyLabel] = useState('Verify and submit');
  const [sentTo, setSentTo] = useState('');
  const [sentLabel, setSentLabel] = useState('your phone');
  const [demoCode, setDemoCode] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const [resending, setResending] = useState(false);
  const verifying = useRef(false);

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
    if (cur === 'verify') setTimeout(() => digitRefs.current[0]?.focus({ preventScroll: true }), 60);
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

  /* form height for the sticky offset on desktop (a tall step sticks by its bottom edge) */
  useEffect(() => {
    const form = formRef.current;
    if (!form || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => form.style.setProperty('--fh', `${form.offsetHeight}px`));
    ro.observe(form);
    return () => ro.disconnect();
  }, []);

  /* ---------- resend countdown ---------- */
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  /* ---------- OTP ---------- */
  const sendCode = async (resend = false) => {
    const e164 = toE164(cc, phone);
    const r = await post('/api/otp/send', { phone: e164, resend });
    if (!r.ok) throw new Error(r.status === 429 ? 'Too many attempts. Please try again in a few minutes.' : 'We could not send the code. Check the number and try again.');
    const data = (await r.json()) as { demo?: boolean; demoCode?: string };
    setSentTo(e164);
    setSentLabel(`${cc} ${phone.trim()}`);
    setDemoCode(data.demo ? data.demoCode || '123456' : '');
    setDigits(['', '', '', '', '', '']);
    setOtpErr('');
    setResendIn(site.otpResendSeconds);
  };

  const toVerify = async () => {
    const e: Errors = {
      name: name.trim().length < 2,
      company: has('company') && company.trim().length < 2,
      phone: isValidPhone(cc, phone) ? undefined : 'Please enter a valid phone number.',
      email: !EMAIL.test(email.trim()),
      website: has('website') && website.trim() !== '' && !URL_LIKE.test(website.trim()),
      pref: has('contactPref') && !pref,
    };
    setErrors(e);
    const form = formRef.current!;
    const firstBad = (['name', 'company', 'phone', 'email', 'website'] as const).find((k) => e[k]);
    if (firstBad) return form.querySelector<HTMLElement>(`#f-${firstBad}`)?.focus();
    if (e.pref) return form.querySelector<HTMLElement>('#pref-field .ans')?.focus();
    setSending(true);
    try {
      await sendCode();
      go('verify');
    } catch (err) {
      setErrors({ phone: (err as Error).message });
    } finally {
      setSending(false);
    }
  };

  const finish = async (token: string) => {
    setVerifyLabel('Submitting...');
    const lead = {
      offer: offer.slug, answers,
      name, email,
      ...(has('company') ? { company } : {}),
      ...(has('website') ? { website } : {}),
      ...(has('contactPref') ? { contact_pref: pref } : {}),
    };
    try { await post('/api/lead', { lead, token }); } catch { /* the thank-you page still loads */ }
    try {
      sessionStorage.setItem('wft_lead', JSON.stringify({ name, email, labels: Q.summary.flatMap((k) => labels[k] ?? []) }));
    } catch { /* storage blocked: thank-you page falls back to generic copy */ }
    location.href = offer.thankYouPath;
  };

  const verifyCode = async (code = digits.join('')) => {
    if (verifying.current) return;
    setOtpErr('');
    if (code.length < 6) { setOtpErr('Enter all 6 digits.'); digitRefs.current[code.length]?.focus(); return; }
    verifying.current = true;
    setVerifyLabel('Verifying...');
    try {
      const r = await post('/api/otp/verify', { phone: sentTo, code });
      if (!r.ok) throw new Error(r.status === 429 ? 'Too many attempts. Please request a new code shortly.' : 'We could not verify the code. Please try again.');
      const data = (await r.json()) as { verified: boolean; token?: string };
      if (!data.verified || !data.token) {
        setOtpErr("That code doesn't match. Check the SMS and try again.");
        setDigits(['', '', '', '', '', '']);
        digitRefs.current[0]?.focus();
        setVerifyLabel('Verify and submit');
        verifying.current = false;
        return;
      }
      await finish(data.token);
    } catch (err) {
      setOtpErr((err as Error).message);
      setVerifyLabel('Verify and submit');
      verifying.current = false;
    }
  };

  const resend = async () => {
    setResending(true);
    try { await sendCode(true); digitRefs.current[0]?.focus(); }
    catch (err) { setOtpErr((err as Error).message); }
    finally { setResending(false); }
  };

  const changeNumber = () => {
    setResendIn(0);
    back();
    setTimeout(() => { const el = formRef.current?.querySelector<HTMLInputElement>('#f-phone'); el?.focus(); el?.select(); }, 30);
  };

  /* ---------- six code boxes ---------- */
  const setCode = (next: string[], focusAt: number) => {
    setDigits(next);
    setOtpErr('');
    digitRefs.current[Math.min(focusAt, 5)]?.focus();
    if (next.every(Boolean)) verifyCode(next.join(''));
  };
  const fillFrom = (k: number, str: string) => {
    const chars = str.replace(/\D/g, '').slice(0, 6 - k).split('');
    const next = [...digits];
    chars.forEach((c, n) => { next[k + n] = c; });
    setCode(next, k + chars.length);
  };
  const onDigit = (k: number, raw: string) => {
    const v = raw.replace(/\D/g, '');
    if (v.length > 1) return fillFrom(k, v);
    const next = [...digits];
    next[k] = v;
    setCode(next, v ? k + 1 : k);
  };
  const onDigitKey = (k: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[k] && k > 0) {
      e.preventDefault();
      const next = [...digits]; next[k - 1] = '';
      setDigits(next); digitRefs.current[k - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && k > 0) digitRefs.current[k - 1]?.focus();
    else if (e.key === 'ArrowRight' && k < 5) digitRefs.current[k + 1]?.focus();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (cur === 'contact') toVerify();
    else if (cur === 'verify') verifyCode();
  };

  const order = (['name', 'company', 'phone', 'email', 'website'] as const).filter((f) => has(f));
  const nextOnEnter = (f: string) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const i = order.indexOf(f as (typeof order)[number]);
    if (i >= 0 && i < order.length - 1) { e.preventDefault(); formRef.current?.querySelector<HTMLElement>(`#f-${order[i + 1]}`)?.focus(); }
  };

  /* ---------- render ---------- */
  const filled = cur === 'no' || cur === 'contact' || cur === 'verify' ? totalBars : Q.questions.find((q) => q.id === cur)?.bar ?? 1;

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
    <form className="form glass rv d1" id="qform" noValidate aria-label="See if you qualify" ref={formRef} onSubmit={onSubmit}>
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
          <ConsultStrip consult={offer.consult} />
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
              {sending ? 'Sending code...' : <>Continue to booking <ArrowIcon /></>}
            </button>
            <button type="button" className="back" data-back="" onClick={back}><BackIcon />Back</button>
          </div>
          <p className="form-fine">We&apos;ll text a 6-digit code to verify your number, then you pick a time for your {inr(offer.consult.price)} session. Your details are only used for this application.</p>
        </div>

        {/* Verify phone by OTP */}
        <div role="group" className={`step${cur === 'verify' ? ' cur' : ''}`} data-step="verify" data-bar={totalBars}>
          <div className="step-head">
            <span className="count">One last check</span>
            <h3 tabIndex={-1}>Verify Your Number</h3>
            <p>Enter the 6-digit code sent to <b id="otp-to">{sentLabel}</b>. <button type="button" className="link" id="otp-change" onClick={changeNumber}>Change number</button></p>
          </div>
          <div className={`otp${otpErr ? ' bad' : ''}`} id="otp">
            <div className="otp-boxes" role="group" aria-label="6-digit verification code">
              {digits.map((d, k) => (
                <input key={k} className="otp-d" inputMode="numeric" autoComplete={k === 0 ? 'one-time-code' : 'off'} aria-label={`Digit ${k + 1} of 6`}
                  ref={(el) => { digitRefs.current[k] = el; }} value={d}
                  onChange={(e) => onDigit(k, e.target.value)} onKeyDown={(e) => onDigitKey(k, e)}
                  onPaste={(e: ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); fillFrom(k, e.clipboardData.getData('text')); }}
                  onFocus={(e) => e.target.select()} />
              ))}
            </div>
            <span className="err" id="otp-err" role="alert">{otpErr}</span>
            <p className="otp-resend">Didn&apos;t get it? <button type="button" className="link" id="otp-resend" disabled={resendIn > 0 || resending} onClick={resend}>
              {resending ? 'Sending...' : resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
            </button></p>
            <p className="otp-demo" id="otp-demo" hidden={!demoCode}>Demo mode: use code {demoCode || '123456'}</p>
          </div>
          <div className="step-foot">
            <button type="submit" className="btn" id="verify-btn" aria-busy={verifyLabel !== 'Verify and submit'}>{verifyLabel}</button>
            <button type="button" className="back" data-back="" onClick={back}><BackIcon />Back</button>
          </div>
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
