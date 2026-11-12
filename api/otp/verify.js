// POST { phone: "+919876543210", code: "123456" } -> { verified: true | false }
const { PHONE_RE, readBody, twilio } = require('./_twilio');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const { phone, code } = readBody(req);
  if (!PHONE_RE.test(phone || '') || !/^\d{4,8}$/.test(code || '')) return res.status(400).json({ error: 'invalid_input' });
  try {
    const r = await twilio('VerificationCheck', { To: phone, Code: code });
    if (!r.configured) return res.status(500).json({ error: 'otp_not_configured' });
    if (r.status === 429) return res.status(429).json({ error: 'too_many_requests' });
    // Twilio answers 404 when the code expired or was already used
    if (r.status === 404) return res.status(200).json({ verified: false, reason: 'expired' });
    if (!r.ok) return res.status(502).json({ error: 'verify_failed' });
    return res.status(200).json({ verified: r.data.status === 'approved' });
  } catch (_) {
    return res.status(502).json({ error: 'verify_failed' });
  }
};
