# FSD 14 — Referral Rewards

**Status:** `UI-DEMO`  
**Domain:** `src/features/referral/`  
**Routes:** `app/account/referrals.tsx`

## Overview

Referral programme: share code from profile card or dedicated screen, view earned/pending rewards ledger, copy/share via system sheet. Code lives on `profile_account.referralCode`.

### User stories

| ID | Story |
|----|-------|
| REF-1 | Customer sees referral code on profile |
| REF-2 | Customer copies or shares code |
| REF-3 | Customer views credited and pending rewards |
| REF-4 | Friend applies code at checkout (demo) |
| REF-5 | Wallet credited when referral completes |

## Route & component map

| Route | File | Screen |
|-------|------|--------|
| `/account/referrals` | `account/referrals.tsx` | `ReferralRewardsScreen` |

### Key modules

| Module | File |
|--------|------|
| `ReferralRewardsScreen` | `referral/components/ReferralRewardsScreen.tsx` |
| `ProfileReferralCard` | `profile/components/ProfileReferralCard.tsx` |
| `referral.storage` | `referral/lib/referral.storage.ts` |
| `referral.types` | `referral/types/referral.types.ts` |

Checkout applies referral via coupon/referral field in checkout draft (`pendingCoupon` key optional).

## Data model

| Entity | Storage key | Fields |
|--------|-------------|--------|
| Referral code | `@qm/profile_account` → `referralCode` | e.g. `PRIYA100` |
| Ledger events | `@qm/referral_ledger` | `ReferralEvent[]` |
| Demo seed | — | 3 events if ledger empty |

See [`CUSTOMER_DATA.md`](../CUSTOMER_DATA.md) — `referrals` stat on profile.

## Current demo behaviour

| Function | File | Behaviour |
|----------|------|-----------|
| `getReferralEvents` | `referral.storage.ts` | Stored or `DEMO_EVENTS` |
| `buildReferralSummary` | `referral.storage.ts` | Totals earned / pending |
| `ReferralRewardsScreen` | Share | `Share.share` + `Clipboard` |
| `useProfileAccount` | Mount | Reads `referralCode` from account |

Referral credit at checkout is demo-only (wallet bump via checkout utils).

## Phase 4 API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/customers/me/referrals` | GET | Summary + ledger |
| `/api/v1/customers/me/referrals/code` | GET | Active code |
| `/api/v1/customers/me/referrals/invite` | POST | Track share channel |
| `/api/v1/customers/me/coupons/validate` | POST | Apply referral at checkout |

### GET referrals response (shape)

```json
{
  "code": "PRIYA100",
  "total_earned_paise": 20000,
  "pending_paise": 10000,
  "events": [{ "friend_name": "Neha K.", "status": "credited", "reward_paise": 10000 }]
}
```

## API call site matrix

| Component | User action | Today | Phase 4 |
|-----------|-------------|-------|---------|
| `ReferralRewardsScreen` | Mount | `getReferralEvents` + `useProfileAccount` | `GET /referrals` |
| `ReferralRewardsScreen` | Copy code | `Clipboard.setStringAsync` | — |
| `ReferralRewardsScreen` | Share | `Share.share` | `POST /referrals/invite` |
| `ProfileReferralCard` | View rewards | Navigate `/account/referrals` | — |
| `CheckoutCartScreen` | Apply code | Local coupon validate | `POST /coupons/validate` |
| `useProfileAccount` | Stats strip | `account.referrals` count | From API aggregate |

## Errors & edge cases

| Case | Demo | API |
|------|------|-----|
| Invalid referral at checkout | Inline error | 422 `invalid_referral` |
| Self-referral | — | 400 |
| Expired pending event | `expired` status | Cron job |
| Code regeneration | Static demo code | `POST /referrals/code/rotate` |
| Empty ledger | Demo seed shown | Empty array OK |

## Migration checklist

- [ ] Server generates unique referral codes per customer  
- [ ] Ledger from API; remove `DEMO_EVENTS`  
- [ ] Checkout validation server-side before discount  
- [ ] Wallet credit via webhook, not local bump  
- [ ] Sync `account.referrals` from API stats  
