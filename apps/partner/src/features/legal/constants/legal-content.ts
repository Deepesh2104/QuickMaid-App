export type LegalSlug = 'privacy' | 'partner-terms';

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
};

export function isLegalSlug(value: string): value is LegalSlug {
  return value === 'privacy' || value === 'partner-terms';
}
