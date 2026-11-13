import { readVerification } from '@/lib/otp';
import { OFFERS } from '@/lib/offers';

export const dynamic = 'force-dynamic';

const TEXT_FIELDS = ['name', 'email', 'company', 'website', 'contact_pref'] as const;
const clip = (v: unknown, n = 300) => (typeof v === 'string' ? v.slice(0, n) : undefined);

/**
 * POST { lead: { offer, answers, name, email, company?, website?, contact_pref? }, token }.
 * The token from /api/otp/verify proves the phone was verified. Verified leads are forwarded as JSON
 * to LEAD_WEBHOOK_URL (CRM, Zapier, Make, Sheets...) when set.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { lead?: Record<string, unknown>; token?: string };
  const phone = readVerification(body.token);
  if (!phone) return Response.json({ error: 'unverified' }, { status: 401 });

  const raw = body.lead ?? {};
  const offer = OFFERS.find((o) => o.slug === raw.offer)?.slug ?? 'unknown';
  const answers: Record<string, string> = {};
  if (raw.answers && typeof raw.answers === 'object') {
    for (const [k, v] of Object.entries(raw.answers as Record<string, unknown>).slice(0, 25)) {
      if (/^[\w-]{1,40}$/.test(k) && typeof v === 'string') answers[k] = v.slice(0, 600);
    }
  }
  const lead: Record<string, unknown> = { offer, phone, phone_verified: true, answers, source: 'wft-vsl', at: new Date().toISOString() };
  for (const k of TEXT_FIELDS) { const v = clip(raw[k]); if (v) lead[k] = v; }

  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) {
    try {
      const r = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead), cache: 'no-store' });
      if (!r.ok) console.error('[lead] webhook responded', r.status);
    } catch (err) {
      console.error('[lead] webhook failed', err);
    }
  }
  return Response.json({ ok: true });
}
