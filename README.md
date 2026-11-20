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
  api/checkout          POST { lead }                -> saves the lead, returns a Razorpay payment link
  api/payment/verify    POST { razorpay_* params }   -> paid / unpaid / invalid
  api/razorpay/webhook  POST (Razorpay)              -> records payment_link.paid
components/
  home/                 static sections (Hero, QualifySection, Clients, HowItWorks, Team, Testimonials, Closing, Footer)
  qualifier/            the gated form, details step, checkout handoff
  ui/                   Nav, QualifyLink, VideoPlayer, Marquee, Timeline, StickyBar, Reveal
  thank-you/            after-payment page (SessionStatus: paid / unpaid / no session)
  consult/              session card, final-step note, trust strip
lib/
  qualifier.ts          questions, branches, Not a Fit gates (edit copy here)
  site.ts               public settings from NEXT_PUBLIC_* env
  phone.ts              country codes + E.164 helpers
  razorpay.ts, leads.ts  payment links + lead events (server only)
  otp/                  optional phone OTP providers (not used by the form)
public/assets/          images and logos
```

## Videos

Each offer has a hero VSL and an explainer, both YouTube IDs (see `.env.example`). Telehealth defaults to
`iHkaJAG2Ans`, the video on healthcare.weframetech.com. The poster is the video's YouTube thumbnail and the
video plays in place on click. Videos must allow embedding. The form is always open (no watch-time lock).

## Paid strategy session

Qualified visitors pay for a 30-minute session with the CEO, then pick a time:

| Offer | Price | Calendar env (shown after payment) |
| --- | --- | --- |
| Telehealth | ₹499 | `NEXT_PUBLIC_TELEHEALTH_BOOKING_URL` |
| Manufacturing sales channel | ₹99 | `NEXT_PUBLIC_MFG_SALES_BOOKING_URL` |
| Manufacturing AI growth | ₹199 | `NEXT_PUBLIC_MFG_AI_BOOKING_URL` |

Any offer without its own calendar uses `NEXT_PUBLIC_BOOKING_URL`. Price, name and inclusions live in `consult`
in each `lib/offers/<slug>.tsx`; the shared inclusions are in `lib/offers/consult.ts`.

The qualify section is one apply panel: a dark "how it works" rail (the 3 steps, which light up as the visitor
moves through the form, plus the session card) beside the form, with client logos and proof (`TrustStrip`) at
the foot of the form. The offer's eligibility `note` sits below the panel. On phones the rail becomes a compact
stepper above the form and the session card moves below it. Code: `components/home/QualifySection.tsx`, `components/consult/`.

### Razorpay setup

1. Razorpay Dashboard > API keys: set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (test keys first).
2. Dashboard > Webhooks: add `https://<your-domain>/api/razorpay/webhook`, event `payment_link.paid`, and put the
   secret in `RAZORPAY_WEBHOOK_SECRET`.
3. Set the calendar links above and `LEAD_WEBHOOK_URL`. Redeploy.

Without keys everything runs in demo mode: the form skips Razorpay and the thank-you page shows the paid state
with a "Demo mode" note. Code: `lib/razorpay.ts`, `app/api/checkout`, `app/api/payment/verify`, `app/api/razorpay/webhook`.

## Lead flow

1. The visitor passes the gates and enters name, phone, email (and company/website/contact preference per offer).
2. `/api/checkout` sends `lead.qualified` (unpaid) to `LEAD_WEBHOOK_URL`, then creates a Razorpay Payment Link
   pre-filled with their details. A short "Taking you to secure checkout" screen hands over to Razorpay.
   Razorpay also texts/emails the link, and sends reminders, so drop-offs can come back.
3. Razorpay returns to `/<offer>/thank-you`. `/api/payment/verify` checks the signature and the link's real status:
   - paid: receipt, then the calendar (pre-filled) to pick a time, then what happens next;
   - not paid: "Try payment again" with the same link; answers are kept.
4. `payment.paid` is sent to `LEAD_WEBHOOK_URL` from the return and from the Razorpay webhook (dedupe on `payment_id`),
   so a payment is recorded even if the tab is closed.
5. "Back" from Razorpay reopens the form on the details step with everything filled in (sessionStorage).

## Notes

- `?figma` on any URL renders a static version (no motion, every form screen visible) for importing into Figma.
- Season Mix is a trial font; buy a webfont licence before launch.

## Phone OTP (optional)

The form no longer asks for an OTP: payment confirms the number. The provider layer is kept if you want it back.

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

