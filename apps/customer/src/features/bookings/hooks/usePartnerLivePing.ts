import { useEffect, useState } from 'react';

import { getPartnerLiveLocation, type VisitLocationBridgeEntry } from '@/lib/visit-location-bridge';

export function usePartnerLivePing(bookingRef?: string, enabled = true) {
  const [ping, setPing] = useState<VisitLocationBridgeEntry | null>(null);

  useEffect(() => {
    if (!enabled || !bookingRef) {
      setPing(null);
      return;
    }
    const poll = async () => setPing(await getPartnerLiveLocation(bookingRef));
    void poll();
    const id = setInterval(() => void poll(), 8000);
    return () => clearInterval(id);
  }, [bookingRef, enabled]);

  return ping;
}
