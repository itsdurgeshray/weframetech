import { randomUUID } from 'node:crypto';
import { getOffer } from '@/lib/offers';
import { readLead, sendLeadEvent } from '@/lib/leads';
import { createPaymentLink, razorpayConfigured } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

/* light per-IP throttle: payment links are real objects in the Razorpay account */
const hits = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

/**
 * POST { lead } from the form's final step.
 * 1. Saves the qualified lead (LEAD_WEBHOOK_URL, event "lead.qualified", unpaid).
 * 2. Creates a Razorpay Payment Link pre-filled with the visitor's details and returns its URL.
 *    Razorpay sends the visitor back to the offer's thank-you page, which verifies the payment.
 * Without Razorpay keys it returns a demo URL so the flow can be previewed end to end.
 */
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (throttled(ip)) return Response.json({ error: 'rate_limited' }, { status: 429 });

  const body = (await req.json().catch(() => ({}))) as { lead?: unknown };
  const lead = readLead(body.lead);
  if (!lead) return Response.json({ error: 'invalid_input' }, { status: 400 });
  const offer = getOffer(lead.offer)!;

  const leadId = `wft_${randomUUID().replace(/-/g, '').slice(0, 24)}`;
  await sendLeadEvent({ event: 'lead.qualified', lead_id: leadId, status: 'unpaid', price_inr: offer.consult.price, ...lead });

  const origin = new URL(req.url).origin;
  if (!razorpayConfigured()) {
    return Response.json({ demo: true, leadId, url: `${offer.thankYouPath}?demo=paid&ref=${leadId}` });
  }
  try {
    const link = await createPaymentLink({
      amountInr: offer.consult.price,
      referenceId: leadId,
      description: `${offer.consult.name}: 30 minutes, one-on-one with the WeframeTech CEO`,
      customer: { name: lead.name, email: lead.email, contact: lead.phone },
      notes: { offer: offer.slug, lead_id: leadId },
      callbackUrl: `${origin}${offer.thankYouPath}`,
    });
    return Response.json({ demo: false, leadId, url: link.short_url });
  } catch (err) {
    console.error('[checkout]', err);
    return Response.json({ error: 'payment_unavailable' }, { status: 502 });
  }
}
