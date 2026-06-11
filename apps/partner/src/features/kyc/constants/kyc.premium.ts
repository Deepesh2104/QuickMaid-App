import type { KycDocumentKind } from '@/features/kyc/types/kyc.types';

export const KYC_STATS = [
  { value: '24–48h', label: 'Review time' },
  { value: '256-bit', label: 'Encrypted' },
  { value: 'Mon', label: 'Payout day' },
] as const;

export const KYC_STEPS = [
  { step: '1', title: 'Aadhaar', sub: 'DigiLocker OTP' },
  { step: '2', title: 'Selfie', sub: 'Live face match' },
  { step: '3', title: 'PAN', sub: 'API + naam match' },
  { step: '4', title: 'Payout', sub: 'API + naam match' },
  { step: '5', title: 'Submit', sub: 'Consent & verify' },
] as const;

export const KYC_TIPS = [
  'Aadhaar OTP se, PAN internal API + naam match — photo upload nahi',
  'Selfie clearly show your face (no sunglasses)',
  'Bank & UPI verify — Aadhaar/PAN naam se match hona chahiye',
  'Monday UPI payouts unlock after verification',
] as const;

export const KYC_REJECTION_REASONS = [
  'Aadhaar OTP verification failed — dubara try karo',
  'PAN verification failed — sahi number daalo',
  'Selfie did not match Aadhaar photo',
  'Bank IFSC or account number could not be verified',
] as const;

export const KYC_CONSENT_TEXT =
  'I confirm Aadhaar was verified via DigiLocker OTP, PAN via ITD lookup, other details are accurate, and I consent to QuickMaid storing them for KYC and payout compliance (demo — encrypted locally).';

export const KYC_DOCUMENT_SLOTS: {
  kind: KycDocumentKind;
  title: string;
  hint: string;
  icon: 'person-circle-outline';
  required: boolean;
  preferCamera?: boolean;
}[] = [
  {
    kind: 'selfie',
    title: 'Live selfie',
    hint: 'Face clearly visible · plain background',
    icon: 'person-circle-outline',
    required: true,
    preferCamera: true,
  },
];

export const KYC_REVIEW_TIMELINE = [
  {
    icon: 'lock-closed-outline' as const,
    title: 'DigiLocker Aadhaar & PAN',
    sub: 'UIDAI + ITD OTP authentication received',
  },
  {
    icon: 'scan-outline' as const,
    title: 'Selfie & bank verification',
    sub: 'Face match + bank/UPI internal API verified',
  },
  {
    icon: 'wallet-outline' as const,
    title: 'Payout unlock',
    sub: 'Monday UPI batch after approval',
  },
] as const;

export const KYC_VERIFIED_PERKS = [
  { icon: 'wallet-outline' as const, label: 'Monday UPI payouts' },
  { icon: 'shield-checkmark-outline' as const, label: 'Verified partner badge' },
  { icon: 'trending-up-outline' as const, label: 'Higher job priority' },
] as const;
