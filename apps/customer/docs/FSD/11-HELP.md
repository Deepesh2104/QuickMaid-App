# FSD 11 — Help Tab

**Status:** `UI-DEMO`  
**Domain:** `src/features/help/`  
**Routes:** `app/(tabs)/support.tsx` → `HelpScreen`

## Overview

Help tab (labelled Support in tabs): FAQ bento, policy shortcuts, contact footer, and one-tap entry to live support chat by topic. Mostly static content with i18n strings.

### User stories

| ID | Story |
|----|-------|
| HELP-1 | Customer browses FAQ categories |
| HELP-2 | Customer opens legal docs from policy bento |
| HELP-3 | Customer starts support chat for a topic |
| HELP-4 | Customer sees ops phone and email |
| HELP-5 | Deep link `?chat=1&topic=` auto-opens chat |

## Route & component map

| Route | File | Screen |
|-------|------|--------|
| `/(tabs)/support` | `(tabs)/support.tsx` | `HelpScreen` |

### Key components

| Component | File |
|-----------|------|
| `HelpScreen` | `help/components/HelpScreen.tsx` |
| `HelpHeader` | `HelpHeader.tsx` |
| `HelpBody` | `HelpBody.tsx` — FAQ + actions |
| `HelpPolicyBento` | `HelpPolicyBento.tsx` — legal links |
| `HelpFaqSection` | `HelpFaqSection.tsx` (in HelpBody) |

### Related hooks

| Hook | File | Used for |
|------|------|----------|
| `useOpenSupportChat` | `support/hooks/useOpenSupportChat.ts` | Chat navigation |
| `useOpenLegal` | `legal/hooks/useOpenLegal.ts` | Policy documents |
| `useTranslation` | `i18n/LanguageProvider` | Localized copy |

Static contact: `SUPPORT_CONTACT` from `constants/demo.ts`.

## Data model

No dedicated storage — FAQ and copy are compile-time / i18n. Legal doc IDs reference FSD 16 (`legal.content.ts`).

See [`CUSTOMER_DATA.md`](../CUSTOMER_DATA.md) § Stats — `supportTickets` shown on profile, not Help tab.

## Current demo behaviour

| Function | File | Behaviour |
|----------|------|-----------|
| `HelpScreen` | `?chat=1` param | Auto `openSupportChat` once on mount |
| `HelpBody` | Topic tile tap | `openSupportChat({ topic })` |
| `HelpPolicyBento` | Doc tap | `useOpenLegal` → `/legal/[doc]` |
| `normalizeSupportTopic` | `support.utils.ts` | Maps free text → `SupportTopic` |

No API calls — chat creation deferred to Support feature (FSD 10).

## Phase 4 API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/content/help` | GET | FAQ articles (CMS) |
| `/api/v1/content/help/:slug` | GET | Article detail |
| — | — | Chat still via FSD 10 support APIs |

Optional: server-driven FAQ ordering and search.

## API call site matrix

| Component | User action | Today | Phase 4 |
|-----------|-------------|-------|---------|
| `HelpScreen` | Mount | Static render | `GET /content/help` |
| `HelpBody` | FAQ expand | Local state | — |
| `HelpBody` | Contact chat | `useOpenSupportChat` | `POST /support/tickets` |
| `HelpPolicyBento` | Open policy | `useOpenLegal` | `GET /legal/:doc` or static |
| `HelpScreen` | Footer call/email | `Linking.openURL` | — |

## Errors & edge cases

| Case | Demo | API |
|------|------|-----|
| `chat=1` without topic | Default `general` topic | — |
| Legal doc missing | — | 404 → fallback copy |
| Offline | Full static UI works | Cache FAQ bundle |
| i18n missing key | Falls back to English | CMS locale param |

## Migration checklist

- [ ] Optional CMS fetch for FAQ; keep static fallback  
- [ ] Add search across help articles  
- [ ] Analytics event on topic → chat conversion  
- [ ] Keep tab route `support.tsx`; rename only in product copy if needed  
