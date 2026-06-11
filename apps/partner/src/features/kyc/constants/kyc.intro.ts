export const KYC_INTRO_ITEMS = [
  {
    icon: 'lock-closed-outline' as const,
    title: 'DigiLocker Aadhaar',
    sub: '12-digit number + OTP — photo upload nahi',
  },
  {
    icon: 'document-text-outline' as const,
    title: 'DigiLocker PAN',
    sub: 'PAN + naam match (internal API) — OTP nahi',
  },
  {
    icon: 'person-circle-outline' as const,
    title: 'Live selfie',
    sub: 'Face match with Aadhaar · front camera',
  },
  {
    icon: 'business-outline' as const,
    title: 'Bank details',
    sub: 'Bank + UPI internal API · naam match',
  },
  {
    icon: 'phone-portrait-outline' as const,
    title: 'UPI ID',
    sub: 'Monday weekly payout destination',
  },
] as const;

export const KYC_INTRO_STEPS_MAID = [
  'Profile complete — DigiLocker se Aadhaar verify karo',
  'PAN internal API se verify — profile naam match hona chahiye',
  'Selfie + bank & UPI verify (internal API)',
  'Submit karo — 24–48 ghante mein verify',
  'Verify hone ke baad Monday UPI payout unlock',
] as const;
