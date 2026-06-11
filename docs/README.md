# QuickMaid-App — Documentation Hub

**Read this first.** One place to understand the entire Customer + Partner mobile platform before coding, QA, or backend work.

> **Complete combined guide (Customer + Partner + API + Admin):**  
> **[QUICKMAID-PLATFORM.md](./QUICKMAID-PLATFORM.md)** — Overview, FSD, System Design, Data Flow, Architecture, Best Practices

---

## Quick start (5 minutes)

| I want to… | Read |
|------------|------|
| **Everything in one document** | **[QUICKMAID-PLATFORM](./QUICKMAID-PLATFORM.md)** |
| Understand **what the product does** | [SRS](./SRS.md) |
| Understand **how the apps are built** | [TDD](./TDD.md) |
| See **architecture diagrams** (client) | [SYSTEM-DESIGN-CLIENT](./SYSTEM-DESIGN-CLIENT.md) |
| Wire **REST APIs** (Phase 4) | [API-CONTRACT](./API-CONTRACT.md) |
| Find a **specific screen / flow** | [FSD index](./FSD/README.md) |
| Run **demo QA** | [DEMO_E2E_CHECKLIST](./DEMO_E2E_CHECKLIST.md) |
| Know **what is done vs deferred** | [DEMO_STATUS](./DEMO_STATUS.md) |
| Set up **dev / test / prod builds** | [ENVIRONMENTS](./ENVIRONMENTS.md) |
| Contribute code | [CONTRIBUTING](./CONTRIBUTING.md) |
| Plan **tests** | [TEST-STRATEGY](./TEST-STRATEGY.md) |

---

## Document map

```
docs/
├── README.md                    ← You are here (master index)
├── QUICKMAID-PLATFORM.md        ★ Complete combined platform doc
├── SRS.md                       Software Requirements Specification
├── TDD.md                       Technical Design Document
├── SYSTEM-DESIGN-CLIENT.md      Client-side system design & diagrams
├── API-CONTRACT.md              Unified REST contract (Phase 4)
├── TEST-STRATEGY.md             Testing approach
├── CONTRIBUTING.md              Dev workflow & conventions
├── DEMO_STATUS.md               Demo completion status
├── DEMO_E2E_CHECKLIST.md        Manual QA steps
├── ENVIRONMENTS.md              4 envs × 2 apps matrix
└── FSD/
    ├── README.md                Cross-app FSD index
    └── CROSS-APP-BRIDGE.md      Customer ↔ Partner demo bridge

apps/customer/docs/
├── CUSTOMER_DATA.md             Customer field-level data contract
└── FSD/                         00–16 feature specs + API_CALL_SITES

apps/partner/docs/
├── PARTNER_DATA.md              Partner field-level data contract
├── PARTNER_APP.md               Short partner blueprint
└── FSD/                         00–18 feature specs + API_CALL_SITES
```

---

## Project at a glance

| Item | Customer | Partner |
|------|----------|---------|
| Folder | `apps/customer` | `apps/partner` |
| Android package (prod) | `in.quickmaid.customer` | `in.quickmaid.partner` |
| Dev Metro port | **8081** | **8082** |
| Deep link scheme | `quickmaid://` | `quickmaid-partner://` |
| Storage prefix | `@qm/` | `@qmp/` |
| Demo phone / OTP | `9876543210` / `123456` | Same |
| Current data layer | AsyncStorage + bridges | AsyncStorage + bridges |
| Target backend | QuickMaid-API `/api/v1/...` | Same |

**Monorepo shared bridge:** `QuickMaid-App/shared/` → sync via `npm run sync:shared`

---

## Documentation types explained

| Type | File | Audience | Answers |
|------|------|----------|---------|
| **SRS** | [SRS.md](./SRS.md) | PM, QA, backend, mobile | *What* must the system do? |
| **FSD** | [FSD/README.md](./FSD/README.md) | Mobile devs | *How* does each feature work screen-by-screen? |
| **TDD** | [TDD.md](./TDD.md) | Mobile + backend devs | *How* is the client technically structured? |
| **System Design** | [SYSTEM-DESIGN-CLIENT.md](./SYSTEM-DESIGN-CLIENT.md) | Architects, leads | *How* do components, data, and APIs fit together? |
| **API Contract** | [API-CONTRACT.md](./API-CONTRACT.md) | Backend + mobile | *What* endpoints replace demo storage? |
| **Data contracts** | CUSTOMER_DATA / PARTNER_DATA | Backend + CRM | *What* JSON fields does each entity have? |

---

## Phase timeline

| Phase | Status | Scope |
|-------|--------|-------|
| **Phase 1–3** | ✅ Complete | UI-DEMO both apps, local storage, cross-app bridge |
| **Phase 4** | 🔜 Next | QuickMaid-API REST, JWT, webhooks, real payments, push |
| **Phase 5** | Planned | `packages/shared`, CI/CD, contract tests, OpenAPI sync |

---

## Traceability chain

Every requirement should trace through:

```
SRS requirement (REQ-xxx)
    → FSD feature doc (e.g. 05-BOOKINGS.md)
        → Route (e.g. app/booking/[id].tsx)
            → Hook / storage (e.g. useUserBookings)
                → Phase 4 API (e.g. GET /customers/me/bookings)
```

See [SRS § Traceability](./SRS.md#12-traceability-matrix) for the full matrix.

---

## Related repositories

| Repo | Role |
|------|------|
| **QuickMaid-App** (this) | Customer + Partner mobile |
| **QuickMaid-API** | Backend REST + webhooks (Phase 4) |
| **QuickMaid** (web) | Marketing + admin CRM |

---

*Last updated: documentation pass before Phase 4 backend.*
