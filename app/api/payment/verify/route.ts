import { sendLeadEvent } from '@/lib/leads';
import { fetchPaymentLink, razorpayConfigured, verifyCallback } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

type Result =
  | { status: 'paid'; demo?: boolean; paymentId?: string; amountInr?: number; name?: string; email?: string }
  | { status: 'unpaid'; demo?: boolean; linkStatus?: string }
  | { status: 'invalid' };

/**
 * POST the query params Razorpay appended to the thank-you URL.
 * Checks the signature, then asks Razorpay for the link's real status, so "paid" can't be faked by editing the URL.
 */
export async function POST(req: Request) {
  const q = (await req.json().catch(() => ({}))) as Record<string, string | undefined>;
  const ok = (r: Result) => Response.json(r);

  if (!razorpayConfigured()) {
    if (q.demo === 'paid') return ok({ status: 'paid', demo: true });
    if (q.demo) return ok({ status: 'unpaid', demo: true, linkStatus: 'cancelled' });
    return ok({ status: 'invalid' });
  }

  const p = {
    linkId: q.razorpay_payment_link_id ?? '',
    referenceId: q.razorpay_payment_link_reference_id ?? '',
    status: q.razorpay_payment_link_status ?? '',
    paymentId: q.razorpay_payment_id ?? '',
    signature: q.razorpay_signature ?? '',
  };
  if (!p.linkId || !p.signature || !verifyCallback(p)) return ok({ status: 'invalid' });

  const link = await fetchPaymentLink(p.linkId);
  const status = link?.status ?? p.status;
  if (status !== 'paid') return ok({ status: 'unpaid', linkStatus: status });

  await sendLeadEvent({
    event: 'payment.paid', lead_id: p.referenceId, payment_id: p.paymentId, payment_link_id: p.linkId,
    amount_inr: link ? link.amount_paid / 100 : undefined, via: 'callback',
  });
  return ok({
    status: 'paid', paymentId: p.paymentId,
    amountInr: link ? link.amount_paid / 100 : undefined,
    name: link?.customer?.name, email: link?.customer?.email,
  });
}
