import type { PartnerJob } from '@/constants/demo';

/** Demo: declined offer is re-offered to the next partner in the zone pool. */
export function passedToNextPartnerMessage(job: PartnerJob): string {
  return `${job.bookingRef} aapne decline ki — yeh job ${job.zone} ke agle available partner ko offer ho gayi.`;
}
