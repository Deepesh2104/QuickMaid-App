# QuickMaid Partner App — Blueprint

> **Full documentation:** [`../README.md`](../README.md) (setup, routing, API plan, KYC, jobs, testing)  
> **Data contract:** [`PARTNER_DATA.md`](./PARTNER_DATA.md)

Premium partner (maid) app at `apps/partner`. Shares monorepo with Customer; separate Play Store listing (`in.quickmaid.partner`).

## Quick facts

| Item | Value |
|------|-------|
| Expo SDK | 56 |
| Dev port | `8082` |
| Scheme | `quickmaid-partner` |
| Runtime | UI demo — AsyncStorage, no HTTP |
| Screens | 32+ routes — **UI complete** |
| API | Phase 4 — not started |

## Screen phases (all UI built)

| Phase | Screens | Status |
|-------|---------|--------|
| 1 | Splash, Onboarding, Login, OTP, Apply, Tabs (Jobs, Requests, Schedule, Earnings, Help, Profile) | ✅ |
| 2 | Job detail, Accept/decline, Navigate, Start visit, OTP complete, KYC wizard | ✅ |
| 3 | Payouts, Support chat, Notifications, Book-home, Settings, Referral, Legal, Delete | ✅ |
| 4 | REST API + PostgreSQL | ❌ Planned |

## Demo login

```
Phone: 9876543210
OTP:   123456
```

## Run

```bash
cd apps/partner
npm install
npx expo start --port 8082
```

## Data keys (prefix `@qmp/`)

`partner_profile`, `partner_state`, `partner_jobs`, `partner_kyc_draft`, `partner_notifications_*`, `partner_support_tickets`

See [`PARTNER_DATA.md`](./PARTNER_DATA.md) for field-level shapes.

## Dual role

Same phone can be customer + maid (`user_roles`). **Book for my home** opens Customer app / Play Store.

## Related

- [Partner README](../README.md)
- [Customer README](../../customer/README.md)
- [ENVIRONMENTS.md](../../docs/ENVIRONMENTS.md)
- [PLATFORM.md](../../../QuickMaid/docs/PLATFORM.md)
