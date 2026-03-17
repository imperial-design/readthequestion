# Secret Rotation Policy

## Schedule

All secrets must be rotated every **90 days**. Set calendar reminders.

| Secret | Location | How to Rotate | Last Rotated | Next Due |
|--------|----------|---------------|--------------|----------|
| `STRIPE_SECRET_KEY` | Supabase secrets | Stripe Dashboard > Developers > API Keys > Roll key | _fill in_ | _fill in_ |
| `STRIPE_WEBHOOK_SECRET` | Supabase secrets | Stripe Dashboard > Developers > Webhooks > Roll secret | _fill in_ | _fill in_ |
| `ZOHO_SMTP_PASSWORD` | Supabase secrets | Zoho Mail > Settings > App Passwords > Generate new | _fill in_ | _fill in_ |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-provided by Supabase | Supabase Dashboard > Settings > API > Regenerate service role key | _fill in_ | _fill in_ |
| `VITE_SUPABASE_ANON_KEY` | `.env.local` + Vercel | Supabase Dashboard > Settings > API > Regenerate anon key | _fill in_ | _fill in_ |

## Rotation Procedures

### Stripe Secret Key
1. Go to Stripe Dashboard > Developers > API Keys
2. Click "Roll key" on the secret key
3. Stripe gives you a grace period where both old and new keys work
4. Update in Supabase: `supabase secrets set STRIPE_SECRET_KEY=sk_live_NEW...`
5. Redeploy edge functions: `supabase functions deploy create-checkout-session && supabase functions deploy stripe-webhook --no-verify-jwt`
6. Verify a test checkout works
7. Expire the old key in Stripe

### Stripe Webhook Secret
1. Go to Stripe Dashboard > Developers > Webhooks > your endpoint
2. Click "Roll secret"
3. Update: `supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_NEW...`
4. Redeploy: `supabase functions deploy stripe-webhook --no-verify-jwt`
5. Send a test event from Stripe to verify

### Zoho SMTP Password
1. Log into Zoho Mail admin
2. Go to Settings > App Passwords (or Security > App Passwords)
3. Generate a new app-specific password
4. Update: `supabase secrets set ZOHO_SMTP_PASSWORD=new_password`
5. Redeploy: `supabase functions deploy stripe-webhook --no-verify-jwt && supabase functions deploy send-welcome-email`
6. Revoke the old app password

### Supabase Keys
1. Go to Supabase Dashboard > Settings > API
2. Click "Regenerate" on the relevant key
3. For anon key: update `.env.local` and Vercel environment variables
4. Redeploy frontend (Vercel auto-deploys on env var change if configured)
5. For service role key: edge functions pick it up automatically (auto-injected)

## Calendar Reminders

Set recurring 90-day reminders for:
- "Rotate Stripe keys (ATQ!)"
- "Rotate Zoho SMTP password (ATQ!)"
- "Review Supabase key rotation (ATQ!)"
