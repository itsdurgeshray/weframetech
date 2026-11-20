/**
 * Public, client-safe settings. Values come from NEXT_PUBLIC_* env vars (see .env.example).
 * Server-only secrets (OTP provider keys, lead webhook) live in lib/otp and app/api and are never imported here.
 * Per-offer settings (video IDs, booking link, session price) live in lib/offers/<slug>.
 */
export const site = {
  /** Default strategy-call booking link, used when an offer has no booking link of its own. */
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? '',
  /** Seconds before "Resend code" unlocks. */
  otpResendSeconds: 30,
} as const;
