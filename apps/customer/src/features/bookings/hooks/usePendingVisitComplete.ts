import { useCallback, useState } from 'react';

import {
  consumePendingVisitComplete,
  type VisitCompletePayload,
} from '../lib/booking.completion';

export function usePendingVisitComplete() {
  const [payload, setPayload] = useState<VisitCompletePayload | null>(null);
  const [visible, setVisible] = useState(false);

  const checkPending = useCallback(async () => {
    const pending = await consumePendingVisitComplete();
    if (pending) {
      setPayload(pending);
      setVisible(true);
    }
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    setPayload(null);
  }, []);

  return { payload, visible, checkPending, dismiss };
}
