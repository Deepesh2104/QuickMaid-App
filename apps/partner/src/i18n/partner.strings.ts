import type { PartnerAppLanguage } from '@/features/settings/types/settings.types';

export const PARTNER_STRINGS = {
  en: {
    scheduled: 'Scheduled',
    requests: 'Requests',
    liveForOffers: 'Live for job offers',
    goOnlineDispatch: 'Go online for Urban-style dispatch',
    autoAssignOn: 'Auto-accept ON — jobs go straight to Schedule',
    manualOffers: 'Offers match your slots — accept within 3 min (demo)',
    goOffline: 'Turn on availability to receive offers',
    scheduleConfirmed: 'SCHEDULE CONFIRMED',
    autoAssignHint:
      'Not in Requests — confirmed on Schedule. Tap Start visit when you arrive.',
    manualRequestsStrip: 'Manual mode — open Requests tab',
    manualOffersCount: 'job offers on Requests tab',
    acceptDeclineThere: 'Accept / Decline there — no offer cards on Jobs',
    kycBlockTitle: 'KYC required',
    offerExpired: 'Offer expired',
    pingsSaved: 'pings saved (demo)',
    earningsTitle: 'Earnings',
    scheduleTitle: 'Schedule',
    startVisit: 'Start visit',
    notificationsTitle: 'Notifications',
    helpTitle: 'Help centre',
    payoutMonday: 'Monday UPI batch (demo)',
    referralTitle: 'Refer & earn',
    liveLocationShare: 'Live location share',
    dispatchPulse: 'New offer pulse',
    offerPassedNext: 'Passed to next partner in zone',
    autoAssignKycBlock: 'KYC pending — auto-assign paused',
    autoAssignKycSub: 'Verify KYC to auto-confirm matched visits',
    offerWindowClosed: 'Offer window closed — passed to next partner',
  },
  hi: {
    scheduled: 'शेड्यूल',
    requests: 'रिक्वेस्ट',
    liveForOffers: 'जॉब ऑफर के लिए लाइव',
    goOnlineDispatch: 'ऑनलाइन जाओ — ऑफर मिलेंगे',
    autoAssignOn: 'ऑटो-एक्सेप्ट ON — जॉब सीधे शेड्यूल पर',
    manualOffers: 'स्लॉट मैच — 3 मिनट में एक्सेप्ट (डेमो)',
    goOffline: 'ऑफर के लिए ऑनलाइन रहें',
    scheduleConfirmed: 'शेड्यूल कन्फर्म',
    autoAssignHint:
      'रिक्वेस्ट में नहीं — शेड्यूल पर कन्फर्म। पहुँचकर Start visit दबाएँ।',
    manualRequestsStrip: 'मैनुअल मोड — Requests टैब खोलें',
    manualOffersCount: 'जॉब ऑफर Requests टैब पर',
    acceptDeclineThere: 'Accept / Decline वहीं — Jobs पर कार्ड नहीं',
    kycBlockTitle: 'KYC ज़रूरी',
    offerExpired: 'ऑफर खत्म',
    pingsSaved: 'पिंग सेव (डेमो)',
    earningsTitle: 'कमाई',
    scheduleTitle: 'शेड्यूल',
    startVisit: 'विज़िट शुरू',
    notificationsTitle: 'सूचनाएँ',
    helpTitle: 'सहायता',
    payoutMonday: 'सोमवार UPI बैच (डेमो)',
    referralTitle: 'रेफर करें',
    liveLocationShare: 'लाइव लोकेशन',
    dispatchPulse: 'नया ऑफर पल्स',
    offerPassedNext: 'ज़ोन में अगले पार्टनर को भेजी',
    autoAssignKycBlock: 'KYC पेंडिंग — ऑटो-असाइन रुका',
    autoAssignKycSub: 'मैच होने पर ऑटो-कन्फर्म के लिए KYC पूरा करें',
    offerWindowClosed: 'ऑफर खत्म — अगले पार्टनर को',
  },
} as const;

export type PartnerStringKey = keyof (typeof PARTNER_STRINGS)['en'];

export function translatePartner(
  language: PartnerAppLanguage,
  key: PartnerStringKey,
): string {
  return PARTNER_STRINGS[language][key] ?? PARTNER_STRINGS.en[key];
}
