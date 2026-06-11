# QuickMaid-App



Native mobile apps for the QuickMaid platform — **Customer** and **Partner** (React Native + Expo).



## Repositories



| Repo | Purpose |

|------|---------|

| [QuickMaid](https://github.com/Deepesh2104/QuickMaid) | Web marketing + admin console |

| **QuickMaid-App** (this repo) | Customer + Partner mobile apps |

| QuickMaid-API | Backend API (Phase 3) |



## Apps



| App | Folder | Android package | Status |

|-----|--------|-----------------|--------|

| Customer | `apps/customer` | `in.quickmaid.customer` | **UI complete** (demo) — [README](apps/customer/README.md) |

| Partner | `apps/partner` | `in.quickmaid.partner` | **UI complete** (demo) — [README](apps/partner/README.md) |



---



## How to manage both apps (daily workflow)



### 1. Folder rule — one repo, two apps



```

QuickMaid-App/

├── apps/

│   ├── customer/          # Customer-only code

│   └── partner/           # Partner-only code (maid jobs, earnings, KYC)

├── packages/              # (later) shared theme, API types, utils

└── README.md

```



- **Customer changes** → only edit `apps/customer`

- **Partner changes** → only edit `apps/partner`

- **Shared UI/API** → later move to `packages/shared`



### 2. Run locally (separate terminals)



**Customer app**



```bash

cd apps/customer

npm install

npx expo start

```



**Partner app** (after scaffold)



```bash

cd apps/partner

npm install

npx expo start --port 8082

```



Use `--port 8082` so both apps can run at the same time without clashing.



### 3. Expo Go on phone



| App | How to test |

|-----|-------------|

| Customer | Scan QR from `apps/customer` terminal |

| Partner | Scan QR from `apps/partner` terminal (different port) |



Install **two different dev builds** later for production; in dev, same Expo Go works with different ports.



### 4. Git — one repo, clear commits



```bash

git add apps/customer/    # customer-only commit

git add apps/partner/     # partner-only commit

```



**Commit message style**



- `feat(customer): add coupon wallet`

- `feat(partner): job accept screen`

- `chore(shared): extract theme tokens`



Push once to `QuickMaid-App` on GitHub — both apps stay in sync in history.



### 5. Play Store — two listings, one codebase repo



| Listing | Package ID | Built from |

|---------|------------|------------|

| QuickMaid (Customer) | `in.quickmaid.customer` | `apps/customer` |

| QuickMaid Partner | `in.quickmaid.partner` | `apps/partner` |



Customer app **Become a Partner** button opens Partner Play Store URL (`apps/customer/src/constants/links.ts`).



Build & submit each app separately with EAS:



```bash

cd apps/customer && eas build --platform android

cd apps/partner && eas build --platform android

```



### 6. Backend (when QuickMaid-API is ready)



Both apps call the **same API** with different `app_client`:



| App | JWT / session | API focus |

|-----|---------------|-----------|

| Customer | `app_client: customer` | bookings, wallet, addresses |

| Partner | `app_client: maid` | jobs, accept/decline, OTP complete, earnings |



Same phone can have **both roles** (`user_roles`: customer + maid) — see `QuickMaid/docs/database/quickmaid.schema.dbml`.



### 7. Admin (Angular QuickMaid)



Ops team manages partners from **web admin**, not from mobile repo:



- Approve applications → `/admin/maids`

- Dispatch jobs → `/admin/dispatch`

- Payouts → `/admin/payouts`



Partner app is the **maid's phone UI**; admin is **your team's dashboard**.



---



## Customer app — demo flow



1. Splash → Onboarding → City (Raipur)

2. Login with any 10-digit number

3. OTP: `123456`

4. Name + permissions → Home tabs



## Partner app — demo flow

Full docs: **[apps/partner/README.md](apps/partner/README.md)** · Data contract: **[apps/partner/docs/PARTNER_DATA.md](apps/partner/docs/PARTNER_DATA.md)**

1. Splash → Onboarding → Login (`9876543210`) → OTP `123456`
2. Apply (new) or returning sign-in → KYC wizard if pending
3. Tabs: Jobs · Requests (12 pending) · Schedule · Earnings · Help
4. Accept job → Navigate → Start visit → OTP `482916` complete
5. Profile → Settings, photo, rating, referral, notifications

**Phase 4:** QuickMaid-API integration (auth, jobs, KYC submit, payouts) — not started.



---



## Dev, test, beta, prod (both apps)

Full guide: **[docs/ENVIRONMENTS.md](./docs/ENVIRONMENTS.md)**

| Env | Build | API | Play Store |
|-----|-------|-----|------------|
| dev | `npx expo start` | mock / localhost | — |
| test | `eas build --profile test` | api-test | Internal track |
| beta | `eas build --profile beta` | api-beta | Closed testing |
| prod | `eas build --profile production` | api.quickmaid.in | Production |

## Documentation (read everything here)

**Start:** **[docs/README.md](./docs/README.md)** — master index for all documentation.

| Document | What it covers |
|----------|----------------|
| [SRS](./docs/SRS.md) | Software Requirements Specification |
| [TDD](./docs/TDD.md) | Technical Design Document |
| [SYSTEM-DESIGN-CLIENT](./docs/SYSTEM-DESIGN-CLIENT.md) | Client architecture & diagrams |
| [API-CONTRACT](./docs/API-CONTRACT.md) | REST API contract (Phase 4) |
| [TEST-STRATEGY](./docs/TEST-STRATEGY.md) | Testing approach |
| [CONTRIBUTING](./docs/CONTRIBUTING.md) | Dev workflow |
| [FSD index](./docs/FSD/README.md) | Feature specs (35 features) |
| [DEMO_STATUS](./docs/DEMO_STATUS.md) | What's done vs deferred |
| [DEMO_E2E_CHECKLIST](./docs/DEMO_E2E_CHECKLIST.md) | Manual QA steps |
| [ENVIRONMENTS](./docs/ENVIRONMENTS.md) | Dev / test / beta / prod |

### App-specific docs

- **Customer:** [README](./apps/customer/README.md) · [FSD](./apps/customer/docs/FSD/README.md) · [Data contract](./apps/customer/docs/CUSTOMER_DATA.md)
- **Partner:** [README](./apps/partner/README.md) · [FSD](./apps/partner/docs/FSD/README.md) · [Data contract](./apps/partner/docs/PARTNER_DATA.md)

### Platform (other repos)

- DB schema: `../QuickMaid/docs/database/quickmaid.schema.dbml`
- Platform overview: `../QuickMaid/docs/PLATFORM.md`
- API plan: `../QuickMaid/docs/PHASE3_BACKEND.md`


