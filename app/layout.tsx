import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Geist } from 'next/font/google';

/* Brand type: Season Mix (headings, trial licence) + Geist (body). Exposed as CSS vars used by --serif / --sans. */
const season = localFont({
  src: [
    { path: './fonts/SeasonMix-TRIAL-Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/SeasonMix-TRIAL-Medium.ttf', weight: '500', style: 'normal' },
  ],
  variable: '--font-season',
  display: 'swap',
});
const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });

export const metadata: Metadata = {
  title: 'WeframeTech | Build Your Own Telehealth Business',
  description: 'For doctors and healthcare professionals earning ₹2-10 lakh per month. Watch real client proof, case studies, and see how the WeframeTech telehealth venture partnership works.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

/* Runs before first paint: ?figma = static import mode (no motion, every form screen visible), otherwise enable reveal motion. */
const modeScript = `(function(){var d=document.documentElement;if(new URLSearchParams(location.search).has('figma'))d.classList.add('figma');else d.classList.add('js');})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${season.variable} ${geist.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
