import { useEffect } from 'react';

import { subscribeDispatchEvents } from '@/features/jobs/lib/dispatch.events';

/** UC-style local "push" — react to new offers without waiting for tab focus only. */
export function useRealtimeDispatch(onEvent: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    return subscribeDispatchEvents(() => onEvent());
  }, [enabled, onEvent]);
}
