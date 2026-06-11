import type { PartnerJob } from '@/constants/demo';

import { formatRs, netEarningPaise } from '@/features/home/lib/home.greeting';

import { appendPartnerNotification } from '@/features/notifications/lib/notifications.storage';

import { emitDispatchEvent } from '@/features/jobs/lib/dispatch.events';
import { getPartnerJobs } from '@/features/jobs/lib/jobs.storage';
import {
  getOfferListedAt,
  primeOfferTimers,
} from '@/features/jobs/lib/offer-expiry.storage';
import { getPartnerPreferences } from '@/features/settings/lib/settings.storage';



export async function notifyJobPassedToNextPartner(job: PartnerJob): Promise<void> {
  await appendPartnerNotification({
    id: `pass-${job.id}-${Date.now()}`,
    title: 'Job next partner ko gayi',
    body: `${job.service} · ${job.zone} — aapne decline kiya`,
    detail: `${job.bookingRef} ab zone ke agle available partner ki queue mein hai.`,
    time: 'Just now',
    createdAt: new Date().toISOString(),
    kind: 'system',
  });
}

export async function notifyNewManualOffer(job: PartnerJob): Promise<void> {
  const prefs = await getPartnerPreferences();
  if (!prefs.jobAlerts) return;

  const net = formatRs(netEarningPaise(job.amountPaise));
  await appendPartnerNotification({
    id: `offer-${job.id}-${Date.now()}`,
    title: 'New job offer',
    body: `${job.service} · ${job.zone} · ${net} after fee`,
    detail: `${job.bookingRef} — open Requests tab to accept within the offer window.`,
    time: 'Just now',
    createdAt: new Date().toISOString(),
    kind: 'job',
    jobId: job.id,
  });
}

/** Pending jobs ingested while offline get alerts when partner goes online. */
export async function notifyUnlistedPendingOffers(): Promise<void> {
  const jobs = await getPartnerJobs();
  const pending = jobs.filter((j) => j.status === 'pending');
  for (const job of pending) {
    const listedAt = await getOfferListedAt(job.id);
    if (listedAt != null) continue;
    await notifyNewManualOffer(job);
    emitDispatchEvent({ type: 'new_offer', jobId: job.id, bookingRef: job.bookingRef });
    await primeOfferTimers([job.id]);
  }
}

export async function notifyJobAutoAssigned(job: PartnerJob): Promise<void> {

  const prefs = await getPartnerPreferences();

  if (!prefs.jobAlerts) return;



  const net = formatRs(netEarningPaise(job.amountPaise));

  await appendPartnerNotification({

    id: `assign-${job.id}-${Date.now()}`,

    title: 'Visit auto-confirmed',

    body: `${job.service} · ${job.zone} · ${net} after fee`,

    detail: `${job.customerName} ki visit ${job.visitDate} · ${job.slotLabel} slot mein confirm ho gayi. Schedule tab se Start visit dabao jab pahuncho.`,

    time: 'Just now',

    createdAt: new Date().toISOString(),

    kind: 'job',

    jobId: job.id,

  });

}


