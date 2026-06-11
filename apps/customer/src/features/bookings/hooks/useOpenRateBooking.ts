import { type Href, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { getBookingById } from '../lib/booking.lookup';

export function useOpenRateBooking() {
  const router = useRouter();

  return (id: string) => {
    void (async () => {
      const booking = await getBookingById(id);
      if (!booking || booking.status !== 'completed') return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push({ pathname: '/booking/rate/[id]', params: { id } } as Href);
    })();
  };
}
