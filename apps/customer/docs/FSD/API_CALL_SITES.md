# Master API Call Site Matrix (Phase 4)

Single reference: **UI component → function/hook today → REST endpoint**. Detail per feature in `01`–`16` FSDs.

| # | Component / screen | Trigger | Demo (today) | Phase 4 endpoint |
|---|-------------------|---------|--------------|------------------|
| **Auth** |
| 1 | `login.tsx` | Continue | `setPhone()` | `POST /auth/otp/send` |
| 2 | `otp.tsx` | Verify (returning) | `signInExistingUser` | `POST /auth/otp/verify` |
| 3 | `otp.tsx` | Verify (new) | Route signup | `POST /auth/otp/verify` |
| 4 | `otp.tsx` | Resend | Timer only | `POST /auth/otp/send` |
| 5 | `permissions.tsx` | Allow / Skip | `completeRegistration` | `POST /customers/register` |
| 6 | `app/index.tsx` | Splash | `getInitialRoute` | `GET /customers/me` (if token) |
| 7 | `onboarding.tsx` | Done | `setOnboardingDone` | — (local) |
| **Home & catalogue** |
| 8 | `HomeScreen` | Mount / refresh | `useHomeProfile`, `useHomeDeliveryAddress` | `GET /customers/me` |
| 9 | `HomeHeader` | Notifications | `useNotifications` | `GET /customers/me/notifications` |
| 10 | `HomeDeliverToSheet` | Select address | `saveProfileAccount` | `PATCH /customers/me/addresses/:id` |
| 11 | `CatalogueScreen` | Search / filter | `filterAndSortServices` local | `GET /catalogue/services` |
| 12 | `HomeFeaturedRail` | Render | `FEATURED_SERVICES` constant | `GET /catalogue/featured` |
| **Service** |
| 13 | `ServiceDetailScreen` | Mount | `getServiceById` local | `GET /catalogue/services/:id` |
| 14 | `ServiceDetailScreen` | Save heart | `useSavedServices.toggle` | `POST /customers/me/saved-services` |
| 15 | `ServiceDetailScreen` | Book now | `useStartBooking.bookService` | → checkout `POST /bookings` |
| **Checkout** |
| 16 | `CheckoutLayout` | Mount | `refreshAccount` | `GET /customers/me` |
| 17 | `CheckoutCartScreen` | Coupon | `updateDraft` | `POST /customers/me/coupons/validate` |
| 18 | `CheckoutScheduleScreen` | Pick slot | `updateDraft` | `GET /catalogue/slots` |
| 19 | `CheckoutPaymentScreen` | Pay | `processPaymentAndPlaceOrder` | `POST /customers/me/bookings` |
| 20 | `CheckoutContext` | After order | `pushBookingToPartnerBridge` | Server job dispatch |
| 21 | `CheckoutContext` | After order | `addStoredBooking` | Response from #19 |
| **Bookings** |
| 22 | `BookingsScreen` | Focus | `useUserBookings.refresh` | `GET /customers/me/bookings` |
| 23 | `BookingDetailScreen` | Mount | `getBookingById` | `GET /customers/me/bookings/:id` |
| 24 | `BookingLiveLocationCard` | Poll 8s | `getPartnerLiveLocation` | `GET /bookings/:id/location` |
| 25 | `BookingTrackScreen` | Mount | Simulated tracking | `GET /bookings/:id/location` |
| 26 | `BookingRescheduleScreen` | Confirm | `rescheduleBookingById` | `PATCH /bookings/:id/reschedule` |
| 27 | `BookingCancelScreen` | Confirm | `cancelBookingById` | `POST /bookings/:id/cancel` |
| 28 | `BookingRateScreen` | Submit | `submitBookingReview` | `POST /bookings/:id/review` |
| 29 | `BookingDocumentScreen` | PDF | `downloadBookingDocumentPdf` | `GET /bookings/:id/invoice` |
| 30 | `useRebookBooking` | Rebook | `startCheckout` | `POST /customers/me/bookings` |
| **Plus** |
| 31 | `PlusScreen` | Mount | `getProfileAccount` | `GET /customers/me/membership` |
| 32 | `PlusSubscribePaymentScreen` | Pay | `subscribeToPlus` | `POST /membership/subscribe` |
| 33 | `PlusManageScreen` | Pause | `pausePlusMembership` | `POST /membership/pause` |
| 34 | `PlusManageScreen` | Resume | `resumePlusMembership` | `POST /membership/resume` |
| 35 | `PlusManageScreen` | Cancel | `cancelPlusMembership` | `POST /membership/cancel` |
| 36 | `PlusBillingHistoryScreen` | Mount | `plus.billing` demo | `GET /membership/invoices` |
| **Profile** |
| 37 | `ProfileScreen` | Mount | `useProfileAccount.refresh` | `GET /customers/me` |
| 38 | `ProfileEditProfileModal` | Save | `updateProfile` | `PATCH /customers/me` |
| 39 | `ProfileWalletTopUpModal` | Top up | `topUpWallet` | `POST /wallet/topup` |
| 40 | `ProfilePreferencesSection` | Toggle | `setNotificationPrefs` | `PATCH /preferences` |
| 41 | `ProfileScreen` | Log out | `clearSession` | `POST /auth/logout` |
| **Account** |
| 42 | `AddressMapPickerScreen` | Confirm | `upsertAddress` | `POST/PATCH /addresses` |
| 43 | `WalletTransactionsScreen` | Mount | `getWalletTransactions` | `GET /wallet/transactions` |
| 44 | `CouponWalletScreen` | Mount | `listCouponWallet` | `GET /coupons` |
| 45 | `SavedServicesScreen` | Toggle | `toggleSavedServiceIds` | `POST/DELETE /saved-services` |
| 46 | `DeleteAccountScreen` | Confirm | `deleteUserAccount` | `DELETE /customers/me` |
| **Notifications** |
| 47 | `NotificationsScreen` | Mount | `getNotifications` | `GET /notifications` |
| 48 | `NotificationCard` | Tap | `markNotificationRead` | `POST /notifications/:id/read` |
| 49 | `NotificationsScreen` | Mark all | `markAllNotificationsRead` | `POST /notifications/read-all` |
| **Support** |
| 50 | `SupportChatScreen` | Send | `appendChatMessage` | `POST /support/tickets/:id/messages` |
| 51 | `SupportTicketsScreen` | Mount | `listSupportTickets` | `GET /support/tickets` |
| 52 | `BookingDisputeScreen` | Submit | `createBookingDispute` | `POST /bookings/:id/dispute` |
| **Help** |
| 53 | `HelpBody` | Open chat | `useOpenSupportChat` | `POST /support/tickets` |
| **Payment** |
| 54 | `PaymentTransactionDetailScreen` | Mount | `getPaymentById` | `GET /payments/:id` |
| 55 | `RazorpayGatewayModal` | Pay | `chargeRazorpayGateway` | `POST /payments/orders` + verify |
| **Pro** |
| 56 | `ProsDirectoryScreen` | Mount | `listMaidProfiles` | `GET /catalogue/pros` |
| 57 | `ProProfileScreen` | Mount | `getMaidProfileById` | `GET /catalogue/pros/:id` |
| **Referral** |
| 58 | `ReferralRewardsScreen` | Mount | `getReferralEvents` | `GET /referrals` |
| 59 | `CheckoutCartScreen` | Apply code | Local validate | `POST /coupons/validate` |
| **Security** |
| 60 | `AppLockSettingsScreen` | Enable PIN | `saveAppLockSettings` | — (local) |
| **Legal** |
| 61 | `LegalDocumentScreen` | Mount | `LEGAL_DOCUMENTS` local | `GET /content/legal/:id` |

## Service module mapping (planned)

| Future file | Endpoints owned |
|-------------|-----------------|
| `src/lib/api/auth.api.ts` | #1–6, logout |
| `src/lib/api/customer.api.ts` | #8, #10, profile PATCH |
| `src/features/home/lib/catalogue.api.ts` | #11–12 |
| `src/features/service/lib/service.api.ts` | #13–14 |
| `src/features/checkout/lib/checkout.api.ts` | #16–21 |
| `src/features/bookings/lib/bookings.api.ts` | #22–30 |
| `src/features/plus/lib/plus.api.ts` | #31–36 |
| `src/features/profile/lib/profile.api.ts` | #37–41, #42 |
| `src/features/wallet/lib/wallet.api.ts` | #43 |
| `src/features/coupons/lib/coupon.api.ts` | #44, #59 |
| `src/features/saved-services/lib/saved.api.ts` | #45 |
| `src/features/notifications/lib/notifications.api.ts` | #9, #47–49 |
| `src/features/support/lib/support.api.ts` | #50–53 |
| `src/features/payment/lib/payment.api.ts` | #54–55 |
| `src/features/pro/lib/pro.api.ts` | #56–57 |
| `src/features/referral/lib/referral.api.ts` | #58 |
| `src/features/legal/lib/legal.api.ts` | #61 |

## Prefix convention

All paths above are relative to `/api/v1`. Authenticated routes require `Authorization: Bearer <token>` and `X-App-Client: customer`.
