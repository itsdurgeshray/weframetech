import type { OtpProvider, SendResult, VerifyResult } from '../types';

/**
 * Twilio Verify (https://www.twilio.com/docs/verify/api).
 * Env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID
 */
function config() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const service = process.env.TWILIO_VERIFY_SERVICE_SID;
  return sid && token && service ? { sid, token, service } : null;
}

async function call(path: string, params: Record<string, string>) {
  const c = config();
  if (!c) return null;
  const res = await fetch(`https://verify.twilio.com/v2/Services/${c.service}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${c.sid}:${c.token}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params),
    cache: 'no-store',
  });
  const data = (await res.json().catch(() => ({}))) as { status?: string };
  return { status: res.status, ok: res.ok, data };
}

export const twilioProvider: OtpProvider = {
  name: 'twilio',

  async send(phone): Promise<SendResult> {
    try {
      const r = await call('Verifications', { To: phone, Channel: 'sms' });
      if (!r) return { ok: false, error: 'not_configured' };
      if (r.status === 429) return { ok: false, error: 'rate_limited' };
      return r.ok ? { ok: true } : { ok: false, error: 'provider_error' };
    } catch {
      return { ok: false, error: 'provider_error' };
    }
  },

  async verify(phone, code): Promise<VerifyResult> {
    try {
      const r = await call('VerificationCheck', { To: phone, Code: code });
      if (!r) return { ok: false, error: 'not_configured' };
      if (r.status === 429) return { ok: false, error: 'rate_limited' };
      if (r.status === 404) return { ok: true, verified: false }; // expired or already used
      if (!r.ok) return { ok: false, error: 'provider_error' };
      return { ok: true, verified: r.data.status === 'approved' };
    } catch {
      return { ok: false, error: 'provider_error' };
    }
  },
};
