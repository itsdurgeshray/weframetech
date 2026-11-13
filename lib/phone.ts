/** Phone helpers shared by the form (client) and the OTP API (server). */

export const COUNTRY_CODES = [
  { code: '+91', name: 'India' },
  { code: '+1', name: 'US / Canada' },
  { code: '+44', name: 'UK' },
  { code: '+971', name: 'UAE' },
  { code: '+65', name: 'Singapore' },
  { code: '+61', name: 'Australia' },
  { code: '+49', name: 'Germany' },
  { code: '+46', name: 'Sweden' },
  { code: '+31', name: 'Netherlands' },
  { code: '+33', name: 'France' },
  { code: '+41', name: 'Switzerland' },
  { code: '+966', name: 'Saudi Arabia' },
  { code: '+972', name: 'Israel' },
  { code: '+27', name: 'South Africa' },
] as const;

/** E.164: "+" then 8 to 15 digits, no leading zero. */
export const E164 = /^\+[1-9]\d{7,14}$/;

/** "+91" + "098765 43210" -> "+919876543210" */
export function toE164(countryCode: string, local: string): string {
  return countryCode + local.replace(/\D/g, '').replace(/^0+/, '');
}

export function isValidPhone(countryCode: string, local: string): boolean {
  const digits = local.replace(/\D/g, '').replace(/^0+/, '');
  return digits.length >= 6 && E164.test(toE164(countryCode, local));
}

export const isValidCode = (code: string) => /^\d{4,8}$/.test(code);
