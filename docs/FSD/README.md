# QuickMaid Monorepo — Feature Specification Documents

Cross-app FSD index for the `QuickMaid-App` workspace.

> **New here?** Start at the [Documentation Hub](../README.md) for SRS, TDD, System Design, and API Contract.

## Core documentation (non-FSD)

| Doc | Purpose |
|-----|---------|
| [SRS](../SRS.md) | Product requirements |
| [TDD](../TDD.md) | Technical design |
| [SYSTEM-DESIGN-CLIENT](../SYSTEM-DESIGN-CLIENT.md) | Architecture diagrams |
| [API-CONTRACT](../API-CONTRACT.md) | REST endpoints (Phase 4) |
| [TEST-STRATEGY](../TEST-STRATEGY.md) | QA approach |
| [CONTRIBUTING](../CONTRIBUTING.md) | Dev workflow |

## App-specific FSD sets

| App | Path | Scope |
|-----|------|-------|
| **Partner** | [`apps/partner/docs/FSD/README.md`](../apps/partner/docs/FSD/README.md) | Maid dispatch, KYC, earnings, visit flow (00–18) |
| **Customer** | [`apps/customer/docs/FSD/README.md`](../apps/customer/docs/FSD/README.md) | Booking, checkout, Plus, profile (00–16) |

## Shared / cross-cutting

| Doc | Topic |
|-----|--------|
| [CROSS-APP-BRIDGE](./CROSS-APP-BRIDGE.md) | Demo booking + live-location bridge between Customer and Partner apps |
| [ENVIRONMENTS](../ENVIRONMENTS.md) | Dev ports, bundle IDs, deep link schemes |

## Data contracts

| App | Data doc |
|-----|----------|
| Partner | [`apps/partner/docs/PARTNER_DATA.md`](../apps/partner/docs/PARTNER_DATA.md) |
| Customer | [`apps/customer/docs/CUSTOMER_DATA.md`](../apps/customer/docs/CUSTOMER_DATA.md) |

## Phase 4 backend

Both apps target **QuickMaid-API** REST (`/api/v1/...`). Demo apps use AsyncStorage today; each FSD includes a migration checklist and API call-site matrix.

## Status legend

| Tag | Meaning |
|-----|---------|
| `UI-DEMO` | Screen complete; local storage only |
| `MOCK-API` | In-app mock verification (KYC, payments) |
| `PHASE-4` | Real HTTP not wired yet |
