# Customer App — Feature Specification Documents (FSD)

In-depth specs for every Customer app feature: screens, components, demo data, **planned REST APIs**, and **exact call sites** (which component/hook calls which endpoint).

| Doc | Feature | Routes | Primary data module |
|-----|---------|--------|---------------------|
| [00-ARCHITECTURE](./00-ARCHITECTURE.md) | Shared API client, auth, errors, migration | — | `src/lib/api/` (future) |
| [API_CALL_SITES](./API_CALL_SITES.md) | **Master matrix** — all components → endpoints | — | — |
| [01-AUTH](./01-AUTH.md) | Splash, onboarding, city, login, OTP, signup, permissions | `app/index`, `app/(auth)/*` | `src/lib/storage.ts` |
| [02-HOME](./02-HOME.md) | Home tab, deliver-to, discovery rails | `app/(tabs)/index` | `useHomeProfile`, `useHomeDeliveryAddress` |
| [03-SERVICE](./03-SERVICE.md) | Service detail, book CTA | `app/service/[id]` | `src/constants/services.ts` |
| [04-CHECKOUT](./04-CHECKOUT.md) | 5-step checkout, payment, partner bridge | `app/checkout/*` | `CheckoutContext`, `bookings.storage.ts` |
| [05-BOOKINGS](./05-BOOKINGS.md) | List, detail, track, reschedule, cancel, rate, invoice | `app/(tabs)/bookings`, `app/booking/*` | `bookings.storage.ts`, `visit-location-bridge.ts` |
| [06-PLUS](./06-PLUS.md) | Plus membership subscribe & manage | `app/(tabs)/plans`, `app/plus/*` | `plus.subscribe.ts`, `profile.storage.ts` |
| [07-PROFILE](./07-PROFILE.md) | Profile tab, wallet, addresses, prefs | `app/(tabs)/profile` | `profile.storage.ts` |
| [08-ACCOUNT](./08-ACCOUNT.md) | Saved services, address picker, delete | `app/account/*` | `profile.storage.ts`, `account.delete.ts` |
| [09-NOTIFICATIONS](./09-NOTIFICATIONS.md) | In-app inbox | `app/notifications/*` | `notifications.storage.ts` |
| [10-SUPPORT](./10-SUPPORT.md) | Live chat, tickets, disputes | `app/support/*`, `app/booking/dispute/[id]` | `support.storage.ts` |
| [11-HELP](./11-HELP.md) | Help tab FAQ & reach ops | `app/(tabs)/support` | `HelpScreen` (static) |
| [12-PAYMENT](./12-PAYMENT.md) | Payment history detail, Razorpay demo | `app/payments/[id]` | `payment.storage.ts` |
| [13-PRO](./13-PRO.md) | Pro directory & profile | `app/pro/*` | `maid.profile.ts` |
| [14-REFERRAL](./14-REFERRAL.md) | Referral code & ledger | `app/account/referrals` | `referral.storage.ts` |
| [15-SECURITY](./15-SECURITY.md) | App lock, PIN, biometrics | `app/account/app-lock` | `appLock.storage.ts` |
| [16-LEGAL](./16-LEGAL.md) | Terms, privacy, policies | `app/legal/[doc]` | `legal.content.ts` |

## How to read an FSD

Each document follows the same sections:

1. **Overview** — purpose, user stories, acceptance criteria  
2. **Route & component map** — Expo route → screen → child components  
3. **Data model** — TypeScript shapes (see also [`CUSTOMER_DATA.md`](../CUSTOMER_DATA.md))  
4. **Current demo behaviour** — AsyncStorage / mock functions today  
5. **Phase 4 API** — method, path, headers, request/response JSON  
6. **API call site matrix** — `Component` → `Hook/Service` → `API endpoint`  
7. **Sequence diagram** — mermaid flow for main user journey  
8. **Errors & edge cases**  
9. **Migration checklist** — what to change when wiring HTTP  

## Related docs

- [Customer README](../../README.md) — setup, architecture, testing  
- [CUSTOMER_DATA.md](../CUSTOMER_DATA.md) — field-level data contract  
- [Partner FSD](../../../partner/docs/FSD/README.md) — mirror structure for maid app  

## Status legend

| Tag | Meaning |
|-----|---------|
| `UI-DEMO` | Screen complete; AsyncStorage only |
| `MOCK-API` | In-app mock (payment gateway simulate) |
| `PHASE-4` | Real QuickMaid-API not wired yet |
