import { useEffect, useState } from 'react';

import { ensureOfferListedAt } from '@/features/jobs/lib/offer-expiry.storage';
import { offerSecondsLeft } from '@/features/jobs/lib/offer-expiry.utils';

export function useOfferCountdown(jobId: string, active: boolean) {
  const [listedAt, setListedAt] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    void (async () => {
      const at = await ensureOfferListedAt(jobId);
      if (!cancelled) {
        setListedAt(at);
        setSecondsLeft(offerSecondsLeft(jobId, at));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [jobId, active]);

  useEffect(() => {
    if (!active || listedAt == null) return;
    const tick = () => setSecondsLeft(offerSecondsLeft(jobId, listedAt));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [active, jobId, listedAt]);

  return { secondsLeft, expired: secondsLeft <= 0 };
}
