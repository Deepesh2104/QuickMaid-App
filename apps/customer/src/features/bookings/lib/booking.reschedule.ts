import { slotToTime } from '@/features/checkout/lib/checkout.utils';

export interface RescheduleSelection {
  visitDate: string;
  visitDateLabel: string;
  slotId: string;
  slotLabel: string;
}

export function timeToSlotId(time: string): string {
  const map: Record<string, string> = {
    '10:00 AM': 'morning',
    '3:00 PM': 'afternoon',
    '6:00 PM': 'evening',
    '5:00 PM': 'weekend-pm',
  };
  return map[time] ?? 'morning';
}

export function buildReschedulePatch(selection: RescheduleSelection) {
  return {
    ...selection,
    date: selection.visitDateLabel,
    time: slotToTime(selection.slotId),
    rescheduledAt: new Date().toISOString(),
  };
}

export function hasRescheduleChanged(
  current: { date: string; time: string },
  selection: RescheduleSelection,
): boolean {
  const nextTime = slotToTime(selection.slotId);
  return current.date !== selection.visitDateLabel || current.time !== nextTime;
}
