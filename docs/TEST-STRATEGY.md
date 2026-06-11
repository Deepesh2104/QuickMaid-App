# Test Strategy — QuickMaid Mobile

**Apps:** Customer + Partner  
**Current maturity:** Demo complete · automated tests minimal · manual E2E checklist primary

---

## 1. Goals

| Goal | Priority |
|------|----------|
| Prevent regressions in booking + bridge flows | High |
| Validate Phase 4 API contract alignment | High (when API exists) |
| Catch UI layout issues on tab screens | Medium |
| Security: app lock, session wipe | Medium |

---

## 2. Test pyramid

```
        ┌─────────┐
        │  E2E    │  Manual checklist + Detox (future)
        ├─────────┤
        │ Integr. │  API contract tests (Phase 4)
        ├─────────┤
        │  Unit   │  Utils, parsers, bridge idempotency
        └─────────┘
```

---

## 3. What exists today

| Type | Location | Count |
|------|----------|-------|
| Unit | `apps/customer/src/features/security/lib/__tests__/appLock.utils.test.ts` | 3 tests |
| Jest config | `apps/customer/package.json` | Customer only |
| Manual E2E | [DEMO_E2E_CHECKLIST](./DEMO_E2E_CHECKLIST.md) | 14 steps |
| Typecheck | `npm run typecheck` (customer) | Static |

**Partner app:** No Jest tests yet.

---

## 4. Manual testing (required before release)

### 4.1 Same-device E2E

Run [DEMO_E2E_CHECKLIST](./DEMO_E2E_CHECKLIST.md) with:

```bash
# Terminal 1
cd apps/customer && npx expo start --lan --clear

# Terminal 2
cd apps/partner && npx expo start --lan --clear --port 8082
```

Credentials: phone `9876543210`, OTP `123456`.

### 4.2 Visual QA checklist

| Screen | Check |
|--------|-------|
| Home | Hero, rails, footer spacing above tab bar |
| Bookings | Filter rail, cards, footer |
| Help | Footer not clipped by tab bar |
| Plus | Sticky CTA clears content |
| Partner Requests | Accept / decline flow |
| Partner visit | OTP complete → customer modal |

### 4.3 Cross-device limitation

Two physical phones **do not** share AsyncStorage. Only deep-link handoff works until Phase 4 API.

---

## 5. Unit testing plan

### 5.1 High-value targets

| Module | Tests to add |
|--------|--------------|
| `appLock.utils.ts` | ✅ Done |
| `booking-status-bridge` | Idempotency key dedup |
| `bookings.utils.ts` | Filter / sort |
| `dispatch.match.ts` (partner) | Auto-assign rules |
| `payout.utils.ts` | Batch calculation |
| `support.utils.ts` | Topic normalisation |
| `referral.utils.ts` | Code generation |

### 5.2 Conventions

```
src/features/<domain>/lib/__tests__/<file>.test.ts
```

- Mock `expo-crypto`, `expo-secure-store`, `@react-native-async-storage/async-storage`
- No snapshot tests for full screens (too brittle)
- Pure functions first

### 5.3 Commands

```bash
cd apps/customer && npm test
cd apps/customer && npm run typecheck
```

---

## 6. Integration testing (Phase 4)

When QuickMaid-API is available:

| Suite | Tool | Scope |
|-------|------|-------|
| Contract | Jest + `openapi-fetch` or MSW | Response shapes match mobile types |
| Auth flow | Against staging API | OTP → JWT → `/me` |
| Booking CRUD | Staging | Create → accept → complete |
| Error codes | Staging | 401 refresh, 409 conflict |

Run against `EXPO_PUBLIC_API_BASE_URL` test environment — see [ENVIRONMENTS](./ENVIRONMENTS.md).

---

## 7. E2E automation (future)

| Tool | Candidate |
|------|-----------|
| Detox | Native tap flows on Android |
| Maestro | YAML flows, faster setup |

**Priority flows for automation:**

1. Login → home
2. Checkout → booking created
3. Partner accept → customer status update (same emulator with both apps)

---

## 8. CI pipeline (planned)

```yaml
# Suggested GitHub Actions
- npm ci (customer)
- npm run typecheck
- npm test
- npm ci (partner)
- npm run typecheck (when added)
```

Not yet in repo — add with Phase 4.

---

## 9. Regression triggers

Re-test full E2E checklist when changing:

- `shared/*.ts` bridge modules
- `CheckoutContext` / `processPaymentAndPlaceOrder`
- `jobs.storage` accept/decline/complete
- `tabScrollPadding` / layout metrics
- Auth splash routing
- `app.config.ts` / deep links

Always run `npm run sync:shared` after bridge edits.

---

## 10. Defect severity

| Severity | Example | Action |
|----------|---------|--------|
| P0 | Cannot complete booking | Block release |
| P1 | Bridge desync on same device | Fix before demo |
| P2 | Footer spacing, copy typo | Fix in sprint |
| P3 | Animation polish | Backlog |

---

## 11. Traceability

| SRS requirement | Test |
|-----------------|------|
| REQ-BOOK-01 | E2E steps 3–5 |
| REQ-JOB-01 | E2E steps 2, 6 |
| REQ-BRIDGE-01 | E2E steps 1–2, 13 |
| NFR-SEC-02 | `appLock.utils.test.ts` |

---

## 12. Related docs

- [DEMO_E2E_CHECKLIST](./DEMO_E2E_CHECKLIST.md)
- [DEMO_STATUS](./DEMO_STATUS.md)
- [SRS](./SRS.md)
- Customer README § Testing — `apps/customer/README.md`

---

*Owner: mobile team · Review before each Phase 4 milestone.*
