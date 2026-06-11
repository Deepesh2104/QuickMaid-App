# Technical Design Document (TDD)

**Scope:** QuickMaid-App monorepo — Customer + Partner mobile clients  
**Stack:** React Native 0.76+, Expo SDK 56, Expo Router 4, TypeScript  
**Status:** UI-DEMO complete · HTTP layer planned (Phase 4)

---

## 1. Purpose

This TDD describes **how** the mobile clients are structured technically: folders, data flow, state, security, bridges, and the migration path to QuickMaid-API. For *what* the product must do, see [SRS](./SRS.md). For screen-level detail, see [FSD](./FSD/README.md).

---

## 2. Monorepo layout

```
QuickMaid-App/
├── apps/
│   ├── customer/                 # Customer app (port 8081)
│   │   ├── app/                  # Expo Router — thin re-exports only
│   │   ├── shared/               # Metro copy of root shared/ (sync script)
│   │   └── src/
│   │       ├── features/         # Domain modules (17 domains)
│   │       ├── context/          # AuthFlowContext, CheckoutContext
│   │       ├── lib/              # storage, bridges, observability
│   │       ├── components/       # Shared UI (QmLogo, TabBar, …)
│   │       ├── theme/            # colors, spacing, fonts, layout.metrics
│   │       ├── hooks/            # useLayoutMetrics, useAppFonts, …
│   │       ├── constants/        # demo data, STORAGE_KEYS
│   │       └── i18n/             # en.ts, hi.ts, LanguageProvider
│   └── partner/                  # Partner app (port 8082)
│       ├── app/
│       ├── shared/
│       └── src/
│           ├── features/         # 16 domains
│           ├── context/          # PartnerContext, PartnerJobsContext, …
│           └── lib/
├── shared/                       # Canonical bridge modules (source of truth)
│   ├── booking-bridge.ts
│   ├── booking-status-bridge.ts
│   ├── visit-location-bridge.ts
│   ├── visit-complete-bridge.ts
│   └── demo-otp.ts
├── scripts/
│   └── sync-shared-bridge.mjs    # npm run sync:shared
└── docs/                         # This documentation set
```

### 2.1 Dependency rules

| Rule | Rationale |
|------|-----------|
| Customer code stays in `apps/customer` | Independent release |
| Partner code stays in `apps/partner` | Independent release |
| Cross-app types only in `shared/` | Single bridge contract |
| No customer → partner imports | Metro bundles are separate |
| `app/*.tsx` ≤ 20 lines ideally | Routes delegate to `src/features/` |

### 2.2 Planned `packages/shared` (Phase 5)

Extract: theme tokens, API types generated from OpenAPI, shared utils. Not created yet.

---

## 3. Architecture pattern

### 3.1 Layered model

```
┌─────────────────────────────────────────┐
│  app/ (Expo Router) — routing only      │
├─────────────────────────────────────────┤
│  features/<domain>/components/ — UI     │
├─────────────────────────────────────────┤
│  features/<domain>/hooks/ — state       │
├─────────────────────────────────────────┤
│  features/<domain>/lib/                   │
│    *.storage.ts  ← demo (today)         │
│    *.api.ts      ← HTTP (Phase 4)       │
├─────────────────────────────────────────┤
│  context/ — cross-feature session state │
├─────────────────────────────────────────┤
│  lib/storage.ts — AsyncStorage wrapper  │
│  lib/api/        — customerClient (future)│
└─────────────────────────────────────────┘
```

### 3.2 Feature module anatomy

```
src/features/bookings/
├── components/       # BookingsScreen, BookingCard, …
├── hooks/            # useUserBookings, useOpenRateBooking
├── lib/
│   ├── bookings.core.storage.ts    # CRUD (no bridge import)
│   ├── bookings.review.storage.ts  # Review + rating bridge
│   ├── bookings.storage.ts         # Facade re-exports
│   └── bookings.utils.ts
├── constants/
└── types/
```

**Require-cycle rule:** Core storage must not import bridge modules. Review/status modules import core only.

---

## 4. Navigation

### 4.1 Expo Router structure

**Customer** (`apps/customer/app/`):

| Group | Purpose |
|-------|---------|
| `index.tsx` | Splash → route guard |
| `(auth)/` | Login, OTP, signup, onboarding |
| `(tabs)/` | Main tabs (home, bookings, catalogue, plans, support) |
| `checkout/` | 5-step checkout stack |
| `booking/` | Detail, track, cancel, rate, … |
| `service/`, `pro/`, `plus/`, `account/`, … | Feature stacks |

**Partner** (`apps/partner/app/`):

| Group | Purpose |
|-------|---------|
| `(tabs)/` | home, requests, schedule, earnings, help |
| `job/` | Job detail, visit flow |
| `kyc/` | KYC wizard |
| `settings/`, `payout/`, … | Feature stacks |

### 4.2 Deep links

| Scheme | Example | Use |
|--------|---------|-----|
| `quickmaid://` | `quickmaid://booking/abc` | Customer |
| `quickmaid-partner://` | `quickmaid-partner://booking?ref=abc` | Cross-device order handoff |

Configured in `app.config.ts` per app.

---

## 5. State management

No Redux. Pattern:

| Layer | Tool | Examples |
|-------|------|----------|
| Global pre-auth | React Context | `AuthFlowContext` |
| Checkout session | React Context | `CheckoutContext` |
| Partner profile + online | React Context | `PartnerContext` |
| Feature data | Custom hooks + storage | `useUserBookings`, `usePartnerJobs` |
| UI ephemeral | `useState` / `useRef` | Modals, sheets |
| Persistence | AsyncStorage | All demo entities |
| Secrets | expo-secure-store | JWT (Phase 4), app lock hash |

### 5.1 Storage key namespaces

| App | Prefix | Constants file |
|-----|--------|----------------|
| Customer | `@qm/` | `apps/customer/src/constants/app.ts` |
| Partner | `@qmp/` | `apps/partner/src/constants/app.ts` |
| Bridge (shared) | `@qm/booking_*` | `shared/*.ts` |

Full key list: [SYSTEM-DESIGN-CLIENT § Storage](./SYSTEM-DESIGN-CLIENT.md#5-storage--bridge-keys)

---

## 6. Cross-app bridge (demo)

Canonical modules in `QuickMaid-App/shared/`. After edit:

```bash
cd apps/customer && npm run sync:shared
# or from partner/
```

| Module | Write side | Read side |
|--------|------------|-----------|
| `booking-bridge` | Customer checkout | Partner ingest |
| `booking-status-bridge` | Both | Both (idempotent) |
| `visit-location-bridge` | Partner GPS | Customer track |
| `visit-complete-bridge` | Partner OTP done | Customer modal |

**Phase 4 replacement:** Each bridge maps to API endpoints + webhooks — see [CROSS-APP-BRIDGE](./FSD/CROSS-APP-BRIDGE.md#phase-4-replacement).

---

## 7. API integration plan (Phase 4)

### 7.1 Feature flag

```typescript
const useApi = process.env.EXPO_PUBLIC_USE_API === 'true';
```

Hooks branch:

```typescript
export function useUserBookings() {
  return useApi ? useUserBookingsApi() : useUserBookingsStorage();
}
```

### 7.2 Planned client modules

**Customer:** `src/lib/api/customerClient.ts`  
**Partner:** `src/lib/api/partnerClient.ts`

| Concern | Implementation |
|---------|----------------|
| Base URL | `EXPO_PUBLIC_API_BASE_URL` |
| Auth header | `Authorization: Bearer <jwt>` |
| Role header | `X-App-Client: customer \| maid` |
| Token storage | `expo-secure-store` |
| Refresh | `POST /auth/refresh` on 401 |
| Errors | Typed `ApiError { code, message, status }` |

### 7.3 Service file convention

```
features/<domain>/lib/<domain>.api.ts   # fetch only
features/<domain>/lib/<domain>.storage.ts # demo persistence
features/<domain>/hooks/use<Domain>.ts   # orchestration
```

Endpoint ownership: see [API-CONTRACT](./API-CONTRACT.md) and per-app `API_CALL_SITES.md`.

---

## 8. Authentication & security

### 8.1 Demo auth flow

1. Phone entry → `AuthFlowContext.setPhone`
2. OTP screen → compare `DEMO_OTP` from `shared/demo-otp.ts`
3. Signup / sign-in → write `STORAGE_KEYS` profile + session flags
4. Splash `getInitialRoute()` reads flags

### 8.2 Phase 4 auth flow

1. `POST /auth/otp/send`
2. `POST /auth/otp/verify` → JWT + refresh
3. Store tokens in SecureStore
4. Splash calls `GET /customers/me` or `GET /maids/me`

### 8.3 App lock (customer)

- PIN hashed with PBKDF2-style derivation (`expo-crypto`)
- Hash in SecureStore `@qm/secure/app_lock_pin_hash`
- `AppLockGate` wraps root layout

### 8.4 Account deletion

- Demo: wipe all `STORAGE_KEYS` + bridge keys
- Phase 4: `POST .../delete-request` then local wipe on confirm

---

## 9. Payments

| Step | Demo | Phase 4 |
|------|------|---------|
| Create order | `simulatePayment()` | `POST /payments/orders` |
| Razorpay UI | `RazorpayGatewayModal` | Same + server verify |
| Key source | `EXPO_PUBLIC_RAZORPAY_KEY` | Per env in EAS secrets |
| Wallet top-up | Local balance patch | `POST /wallet/topup` |

---

## 10. Notifications

| App | Demo | Phase 4 |
|-----|------|---------|
| Customer | Local inbox + `push-token.ts` stores device token | FCM via API |
| Partner | In-app inbox only | Optional FCM later |

Bridge events also insert inbox items (e.g. `partner_accepted`).

---

## 11. UI system

### 11.1 Theme

- `src/theme/colors.ts` — brand teal, ink, muted
- `src/theme/spacing.ts` — `layout.pad`, `spacing.*`, `radius.*`
- `src/theme/fonts.ts` — Plus Jakarta Sans family
- `src/theme/layout.metrics.ts` — tab bar height, scroll padding

### 11.2 Layout conventions

- **Hero + white sheet:** Home, Bookings, Help, Profile, Plus tabs
- **Auth hero + bottom sheet:** `AuthScreenLayout`
- **Tab scroll padding:** `useLayoutMetrics().tabScrollPad` — small tail gap only (tab bar is in layout flow)

### 11.3 i18n

- `LanguageProvider` + `useTranslation()`
- Files: `src/i18n/en.ts`, `hi.ts`
- Profile language picker persists preference

---

## 12. Observability

| Tool | Config | Status |
|------|--------|--------|
| Sentry | `EXPO_PUBLIC_SENTRY_DSN` | Optional, `initObservability()` |
| Console | Dev only | Metro logs |

---

## 13. Environment & build

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_APP_ENV` | dev / test / beta / prod |
| `EXPO_PUBLIC_API_BASE_URL` | API host |
| `EXPO_PUBLIC_USE_API` | Storage vs HTTP switch |
| `EXPO_PUBLIC_RAZORPAY_KEY` | Payment |
| `EXPO_PUBLIC_GOOGLE_PLACES_KEY` | Address search |
| `EXPO_PUBLIC_SENTRY_DSN` | Crashes |

Profiles in `app.config.ts` + `eas.json`. Full matrix: [ENVIRONMENTS](./ENVIRONMENTS.md).

---

## 14. Error handling

| Layer | Strategy |
|-------|----------|
| Storage read | Return null / default; log in dev |
| Bridge apply | Idempotency keys prevent duplicate events |
| API (Phase 4) | Map status → user toast; retry GET once |
| Checkout payment | Roll back draft; show gateway error |
| KYC verify | Inline field errors from mock/API |

---

## 15. Performance

- Pagination: `usePagination` + `ListPagination` on long lists
- Booking location poll: 8s interval on track screen
- Images: `HomePhoto` with unsplash URIs; local assets for icons
- Skeleton loaders: `HomeSkeleton`, `BookingListSkeleton`
- Metro: `npm run sync:shared` after bridge edits; `--clear` on native module changes

---

## 16. Testing

See [TEST-STRATEGY](./TEST-STRATEGY.md). Today:

- Jest configured in customer app
- `appLock.utils.test.ts` — only unit tests
- E2E: manual [DEMO_E2E_CHECKLIST](./DEMO_E2E_CHECKLIST.md)

---

## 17. Migration checklist (storage → API)

Per feature FSD § Migration checklist. Global steps:

1. [ ] Implement `customerClient.ts` / `partnerClient.ts`
2. [ ] Add `*.api.ts` per domain
3. [ ] Branch hooks on `EXPO_PUBLIC_USE_API`
4. [ ] Wire auth splash to `GET /me`
5. [ ] Replace `pushBookingToPartnerBridge` with order API
6. [ ] Replace status bridge with webhooks + polling
7. [ ] Replace location bridge with `GET/POST .../location`
8. [ ] Payment verify endpoint
9. [ ] Remove bridge keys from account delete wipe list (or keep for migration period)
10. [ ] Contract tests against QuickMaid-API OpenAPI

---

## 18. Related documents

| Doc | Topic |
|-----|-------|
| [SRS](./SRS.md) | Requirements |
| [SYSTEM-DESIGN-CLIENT](./SYSTEM-DESIGN-CLIENT.md) | Diagrams |
| [API-CONTRACT](./API-CONTRACT.md) | REST endpoints |
| [FSD](./FSD/README.md) | Per-feature specs |
| [CONTRIBUTING](./CONTRIBUTING.md) | Dev workflow |

---

*This TDD is the technical companion to per-app `00-ARCHITECTURE.md` FSDs.*
