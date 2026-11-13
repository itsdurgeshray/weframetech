/**
 * Public, client-safe settings. Values come from NEXT_PUBLIC_* env vars (see .env.example).
 * Server-only secrets (OTP provider keys, lead webhook) live in lib/otp and app/api and are never imported here.
 */
export const site = {
  /** Strategy-call booking link (Calendly, Cal.com, HubSpot...). Empty = show a "link coming soon" note. */
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? '',
  /** Hero VSL YouTube ID. */
  vslId: process.env.NEXT_PUBLIC_VSL_YOUTUBE_ID ?? '',
  /** "Watch the 7-Minute Video Before Applying" YouTube ID. */
  explainerId: process.env.NEXT_PUBLIC_EXPLAINER_YOUTUBE_ID ?? '',
  /** % of a video that must actually be watched before the qualifier unlocks (0 = no gate). */
  unlockPercent: Number(process.env.NEXT_PUBLIC_UNLOCK_PERCENT ?? 70),
  /** Seconds before "Resend code" unlocks. */
  otpResendSeconds: 30,
} as const;
