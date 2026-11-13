import { getOtpProvider, signVerification, STATUS } from '@/lib/otp';
import { E164, isValidCode } from '@/lib/phone';

export const dynamic = 'force-dynamic';

/** POST { phone, code } -> { verified: true, token } | { verified: false } */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { phone?: string; code?: string };
  const phone = String(body.phone ?? '');
  const code = String(body.code ?? '');
  if (!E164.test(phone) || !isValidCode(code)) return Response.json({ error: 'invalid_input' }, { status: STATUS.invalid_input });

  const r = await getOtpProvider().verify(phone, code);
  if (!r.ok) return Response.json({ error: r.error }, { status: STATUS[r.error] });
  if (!r.verified) return Response.json({ verified: false });
  return Response.json({ verified: true, token: signVerification(phone) });
}
