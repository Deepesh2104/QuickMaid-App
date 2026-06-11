import { getPartnerJobById } from '@/features/jobs/lib/jobs.storage';

export async function getJobById(id: string) {
  return getPartnerJobById(id);
}
