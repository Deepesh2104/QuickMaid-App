# FSD 08 — Account Sub-routes

**Status:** `UI-DEMO`  
**Domain:** `src/features/profile/`, `wallet/`, `coupons/`, `saved-services/`  
**Routes:** `app/account/*`

## Overview

Stack screens linked from profile: map-based address picker, wallet ledger, coupon wallet, saved services, referral entry, app lock, and destructive account deletion.

### User stories

| ID | Story |
|----|-------|
| ACCT-1 | Customer adds/edits address on map |
| ACCT-2 | Customer reviews wallet transaction history |
| ACCT-3 | Customer browses saved coupons |
| ACCT-4 | Customer manages hearted services |
| ACCT-5 | Customer permanently deletes account |

## Route & component map

| Route | File | Screen |
|-------|------|--------|
| `/account/address-picker` | `account/address-picker.tsx` | `AddressMapPickerScreen` |
| `/account/wallet-transactions` | `account/wallet-transactions.tsx` | `WalletTransactionsScreen` |
| `/account/coupon-wallet` | `account/coupon-wallet.tsx` | `CouponWalletScreen` |
| `/account/saved-services` | `account/saved-services.tsx` | `SavedServicesScreen` |
| `/account/referrals` | `account/referrals.tsx` | `ReferralRewardsScreen` (FSD 14) |
| `/account/app-lock` | `account/app-lock.tsx` | `AppLockSettingsScreen` (FSD 15) |
| `/account/delete` | `account/delete.tsx` | `DeleteAccountScreen` |

Layout: `app/account/_layout.tsx` — stack header for sub-screens.

### Key modules

| Module | File |
|--------|------|
| `AddressMapPickerScreen` | `profile/components/AddressMapPickerScreen.tsx` |
| `address.map` | `profile/lib/address.map.ts` |
| `WalletTransactionsScreen` | `wallet/components/WalletTransactionsScreen.tsx` |
| `wallet.storage` | `wallet/lib/wallet.storage.ts` |
| `CouponWalletScreen` | `coupons/components/CouponWalletScreen.tsx` |
| `coupon.storage` | `coupons/lib/coupon.storage.ts` |
| `SavedServicesScreen` | `saved-services/components/SavedServicesScreen.tsx` |
| `useSavedServices` | `saved-services/hooks/useSavedServices.ts` |
| `deleteUserAccount` | `profile/lib/account.delete.ts` |

## Data model

| Entity | Storage key | See |
|--------|-------------|-----|
| Addresses | `@qm/profile_account` → `addresses` | `CUSTOMER_DATA` § Addresses |
| Wallet txns | `@qm/wallet_transactions` | Credit/debit ledger |
| Coupons | `@qm/coupon_wallet` | Saved coupon instances |
| Saved service IDs | `@qm/profile_account` → `savedServiceIds` | Catalogue refs |

## Current demo behaviour

| Function | File | Behaviour |
|----------|------|-----------|
| `AddressMapPickerScreen` | map picker | Reverse-geocode stub + `upsertAddress` via hook |
| `getWalletTransactions` | `wallet.storage.ts` | Seeds demo rows if empty |
| `listCouponWallet` | `coupon.storage.ts` | Seeds `FIRST20`, `QM50`, `CLEAN15` |
| `useSavedServices` | `useSavedServices.ts` | Reads `savedServiceIds`, toggles via profile |
| `deleteUserAccount` | `account.delete.ts` | `multiRemove` keys + `clearSession` → login |

Delete wipes bookings, payments, notifications, app lock, plus subscription, and registered-user map entry.

## Phase 4 API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/customers/me/addresses` | POST / PATCH | Map picker save |
| `/api/v1/customers/me/wallet/transactions` | GET | Ledger |
| `/api/v1/customers/me/coupons` | GET | Wallet coupons |
| `/api/v1/customers/me/saved-services` | GET / POST / DELETE | Heart list |
| `/api/v1/customers/me` | DELETE | Account deletion (GDPR) |

## API call site matrix

| Component | User action | Today | Phase 4 |
|-----------|-------------|-------|---------|
| `AddressMapPickerScreen` | Confirm pin | `upsertAddress` (profile hook) | `POST/PATCH /addresses` |
| `WalletTransactionsScreen` | Mount | `getWalletTransactions` | `GET /wallet/transactions` |
| `CouponWalletScreen` | Mount | `listCouponWallet` | `GET /coupons` |
| `CouponWalletScreen` | Copy code | Clipboard only | — |
| `SavedServicesScreen` | Toggle heart | `toggleSavedServiceIds` | `POST/DELETE /saved-services` |
| `SavedServicesScreen` | Book | `useStartBooking` | → checkout |
| `DeleteAccountScreen` | Confirm delete | `deleteUserAccount` | `DELETE /customers/me` |

## Errors & edge cases

| Case | Demo | API |
|------|------|-----|
| Map location denied | Fallback Raipur centre | Device permission |
| Empty wallet history | Demo seed on first open | Empty array OK |
| Expired coupon | `refreshStatuses` marks expired | Server `status` field |
| Delete without network | Local wipe only | 409 if active bookings |
| Unsave last service | Empty state | 204 |

## Migration checklist

- [ ] Map picker → Places/geocode API + validated zone  
- [ ] Wallet list paginated from API  
- [ ] Coupon wallet synced after checkout redemption  
- [ ] Saved services optimistic toggle + rollback  
- [ ] Delete account → server soft-delete + token revoke  
- [ ] Keep `account/_layout` stack; no route changes  
