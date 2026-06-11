# API Contract — QuickMaid Mobile ↔ QuickMaid-API

**Base URL:** `{EXPO_PUBLIC_API_BASE_URL}/api/v1`  
**Format:** JSON · UTF-8  
**Auth:** Bearer JWT (except OTP send/verify)  
**Status:** Specification for Phase 4 — **not wired in mobile yet**

---

## 1. Conventions

### 1.1 Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | Yes* | `Bearer <access_token>` |
| `X-App-Client` | Yes | `customer` \| `maid` |
| `Content-Type` | POST/PATCH | `application/json` |
| `Accept-Language` | Optional | `en` \| `hi` |

*Not required for `/auth/otp/send` and `/auth/otp/verify`.

### 1.2 Error envelope

```json
{
  "error": {
    "code": "BOOKING_NOT_FOUND",
    "message": "Booking abc123 not found",
    "details": {}
  }
}
```

| HTTP | Meaning |
|------|---------|
| 400 | Validation error |
| 401 | Missing / expired token |
| 403 | Role not allowed |
| 404 | Resource not found |
| 409 | Conflict (e.g. slot taken) |
| 422 | Business rule violation |
| 500 | Server error |

### 1.3 Pagination

```json
{
  "items": [],
  "page": 1,
  "page_size": 20,
  "total": 142
}
```

Query: `?page=1&page_size=20`

### 1.4 Idempotency

POST booking/payment actions accept optional header:

`Idempotency-Key: <uuid>`

---

## 2. Authentication

| Method | Path | Body | Response | Replaces (demo) |
|--------|------|------|----------|-----------------|
| POST | `/auth/otp/send` | `{ phone, app_client }` | `{ request_id, expires_in }` | Demo skip login |
| POST | `/auth/otp/verify` | `{ phone, otp, app_client }` | `{ token, refresh_token, user, customer?, maid? }` | `DEMO_OTP` |
| POST | `/auth/refresh` | `{ refresh_token }` | `{ token }` | — |
| POST | `/auth/logout` | — | `204` | `clearSession()` |

`app_client`: `"customer"` or `"maid"`.

---

## 3. Customer endpoints

### 3.1 Profile & registration

| Method | Path | Replaces |
|--------|------|----------|
| GET | `/customers/me` | `getUserProfile` + `getProfileAccount` |
| PATCH | `/customers/me` | `updateProfile` |
| POST | `/customers/register` | `completeRegistration` |
| POST | `/customers/me/delete-request` | `deleteUserAccount` |
| DELETE | `/customers/me` | Hard delete after grace |

### 3.2 Addresses

| Method | Path |
|--------|------|
| GET | `/customers/me/addresses` |
| POST | `/customers/me/addresses` |
| PATCH | `/customers/me/addresses/:id` |
| DELETE | `/customers/me/addresses/:id` |

### 3.3 Bookings

| Method | Path | Replaces |
|--------|------|----------|
| GET | `/customers/me/bookings` | `getStoredBookings` |
| POST | `/customers/me/bookings` | `processPaymentAndPlaceOrder` |
| GET | `/customers/me/bookings/:id` | `getBookingById` |
| PATCH | `/customers/me/bookings/:id/reschedule` | `rescheduleBookingById` |
| POST | `/customers/me/bookings/:id/cancel` | `cancelBookingById` |
| POST | `/customers/me/bookings/:id/review` | `submitBookingReview` |
| GET | `/customers/me/bookings/:id/invoice` | PDF invoice |
| GET | `/bookings/:id/location` | `getPartnerLiveLocation` |
| POST | `/customers/me/bookings/:id/dispute` | `createBookingDispute` |

**POST `/customers/me/bookings` body (summary):**

```json
{
  "service_id": "deep-clean-3bhk",
  "address_id": "addr_1",
  "slot": { "date": "2026-06-10", "window": "08:00-11:00" },
  "payment_method": "upi",
  "coupon_code": null,
  "idempotency_key": "uuid"
}
```

Triggers server dispatch → partner job offer (replaces `booking-bridge`).

### 3.4 Catalogue

| Method | Path |
|--------|------|
| GET | `/catalogue/services` |
| GET | `/catalogue/services/:id` |
| GET | `/catalogue/featured` |
| GET | `/catalogue/slots` |
| GET | `/catalogue/pros` |
| GET | `/catalogue/pros/:id` |

### 3.5 Payments & wallet

| Method | Path |
|--------|------|
| GET | `/payments/:id` |
| POST | `/payments/orders` |
| POST | `/payments/verify` |
| GET | `/wallet/transactions` |
| POST | `/wallet/topup` |

### 3.6 Membership (Plus)

| Method | Path |
|--------|------|
| GET | `/customers/me/membership` |
| POST | `/membership/subscribe` |
| POST | `/membership/pause` |
| POST | `/membership/resume` |
| POST | `/membership/cancel` |
| GET | `/membership/invoices` |

### 3.7 Notifications

| Method | Path |
|--------|------|
| GET | `/customers/me/notifications` |
| POST | `/notifications/:id/read` |
| POST | `/notifications/read-all` |
| POST | `/customers/me/push-token` |

### 3.8 Support

| Method | Path |
|--------|------|
| GET | `/support/tickets` |
| POST | `/support/tickets` |
| POST | `/support/tickets/:id/messages` |

### 3.9 Referrals & coupons

| Method | Path |
|--------|------|
| GET | `/referrals` |
| GET | `/coupons` |
| POST | `/customers/me/coupons/validate` |

### 3.10 Saved services & preferences

| Method | Path |
|--------|------|
| GET/POST/DELETE | `/customers/me/saved-services` |
| PATCH | `/customers/me/preferences` |

### 3.11 Content

| Method | Path |
|--------|------|
| GET | `/content/legal/:slug` |
| GET | `/content/help-faq` |

---

## 4. Partner (maid) endpoints

### 4.1 Profile & registration

| Method | Path | Replaces |
|--------|------|----------|
| GET | `/maids/me` | `getPartnerProfile` + state |
| PATCH | `/maids/me` | `updateProfile` |
| POST | `/maids/register` | `completePartnerRegistration` |
| PATCH | `/maids/me/online` | Online toggle |
| POST | `/maids/me/photo` | Profile photo upload |
| POST | `/maids/me/delete-request` | `deletePartnerAccount` |

### 4.2 Jobs

| Method | Path | Replaces |
|--------|------|----------|
| GET | `/maids/me/jobs` | `getPartnerJobs` |
| GET | `/jobs/:id` | `getPartnerJobById` |
| POST | `/jobs/:id/accept` | `acceptJob` |
| POST | `/jobs/:id/decline` | `declineJob` |
| POST | `/jobs/:id/start` | `startVisit` |
| POST | `/jobs/:id/complete` | `completePartnerVisitWithOtp` |
| POST | `/jobs/:id/location` | `visit-location.storage` |

Query examples: `?status=pending`, `?status=accepted,in_progress`

### 4.3 Dispatch

| Method | Path |
|--------|------|
| PATCH | `/maids/me/dispatch/mode` |
| GET | `/maids/me/dispatch/settings` |

Server-side auto-assign replaces `useAutoAssignDispatch` demo runner.

### 4.4 KYC

| Method | Path |
|--------|------|
| GET/PATCH | `/maids/me/kyc/draft` |
| POST | `/maids/me/kyc/aadhaar/verify` |
| POST | `/maids/me/kyc/pan/verify` |
| POST | `/maids/me/kyc/bank/verify` |
| POST | `/maids/me/kyc/upi/verify` |
| POST | `/maids/me/kyc/selfie` |
| POST | `/maids/me/kyc/submit` |

### 4.5 Earnings & payouts

| Method | Path |
|--------|------|
| GET | `/maids/me/earnings` |
| GET | `/maids/me/earnings/by-job/:id` |
| GET | `/maids/me/payouts` |
| GET | `/maids/me/payouts/:id` |

### 4.6 Slots & addresses

| Method | Path |
|--------|------|
| PATCH | `/maids/me/slots` |
| GET/POST/PATCH | `/maids/me/addresses` |

### 4.7 Notifications & support

| Method | Path |
|--------|------|
| GET | `/maids/me/notifications` |
| PATCH | `/notifications/:id/read` |
| GET/POST | `/maids/me/tickets` |
| POST | `/maids/me/tickets/:id/messages` |

### 4.8 Referrals & ratings

| Method | Path |
|--------|------|
| GET | `/maids/me/referrals` |
| GET | `/maids/me/ratings` |

---

## 5. Webhooks (server → mobile via push/poll)

Mobile does not receive webhooks directly. Server sends FCM / client polls.

| Event | Customer action | Partner action |
|-------|-----------------|----------------|
| `job.offered` | — | Refresh jobs list |
| `job.accepted` | Refresh booking detail | — |
| `visit.started` | Open track notification | — |
| `visit.completed` | Show rate modal | — |
| `job.declined` | Reassignment notice | — |
| `booking.cancelled` | — | Remove / decline job |
| `booking.rescheduled` | — | Patch job schedule |
| `payment.confirmed` | Update booking paid state | — |
| `kyc.approved` | — | Unlock job accept |

Replaces `booking-status-bridge` events — see [CROSS-APP-BRIDGE](./FSD/CROSS-APP-BRIDGE.md).

---

## 6. Bridge → API mapping

| Bridge event / key | API equivalent |
|--------------------|----------------|
| `booking_partner_bridge` push | `POST /customers/me/bookings` → dispatch |
| `partner_accepted` | `POST /jobs/:id/accept` + webhook |
| `partner_in_progress` | `POST /jobs/:id/start` |
| `partner_completed` | `POST /jobs/:id/complete` |
| `partner_declined` | `POST /jobs/:id/decline` |
| `customer_cancelled` | `POST /bookings/:id/cancel` |
| `customer_rescheduled` | `PATCH /bookings/:id/reschedule` |
| `customer_rated` | `POST /bookings/:id/review` |
| `visit_location_bridge` | `POST/GET .../location` |
| `pending_visit_complete` | `visit.completed` webhook payload |

---

## 7. Data shapes

Authoritative field lists:

- Customer: [CUSTOMER_DATA.md](../apps/customer/docs/CUSTOMER_DATA.md)
- Partner: [PARTNER_DATA.md](../apps/partner/docs/PARTNER_DATA.md)

JSON property naming: **snake_case** on API; mobile TypeScript uses **camelCase** with mapping layer in `*.api.ts`.

---

## 8. Mobile implementation checklist

1. [ ] Add `src/lib/api/{customer,partner}Client.ts`
2. [ ] Implement auth token refresh interceptor
3. [ ] Add `*.api.ts` per feature domain
4. [ ] Gate hooks with `EXPO_PUBLIC_USE_API`
5. [ ] Map API DTOs ↔ existing TypeScript types
6. [ ] Remove bridge calls from checkout when flag on
7. [ ] Register push token after login
8. [ ] Contract tests vs OpenAPI (when published from QuickMaid-API)

---

## 9. Call site matrices

Every UI trigger mapped to endpoint:

| App | Matrix |
|-----|--------|
| Customer | [API_CALL_SITES.md](../apps/customer/docs/FSD/API_CALL_SITES.md) (~110 rows) |
| Partner | [API_CALL_SITES.md](../apps/partner/docs/FSD/API_CALL_SITES.md) (~83 rows) |

Per-feature request/response JSON: individual FSD docs `01`–`18`.

---

## 10. Versioning

- URL prefix `/api/v1` — breaking changes increment v2
- Mobile sends `X-App-Version: 1.0.0` (planned) for compatibility checks

---

*When QuickMaid-API publishes OpenAPI, link it here and generate types into `packages/shared`.*
