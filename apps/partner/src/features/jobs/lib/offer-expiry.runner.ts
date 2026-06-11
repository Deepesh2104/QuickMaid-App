import type { PartnerJob } from '@/constants/demo';
import { emitDispatchEvent } from '@/features/jobs/lib/dispatch.events';
import { passJobToNextPartner } from '@/features/jobs/lib/job-reassign.utils';
import { notifyJobPassedToNextPartner } from '@/features/jobs/lib/dispatch.notifications';
import {
  clearOfferListedAt,
  ensureOfferListedAt,
  primeOfferTimers,
} from '@/features/jobs/lib/offer-expiry.storage';
import { isOfferExpired } from '@/features/jobs/lib/offer-expiry.utils';
import { getPartnerJobs, updatePartnerJobStatus } from '@/features/jobs/lib/jobs.storage';

/** Expire pending offers → declined + re-enter pool for next partner (demo). */
export async function expireStalePendingOffers(): Promise<boolean> {
  const jobs = await getPartnerJobs();
  const pending = jobs.filter((j) => j.status === 'pending');
  if (!pending.length) return false;

  await primeOfferTimers(pending.map((j) => j.id));

  let changed = false;
  for (const job of pending) {
    const listedAt = await ensureOfferListedAt(job.id);
    if (!isOfferExpired(job.id, listedAt)) continue;

    const updated = await updatePartnerJobStatus(job.id, 'declined', {
      declineReason: 'Offer expired — agle partner ko gayi',
    });
    if (updated) {
      await clearOfferListedAt(job.id);
      await notifyJobPassedToNextPartner(updated);
      await passJobToNextPartner(updated, 'Offer expire — naye partner ko offer');
      emitDispatchEvent({ type: 'offer_expired', jobId: job.id, bookingRef: job.bookingRef });
      changed = true;
    }
  }
  return changed;
}

export async function filterActivePendingOffers(jobs: PartnerJob[]): Promise<PartnerJob[]> {
  const pending = jobs.filter((j) => j.status === 'pending');
  if (!pending.length) return jobs;

  await primeOfferTimers(pending.map((j) => j.id));
  const expiredIds = new Set<string>();
  for (const job of pending) {
    const listedAt = await ensureOfferListedAt(job.id);
    if (isOfferExpired(job.id, listedAt)) expiredIds.add(job.id);
  }
  if (!expiredIds.size) return jobs;
  return jobs.filter((j) => !expiredIds.has(j.id));
}
