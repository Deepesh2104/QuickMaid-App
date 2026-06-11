export type PartnerAppLanguage = 'en' | 'hi';

export interface PartnerAppPreferences {
  language: PartnerAppLanguage;
  /** Urban-style: best offer → accepted without tap (demo). */
  autoAssignOffers: boolean;
  jobAlerts: boolean;
  payoutAlerts: boolean;
  kycAlerts: boolean;
  hapticFeedback: boolean;
}
