# WeframeTech VSL Funnels

Next.js 16 (App Router). One locked design, three offers:

| Offer | URL | Copy + questions |
| --- | --- | --- |
| Telehealth venture partnership | `/` and `/telehealth` | `lib/offers/telehealth.tsx`, `lib/qualifier.ts` |
| Manufacturing: own sales channel | `/manufacturing-sales-channel` | `lib/offers/manufacturing-sales-channel.tsx` |
| Manufacturing: AI growth system | `/manufacturing-ai-growth` | `lib/offers/manufacturing-ai-growth.tsx` |

Each offer also has `/<offer>/thank-you`. To add an offer, copy one file in `lib/offers/`, change the copy,
questions and gates, and register it in `lib/offers/index.ts`; the route appears automatically.

```bash
npm install
cp .env.example .env.local   # fill what you have; everything works in demo mode without it
npm run dev                  # http://localhost:5212
npm run build && npm start   # production
```

## Structure

```
app/
  layout.tsx            fonts (Season Mix local + Geist), ?figma / js mode script
  page.tsx, home.css    landing page; CSS ported 1:1 from the locked static design
  thank-you/            thank-you route + its own stylesheet
  api/otp/send          POST { phone, resend? }      -> sends the code via the active provider
  api/otp/verify        POST { phone, code }         -> { verified, token }
  api/lead              POST { lead, token }         -> forwards verified leads to LEAD_WEBHOOK_URL
components/
  home/                 static sections (Hero, QualifySection, Clients, HowItWorks, Team, Testimonials, Closing, Footer)
  qualifier/            the 6-question gated form, details step, OTP verify step
  ui/                   Nav, QualifyLink, VideoPlayer, Marquee, Timeline, StickyBar, Reveal
  thank-you/            BookingCta, LeadSummary
lib/
  qualifier.ts          questions, branches, Not a Fit gates (edit copy here)
  site.ts               public settings from NEXT_PUBLIC_* env
  phone.ts              country codes + E.164 helpers
  otp/                  provider layer (see below)
public/assets/          images and logos
```

## Phone OTP providers

All providers implement one interface (`lib/otp/types.ts`) and are picked by `OTP_PROVIDER`:

| `OTP_PROVIDER` | Env needed | Notes |
| --- | --- | --- |
| `demo` (default) | `OTP_DEMO_CODE` (optional) | No SMS. Code is 123456 and the form shows a demo hint. Previews only. |
| `twilio` | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SERVICE_SID` | Twilio Verify. |
| `msg91` | `MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID` (+ optional `MSG91_OTP_EXPIRY`, `MSG91_OTP_LENGTH`) | MSG91 OTP API v5. Resend uses MSG91's retry endpoint. |

### Turning on MSG91

1. In MSG91, create an OTP template (DLT-approved for Indian traffic) and copy its template ID.
2. Copy the auth key from API > Auth key.
3. Set `OTP_PROVIDER=msg91`, `MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID` and a long random `OTP_TOKEN_SECRET`.
4. Redeploy. If keys are missing the API answers `not_configured` and the form shows a friendly error.

Endpoints and response handling live in `lib/otp/providers/msg91.ts`; check them against the current MSG91 docs when enabling.

### Adding another provider

Create `lib/otp/providers/<name>.ts` exporting an `OtpProvider`, then register it in `lib/otp/index.ts`.

## Videos

Each offer has a hero VSL and an explainer, both YouTube IDs (see `.env.example`). Telehealth defaults to
`iHkaJAG2Ans`, the video on healthcare.weframetech.com. The poster is the video's YouTube thumbnail and the
video plays in place on click. Videos must allow embedding. The form is always open (no watch-time lock).

## Paid strategy session

Qualified visitors book a paid 30-minute session with the CEO:

| Offer | Price | Booking link env |
| --- | --- | --- |
| Telehealth | ₹499 | `NEXT_PUBLIC_TELEHEALTH_BOOKING_URL` |
| Manufacturing sales channel | ₹99 | `NEXT_PUBLIC_MFG_SALES_BOOKING_URL` |
| Manufacturing AI growth | ₹199 | `NEXT_PUBLIC_MFG_AI_BOOKING_URL` |

Any offer without its own link uses `NEXT_PUBLIC_BOOKING_URL`. Payment is taken by the booking tool
(e.g. a paid Cal.com event or a Razorpay page). Price, name and inclusions live in `consult` in each
`lib/offers/<slug>.tsx`; the shared inclusions are in `lib/offers/consult.ts`.

The session is shown in three places: the card in the qualify section, the strip on the form's final step,
and the booking card on the thank-you page. Client logos and proof (`TrustStrip`) sit at the foot of the form
and on the thank-you page. Code: `components/consult/`.

## Lead flow

1. The visitor passes the gates and enters name, phone, email, contact preference.
2. `/api/otp/send` texts the code; `/api/otp/verify` checks it and returns a 30-minute signed token.
3. `/api/lead` accepts the lead only with a valid token, so every lead has a verified phone, then forwards it to `LEAD_WEBHOOK_URL`.
4. The browser goes to the offer's thank-you page, which shows the answers, what the paid session includes and the booking button.

## Notes

- `?figma` on any URL renders a static version (no motion, every form screen visible) for importing into Figma.
- Season Mix is a trial font; buy a webfont licence before launch.
