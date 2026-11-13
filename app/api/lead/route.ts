import { readVerification } from '@/lib/otp';

export const dynamic = 'force-dynamic';

const FIELDS = [
  'background', 'income', 'idea', 'idea_detail', 'revenue_goal', 'invest_ready', 'invest_level', 'start',
  'name', 'email', 'contact_pref',
] as const;

/**
 * POST { lead, token }. The token from /api/otp/verify proves the phone was verified.
 * Forwards the lead as JSON to LEAD_WEBHOOK_URL (CRM, Zapier, Make, Sheets...) when set.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { lead?: Record<string, unknown>; token?: string };
  const phone = readVerification(body.token);
  if (!phone) return Response.json({ error: 'unverified' }, { status: 401 });

  const lead: Record<string, unknown> = { phone, phone_verified: true, source: 'wft-telehealth-vsl', at: new Date().toISOString() };
  for (const k of FIELDS) {
    const v = body.lead?.[k];
    if (typeof v === 'string') lead[k] = v.slice(0, 300);
  }

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
