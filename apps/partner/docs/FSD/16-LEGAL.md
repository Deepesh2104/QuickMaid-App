# FSD 16 — Legal & Policies

**Status:** `UI-DEMO` (static content)  
**Domain:** `src/features/legal/`  
**Routes:** `app/legal/[slug].tsx` → `PartnerLegalScreen`

## Overview

Renders Terms of Service, Privacy Policy, and partner-specific policies from bundled markdown/HTML constants.

## Route & component map

| Route param | Content source |
|-------------|----------------|
| `terms` | `legal-content.ts` |
| `privacy` | `legal-content.ts` |
| `payout-policy` | `legal-content.ts` |
| `code-of-conduct` | `legal-content.ts` |

| Component | File |
|-----------|------|
| `PartnerLegalScreen` | `legal/components/PartnerLegalScreen.tsx` |
| `legal-content.ts` | Section bodies |
| `legal.premium.ts` | Stats, eyebrow |

## Data (today)

Fully static — no storage, no network.

## Phase 4 API

Optional CMS (versioned legal docs):

```
GET /api/v1/content/legal/:slug?app=partner&locale=en
```

**Response:**
```json
{
  "slug": "terms",
  "title": "Partner Terms of Service",
  "version": "2026-06-01",
  "sections": [
    { "heading": "1. Acceptance", "body": "..." }
  ]
}
```

## API call site matrix

| Component | Action | Today | Phase 4 |
|-----------|--------|-------|---------|
| `PartnerLegalScreen` | Mount `[slug]` | `LEGAL_CONTENT[slug]` | `GET /content/legal/:slug` |
| `PartnerSettingsScreen` | Open terms | `router.push(/legal/terms)` | Same |
| Apply / KYC consent | Link | In-app WebView or route | Same + record consent version on submit |

### Consent linkage (KYC)

| Component | Action | Phase 4 |
|-----------|--------|---------|
| `PartnerKycFlowScreen` review step | Consent checkbox | `POST /kyc/submit` includes `legal_version_accepted` |

## Migration checklist

- [ ] Remote legal content with version pinning  
- [ ] Store accepted version on KYC submit server-side  
