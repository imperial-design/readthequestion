-- Migration 003: Support guest checkout (pay first, create account after)
--
-- Changes:
--   1. Make parent_id nullable on payments (guests have no account yet)
--   2. Add customer_email column to payments (for linking payment to account later)
--   3. Add include_crib_sheet column to payments (was missing from schema)
--   4. Update RLS: allow reading payments by email (for logged-in users claiming payments)
--   5. Add index on customer_email for fast claim lookups
--
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Make parent_id nullable (guests won't have an account at checkout time)
ALTER TABLE payments ALTER COLUMN parent_id DROP NOT NULL;

-- 2. Add customer_email column
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS customer_email text;

-- 3. Add include_crib_sheet column (if not already present)
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS include_crib_sheet boolean NOT NULL DEFAULT false;

-- 4. Update RLS — allow logged-in users to read payments matching their email
--    (needed so claim-payment can find unclaimed payments)
--    Service role bypasses RLS, but this is useful if we ever query from the client.
CREATE POLICY "Users can read payments by email"
  ON payments FOR SELECT
  USING (
    customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- 5. Index for fast lookups when claiming payments by email
CREATE INDEX IF NOT EXISTS idx_payments_customer_email ON payments(customer_email);
