export const PREFERRED_SLOTS = [
  {
    id: 'morning',
    label: 'Mon–Sat · 8–11 AM',
    sub: 'Peak demand · most job offers',
    icon: 'sunny-outline' as const,
    peak: true,
  },
  {
    id: 'afternoon',
    label: 'Mon–Sat · 2–5 PM',
    sub: 'Steady bookings all week',
    icon: 'partly-sunny-outline' as const,
    peak: true,
  },
  {
    id: 'sunday',
    label: 'Sun · 8–11 AM',
    sub: 'Premium Sunday visits',
    icon: 'calendar-outline' as const,
    peak: false,
  },
] as const;

export type PreferredSlotId = (typeof PREFERRED_SLOTS)[number]['id'];

export const DEFAULT_PREFERRED_SLOT_IDS: PreferredSlotId[] = ['morning', 'afternoon', 'sunday'];

export const SLOT_PICKER_STATS = [
  { value: '3', label: 'Time windows' },
  { value: 'Peak', label: '8–11 & 2–5' },
  { value: 'Live', label: 'Job matching' },
] as const;

export const SLOT_PICKER_TIPS = [
  'Turn on at least one slot — jobs only match your active windows',
  'Morning & afternoon slots get the most requests in Raipur',
  'You can change slots anytime from Profile or Schedule',
] as const;
