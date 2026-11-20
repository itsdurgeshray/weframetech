import { sendLeadEvent } from '@/lib/leads';
import { verifyWebhook } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

/**
 * Razorpay webhook (Dashboard > Webhooks, event: payment_link.paid, secret = RAZORPAY_WEBHOOK_SECRET).
 * Records the payment even if the visitor closes the tab before returning to the thank-you page.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyWebhook(raw, req.headers.get('x-razorpay-signature'))) return new Response('invalid signature', { status: 401 });

  const evt = JSON.parse(raw) as {
    event?: string;
    payload?: { payment_link?: { entity?: { id?: string; reference_id?: string; amount_paid?: number } }; payment?: { entity?: { id?: string } } };
  };
  if (evt.event === 'payment_link.paid') {
    const link = evt.payload?.payment_link?.entity;
    await sendLeadEvent({
      event: 'payment.paid', lead_id: link?.reference_id ?? '', payment_id: evt.payload?.payment?.entity?.id,
      payment_link_id: link?.id, amount_inr: link?.amount_paid != null ? link.amount_paid / 100 : undefined, via: 'webhook',
    });
  }
  return Response.json({ ok: true });
}
