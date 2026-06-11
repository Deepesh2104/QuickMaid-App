# QuickMaid-App — Demo Complete Status

**Last updated:** documentation pass + pre-Phase-4 polish complete.

**Full docs:** [Documentation Hub](./README.md) · [SRS](./SRS.md) · [TDD](./TDD.md) · [System Design](./SYSTEM-DESIGN-CLIENT.md) · [API Contract](./API-CONTRACT.md)

## Both apps: UI-DEMO complete

Customer + Partner are feature-complete for local demo (AsyncStorage bridges, no QuickMaid-API).

## Intentionally deferred → Phase 4 backend only

| Area | Why deferred |
|------|----------------|
| QuickMaid-API REST / JWT | Requires backend |
| Server webhooks + FCM delivery | Requires backend |
| Server dispatch / offer pool | Requires backend |
| Payment verify (`POST /payments/verify`) | Requires backend |
| Referral server ledger | Requires backend |
| Account delete server grace + token revoke | Requires backend |
| Real WebSocket chat agent | Requires backend |
| Cross-device full sync (2 phones) | Requires API + push |
| KYC production verify (customer N/A) | Partner uses API when `apiBaseUrl` set |

## Optional build-time env (no backend needed)

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_APP_ENV` | Dev/test/beta/prod bundle names |
| `EXPO_PUBLIC_API_BASE_URL` | Partner KYC API when backend exists |
| `EXPO_PUBLIC_RAZORPAY_KEY` | Razorpay demo key display |
| `EXPO_PUBLIC_GOOGLE_PLACES_KEY` | Address search (falls back to Raipur zones) |
| `EXPO_PUBLIC_SENTRY_DSN` | Optional crash reporting |

## Manual QA (your side)

- Run `docs/DEMO_E2E_CHECKLIST.md` on same-device simulator
- Visual check Bookings hero ↔ white sheet

Nothing else is required before Phase 4 API integration.
