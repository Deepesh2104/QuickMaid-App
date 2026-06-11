# FSD 09 — Settings

**Status:** `UI-DEMO` (navigation hub only)  
**Domain:** `src/features/settings/`  
**Route:** `app/settings/index.tsx` → `PartnerSettingsScreen`

## Overview

Settings menu linking to sub-features: notifications, job history, slots, referral, book-home, legal, delete account. No persistent settings storage in demo.

## Route & component map

| Component | File | Role |
|-----------|------|------|
| `PartnerSettingsScreen` | `settings/components/PartnerSettingsScreen.tsx` | Section list |
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

No `settings.storage.ts`. App version from `profile.premium.ts` `APP_VERSION`.

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

**No direct API calls** in settings screen — delegated to child feature routes.

## Migration checklist

- [ ] Add preferences API if language/locale settings added  
- [ ] Remote config for support phone numbers (currently in help FSD)  
