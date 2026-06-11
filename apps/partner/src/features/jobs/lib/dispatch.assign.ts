import type { PartnerProfile } from '@/constants/app';
import type { PartnerJob } from '@/constants/demo';
import { getPrimaryDispatchOffer } from '@/features/jobs/lib/dispatch.utils';
import {
  partnerStatusFromJob,
  publishPartnerBookingStatus,
} from '@/features/jobs/lib/booking-status-bridge.storage';
import { updatePartnerJobStatus } from '@/features/jobs/lib/jobs.storage';
import { canPartnerAcceptJobs } from '@/features/kyc/lib/kyc.routing';

/**
 * Urban Company demo: best dispatch offer → accepted without Accept tap.
 * Does NOT start the visit — partner taps Start visit on job detail when they arrive.
 */
export async function autoAssignPrimaryOffer(
  pending: PartnerJob[],
  scheduled: PartnerJob[],
  profile: PartnerProfile | null,
  isOnline: boolean,
): Promise<PartnerJob | null> {
  if (!isOnline || !canPartnerAcceptJobs(profile?.kycStatus)) return null;

  const primary = getPrimaryDispatchOffer(pending, scheduled, profile, isOnline);
  if (!primary) return null;

  const updated = await updatePartnerJobStatus(primary.id, 'accepted');
  if (updated) {
    await publishPartnerBookingStatus(
      partnerStatusFromJob(updated, 'partner_accepted', profile?.name),
    );
  }
  return updated;
}
