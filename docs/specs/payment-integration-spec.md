# Payment Integration Spec

This document describes how to implement Click, Payme, and Octo payment integrations in the current repo while preserving the existing Paynet integration.

## Existing repo status

- `app/api/paynet/route.ts` implements Paynet inbound JSON-RPC 2.0 (complete).
- `app/api/payme/route.ts` implements the full Payme Merchant API (complete):
  - `CheckPerformTransaction`, `CreateTransaction`, `PerformTransaction`, `CancelTransaction`, `CheckTransaction`
  - Auth via HTTP Basic `base64(MERCHANT_ID:PAYME_KEY)`; idempotency; sandbox vs. production via `NEXT_PUBLIC_PAYME_ENV`
- `components/telc/registration/StepPayment.tsx` currently:
  - renders Click/Payme/Other method tiles
  - loads Payme CDN script (`cdn.paycom.uz`) and calls `Paycom.QR()` / `Paycom.Button()` for the real Payme QR
  - shows a placeholder QR icon for Click and Other methods
  - creates a payment record via `/api/telc/payments` and simulates verification (2 s delay)
- `drizzle/schema.ts` — `payments` table already has `gateway`, `payme_transaction_id`, `payme_create_time/perform_time/cancel_time/reason` columns.
- `lib/supabase.ts` exports `supabaseAdmin` (service role) used by both payment route handlers.
- There is no Click/Octo backend route in this repo.

## Recommended architecture

Use a shared payment service layer and separate gateway adapters for all payment systems.

### 1. Add a generic payment gateway abstraction

Create a shared service area such as:

- `lib/payment-gateways/index.ts`
- `lib/payment-gateways/paynet.ts` (refactor existing inbound logic)
- `lib/payment-gateways/click.ts`
- `lib/payment-gateways/payme.ts`
- `lib/payment-gateways/octo.ts`

Each gateway adapter should implement:

- `buildPaymentRequest(...)` (for outbound gateways like Click/Payme/Octo)
- `handleInboundRequest(...)` (for inbound gateways like Paynet)
- `verifyCallback(...)`
- `parseWebhook(...)`
- `mapStatus(...)`

This keeps shared logic DRY and makes it easy to add new providers later.

### 2. Add gateway-specific route handlers

Add backend routes for each payment provider:

- `app/api/payments/[gateway]/route.ts`
- or separate endpoints:
  - `app/api/click/route.ts`
  - `app/api/payme/route.ts`
  - `app/api/octo/route.ts`

Each route should:

- validate env vars
- accept only expected HTTP methods
- authenticate callback/webhook requests
- create or update a payment record
- return provider-specific response payloads

### 3. Extend the payment schema

Update `drizzle/schema.ts` to support generic gateways:

- `gateway: text('gateway').notNull()`
- `gatewayTransactionId: text('gateway_transaction_id').nullable()`
- `currency: text('currency').default('UZS')`
- `metadata: json('metadata').nullable()` (optional)

Prefer generic names and keep Paynet-specific fields only if needed.

### 4. Update the payment service layer

Update `server/db.ts`:

- `createPayment(...)` accepts `gateway`, `gatewayTransactionId`, `status`
- `getPaymentByRegistrationId(...)` can filter by gateway if needed
- `updatePayment(...)` supports webhook updates from any gateway

### 5. Update the frontend payment flow

Change `components/telc/registration/StepPayment.tsx` to:

- call a new backend route for the selected provider
- receive QR / redirect / deep link payload
- render actual gateway payload instead of placeholder icons
- poll or verify using provider-specific status endpoints
- handle `completed`, `pending`, `failed`, `cancelled` states cleanly

### 6. Keep UI and backend separate

- UI component only chooses gateway and displays result
- route handlers and service layer perform the payment integration
- do not embed Click/Payme/Octo request signing in React components

### 7. Add test coverage

Create tests for:

- request signing and payload generation
- callback authentication
- idempotency / duplicate transaction handling
- amount validation
- status mapping for Click/Payme/Octo

### 8. Add docs

Update:

- `docs/api-reference.md`
- `docs/architecture.md`
- `docs/business-context.md`

with Click/Payme/Octo flows and endpoint contracts.

## Concrete task list

- [x] Keep current Paynet implementation in `app/api/paynet/route.ts`
- [x] Preserve Paynet env vars: `PAYNET_USERNAME`, `PAYNET_PASSWORD`
- [x] Add `app/api/payme/route.ts` — full Payme Merchant API (5 methods)
- [x] Extend `drizzle/schema.ts` for Payme-specific fields (`payme_transaction_id`, timestamps, `payme_reason`) and generic `gateway` column
- [x] Add `NEXT_PUBLIC_PAYME_MERCHANT_ID` / `PAYME_MERCHANT_KEY` / `NEXT_PUBLIC_PAYME_ENV` env vars
- [x] Wire Payme CDN QR (`Paycom.QR` / `Paycom.Button`) in `StepPayment.tsx`
- [x] Add Payme docs to `docs/api-reference.md` and `docs/architecture.md`
- [ ] Create `lib/payment-gateways/index.ts` — shared gateway abstraction
- [ ] Create gateway adapter interfaces/types (support both inbound and outbound flows)
- [ ] Add `PaymentGateway` enum: `paynet | click | payme | octo`
- [ ] Add `lib/payment-gateways/paynet.ts` (refactor existing inbound logic)
- [ ] Add `lib/payment-gateways/click.ts`
- [ ] Add `lib/payment-gateways/octo.ts`
- [ ] Implement `buildOrder`, `handleInboundRequest`, `verifyResponse`, `parseWebhook`, `getStatus`
- [ ] Add `app/api/click/route.ts` — Click inbound handler
- [ ] Add `app/api/octo/route.ts` — Octo handler
- [ ] Replace Click placeholder QR tile with real Click SDK payload
- [ ] Add real payment status polling (replace 2 s simulation in `StepPayment.tsx`)
- [ ] Add env var validation for Click, Octo
- [ ] Write API tests for each gateway
- [ ] Refactor `app/api/paynet/route.ts` to use new gateway abstraction (optional — low priority)

## Key design principles

- DRY: share request signing / webhook parsing in `lib/payment-gateways`
- SOLID:
  - Single Responsibility: route handlers only parse requests and call gateway services
  - Open/Closed: add new gateway adapters without changing core payment flow
  - Liskov: use a common gateway interface for all payment systems (inbound like Paynet, outbound like Click/Payme/Octo)
  - Interface Segregation: UI does not depend on gateway internals
  - Dependency Inversion: route handlers depend on abstractions, not provider details
