import type { PartnerJob } from '@/constants/demo';
import { getPartnerJobById, updatePartnerJobStatus } from '@/features/jobs/lib/jobs.storage';

export const DEMO_FALLBACK_COMPLETION_OTP = '482916';

export async function completePartnerVisitWithOtp(
  jobId: string,
  otp: string,
): Promise<{ ok: true; job: PartnerJob } | { ok: false; error: string }> {
  const job = await getPartnerJobById(jobId);
  if (!job) return { ok: false, error: 'Job not found' };
  if (job.status !== 'in_progress') {
    return { ok: false, error: 'Pehle Start visit dabao, phir finish karein' };
  }

  const expected = job.completionOtp ?? DEMO_FALLBACK_COMPLETION_OTP;
  const entered = otp.replace(/\D/g, '').trim();

  if (entered.length !== 6) {
    return { ok: false, error: 'Poora 6-digit OTP daalein' };
  }
  if (entered !== expected) {
    return { ok: false, error: 'Galat OTP. Customer se sahi code lein.' };
  }

  const updated = await updatePartnerJobStatus(jobId, 'completed');
  if (!updated) return { ok: false, error: 'Visit complete nahi ho paya. Dobara try karein.' };

  return { ok: true, job: updated };
}
