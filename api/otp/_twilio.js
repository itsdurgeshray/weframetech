// Shared helpers for the Twilio Verify OTP endpoints (Vercel serverless, Node 18+).
const PHONE_RE = /^\+[1-9]\d{7,14}$/; // E.164

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
}

function twilio(path, params) {
  const { TWILIO_ACCOUNT_SID: sid, TWILIO_AUTH_TOKEN: token, TWILIO_VERIFY_SERVICE_SID: service } = process.env;
  if (!sid || !token || !service) return Promise.resolve({ configured: false });
  return fetch(`https://verify.twilio.com/v2/Services/${service}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params),
  }).then(async r => ({ configured: true, ok: r.ok, status: r.status, data: await r.json().catch(() => ({})) }));
}

module.exports = { PHONE_RE, readBody, twilio };
