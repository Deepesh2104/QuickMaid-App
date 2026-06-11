# FSD 07 — Profile Tab

**Status:** `UI-DEMO`  
**Domain:** `src/features/profile/`  
**Routes:** `app/(tabs)/profile.tsx` → `ProfileScreen`

## Overview

Profile hub: identity card, CRM stats, wallet, addresses, payment methods, booking/visit prefs, communication toggles, membership banner, and logout. Edits persist to AsyncStorage via `useProfileAccount`.

### User stories

| ID | Story |
|----|-------|
| PROF-1 | Customer views profile completeness and CRM stats |
| PROF-2 | Customer edits name, email, avatar, zone |
| PROF-3 | Customer manages saved addresses (add via map picker) |
| PROF-4 | Customer tops up wallet and views balance |
| PROF-5 | Customer sets notification, booking, visit-access prefs |
| PROF-6 | Customer logs out to auth flow |

## Route & component map

| Route | File | Screen |
|-------|------|--------|
| `/(tabs)/profile` | `(tabs)/profile.tsx` | `ProfileScreen` |

### Key components

| Component | File |
|-----------|------|
| `ProfileScreen` | `profile/components/ProfileScreen.tsx` |
| `ProfileBody` | `ProfileBody.tsx` — sections orchestrator |
| `ProfileHeader` | `ProfileHeader.tsx` |
| `ProfileIdentityCard` | `ProfileIdentityCard.tsx` |
| `ProfileAddressesSection` | `ProfileAddressesSection.tsx` |
| `ProfileWalletSection` | `ProfileWalletSection.tsx` |
| `ProfilePreferencesSection` | `ProfilePreferencesSection.tsx` |
| `ProfileSecuritySection` | `ProfileSecuritySection.tsx` |
| Edit modals | `ProfileEditProfileModal.tsx`, `ProfileEditAddressModal.tsx`, etc. |

### Hooks & lib

| Module | File | Role |
|--------|------|------|
| `useProfileAccount` | `hooks/useProfileAccount.ts` | Load/persist profile + account |
| `profile.storage` | `lib/profile.storage.ts` | `@qm/profile_account` CRUD |
| `profile.completion` | `lib/profile.completion.ts` | Completeness % |
| `profile.photo` | `lib/profile.photo.ts` | Avatar picker |

Address add/edit navigates to `/account/address-picker` (see FSD 08).

## Data model

| Entity | Storage key | See |
|--------|-------------|-----|
| Identity | `@qm/user_profile` | `CUSTOMER_DATA` § Identity |
| Account blob | `@qm/profile_account` | Addresses, payments, prefs, membership |
| Wallet txns | `@qm/wallet_transactions` | Written on `topUpWallet` |

See [`CUSTOMER_DATA.md`](../CUSTOMER_DATA.md) § Addresses, Payments, Booking preferences, Visit access, Communication, Notifications.

## Current demo behaviour

| Function | File | Behaviour |
|----------|------|-----------|
| `useProfileAccount.refresh` | `useProfileAccount.ts` | `getUserProfile` + `getProfileAccount` |
| `updateProfile` | `useProfileAccount.ts` | `saveUserProfile` + `registerUser` |
| `upsertAddress` / `deleteAddress` | `useProfileAccount.ts` | Normalizes via `normalizeAddress`, saves account |
| `topUpWallet` | `useProfileAccount.ts` | Increments balance + `addWalletTransaction` |
| `setNotificationPrefs` | `useProfileAccount.ts` | Patches `notificationPrefs` |
| `clearSession` | `lib/storage.ts` | Logout → `/(auth)/login` |

No HTTP — all writes go to AsyncStorage.

## Phase 4 API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/customers/me` | GET | Full profile + account aggregate |
| `/api/v1/customers/me` | PATCH | Identity fields |
| `/api/v1/customers/me/addresses` | POST | Add address |
| `/api/v1/customers/me/addresses/:id` | PATCH / DELETE | Update / remove |
| `/api/v1/customers/me/payment-methods` | POST / PATCH / DELETE | Saved methods |
| `/api/v1/customers/me/preferences` | PATCH | Booking, visit, comms, notifications |
| `/api/v1/customers/me/wallet/topup` | POST | Wallet credit via gateway |

## API call site matrix

| Component | User action | Today | Phase 4 |
|-----------|-------------|-------|---------|
| `ProfileScreen` | Mount | `useProfileAccount.refresh` | `GET /customers/me` |
| `ProfileEditProfileModal` | Save | `updateProfile` | `PATCH /customers/me` |
| `ProfileAddressesSection` | Add / edit | → `/account/address-picker` | `POST/PATCH /addresses` |
| `ProfileEditPaymentModal` | Save | `upsertPayment` | `POST /payment-methods` |
| `ProfileWalletTopUpModal` | Top up | `topUpWallet` | `POST /wallet/topup` |
| `ProfilePreferencesSection` | Toggle | `setNotificationPrefs` | `PATCH /preferences` |
| `ProfileEditBookingPrefsModal` | Save | `setBookingPrefs` | `PATCH /preferences` |
| `ProfileEditVisitAccessModal` | Save | `setVisitAccess` | `PATCH /preferences` |
| `ProfileScreen` | Log out | `clearSession` | `POST /auth/logout` |

## Errors & edge cases

| Case | Demo | API |
|------|------|-----|
| Empty account on mount | Blank root | 401 → login |
| Delete last default address | Promotes first remaining | 400 if only address |
| Invalid phone in emergency | Inline validation | 400 field errors |
| Avatar picker cancelled | No-op | — |
| Offline edit | Saves locally | Queue + retry |

## Migration checklist

- [ ] `useProfileAccount` → `customerApi.getMe()` on mount  
- [ ] Split identity PATCH from nested preference PATCH  
- [ ] Address map picker → geocode API before POST  
- [ ] Wallet top-up → Razorpay order + `POST /wallet/topup`  
- [ ] Avatar `avatarUri` → presigned upload → `avatar_url`  
- [ ] Keep modals; swap `saveProfileAccount` for API responses  
