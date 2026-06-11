import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { usePartner } from '@/context/PartnerContext';
import type { PartnerJob } from '@/constants/demo';
import { netEarningPaise } from '@/features/home/lib/home.greeting';
import { completePartnerVisitWithOtp } from '@/features/jobs/lib/job.completion';
import { subscribePartnerJobsChanged } from '@/features/jobs/lib/jobs.events';
import { declineReasonLabel, type DeclineReasonId } from '@/features/jobs/constants/decline.premium';
import { syncCustomerBookingBridge } from '@/features/jobs/lib/booking-partner-bridge';
import {
  partnerStatusFromJob,
  publishPartnerBookingStatus,
  syncCustomerRatingsFromStatusBridge,
  syncJobsFromCustomerStatusBridge,
} from '@/features/jobs/lib/booking-status-bridge.storage';
import { subscribeDispatchEvents } from '@/features/jobs/lib/dispatch.events';
import { passJobToNextPartner } from '@/features/jobs/lib/job-reassign.utils';
import { notifyJobPassedToNextPartner } from '@/features/jobs/lib/dispatch.notifications';
import { usePartnerBookingDeepLink } from '@/features/jobs/hooks/usePartnerBookingDeepLink';
import { expireStalePendingOffers } from '@/features/jobs/lib/offer-expiry.runner';
import { clearOfferListedAt } from '@/features/jobs/lib/offer-expiry.storage';
import { getPartnerJobs, syncPartnerJobsWithDemo, updatePartnerJobStatus } from '@/features/jobs/lib/jobs.storage';
import { canPartnerAcceptJobs } from '@/features/kyc/lib/kyc.routing';
import { recordCompletedVisitEarning } from '@/lib/storage';

interface PartnerJobsContextValue {
  jobs: PartnerJob[];
  pending: PartnerJob[];
  active: PartnerJob[];
  completed: PartnerJob[];
  loading: boolean;
  refresh: () => Promise<void>;
  acceptJob: (id: string) => Promise<PartnerJob | null>;
  declineJob: (id: string, reasonId?: DeclineReasonId) => Promise<PartnerJob | null>;
  startVisit: (id: string) => Promise<PartnerJob | null>;
  completeVisit: (id: string, otp: string) => Promise<Awaited<ReturnType<typeof completePartnerVisitWithOtp>>>;
  canAcceptJobs: boolean;
}

const PartnerJobsContext = createContext<PartnerJobsContextValue | null>(null);

export function PartnerJobsProvider({ children }: { children: ReactNode }) {
  const { profile, refresh: refreshPartner } = usePartner();
  const [jobs, setJobs] = useState<PartnerJob[]>([]);
  const [loading, setLoading] = useState(true);

  const canAcceptJobs = canPartnerAcceptJobs(profile?.kycStatus);

  const refresh = useCallback(async () => {
    await syncCustomerBookingBridge();
    await syncJobsFromCustomerStatusBridge();
    await syncCustomerRatingsFromStatusBridge();
    await expireStalePendingOffers();
    const all = await getPartnerJobs();
    setJobs(all);
    setLoading(false);
  }, []);

  usePartnerBookingDeepLink(() => void refresh());

  useEffect(() => {
    void (async () => {
      await syncPartnerJobsWithDemo();
      await refresh();
    })();
    return subscribePartnerJobsChanged(() => void refresh());
  }, [refresh]);

  useEffect(() => {
    return subscribeDispatchEvents((event) => {
      if (event.type === 'new_offer' || event.type === 'offer_expired' || event.type === 'online_pulse') {
        void refresh();
      }
    });
  }, [refresh]);

  useEffect(() => {
    const id = setInterval(() => {
      void (async () => {
        const changed = await expireStalePendingOffers();
        if (changed) await refresh();
      })();
    }, 5_000);
    return () => clearInterval(id);
  }, [refresh]);

  const pending = useMemo(() => jobs.filter((j) => j.status === 'pending'), [jobs]);
  const active = useMemo(
    () => jobs.filter((j) => j.status === 'accepted' || j.status === 'in_progress'),
    [jobs],
  );
  const completed = useMemo(() => jobs.filter((j) => j.status === 'completed'), [jobs]);

  const applyJobUpdate = useCallback((updated: PartnerJob) => {
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
  }, []);

  const acceptJob = useCallback(
    async (id: string) => {
      if (!canPartnerAcceptJobs(profile?.kycStatus)) return null;
      const updated = await updatePartnerJobStatus(id, 'accepted');
      if (updated) {
        await clearOfferListedAt(id);
        await publishPartnerBookingStatus(
          partnerStatusFromJob(updated, 'partner_accepted', profile?.name),
        );
        applyJobUpdate(updated);
      }
      return updated;
    },
    [applyJobUpdate, profile?.kycStatus, profile?.name],
  );

  const declineJob = useCallback(
    async (id: string, reasonId?: DeclineReasonId) => {
      const updated = await updatePartnerJobStatus(id, 'declined', {
        declineReason: reasonId ? declineReasonLabel(reasonId) : undefined,
      });
      if (updated) {
        await clearOfferListedAt(id);
        await publishPartnerBookingStatus(
          partnerStatusFromJob(updated, 'partner_declined', profile?.name),
        );
        applyJobUpdate(updated);
        await notifyJobPassedToNextPartner(updated);
        const reason = reasonId ? declineReasonLabel(reasonId) : 'Declined';
        const requeued = await passJobToNextPartner(updated, reason);
        if (requeued) await refresh();
      }
      return updated;
    },
    [applyJobUpdate, profile?.name, refresh],
  );

  const startVisit = useCallback(
    async (id: string) => {
      const updated = await updatePartnerJobStatus(id, 'in_progress');
      if (updated) {
        await publishPartnerBookingStatus(
          partnerStatusFromJob(updated, 'partner_in_progress', profile?.name),
        );
        applyJobUpdate(updated);
      }
      return updated;
    },
    [applyJobUpdate, profile?.name],
  );

  const completeVisit = useCallback(
    async (id: string, otp: string) => {
      const result = await completePartnerVisitWithOtp(id, otp);
      if (result.ok) {
        await recordCompletedVisitEarning(
          result.job.visitDate,
          netEarningPaise(result.job.amountPaise),
        );
        await Promise.all([refresh(), refreshPartner()]);
      }
      return result;
    },
    [refresh, refreshPartner],
  );

  const value = useMemo(
    () => ({
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
      canAcceptJobs,
    }),
    [
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
      canAcceptJobs,
    ],
  );

  return <PartnerJobsContext.Provider value={value}>{children}</PartnerJobsContext.Provider>;
}

export function usePartnerJobsContext() {
  const ctx = useContext(PartnerJobsContext);
  if (!ctx) throw new Error('usePartnerJobs must be used within PartnerJobsProvider');
  return ctx;
}
