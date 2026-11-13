import type { OtpProvider } from '../types';

/**
 * No SMS is sent. Any number "receives" OTP_DEMO_CODE (default 123456).
 * Used for previews and client reviews. Never leave this on for real traffic.
 */
export const demoProvider: OtpProvider = {
  name: 'demo',
  async send() {
    return { ok: true };
  },
  async verify(_phone, code) {
    return { ok: true, verified: code === (process.env.OTP_DEMO_CODE || '123456') };
  },
};
