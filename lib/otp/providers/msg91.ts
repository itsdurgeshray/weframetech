import type { OtpProvider, SendResult, VerifyResult } from '../types';

/**
 * MSG91 OTP API v5 (https://docs.msg91.com/otp).
 * Ready but not enabled. To switch on: set OTP_PROVIDER=msg91 plus the env vars below.
 *
 * Env:
 *   MSG91_AUTH_KEY        Auth key from the MSG91 dashboard (API > Auth key)
 *   MSG91_TEMPLATE_ID     DLT-approved OTP template ID (required for Indian numbers)
 *   MSG91_OTP_EXPIRY      Minutes a code stays valid (optional, default 10)
 *   MSG91_OTP_LENGTH      Digits in the code (optional, default 6; the form expects 6)
 *
 * MSG91 takes the mobile number without "+" (country code + number, e.g. 919876543210).
 * Endpoints used:
 *   send    POST /api/v5/otp?template_id=&mobile=&otp_length=&otp_expiry=
 *   resend  GET  /api/v5/otp/retry?retrytype=text&mobile=
 *   verify  GET  /api/v5/otp/verify?otp=&mobile=
 * Each returns JSON { type: "success" | "error", message: string }.
 */
const BASE = 'https://control.msg91.com/api/v5/otp';

function config() {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;
  if (!authKey || !templateId) return null;
  return {
    authKey,
    templateId,
    expiry: process.env.MSG91_OTP_EXPIRY || '10',
    length: process.env.MSG91_OTP_LENGTH || '6',
  };
}

const mobile = (e164: string) => e164.replace(/^\+/, '');

type Msg91Response = { type?: 'success' | 'error'; message?: string };

async function call(url: string, method: 'GET' | 'POST', authKey: string) {
  const res = await fetch(url, {
    method,
    headers: { authkey: authKey, accept: 'application/json', 'content-type': 'application/json' },
    body: method === 'POST' ? '{}' : undefined,
    cache: 'no-store',
  });
  const data = (await res.json().catch(() => ({}))) as Msg91Response;
  return { status: res.status, data };
}

const rateLimited = (msg = '') => /limit|too many|attempt/i.test(msg);

export const msg91Provider: OtpProvider = {
  name: 'msg91',

  async send(phone, opts): Promise<SendResult> {
    const c = config();
    if (!c) return { ok: false, error: 'not_configured' };
    try {
      const q = new URLSearchParams({ mobile: mobile(phone) });
      let r;
      if (opts?.resend) {
        q.set('retrytype', 'text');
        r = await call(`${BASE}/retry?${q}`, 'GET', c.authKey);
      } else {
        q.set('template_id', c.templateId);
        q.set('otp_length', c.length);
        q.set('otp_expiry', c.expiry);
        r = await call(`${BASE}?${q}`, 'POST', c.authKey);
      }
      if (r.status === 429 || rateLimited(r.data.message)) return { ok: false, error: 'rate_limited' };
      return r.data.type === 'success' ? { ok: true } : { ok: false, error: 'provider_error' };
    } catch {
      return { ok: false, error: 'provider_error' };
    }
  },

  async verify(phone, code): Promise<VerifyResult> {
    const c = config();
    if (!c) return { ok: false, error: 'not_configured' };
    try {
      const q = new URLSearchParams({ otp: code, mobile: mobile(phone) });
      const r = await call(`${BASE}/verify?${q}`, 'GET', c.authKey);
      if (r.status === 429) return { ok: false, error: 'rate_limited' };
      if (r.data.type === 'success') return { ok: true, verified: true };
      // Wrong, expired or already-verified codes come back as type "error" with a message.
      if (r.data.type === 'error') return rateLimited(r.data.message) ? { ok: false, error: 'rate_limited' } : { ok: true, verified: false };
      return { ok: false, error: 'provider_error' };
    } catch {
      return { ok: false, error: 'provider_error' };
    }
  },
};
