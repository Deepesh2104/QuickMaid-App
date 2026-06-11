# FSD 12 — Payment Detail & Razorpay Demo

**Status:** `UI-DEMO` / `MOCK-API`  
**Domain:** `src/features/payment/`  
**Routes:** `app/payments/[id]`, shared gateway modals from checkout/plus

## Overview

Payment transaction receipt screen and reusable Razorpay-style gateway UI (UPI apps, cards, net banking, EMI). Demo `chargeRazorpayGateway` simulates success/failure; records land in `@qm/payment_history`.

### User stories

| ID | Story |
|----|-------|
| PAY-1 | Customer views payment receipt from profile history |
| PAY-2 | Customer pays via UPI app picker at checkout |
| PAY-3 | Customer enters card CVV in gateway modal |
| PAY-4 | Customer sees failure message and retries |
| PAY-5 | Plus subscribe uses same gateway stack |

## Route & component map

| Route | File | Screen |
|-------|------|--------|
| `/payments/[id]` | `payments/[id].tsx` | `PaymentTransactionDetailScreen` |

Layout: `app/payments/_layout.tsx`.

### Key components (also used in checkout/plus)

| Component | File |
|-----------|------|
| `PaymentTransactionDetailScreen` | `payment/components/PaymentTransactionDetailScreen.tsx` |
| `RazorpayGatewayModal` | `RazorpayGatewayModal.tsx` |
| `RazorpayNetBankingEmiModal` | `RazorpayNetBankingEmiModal.tsx` |
| `InstalledUpiAppsPicker` | `InstalledUpiAppsPicker.tsx` |
| `PaymentFailedModal` | `PaymentFailedModal.tsx` |
| `PaymentOffersStrip` | `PaymentOffersStrip.tsx` |
| `ProfilePaymentHistorySection` | `profile/components/ProfilePaymentHistorySection.tsx` |

### Lib

| Module | File | Role |
|--------|------|------|
| `payment.storage` | `lib/payment.storage.ts` | `@qm/payment_history` |
| `razorpay.gateway` | `lib/razorpay.gateway.ts` | `createGatewayOrder`, `chargeRazorpayGateway` |
| `gateway` constants | `constants/gateway.ts` | `PAYMENT_GATEWAY` id, currency |
| `useInstalledUpiApps` | `hooks/useInstalledUpiApps.ts` | Native UPI intent apps |

## Data model

| Entity | Storage key | See |
|--------|-------------|-----|
| Payment records | `@qm/payment_history` | `PaymentRecord` type |
| Wallet balance | `@qm/profile_account` | Updated on wallet pay |

See [`CUSTOMER_DATA.md`](../CUSTOMER_DATA.md) § Payments.

## Current demo behaviour

| Function | File | Behaviour |
|----------|------|-----------|
| `getPaymentById` | `payment.storage.ts` | Match `id`, `paymentId`, or `orderId` |
| `addPaymentRecord` | `payment.storage.ts` | Prepend, cap 50 rows |
| `createGatewayOrder` | `razorpay.gateway.ts` | Local `order_*` id, paise amount |
| `chargeRazorpayGateway` | `razorpay.gateway.ts` | 900ms delay; validates CVV/bank |
| `completePayment` | checkout/plus | Calls gateway + `addPaymentRecord` |

`PaymentTransactionDetailScreen` shows status, method, booking ref, and share receipt (demo).

## Phase 4 API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/customers/me/payments` | GET | History list |
| `/api/v1/customers/me/payments/:id` | GET | Receipt detail |
| `/api/v1/payments/orders` | POST | Create Razorpay order |
| `/api/v1/payments/verify` | POST | Signature verify after SDK |
| `/api/v1/payments/:id/refund` | POST | Refund (support) |

## API call site matrix

| Component | User action | Today | Phase 4 |
|-----------|-------------|-------|---------|
| `ProfilePaymentHistorySection` | Tap row | `router.push(/payments/:id)` | `GET /payments` |
| `PaymentTransactionDetailScreen` | Mount | `getPaymentById` | `GET /payments/:id` |
| `CheckoutPaymentScreen` | Pay | `chargeRazorpayGateway` | `POST /orders` + SDK |
| `PlusSubscribePaymentScreen` | Pay | `subscribeToPlus` → gateway | Same |
| `RazorpayGatewayModal` | Confirm | `chargeRazorpayGateway` | Razorpay Checkout |
| `ProfileWalletTopUpModal` | Top up | Gateway + wallet credit | `POST /wallet/topup` |
| `InstalledUpiAppsPicker` | Pick app | UPI intent (demo label) | Razorpay UPI collect |

## Errors & edge cases

| Case | Demo | API |
|------|------|-----|
| Missing CVV | Inline gateway error | SDK validation |
| Payment not found | Empty state | 404 |
| Gateway timeout | Failed modal | Retry + `payment_failed` webhook |
| Partial wallet + card | `computeOrderSummary` | Server split |
| Duplicate verify | — | Idempotent 200 |

## Migration checklist

- [ ] Replace `chargeRazorpayGateway` with Razorpay React Native / WebView SDK  
- [ ] Server creates order; client never signs amounts  
- [ ] `POST /payments/verify` before booking confirm  
- [ ] Receipt PDF from `GET /payments/:id/invoice`  
- [ ] Keep modals; swap only `razorpay.gateway.ts` internals  
