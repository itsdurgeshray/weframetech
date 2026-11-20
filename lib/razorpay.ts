import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Razorpay Payment Links (hosted payment page). Docs: https://razorpay.com/docs/api/payments/payment-links/
 * Needs RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET; RAZORPAY_WEBHOOK_SECRET for /api/razorpay/webhook.
 * Without keys the funnel runs in demo mode (no real payment).
 */
const API = 'https://api.razorpay.com/v1';
const keyId = () => process.env.RAZORPAY_KEY_ID ?? '';
const keySecret = () => process.env.RAZORPAY_KEY_SECRET ?? '';

export const razorpayConfigured = () => Boolean(keyId() && keySecret());

const auth = () => `Basic ${Buffer.from(`${keyId()}:${keySecret()}`).toString('base64')}`;

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export type PaymentLink = {
  id: string;
  short_url: string;
  status: 'created' | 'partially_paid' | 'paid' | 'cancelled' | 'expired';
  amount: number;          // paise
  amount_paid: number;
  reference_id: string;
  customer?: { name?: string; email?: string; contact?: string };
};

export async function createPaymentLink(input: {
  amountInr: number;
  referenceId: string;
  description: string;
  customer: { name: string; email: string; contact: string };
  notes: Record<string, string>;
  callbackUrl: string;
}): Promise<PaymentLink> {
  const res = await fetch(`${API}/payment_links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth() },
    cache: 'no-store',
    body: JSON.stringify({
      amount: Math.round(input.amountInr * 100),
      currency: 'INR',
      accept_partial: false,
      reference_id: input.referenceId,
      description: input.description.slice(0, 2048),
      customer: input.customer,
      notify: { sms: true, email: true },     // Razorpay also sends the link, useful if they drop off
      reminder_enable: true,
      expire_by: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
      notes: input.notes,
      callback_url: input.callbackUrl,
      callback_method: 'get',
    }),
  });
  if (!res.ok) throw new Error(`razorpay ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return (await res.json()) as PaymentLink;
}

export async function fetchPaymentLink(id: string): Promise<PaymentLink | null> {
  if (!/^plink_[\w]+$/.test(id)) return null;
  const res = await fetch(`${API}/payment_links/${id}`, { headers: { Authorization: auth() }, cache: 'no-store' });
  return res.ok ? ((await res.json()) as PaymentLink) : null;
}

/** Signature Razorpay appends to the callback URL after a payment-link payment. */
export function verifyCallback(p: { linkId: string; referenceId: string; status: string; paymentId: string; signature: string }) {
  const expected = createHmac('sha256', keySecret())
    .update(`${p.linkId}|${p.referenceId}|${p.status}|${p.paymentId}`)
    .digest('hex');
  return safeEqual(expected, p.signature);
}

/** X-Razorpay-Signature on webhooks: HMAC-SHA256 of the raw body with the webhook secret. */
export function verifyWebhook(rawBody: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  return safeEqual(createHmac('sha256', secret).update(rawBody).digest('hex'), signature);
}
