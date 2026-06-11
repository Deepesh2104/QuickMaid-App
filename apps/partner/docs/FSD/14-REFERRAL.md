# FSD 14 — Referral

**Status:** `UI-DEMO`  
**Domain:** `src/features/referral/`  
**Route:** `app/referral/index.tsx` → `PartnerReferralScreen`

## Overview

Partner shares referral code (`QM-{publicId}`), sees reward rules (₹500 per successful referral), and demo referral history.

## Route & component map

| Component | File | Role |
|-----------|------|------|
| `PartnerReferralScreen` | `referral/components/PartnerReferralScreen.tsx` | Code + share + history |
| `referral.demo.ts` | `DEMO_REFERRALS`, reward constants | Static |
| `referral.premium.ts` | UI copy, stats | Static |

## Data (today)

| Field | Source |
|-------|--------|
| Referral code | Derived `QM-${profile.publicId}` |
| Reward amount | `REFERRAL_REWARD_PAISE` constant |
| History rows | `DEMO_REFERRALS` |

Uses `usePartner().profile` for code display. Share via `Share.share()` (native).

## Phase 4 API

```
GET /api/v1/maids/me/referrals
```

**Response:**
```json
{
  "code": "QM-903210",
  "reward_paise": 50000,
  "total_earned_paise": 100000,
  "referrals": [
    {
      "id": "ref1",
      "name": "Sunita D.",
      "status": "completed",
      "bonus_paise": 50000,
      "referred_at": "2026-05-12"
    }
  ]
}
```

```
POST /api/v1/maids/me/referrals/track-share
```

Optional analytics when user taps Share.

## API call site matrix

| Component | Action | Today | Phase 4 |
|-----------|--------|-------|---------|
| `PartnerReferralScreen` | Mount | Read `profile.publicId` | `GET /referrals` |
| `PartnerReferralScreen` | Render history | `DEMO_REFERRALS` | `referrals[]` from API |
| `PartnerReferralScreen` | Share button | `Share.share({ message })` | Same + optional `POST /track-share` |
| `PartnerReferralScreen` | Copy code | Clipboard | Same |
| `PartnerSettingsScreen` | Link | `router.push(/referral)` | Same |

## Migration checklist

- [ ] Replace demo history with API list  
- [ ] Server generates stable referral code (not client-derived)  
- [ ] Deep link `quickmaid-partner://referral?code=` for attribution  
