import * as Haptics from 'expo-haptics';

import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';

import { resolveServiceIdFromName } from '../utils/bookings.utils';

export function useRebookBooking() {
  const { bookById, bookDefault } = useStartBooking();

  return (serviceName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const id = resolveServiceIdFromName(serviceName);
    if (id) bookById(id);
    else bookDefault();
  };
}
