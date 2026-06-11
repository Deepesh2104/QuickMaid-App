export const DECLINE_REASONS = [
  {
    id: 'too_far',
    label: 'Bahut door hai',
    sub: 'Travel time / distance zyada',
    icon: 'car-outline' as const,
  },
  {
    id: 'slot_clash',
    label: 'Slot clash',
    sub: 'Is time par dusri visit hai',
    icon: 'calendar-outline' as const,
  },
  {
    id: 'low_pay',
    label: 'Payout kam lag raha',
    sub: 'Is visit ke liye worth nahi',
    icon: 'wallet-outline' as const,
  },
  {
    id: 'service_mismatch',
    label: 'Service match nahi',
    sub: 'Meri skills se alag kaam',
    icon: 'construct-outline' as const,
  },
  {
    id: 'personal',
    label: 'Personal reason',
    sub: 'Aaj available nahi',
    icon: 'person-outline' as const,
  },
  {
    id: 'other',
    label: 'Other',
    sub: 'Koi aur reason',
    icon: 'ellipsis-horizontal-outline' as const,
  },
] as const;

export type DeclineReasonId = (typeof DECLINE_REASONS)[number]['id'];

export function declineReasonLabel(id: DeclineReasonId): string {
  return DECLINE_REASONS.find((r) => r.id === id)?.label ?? 'Declined';
}
