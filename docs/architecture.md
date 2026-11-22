# Architecture

## System Overview

PD.uz is a Next.js 15 App Router application serving as the public website for ProfiDeutsch Uzbekistan — a German language school that also administers official TELC German exams. The project has two distinct layers:

1. **Marketing site** — multilingual landing page (de/en/ru/uz) with hero, courses, testimonials, map, contact form
2. **TELC exam registration system** — full booking flow with admin dashboard, Supabase database, REST API routes, and Payme + Paynet payment gateway integrations

---

## Frontend Architecture

### Routing

```
app/
├── layout.tsx                  Root layout (ThemeProvider + ParallaxProvider)
├── page.tsx                    Redirects / → /de
├── globals.css                 Global styles + TELC utility classes
├── [lang]/
│   ├── layout.tsx              LanguageProvider + Header + Footer + LeftSlidingMenu
│   ├── page.tsx                Main landing page
│   └── page-wrapper.tsx        Client-side parallax wrapper
├── telc/
│   └── [lang]/
│       ├── page.tsx            TELC info page (static)
│       ├── booking/page.tsx    Booking landing (links to register)
│       └── register/page.tsx   3-step registration flow
├── admin/
│   └── page.tsx                Legacy copy of the admin dashboard (no lang prefix)
└── api/
    ├── telc/                   TELC REST API (registration flow + admin panel)
    ├── payme/route.ts          Payme Merchant API JSON-RPC 2.0 inbound endpoint
    ├── paynet/route.ts         Paynet JSON-RPC 2.0 inbound endpoint
    └── contact/                (empty — not yet implemented)
```

### Language System

Four languages: `de` (default), `uz`, `en`, `ru`. Language is encoded in the URL path prefix (`/de/`, `/uz/`, etc.) and persisted in localStorage + cookie.

- `contexts/language-context.tsx` — `LanguageProvider`, `useLanguage()` hook, `t(key)` lookup
- `translations/` — One JSON file per language for the marketing site
- `lib/telc-i18n.ts` — Standalone `telcT(language, key, vars?)` for TELC components; Russian falls back to English

### TELC Registration Flow

Three-step wizard under `app/telc/[lang]/register/`:

```
Step 1 — StepPersonalInfo    Email OTP verification + personal details
Step 2 — StepExamSelection   Region → Level → Date → Time → Submit registration
Step 3 — StepPayment         Payment method selection (Click / Payme / Other)
         SuccessScreen        Confirmation + ticket download stub
```

The steps call the REST routes in `app/api/telc/*` with `fetch()`.

### Admin Dashboard

`app/telc/admin/page.tsx` (login at `/telc/admin/login`) — Tab-based dashboard. `app/admin/page.tsx` is a legacy copy. Main panels:
- **AdminExams** — Create/delete exam sessions (region, level, date, time, capacity)
- **AdminPricing** — Inline price editing per exam level
- **AdminRegistrations** — View all registrations with detail expand

Admins log in via `POST /api/telc/admin/login` (table `telc_admins`), which issues a 24h token stored in `telc_admin_sessions` and in `localStorage.telc_admin_token`. Admin components send it via `adminFetch()`; every admin route handler checks it with `requireTelcAdmin()`.

---

## Backend Architecture

### TELC REST API

```
app/api/telc/
├── admin/login/route.ts       Admin login + session check
├── exam-levels/route.ts       Levels and prices
├── exams/route.ts             Exam sessions
├── otp/send, otp/verify       Email OTP
├── registrations/route.ts     Registrations
├── payments/route.ts          Payments
└── send-confirmation/route.ts Confirmation email
lib/telc-admin-auth.ts         requireTelcAdmin() — bearer-token check for admin handlers
lib/telc-admin-fetch.ts        adminFetch() — client helper that sends the token
lib/supabase.ts                supabase (anon) / supabaseAdmin (service role, server only)
server/email.ts                Resend email (logs to console when RESEND_API_KEY is unset)
```

Route handlers query Supabase through `supabaseAdmin`. See `docs/api-reference.md` for access rules per method.

### Database Schema (PostgreSQL)

```
exam_levels        id, level (A1–C1), price (decimal)
exams              id, level_id→, region, address, exam_date, start_time, end_time, capacity, registered_count
registrations      id, user_id (uuid), exam_id→, first_name, last_name, phone_number, email,
                   passport_number, status (enum), email_verified, payment_verified,
                   registration_date, UNIQUE(passport_number, exam_id)
payments           id, provider_trn_id (serial — Paynet receipt ref), registration_id→,
                   booking_id, paynet_transaction_id, amount, payment_method, status (enum),
                   gateway, transaction_id, verified_at, paid_at
otp_verifications  id, email, otp, verified, expires_at
```

Status enums:
- `registration_status`: `pending | verified | paid | completed | cancelled`
- `payment_status`: `pending | completed | failed | cancelled`

SQL: `supabase/schema.sql`. Drizzle mirror for `drizzle-kit`: `drizzle/schema.ts`. The app does not use Drizzle at runtime.

---

## Payme (Paycom) Integration

Payme is an Uzbek mobile payment system. **They call our endpoint** — the integration is inbound (Merchant API pattern).

```
User pays via Payme app/QR → Payme servers → POST /api/payme (JSON-RPC 2.0)
```

### Flow

1. User selects "Payme" in Step 3, a QR code is rendered client-side via Payme's CDN JS library
2. User scans the QR with the Payme app and authorizes payment
3. Payme calls `CheckPerformTransaction` → we verify the order exists and amount matches
4. Payme calls `CreateTransaction` → we create a `pending` payment record
5. Payme calls `PerformTransaction` → we mark payment `completed`, registration `paid`
6. Payme may call `CancelTransaction` (user backed out) or `CheckTransaction` (reconciliation)

### Client-side QR/Button

`StepPayment.tsx` loads Payme's CDN checkout script and calls:
- `Paycom.QR("#payme-form", "#payme-qr-container")` — renders scannable QR
- `Paycom.Button("#payme-form", "#payme-btn-container")` — renders "Pay" button

The hidden `<form id="payme-form">` passes `merchant`, `amount` (in tiyin = UZS × 100), `account[order_id]`, `lang`, and `description`.

### Environments

| Env | Checkout URL | Merchant Key |
|-----|-------------|-------------|
| Sandbox (`NEXT_PUBLIC_PAYME_ENV=test`) | `https://test.paycom.uz` | Test key from Payme cabinet |
| Production (default) | `https://checkout.paycom.uz` | Live key from Payme cabinet |

### Security

- HTTP Basic Auth: `Authorization: Basic base64(NEXT_PUBLIC_PAYME_MERCHANT_ID:PAYME_MERCHANT_KEY)`
- Idempotency: duplicate Payme transaction ID returns the existing record, no double-insert
- Completed payments cannot be cancelled via `CancelTransaction` (returns `-31007`)

### Schema fields (payments table)

```
payme_transaction_id   text       Payme's transaction UUID
payme_create_time      text       Unix ms when Payme created the transaction
payme_perform_time     text       Unix ms when payment completed
payme_cancel_time      text       Unix ms when payment was cancelled
payme_reason           integer    Cancellation reason code (1–10)
```

---

## Paynet Integration

Paynet is an Uzbek payment network. **They call our endpoint** — the integration is inbound.

```
Paynet PAK → POST /api/paynet (JSON-RPC 2.0)
```

### Flow

1. User selects "Paynet" at a terminal or in the Paynet app, enters our service ID + booking ID
2. Paynet calls `GetInformation` → we return candidate name + exam fee
3. Paynet calls `PerformTransaction` → we create a payment record and confirm the booking
4. Paynet may call `CheckTransaction` or `CancelTransaction` for reconciliation
5. Paynet calls `GetStatement` for periodic reconciliation

### Security

- IP whitelist: `213.230.106.112/28` and `213.230.65.80/28` (enforced in production)
- HTTP Basic Auth via `PAYNET_USERNAME` / `PAYNET_PASSWORD` env vars
- Idempotency: duplicate `paynet_transaction_id` returns error 201, no double-charge

---

## Infrastructure

- **Hosting:** Vercel (project `pd-uz`); `amplify.yml` is legacy
- **Database:** Supabase PostgreSQL (project ref `vahydwolnmofshbmhdst`)
- **Auth:** email OTP for registrants; `telc_admins` + `telc_admin_sessions` tokens for admins
- **Node:** 24.x (`engines` field in `package.json`)
- **Package manager:** pnpm 10.14.0

### Key Config Files

| File | Purpose |
|------|---------|
| `next.config.mjs` | Builds fail on TypeScript or ESLint errors |
| `tsconfig.json` | `exactOptionalPropertyTypes: true`, `noUncheckedIndexedAccess: true`; excludes `newTelc/` |
| `drizzle.config.ts` | Points Drizzle Kit at `DATABASE_URL` |
| `tailwind.config.ts` | CSS variables theme, shadcn/ui preset |
| `amplify.yml` | Legacy AWS Amplify build steps (not used) |
