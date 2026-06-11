import type { Ionicons } from '@expo/vector-icons';

export const DELETE_WARNINGS = [
  'Account turant logout ho jayega',
  '7 din ke andar login karo toh account wapas active ho jayega',
  '7 din ke baad data permanently purge hoga',
  'Purge ke baad same number se dubara register karna padega',
] as const;

export const DELETE_STATS = [
  { value: '7 days', label: 'Restore window' },
  { value: 'Auto', label: 'Login restores' },
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
    icon: 'log-out-outline',
    title: 'Account deactivate',
    sub: 'Turant logout — app access band, lekin data 7 din safe rahega',
  },
  {
    icon: 'time-outline',
    title: '7-day restore window',
    sub: 'Is period mein same number + OTP se login = account automatic restore',
  },
  {
    icon: 'trash-outline',
    title: 'Permanent purge',
    sub: '7 din ke baad bina login ke data permanently delete ho jayega',
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
