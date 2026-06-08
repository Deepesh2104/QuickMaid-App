import { useCallback, useEffect, useState } from 'react';

import type { DemoBooking } from '@/constants/demo';
import { getAllBookings } from '@/features/checkout/lib/bookings.storage';

export function useUserBookings() {
  const [bookings, setBookings] = useState<DemoBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const all = await getAllBookings();
    setBookings(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { bookings, loading, refresh };
}
