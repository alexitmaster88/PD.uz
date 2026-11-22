-- Applied manually in the Supabase SQL editor. Additive only: adds columns and one enum value, changes no existing rows.
-- Project vahydwolnmofshbmhdst. Safe to re-run (IF NOT EXISTS).

-- 1. Columns the Payme Merchant API route (app/api/payme/route.ts) reads and writes.
--    Without them every Payme CreateTransaction fails with "System error".
--    payer_inn / check_id: used by POST /api/telc/payments (currently falls back to omitting them).
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS payme_transaction_id text,
  ADD COLUMN IF NOT EXISTS payme_create_time    text,
  ADD COLUMN IF NOT EXISTS payme_perform_time   text,
  ADD COLUMN IF NOT EXISTS payme_cancel_time    text,
  ADD COLUMN IF NOT EXISTS payme_reason         integer,
  ADD COLUMN IF NOT EXISTS payer_inn            text,
  ADD COLUMN IF NOT EXISTS check_id             text;

-- One payment row per Payme transaction (idempotency). All existing rows are NULL, so this cannot fail.
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_payme_transaction_id
  ON payments (payme_transaction_id)
  WHERE payme_transaction_id IS NOT NULL;

-- 2. Status used by the admin "Deny" action and the OTP email block.
ALTER TYPE registration_status ADD VALUE IF NOT EXISTS 'denied';
