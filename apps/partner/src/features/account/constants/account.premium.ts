import type { Ionicons } from '@expo/vector-icons';

export const DELETE_WARNINGS = [
  'Partner profile & maid ID remove ho jayega',
  'Job history & earnings records clear',
  'KYC draft & verification data delete',
  'Dubara register karna padega same number se',
] as const;

export const DELETE_STATS = [
  { value: 'Final', label: 'No undo' },
  { value: '7 days', label: 'Data purge' },
  { value: 'Support', label: 'Help first' },
] as const;

export interface DeleteLossItem {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  tone: string;
  ink: string;
}

export const DELETE_LOSS_ITEMS: DeleteLossItem[] = [
  {
    icon: 'person-circle-outline',
    text: 'Partner profile, maid ID & public rating',
    tone: '#FEF3F2',
    ink: '#B42318',
  },
  {
    icon: 'briefcase-outline',
    text: 'Job history, schedule & visit records',
    tone: '#FFF7ED',
    ink: '#C2410C',
  },
  {
    icon: 'wallet-outline',
    text: 'Earnings ledger & pending payout queue',
    tone: '#FFFBEB',
    ink: '#B45309',
  },
  {
    icon: 'shield-checkmark-outline',
    text: 'KYC uploads, PAN & Aadhaar verification',
    tone: '#F5F3FF',
    ink: '#6D28D9',
  },
  {
    icon: 'gift-outline',
    text: 'Referral bonuses & invite history',
    tone: '#ECFDF5',
    ink: '#047857',
  },
];

export interface DeleteTimelineStep {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  sub: string;
}

export const DELETE_TIMELINE: DeleteTimelineStep[] = [
  {
    icon: 'create-outline',
    title: 'Type DELETE',
    sub: 'Identity confirm karo — registered mobile match hona chahiye',
  },
  {
    icon: 'trash-outline',
    title: 'Permanent removal',
    sub: 'Profile, jobs, KYC & wallet data local se wipe',
  },
  {
    icon: 'time-outline',
    title: '7-day purge window',
    sub: 'Demo mode — production mein server backup policy apply hogi',
  },
  {
    icon: 'log-in-outline',
    title: 'Fresh registration',
    sub: 'Same number se dubara partner onboarding complete karna padega',
  },
];

export const DELETE_HELP_OPTIONS = [
  {
    id: 'chat',
    icon: 'chatbubbles-outline' as const,
    label: 'Help chat',
    sub: 'Payout ya KYC issue — pehle yahan try karo',
    route: '/support/chat' as const,
  },
  {
    id: 'help',
    icon: 'help-circle-outline' as const,
    label: 'Help centre',
    sub: 'FAQs, policies & support hours',
    route: '/(tabs)/help' as const,
  },
] as const;
