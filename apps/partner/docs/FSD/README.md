# Partner App — Feature Specification Documents (FSD)

In-depth specs for every Partner app feature: screens, components, demo data, **planned REST APIs**, and **exact call sites** (which component/hook calls which endpoint).

| Doc | Feature | Routes | Primary data module |
|-----|---------|--------|---------------------|
| [00-ARCHITECTURE](./00-ARCHITECTURE.md) | Shared API client, auth, errors, migration | — | `src/lib/api/` (future) |
| [API_CALL_SITES](./API_CALL_SITES.md) | **Master matrix** — all components → endpoints | — | — |
| [01-AUTH](./01-AUTH.md) | Splash, onboarding, login, OTP, apply | `app/index`, `app/(auth)/*` | `src/lib/storage.ts` |
| [02-HOME](./02-HOME.md) | Home tab dashboard | `app/(tabs)/index` | `PartnerContext`, `usePartnerJobs` |
| [03-JOBS](./03-JOBS.md) | Requests, job detail, visit flow, history | `app/(tabs)/requests`, `app/job/*` | `jobs.storage.ts`, `job.completion.ts` |
| [04-SCHEDULE](./04-SCHEDULE.md) | Week calendar, visit cards | `app/(tabs)/schedule` | `usePartnerJobs` |
| [05-EARNINGS](./05-EARNINGS.md) | Balance, ledger, job focus | `app/(tabs)/earnings` | `DEMO_EARNINGS`, jobs |
| [06-PAYOUT](./06-PAYOUT.md) | Payout detail | `app/payout/[id]` | `payout.utils.ts` |
| [07-KYC](./07-KYC.md) | 6-step KYC wizard | `app/kyc` | `kyc.storage.ts`, mock verify APIs |
| [08-PROFILE](./08-PROFILE.md) | Profile, photo, rating, work address | `app/(tabs)/profile`, `app/profile/*` | `PartnerContext` |
| [09-SETTINGS](./09-SETTINGS.md) | Settings hub | `app/settings` | Navigation only |
| [10-SLOTS](./10-SLOTS.md) | Preferred work slots | `app/slots` | `PartnerContext.preferredSlotIds` |
| [11-NOTIFICATIONS](./11-NOTIFICATIONS.md) | In-app inbox | `app/notifications/*` | `notifications.storage.ts` |
| [12-SUPPORT](./12-SUPPORT.md) | Live chat tickets | `app/support/chat` | `support.storage.ts` |
| [13-HELP](./13-HELP.md) | FAQ tab, reach ops | `app/(tabs)/help` | Static + support hooks |
| [14-REFERRAL](./14-REFERRAL.md) | Referral code & history | `app/referral` | `referral.demo.ts` |
| [15-BOOK-HOME](./15-BOOK-HOME.md) | Dual-role customer handoff | `app/book-home` | Deep link only |
| [16-LEGAL](./16-LEGAL.md) | Terms, privacy, policies | `app/legal/[slug]` | Static content |
| [17-ACCOUNT](./17-ACCOUNT.md) | Delete account | `app/account/delete` | `deletePartnerAccount()` |

## How to read an FSD

Each document follows the same sections:

1. **Overview** — purpose, user stories, acceptance criteria  
2. **Route & component map** — Expo route → screen → child components  
3. **Data model** — TypeScript shapes (see also [`PARTNER_DATA.md`](../PARTNER_DATA.md))  
4. **Current demo behaviour** — AsyncStorage / mock functions today  
5. **Phase 4 API** — method, path, headers, request/response JSON  
6. **API call site matrix** — `Component` → `Hook/Service` → `API endpoint`  
7. **Sequence diagram** — mermaid flow for main user journey  
8. **Errors & edge cases**  
9. **Migration checklist** — what to change when wiring HTTP  

## Related docs

- [Partner README](../../README.md) — setup, architecture, testing  
- [PARTNER_DATA.md](../PARTNER_DATA.md) — field-level data contract  
- [PARTNER_APP.md](../PARTNER_APP.md) — short blueprint  

## Status legend

| Tag | Meaning |
|-----|---------|
| `UI-DEMO` | Screen complete; AsyncStorage only |
| `MOCK-API` | In-app mock (KYC PAN/bank/UPI) |
| `PHASE-4` | Real QuickMaid-API not wired yet |
