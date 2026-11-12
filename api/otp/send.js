// POST { phone: "+919876543210" } -> sends a 6-digit SMS code via Twilio Verify.
const { PHONE_RE, readBody, twilio } = require('./_twilio');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const { phone } = readBody(req);
  if (!PHONE_RE.test(phone || '')) return res.status(400).json({ error: 'invalid_phone' });
  try {
    const r = await twilio('Verifications', { To: phone, Channel: 'sms' });
    if (!r.configured) return res.status(500).json({ error: 'otp_not_configured' });
    if (r.status === 429) return res.status(429).json({ error: 'too_many_requests' });
    if (!r.ok) return res.status(502).json({ error: 'send_failed' });
    return res.status(200).json({ ok: true });
  } catch (_) {
    return res.status(502).json({ error: 'send_failed' });
  }
};
