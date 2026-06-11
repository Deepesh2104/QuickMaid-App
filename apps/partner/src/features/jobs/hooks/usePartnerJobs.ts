import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { usePartnerJobsContext } from '@/features/jobs/context/PartnerJobsContext';

export function usePartnerJobs() {
  const ctx = usePartnerJobsContext();

  useFocusEffect(
    useCallback(() => {
      void ctx.refresh();
    }, [ctx.refresh]),
  );

  return ctx;
}
