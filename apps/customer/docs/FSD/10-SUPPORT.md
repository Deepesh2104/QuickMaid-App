# FSD 10 — Support Chat, Tickets & Disputes

**Status:** `UI-DEMO`  
**Domain:** `src/features/support/`  
**Routes:** `app/support/*`, `app/booking/dispute/[id]`

## Overview

Customer support: live-style chat with seeded agent replies, ticket list, and booking dispute flow with reason picker and success confirmation. Entry from Help tab, profile support section, and booking detail.

### User stories

| ID | Story |
|----|-------|
| SUP-1 | Customer starts chat from Help topic |
| SUP-2 | Customer sends messages and sees agent reply (demo) |
| SUP-3 | Customer views open/resolved tickets |
| SUP-4 | Customer files dispute on completed booking |
| SUP-5 | Profile shows open ticket count |

## Route & component map

| Route | File | Screen |
|-------|------|--------|
| `/support/chat` | `support/chat.tsx` | `SupportChatScreen` |
| `/support/tickets` | `support/tickets.tsx` | `SupportTicketsScreen` |
| `/booking/dispute/[id]` | `booking/dispute/[id].tsx` | `BookingDisputeScreen` |

Layout: `app/support/_layout.tsx`.

### Key modules

| Module | File |
|--------|------|
| `SupportChatScreen` | `components/SupportChatScreen.tsx` |
| `SupportTicketsScreen` | `components/SupportTicketsScreen.tsx` |
| `BookingDisputeScreen` | `components/BookingDisputeScreen.tsx` |
| `BookingDisputeSuccessModal` | `components/BookingDisputeSuccessModal.tsx` |
| `useOpenSupportChat` | `hooks/useOpenSupportChat.ts` |
| `useOpenBookingDispute` | `hooks/useOpenBookingDispute.ts` |
| `support.storage` | `lib/support.storage.ts` |
| `support.utils` | `lib/support.utils.ts` |

## Data model

| Entity | Storage key | See |
|--------|-------------|-----|
| Tickets | `@qm/support_tickets` | `SupportTicket` + messages |
| Disputes | `@qm/booking_disputes` | Per-booking dispute record |
| Ticket count | `@qm/profile_account.supportTickets` | Denormalized open count |

Types in `support/types/support.types.ts`.

## Current demo behaviour

| Function | File | Behaviour |
|----------|------|-----------|
| `createSupportTicket` | `support.storage.ts` | Seeds welcome agent message |
| `appendChatMessage` | `support.storage.ts` | User msg + delayed auto-reply |
| `listSupportTickets` | `support.storage.ts` | Reads ticket array |
| `createBookingDispute` | `support.storage.ts` | Links booking + reason |
| `bumpProfileTicketCount` | `support.storage.ts` | Updates profile stat |
| `useOpenSupportChat` | hook | `router.push(/support/chat?ticketId=…)` |

Chat simulates agent response after ~1.2s. Dispute creates linked support ticket.

## Phase 4 API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/customers/me/support/tickets` | GET / POST | List / create |
| `/api/v1/customers/me/support/tickets/:id` | GET | Ticket detail |
| `/api/v1/customers/me/support/tickets/:id/messages` | POST | Send message |
| `/api/v1/customers/me/bookings/:id/dispute` | POST | File dispute |
| `/api/v1/customers/me/support/tickets/:id` | PATCH | Resolve / escalate |

## API call site matrix

| Component | User action | Today | Phase 4 |
|-----------|-------------|-------|---------|
| `HelpScreen` | Open chat | `useOpenSupportChat` | `POST /support/tickets` |
| `SupportChatScreen` | Mount | `getTicketById` or create | `GET/POST /tickets` |
| `SupportChatScreen` | Send | `appendChatMessage` | `POST /messages` |
| `SupportTicketsScreen` | Mount | `listSupportTickets` | `GET /tickets` |
| `BookingDisputeScreen` | Submit | `createBookingDispute` | `POST /bookings/:id/dispute` |
| `ProfileSupportSection` | Tickets link | Navigate | `GET /tickets` |
| `BookingDetailScreen` | Dispute CTA | `useOpenBookingDispute` | Eligibility check API |

## Errors & edge cases

| Case | Demo | API |
|------|------|-----|
| Duplicate dispute | Blocks second submit | 409 |
| Booking not eligible | Hidden CTA | 403 |
| Empty chat ticket | Creates on first message | 201 |
| Agent offline | Demo auto-reply | WebSocket / polling |
| Attachment too large | — | 413 |

## Migration checklist

- [ ] WebSocket or SSE for chat messages  
- [ ] Remove `welcomeMessage` local seed; server sends first message  
- [ ] Dispute reasons enum from API metadata  
- [ ] Sync `supportTickets` count from `GET /tickets?status=open`  
- [ ] Push notification when agent replies  
