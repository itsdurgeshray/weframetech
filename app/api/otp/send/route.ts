import { getOtpProvider, STATUS } from '@/lib/otp';
import { E164 } from '@/lib/phone';

export const dynamic = 'force-dynamic';

/** POST { phone: "+919876543210", resend?: boolean } -> { ok: true, demo: boolean, demoCode? } (demoCode only in demo mode) */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { phone?: string; resend?: boolean };
  const phone = String(body.phone ?? '');
  if (!E164.test(phone)) return Response.json({ error: 'invalid_input' }, { status: STATUS.invalid_input });

  const provider = getOtpProvider();
  const r = await provider.send(phone, { resend: !!body.resend });
  if (!r.ok) return Response.json({ error: r.error }, { status: STATUS[r.error] });
  const demo = provider.name === 'demo';
  return Response.json({ ok: true, demo, ...(demo ? { demoCode: process.env.OTP_DEMO_CODE || '123456' } : {}) });
}
