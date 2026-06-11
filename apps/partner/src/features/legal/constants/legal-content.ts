export type LegalSlug = 'privacy' | 'partner-terms' | 'referral-policy';

export const LEGAL_DOCUMENTS: Record<
  LegalSlug,
  { title: string; eyebrow: string; updated: string; sections: { heading: string; body: string }[] }
> = {
  privacy: {
    title: 'Privacy Policy',
    eyebrow: 'PARTNER APP',
    updated: 'June 2026',
    sections: [
      {
        heading: 'What we collect',
        body:
          'Profile details (name, phone, work zone), KYC verification status, job history, earnings, and support messages. Aadhaar is verified via DigiLocker OTP — we do not store Aadhaar images in the partner app demo.',
      },
      {
        heading: 'How we use it',
        body:
          'To match you with jobs, process weekly UPI payouts after KYC approval, send job alerts, and comply with platform safety requirements.',
      },
      {
        heading: 'Sharing',
        body:
          'Customers see your first name, rating, and estimated arrival — not your full address or personal phone. Full details are shared only for assigned visits.',
      },
      {
        heading: 'Your controls',
        body:
          'You can edit profile details, request account deletion, and contact support for data questions. Production builds will include a full data export option.',
      },
    ],
  },
  'partner-terms': {
    title: 'Partner Terms',
    eyebrow: 'SERVICE AGREEMENT',
    updated: 'June 2026',
    sections: [
      {
        heading: 'Independent partner',
        body:
          'You provide cleaning services as an independent partner. QuickMaid facilitates bookings and payouts but is not your employer.',
      },
      {
        heading: 'Payouts',
        body:
          'Weekly UPI payouts run every Monday after KYC verification. Amounts reflect completed visits minus platform fees shown in earnings.',
      },
      {
        heading: 'Conduct',
        body:
          'Be on time, treat customers respectfully, complete visits with OTP confirmation, and keep your KYC and bank details accurate.',
      },
      {
        heading: 'Account suspension',
        body:
          'Repeated no-shows, safety complaints, or fraudulent KYC may lead to temporary or permanent removal from the platform.',
      },
    ],
  },
  'referral-policy': {
    title: 'Referral Policy',
    eyebrow: 'PARTNER REFERR PROGRAM',
    updated: 'June 2026',
    sections: [
      {
        heading: 'Program overview',
        body:
          'QuickMaid Partner Refer Program existing verified partners ko nayi maids invite karne ka reward deta hai. Referrer ko ₹500 milta hai jab referred partner apni pehli eligible visit successfully complete kare. Nayi partner ko valid code use par ₹200 welcome bonus milta hai (pehli completed job ke baad).',
      },
      {
        heading: 'Eligible referrer',
        body:
          'Referrer QuickMaid verified partner hona chahiye (KYC approved, active account). Self-referral, duplicate accounts, ya same device par multiple signups allowed nahi. Referral code format: QM-{maid_id} (e.g. QM-903210).',
      },
      {
        heading: 'Eligible referred partner',
        body:
          'Naya phone number jo pehle partner network mein registered na ho. Apply form ya refer-welcome screen par valid code enter karna optional hai lekin bonus ke liye zaroori. Code apply submit se pehle enter hona chahiye — baad mein add nahi hota (support exception cases).',
      },
      {
        heading: 'Reward conditions',
        body:
          'Dono bonuses tabhi credit honge jab: (1) referred partner KYC verified ho, (2) pehli booking assigned visit OTP se complete ho, (3) koi chargeback/fraud flag na ho. Bonus earnings ledger mein "Referral bonus" ke roop mein dikhega.',
      },
      {
        heading: 'Payout timeline',
        body:
          'Referrer ₹500: referred partner ki pehli completed job ke baad agle Monday UPI batch mein (verified UPI on file). New partner ₹200: apni pehli completed job ke baad same weekly cycle. Public holidays par 1–2 din delay ho sakta hai.',
      },
      {
        heading: 'Code validity & limits',
        body:
          'Har referral code unlimited invites ke liye open hai jab tak fraud rules trigger na hon. Ek referred phone par sirf ek code apply hota hai. Code 7 din tak apply form par valid rehta hai registration start ke baad (demo: session-based).',
      },
      {
        heading: 'Fraud & misuse',
        body:
          'Fake numbers, scripted registrations, collusion, ya KYC mismatch par bonus withhold ya account suspend ho sakta hai. QuickMaid final decision leta hai. Suspected abuse par support investigation — bonus reversal possible.',
      },
      {
        heading: 'Changes & disputes',
        body:
          'QuickMaid program terms update kar sakta hai — app mein updated date dikhegi. Disputes: Help → Support chat, topic "Referral", 7 din ke andar raise karein. Resolved cases par manual credit possible.',
      },
      {
        heading: 'Contact',
        body:
          'Questions: in-app Help centre ya partner support chat. Policy version June 2026 — production API par referral status real-time sync hoga.',
      },
    ],
  },
};

export function isLegalSlug(value: string): value is LegalSlug {
  return value === 'privacy' || value === 'partner-terms' || value === 'referral-policy';
}
