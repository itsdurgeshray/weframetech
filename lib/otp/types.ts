/** Every SMS/OTP provider implements this. Phones are always E.164 ("+919876543210"). */

export type OtpErrorCode = 'invalid_input' | 'rate_limited' | 'not_configured' | 'provider_error';

export type SendResult = { ok: true } | { ok: false; error: OtpErrorCode };
export type VerifyResult = { ok: true; verified: boolean } | { ok: false; error: OtpErrorCode };

export type ProviderName = 'demo' | 'twilio' | 'msg91';

export interface OtpProvider {
  readonly name: ProviderName;
  /** Send a code. `resend` lets providers use a dedicated retry endpoint (MSG91 has one). */
  send(phone: string, opts?: { resend?: boolean }): Promise<SendResult>;
  /** Check a code the user typed. */
  verify(phone: string, code: string): Promise<VerifyResult>;
}

/** HTTP status for each error, used by the API routes. */
export const STATUS: Record<OtpErrorCode, number> = {
  invalid_input: 400,
  rate_limited: 429,
  not_configured: 500,
  provider_error: 502,
};
