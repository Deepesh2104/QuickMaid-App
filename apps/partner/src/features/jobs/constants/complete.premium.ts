import { DEMO_VISIT_COMPLETION_OTP } from '@/constants/app';

export const VISIT_COMPLETE_STEPS = [
  { icon: 'sparkles-outline' as const, text: 'Cleaning complete ho gayi' },
  { icon: 'chatbubble-ellipses-outline' as const, text: 'Customer se OTP maango' },
  { icon: 'checkmark-done' as const, text: 'Verify karo — earning credit' },
] as const;

export const VISIT_COMPLETE_DEMO_OTP = DEMO_VISIT_COMPLETION_OTP;

export const VISIT_COMPLETE_TIPS = [
  `Unified demo OTP: ${VISIT_COMPLETE_DEMO_OTP} (auth + visit — dono apps)`,
  'Customer tab OTP share kare jab kaam poora ho',
  'Verify hone par earning Monday payout batch mein jayegi',
] as const;
