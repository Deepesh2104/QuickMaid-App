# Master API Call Site Matrix (Phase 4)

Single reference: **UI component → function/hook today → REST endpoint**. Detail per feature in `01`–`17` FSDs.

| # | Component / screen | Trigger | Demo (today) | Phase 4 endpoint |
|---|-------------------|---------|--------------|------------------|
| **Auth** |
| 1 | `login.tsx` | Continue | `setPhone()` | `POST /auth/otp/send` |
| 2 | `otp.tsx` | Verify | `signInExistingPartner` / route apply | `POST /auth/otp/verify` |
| 3 | `otp.tsx` | Resend | Timer only | `POST /auth/otp/send` |
| 4 | `apply.tsx` | Submit | `completePartnerRegistration` | `POST /maids/register` |
| 5 | `app/index.tsx` | Splash | `getInitialRoute` | `GET /maids/me` (if token) |
| 6 | `PartnerOnboardingScreen` | Done | `setOnboardingDone` | — (local) |
| **Home & context** |
| 7 | `PartnerHomeHeader` | Online toggle | `PartnerContext.setOnline` | `PATCH /maids/me/online` |
| 8 | `PartnerContext` | refresh | `getPartnerProfile` + `getPartnerState` | `GET /maids/me` |
| 9 | `PartnerHomeScreen` | Focus | `usePartnerJobs.refresh` | `GET /maids/me/jobs` |
| 10 | `PartnerHomeScreen` | Focus | `useNotifications.refresh` | `GET /maids/me/notifications` |
| **Jobs** |
| 11 | `PartnerRequestsScreen` | Focus | `usePartnerJobs.refresh` | `GET /maids/me/jobs` |
| 12 | `PartnerRequestsScreen` | Accept | `acceptJob` | `POST /jobs/:id/accept` |
| 13 | `PartnerJobDeclineModal` | Decline | `declineJob` + reason patch | `POST /jobs/:id/decline` |
| 14 | `JobDetailScreen` | Load | `getPartnerJobById` | `GET /jobs/:id` |
| 15 | `JobDetailScreen` / `PartnerVisitStartModal` | Start | `startVisit` | `POST /jobs/:id/start` |
| 16 | `PartnerVisitCompleteScreen` / `PartnerVisitFinishModal` | Complete | `completePartnerVisitWithOtp` | `POST /jobs/:id/complete` |
| 17 | `PartnerLiveLocationCard` | Interval | UI only | `POST /jobs/:id/location` |
| 18 | `PartnerJobHistoryScreen` | Focus | `usePartnerJobs` filter | `GET /maids/me/jobs?status=completed,declined` |
| **Schedule** |
| 19 | `PartnerScheduleScreen` | Focus | `usePartnerJobs` | `GET /maids/me/jobs?status=accepted,in_progress` |
| **Earnings & payout** |
| 20 | `PartnerEarningsScreen` | Focus | `DEMO_EARNINGS` | `GET /maids/me/earnings` |
| 21 | `PartnerJobEarningFocusCard` | `?jobId=` | `getPartnerJobById` + breakdown | `GET /maids/me/earnings/by-job/:id` |
| 22 | `PartnerPayoutDetailScreen` | Mount | `buildPayoutDetail` | `GET /maids/me/payouts/:id` |
| **KYC** |
| 23 | `PartnerKycAadhaarDigiLocker` | Verify | `verifyAadhaarOtp` | `POST /maids/me/kyc/aadhaar/verify` |
| 24 | `PartnerKycPanDigiLocker` | Verify | `verifyDigiLockerPan` | `POST /maids/me/kyc/pan/verify` |
| 25 | `PartnerKycPayoutVerify` | Bank/UPI | `verifyBankAccountInternal` / `verifyUpiInternal` | `POST /kyc/bank/verify`, `POST /kyc/upi/verify` |
| 26 | `PartnerKycUploadSlot` | Selfie | `saveKycDraft` | `POST /maids/me/kyc/selfie` |
| 27 | `PartnerKycFlowScreen` | Autosave | `saveKycDraft` | `PATCH /maids/me/kyc/draft` |
| 28 | `PartnerKycFlowScreen` | Submit | `submitKycDraft` + `updateProfile` | `POST /maids/me/kyc/submit` |
| **Profile** |
| 29 | `PartnerEditProfileModal` | Save | `updateProfile` | `PATCH /maids/me` |
| 30 | `PartnerProfilePhotoScreen` | Save | `updateProfile({ photoUri })` | `POST /maids/me/photo` |
| 31 | `PartnerWorkAddressSheet` / `PartnerAddressFormModal` | Save | `usePartnerWorkAddress` | `POST/PATCH /maids/me/addresses` |
| 32 | `PartnerRatingScreen` | Mount | Static demo | `GET /maids/me/ratings` |
| 33 | `PartnerProfileSections` | Logout | `clearSession` | `POST /auth/logout` |
| **Slots** |
| 34 | `PartnerSlotsScreen` | Toggle | `updateProfile({ preferredSlotIds })` | `PATCH /maids/me/slots` |
| **Notifications** |
| 35 | `PartnerNotificationsScreen` | Focus | `useNotifications` | `GET /maids/me/notifications` |
| 36 | `PartnerNotificationDetailScreen` | Open | `markNotificationRead` | `PATCH /notifications/:id/read` |
| **Support & help** |
| 37 | `PartnerSupportChatScreen` | Create | `createSupportTicket` | `POST /maids/me/tickets` |
| 38 | `PartnerSupportChatScreen` | Send | `appendTicketMessage` | `POST /maids/me/tickets/:id/messages` |
| 39 | `PartnerHelpScreen` | Mount | Static FAQ | `GET /content/partner-faq` (optional) |
| **Referral** |
| 40 | `PartnerReferralScreen` | Mount | `DEMO_REFERRALS` | `GET /maids/me/referrals` |
| **Legal** |
| 41 | `PartnerLegalScreen` | Mount | `LEGAL_CONTENT[slug]` | `GET /content/legal/:slug` (optional) |
| **Account** |
| 42 | `PartnerDeleteAccountScreen` | Delete | `deletePartnerAccount` (soft) | `POST /maids/me/delete-request` |
| 43 | `otp.tsx` | Returning login | `signInExistingPartner` (auto-restore) | `POST /auth/otp/verify` |

## Service module mapping (planned)

| Future file | Endpoints owned |
|-------------|-----------------|
| `src/lib/api/auth.api.ts` | #1–5, #33, logout |
| `src/lib/api/maid.api.ts` | #7–8, #29–31, #34, #42 |
| `src/features/jobs/lib/jobs.api.ts` | #9–18 |
| `src/features/earnings/lib/earnings.api.ts` | #20–21 |
| `src/features/payout/lib/payout.api.ts` | #22 |
| `src/features/kyc/lib/kyc.api.ts` | #23–28 |
| `src/features/notifications/lib/notifications.api.ts` | #35–36 |
| `src/features/support/lib/support.api.ts` | #37–38 |
