# Guest Checkout: Auth Trade-off Decision

## Context

Security rule 13 states: "Every endpoint must have auth AND rate limiting — no exceptions."

The `create-checkout-session` endpoint intentionally allows unauthenticated requests to support **guest checkout** — users can pay before creating an account.

## Decision

**Guest checkout without auth is an accepted trade-off.** Rationale:

1. **Business requirement**: Reducing friction in the purchase funnel. Users should be able to pay immediately from the landing page without creating an account first.
2. **Rate limiting is in place**: 10 requests per minute per IP address, which prevents automated abuse.
3. **Stripe handles payment security**: The endpoint only creates a Stripe Checkout Session. No sensitive data is exposed. Stripe handles PCI compliance, card validation, and fraud detection.
4. **Post-purchase account linking**: The `claim-payment` edge function links guest payments to accounts by matching email when the user later signs up.
5. **No data exposure**: The endpoint returns only a Stripe Checkout URL. It does not expose any user data, payment data, or application state.

## Mitigations

- IP-based rate limiting (10/min) via `_shared/rate-limit.ts`
- CORS restricted to allow-listed domains only
- Stripe's own fraud detection and rate limiting
- The success/cancel URLs are validated against a trusted origin allow-list

## Review

This decision should be revisited if:
- Abuse is detected (monitor Stripe for suspicious checkout sessions)
- The business model changes to require accounts before payment
- Rate limiting proves insufficient (consider adding CAPTCHA or fingerprinting)
