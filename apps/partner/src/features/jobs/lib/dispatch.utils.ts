import type { PartnerProfile } from '@/constants/app';
import { MANUAL_ACCEPT_DECLINE_TEST_IDS, type PartnerJob } from '@/constants/demo';
import { netEarningPaise } from '@/features/home/lib/home.greeting';
import type { PreferredSlotId } from '@/features/slots/constants/slots.premium';
import { resolvePreferredSlotIds } from '@/features/slots/lib/slots.utils';

/** Urban Company–style: partner must respond within this window (minutes). */
export const DISPATCH_RESPONSE_MINUTES = 15;

export interface DispatchOffer extends PartnerJob {
  slotId: PreferredSlotId | null;
  score: number;
  responseMinutesLeft: number;
}

/** Map job slot label → partner preferred-slot id. */
export function slotIdFromJob(job: PartnerJob): PreferredSlotId | null {
  const label = job.slotLabel.toLowerCase();
  if (label.includes('sun') || job.visitDate.toLowerCase().includes('sun')) return 'sunday';
  if (label.includes('8–11') || label.includes('8-11')) return 'morning';
  if (label.includes('2–5') || label.includes('2-5') || label.includes('11 am')) return 'afternoon';
  return null;
}

export function jobMatchesActiveSlots(job: PartnerJob, activeSlotIds: readonly string[]): boolean {
  const slotId = slotIdFromJob(job);
  if (!slotId) return true;
  return activeSlotIds.includes(slotId);
}

export function slotOccupancyKey(job: PartnerJob): string | null {
  const slotId = slotIdFromJob(job);
  if (!slotId) return null;
  return `${job.visitDate}|${slotId}`;
}

export function occupiedSlotKeys(scheduled: PartnerJob[]): Set<string> {
  const keys = new Set<string>();
  for (const job of scheduled) {
    if (job.status !== 'accepted' && job.status !== 'in_progress') continue;
    const key = slotOccupancyKey(job);
    if (key) keys.add(key);
  }
  return keys;
}

export function isSlotFree(job: PartnerJob, occupied: Set<string>): boolean {
  const key = slotOccupancyKey(job);
  if (!key) return true;
  return !occupied.has(key);
}

export function jobMatchesZone(
  job: PartnerJob,
  partnerZone?: string,
  workRadiusKm = 5,
): boolean {
  if (!partnerZone?.trim()) return true;
  const zone = partnerZone.trim().toLowerCase();
  const jobZone = job.zone.trim().toLowerCase();
  if (jobZone === zone || jobZone.includes(zone) || zone.includes(jobZone)) return true;
  const addr = `${job.address} ${job.landmark ?? ''}`.toLowerCase();
  if (addr.includes(zone)) return true;
  // Urban-style: match by distance from work base, not only zone label
  if (job.distanceKm != null && job.distanceKm <= workRadiusKm) return true;
  return false;
}

function responseMinutesLeft(jobId: string): number {
  const hash = jobId.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return 5 + (hash % (DISPATCH_RESPONSE_MINUTES - 4));
}

/** Higher = better match (Urban-style dispatch score). */
export function dispatchScore(job: PartnerJob, profile: PartnerProfile | null): number {
  let score = 0;
  const dist = job.distanceKm ?? 8;
  score += Math.max(0, 50 - dist * 8);
  score += Math.min(40, Math.round(netEarningPaise(job.amountPaise) / 500));
  if (job.visitDate === 'Today') score += 25;
  else if (job.visitDate === 'Tomorrow') score += 12;
  const slotId = slotIdFromJob(job);
  const active = resolvePreferredSlotIds(profile);
  if (slotId && active.includes(slotId)) score += 20;
  if (jobMatchesZone(job, profile?.zone, profile?.workRadiusKm ?? 5)) score += 15;
  return score;
}

/**
 * Urban Company model: when online, only jobs matching active slots + zone surface as offers.
 * When offline, no dispatch offers.
 */
export function buildDispatchOffers(
  pending: PartnerJob[],
  scheduled: PartnerJob[],
  profile: PartnerProfile | null,
  isOnline: boolean,
): DispatchOffer[] {
  if (!isOnline) return [];

  const activeSlots = resolvePreferredSlotIds(profile);
  const occupied = occupiedSlotKeys(scheduled);
  const eligible = pending.filter(
    (j) =>
      jobMatchesActiveSlots(j, activeSlots) &&
      jobMatchesZone(j, profile?.zone, profile?.workRadiusKm ?? 5) &&
      isSlotFree(j, occupied),
  );

  return eligible
    .map((job) => ({
      ...job,
      slotId: slotIdFromJob(job),
      score: dispatchScore(job, profile),
      responseMinutesLeft: responseMinutesLeft(job.id),
    }))
    .sort((a, b) => b.score - a.score);
}

export function getPrimaryDispatchOffer(
  pending: PartnerJob[],
  scheduled: PartnerJob[],
  profile: PartnerProfile | null,
  isOnline: boolean,
): DispatchOffer | null {
  return buildDispatchOffers(pending, scheduled, profile, isOnline)[0] ?? null;
}

export function dispatchOfferJobs(offers: DispatchOffer[]): PartnerJob[] {
  return offers;
}

/** Manual mode: zone + slot match, no slot-occupancy cap — partner Accept/Decline khud karta hai. */
export function buildManualOffers(
  pending: PartnerJob[],
  profile: PartnerProfile | null,
  isOnline: boolean,
): PartnerJob[] {
  if (!isOnline) return [];

  const activeSlots = resolvePreferredSlotIds(profile);
  const eligible = pending.filter(
    (j) =>
      jobMatchesActiveSlots(j, activeSlots) &&
      jobMatchesZone(j, profile?.zone, profile?.workRadiusKm ?? 5),
  );

  const testFirst = new Set<string>(MANUAL_ACCEPT_DECLINE_TEST_IDS);
  return [...eligible].sort((a, b) => {
    const aTest = testFirst.has(a.id) ? 0 : 1;
    const bTest = testFirst.has(b.id) ? 0 : 1;
    if (aTest !== bTest) return aTest - bTest;
    const distA = a.distanceKm ?? 99;
    const distB = b.distanceKm ?? 99;
    return distA - distB;
  });
}
