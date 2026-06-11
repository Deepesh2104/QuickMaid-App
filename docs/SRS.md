# Software Requirements Specification (SRS)

**Product:** QuickMaid Mobile Platform  
**Apps:** Customer (`in.quickmaid.customer`) + Partner (`in.quickmaid.partner`)  
**Version:** 1.0 (UI-DEMO complete · Phase 4 backend next)  
**Primary market:** Raipur, Chhattisgarh (expandable)

---

## 1. Introduction

### 1.1 Purpose

This SRS defines functional and non-functional requirements for the QuickMaid mobile apps so product, mobile, backend, and QA teams share one source of truth.

### 1.2 Scope

| In scope | Out of scope (this repo) |
|----------|--------------------------|
| Customer booking app | Admin web CRM implementation |
| Partner (maid/pro) app | QuickMaid-API server code |
| Demo data + local bridges | Production payment settlement ops |
| Planned API contracts | Third-party maid payroll compliance |

### 1.3 Definitions

| Term | Meaning |
|------|---------|
| Customer | Homeowner who books cleaning |
| Partner / Maid / Pro | Service provider on Partner app |
| Visit | Single scheduled cleaning appointment |
| Bridge | Demo AsyncStorage sync between apps on same device |
| Phase 4 | Real QuickMaid-API integration |

### 1.4 References

- [Documentation Hub](./README.md)
- [Customer FSD](../apps/customer/docs/FSD/README.md)
- [Partner FSD](../apps/partner/docs/FSD/README.md)
- [API Contract](./API-CONTRACT.md)

---

## 2. Overall description

### 2.1 Product perspective

```
┌──────────────┐     ┌──────────────┐
│   Customer   │     │   Partner    │
│     App      │     │     App      │
└──────┬───────┘     └──────┬───────┘
       │    Demo: bridge     │
       └──────────┬──────────┘
                  ▼
         ┌────────────────┐
         │  QuickMaid-API │  ← Phase 4
         └────────┬───────┘
                  ▼
         ┌────────────────┐
         │ Admin CRM / DB │
         └────────────────┘
```

### 2.2 User classes

| Actor | App | Goals |
|-------|-----|-------|
| **Customer** | Customer | Book, pay, track, rate, manage account |
| **Partner** | Partner | Accept jobs, navigate, complete visit, earn |
| **Dual-role user** | Both | Same phone can be customer + maid (separate JWT roles) |
| **Support agent** | — (backend) | Resolve tickets created in apps |
| **Ops / Admin** | — (web) | Catalogue, dispatch, KYC approval, payouts |

### 2.3 Operating environment

- **OS:** Android 10+ (primary), iOS 15+ (supported)
- **Network:** Online for Phase 4; demo works offline with local storage
- **Locale:** English + Hindi (i18n scaffold); Raipur zones pre-seeded

### 2.4 Constraints

- Expo SDK 56, Expo Router file-based routing
- Thin `app/` routes; logic in `src/features/`
- Customer port 8081, Partner port 8082 (never swap)
- Demo OTP `123456` for phone `9876543210`

### 2.5 Assumptions

- QuickMaid-API will expose `/api/v1/...` matching [API-CONTRACT](./API-CONTRACT.md)
- Razorpay keys provided per environment
- FCM for customer push; partner uses in-app inbox (push optional later)

---

## 3. Functional requirements

Priority: **M** = Must, **S** = Should, **C** = Could

### 3.1 Authentication & onboarding

| ID | Priority | Requirement | Acceptance criteria |
|----|----------|-------------|---------------------|
| REQ-AUTH-01 | M | Customer shall sign in with Indian mobile OTP | Valid OTP → home; invalid → error |
| REQ-AUTH-02 | M | Partner shall sign in / register with OTP | New partner → apply flow; returning → home |
| REQ-AUTH-03 | M | Session shall persist across app restarts | Splash routes to correct screen |
| REQ-AUTH-04 | S | Onboarding shall explain value before auth | Skippable after first view |
| REQ-AUTH-05 | M | City picker shall default to Raipur | Other cities shown as coming soon |
| REQ-AUTH-06 | M | Same phone may hold customer + partner roles | `X-App-Client` header distinguishes role |

**FSD:** Customer [01-AUTH](../apps/customer/docs/FSD/01-AUTH.md) · Partner [01-AUTH](../apps/partner/docs/FSD/01-AUTH.md)

---

### 3.2 Service discovery & catalogue

| ID | Priority | Requirement | Acceptance criteria |
|----|----------|-------------|---------------------|
| REQ-CAT-01 | M | Customer shall browse 50+ cleaning services | Grid + search + filters |
| REQ-CAT-02 | M | Service detail shall show price, duration, inclusions | Book CTA starts checkout |
| REQ-CAT-03 | S | Home shall show featured, offers, rebook | Personalised by profile city |
| REQ-CAT-04 | S | Customer shall save favourite services | Heart toggle persists |

**FSD:** [02-HOME](../apps/customer/docs/FSD/02-HOME.md), [03-SERVICE](../apps/customer/docs/FSD/03-SERVICE.md)

---

### 3.3 Checkout & booking

| ID | Priority | Requirement | Acceptance criteria |
|----|----------|-------------|---------------------|
| REQ-BOOK-01 | M | 5-step checkout: cart → address → schedule → payment → success | Draft survives back navigation |
| REQ-BOOK-02 | M | Customer shall pay via UPI / card / wallet (demo) | Order created on success |
| REQ-BOOK-03 | M | Order shall reach partner as pending job | Bridge (demo) or API dispatch (Phase 4) |
| REQ-BOOK-04 | M | Customer shall view upcoming / past bookings | Filter tabs work |
| REQ-BOOK-05 | M | Customer shall track live visit location | Map updates while in progress |
| REQ-BOOK-06 | M | Customer shall reschedule (≥2h before) | Partner notified |
| REQ-BOOK-07 | M | Customer shall cancel with refund policy | Partner job cancelled |
| REQ-BOOK-08 | M | Customer shall rate completed visit | Partner rating updates |
| REQ-BOOK-09 | S | Customer shall download invoice PDF | Share + download |

**FSD:** [04-CHECKOUT](../apps/customer/docs/FSD/04-CHECKOUT.md), [05-BOOKINGS](../apps/customer/docs/FSD/05-BOOKINGS.md)

---

### 3.4 Partner job lifecycle

| ID | Priority | Requirement | Acceptance criteria |
|----|----------|-------------|---------------------|
| REQ-JOB-01 | M | Partner shall see pending job offers | Accept / decline |
| REQ-JOB-02 | M | Partner shall start visit | Customer notified in progress |
| REQ-JOB-03 | M | Partner shall complete visit with OTP | Customer visit-complete modal |
| REQ-JOB-04 | M | Partner shall share live GPS during visit | Customer track screen |
| REQ-JOB-05 | S | Auto-assign shall offer jobs when online + matching | Configurable in settings |
| REQ-JOB-06 | M | Declined / expired offers shall reassign (demo sim) | Customer bridge notification |

**FSD:** [03-JOBS](../apps/partner/docs/FSD/03-JOBS.md), [18-DISPATCH](../apps/partner/docs/FSD/18-DISPATCH.md)

---

### 3.5 KYC & compliance (Partner)

| ID | Priority | Requirement | Acceptance criteria |
|----|----------|-------------|---------------------|
| REQ-KYC-01 | M | 6-step KYC wizard: Aadhaar, PAN, bank/UPI, selfie | Draft autosaves |
| REQ-KYC-02 | M | Demo mock verification for PAN/bank/UPI | Phase 4 → real verify APIs |
| REQ-KYC-03 | S | KYC status gates job acceptance | Pending KYC → warning |

**FSD:** [07-KYC](../apps/partner/docs/FSD/07-KYC.md)

---

### 3.6 Earnings & payouts (Partner)

| ID | Priority | Requirement | Acceptance criteria |
|----|----------|-------------|---------------------|
| REQ-EARN-01 | M | Partner shall view balance and ledger | Per-job breakdown |
| REQ-EARN-02 | S | Partner shall view payout batches | Detail screen |
| REQ-EARN-03 | S | Schedule tab shows week calendar | Visits by day |

**FSD:** [05-EARNINGS](../apps/partner/docs/FSD/05-EARNINGS.md), [04-SCHEDULE](../apps/partner/docs/FSD/04-SCHEDULE.md), [06-PAYOUT](../apps/partner/docs/FSD/06-PAYOUT.md)

---

### 3.7 Membership (QuickMaid Plus)

| ID | Priority | Requirement | Acceptance criteria |
|----|----------|-------------|---------------------|
| REQ-PLUS-01 | M | Customer shall compare Plus / Flex / one-time plans | Subscribe flow |
| REQ-PLUS-02 | M | Customer shall manage membership (pause/cancel) | State reflected in profile |
| REQ-PLUS-03 | S | Plus members see benefits on home | Badge on profile |

**FSD:** [06-PLUS](../apps/customer/docs/FSD/06-PLUS.md)

---

### 3.8 Profile & account

| ID | Priority | Requirement | Acceptance criteria |
|----|----------|-------------|---------------------|
| REQ-PROF-01 | M | Customer shall manage addresses, payments, prefs | CRUD persists |
| REQ-PROF-02 | M | Customer shall top up wallet (demo) | Balance updates |
| REQ-PROF-03 | M | Customer shall delete account | Local wipe + API request (Phase 4) |
| REQ-PROF-04 | M | Partner shall edit profile, work address, slots | Saved to storage/API |
| REQ-PROF-05 | S | App lock PIN / biometrics (customer) | SecureStore hash |

**FSD:** [07-PROFILE](../apps/customer/docs/FSD/07-PROFILE.md), [08-ACCOUNT](../apps/customer/docs/FSD/08-ACCOUNT.md), [15-SECURITY](../apps/customer/docs/FSD/15-SECURITY.md), [08-PROFILE](../apps/partner/docs/FSD/08-PROFILE.md)

---

### 3.9 Notifications & support

| ID | Priority | Requirement | Acceptance criteria |
|----|----------|-------------|---------------------|
| REQ-NOTIF-01 | M | In-app notification inbox both apps | Read / unread |
| REQ-NOTIF-02 | S | Customer push token registration (local demo) | Phase 4 → FCM |
| REQ-SUP-01 | M | Live support chat with ticket thread | Agent auto-reply (demo) |
| REQ-SUP-02 | S | Booking dispute submission | Links to support |
| REQ-SUP-03 | M | Help tab with FAQ + call/chat CTAs | Opens support |

**FSD:** [09-NOTIFICATIONS](../apps/customer/docs/FSD/09-NOTIFICATIONS.md), [10-SUPPORT](../apps/customer/docs/FSD/10-SUPPORT.md), [11-HELP](../apps/customer/docs/FSD/11-HELP.md)

---

### 3.10 Referral & legal

| ID | Priority | Requirement | Acceptance criteria |
|----|----------|-------------|---------------------|
| REQ-REF-01 | S | Referral code share + ledger (demo) | Phase 4 server ledger |
| REQ-LEG-01 | M | Terms, privacy, refund policies | Static content screens |

**FSD:** [14-REFERRAL](../apps/customer/docs/FSD/14-REFERRAL.md), [16-LEGAL](../apps/customer/docs/FSD/16-LEGAL.md)

---

### 3.11 Cross-app integration (demo)

| ID | Priority | Requirement | Acceptance criteria |
|----|----------|-------------|---------------------|
| REQ-BRIDGE-01 | M | Customer order → partner pending job (same device) | E2E checklist step 1–2 |
| REQ-BRIDGE-02 | M | Lifecycle events sync both directions | Status bridge events |
| REQ-BRIDGE-03 | M | Live location bridge during visit | Customer track map |
| REQ-BRIDGE-04 | S | Deep link `quickmaid-partner://booking?ref=` | Cross-device handoff |

**FSD:** [CROSS-APP-BRIDGE](./FSD/CROSS-APP-BRIDGE.md)

---

## 4. Non-functional requirements

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR-PERF-01 | Performance | Home screen first paint | < 2s on mid-range Android |
| NFR-PERF-02 | Performance | Booking list refresh | < 1s local; < 3s API |
| NFR-SEC-01 | Security | JWT in SecureStore (Phase 4) | Never in AsyncStorage |
| NFR-SEC-02 | Security | App lock PIN hashed | PBKDF2 via expo-crypto |
| NFR-SEC-03 | Security | OTP not logged in production | Sentry scrub |
| NFR-REL-01 | Reliability | Idempotent bridge event apply | `booking_status_applied` keys |
| NFR-UX-01 | Usability | Tab bar safe scroll padding | No content hidden under tabs |
| NFR-UX-02 | Accessibility | Touch targets ≥ 44pt | Primary CTAs |
| NFR-I18N-01 | Localization | Hindi strings for core tabs | `src/i18n/hi.ts` |
| NFR-OBS-01 | Observability | Optional Sentry | `EXPO_PUBLIC_SENTRY_DSN` |
| NFR-COMPAT-01 | Compatibility | Side-by-side dev + prod installs | Package ID suffixes |

---

## 5. External interface requirements

### 5.1 User interfaces

- Material-inspired teal brand (`#0B6E67`)
- Bottom tabs: Customer (Home, Bookings, Catalogue, Plus, Help) · Partner (Home, Requests, Schedule, Earnings, Help)
- Hero + white sheet pattern on main tabs

### 5.2 Hardware interfaces

- Camera (profile photo, KYC selfie)
- GPS (partner live location)
- Biometrics (app lock, optional)

### 5.3 Software interfaces

| System | Protocol | Doc |
|--------|----------|-----|
| QuickMaid-API | HTTPS REST JSON | [API-CONTRACT](./API-CONTRACT.md) |
| Razorpay | SDK / checkout | Customer FSD 12-PAYMENT |
| Google Places | Places API | Address search (env key) |
| FCM | Push tokens | Phase 4 |
| Admin CRM | Shared data shapes | CUSTOMER_DATA / PARTNER_DATA |

---

## 6. Demo vs production behaviour

| Capability | Demo (today) | Production (Phase 4) |
|------------|--------------|---------------------|
| Auth | Fixed OTP `123456` | SMS OTP via API |
| Bookings storage | AsyncStorage `@qm/user_bookings` | `GET/POST /customers/me/bookings` |
| Partner jobs | `@qmp/partner_jobs_v4` | `GET /maids/me/jobs` |
| Cross-app sync | Shared AsyncStorage bridge | Webhooks + push |
| Payments | `simulatePayment()` | Razorpay verify endpoint |
| KYC | Mock verify | DigiLocker / bank APIs |
| Chat | Auto agent reply | WebSocket / ticket API |

See [DEMO_STATUS](./DEMO_STATUS.md) for complete deferral list.

---

## 7. MoSCoW summary

| Must have (Phase 4 MVP) | Should have | Could have |
|---------------------------|-------------|------------|
| OTP auth + JWT | Push notifications | iOS App Store |
| Booking CRUD + dispatch | Referral server ledger | Multi-city expansion |
| Partner job lifecycle | Real support agent | Advanced analytics |
| Payment verify | KYC production APIs | packages/shared lib |
| Customer track location | Plus billing history API | |

---

## 8. Acceptance — demo complete (current)

Both apps pass when:

1. [DEMO_E2E_CHECKLIST](./DEMO_E2E_CHECKLIST.md) steps 1–14 succeed on **same device**
2. No blocking UI regressions on tab screens
3. Bridge events propagate per [CROSS-APP-BRIDGE](./FSD/CROSS-APP-BRIDGE.md)

---

## 9. Acceptance — Phase 4 complete (future)

1. `EXPO_PUBLIC_USE_API=true` switches all hooks to HTTP
2. Two physical phones sync via API (not bridge)
3. Payment webhook confirms order
4. Partner push or polling for new offers
5. Account delete honours server grace period

---

## 10. Open issues

| # | Issue | Owner |
|---|-------|-------|
| 1 | OpenAPI spec not in repo | Backend |
| 2 | `packages/shared` not created | Mobile |
| 3 | Contract test suite | QA + backend |

---

## 11. Appendix — demo credentials

| Field | Value |
|-------|-------|
| Phone | `9876543210` |
| OTP | `123456` |
| Visit complete OTP | `123456` |

---

## 12. Traceability matrix

| SRS ID | FSD (Customer) | FSD (Partner) | Primary API (Phase 4) |
|--------|----------------|---------------|------------------------|
| REQ-AUTH-* | 01-AUTH | 01-AUTH | `/auth/otp/*` |
| REQ-CAT-* | 02-HOME, 03-SERVICE | — | `/catalogue/*` |
| REQ-BOOK-* | 04-CHECKOUT, 05-BOOKINGS | 03-JOBS | `/customers/me/bookings`, `/jobs/*` |
| REQ-JOB-* | 05-BOOKINGS (consumer) | 03-JOBS, 18-DISPATCH | `/jobs/:id/*` |
| REQ-KYC-* | — | 07-KYC | `/maids/me/kyc/*` |
| REQ-EARN-* | — | 05-EARNINGS, 06-PAYOUT | `/maids/me/earnings` |
| REQ-PLUS-* | 06-PLUS | — | `/membership/*` |
| REQ-PROF-* | 07-PROFILE, 08-ACCOUNT | 08-PROFILE, 17-ACCOUNT | `/customers/me`, `/maids/me` |
| REQ-NOTIF-* | 09-NOTIFICATIONS | 11-NOTIFICATIONS | `/notifications` |
| REQ-SUP-* | 10-SUPPORT, 11-HELP | 12-SUPPORT, 13-HELP | `/support/tickets` |
| REQ-BRIDGE-* | CROSS-APP-BRIDGE | CROSS-APP-BRIDGE | Webhooks (replaces bridge) |

---

*Maintainers: update this SRS when scope changes. Link new features in §3 and §12.*
