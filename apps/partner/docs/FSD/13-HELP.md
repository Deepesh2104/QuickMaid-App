# FSD 13 — Help (FAQ Tab)

**Status:** `UI-DEMO`  
**Domain:** `src/features/help/`  
**Route:** `app/(tabs)/help.tsx` → `PartnerHelpScreen`

## Overview

Help tab with FAQ accordion, contact options (call, WhatsApp), and entry to support chat. Mostly static content.

## Route & component map

| Component | File | Role |
|-----------|------|------|
| `PartnerHelpScreen` | `help/components/PartnerHelpScreen.tsx` | FAQ list |
| `PartnerHelpHeader` | `PartnerHelpHeader.tsx` | Hero |
| `PartnerHelpReach` | `PartnerHelpReach.tsx` | Call / WhatsApp / chat |
| FAQ items | `help/constants` or inline | Static Q&A |

## Data (today)

| Source | Type |
|--------|------|
| `PARTNER_FAQ_ITEMS` | Static strings |
| `normalizeSupportTopic` | Maps FAQ category → support topic |
| `useOpenSupportChat` | Navigation only |

Phone/WhatsApp numbers: hardcoded in `PartnerHelpReach` (or premium constants).

## Phase 4 API

Optional CMS:

```
GET /api/v1/content/partner-faq?locale=hi
```

```json
{
  "items": [
    { "id": "payouts", "q": "When do I get paid?", "a": "...", "topic": "payouts" }
  ],
  "support": {
    "phone": "+919876543210",
    "whatsapp": "+919876543210",
    "hours": "8 AM – 8 PM IST"
  }
}
```

No write APIs from help tab.

## API call site matrix

| Component | Action | Today | Phase 4 |
|-----------|--------|-------|---------|
| `PartnerHelpScreen` | Render FAQ | Static array | `GET /content/partner-faq` |
| `PartnerHelpReach` | Call | `Linking.openURL('tel:...')` | Number from API config |
| `PartnerHelpReach` | WhatsApp | `Linking.openURL('whatsapp://...')` | Number from API config |
| `PartnerHelpReach` | Live chat | `useOpenSupportChat()` | → Support FSD `POST /tickets` |
| FAQ row → chat | Tap help on topic | `useOpenSupportChat({ topic })` | Same |

## Migration checklist

- [ ] Fetch FAQ + support numbers from remote config  
- [ ] Hindi copy via `locale` query  
