-- Migration 002: Protect has_paid column from client-side bypass
--
-- SECURITY FIX: The RLS policy on child_profiles allows parents to UPDATE
-- any column on their own children, including has_paid. A technically savvy
-- user could call supabase.from('child_profiles').update({ has_paid: true })
-- to bypass payment entirely.
--
-- This trigger silently reverts any has_paid change made by an authenticated
-- user. Only the service role (used by the Stripe webhook Edge Function)
-- can modify has_paid, because auth.uid() returns NULL for service role calls.
--
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

CREATE OR REPLACE FUNCTION public.protect_has_paid_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- auth.uid() is NULL when using the service role key (Edge Functions).
  -- auth.uid() is set for normal authenticated users.
  -- Only allow has_paid changes when auth.uid() is NULL (service role).
  IF NEW.has_paid IS DISTINCT FROM OLD.has_paid AND auth.uid() IS NOT NULL THEN
    NEW.has_paid := OLD.has_paid;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_has_paid
  BEFORE UPDATE ON child_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_has_paid_column();
