import { randomUUID } from 'node:crypto';
import { getProposal } from '@/lib/proposals';
import { sendLeadEvent } from '@/lib/leads';

export const dynamic = 'force-dynamic';

const OUTCOME_IDS = new Set(['enquiries', 'automation', 'channel', 'global']);
const MODEL_IDS = new Set(['retainer', 'per-enquiry', 'performance']);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clip = (v: unknown, n = 200) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

const hits = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 6;
}

/**
 * POST from the "Build your own plan" section of /proposal/<slug>.
 * Sends `proposal.submitted` to LEAD_WEBHOOK_URL with the chosen outcomes, model and custom requirement.
 */
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (throttled(ip)) return Response.json({ error: 'rate_limited' }, { status: 429 });

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const proposal = getProposal(clip(b.slug, 80));
  const name = clip(b.name, 120);
  const email = clip(b.email, 200);
  const outcomes = Array.isArray(b.outcomes) ? b.outcomes.filter((o): o is string => typeof o === 'string' && OUTCOME_IDS.has(o)) : [];
  const custom = clip(b.custom, 800);
  const model = MODEL_IDS.has(clip(b.model, 20)) ? clip(b.model, 20) : undefined;
  if (!proposal || name.length < 2 || !EMAIL.test(email) || (!outcomes.length && !custom)) {
    return Response.json({ error: 'invalid_input' }, { status: 400 });
  }

  await sendLeadEvent({
    event: 'proposal.submitted',
    lead_id: `wft_${randomUUID().replace(/-/g, '').slice(0, 24)}`,
    proposal: proposal.slug,
    company: proposal.company,
    name,
    email,
    phone: clip(b.phone, 30) || undefined,
    outcomes,
    model,
    custom: custom || undefined,
  });
  return Response.json({ ok: true });
}
