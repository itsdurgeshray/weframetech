import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Short-lived proof that a phone number passed OTP verification.
 * /api/otp/verify issues it; /api/lead only accepts leads that carry a valid one,
 * so a lead can't claim a verified phone without going through the code step.
 */
const TTL_MS = 30 * 60 * 1000;

function secret() {
  const s = process.env.OTP_TOKEN_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === 'production') console.warn('[otp] OTP_TOKEN_SECRET is not set; using an insecure fallback.');
  return 'insecure-dev-only-secret';
}

const b64 = (s: string) => Buffer.from(s).toString('base64url');
const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');

export function signVerification(phone: string): string {
  const payload = b64(JSON.stringify({ phone, exp: Date.now() + TTL_MS }));
  return `${payload}.${sign(payload)}`;
}

/** Returns the verified phone if the token is genuine and unexpired, otherwise null. */
export function readVerification(token: unknown): string | null {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  const expected = sign(payload);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const { phone, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { phone: string; exp: number };
    return Date.now() < exp ? phone : null;
  } catch {
    return null;
  }
}
