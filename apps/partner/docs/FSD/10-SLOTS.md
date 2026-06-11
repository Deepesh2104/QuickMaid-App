# FSD 10 — Work Slots

**Status:** `UI-DEMO`  
**Domain:** `src/features/slots/`  
**Route:** `app/slots/index.tsx` → `PartnerSlotsScreen`

## Overview

Partner selects preferred work windows (morning, afternoon, Sunday) used for dispatch matching. Also selected during apply form.

## Route & component map

| Component | File | Role |
|-----------|------|------|
| `PartnerSlotsScreen` | `slots/components/PartnerSlotsScreen.tsx` | Toggle UI |
| `PartnerSlotToggleCard` | `PartnerSlotToggleCard.tsx` | Per-slot card |
| `slots.utils.ts` | `togglePreferredSlot`, `slotsSummaryLabel` | Pure helpers |
| `slots.premium.ts` | `PREFERRED_SLOTS`, defaults | Constants |

## Data model

`profile.preferredSlotIds: string[]` — values: `morning`, `afternoon`, `sunday`.

Storage: embedded in `PartnerProfile` via `PartnerContext.updateProfile`.

## Current implementation

| Location | Action |
|----------|--------|
| `PartnerSlotsScreen` | Toggle slot → `updateProfile({ preferredSlotIds })` |
| `apply.tsx` | Initial slot selection in registration |
| `PartnerProfileSections` | Summary label via `slotsSummaryLabel` |

## Phase 4 API

```
PATCH /api/v1/maids/me/slots
```

**Request:**
```json
{
  "preferred_slot_ids": ["morning", "afternoon"]
}
```

**Response:**
```json
{
  "preferred_slot_ids": ["morning", "afternoon"],
  "dispatch_eligible": true
}
```

Validation: at least one slot required.

## API call site matrix

| Component | Action | Today | Phase 4 |
|-----------|--------|-------|---------|
| `PartnerSlotsScreen` | Toggle slot | `updateProfile({ preferredSlotIds })` | `PATCH /maids/me/slots` |
| `PartnerSlotsScreen` | Save / mount | Immediate save on toggle | Debounced PATCH or explicit Save CTA |
| `apply.tsx` | Submit apply | Included in `seedProfileFromApply` | `POST /maids/register` body |
| `PartnerProfileSections` | Display summary | Read `profile.preferredSlotIds` | From `GET /maids/me` |

## Errors

| Case | UI |
|------|-----|
| Zero slots selected | `PartnerAlert` — must pick at least one |

## Migration checklist

- [ ] Dedicated slots endpoint (don't overload generic PATCH)  
- [ ] Server validates slot IDs against dispatch config  
