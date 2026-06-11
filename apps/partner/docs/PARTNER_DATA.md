# Partner Data Contract (Mobile)

UI-only demo today; shapes align with **QuickMaid-API** `/api/v1/maids` + admin CRM (`/admin/maids`, `/admin/dispatch`, `/admin/payouts`).

## Identity (`users` / `PartnerProfile`)

| Field | Required | Source | Notes |
|-------|----------|--------|-------|
| `phone` | Yes | Auth OTP | +91, primary login |
| `name` | Yes | Apply / Profile edit | `firstName` + `lastName` derived |
| `firstName`, `lastName` | Yes | Apply form | Used in KYC name match |
| `dateOfBirth` | Recommended | Apply / DOB picker | `DD/MM/YYYY`; can derive from `publicId` |
| `gender` | Optional | Apply | `female` / `male` / `other` |
| `maritalStatus` | Optional | Apply | single / married / widowed / other |
| `email` | Optional | Apply / Profile | Receipts & support |
| `alternatePhone` | Optional | Profile | Backup contact |
| `city` | Yes | Apply | Raipur (live) |
| `zone` | Yes | Apply | Dispatch zone — Shankar Nagar, Sector 5, … |
| `skills` | Yes | Apply | Cleaning, Deep clean, Cooking, … |
| `languages` | Optional | Profile | Hindi, Chhattisgarhi, … |
| `experienceYears` | Optional | Apply | `0-1`, `1-3`, `3-5`, `5+` |
| `travelMode` | Optional | Profile | walk / cycle / bus / auto |
| `workRadiusKm` | Optional | Profile | 3, 5, 8, 10 km |
| `bio` | Optional | Profile | Short intro for customers |
| `photoUri` | Recommended | Profile photo screen | Local URI → API `photo_url` |
| `publicId` | Auto | Registration | `MD-{6-digit}` maid ID |
| `memberSince` | Auto | Registration | e.g. `Jan 2025` |
| `upiId` | Recommended | Apply / KYC payout | Weekly payout destination |
| `kycStatus` | Yes | KYC wizard | `pending` \| `under_review` \| `verified` \| `rejected` |
| `preferredSlotIds` | Recommended | Slots picker | `morning`, `afternoon`, `sunday` |

## Addresses (`partner_addresses` / work location)

| Field | Required | Notes |
|-------|----------|-------|
| `id` | Yes | UUID |
| `label` | Yes | `Home` \| `Other` |
| `line` | Yes | Flat / street / landmark |
| `landmark` | Optional | Near City Mall |
| `zone` | Yes | Raipur service zone |
| `pincode` | Recommended | 492001 |
| `isDefault` | Yes | One default work address |

## Emergency contact (`emergency_contact`)

| Field | Notes |
|-------|-------|
| `name` | Spouse / parent / … |
| `phone` | 10-digit |
| `relation` | Spouse, Parent, Sibling, … |

## Runtime state (`PartnerRuntimeState`)

| Field | API mapping (future) | Notes |
|-------|---------------------|-------|
| `isOnline` | `maids.is_online` | Toggle on Home header |
| `todayEarningsPaise` | Derived | Demo stat on home |
| `weekJobs` | Derived | Demo stat on home |

## Jobs (`bookings` + `booking_assignments`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | `j1`, `j2`, … |
| `bookingRef` | string | `QM-74990101` |
| `customerName` | string | Masked until accepted |
| `customerPhone` | string? | 10-digit; tel: after accept |
| `service` | string | Deep clean · 2h |
| `address` | string | Full visit address |
| `zone` | string | Raipur zone |
| `pincode`, `landmark` | string? | Optional |
| `slotLabel` | string | Mon–Sat · 8–11 AM |
| `visitDate` | string | Today, Tomorrow, date label |
| `amountPaise` | number | Gross booking amount |
| `status` | JobStatus | See lifecycle below |
| `distanceKm` | number? | From partner work address |
| `completionOtp` | string? | 6-digit; customer shares at end |
| `declineReason` | string? | Set when declined |

### Job status lifecycle

```
pending → accepted → in_progress → completed
pending → declined
```

## KYC draft (`@qmp/partner_kyc_draft`)

| Section | Fields | Verification |
|---------|--------|--------------|
| Aadhaar | `aadhaarNumber`, `aadhaarName`, `aadhaarVerified` | Demo OTP `123456` |
| Selfie | `selfieUri` | `expo-image-picker` camera |
| PAN | `panNumber`, `panName`, `panVerified` | Internal demo API + name match |
| Bank | `accountHolder`, `accountNumber`, `ifsc`, `bankVerified` | IFSC lookup + name match |
| UPI | `upiId`, `upiName`, `upiVerified` | Internal demo API + name match |
| Consent | `consentAccepted` | Required on review step |

## Earnings (`maid_earnings_ledger`)

| Field | Notes |
|-------|-------|
| `id` | Ledger row ID |
| `title` | Job or payout label |
| `subtitle` | Booking ref or UPI mask |
| `amountPaise` | Positive = credit; negative = payout |
| `kind` | `credit` \| `payout` |
| `date` | Display label |

Platform fee: ~10% deducted in UI (`netEarningPaise`).

## Notifications (`partner_notifications`)

| Field | Notes |
|-------|-------|
| `id` | Unique |
| `title`, `body`, `detail?` | Copy |
| `time` | Relative label |
| `createdAt` | ISO timestamp |
| `kind` | `job` \| `payout` \| `kyc` \| `system` |
| `jobId?` | Deep link to job |

## Support tickets (`@qmp/partner_support_tickets`)

| Field | Notes |
|-------|-------|
| `id` | Ticket ID |
| `topic` | payouts, kyc, job, … |
| `status` | open / resolved |
| `messages[]` | `{ role, body, at }` |

## Account deletion (7-day purge window)

| Field | Notes |
|-------|-------|
| `deletionRequestedAt` | ISO timestamp on `PartnerProfile` when user requests delete |
| `ACCOUNT_DELETION_GRACE_DAYS` | `7` — login within window auto-restores account |

**Flow:** soft delete (logout) → grace period → permanent purge if no login. See [`FSD/17-ACCOUNT.md`](./FSD/17-ACCOUNT.md).

## Referral (demo — API future)

| Field | Notes |
|-------|-------|
| `code` | Derived from `publicId` → `QM-{id}` |
| `rewardPaise` | ₹500 referrer / ₹200 new partner (welcome) |
| `referrals[]` | Name, status, bonus — `referral.demo.ts` |
| `referredByCode` | On `PartnerProfile` — code entered at signup |
| Policy doc | `/legal/referral-policy` |

**Auth routing:** new phone → `/(auth)/refer-welcome` → apply. Returning → `/(tabs)/requests`.

## Storage keys (demo)

| Key | Entity |
|-----|--------|
| `@qmp/onboarding_done` | Onboarding flag |
| `@qmp/auth_complete` | Session flag |
| `@qmp/partner_profile` | Active `PartnerProfile` |
| `@qmp/partner_state` | Online + stats |
| `@qmp/registered_partners` | Phone → profile map |
| `@qmp/partner_jobs` | Job list overrides |
| `@qmp/partner_kyc_draft` | KYC wizard draft |
| `@qmp/partner_notifications_read` | Read notification IDs |
| `@qmp/partner_notifications_inbox` | Custom inbox rows |
| `@qmp/partner_support_tickets` | Support chat history |

## Demo credentials

| Item | Value |
|------|-------|
| Partner phone | `9876543210` |
| Auth OTP | `123456` |
| Maid ID | `MD-903210` |
| Visit completion OTP | `482916` (job `j2`, `j11`) |
| PAN demo | `ABCDE1234F` |
| Bank | Ac `1234567890`, IFSC `SBIN0001234` |
| UPI | `demo.partner@okaxis` |

## API mapping (Phase 4 — planned)

| Mobile module | Future endpoint |
|---------------|-----------------|
| `storage.ts` auth | `POST /auth/otp/send`, `POST /auth/otp/verify` |
| `storage.ts` profile | `GET/PATCH /maids/me` |
| `jobs.storage.ts` | `GET /maids/me/jobs`, `POST /jobs/:id/accept`, `POST /jobs/:id/decline` |
| `job.completion.ts` | `POST /jobs/:id/complete` `{ otp }` |
| `kyc.storage.ts` | `POST /maids/me/kyc`, `GET /maids/me/kyc/status` |
| `earnings.utils` | `GET /maids/me/earnings`, `GET /maids/me/payouts` |
| `notifications.storage.ts` | `GET /maids/me/notifications` |
| `support.storage.ts` | `GET/POST /maids/me/tickets` |

See [`README.md`](../README.md) § API & data layer for summary tables.  
**Per-feature API call sites:** [`FSD/README.md`](./FSD/README.md) (17 feature FSDs + architecture).
