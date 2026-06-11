export const VISIT_COMPLETE_STEPS = [
  { icon: 'sparkles-outline' as const, text: 'Cleaning complete ho gayi' },
  { icon: 'chatbubble-ellipses-outline' as const, text: 'Customer se OTP maango' },
  { icon: 'checkmark-done' as const, text: 'Verify karo — earning credit' },
] as const;

export const VISIT_COMPLETE_DEMO_OTP = '123456';

export const VISIT_COMPLETE_TIPS = [
  `Demo test OTP: ${VISIT_COMPLETE_DEMO_OTP} (customer app se bhi yahi)`,
  'Customer tab OTP share kare jab kaam poora ho',
  'Verify hone par earning Monday payout batch mein jayegi',
] as const;
