# FSD 16 — Legal Hub & Documents

**Status:** `UI-DEMO`  
**Domain:** `src/features/legal/`  
**Routes:** `app/legal/*`

## Overview

Legal document hub: terms, privacy, cancellation, refund, and community guidelines. Static markdown-style sections bundled in app; opened from Help policy bento, profile links, and checkout consent footers.

### User stories

| ID | Story |
|----|-------|
| LEG-1 | Customer browses all legal documents |
| LEG-2 | Customer reads full document with sections |
| LEG-3 | Customer opens doc from Help or checkout |
| LEG-4 | Customer sees last-updated date |
| LEG-5 | Deep link `/legal/[doc]` works |

## Route & component map

| Route | File | Screen |
|-------|------|--------|
| `/legal` | `legal/index.tsx` | `LegalHubScreen` |
| `/legal/[doc]` | `legal/[doc].tsx` | `LegalDocumentScreen` |

Layout: `app/legal/_layout.tsx`.

### Key modules

| Module | File |
|--------|------|
| `LegalHubScreen` | `legal/components/LegalHubScreen.tsx` |
| `LegalDocumentScreen` | `legal/components/LegalDocumentScreen.tsx` |
| `useOpenLegal` | `legal/hooks/useOpenLegal.ts` |
| `legal.content` | `legal/constants/legal.content.ts` |
| `legal.types` | `legal/types/legal.types.ts` |
| `HelpPolicyBento` | `help/components/HelpPolicyBento.tsx` |

### Document IDs (`LegalDocId`)

`terms`, `privacy`, `cancellation`, `refunds`, `community` — defined in `legal.content.ts`.

## Data model

No AsyncStorage — content is static `LEGAL_DOCUMENTS` record:

| Field | Notes |
|-------|-------|
| `id` | Route param |
| `title`, `eyebrow`, `updated` | Header |
| `summary` | Hub card blurb |
| `sections[]` | `{ heading, body }` |

See [`CUSTOMER_DATA.md`](../CUSTOMER_DATA.md) — no legal entity; compliance copy only.

## Current demo behaviour

| Function | File | Behaviour |
|----------|------|-----------|
| `LEGAL_DOCUMENTS` | `legal.content.ts` | Full text for 5 docs |
| `LegalHubScreen` | Render | Lists all doc cards |
| `LegalDocumentScreen` | `useLocalSearchParams().doc` | Lookup by id |
| `useOpenLegal` | hook | `router.push(/legal/${id})` |
| `HelpPolicyBento` | Tap | Opens matching doc |

Invalid `doc` param shows fallback / back navigation.

## Phase 4 API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/content/legal` | GET | Document index + versions |
| `/api/v1/content/legal/:id` | GET | HTML/Markdown body |
| `/api/v1/customers/me/consents` | POST | Record acceptance (signup/checkout) |

Optional CMS (Strapi/Sanity) for legal updates without app release.

## API call site matrix

| Component | User action | Today | Phase 4 |
|-----------|-------------|-------|---------|
| `LegalHubScreen` | Mount | `LEGAL_DOCUMENTS` keys | `GET /content/legal` |
| `LegalDocumentScreen` | Mount | Local lookup | `GET /content/legal/:id` |
| `HelpPolicyBento` | Open doc | `useOpenLegal` | Same |
| `CheckoutPaymentScreen` | Terms link | `useOpenLegal('terms')` | Same |
| `SignupScreen` | Privacy link | `useOpenLegal('privacy')` | Same + `POST /consents` |
| `useOpenLegal` | Navigate | `router.push` | — |

## Errors & edge cases

| Case | Demo | API |
|------|------|-----|
| Unknown doc id | Not found UI | 404 |
| Offline | Bundled copy works | Cache last fetch |
| Locale | English only | `Accept-Language` |
| Version drift | Static `updated` field | `version` + force re-consent |
| Long document | ScrollView | Same |

## Migration checklist

- [ ] Fetch legal bundle on app start; fallback to bundled `legal.content.ts`  
- [ ] Track consent timestamps on signup and major policy updates  
- [ ] Add Hindi translations via CMS or i18n files  
- [ ] Keep route shape `/legal/[doc]` for deep links  
- [ ] Link refund/cancellation docs from booking cancel flow  
