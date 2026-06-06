import { Ionicons } from '@expo/vector-icons';

export interface OnboardingSlide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  highlight: string;
  description: string;
  stat?: { value: string; label: string };
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'shield-checkmark-outline',
    title: 'Verified partners,',
    highlight: 'trusted homes',
    description:
      'Every QuickMaid partner completes Aadhaar verification, background checks, and training before their first visit.',
    stat: { value: '4.9', label: 'Avg rating' },
  },
  {
    id: '2',
    icon: 'calendar-outline',
    title: 'Book in under',
    highlight: '60 seconds',
    description:
      'Choose a service, pick your slot, confirm with OTP — deep clean, regular, kitchen and more across Raipur.',
    stat: { value: '60s', label: 'Avg booking' },
  },
  {
    id: '3',
    icon: 'navigate-outline',
    title: 'Track live,',
    highlight: 'pay securely',
    description:
      'Follow your maid in real time, pay via UPI or card, and rate every visit from the app.',
    stat: { value: '100%', label: 'Secure pay' },
  },
];
