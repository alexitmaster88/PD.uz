# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (Next.js, port 3000)
pnpm build        # Production build
pnpm lint         # ESLint (flat config in eslint.config.mjs; `next lint` is deprecated)
pnpm typecheck    # TypeScript check without emitting
pnpm drizzle-kit push   # Push drizzle/schema.ts to Supabase — diff it first; supabase/schema.sql is the reference
pnpm drizzle-kit studio # Open Drizzle Studio (local DB browser)
```

Requires Node 24 (`nvm use 24`). Vercel no longer builds on Node 20 ("discontinued"), which is what broke all deploys from July to November 2026. Package manager is `pnpm@10.14.0`.

**Build gate:** `pnpm build` fails on any TypeScript error or ESLint error (both were previously ignored). Keep `pnpm typecheck` at 0 errors and `pnpm lint` at 0 errors before pushing — a failing build means Vercel won't deploy. `tsconfig.json` is extra-strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`): index lookups like `ui[lang]` are `T | undefined`, and optional props that may receive `undefined` must be typed `?: T | undefined`. `@typescript-eslint/no-explicit-any` is a warning for now (~70 untyped Supabase rows); promote to error once DB row types exist.

## Architecture

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Supabase (PostgreSQL + Auth).

**Routing structure:**
- `/` → redirects to `/de`
- `/[lang]` — main landing page (de/en/ru/uz)
- `/telc/[lang]` — TELC exam info page
- `/telc/[lang]/booking` — TELC exam info/booking landing (static, links to register)
- `/telc/[lang]/register` — Full 3-step TELC exam registration flow
- `/telc/admin` — Admin dashboard (Exams / Pricing / Registrations / Payments tabs); login at `/telc/admin/login`
- `/admin` — redirects to `/telc/admin` (the old copy of the dashboard was removed)
- `/api/telc/*` — REST API actually used by the frontend (registration flow + admin panel)
- `/api/payme` — Payme Merchant API endpoint (JSON-RPC 2.0, inbound from Payme's servers)
- `/api/paynet` — Paynet billing endpoint (JSON-RPC 2.0, inbound from Paynet's servers)
- `/api/contact` — directory exists but is empty; no route handler implemented yet

**Internationalization:** Four languages: `de` (default), `uz`, `en`, `ru`. Language is encoded in the URL prefix and persisted via localStorage and a cookie. The `LanguageProvider` in `contexts/language-context.tsx` wraps all main pages and exposes:
- `t(key)` — looks up translation key, falls back to `de`, then the key itself
- `setLanguage(lang)` — navigates to the equivalent URL with the new lang prefix and restores scroll position
- `getLanguagePath(path)` — rewrites any path to use the current language prefix

Translation files live in `translations/` (one file per language). When adding new copy to main pages, add the key to all four language files.

The TELC registration system uses a separate i18n function `telcT(language, key, vars?)` from `lib/telc-i18n.ts` — translations are inline in that file, Russian falls back to English.

**Component conventions:**
- Section-level components live in `components/` (e.g., `hero-section.tsx`, `map-section.tsx`)
- `components/ui/` holds shadcn/ui primitives — add new ones via `pnpm dlx shadcn@latest add <component>`
- Language-specific variants follow the `language-specific-*.tsx` naming pattern and use `useLanguage()` or `useLanguageContent()` from `utils/language-content.ts`
- All section components are client components (`"use client"`) and consume `useLanguage()` for translations
- TELC-specific components live under `components/telc/` (registration steps, admin panels)

**Layout chain:** `app/layout.tsx` (ThemeProvider + ParallaxProvider) → `app/[lang]/layout.tsx` (LanguageProvider + Header + Footer + LeftSlidingMenu + LanguageSwitcher) → page components. The TELC register and admin pages do NOT use the `[lang]` layout chain.

**Styling:** Tailwind with CSS variables for theming (neutral base, `cssVariables: true`). The `cn()` helper from `lib/utils.ts` merges Tailwind classes. Global styles in `app/globals.css`. TELC-specific CSS utility classes (`telc-btn-primary`, `telc-btn-secondary`, `form-group`, `form-label`, `form-input`, `form-error`, `step-indicator`, `step-dot`, `step-line`, etc.) are also defined in `globals.css`.

**Backend:** Supabase is the database (project ref: `vahydwolnmofshbmhdst`). All TELC logic lives in the REST route handlers under `app/api/telc/*` (there is no tRPC layer; it was removed as unused). `lib/supabase.ts` exports two clients: `supabase` (anon key, browser-safe) and `supabaseAdmin` (service role key, bypasses RLS — import in API routes and server code only, never in client components).

**TELC backend structure:**
- `supabase/schema.sql` — reference SQL schema (exam_levels, exams, registrations, payments, otp_verifications, telc_admins, telc_admin_sessions), RLS enabled
- `drizzle/schema.ts` — Drizzle mirror of the schema, used only by `drizzle-kit` (dev dependency); the app does not use Drizzle at runtime
- `server/email.ts` — Resend email sending (logs to console when `RESEND_API_KEY` is unset); server-only
- `lib/telc-admin-auth.ts` / `lib/telc-admin-fetch.ts` — admin auth (see below)

**Admin access (REST, used by the UI):** Admins log in via `POST /api/telc/admin/login` (table `telc_admins`), which issues a 24h token stored in `telc_admin_sessions` and in `localStorage.telc_admin_token`. Every admin-only `/api/telc/*` handler MUST start with `const auth = await requireTelcAdmin(req); if (auth instanceof NextResponse) return auth` (`lib/telc-admin-auth.ts`), and admin components MUST call the API via `adminFetch()` (`lib/telc-admin-fetch.ts`). Public endpoints: `GET exams` (non-admin), `GET exam-levels`, `POST otp/send`, `POST otp/verify`, `POST registrations` (requires server-verified OTP), `POST payments` (amount derived from DB), `POST send-confirmation`.

**Payme integration (`app/api/payme/route.ts`):** Payme (Paycom) is an Uzbek mobile payment system that calls **our** endpoint (Merchant API pattern). When a user scans a QR code and pays via Payme, Payme's servers send JSON-RPC 2.0 POST requests to our `/api/payme` URL.

- Protocol: JSON-RPC 2.0 over HTTPS POST; always return HTTP 200
- Auth: HTTP Basic Auth — `base64(NEXT_PUBLIC_PAYME_MERCHANT_ID:PAYME_MERCHANT_KEY)`
- Methods: `CheckPerformTransaction`, `CreateTransaction`, `PerformTransaction`, `CancelTransaction`, `CheckTransaction`
- Sandbox: set `NEXT_PUBLIC_PAYME_ENV=test` → checkout form posts to `https://test.paycom.uz`
- Production: checkout form posts to `https://checkout.paycom.uz` (default when env var absent)
- Client-side QR/button rendered by Payme CDN script loaded in `StepPayment.tsx`
- Payme transaction fields stored in `payments` table: `payme_transaction_id`, `payme_create_time`, `payme_perform_time`, `payme_cancel_time`, `payme_reason`
- After schema changes run: `pnpm drizzle-kit push`
- Idempotency: duplicate Payme transaction ID returns existing record, no double-insert

**Paynet integration (`app/api/paynet/route.ts`):** Paynet is an Uzbek payment network that calls **our** endpoint (inbound billing server pattern). When a user pays via a Paynet terminal, Paynet's PAK sends JSON-RPC 2.0 POST requests to our `/api/paynet` URL.

- Protocol: JSON-RPC 2.0 over HTTPS POST
- Auth: HTTP Basic Auth — `PAYNET_USERNAME` / `PAYNET_PASSWORD` env vars
- IP whitelist: `213.230.106.112/28` and `213.230.65.80/28` (enforced in production only)
- Timezone: all timestamps use GMT+5 (Asia/Tashkent)
- Methods: `GetInformation`, `PerformTransaction`, `CheckTransaction`, `CancelTransaction`, `GetStatement`, `ChangePassword`
- `payments.provider_trn_id` is the bigserial Paynet receives as receipt reference
- Idempotency: duplicate `paynet_transaction_id` → error code 201

**Required env vars:**
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...                     # Email delivery; without it emails are only logged
PAYNET_USERNAME=...
PAYNET_PASSWORD=...
# Local only, for drizzle-kit (not needed on Vercel):
# DATABASE_URL=postgresql://...        # Supabase connection string
# Payme (Paycom) — get from https://merchant.paycom.uz (test) or production cabinet
NEXT_PUBLIC_PAYME_MERCHANT_ID=...      # Merchant ID (public, used in QR form + Merchant API auth)
PAYME_MERCHANT_KEY=...                 # Secret key (Merchant API Basic Auth, never expose client-side)
NEXT_PUBLIC_PAYME_ENV=test             # Set to "test" for sandbox; omit or set "production" for live
```

**Two Telegram handles are in use** (known inconsistency — verify before changing):
- `https://t.me/UZ_profideutsch` — used in `components/header.tsx` and `components/contact-section.tsx` (contact form opens a Telegram deep-link with pre-filled message fields)
- `https://t.me/profi_deutsch_uz` — used in `components/language-specific-courses.tsx` and `app/telc/[lang]/booking/page.tsx`

**External integrations:** YouTube iframe API (`components/youtube-player.tsx`) and Google Maps embed (`components/map-section.tsx`). No API keys required.

**Known tech debt:**
- Contact info (phone, email, coordinates, Telegram URLs) is hardcoded and duplicated across `map-section.tsx`, `contact-section.tsx`, and `footer.tsx` — no central config file
- `language-specific-reviews.tsx`, `language-specific-testimonials.tsx`, and `social-media-feed.tsx` are oversized (350–440 lines) and mix data with presentation
- `contexts/language-context.tsx` has unguarded `JSON.parse`, unhandled dynamic import failure, and localStorage calls without try/catch
- Ticket download (`SuccessScreen.tsx`) is browser print → "Save as PDF", not a generated PDF file, and is only available on the success screen (refreshing loses it). A server-generated PDF would need per-registration access control and embedded Cyrillic fonts
- `StepPayment.tsx` — Payme QR/button is wired up via CDN script; Click method still shows placeholder QR icon (Click SDK integration pending)
- `xlsx` is installed from the SheetJS CDN tarball (the npm package is abandoned/vulnerable) — keep it that way
- `pnpm.overrides` in `package.json` force patched versions of Next's bundled `postcss`/`sharp` and transitive `nanoid`/`source-map-js` — re-check with `pnpm audit` before removing
- Stale backup files in `components/` (`.bak`, `.bak2`, `.old`, `.fixed`, `.new` suffixes) — do not treat as canonical

**Deployment:** Vercel — project `pd-uz` under the `profideutschuz-9760` account serves `profi-deutsch.uz`; pushes to `main` deploy to production, other branches get Preview deployments. Node version comes from `engines.node` in `package.json`. A second Vercel project (also `pd-uz`, under `alexitmaster88`'s account) is connected to the same repo and posts failing GitHub statuses — ignore it. `amplify.yml` is legacy (AWS Amplify is not serving the site).

## Docs

- [docs/architecture.md](docs/architecture.md) — Full system design and data flow
- [docs/style-guide.md](docs/style-guide.md) — Coding conventions and component patterns
- [docs/business-context.md](docs/business-context.md) — Product requirements and user flows
- [docs/api-reference.md](docs/api-reference.md) — REST endpoint documentation
