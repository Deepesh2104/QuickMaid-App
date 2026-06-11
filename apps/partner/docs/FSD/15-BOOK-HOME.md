# FSD 15 — Book for My Home (Dual Role)

**Status:** `UI-DEMO`  
**Domain:** `src/features/book-home/`  
**Route:** `app/book-home/index.tsx` → `PartnerBookHomeScreen`

## Overview

Allows a partner (same phone may also be a customer) to book cleaning for their own home via the **Customer app**. No partner API — deep link / store handoff only.

## Route & component map

| Component | File | Role |
|-----------|------|------|
| `PartnerBookHomeScreen` | `book-home/components/PartnerBookHomeScreen.tsx` | Explain dual role + CTAs |
| `book-home.premium.ts` | Steps, stats | Static |

## User flow

1. Partner opens Settings → Book for my home  
2. Screen explains same phone works on Customer app  
3. CTA opens Customer app via deep link or Play Store fallback  

## Current implementation

| Action | Code |
|--------|------|
| Open Customer app | `Linking.openURL('quickmaid://')` or package intent |
| Play Store fallback | Customer app store URL constant |

Uses `usePartner().profile.phone` for display only.

## Phase 4 API

**None on Partner API.**

Optional cross-app handoff:

```
POST /api/v1/auth/cross-app-token
{ "target_app": "customer" }
→ { "deep_link": "quickmaid://auth?token=..." }
```

Would be called from `PartnerBookHomeScreen` Open CTA if seamless SSO between apps is required.

## API call site matrix

| Component | Action | Today | Phase 4 |
|-----------|--------|-------|---------|
| `PartnerBookHomeScreen` | Open Customer app | `Linking.openURL` | Optional `POST /cross-app-token` |
| `PartnerBookHomeScreen` | Install CTA | Store URL | Same |
| `PartnerSettingsScreen` | Navigate | `router.push(/book-home)` | Same |

## Related platform docs

- Same phone dual role: `user_roles` in QuickMaid-API  
- Customer app package: `in.quickmaid.customer`  

## Migration checklist

- [ ] Confirm store URLs per environment (test/beta/prod)  
- [ ] Optional SSO token exchange between apps  
