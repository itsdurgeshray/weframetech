import 'server-only';
import { OFFERS } from '@/lib/offers';
import { E164 } from '@/lib/phone';

const TEXT_FIELDS = ['name', 'email', 'company', 'website', 'contact_pref'] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clip = (v: unknown, n = 300) => (typeof v === 'string' ? v.trim().slice(0, n) : undefined);

export type Lead = {
  offer: string;
  name: string;
  email: string;
  phone: string;
  answers: Record<string, string>;
  company?: string;
  website?: string;
  contact_pref?: string;
};

/** Cleans a lead posted by the form. Returns null if the required fields are missing or malformed. */
export function readLead(raw: unknown): Lead | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const offer = OFFERS.find((o) => o.slug === r.offer)?.slug;
  const phone = clip(r.phone, 20);
  const fields: Record<string, string> = {};
  for (const k of TEXT_FIELDS) { const v = clip(r[k]); if (v) fields[k] = v; }
  if (!offer || !phone || !E164.test(phone) || !fields.name || fields.name.length < 2 || !fields.email || !EMAIL.test(fields.email)) return null;
  const answers: Record<string, string> = {};
  if (r.answers && typeof r.answers === 'object') {
    for (const [k, v] of Object.entries(r.answers as Record<string, unknown>).slice(0, 25)) {
      if (/^[\w-]{1,40}$/.test(k) && typeof v === 'string') answers[k] = v.slice(0, 600);
    }
  }
  return { offer, phone, answers, ...fields } as Lead;
}

/**
 * Sends a lead event as JSON to LEAD_WEBHOOK_URL (CRM, Zapier, Make, Sheets...).
 * Events: `lead.qualified` (form finished, not paid yet) and `payment.paid` (keyed by lead_id).
 * `payment.paid` can arrive twice (browser return + Razorpay webhook); dedupe on payment_id.
 */
export async function sendLeadEvent(event: Record<string, unknown> & { event: string; lead_id: string }) {
  const hook = process.env.LEAD_WEBHOOK_URL;
  const body = { ...event, source: 'wft-vsl', at: new Date().toISOString() };
  if (!hook) { console.info('[lead]', JSON.stringify(body)); return; }
  try {
    const r = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), cache: 'no-store' });
    if (!r.ok) console.error('[lead] webhook responded', r.status);
  } catch (err) {
    console.error('[lead] webhook failed', err);
  }
}
