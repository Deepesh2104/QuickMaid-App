# FSD 13 — Pro Directory & Profile

**Status:** `UI-DEMO`  
**Domain:** `src/features/pro/`, `src/features/bookings/lib/maid.profile.ts`  
**Routes:** `app/pro/*`

## Overview

Browse verified cleaning professionals: searchable directory with skill filters, full pro profile (bio, stats, reviews), and navigation from home top-pros, bookings maid sheet, and booking prefs.

### User stories

| ID | Story |
|----|-------|
| PRO-1 | Customer browses all pros in city |
| PRO-2 | Customer searches by name, skill, or zone |
| PRO-3 | Customer views pro ratings and reviews |
| PRO-4 | Customer opens pro from booking or home rail |
| PRO-5 | Customer books with preferred pro (checkout draft) |

## Route & component map

| Route | File | Screen |
|-------|------|--------|
| `/pro` | `pro/index.tsx` | `ProsDirectoryScreen` |
| `/pro/[id]` | `pro/[id].tsx` | `ProProfileScreen` |

Layout: `app/pro/_layout.tsx`.

### Key modules

| Module | File |
|--------|------|
| `ProsDirectoryScreen` | `pro/components/ProsDirectoryScreen.tsx` |
| `ProProfileScreen` | `pro/components/ProProfileScreen.tsx` |
| `ProProfileBody` | `pro/components/ProProfileBody.tsx` |
| `useOpenProProfile` | `pro/hooks/useOpenProProfile.ts` |
| `listMaidProfiles` | `bookings/lib/maid.profile.ts` |
| `getMaidProfileById` | `bookings/lib/maid.profile.ts` |
| `BookingMaidDetailSheet` | `bookings/components/BookingMaidDetailSheet.tsx` |
| `HomeTopPros` | `home/components/HomeTopPros.tsx` |

## Data model

Static catalogue: `MaidProfileDetail[]` in `maid.profile.ts` — not persisted locally.

| Field | Notes |
|-------|-------|
| `id`, `name`, `rating`, `jobs` | List card |
| `skills`, `zones`, `languages` | Filters |
| `reviews[]` | Social proof |
| `verified[]` | Badge chips |

Maps to partner app pro records in Phase 4. Favourite pro name stored in `@qm/profile_account.bookingPrefs.favoriteMaidName`.

See [`CUSTOMER_DATA.md`](../CUSTOMER_DATA.md) § Booking preferences.

## Current demo behaviour

| Function | File | Behaviour |
|----------|------|-----------|
| `listMaidProfiles` | `maid.profile.ts` | Returns in-memory `MAID_PROFILES` |
| `getMaidProfileById` | `maid.profile.ts` | Lookup by `m_*` id |
| `ProsDirectoryScreen` | component | Client filter by query + skill chip |
| `useOpenProProfile` | hook | `router.push(/pro/${id})` |
| `HomeTopPros` | component | Shows subset → pro profile |

No API — profiles ship with app bundle.

## Phase 4 API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/catalogue/pros` | GET | Directory (city, zone, skill) |
| `/api/v1/catalogue/pros/:id` | GET | Full profile + reviews page |
| `/api/v1/catalogue/pros/:id/availability` | GET | Slots for preferred pro |
| `/api/v1/customers/me/preferred-pro` | PATCH | Save favourite |

## API call site matrix

| Component | User action | Today | Phase 4 |
|-----------|-------------|-------|---------|
| `ProsDirectoryScreen` | Mount | `listMaidProfiles` | `GET /catalogue/pros` |
| `ProsDirectoryScreen` | Search / filter | Local `matchesQuery` | Query params |
| `ProProfileScreen` | Mount | `getMaidProfileById` | `GET /catalogue/pros/:id` |
| `HomeTopPros` | Tap pro | `useOpenProProfile` | Same |
| `BookingMaidDetailSheet` | View profile | `useOpenProProfile` | Same |
| `ProfileEditBookingPrefsModal` | Favourite | Text field local | `PATCH /preferred-pro` |
| `CheckoutScheduleScreen` | Preferred pro | Draft field | Availability API |

## Errors & edge cases

| Case | Demo | API |
|------|------|-----|
| Unknown pro ID | Not-found UI | 404 |
| Pro not in zone | Still listed (demo) | Filter server-side |
| Empty search | Full list | — |
| Review pagination | All inline | `?page=` |
| Pro inactive | — | 410 + hide from directory |

## Migration checklist

- [ ] Replace `MAID_PROFILES` with paginated API  
- [ ] Image URLs from CDN, not initials avatar  
- [ ] Reviews cursor pagination on `ProProfileBody`  
- [ ] Wire preferred pro to checkout slot API  
- [ ] Keep `useOpenProProfile` route shape  
