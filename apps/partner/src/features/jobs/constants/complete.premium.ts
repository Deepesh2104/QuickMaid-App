export const VISIT_COMPLETE_STEPS = [
  { icon: 'sparkles-outline' as const, text: 'Cleaning complete ho gayi' },
  { icon: 'chatbubble-ellipses-outline' as const, text: 'Customer se OTP maango' },
  { icon: 'checkmark-done' as const, text: 'Verify karo — earning credit' },
] as const;

export const VISIT_COMPLETE_TIPS = [
  'Customer tab OTP share kare jab kaam poora ho',
  'Galat OTP par dubara try karo — 3 attempts ke baad support',
  'Verify hone par earning Monday payout batch mein jati hai',
] as const;
