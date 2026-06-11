# QuickMaid-App

Native mobile apps for the QuickMaid platform — **Customer** and **Partner** (React Native + Expo SDK 56).

| | |
|---|---|
| **Status** | UI-DEMO complete — both apps ready for Phase 4 API |
| **Docs hub** | **[docs/README.md](./docs/README.md)** — start here for everything |
| **Demo login** | Phone `9876543210` · OTP `123456` |

---

## Repositories

| Repo | Purpose |
|------|---------|
| [QuickMaid](https://github.com/Deepesh2104/QuickMaid) | Web marketing + admin console |
| **QuickMaid-App** (this repo) | Customer + Partner mobile apps |
| QuickMaid-API | Backend REST API (Phase 4 — next) |

---

## Apps

| App | Folder | Android package | Metro port | Docs |
|-----|--------|-----------------|------------|------|
| **Customer** | `apps/customer` | `in.quickmaid.customer` | 8081 | [README](./apps/customer/README.md) |
| **Partner** | `apps/partner` | `in.quickmaid.partner` | 8082 | [README](./apps/partner/README.md) |

Deep links: `quickmaid://` (customer) · `quickmaid-partner://` (partner)

---

## Quick start

### Install & run (two terminals)

**Customer**

```bash
cd apps/customer
npm install
npx expo start --lan --clear
```

**Partner**

```bash
cd apps/partner
npm install
npx expo start --lan --clear --port 8082
```

Use `--port 8082` on partner so both apps run side by side without clashing.

### Demo credentials

| Field | Value |
|-------|-------|
| Phone | `9876543210` |
| OTP (auth) | `123456` |
| Visit complete OTP | `123456` |

---

## Project structure

```
QuickMaid-App/
├── apps/
│   ├── customer/          # Customer app (booking, checkout, Plus)
│   └── partner/           # Partner app (jobs, KYC, earnings)
├── shared/                # Canonical cross-app bridge modules
├── scripts/
│   └── sync-shared-bridge.mjs
├── docs/                  # SRS, TDD, System Design, API, FSD index
└── packages/              # (planned) shared theme, API types
```

**Rules**

- Customer changes → only `apps/customer`
- Partner changes → only `apps/partner`
- Bridge edits → `shared/` then `npm run sync:shared` in either app

---

## Documentation

**Master index:** **[docs/README.md](./docs/README.md)**

### Core specs

| Document | What it covers |
|----------|----------------|
| [SRS](./docs/SRS.md) | Software Requirements Specification |
| [TDD](./docs/TDD.md) | Technical Design Document |
| [SYSTEM-DESIGN-CLIENT](./docs/SYSTEM-DESIGN-CLIENT.md) | Client architecture & Mermaid diagrams |
| [API-CONTRACT](./docs/API-CONTRACT.md) | REST endpoints for Phase 4 backend |
| [TEST-STRATEGY](./docs/TEST-STRATEGY.md) | Unit, E2E, contract testing |
| [CONTRIBUTING](./docs/CONTRIBUTING.md) | Dev workflow & conventions |

### Feature specs (FSD)

| App | Index | Features |
|-----|-------|----------|
| Customer | [apps/customer/docs/FSD/](./apps/customer/docs/FSD/README.md) | 00–16 + [API call sites](./apps/customer/docs/FSD/API_CALL_SITES.md) |
| Partner | [apps/partner/docs/FSD/](./apps/partner/docs/FSD/README.md) | 00–18 + [API call sites](./apps/partner/docs/FSD/API_CALL_SITES.md) |
| Cross-app | [docs/FSD/CROSS-APP-BRIDGE.md](./docs/FSD/CROSS-APP-BRIDGE.md) | Demo booking + status + location bridge |

### Data contracts

| App | File |
|-----|------|
| Customer | [apps/customer/docs/CUSTOMER_DATA.md](./apps/customer/docs/CUSTOMER_DATA.md) |
| Partner | [apps/partner/docs/PARTNER_DATA.md](./apps/partner/docs/PARTNER_DATA.md) |

### QA & environments

| Document | Purpose |
|----------|---------|
| [DEMO_STATUS](./docs/DEMO_STATUS.md) | What's done vs deferred to backend |
| [DEMO_E2E_CHECKLIST](./docs/DEMO_E2E_CHECKLIST.md) | 14-step same-device QA |
| [ENVIRONMENTS](./docs/ENVIRONMENTS.md) | dev / test / beta / prod matrix |

---

## Demo flows

### Customer

1. Splash → Onboarding → City (Raipur)
2. Login `9876543210` → OTP `123456`
3. Signup (new) or home (returning)
4. Browse services → Checkout → Booking created
5. Partner accepts on same device → Track → Rate

### Partner

1. Splash → Onboarding → Login `9876543210` → OTP `123456`
2. Apply (new) or sign in (returning) → KYC if pending
3. **Requests** tab → Accept job
4. Start visit → Complete with OTP `123456`
5. Earnings · Schedule · Profile · Settings

> Same-device bridge: customer order syncs to partner via AsyncStorage. Two physical phones need Phase 4 API.

---

## Environments & builds

Full guide: **[docs/ENVIRONMENTS.md](./docs/ENVIRONMENTS.md)**

| Env | Run / build | API | Play Store |
|-----|-------------|-----|------------|
| dev | `npx expo start --lan` | mock / localhost | — |
| test | `eas build --profile test` | api-test | Internal APK |
| beta | `eas build --profile beta` | api-beta | Closed testing |
| prod | `eas build --profile production` | api.quickmaid.in | Production |

Side-by-side dev installs use package suffixes: `.dev`, `.test` — see ENVIRONMENTS doc.

---

## Play Store (two listings)

| Listing | Package ID | Build from |
|---------|------------|------------|
| QuickMaid | `in.quickmaid.customer` | `apps/customer` |
| QuickMaid Partner | `in.quickmaid.partner` | `apps/partner` |

```bash
cd apps/customer && eas build --platform android
cd apps/partner && eas build --platform android
```

Customer **Become a Partner** CTA → Partner Play Store URL (`apps/customer/src/constants/links.ts`).

---

## Backend (Phase 4)

Both apps call **QuickMaid-API** at `/api/v1/...` with different roles:

| App | Header `X-App-Client` | API focus |
|-----|----------------------|-----------|
| Customer | `customer` | Bookings, wallet, addresses, Plus |
| Partner | `maid` | Jobs, accept/decline, visit OTP, earnings, KYC |

Same phone can hold **both roles** (separate JWT per app). See [API-CONTRACT](./docs/API-CONTRACT.md) and [TDD § API migration](./docs/TDD.md#7-api-integration-plan-phase-4).

**Not wired yet** — mobile uses AsyncStorage + demo bridge today. Flip with `EXPO_PUBLIC_USE_API=true` when API is ready.

---

## Admin (web)

Ops team uses **QuickMaid web admin** (separate repo), not this mobile repo:

- Approve partners → `/admin/maids`
- Dispatch → `/admin/dispatch`
- Payouts → `/admin/payouts`

Partner app = maid's phone UI · Admin = ops dashboard.

---

## Git workflow

```bash
git add apps/customer/    # customer-only changes
git add apps/partner/     # partner-only changes
git add docs/ shared/     # cross-cutting docs & bridge
```

**Commit style:** `feat(customer): …` · `feat(partner): …` · `docs: …` · `chore(shared): …`

---

## Related (other repos)

| Resource | Path |
|----------|------|
| DB schema | `../QuickMaid/docs/database/quickmaid.schema.dbml` |
| Platform overview | `../QuickMaid/docs/PLATFORM.md` |
| Backend plan | `../QuickMaid/docs/PHASE3_BACKEND.md` |

---

## Reading order (new developer)

```
1. docs/README.md              ← Hub
2. docs/SRS.md                 ← What to build
3. docs/SYSTEM-DESIGN-CLIENT.md ← Architecture
4. docs/TDD.md                 ← How it's coded
5. docs/API-CONTRACT.md        ← Backend contract
6. apps/*/docs/FSD/            ← Screen-by-screen detail
7. docs/DEMO_E2E_CHECKLIST.md  ← Verify demo works
```

---

*QuickMaid-App · Customer + Partner · Raipur-first home cleaning platform*
