# Demo E2E Checklist (Same Device)

**Credentials:** phone `9876543210` · OTP `123456` · visit OTP `123456`

Run **Customer** (port 8081) and **Partner** (port 8082) on the **same simulator/device** so AsyncStorage bridge keys are shared.

## Pre-flight

- [ ] Customer: `npx expo start` in `apps/customer`
- [ ] Partner: `npm start` in `apps/partner`
- [ ] Both apps logged in with demo phone
- [ ] Partner KYC approved (or use demo tools to approve)

## 14-step happy path

| # | Actor | Action | Expected |
|---|-------|--------|----------|
| 1 | Customer | Home → pick service → checkout | Order placed, payment simulated |
| 2 | Partner | Open Jobs / refresh | New pending offer appears |
| 3 | Partner | Accept job | Customer booking shows pro name |
| 4 | Customer | Bookings tab | Partner sync banner / notification |
| 5 | Partner | Start visit | Customer gets "visit started" alert |
| 6 | Customer | Upcoming card → track | Live location bridge updates |
| 7 | Partner | Complete visit OTP `123456` | Customer visit-complete modal |
| 8 | Customer | Dismiss modal → rate 5★ + comment | Review saved locally |
| 9 | Partner | Profile → Partner rating | New review at top, score updated |
| 10 | Partner | Notifications | "Naya customer review" entry |
| 11 | Customer | Cancel an upcoming booking | Partner job declined + notification |
| 12 | Customer | Reschedule upcoming slot | Partner job date/slot patched |
| 13 | Partner | Decline a pending offer | Customer sees reassignment state |
| 14 | Customer | Deep link `quickmaid-partner://booking?ref=…` | Partner ingests handoff order |

## Bridge keys to verify (optional)

In React Native debugger / AsyncStorage inspector:

- `@qm/booking_partner_bridge_v1` — new orders
- `@qm/booking_status_bridge_v1` — includes `customer_rated` after step 8
- `@qmp/partner_customer_reviews_v1` — partner review list after step 9

## Known demo limits

- **Two physical phones** do not share AsyncStorage; only deep-link order handoff works cross-device until Phase 4 API.
- Push notifications are UI-only on customer; partner push removed by product decision.
- Payments, KYC verify, chat, and dispatch TTL are simulated locally.

## After editing `shared/`

```bash
cd apps/customer && npm run sync:shared
```
