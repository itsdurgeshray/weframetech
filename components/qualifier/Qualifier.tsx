'use client';

import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react';
import { QUESTIONS, NOT_FIT, CONTACT_PREFS, SUMMARY_KEYS, TOTAL_BARS, isVariant, nextStep, type Answers, type Gate, type Option, type Step } from '@/lib/qualifier';
import { COUNTRY_CODES, isValidPhone, toE164 } from '@/lib/phone';
import { site } from '@/lib/site';

const BackIcon = () => <svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>;
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const post = (url: string, body: unknown) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

type Errors = { name?: boolean; email?: boolean; pref?: boolean; phone?: string };

export default function Qualifier() {
  const formRef = useRef<HTMLFormElement>(null);
  const [cur, setCur] = useState<string>('background');
  const history = useRef<string[]>(['background']);
  const [answers, setAnswers] = useState<Answers>({});
  const [labels, setLabels] = useState<Answers>({});
  const [gate, setGate] = useState<Gate>('background');
  const lock = useRef(false);
  const mounted = useRef(false);

  // details step
  const [name, setName] = useState('');
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
  const show = (id: string) => setCur(id);
  const go = (id: string) => { history.current.push(id); show(id); };
  const back = () => {
    history.current.pop();
    show(history.current[history.current.length - 1] ?? 'background');
  };

  // focus the new step's heading and keep the card in view
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

  /* ---------- questions ---------- */
  const answer = (step: string, opt: Option) => {
    if (lock.current) return;
    const nextA = { ...answers, [step]: opt.value };
    if (step === 'idea' && answers.idea !== opt.value) delete nextA.idea2; // follow-up depends on this answer
    setAnswers(nextA);
    setLabels((l) => ({ ...l, [step]: opt.label }));
    lock.current = true;
    setTimeout(() => {
      lock.current = false;
      const n = nextStep(step, nextA);
      if ('notFit' in n) { setGate(n.notFit); history.current.push('no'); show('no'); }
      else go(n.go);
    }, reduce() ? 0 : 280);
  };

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
      email: !EMAIL.test(email.trim()),
      pref: !pref,
      phone: isValidPhone(cc, phone) ? undefined : 'Please enter a valid phone number.',
    };
    setErrors(e);
    const form = formRef.current!;
    if (e.name) return form.querySelector<HTMLElement>('#f-name')?.focus();
    if (e.phone) return form.querySelector<HTMLElement>('#f-phone')?.focus();
    if (e.email) return form.querySelector<HTMLElement>('#f-email')?.focus();
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
      background: answers.background, income: answers.income, idea: answers.idea, idea_detail: answers.idea2,
      revenue_goal: answers.revenue, invest_ready: answers.invest, invest_level: answers.invest2, start: answers.start,
      name, email, contact_pref: pref,
    };
    try { await post('/api/lead', { lead, token }); } catch { /* the thank-you page still loads */ }
    try {
      sessionStorage.setItem('wft_lead', JSON.stringify({ name, email, labels: SUMMARY_KEYS.map((k) => labels[k]).filter(Boolean) }));
    } catch { /* storage blocked: thank-you page falls back to generic copy */ }
    location.href = '/thank-you';
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

  /* ---------- six code boxes: type, paste or SMS autofill into any box ---------- */
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

  /* ---------- submit (details CTA sends the code, verify CTA submits) ---------- */
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (cur === 'contact') toVerify();
    else if (cur === 'verify') verifyCode();
  };

  const nextOnEnter = (id: string) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); formRef.current?.querySelector<HTMLElement>(id)?.focus(); }
  };

  /* ---------- render ---------- */
  const barFor = () => {
    if (cur === 'no') return TOTAL_BARS;
    if (cur === 'contact' || cur === 'verify') return TOTAL_BARS;
    return QUESTIONS.find((q) => q.id === cur)?.bar ?? 1;
  };
  const filled = barFor();

  const opts = (step: string, options: Option[]) => (
    <div className="opts stack" role="group">
      {options.map((o) => (
        <button key={o.value} type="button" className="ans" data-name={step} data-value={o.value}
          aria-pressed={answers[step] === o.value ? 'true' : 'false'} onClick={() => answer(step, o)}>
          {o.label}
        </button>
      ))}
    </div>
  );

  const renderStep = (s: Step) => {
    const cls = `step${cur === s.id ? ' cur' : ''}`;
    if (isVariant(s)) {
      return (
        <div key={s.id} role="group" className={cls} data-step={s.id} data-bar={s.bar}>
          {Object.entries(s.variants).map(([key, v]) => (
            <div key={key} className={`variant${answers[s.dependsOn] === key ? ' cur' : ''}`} data-for={key}>
              <div className="step-head">
                <span className="count">{s.count}</span>
                <h3 tabIndex={-1}>{v.title}</h3>
                {v.help && <p>{v.help}</p>}
              </div>
              <div style={{ marginTop: '28px' }}>{opts(s.id, v.options)}</div>
            </div>
          ))}
          <div className="step-foot"><button type="button" className="back" data-back="" onClick={back}><BackIcon />Back</button></div>
        </div>
      );
    }
    return (
      <div key={s.id} role="group" className={cls} data-step={s.id} data-bar={s.bar}>
        <div className="step-head">
          <span className="count">{s.count}</span>
          <h3 tabIndex={-1}>{s.title}</h3>
          {s.help && <p>{s.help}</p>}
        </div>
        {opts(s.id, s.options)}
        {s.back !== false && <div className="step-foot"><button type="button" className="back" data-back="" onClick={back}><BackIcon />Back</button></div>}
      </div>
    );
  };

  const nf = NOT_FIT[gate];

  return (
    <form className="form glass rv d1" id="qform" noValidate aria-label="See if you qualify" ref={formRef} onSubmit={onSubmit}>
      <div className="in">
        <div className="prog" aria-hidden="true">
          {Array.from({ length: TOTAL_BARS }, (_, k) => <i key={k} className={k < filled ? 'on' : undefined}></i>)}
        </div>

        {QUESTIONS.map(renderStep)}

        {/* Final step: details (qualified) */}
        <div role="group" className={`step${cur === 'contact' ? ' cur' : ''}`} data-step="contact" data-bar="7">
          <div className="step-head">
            <span className="count">Final step</span>
            <h3 tabIndex={-1}>You May Be A Good Fit</h3>
            <p>Based on your answers, you appear to fit the profile of the healthcare professionals we partner with. Leave your details below and our team will review your information before reaching out.</p>
          </div>
          <div className="fields">
            <div className={`field full${errors.name ? ' bad' : ''}`}>
              <label htmlFor="f-name">Name</label>
              <input id="f-name" name="name" autoComplete="name" autoCapitalize="words" enterKeyHint="next" placeholder="Enter your name" required
                value={name} onChange={(e) => { setName(e.target.value); setErrors((x) => ({ ...x, name: false })); }} onKeyDown={nextOnEnter('#f-phone')} />
              <span className="err">Please add your name.</span>
            </div>
            <div className={`field full phone-field${errors.phone ? ' bad' : ''}`} id="phone-field">
              <label htmlFor="f-phone">Phone Number</label>
              <div className="phone">
                <select id="f-cc" name="cc" aria-label="Country code" value={cc} onChange={(e) => setCc(e.target.value)}>
                  {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code} aria-label={`${c.name} ${c.code}`}>{c.code}</option>)}
                </select>
                <span className="sep" aria-hidden="true"></span>
                <input id="f-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" enterKeyHint="next" placeholder="Enter your phone number" required
                  value={phone} onChange={(e) => { setPhone(e.target.value); setErrors((x) => ({ ...x, phone: undefined })); }} onKeyDown={nextOnEnter('#f-email')} />
              </div>
              <span className="err" id="phone-err" role="alert">{errors.phone || 'Please enter a valid phone number.'}</span>
            </div>
            <div className={`field full${errors.email ? ' bad' : ''}`}>
              <label htmlFor="f-email">Email Address</label>
              <input id="f-email" name="email" type="email" inputMode="email" autoCapitalize="off" spellCheck="false" autoComplete="email" enterKeyHint="go" placeholder="Enter your email" required
                value={email} onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: false })); }} />
              <span className="err">Please use a valid email address.</span>
            </div>
            <div className={`field full pref-field${errors.pref ? ' bad' : ''}`} id="pref-field">
              <span className="lbl" id="pref-lbl">How would you prefer us to contact you?</span>
              <div className="opts" role="group" aria-labelledby="pref-lbl">
                {CONTACT_PREFS.map((o) => (
                  <button key={o.value} type="button" className="ans" data-name="contact_pref" data-value={o.value}
                    aria-pressed={pref === o.value ? 'true' : 'false'} onClick={() => { setPref(o.value); setErrors((x) => ({ ...x, pref: false })); }}>
                    {o.label}
                  </button>
                ))}
              </div>
              <span className="err">Please choose how we should contact you.</span>
            </div>
          </div>
          <div className="step-foot">
            <button type="submit" className="btn" id="send-btn" aria-busy={sending}>
              {sending ? 'Sending code...' : <>See if I qualify <ArrowIcon /></>}
            </button>
            <button type="button" className="back" data-back="" onClick={back}><BackIcon />Back</button>
          </div>
          <p className="form-fine">We&apos;ll text a 6-digit code to verify your number. Your details are only used for this application.</p>
        </div>

        {/* Verify phone by OTP */}
        <div role="group" className={`step${cur === 'verify' ? ' cur' : ''}`} data-step="verify" data-bar="7">
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
            <a className="btn" href="#how">Watch the 7-minute video</a>
            <button type="button" className="back" data-back="" onClick={back}><BackIcon />Change my answer</button>
          </div>
        </div>
      </div>
    </form>
  );
}
