# Environment Separation Guide

## Overview

Test and production must be fully separated so that test payments, webhooks, and data never touch real systems.

## Current State

- **Supabase**: Single project used for both dev and prod
- **Stripe**: Test mode keys (`pk_test_*`, `sk_test_*`) used in dev; live keys needed for prod
- **Vercel**: Auto-deploys from Git. Environment variables set in Vercel dashboard.

## Required Separation

### 1. Supabase: Create a Separate Dev Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project** — name it `answerthequestion-dev`
3. Run the same SQL migrations to create tables (`child_profiles`, `user_progress`, `daily_sessions`, `question_results`, `earned_badges`, `payments`)
4. Ensure `has_paid` column exists: `ALTER TABLE child_profiles ADD COLUMN has_paid boolean DEFAULT false;`
5. Enable Row Level Security on all tables (match production RLS policies)
6. Note the new project's URL and anon key

### 2. Local Development (.env.local)

Create `.env.local` with the **dev** Supabase project credentials and **test** Stripe keys:

```
VITE_SUPABASE_URL=https://your-DEV-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-dev-anon-key
```

### 3. Vercel: Production Environment Variables

In Vercel dashboard > Project Settings > Environment Variables:

| Variable | Environment | Value |
|----------|-------------|-------|
| `VITE_SUPABASE_URL` | Production | `https://your-PROD-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Production | `your-prod-anon-key` |

Do NOT set these for "Preview" — preview deployments should use dev credentials.

### 4. Supabase Edge Function Secrets

**Production project:**
```bash
supabase link --project-ref YOUR_PROD_REF
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_live_...
supabase secrets set ZOHO_SMTP_PASSWORD=your-zoho-password
```

**Dev project:**
```bash
supabase link --project-ref YOUR_DEV_REF
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_test_...
supabase secrets set ZOHO_SMTP_PASSWORD=your-zoho-password
supabase secrets set ALLOW_LOCALHOST=true
```

### 5. Stripe Webhooks

- **Production webhook**: Points to `https://YOUR_PROD_REF.supabase.co/functions/v1/stripe-webhook`
- **Test webhook**: Points to `https://YOUR_DEV_REF.supabase.co/functions/v1/stripe-webhook`

Never point a test webhook at the production Supabase function.

### 6. Verification Checklist

- [ ] Dev `.env.local` points to dev Supabase project
- [ ] Vercel production env vars point to prod Supabase project
- [ ] Stripe test webhook points to dev Supabase function
- [ ] Stripe live webhook points to prod Supabase function
- [ ] Dev Supabase has `ALLOW_LOCALHOST=true`, prod does NOT
- [ ] Both projects have identical table schemas and RLS policies
- [ ] Test with `4242 4242 4242 4242` on dev, real cards on prod
