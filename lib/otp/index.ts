import 'server-only';
import type { OtpProvider, ProviderName } from './types';
import { demoProvider } from './providers/demo';
import { twilioProvider } from './providers/twilio';
import { msg91Provider } from './providers/msg91';

const PROVIDERS: Record<ProviderName, OtpProvider> = {
  demo: demoProvider,
  twilio: twilioProvider,
  msg91: msg91Provider,
};

/**
 * Picks the OTP provider from OTP_PROVIDER ("demo" | "twilio" | "msg91"). Defaults to "demo".
 * Adding another provider = one file in ./providers implementing OtpProvider + one line above.
 */
export function getOtpProvider(): OtpProvider {
  const name = (process.env.OTP_PROVIDER || 'demo').toLowerCase() as ProviderName;
  return PROVIDERS[name] ?? demoProvider;
}

export * from './types';
export { signVerification, readVerification } from './token';
