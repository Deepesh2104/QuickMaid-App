# System Design — Client Side

**Scope:** QuickMaid Customer + Partner mobile apps (React Native / Expo)  
**Companion docs:** [SRS](./SRS.md) · [TDD](./TDD.md) · [API-CONTRACT](./API-CONTRACT.md)

---

## 1. Context diagram (C4 Level 1)

```mermaid
flowchart TB
  subgraph Users
    C[Customer]
    P[Partner / Maid]
  end
  subgraph Mobile["QuickMaid-App"]
    CA[Customer App]
    PA[Partner App]
  end
  subgraph External
    API[QuickMaid-API]
    RZ[Razorpay]
    GP[Google Places]
    FCM[Firebase FCM]
    ADM[Admin CRM Web]
  end
  C --> CA
  P --> PA
  CA --> API
  PA --> API
  CA --> RZ
  CA --> GP
  CA --> FCM
  API --> ADM
  PA -.->|Demo only: AsyncStorage bridge| CA
```

**Today:** Dotted bridge line is active on same-device demo. **Phase 4:** Solid API lines replace bridge.

---

## 2. Container diagram (C4 Level 2)

```mermaid
flowchart TB
  subgraph CustomerApp["apps/customer"]
    CR[Expo Router app/]
    CF[src/features/*]
    CC[Context: Auth + Checkout]
    CS[AsyncStorage @qm/]
    CB[shared/ bridge read-write]
  end
  subgraph PartnerApp["apps/partner"]
    PR[Expo Router app/]
    PF[src/features/*]
    PC[Context: Partner + Jobs]
    PS[AsyncStorage @qmp/]
    PB[shared/ bridge read-write]
  end
  subgraph SharedCanonical["QuickMaid-App/shared"]
    BR[booking-bridge.ts]
    BS[booking-status-bridge.ts]
    VL[visit-location-bridge.ts]
    VC[visit-complete-bridge.ts]
  end
  CR --> CF --> CC --> CS
  CF --> CB
  PR --> PF --> PC --> PS
  PF --> PB
  BR --> CB & PB
  BS --> CB & PB
  VL --> CB & PB
  VC --> CB & PB
```

---

## 3. Component diagram — Customer booking flow

```mermaid
flowchart LR
  subgraph UI
    SD[ServiceDetailScreen]
    CCtx[CheckoutContext]
    CPS[CheckoutPaymentScreen]
    BS[BookingsScreen]
    BT[BookingTrackScreen]
  end
  subgraph Data
    BSt[bookings.storage]
    BBr[booking-partner-bridge]
    SBr[booking-status-bridge]
    LBr[visit-location-bridge]
  end
  SD -->|bookService| CCtx
  CCtx -->|processPayment| CPS
  CPS --> BSt
  CPS --> BBr
  BS --> BSt
  BS -->|focus sync| SBr
  BT --> LBr
```

---

## 4. Component diagram — Partner job flow

```mermaid
flowchart LR
  subgraph UI
    RS[PartnerRequestsScreen]
    JD[JobDetailScreen]
    VS[PartnerVisitCompleteScreen]
    PH[PartnerHomeScreen]
  end
  subgraph Data
    JSt[jobs.storage]
    Ing[booking-partner-bridge ingest]
    Pub[booking-status-bridge publish]
    Loc[visit-location.storage]
    VCo[visit-complete-bridge]
  end
  RS --> JSt
  Ing --> JSt
  JD -->|accept/start| Pub
  VS -->|OTP complete| Pub & VCo
  JD --> Loc
  PH --> JSt
```

---

## 5. Storage & bridge keys

### 5.1 Customer (`@qm/`)

| Key | Entity |
|-----|--------|
| `@qm/onboarding_done` | Onboarding flag |
| `@qm/auth_complete` | Session flag |
| `@qm/user_profile` | Profile identity |
| `@qm/profile_account` | Full account (addresses, wallet, prefs) |
| `@qm/user_bookings` | Booking list |
| `@qm/checkout_draft` | Active checkout |
| `@qm/payment_history` | Transactions |
| `@qm/notifications_inbox` | Notifications |
| `@qm/plus_last_subscription` | Membership |
| `@qm/referral_ledger` | Referrals |
| `@qm/support_tickets` | Support threads |
| `@qm/wallet_transactions` | Wallet ledger |
| `@qm/app_lock_settings` | App lock prefs |
| `@qm/push_device_token_v1` | FCM token (local) |

### 5.2 Partner (`@qmp/`)

| Key | Entity |
|-----|--------|
| `@qmp/partner_profile` | Maid profile |
| `@qmp/partner_state` | Online, earnings snapshot |
| `@qmp/partner_jobs_v4` | Job store |
| `@qmp/partner_kyc_draft` | KYC wizard |
| `@qmp/partner_preferences` | Auto-assign, alerts |
| `@qmp/partner_notifications_inbox` | Inbox |
| `@qmp/partner_customer_reviews_v1` | Ratings from bridge |
| `@qmp/visit_location_pings_v1` | GPS log |

### 5.3 Cross-app bridge (`@qm/booking_*`)

| Key | Module |
|-----|--------|
| `@qm/booking_partner_bridge_v1` | New orders queue |
| `@qm/booking_status_bridge_v1` | Lifecycle events |
| `@qm/booking_status_applied_v1` | Idempotency |
| `@qm/visit_location_bridge_v1` | Live GPS |
| `@qm/pending_visit_complete` | Visit complete modal |

---

## 6. Sequence — Happy path booking (demo)

```mermaid
sequenceDiagram
  participant C as Customer App
  participant B as booking-bridge
  participant S as status-bridge
  participant P as Partner App

  C->>C: Checkout payment success
  C->>B: pushBookingToPartnerBridge(order)
  P->>B: ingestBookingBridgePayload()
  P->>P: Pending job in jobs.storage
  P->>S: publish partner_accepted
  C->>S: syncBookingsFromPartnerStatusBridge()
  C->>C: Booking shows assigned pro
  P->>P: startVisit()
  P->>S: publish partner_in_progress
  P->>P: GPS pings → visit-location-bridge
  C->>C: BookingTrackScreen polls location
  P->>P: completeVisit(OTP)
  P->>S: publish partner_completed
  P->>C: visit-complete-bridge payload
  C->>C: Visit complete modal + rate
  C->>S: publish customer_rated
  P->>P: syncCustomerRatingsFromStatusBridge()
```

---

## 7. Sequence — Phase 4 booking (target)

```mermaid
sequenceDiagram
  participant C as Customer App
  participant API as QuickMaid-API
  participant P as Partner App
  participant FCM as Push

  C->>API: POST /customers/me/bookings
  API->>API: Create order + dispatch
  API->>FCM: Notify partner new offer
  API-->>C: 201 booking + ref
  P->>API: GET /maids/me/jobs
  P->>API: POST /jobs/:id/accept
  API->>FCM: Notify customer accepted
  C->>API: GET /customers/me/bookings/:id
  P->>API: POST /jobs/:id/location (interval)
  C->>API: GET /bookings/:id/location
  P->>API: POST /jobs/:id/complete
  API->>FCM: Notify customer complete
  C->>API: POST /bookings/:id/review
```

---

## 8. Dual-role model (same phone)

One physical device may install **both** apps and use the **same phone number**:

| Aspect | Design |
|--------|--------|
| JWT | Separate tokens per `app_client` |
| Header | `X-App-Client: customer` or `maid` |
| Storage | Isolated prefixes `@qm/` vs `@qmp/` |
| Handoff | Partner `book-home` → deep link to customer app |
| API | Backend links both roles to same `user_id` |

---

## 9. Context providers

### Customer

| Context | Scope | Persists |
|---------|-------|----------|
| `AuthFlowContext` | Pre-auth signup fields | Until registration |
| `CheckoutContext` | Active checkout draft | `checkout_draft` key |
| `LanguageProvider` | i18n locale | Profile pref |
| `AppLockGate` | PIN overlay | SecureStore |

### Partner

| Context | Scope | Persists |
|---------|-------|----------|
| `PartnerContext` | Profile, online, slots | `@qmp/partner_*` |
| `PartnerJobsContext` | Job list cache | jobs.storage |
| `PartnerAlertContext` | Toast / error banner | Ephemeral |
| `AuthFlowContext` | Pre-auth apply flow | Until registration |

---

## 10. Feature domain map

### Customer (17 domains)

`home` · `checkout` · `bookings` · `service` · `plus` · `profile` · `help` · `support` · `notifications` · `payment` · `pro` · `referral` · `security` · `legal` · `wallet` · `coupons` · `saved-services`

### Partner (16 domains)

`home` · `jobs` · `schedule` · `earnings` · `payout` · `kyc` · `profile` · `settings` · `slots` · `notifications` · `support` · `help` · `referral` · `legal` · `account` · `book-home`

Dispatch logic spans `jobs` + `settings` (FSD 18).

---

## 11. Phase 4 migration map

| Demo component | Replace with |
|----------------|--------------|
| `*.storage.ts` reads/writes | `*.api.ts` + cache optional |
| `pushBookingToPartnerBridge` | `POST /bookings` + dispatch webhook |
| `syncBookingsFromPartnerStatusBridge` | Push notification + `GET /bookings/:id` |
| `visit-location-bridge` | `GET/POST /jobs/:id/location` |
| `visit-complete-bridge` | Webhook `visit.completed` |
| `DEMO_OTP` check | `POST /auth/otp/verify` |
| `simulatePayment` | Razorpay + `POST /payments/verify` |
| `mock KYC verify` | Real KYC endpoints |

Full deferral list: [DEMO_STATUS](./DEMO_STATUS.md).

---

## 12. Deployment topology (mobile)

```mermaid
flowchart LR
  subgraph Dev
    E1[Expo Metro :8081]
    E2[Expo Metro :8082]
  end
  subgraph EAS
    D1[customer dev APK]
    D2[partner dev APK]
    T1[test track]
    P1[production]
  end
  E1 & E2 -->|eas build| D1 & D2
  D1 & D2 --> T1 --> P1
```

Package ID suffixes per env: [ENVIRONMENTS](./ENVIRONMENTS.md).

---

## 13. Data entity relationships (logical)

```mermaid
erDiagram
  USER ||--o| CUSTOMER_PROFILE : has
  USER ||--o| MAID_PROFILE : has
  CUSTOMER_PROFILE ||--o{ ADDRESS : owns
  CUSTOMER_PROFILE ||--o{ BOOKING : places
  MAID_PROFILE ||--o{ JOB : receives
  BOOKING ||--|| JOB : maps_to
  BOOKING ||--o| PAYMENT : paid_by
  BOOKING ||--o| REVIEW : rated
  MAID_PROFILE ||--o{ KYC_DOCUMENT : submits
  CUSTOMER_PROFILE ||--o| MEMBERSHIP : subscribes
```

Field shapes: [CUSTOMER_DATA](../apps/customer/docs/CUSTOMER_DATA.md) · [PARTNER_DATA](../apps/partner/docs/PARTNER_DATA.md).

---

## 14. Failure modes

| Scenario | Client behaviour |
|----------|------------------|
| Bridge out of sync | Manual "Pull sync" in partner demo tools |
| Partner declines | Customer notification + reassignment copy |
| OTP wrong on visit | Inline error, retry |
| Payment fails | Stay on payment step, draft preserved |
| API 401 (Phase 4) | Refresh token → retry once → logout |
| No network (Phase 4) | Cached list + offline banner |

---

## 15. Further reading

| Topic | Document |
|-------|----------|
| Bridge detail | [CROSS-APP-BRIDGE](./FSD/CROSS-APP-BRIDGE.md) |
| All endpoints | [API-CONTRACT](./API-CONTRACT.md) |
| Per-screen flows | Customer/Partner FSD 01–18 |
| API call matrix | `apps/*/docs/FSD/API_CALL_SITES.md` |

---

*Diagrams use Mermaid — render in GitHub, VS Code, or Cursor preview.*
