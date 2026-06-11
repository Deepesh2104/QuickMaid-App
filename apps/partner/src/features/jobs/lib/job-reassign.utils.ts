import type { PartnerJob } from '@/constants/demo';
import { emitDispatchEvent } from '@/features/jobs/lib/dispatch.events';
import { getPartnerJobs, savePartnerJobs } from '@/features/jobs/lib/jobs.storage';
import { primeOfferTimers } from '@/features/jobs/lib/offer-expiry.storage';
import { appendPartnerNotification } from '@/features/notifications/lib/notifications.storage';

function nextReassignId(job: PartnerJob): string {
  const gen = (job.reassignGeneration ?? 0) + 1;
  return `${job.id.replace(/_r\d+$/, '')}_r${gen}`;
}

/** Demo: declined/expired job re-enters pool as fresh pending offer for "next partner". */
export async function passJobToNextPartner(
  source: PartnerJob,
  reason: string,
): Promise<PartnerJob | null> {
  const jobs = await getPartnerJobs();
  const exists = jobs.some(
    (j) =>
      j.status === 'pending' &&
      j.bookingRef === source.bookingRef &&
      (j.reassignGeneration ?? 0) > (source.reassignGeneration ?? 0),
  );
  if (exists) return null;

  const gen = (source.reassignGeneration ?? 0) + 1;
  if (gen > 3) return null;

  const pending: PartnerJob = {
    ...source,
    id: nextReassignId(source),
    status: 'pending',
    declineReason: undefined,
    reassignGeneration: gen,
    distanceKm: Math.min(12, (source.distanceKm ?? 3) + 0.4),
  };

  await savePartnerJobs([pending, ...jobs]);
  await primeOfferTimers([pending.id]);

  await appendPartnerNotification({
    id: `dispatch_reassign_${pending.id}_${Date.now()}`,
    kind: 'job',
    title: 'Nayi offer — pool se',
    body: `${source.bookingRef} · ${reason}`,
    detail: `${pending.service} · ${pending.zone} — Requests / auto-assign check karo`,
    time: 'Just now',
    createdAt: new Date().toISOString(),
    jobId: pending.id,
  });

  emitDispatchEvent({ type: 'new_offer', jobId: pending.id, bookingRef: pending.bookingRef });
  return pending;
}
