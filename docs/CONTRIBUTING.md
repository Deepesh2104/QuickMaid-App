# Contributing — QuickMaid-App

Guide for developers working on Customer + Partner mobile apps.

---

## 1. Prerequisites

- Node.js 20+
- npm 10+
- Expo CLI (`npx expo`)
- Android Studio or physical device
- Two terminals for dual-app development

---

## 2. Clone & install

```bash
git clone <repo-url>
cd QuickMaid-App

cd apps/customer && npm install
cd ../partner && npm install
```

---

## 3. Daily workflow

### Run apps (LAN)

```bash
# Terminal 1 — Customer (port 8081)
cd apps/customer && npx expo start --lan --clear

# Terminal 2 — Partner (port 8082)
cd apps/partner && npx expo start --lan --clear --port 8082
```

**Never swap ports** — deep links and docs assume 8081 / 8082.

### Demo login

| Field | Value |
|-------|-------|
| Phone | `9876543210` |
| OTP | `123456` |

---

## 4. Code organisation rules

| Rule | Detail |
|------|--------|
| Thin routes | `app/*.tsx` delegates to `src/features/` |
| Feature isolation | All domain code in `src/features/<name>/` |
| No cross-app imports | Customer ↔ Partner are separate bundles |
| Storage keys | Customer `@qm/`, Partner `@qmp/` |
| Theme | Use `src/theme/*` — no magic numbers |
| Tab padding | Use `useLayoutMetrics()` |

---

## 5. Editing shared bridge

1. Edit canonical files in `QuickMaid-App/shared/*.ts`
2. Sync to both apps:

```bash
cd apps/customer && npm run sync:shared
# or from partner/
```

3. Re-test [DEMO_E2E_CHECKLIST](./DEMO_E2E_CHECKLIST.md) steps 1–6

---

## 6. Adding a feature

1. Read / update relevant FSD in `apps/<app>/docs/FSD/`
2. Create `src/features/<domain>/components/`
3. Add route in `app/` (thin re-export)
4. Add storage in `lib/*.storage.ts`
5. Document Phase 4 API in FSD + `API_CALL_SITES.md`
6. Update [SRS](./SRS.md) traceability if new requirement

---

## 7. Environment variables

See [ENVIRONMENTS.md](./ENVIRONMENTS.md). Common:

```bash
EXPO_PUBLIC_APP_ENV=dev
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_USE_API=false
```

---

## 8. Testing before PR

```bash
# Customer
cd apps/customer
npm run typecheck
npm test

# Manual
# Run DEMO_E2E_CHECKLIST on emulator
```

---

## 9. Commit conventions

```
feat(customer): add wallet export
fix(partner): job decline reason persistence
docs: add SRS traceability matrix
chore: sync shared bridge
```

Scope: `customer`, `partner`, `shared`, `docs`

---

## 10. Documentation duty

When you change behaviour, update:

| Change | Update |
|--------|--------|
| New screen | App FSD + API_CALL_SITES row |
| New storage key | TDD § Storage + data contract |
| New API endpoint | API-CONTRACT + FSD Phase 4 section |
| Demo ↔ prod shift | DEMO_STATUS.md |

Master index: [docs/README.md](./README.md)

---

## 11. Phase 4 API wiring pattern

```typescript
// hooks/useUserBookings.ts
const useApi = process.env.EXPO_PUBLIC_USE_API === 'true';

export function useUserBookings() {
  return useApi ? useUserBookingsApi() : useUserBookingsStorage();
}
```

See [TDD § API integration](./TDD.md#7-api-integration-plan-phase-4).

---

## 12. Getting help

| Question | Doc |
|----------|-----|
| What should this feature do? | [SRS](./SRS.md) |
| How is it built? | [TDD](./TDD.md) |
| Screen details? | App FSD |
| API shape? | [API-CONTRACT](./API-CONTRACT.md) |

---

*Partner-specific agent rules: `apps/partner/AGENTS.md`*
