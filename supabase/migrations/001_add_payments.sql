-- Migration: Add has_paid column to child_profiles and create payments table
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Add has_paid column to child_profiles
alter table child_profiles
  add column if not exists has_paid boolean not null default false;

-- 2. Create payments table
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text,
  amount_pence int not null,
  currency text not null default 'gbp',
  status text not null default 'pending',
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- 3. RLS for payments table
alter table payments enable row level security;

-- Parents can read their own payments
create policy "Parents can read own payments"
  on payments for select
  using (parent_id = auth.uid());

-- Service role (Edge Functions) can insert/update — no user policy needed for writes
-- The Edge Functions use SUPABASE_SERVICE_ROLE_KEY which bypasses RLS

-- 4. Index for faster lookups
create index if not exists idx_payments_parent_id on payments(parent_id);
create index if not exists idx_payments_session_id on payments(stripe_checkout_session_id);
