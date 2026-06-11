import type { Ionicons } from '@expo/vector-icons';

export const REFER_WELCOME_STATS = [
  { value: '₹500', label: 'Referrer bonus' },
  { value: '₹200', label: 'New partner' },
  { value: '7d', label: 'Code valid' },
] as const;

export interface ReferWelcomeStep {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  sub: string;
}

export const REFER_WELCOME_STEPS: ReferWelcomeStep[] = [
  {
    icon: 'gift-outline',
    title: 'Kisi ne invite kiya?',
    sub: 'Unka QM- referral code neeche daalo — dono ko bonus milega',
  },
  {
    icon: 'person-add-outline',
    title: 'Apply form complete karo',
    sub: 'Profile + skills submit — maid ID auto-generate hogi',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'KYC verify karo',
    sub: 'Aadhaar, PAN & payout details — verified hone ke baad full access',
  },
  {
    icon: 'briefcase-outline',
    title: 'Pehli job complete',
    sub: 'Referred partner ki pehli visit complete → referrer ko ₹500 UPI',
  },
];

export const REFER_WELCOME_REWARDS = [
  { who: 'Jo invite kare (referrer)', amount: '₹500', when: 'Referred partner ki pehli completed job ke baad' },
  { who: 'Nayi partner (aap)', amount: '₹200', when: 'Aapki pehli completed job ke baad (agar valid code use hua)' },
] as const;

export const REFER_WELCOME_FAQ = [
  {
    q: 'Referral code optional hai?',
    a: 'Haan — code na ho toh "Skip" dabao aur seedha apply form khulega.',
  },
  {
    q: 'Galat code daala toh?',
    a: 'Apply submit se pehle verify ho jayega. Invalid code par bonus nahi milega, registration block nahi hoti.',
  },
  {
    q: 'Poori policy kahan hai?',
    a: 'Neeche "Referral policy" link — eligibility, payout timeline aur fraud rules.',
  },
] as const;
