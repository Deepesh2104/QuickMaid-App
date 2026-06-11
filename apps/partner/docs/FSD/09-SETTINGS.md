# FSD 09 — Settings

**Status:** `UI-DEMO`  
**Domain:** `src/features/settings/`  
**Route:** `app/settings/index.tsx` → `PartnerSettingsScreen`

## Overview

Settings hub: **partner preferences** (auto-assign, alerts, haptics, language), demo tools, and navigation to sub-features. See [FSD 18 — Dispatch](./18-DISPATCH.md) for auto-assign.

### Preferences (`settings.storage.ts`)

| Key | Default | Effect |
|-----|---------|--------|
| `autoAssignOffers` | `true` | ON → Schedule auto-confirm; OFF → Requests tab |
| `jobAlerts` | `true` | Dispatch notifications |
| `payoutAlerts` | `true` | Payout inbox |
| `kycAlerts` | `true` | KYC reminders |
| `hapticFeedback` | `true` | UI haptics |
| `language` | `en` | Partial i18n via `usePartnerI18n` |

## Route & component map

| Component | File | Role |
|-----------|------|------|
| `PartnerSettingsScreen` | `settings/components/PartnerSettingsScreen.tsx` | Section list |
| `PartnerSettingsPreferences` | `settings/components/PartnerSettingsPreferences.tsx` | Toggles incl. **auto-assign** |
| `PartnerSettingsDemoTools` | `settings/components/PartnerSettingsDemoTools.tsx` | Reset jobs, KYC flip, bridge sync |
| `settings.premium.ts` | `SETTINGS_SECTIONS`, `SETTINGS_STATS` | Static config |

### Navigation targets (from settings rows)

| Row label | Destination route |
|-----------|-------------------|
| Notifications | `/notifications` |
| Job history | `/job/history` |
| Work slots | `/slots` |
| Referral program | `/referral` |
| Book for my home | `/book-home` |
| Legal & policies | `/legal/terms` |
| Delete account | `/account/delete` |

## Data (today)

| Module | File |
|--------|------|
| Preferences | `settings/lib/settings.storage.ts` |
| Demo tools | `settings/components/PartnerSettingsDemoTools.tsx` (reset jobs, KYC flip, bridge sync) |
| App version | `profile.premium.ts` `APP_VERSION` |

## Phase 4 API

Optional preferences endpoint:

```
GET /api/v1/maids/me/preferences
PATCH /api/v1/maids/me/preferences
```

```json
{
  "language": "hi",
  "marketing_opt_in": false
}
```

Push notification prefs **removed** from partner app — only in-app inbox (see notifications FSD).

## API call site matrix

| Component | Action | Today | Phase 4 |
|-----------|--------|-------|---------|
| `PartnerSettingsScreen` | Render rows | Static `SETTINGS_SECTIONS` | Same |
| `PartnerSettingsScreen` | Row press | `router.push(href)` | Same |
| `PartnerSettingsScreen` | Version label | `APP_VERSION` constant | `GET /app/config` optional |
| `PartnerSettingsPreferences` | Toggle prefs | `settings.storage.update` | `PATCH /maids/me/preferences` |
| `PartnerSettingsDemoTools` | Sync bridge | `syncCustomerBookingBridge` | — (demo) |

**No direct API calls** in settings screen — delegated to child feature routes.

## Migration checklist

- [ ] Add preferences API if language/locale settings added  
- [ ] Remote config for support phone numbers (currently in help FSD)  
