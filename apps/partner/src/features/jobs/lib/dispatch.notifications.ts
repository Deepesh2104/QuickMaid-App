import type { PartnerJob } from '@/constants/demo';

import { formatRs, netEarningPaise } from '@/features/home/lib/home.greeting';

import { appendPartnerNotification } from '@/features/notifications/lib/notifications.storage';

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


