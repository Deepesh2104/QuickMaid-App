import * as Linking from 'expo-linking';
import { useEffect, useRef } from 'react';

import { handlePartnerBookingDeepLink } from '@/features/jobs/lib/booking-partner-bridge';

/** Ingest customer booking deep links → pending partner job. */
export function usePartnerBookingDeepLink(onIngested?: () => void) {
  const handled = useRef(new Set<string>());

  useEffect(() => {
    const ingest = async (url: string | null) => {
      if (!url || handled.current.has(url)) return;
      handled.current.add(url);
      const job = await handlePartnerBookingDeepLink(url);
      if (job) onIngested?.();
    };

    void Linking.getInitialURL().then((u) => void ingest(u));
    const sub = Linking.addEventListener('url', (e) => void ingest(e.url));
    return () => sub.remove();
  }, [onIngested]);
}
