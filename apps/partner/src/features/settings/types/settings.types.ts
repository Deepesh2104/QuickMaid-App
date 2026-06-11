export type PartnerAppLanguage = 'en' | 'hi';

export interface PartnerAppPreferences {
  language: PartnerAppLanguage;
  jobAlerts: boolean;
  payoutAlerts: boolean;
  kycAlerts: boolean;
  hapticFeedback: boolean;
}
