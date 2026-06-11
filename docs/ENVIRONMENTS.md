# QuickMaid Mobile — Dev, Test, Beta, Prod (Customer + Partner)

How to manage **4 environments × 2 apps** without mixing APIs, builds, or Play Store listings.

---

## 1. Big picture

```
                    ┌─────────────┐     ┌─────────────┐
                    │  Customer   │     │   Partner   │
                    │    app      │     │    app      │
                    └──────┬──────┘     └──────┬──────┘
                           │                    │
                           └────────┬───────────┘
                                    ▼
                           ┌────────────────┐
                           │  QuickMaid-API │
                           │  (per env URL) │
                           └────────┬───────┘
                                    ▼
              ┌─────────────────────┼─────────────────────┐
              ▼                     ▼                     ▼
         PostgreSQL-dev      PostgreSQL-test       PostgreSQL-prod
```

**Rule:** App never talks to DB directly. Each env points to **one API base URL** + **one database** on the server side.

---

## 2. Four environments — what each is for

| Env | Who uses it | Data | Install on phone |
|-----|-------------|------|------------------|
| **dev** | You (local) | Mock / dev API / seed data | Expo Go or dev client |
| **test** | QA team | Staging API + test DB | Internal APK (EAS) |
| **beta** | Pilot maids & customers | Pre-prod API (or prod + flags) | Play Store **closed testing** |
| **prod** | Public users | Live API + live DB | Play Store **production** |

---

## 3. Matrix — 2 apps × 4 envs

### Android package IDs (side-by-side install for dev/test)

| Env | Customer package | Partner package | App name on device |
|-----|------------------|-----------------|-------------------|
| dev | `in.quickmaid.customer.dev` | `in.quickmaid.partner.dev` | QuickMaid Dev / Partner Dev |
| test | `in.quickmaid.customer.test` | `in.quickmaid.partner.test` | QuickMaid Test / Partner Test |
| beta | `in.quickmaid.customer` | `in.quickmaid.partner` | QuickMaid Beta* / Partner Beta* |
| prod | `in.quickmaid.customer` | `in.quickmaid.partner` | QuickMaid / QuickMaid Partner |

\*Beta uses **same package as prod** but a different **Play Store track** (closed testing). Users on beta track get beta builds; prod track gets prod builds.

### API base URLs (set per build)

| Env | API URL (example) |
|-----|-------------------|
| dev | `http://localhost:3000/api/v1` or mock (no API today) |
| test | `https://api-test.quickmaid.in/api/v1` |
| beta | `https://api-beta.quickmaid.in/api/v1` |
| prod | `https://api.quickmaid.in/api/v1` |

### Env variable (both apps)

```bash
EXPO_PUBLIC_APP_ENV=development|test|beta|production
EXPO_PUBLIC_API_BASE_URL=https://...
EXPO_PUBLIC_RAZORPAY_KEY=rzp_test_xxx   # test/dev only
```

---

## 4. EAS Build profiles (per app)

Each app has its own `eas.json` under `apps/customer` and `apps/partner`.

```json
{
  "cli": { "version": ">= 16.0.0", "appVersionSource": "local" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": { "EXPO_PUBLIC_APP_ENV": "development" }
    },
    "test": {
      "distribution": "internal",
      "android": { "buildType": "apk" },
      "env": { "EXPO_PUBLIC_APP_ENV": "test" }
    },
    "beta": {
      "distribution": "store",
      "channel": "beta",
      "env": { "EXPO_PUBLIC_APP_ENV": "beta" }
    },
    "production": {
      "distribution": "store",
      "channel": "production",
      "android": { "buildType": "app-bundle" },
      "env": { "EXPO_PUBLIC_APP_ENV": "production" }
    }
  }
}
```

### Build commands

```bash
# Customer
cd apps/customer
eas build --profile test --platform android
eas build --profile beta --platform android
eas build --profile production --platform android

# Partner
cd apps/partner
eas build --profile test --platform android
eas build --profile beta --platform android
eas build --profile production --platform android
```

**8 build types** (4 profiles × 2 apps) — run only what you need per release.

---

## 5. `app.config.ts` — one config, env-driven

Replace static `app.json` with dynamic config (both apps):

```ts
// apps/customer/app.config.ts (pattern)
const env = process.env.EXPO_PUBLIC_APP_ENV ?? 'development';
const isProd = env === 'production' || env === 'beta';
const suffix = isProd ? '' : `.${env === 'development' ? 'dev' : env}`;

export default {
  expo: {
    name: env === 'production' ? 'QuickMaid' : `QuickMaid ${env}`,
    slug: 'quickmaid-customer',
    android: {
      package: `in.quickmaid.customer${suffix}`,
    },
    extra: {
      appEnv: env,
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    },
  },
};
```

Partner app: same pattern with `in.quickmaid.partner` and slug `quickmaid-partner`.

---

## 6. Secrets — never in git

| Secret | Where to store |
|--------|----------------|
| Razorpay live key | EAS Secrets / GitHub Actions secrets |
| Razorpay test key | EAS profile `test` env |
| API keys, Sentry DSN | EAS Secrets per profile |
| DB passwords | Only on API server — never in mobile app |

```bash
eas secret:create --name EXPO_PUBLIC_RAZORPAY_KEY --value rzp_live_xxx --scope project
```

Use **separate EAS projects** per app (Customer already has `projectId` in `app.json`; Partner gets its own).

---

## 7. Git branches (simple)

| Branch | Deploys to |
|--------|------------|
| `main` | prod (after approval) |
| `beta` | beta Play Store tracks |
| `test` / `staging` | test internal builds |
| `develop` | dev — Expo local only |

**Flow:** `feature/*` → `develop` → `test` → `beta` → `main`

Customer and Partner can release on the **same branch** — tag commits:

- `customer-v1.2.0-test`
- `partner-v1.0.1-beta`

---

## 8. Play Store — 2 apps × tracks

Each listing has **3 tracks**:

| Track | Env | Who |
|-------|-----|-----|
| Internal testing | test | Team (max 100) |
| Closed testing | beta | Pilot users, maids |
| Production | prod | Everyone |

```
Play Console
├── QuickMaid (Customer)     package: in.quickmaid.customer
│   ├── Internal  ← eas build --profile test
│   ├── Closed    ← eas build --profile beta
│   └── Production ← eas build --profile production
└── QuickMaid Partner        package: in.quickmaid.partner
    ├── Internal
    ├── Closed
    └── Production
```

**Become a Partner** link in Customer prod app → Partner prod Play Store URL only.

For test builds, use test package IDs or internal track links shared with QA.

---

## 9. Backend + DB per env (when API exists)

| Env | API deployment | Database |
|-----|----------------|----------|
| dev | localhost / docker | `quickmaid_dev` |
| test | `api-test.quickmaid.in` | `quickmaid_test` |
| beta | `api-beta.quickmaid.in` | `quickmaid_beta` (or prod read-only) |
| prod | `api.quickmaid.in` | `quickmaid_prod` |

Admin Angular (`QuickMaid`) also gets env files:

- `environment.test.ts` → test API
- `environment.prod.ts` → prod API

---

## 10. Daily cheat sheet

| I want to… | Command / action |
|------------|------------------|
| Code locally (customer) | `cd apps/customer && npx expo start` |
| Code locally (partner) | `cd apps/partner && npx expo start --port 8082` |
| QA APK (both) | `eas build --profile test` in each app folder |
| Pilot users | Upload `beta` build to Play **closed testing** |
| Go live | `eas build --profile production` → Play **production** |
| Check which API app uses | `EXPO_PUBLIC_APP_ENV` + splash badge "TEST" in non-prod |

---

## 11. Optional: non-prod badge on UI

In dev/test/beta, show a small banner so nobody confuses environments:

```ts
if (appEnv !== 'production') {
  // show "TEST" pill in header
}
```

---

## 12. Current state (today)

| Item | Status |
|------|--------|
| Customer demo (no API) | Working |
| `eas.json` profiles | Only `preview` + `production` — extend to 4 profiles |
| `.env` / `app.config.ts` | Not wired yet — add in Phase 3 |
| Partner app | Not scaffolded yet |
| QuickMaid-API | Not built yet |

**Next implementation steps:** scaffold `apps/partner`, add `app.config.ts` + full `eas.json` profiles to both apps, wire `EXPO_PUBLIC_APP_ENV`.
