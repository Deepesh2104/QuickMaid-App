# QuickMaid Partner App — Agent guide

Read [`README.md`](./README.md) before changing this app. Data shapes: [`docs/PARTNER_DATA.md`](./docs/PARTNER_DATA.md).

## Scope

- Edit only `apps/partner/` unless extracting shared code to `packages/shared`.
- Customer app is `apps/customer/` — do not mix partner job logic into customer routes.

## Architecture rules

- **Thin routes** in `app/` — screens live in `src/features/<domain>/components/`.
- **Persistence** via `src/lib/storage.ts` and `src/features/*/lib/*.storage.ts` — no `fetch` until Phase 4 API.
- **Premium UI** — prefer `PartnerStackShell` + `PartnerRequestsSectionHeader` + `*.premium.ts` constants.
- **Splash** must stay `app/index.tsx`; use `getInitialRoute()` from `src/lib/storage.ts`.

## Demo values

| Item | Value |
|------|-------|
| Phone | `9876543210` |
| OTP | `123456` |
| Visit OTP | `123456` |
| PAN | `ABCDE1234F` |

## Commands

```bash
npm start          # port 8082
npm run typecheck
```

## Do not

- Re-add `expo-notifications` / push unless user explicitly asks.
- Commit secrets or `.env` with real API keys.
- Use port 8081 (reserved for customer app).
