import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import type { PartnerJob } from '@/constants/demo';
import { completePartnerVisitWithOtp } from '@/features/jobs/lib/job.completion';
import { getPartnerJobs, updatePartnerJobStatus } from '@/features/jobs/lib/jobs.storage';

export function usePartnerJobs() {
  const [jobs, setJobs] = useState<PartnerJob[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const all = await getPartnerJobs();
    setJobs(all);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const pending = useMemo(() => jobs.filter((j) => j.status === 'pending'), [jobs]);
  const active = useMemo(
    () => jobs.filter((j) => j.status === 'accepted' || j.status === 'in_progress'),
    [jobs],
  );
  const completed = useMemo(() => jobs.filter((j) => j.status === 'completed'), [jobs]);

  const acceptJob = useCallback(
    async (id: string) => {
      const updated = await updatePartnerJobStatus(id, 'accepted');
      await refresh();
      return updated;
    },
    [refresh],
  );

  const declineJob = useCallback(
    async (id: string) => {
      const updated = await updatePartnerJobStatus(id, 'declined');
      await refresh();
      return updated;
    },
    [refresh],
  );

  const startVisit = useCallback(
    async (id: string) => {
      const updated = await updatePartnerJobStatus(id, 'in_progress');
      await refresh();
      return updated;
    },
    [refresh],
  );

  const completeVisit = useCallback(
    async (id: string, otp: string) => {
      const result = await completePartnerVisitWithOtp(id, otp);
      if (result.ok) await refresh();
      return result;
    },
    [refresh],
  );

  return {
    jobs,
    pending,
    active,
    completed,
    loading,
    refresh,
    acceptJob,
    declineJob,
    startVisit,
    completeVisit,
  };
}
