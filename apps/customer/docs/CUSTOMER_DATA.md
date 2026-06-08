# Customer Data Contract (Mobile)

UI-only demo today; shapes match **QuickMaid-API** `/api/v1/customers` + admin CRM (`CustomerProfileDetail`).

## Identity (`users` / `UserProfile`)

| Field | Required | Source | Notes |
|-------|----------|--------|-------|
| `phone` | Yes | Auth OTP | +91, primary login |
| `name` | Yes | Signup / Account | Min 2 chars |
| `city` | Yes | City picker | Raipur live |
| `email` | Recommended | Signup / Account | Receipts |
| `locality` | Recommended | Signup / Account | Society / area |
| `zone` | Recommended | Account | Raipur service zone |
| `gender` | Optional | Signup / Account | female / male / other |
| `homeType` | Recommended | Signup / Account | 1bhk / 2bhk / 3bhk / villa |
| `avatarUri` | Recommended | Account photo picker | Local URI → API `avatar_url` |

## Addresses (`customer_addresses`)

| Field | Required | Notes |
|-------|----------|-------|
| `label` | Yes | Home / Office / Other |
| `flatNo` | Recommended | Flat / house no. |
| `building` | Optional | Society / tower |
| `street` | Yes | Street / sector line |
| `landmark` | Optional | Near City Mall |
| `zone` | Yes | Shankar Nagar, Sector 5, … |
| `pincode` | Yes | 492001 |
| `city` | Yes | Raipur |
| `gateCode` | Optional | Security / OTP |
| `contactPhone` | Optional | On-site contact |
| `isDefault` | Yes | One default |

## Payments (`payment_methods` + `wallet`)

| Field | Required | Notes |
|-------|----------|-------|
| UPI / card methods | Recommended | Default flag |
| `walletBalance` | Demo | QuickMaid wallet |

## Booking preferences (`booking_prefs`)

| Field | Admin CRM | Notes |
|-------|-----------|-------|
| `preferredSlot` | `preferredSlot` | e.g. Mon–Sat · 8–11 AM |
| `favoriteMaidName` | `favoriteMaid` | Same pro preference |

## Visit access (`visit_access`)

| Field | Notes |
|-------|-------|
| `gateCode` | Gate / society code |
| `hasPets` | Pet at home |
| `petNotes` | Secure pets |
| `parkingNotes` | Parking instructions |
| `visitInstructions` | Pro entry notes |

## Emergency (`emergency_contact`)

| Field | Notes |
|-------|-------|
| `name` | Alternate contact |
| `phone` | 10-digit |
| `relation` | Spouse / parent / … |

## Communication (`communication_prefs`)

| Field | Admin CRM | Notes |
|-------|-----------|-------|
| `whatsappOptIn` | `waOptIn` | WhatsApp updates |
| `preferredChannel` | — | whatsapp / sms / call |

## Notifications (`notification_prefs`)

`booking`, `offers`, `pro`, `sms` toggles.

## Membership (`membership`)

| Field | Admin `plan` | Notes |
|-------|--------------|-------|
| `planType` | instant / monthly / annual | Plus maps to monthly |
| `isPlusMember` | — | Active subscription |
| `plusVisitsLeft` | — | Remaining visits |
| `plusRenewDate` | — | Renewal date |
| `memberSince` | `memberSince` | Join date |

## Stats (read-only / derived)

`visits`, `rating`, `saved`, `referrals`, `supportTickets`, `csat` — from API aggregates.

## App permissions (`app_permissions`)

`locationGranted`, `notificationsGranted` — device + user choice.

## Storage keys (demo)

- `@qm/user_profile` — identity
- `@qm/profile_account` — addresses, payments, prefs, membership
