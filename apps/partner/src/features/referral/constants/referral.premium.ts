export const REFERRAL_REWARD_PAISE = 50000;

export const REFERRAL_STATS = [
  { value: '₹500', label: 'Per referral' },
  { value: '∞', label: 'Unlimited' },
  { value: 'Mon', label: 'Payout day' },
] as const;

export const REFERRAL_STEPS = [
  {
    icon: 'share-social-outline' as const,
    title: 'Apna code share karo',
    sub: 'Dusri maid ko WhatsApp ya SMS se bhejo',
  },
  {
    icon: 'person-add-outline' as const,
    title: 'Wo register kare',
    sub: 'Tumhara code apply form mein daale',
  },
  {
    icon: 'wallet-outline' as const,
    title: '₹500 bonus',
    sub: 'Jab wo pehli job complete kare',
  },
] as const;

export const REFERRAL_FAQ = [
  {
    q: 'Kitne referrals kar sakti hoon?',
    a: 'Unlimited — har successful referral par ₹500 jab wo pehli visit complete kare.',
  },
  {
    q: 'Bonus kab milega?',
    a: 'Referred partner ki pehli completed job ke baad next Monday UPI batch mein.',
  },
] as const;
