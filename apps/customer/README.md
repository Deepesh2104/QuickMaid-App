# QuickMaid Customer App

<p align="center">
  <strong>Native customer mobile app for QuickMaid</strong><br>
  Book verified home-cleaning pros in Raipur · React Native · Expo SDK 56 · TypeScript
</p>

| | |
|---|---|
| **Package** | `customer` v1.0.0 |
| **Bundle ID** | `in.quickmaid.customer` |
| **Deep link scheme** | `quickmaid://` |
| **Runtime** | UI-only demo — **no HTTP backend** (AsyncStorage) |
| **Planned backend** | [QuickMaid-API](https://github.com/Deepesh2104/QuickMaid) Phase 3 |

---

## Table of contents

1. [Project overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Setup instructions](#3-setup-instructions)
4. [Environment variables](#4-environment-variables)
5. [Folder & file structure](#5-folder--file-structure)
6. [Routing](#6-routing)
7. [State management](#7-state-management)
8. [API & data layer](#8-api--data-layer)
9. [UI components](#9-ui-components)
10. [Feature screens](#10-feature-screens)
11. [Styling](#11-styling)
12. [Error handling & logging](#12-error-handling--logging)
13. [Build & deployment](#13-build--deployment)
14. [Testing](#14-testing)
15. [Conventions & best practices](#15-conventions--best-practices)
16. [Cross-reference index](#16-cross-reference-index)

---

## 1. Project overview

### Purpose

The QuickMaid **Customer App** is the mobile client for homeowners in Raipur to discover cleaning services, book visits, manage subscriptions (QuickMaid Plus), track pros, pay via UPI/card/wallet, and manage account settings. It mirrors the web booking flow and admin CRM data shapes so a future REST API can drop in without UI rewrites.

### Key features

| Domain | Capabilities |
|--------|-------------|
| **Onboarding & auth** | Splash, 3-slide onboarding, city picker, phone OTP (demo `123456`), signup, permissions |
| **Home & catalogue** | Service discovery, search, bundles, top pros, deliver-to address sheet |
| **Booking** | Service detail → checkout (cart, address, schedule, payment) → auto pro assignment |
| **Bookings hub** | List/filter, detail, track, reschedule, cancel, rate, invoice/receipt PDF, disputes |
| **QuickMaid Plus** | Plan picker, subscribe, payment, manage membership, billing history |
| **Profile** | Identity, addresses (map picker), payments, wallet, prefs, membership, referrals |
| **Support** | Help centre, live chat UI, ticket list, booking disputes |
| **Security** | App lock (PIN + biometrics via `expo-local-authentication`) |
| **i18n** | English + Hindi (`LanguageProvider`) |
| **Notifications** | Inbox with deep-link actions |

### Tech stack

| Layer | Choice |
|-------|--------|
| Framework | React Native 0.85 + Expo ~56 |
| Navigation | Expo Router 56 (file-based, typed routes) |
| Language | TypeScript 6 (strict) |
| Forms | react-hook-form + zod |
| Persistence | `@react-native-async-storage/async-storage` |
| Animation | react-native-reanimated 4 |
| Fonts | Plus Jakarta Sans (`@expo-google-fonts/plus-jakarta-sans`) |
| Icons | `@expo/vector-icons` (Ionicons) |

### Demo credentials

| Flow | Value |
|------|-------|
| Phone | Any valid 10-digit Indian number |
| OTP | `123456` (`DEMO_OTP` in `src/constants/app.ts`) |
| City | Raipur (only live city) |

---

## 2. Architecture

### High-level diagram

```mermaid
flowchart TB
  subgraph UI["Presentation (app/ + src/features/)"]
    ROUTES[Expo Router screens]
    COMP[Feature + shared components]
  end

  subgraph State["Client state"]
    CTX[React Context<br/>AuthFlow · Checkout · Language]
    HOOKS[Feature hooks]
  end

  subgraph Data["Data layer (demo)"]
    LIB[src/lib/storage.ts]
    FEAT_STORE[Feature *.storage.ts modules]
    ASYNC[(AsyncStorage)]
  end

  subgraph Future["Phase 3 — not wired"]
    API[QuickMaid-API REST + JWT]
    DB[(PostgreSQL)]
  end

  ROUTES --> COMP
  COMP --> CTX & HOOKS
  CTX & HOOKS --> LIB & FEAT_STORE
  LIB & FEAT_STORE --> ASYNC
  FEAT_STORE -.->|replace| API
  API -.-> DB
```

### Layer responsibilities

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Routes** | `app/` | Thin route files; import screen components from `src/features/` |
| **Features** | `src/features/<domain>/` | Screens, sub-components, hooks, types, `lib/` business logic |
| **Shared UI** | `src/components/` | Reusable buttons, inputs, headers, navigation chrome |
| **Context** | `src/context/` | Cross-screen ephemeral state (checkout draft, auth wizard) |
| **Persistence** | `src/lib/` + `src/features/*/lib/*.storage.ts` | AsyncStorage read/write, demo seeds |
| **Theme** | `src/theme/` | Colors, typography, spacing tokens |
| **i18n** | `src/i18n/` | `en.ts`, `hi.ts`, `LanguageProvider` |

### Provider tree

Root layout (`app/_layout.tsx`) wraps the app in this order:

```
SafeAreaProvider
└── AuthFlowProvider
    └── LanguageProvider
        └── CheckoutProvider
            └── AppLockGate
                └── Stack (Expo Router)
```

---

## 3. Setup instructions

### Prerequisites

- **Node.js** 18+ or 20+ LTS
- **npm** 9+
- **Expo Go** on a physical device (recommended) or Android/iOS simulator
- **Git** (optional)

### Install

```bash
cd QuickMaid-App/apps/customer
npm install
```

### Run (development)

```bash
# Start Metro + QR code
npm start
# or
npx expo start

# Platform shortcuts
npm run android    # Expo Go / emulator
npm run ios        # Simulator (macOS only)
npm run web        # Web preview (limited — some native modules unavailable)
```

### Tunnel (remote device testing)

```bash
npx expo start --tunnel
```

Requires `@expo/ngrok` (already in `devDependencies`).

### TypeScript path alias

`@/*` maps to `src/*` (see `tsconfig.json`). Example:

```ts
import { colors } from '@/theme/colors';
import { useCheckout } from '@/context/CheckoutContext';
```

---

## 4. Environment variables

### Current state

**No `.env` file is used.** The app runs entirely offline with seeded demo data. Configuration is hard-coded in:

| Source | Contents |
|--------|----------|
| `src/constants/app.ts` | `DEMO_OTP`, `STORAGE_KEYS` |
| `src/constants/demo.ts` | Demo booking seeds |
| `src/constants/services.ts` | Service catalogue |
| `src/constants/customer.zones.ts` | Raipur zones, slots |
| `app.json` | Bundle IDs, splash, EAS project ID |

### Recommended env vars (Phase 3)

When integrating QuickMaid-API, add `expo-constants` + `app.config.ts`:

| Variable | Example | Used by |
|----------|---------|---------|
| `EXPO_PUBLIC_API_BASE_URL` | `https://api.quickmaid.in` | Future `src/lib/api/client.ts` |
| `EXPO_PUBLIC_RAZORPAY_KEY` | `rzp_live_xxx` | Payment gateway |
| `EXPO_PUBLIC_ENV` | `development` \| `staging` \| `production` | Feature flags |
| `EXPO_PUBLIC_SENTRY_DSN` | `https://...` | Error reporting |

Access pattern:

```ts
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.apiBaseUrl;
```

---

## 5. Folder & file structure

### Repository layout

```
apps/customer/
├── app/                    # Expo Router — file-based routes (49 screens)
├── assets/                 # App icon, splash, favicon
├── docs/
│   └── CUSTOMER_DATA.md    # API data contract (identity, addresses, prefs)
├── src/
│   ├── components/         # Shared UI + navigation
│   ├── constants/          # App-wide constants & demo seeds
│   ├── context/            # React Context providers
│   ├── features/           # Domain modules (screens + logic)
│   ├── hooks/              # App-level hooks
│   ├── i18n/               # Translations
│   ├── lib/                # Core storage helpers
│   └── theme/              # Design tokens
├── app.json                # Expo config
├── package.json
├── tsconfig.json
├── babel.config.js
└── README.md               # This file
```

### Structure diagram

```mermaid
flowchart LR
  subgraph app_dir["app/"]
    IDX[index.tsx Splash]
    AUTH["(auth)/"]
    TABS["(tabs)/"]
    CHK[checkout/]
    BKG[booking/]
    ACC[account/]
    OTH[plus · support · legal · pro · …]
  end

  subgraph src_dir["src/"]
    FEAT[features/]
    COMP[components/]
    CTX[context/]
    THM[theme/]
  end

  app_dir -->|imports| FEAT
  FEAT --> COMP
  FEAT --> CTX
  COMP --> THM
```

### `app/` — route files

| Path | File | Screen component |
|------|------|------------------|
| `/` | `index.tsx` | `AppSplashScreen` + `getInitialRoute()` |
| `/(auth)/onboarding` | `(auth)/onboarding.tsx` | Inline `OnboardingScreen` |
| `/(auth)/city` | `(auth)/city.tsx` | Inline `CityScreen` |
| `/(auth)/login` | `(auth)/login.tsx` | Inline `LoginScreen` |
| `/(auth)/otp` | `(auth)/otp.tsx` | Inline `OtpScreen` |
| `/(auth)/signup` | `(auth)/signup.tsx` | Inline `SignupScreen` |
| `/(auth)/permissions` | `(auth)/permissions.tsx` | Inline `PermissionsScreen` |
| `/(tabs)/` | `(tabs)/index.tsx` | `HomeScreen` |
| `/(tabs)/catalogue` | `(tabs)/catalogue.tsx` | `CatalogueScreen` |
| `/(tabs)/bookings` | `(tabs)/bookings.tsx` | `BookingsScreen` |
| `/(tabs)/plans` | `(tabs)/plans.tsx` | `PlusScreen` |
| `/(tabs)/support` | `(tabs)/support.tsx` | `HelpScreen` |
| `/(tabs)/profile` | `(tabs)/profile.tsx` | `ProfileScreen` (hidden tab — `href: null`) |
| `/checkout/*` | `checkout/*.tsx` | Checkout flow screens |
| `/service/[id]` | `service/[id].tsx` | `ServiceDetailScreen` |
| `/booking/*` | `booking/**/*.tsx` | Booking management screens |
| `/notifications/*` | `notifications/*.tsx` | `NotificationsScreen`, `NotificationDetailScreen` |
| `/payments/[id]` | `payments/[id].tsx` | `PaymentTransactionDetailScreen` |
| `/plus/*` | `plus/*.tsx` | Plus subscription flow |
| `/account/*` | `account/*.tsx` | Account sub-screens |
| `/legal/*` | `legal/*.tsx` | `LegalHubScreen`, `LegalDocumentScreen` |
| `/support/*` | `support/*.tsx` | `SupportChatScreen`, `SupportTicketsScreen` |
| `/pro/*` | `pro/*.tsx` | `ProsDirectoryScreen`, `ProProfileScreen` |
| `/catalogue` | `catalogue/index.tsx` | `CatalogueScreen` (stack entry) |

### `src/features/` — domain modules

| Feature | Key paths | Responsibility |
|---------|-----------|----------------|
| `home/` | `components/HomeScreen.tsx`, `hooks/` | Dashboard, search, rails, deliver-to |
| `checkout/` | `components/Checkout*Screen.tsx`, `lib/checkout.*` | Cart → payment → place order |
| `bookings/` | `components/Booking*Screen.tsx`, `lib/bookings.storage.ts` | List, detail, lifecycle actions |
| `service/` | `ServiceDetailScreen.tsx` | Single service PDP |
| `plus/` | `Plus*Screen.tsx`, `lib/plus.*` | Membership plans & billing |
| `profile/` | `ProfileScreen.tsx`, `lib/profile.storage.ts` | Account CRUD, addresses, prefs |
| `payment/` | `Payment*`, `lib/payment.storage.ts` | Razorpay modals, txn history |
| `wallet/` | `WalletTransactionsScreen.tsx` | Wallet ledger |
| `coupons/` | `CouponWalletScreen.tsx` | Coupon wallet & checkout apply |
| `referral/` | `ReferralRewardsScreen.tsx` | Referral code & rewards |
| `notifications/` | `Notifications*`, `lib/notifications.storage.ts` | Inbox |
| `support/` | `Support*`, `BookingDisputeScreen.tsx` | Chat, tickets, disputes |
| `help/` | `HelpScreen.tsx` | Help tab content |
| `legal/` | `Legal*`, `constants/legal.content.ts` | Terms, privacy, refund policy |
| `pro/` | `Pro*Screen.tsx` | Pro directory & profile |
| `security/` | `AppLock*`, `lib/appLock.storage.ts` | PIN / biometric gate |
| `saved-services/` | `SavedServicesScreen.tsx` | Favourites |

### `src/components/` — shared UI

| Folder | Files | Purpose |
|--------|-------|---------|
| `ui/` | `QmButton`, `QmInput`, `OtpInput`, `ScreenHeader`, … | Design-system primitives |
| `navigation/` | `TabBarButton`, `CatalogueTabButton` | Custom tab bar |
| `splash/` | `AppSplashScreen.tsx` | Branded splash animation |
| `home/` | `HomeHero`, `ServiceListCard`, … | Legacy/shared home blocks |

### `src/theme/`

| File | Exports |
|------|---------|
| `colors.ts` | Brand palette (`primary: #0B6E67`, ink, surfaces, semantic) |
| `typography.ts` | `type` scale (display, title, body, caption) |
| `spacing.ts` | `spacing`, `radius`, `shadow` tokens |
| `fonts.ts` | Plus Jakarta Sans family names |
| `layout.metrics.ts` | Tab bar height, safe-area helpers |

### `src/constants/`

| File | Purpose |
|------|---------|
| `app.ts` | `STORAGE_KEYS`, `UserProfile`, `DEMO_OTP` |
| `services.ts` | `ServiceItem[]` catalogue |
| `customer.zones.ts` | Raipur zones, `PREFERRED_SLOTS` |
| `cities.ts` | City list (Raipur live) |
| `onboarding.ts` | Onboarding slide content |
| `demo.ts` | Seeded demo bookings |
| `pagination.ts` | Default page sizes |

---

## 6. Routing

### Navigation model

- **Expo Router** file-based routing with typed routes (`experiments.typedRoutes: true`)
- **Stack** at root for modals and pushed flows
- **Tabs** for main shell (5 visible tabs + hidden profile)
- **Initial route** always `index` (splash) — never bypassed on cold start

### Routing diagram

```mermaid
flowchart TD
  SPLASH["/ index — Splash"]
  SPLASH -->|onboarding pending| ONB["/(auth)/onboarding"]
  SPLASH -->|onboarding done| LOGIN["/(auth)/login"]
  SPLASH -->|auth complete| TABS["/(tabs)"]

  ONB --> CITY["/(auth)/city"]
  CITY --> LOGIN
  LOGIN --> OTP["/(auth)/otp"]
  OTP -->|new user| SIGN["/(auth)/signup"]
  OTP -->|returning| TABS
  SIGN --> PERM["/(auth)/permissions"]
  PERM --> TABS

  TABS --> HOME["/(tabs)/ index"]
  TABS --> BOOK["/(tabs)/bookings"]
  TABS --> CAT["/(tabs)/catalogue"]
  TABS --> PLUS["/(tabs)/plans"]
  TABS --> HELP["/(tabs)/support"]

  HOME --> SVC["/service/[id]"]
  SVC --> CHK["/checkout → address → schedule → payment → success"]
  BOOK --> DET["/booking/[id]"]
  DET --> SUB["reschedule · cancel · rate · track · invoice · receipt · dispute"]
  PLUS --> SUBPLUS["/plus/subscribe → payment → success"]
  HOME --> PROF["/(tabs)/profile"]
  PROF --> ACC["/account/* · /legal/* · /notifications"]
```

### Full route table

| Route | Component | Entry points |
|-------|-----------|--------------|
| `/` | Splash | App cold start |
| `/(auth)/onboarding` | Onboarding | First launch |
| `/(auth)/city` | City picker | After onboarding |
| `/(auth)/login` | Phone login | Returning pre-auth users |
| `/(auth)/otp` | OTP verify | After login |
| `/(auth)/signup` | Profile signup | New users post-OTP |
| `/(auth)/permissions` | Location + notifications | Post-signup |
| `/(tabs)/` | `HomeScreen` | Main tab |
| `/(tabs)/catalogue` | `CatalogueScreen` | Centre FAB tab |
| `/(tabs)/bookings` | `BookingsScreen` | Main tab |
| `/(tabs)/plans` | `PlusScreen` | Main tab |
| `/(tabs)/support` | `HelpScreen` | Main tab |
| `/(tabs)/profile` | `ProfileScreen` | Home header avatar |
| `/catalogue` | `CatalogueScreen` | Deep link / home launcher |
| `/service/[id]` | `ServiceDetailScreen` | Home, catalogue, search |
| `/checkout` | `CheckoutCartScreen` | `useCheckout().startCheckout()` |
| `/checkout/address` | `CheckoutAddressScreen` | Checkout stack |
| `/checkout/schedule` | `CheckoutScheduleScreen` | Checkout stack |
| `/checkout/payment` | `CheckoutPaymentScreen` | Checkout stack |
| `/checkout/success` | `CheckoutSuccessScreen` | Post-payment |
| `/booking/[id]` | `BookingDetailScreen` | Bookings list, notifications |
| `/booking/reschedule/[id]` | `BookingRescheduleScreen` | Booking detail |
| `/booking/cancel/[id]` | `BookingCancelScreen` | Booking detail |
| `/booking/rate/[id]` | `BookingRateScreen` | Completion prompt |
| `/booking/track/[id]` | `BookingTrackScreen` | Booking detail |
| `/booking/invoice/[id]` | `BookingDocumentScreen` | Booking detail |
| `/booking/receipt/[id]` | `BookingDocumentScreen` | Booking detail |
| `/booking/dispute/[id]` | `BookingDisputeScreen` | Booking detail |
| `/notifications` | `NotificationsScreen` | Home bell |
| `/notifications/[id]` | `NotificationDetailScreen` | Inbox |
| `/payments/[id]` | `PaymentTransactionDetailScreen` | Profile payment history |
| `/plus/subscribe` | `PlusSubscribeScreen` | Plus tab CTA |
| `/plus/payment` | `PlusSubscribePaymentScreen` | Subscribe flow |
| `/plus/success` | `PlusSubscribeSuccessScreen` | Post-subscribe |
| `/plus/manage` | `PlusManageScreen` | Active members |
| `/plus/billing` | `PlusBillingHistoryScreen` | Manage screen |
| `/account/delete` | `DeleteAccountScreen` | Profile security |
| `/account/referrals` | `ReferralRewardsScreen` | Profile referral card |
| `/account/address-picker` | `AddressMapPickerScreen` | Profile / checkout |
| `/account/saved-services` | `SavedServicesScreen` | Profile |
| `/account/wallet-transactions` | `WalletTransactionsScreen` | Profile wallet |
| `/account/coupon-wallet` | `CouponWalletScreen` | Profile / checkout |
| `/account/app-lock` | `AppLockSettingsScreen` | Profile security |
| `/legal` | `LegalHubScreen` | Help / profile |
| `/legal/[doc]` | `LegalDocumentScreen` | Hub links |
| `/support/chat` | `SupportChatScreen` | Help centre |
| `/support/tickets` | `SupportTicketsScreen` | Help / profile |
| `/pro` | `ProsDirectoryScreen` | Home top pros |
| `/pro/[id]` | `ProProfileScreen` | Directory, booking maid sheet |

### Splash boot logic

`app/index.tsx` enforces minimum **1.5s** splash (`SPLASH_DELAY_MS`), then calls `getInitialRoute()` from `src/lib/storage.ts`:

| Condition | Route |
|-----------|-------|
| `authComplete === true` | `/(tabs)` |
| `onboardingDone === true` | `/(auth)/login` |
| else | `/(auth)/onboarding` |

---

## 7. State management

### No Redux / Zustand

State is managed through **React Context** (ephemeral UI flows) and **AsyncStorage** (persistent demo data). Feature modules expose `*.storage.ts` helpers — these become the API client boundary in Phase 3.

### React Context providers

#### `AuthFlowContext` (`src/context/AuthFlowContext.tsx`)

| Field / method | Type | Purpose |
|----------------|------|---------|
| `city`, `phone`, `name`, `email`, `gender`, `homeType`, `locality` | `string` | Wizard state across auth screens |
| `setCity`, `setPhone`, … | setter fns | Updated per auth step |
| **Hook** | `useAuthFlow()` | Used in `(auth)/*` routes |

**Consumers:** `login.tsx`, `otp.tsx`, `signup.tsx`, `city.tsx`

#### `CheckoutContext` (`src/context/CheckoutContext.tsx`)

| Field / method | Type | Purpose |
|----------------|------|---------|
| `draft` | `CheckoutDraft` | Cart, address, slot, payment, coupon |
| `account` | `ProfileAccountData \| null` | Cached profile for checkout |
| `lastOrder` | `PlacedOrder \| null` | Success screen data |
| `loading` | `boolean` | Payment in progress |
| `startCheckout(service)` | fn | Seeds draft, navigates to `/checkout` |
| `updateDraft(patch)` | fn | Partial draft updates |
| `processPaymentAndPlaceOrder(onStep, gateway?)` | fn | Payment simulation + booking creation |
| `refreshAccount()` | fn | Reload profile from storage |
| `clearCheckout()` | fn | Reset draft |
| **Hook** | `useCheckout()` | Checkout + service detail screens |

**Side effects on order placement:** `bookings.storage`, `payment.storage`, `wallet.storage`, `coupon.storage`, `notifications.storage`, `profile.storage`

#### `LanguageProvider` (`src/i18n/LanguageProvider.tsx`)

| Export | Purpose |
|--------|---------|
| `locale` | `'en' \| 'hi'` from profile prefs |
| `t(key, vars?)` | Dot-path translation lookup |
| `greeting(firstName?)` | Time-based greeting string |
| **Hook** | `useTranslation()` |

Subscribes to `subscribeProfileAccount()` for live locale switches.

### AsyncStorage keys

Defined in `src/constants/app.ts` → `STORAGE_KEYS`:

| Key | Storage module | Data |
|-----|----------------|------|
| `@qm/onboarding_done` | `src/lib/storage.ts` | Boolean flag |
| `@qm/auth_complete` | `src/lib/storage.ts` | Session flag |
| `@qm/user_profile` | `src/lib/storage.ts` | `UserProfile` |
| `@qm/registered_users` | `src/lib/storage.ts` | Phone → profile map |
| `@qm/profile_account` | `profile.storage.ts` | Addresses, payments, prefs, membership |
| `@qm/user_bookings` | `bookings.storage.ts` | Placed orders |
| `@qm/booking_overrides` | `bookings.storage.ts` | Reschedule/cancel/review patches |
| `@qm/payment_history` | `payment.storage.ts` | Gateway transactions |
| `@qm/notifications_inbox` | `notifications.storage.ts` | Notification feed |
| `@qm/notifications_read` | `notifications.storage.ts` | Read IDs |
| `@qm/plus_last_subscription` | `plus.subscribe.ts` | Last Plus purchase |
| `@qm/referral_ledger` | `referral.storage.ts` | Referral events |
| `@qm/support_tickets` | `support.storage.ts` | Support tickets + messages |
| `@qm/booking_disputes` | `support.storage.ts` | Dispute records |
| `@qm/wallet_transactions` | `wallet.storage.ts` | Wallet ledger |
| `@qm/coupon_wallet` | `coupon.storage.ts` | Saved coupons |
| `@qm/pending_coupon` | `coupon.storage.ts` | Checkout coupon bridge |
| `@qm/pending_visit_complete` | `booking.completion.ts` | Post-visit OTP prompt |
| `@qm/app_lock_settings` | `appLock.storage.ts` | PIN hash, biometric flag |

### Pub/sub pattern

`profile.storage.ts` and `appLock.storage.ts` expose `subscribe*()` listeners so UI re-renders when storage changes without a global store.

---

## 8. API & data layer

### Current implementation: **no HTTP calls**

A codebase-wide search shows **zero** `fetch`, `axios`, or `/api/` usage. All data flows through AsyncStorage modules listed above. Payment uses **simulated** Razorpay modals (`RazorpayGatewayModal.tsx`) — no live gateway SDK.

### Data contract

See [`docs/CUSTOMER_DATA.md`](./docs/CUSTOMER_DATA.md) for field-level shapes aligned with future `GET/PATCH /api/v1/customers/:id`.

### Planned REST API (Phase 3)

Mapped from [QuickMaid PHASE3_BACKEND.md](../../../QuickMaid/docs/PHASE3_BACKEND.md). Replace the **Storage module** column when wiring the API.

#### Authentication

| Endpoint | Method | Request | Response | Replaces (today) | Future caller |
|----------|--------|---------|----------|------------------|---------------|
| `/api/v1/auth/otp/send` | POST | `{ phone: string }` | `{ sessionId, expiresIn }` | Demo skip in `login.tsx` | `(auth)/login.tsx` |
| `/api/v1/auth/otp/verify` | POST | `{ phone, otp, sessionId }` | `{ accessToken, refreshToken, user }` | `otp.tsx` + `DEMO_OTP` | `(auth)/otp.tsx` |
| `/api/v1/auth/refresh` | POST | `{ refreshToken }` | `{ accessToken }` | — | `src/lib/api/client.ts` |
| `/api/v1/auth/me` | GET | Bearer token | `UserProfile` | `getUserProfile()` | Splash / app resume |
| `/api/v1/auth/logout` | POST | — | `204` | `clearSession()` | Profile logout |

#### Customers & profile

| Endpoint | Method | Request | Response | Replaces | Caller |
|----------|--------|---------|----------|----------|--------|
| `/api/v1/customers/me` | GET | — | `ProfileAccountData` | `getProfileAccount()` | `ProfileScreen`, `CheckoutContext` |
| `/api/v1/customers/me` | PATCH | Partial profile | `ProfileAccountData` | `patchProfileAccount()` | Profile modals |
| `/api/v1/customers/me/addresses` | POST/PATCH/DELETE | Address CRUD | `Address[]` | `profile.storage` addresses | `AddressMapPickerScreen` |
| `/api/v1/customers/me/avatar` | POST | multipart | `{ avatarUrl }` | `profile.photo.ts` local URI | `ProfileEditProfileModal` |

#### Bookings

| Endpoint | Method | Request | Response | Replaces | Caller |
|----------|--------|---------|----------|----------|--------|
| `/api/v1/bookings` | GET | `?status=&page=` | `PlacedOrder[]` | `getAllBookings()` | `BookingsScreen` |
| `/api/v1/bookings` | POST | Checkout payload | `PlacedOrder` | `addStoredBooking()` | `CheckoutContext.processPaymentAndPlaceOrder` |
| `/api/v1/bookings/:id` | GET | — | `DemoBooking` | `getBookingById()` | `BookingDetailScreen` |
| `/api/v1/bookings/:id/reschedule` | POST | `{ date, slotId }` | `DemoBooking` | `rescheduleBookingById()` | `BookingRescheduleScreen` |
| `/api/v1/bookings/:id/cancel` | POST | `{ reason }` | `{ refundStatus }` | `cancelBookingById()` | `BookingCancelScreen` |
| `/api/v1/bookings/:id/review` | POST | `{ rating, comment }` | `Review` | `submitBookingReview()` | `BookingRateScreen` |
| `/api/v1/bookings/:id/complete` | POST | `{ otp }` | `DemoBooking` | `completeBookingById()` | `BookingCompletionOtpCard` |
| `/api/v1/dispatch/track/:id` | GET | — | `{ lat, lng, eta, status }` | Demo track data | `BookingTrackScreen` |

#### Payments & wallet

| Endpoint | Method | Request | Response | Replaces | Caller |
|----------|--------|---------|----------|----------|--------|
| `/api/v1/payments` | GET | — | `PaymentRecord[]` | `getPaymentHistory()` | `ProfilePaymentHistorySection` |
| `/api/v1/payments/:id` | GET | — | `PaymentRecord` | `getPaymentById()` | `PaymentTransactionDetailScreen` |
| `/api/v1/payments/intent` | POST | `{ amount, mode }` | Razorpay order | `completePayment()` sim | `CheckoutPaymentScreen` |
| `/api/v1/wallet/transactions` | GET | — | `WalletTransaction[]` | `listWalletTransactions()` | `WalletTransactionsScreen` |

#### Plus / subscriptions

| Endpoint | Method | Request | Response | Replaces | Caller |
|----------|--------|---------|----------|----------|--------|
| `/api/v1/plans` | GET | — | `PlusPlan[]` | `plus.plans.ts` constants | `PlusSubscribeScreen` |
| `/api/v1/subscriptions` | POST | `{ planId }` | `Subscription` | `plus.subscribe.ts` | `PlusSubscribePaymentScreen` |
| `/api/v1/subscriptions/me` | GET/PATCH | — | `Membership` | `profile.membership` | `PlusManageScreen` |

#### Support & notifications

| Endpoint | Method | Request | Response | Replaces | Caller |
|----------|--------|---------|----------|----------|--------|
| `/api/v1/tickets` | GET/POST | Ticket body | `SupportTicket` | `support.storage.ts` | `SupportTicketsScreen`, `SupportChatScreen` |
| `/api/v1/tickets/:id/messages` | POST | `{ body }` | `Message` | `appendTicketMessage()` | `SupportChatScreen` |
| `/api/v1/bookings/:id/disputes` | POST | Dispute form | `BookingDispute` | `submitBookingDispute()` | `BookingDisputeScreen` |
| `/api/v1/notifications` | GET | — | `AppNotification[]` | `getNotifications()` | `NotificationsScreen` |
| `/api/v1/notifications/:id/read` | POST | — | `204` | `markNotificationRead()` | `NotificationDetailScreen` |

#### Growth

| Endpoint | Method | Replaces | Caller |
|----------|--------|----------|--------|
| `/api/v1/coupons/redeem` | POST | `redeemCouponCode()` | `CouponWalletScreen` |
| `/api/v1/referrals/me` | GET | `getReferralEvents()` | `ReferralRewardsScreen` |

### Storage → screen cross-reference

| Storage module | Primary screens |
|----------------|-----------------|
| `src/lib/storage.ts` | Splash, auth flow, profile logout |
| `profile.storage.ts` | `ProfileScreen`, all checkout screens, `LanguageProvider` |
| `bookings.storage.ts` | `BookingsScreen`, all `/booking/*` screens |
| `checkout.payment.ts` | `CheckoutPaymentScreen` |
| `payment.storage.ts` | `PaymentTransactionDetailScreen`, profile history |
| `wallet.storage.ts` | `WalletTransactionsScreen`, checkout wallet deduction |
| `coupon.storage.ts` | `CouponWalletScreen`, `CheckoutPaymentScreen` |
| `notifications.storage.ts` | `NotificationsScreen`, `HomeHeader` badge |
| `support.storage.ts` | `SupportChatScreen`, `SupportTicketsScreen`, `BookingDisputeScreen` |
| `referral.storage.ts` | `ReferralRewardsScreen` |
| `plus.subscribe.ts` | All `/plus/*` screens |
| `appLock.storage.ts` | `AppLockGate`, `AppLockSettingsScreen` |
| `booking.completion.ts` | `BookingsScreen`, `BookingDetailScreen` (visit complete modal) |

---

## 9. UI components

### Design-system primitives (`src/components/ui/`)

| Component | Props (summary) | State | Dependencies | Typical usage |
|-----------|-----------------|-------|--------------|---------------|
| `QmButton` | `label`, `onPress`, `variant`, `disabled`, `loading`, `icon`, `size` | — | `expo-haptics`, theme | CTAs across app |
| `QmInput` | extends `TextInputProps` + `label`, `hint`, `error`, `prefix` | `focused`, internal `text` | theme | Forms, profile modals |
| `OtpInput` | `value`, `onChange`, `length`, `error`, `autoFocus` | per-cell focus | — | `(auth)/otp.tsx` |
| `PhoneInput` | `onChangeText`, `error` | — | `QmInput` pattern | `(auth)/login.tsx` |
| `ScreenHeader` | `title`, `subtitle`, `onBack`, `right`, `light` | — | `Ionicons` | Stack screens |
| `AuthScreenLayout` | `children`, `hero`, `footer`, `scroll` | — | `SafeAreaView` | Auth wizard screens |
| `AuthHeader` | `title`, `subtitle`, `onBack`, `step`, `totalSteps` | — | — | Auth steps |
| `QmLogo` | `size`, `showText`, `light` | — | SVG/text | Splash, auth |
| `SectionHeader` | `title`, `subtitle`, `action`, `onAction` | — | — | Home sections |
| `SearchBar` | `value`, `onChangeText`, `placeholder`, `onSubmit` | — | — | Catalogue |
| `CategoryChip` | `label`, `icon`, `active`, `onPress` | — | — | Filters |
| `ChoiceChips` | `options`, `value`, `onChange`, `columns` | — | — | Signup, profile |
| `ServiceCard` | `name`, `price`, `rating`, `duration`, `icon`, `onPress` | — | — | Catalogue grids |
| `FeaturedCard` | image, title, meta, `onPress` | — | `expo-image` | Home rails |
| `PromoCard` | title, subtitle, cta, `onPress` | — | — | Offers |
| `QuickAction` | `icon`, `label`, `tint`, `onPress` | — | — | Home quick grid |
| `IconBadge` | `icon`, `size`, `tone`, `ink` | — | — | List rows |
| `ListPagination` | `page`, `totalPages`, `onPageChange` | — | `usePagination` | Long lists |
| `LocationHeader` | `city`, `address`, `onPress` | — | — | Home header |
| `SplitHeroLayout` | `top`, `bottom`, `footer` | — | — | Auth split layouts |
| `WaveShape` | `color`, `height`, `flip` | — | `react-native-svg` | Decorative |
| `BecomePartnerBanner` | `compact?` | — | `Linking` | Home footer CTA |

### Navigation (`src/components/navigation/`)

| Component | Purpose |
|-----------|---------|
| `TabBarButton` | Ripple-safe tab press wrapper |
| `CatalogueTabButton` | Elevated centre FAB for catalogue tab |

### Shared hooks (`src/hooks/`)

| Hook | Returns | Used by |
|------|---------|---------|
| `useAppFonts()` | `{ loaded }` | Root layout — blocks render until fonts load |
| `usePagination({ total, pageSize })` | page state + slice helpers | Bookings, notifications lists |
| `useLayoutMetrics()` | tab bar inset calculations | Screens with bottom padding |

---

## 10. Feature screens

### Screen inventory (47 feature-level screens)

| Screen | File | Primary data source |
|--------|------|---------------------|
| `HomeScreen` | `features/home/components/HomeScreen.tsx` | `services.ts`, `profile.storage`, `notifications.storage` |
| `CatalogueScreen` | `features/home/components/CatalogueScreen.tsx` | `services.ts` |
| `ServiceDetailScreen` | `features/service/components/ServiceDetailScreen.tsx` | `services.ts`, `CheckoutContext` |
| `CheckoutCartScreen` | `features/checkout/components/CheckoutCartScreen.tsx` | `CheckoutContext` |
| `CheckoutAddressScreen` | `features/checkout/components/CheckoutAddressScreen.tsx` | `CheckoutContext` |
| `CheckoutScheduleScreen` | `features/checkout/components/CheckoutScheduleScreen.tsx` | `CheckoutContext`, `customer.zones` |
| `CheckoutPaymentScreen` | `features/checkout/components/CheckoutPaymentScreen.tsx` | `CheckoutContext`, `coupon.storage` |
| `CheckoutSuccessScreen` | `features/checkout/components/CheckoutSuccessScreen.tsx` | `CheckoutContext.lastOrder` |
| `BookingsScreen` | `features/bookings/components/BookingsScreen.tsx` | `bookings.storage`, `booking.completion` |
| `BookingDetailScreen` | `features/bookings/components/BookingDetailScreen.tsx` | `bookings.storage` |
| `BookingRescheduleScreen` | `features/bookings/components/BookingRescheduleScreen.tsx` | `bookings.storage` |
| `BookingCancelScreen` | `features/bookings/components/BookingCancelScreen.tsx` | `bookings.storage` |
| `BookingRateScreen` | `features/bookings/components/BookingRateScreen.tsx` | `bookings.storage` |
| `BookingTrackScreen` | `features/bookings/components/BookingTrackScreen.tsx` | Demo track constants |
| `BookingDocumentScreen` | `features/bookings/components/BookingDocumentScreen.tsx` | `booking.document.ts`, `expo-print` |
| `PlusScreen` | `features/plus/components/PlusScreen.tsx` | `profile.storage` membership |
| `PlusSubscribeScreen` | `features/plus/components/PlusSubscribeScreen.tsx` | `plus.plans.ts` |
| `PlusSubscribePaymentScreen` | `features/plus/components/PlusSubscribePaymentScreen.tsx` | `plus.subscribe.ts` |
| `PlusSubscribeSuccessScreen` | `features/plus/components/PlusSubscribeSuccessScreen.tsx` | `plus.subscribe.ts` |
| `PlusManageScreen` | `features/plus/components/PlusManageScreen.tsx` | `profile.storage` |
| `PlusBillingHistoryScreen` | `features/plus/components/PlusBillingHistoryScreen.tsx` | `payment.storage` |
| `ProfileScreen` | `features/profile/components/ProfileScreen.tsx` | `profile.storage`, `storage.ts` |
| `AddressMapPickerScreen` | `features/profile/components/AddressMapPickerScreen.tsx` | `expo-location`, `profile.storage` |
| `DeleteAccountScreen` | `features/profile/components/DeleteAccountScreen.tsx` | `account.delete.ts` |
| `HelpScreen` | `features/help/components/HelpScreen.tsx` | Static content + deep links |
| `SupportChatScreen` | `features/support/components/SupportChatScreen.tsx` | `support.storage` |
| `SupportTicketsScreen` | `features/support/components/SupportTicketsScreen.tsx` | `support.storage` |
| `BookingDisputeScreen` | `features/support/components/BookingDisputeScreen.tsx` | `support.storage` |
| `NotificationsScreen` | `features/notifications/components/NotificationsScreen.tsx` | `notifications.storage` |
| `NotificationDetailScreen` | `features/notifications/components/NotificationDetailScreen.tsx` | `notifications.storage`, `useNotificationNavigation` |
| `PaymentTransactionDetailScreen` | `features/payment/components/PaymentTransactionDetailScreen.tsx` | `payment.storage` |
| `WalletTransactionsScreen` | `features/wallet/components/WalletTransactionsScreen.tsx` | `wallet.storage` |
| `CouponWalletScreen` | `features/coupons/components/CouponWalletScreen.tsx` | `coupon.storage` |
| `ReferralRewardsScreen` | `features/referral/components/ReferralRewardsScreen.tsx` | `referral.storage` |
| `SavedServicesScreen` | `features/saved-services/components/SavedServicesScreen.tsx` | `profile.storage` favourites |
| `LegalHubScreen` | `features/legal/components/LegalHubScreen.tsx` | `legal.content.ts` |
| `LegalDocumentScreen` | `features/legal/components/LegalDocumentScreen.tsx` | `legal.content.ts` |
| `ProsDirectoryScreen` | `features/pro/components/ProsDirectoryScreen.tsx` | Demo pro roster |
| `ProProfileScreen` | `features/pro/components/ProProfileScreen.tsx` | `maid.profile.ts` |
| `AppLockSettingsScreen` | `features/security/components/AppLockSettingsScreen.tsx` | `appLock.storage` |
| `AppSplashScreen` | `components/splash/AppSplashScreen.tsx` | — |

Auth screens (`OnboardingScreen`, `LoginScreen`, etc.) live inline in `app/(auth)/*.tsx` and compose shared `AuthScreenLayout`, `QmButton`, `OtpInput`.

---

## 11. Styling

### Approach

- **React Native `StyleSheet.create()`** — no CSS, SCSS, or Tailwind
- **Design tokens** centralized in `src/theme/`
- **No component library** (no NativeBase / Tamagui) — custom `Qm*` primitives

### Brand tokens

```ts
// src/theme/colors.ts (primary brand)
primary: '#0B6E67'   // Teal — matches QuickMaid web admin
ink: '#0F1419'
bg: '#FFFFFF'
bgSubtle: '#F4F6F8'
```

### Typography

Plus Jakarta Sans via `useAppFonts()`:

| Token | Use |
|-------|-----|
| `type.display` | Hero headlines |
| `type.title` | Screen titles |
| `type.body` | Paragraph text |
| `type.caption` | Meta, tab labels |
| `type.label` | Input labels, chips |

### Layout patterns

- `useSafeAreaInsets()` for header/footer padding
- `useLayoutMetrics()` for tab-bar-aware scroll content
- `expo-linear-gradient` for hero cards and Plus banners
- `react-native-reanimated` for splash and micro-interactions
- `expo-image` for optimised remote images (Unsplash URLs in `unsplash.images.ts`)

---

## 12. Error handling & logging

### Patterns in use

| Pattern | Where | Example |
|---------|-------|---------|
| `try/catch` on JSON parse | All `*.storage.ts` | Returns `null` / `[]` on corrupt data |
| `Alert.alert()` | User-facing failures | Coupon redeem, account delete, permissions |
| Context guard throws | `useCheckout()`, `useAuthFlow()` | `"must be used within Provider"` |
| Early `return null` | Validation failures | `processPaymentAndPlaceOrder` invalid draft |
| `SplashScreen.preventAutoHideAsync().catch(() => {})` | Boot | Non-fatal native splash errors |
| Inline `error` props | `QmInput`, `OtpInput`, `PhoneInput` | Form validation messages |

### Logging

- **No structured logger** (no Sentry, no `src/lib/logger.ts`)
- Occasional `console.error` in catch blocks (storage, PDF export, UPI deep links)
- **Recommendation for production:** add `expo-error-recovery` + Sentry via EAS secrets

### Payment errors

`CheckoutPaymentScreen` and Razorpay modals surface failures through:
1. Step callback `onStep('failed')`
2. `Alert` with retry CTA
3. No partial order persisted on failure

---

## 13. Build & deployment

### Local production check

```bash
npx expo export --platform android
# Output: dist/
```

### EAS Build (recommended)

Project ID is configured in `app.json`:

```json
"extra": { "eas": { "projectId": "ec741f3c-2a08-4ceb-863d-268107b6b9bf" } }
```

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login
eas login

# Configure (first time)
eas build:configure

# Production builds
eas build --platform android --profile production
eas build --platform ios --profile production

# OTA updates (after setup)
eas update --branch production --message "Bug fix"
```

### Store identifiers

| Platform | Value |
|----------|-------|
| iOS bundle | `in.quickmaid.customer` |
| Android package | `in.quickmaid.customer` |
| URL scheme | `quickmaid` |

### Native capabilities (plugins)

| Plugin | Feature |
|--------|---------|
| `expo-router` | File-based navigation |
| `expo-font` | Custom fonts |
| `expo-splash-screen` | Native splash (`#000806` bg) |
| `expo-image` | Image pipeline |
| `expo-sharing` | Share invoice PDFs |
| `expo-local-authentication` | Biometric app lock |

---

## 14. Testing

### Current state

**No test files exist** (`*.test.ts`, `*.spec.ts` not found). Manual QA via Expo Go is the current approach.

### Recommended setup

```bash
npm install -D jest jest-expo @testing-library/react-native @testing-library/jest-native
```

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
    ]
  }
}
```

### Test priorities

| Layer | Tool | Targets |
|-------|------|---------|
| **Unit** | Jest | `checkout.utils.ts`, `booking.document.ts`, `profile.utils.ts`, `appLock.utils.ts` |
| **Storage integration** | Jest + mocked AsyncStorage | `bookings.storage.ts`, `profile.storage.ts` |
| **Component** | React Native Testing Library | `QmButton`, `OtpInput`, `BookingCard` |
| **E2E** | Maestro or Detox | Splash → OTP → Home → Checkout → Success |

### Manual test script

```
1. Cold start → splash ≥1.5s → onboarding (first run)
2. Login 9876543210 → OTP 123456
3. Signup form → permissions → land on Home
4. Tap service → checkout → pay UPI demo → success
5. Bookings tab → open detail → reschedule → cancel
6. Profile → add address → app lock PIN → background → unlock
7. Switch language Hindi → verify tab labels
```

---

## 15. Conventions & best practices

### Folder organization

```
src/features/<domain>/
├── components/     # Screens (PascalCase + Screen suffix) + section components
├── hooks/          # Domain-specific hooks
├── lib/            # Business logic, storage, utils (no JSX)
├── types/          # TypeScript interfaces
└── constants/      # Domain-static data (optional)
```

### Naming

| Artifact | Convention | Example |
|----------|------------|---------|
| Screen file | `<Name>Screen.tsx` | `BookingDetailScreen.tsx` |
| Route file | kebab-case or `[param]` | `wallet-transactions.tsx`, `[id].tsx` |
| Storage module | `<domain>.storage.ts` | `profile.storage.ts` |
| Hook | `use<Name>.ts` | `useHomeDeliveryAddress.ts` |
| Types | `<domain>.types.ts` | `checkout.types.ts` |
| Constants | `SCREAMING_SNAKE` | `DEMO_OTP`, `STORAGE_KEYS` |

### Route file pattern

Keep routes thin — delegate to feature screens:

```tsx
// app/account/referrals.tsx
import { ReferralRewardsScreen } from '@/features/referral/components/ReferralRewardsScreen';
export default function ReferralRewardsRoute() {
  return <ReferralRewardsScreen />;
}
```

### Import order

1. External packages (`react`, `expo-*`, `react-native`)
2. `@/` absolute imports
3. Relative imports (avoid deep `../../` — prefer `@/`)

### TypeScript

- `strict: true` in `tsconfig.json`
- Prefer `interface` for object shapes in `types/` files
- Use `as const` for storage keys and enums

### Splash rule (project constraint)

- Entry route **must** remain `app/index.tsx`
- Do not `router.replace` from `_layout.tsx` on boot
- Minimum splash display: `SPLASH_DELAY_MS` (1.5s)

### Phase 3 migration guide

1. Create `src/lib/api/client.ts` with JWT interceptor
2. Replace each `*.storage.ts` function with API call + optimistic cache
3. Keep function signatures stable so screens need minimal changes
4. Move `DEMO_OTP` behind `__DEV__` flag
5. Wire `expo-notifications` push token to `/api/v1/devices`

---

## 16. Cross-reference index

### File → feature → route

| Source file | Feature domain | Route(s) |
|-------------|----------------|----------|
| `HomeScreen.tsx` | home | `/(tabs)/` |
| `CatalogueScreen.tsx` | home | `/(tabs)/catalogue`, `/catalogue` |
| `ServiceDetailScreen.tsx` | service | `/service/[id]` |
| `Checkout*Screen.tsx` | checkout | `/checkout/*` |
| `BookingsScreen.tsx` | bookings | `/(tabs)/bookings` |
| `Booking*Screen.tsx` | bookings | `/booking/*` |
| `PlusScreen.tsx` | plus | `/(tabs)/plans` |
| `Plus*Screen.tsx` (subscribe flow) | plus | `/plus/*` |
| `ProfileScreen.tsx` | profile | `/(tabs)/profile` |
| `HelpScreen.tsx` | help | `/(tabs)/support` |
| `AppLockSettingsScreen.tsx` | security | `/account/app-lock` |

### Context → consumers

| Context | Key consumers |
|---------|---------------|
| `AuthFlowContext` | `(auth)/login`, `otp`, `signup`, `city` |
| `CheckoutContext` | `ServiceDetailScreen`, all `Checkout*Screen` |
| `LanguageProvider` | `TabsLayout`, `HomeHeader`, `BookingsHeader`, `HelpHeader`, `PlusHeader` |

### Related documentation

| Document | Location |
|----------|----------|
| Customer data contract | [`docs/CUSTOMER_DATA.md`](./docs/CUSTOMER_DATA.md) |
| Platform overview | [`QuickMaid/docs/PLATFORM.md`](../../../QuickMaid/docs/PLATFORM.md) |
| Phase 3 API plan | [`QuickMaid/docs/PHASE3_BACKEND.md`](../../../QuickMaid/docs/PHASE3_BACKEND.md) |
| Monorepo README | [`QuickMaid-App/README.md`](../../README.md) |

---

## Quick commands

```bash
npm install          # Install dependencies
npm start            # Dev server + QR
npm run android      # Android
npm run ios          # iOS simulator
npx tsc --noEmit     # Type-check (no emit script — run manually)
```

---

<p align="center">
  <sub>QuickMaid Customer App · Expo SDK 56 · UI demo · Phase 3 API integration planned</sub>
</p>
