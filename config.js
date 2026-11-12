/*
  WeframeTech VSL: one place for every link and endpoint.
  Both index.html and thank-you.html read this file.
*/
window.WFT_CONFIG = {
  // Calendar link for the discovery call (Calendly, Cal.com, HubSpot, ...). '#' = not set yet.
  BOOKING_URL: '#',

  // POST endpoint that receives the qualified lead as JSON. Empty = nothing is sent.
  LEAD_ENDPOINT: '',

  /*
    Phone verification.
    'demo' : no SMS is sent; the code is always 123456 (for previews and client reviews).
    'api'  : calls the two endpoints below. The bundled /api/otp/* functions use Twilio Verify
             and need TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID set
             as environment variables on the host (Vercel: Project Settings > Environment Variables).
  */
  OTP_MODE: 'demo',
  OTP_SEND_URL: '/api/otp/send',      // POST { phone: "+919876543210" }            -> 200 { ok: true }
  OTP_VERIFY_URL: '/api/otp/verify',  // POST { phone: "+91...", code: "123456" }   -> 200 { verified: true }
  OTP_DEMO_CODE: '123456',
  OTP_RESEND_SECONDS: 30,

  // YouTube video IDs
  VSL_ID: '',                         // hero VSL
  VIDEOS: ['', '', '', '', ''],       // how-it-works, one per timeline step
};
