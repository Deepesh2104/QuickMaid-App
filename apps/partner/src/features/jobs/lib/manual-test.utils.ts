import {
  DEMO_MANUAL_ACCEPT_TEST_JOB_ID,
  DEMO_MANUAL_DECLINE_TEST_JOB_ID,
  type PartnerJob,
} from '@/constants/demo';

export function manualTestHint(job: PartnerJob): string | null {
  if (job.id === DEMO_MANUAL_ACCEPT_TEST_JOB_ID) return '✓ Accept → Schedule check karo';
  if (job.id === DEMO_MANUAL_DECLINE_TEST_JOB_ID) return '✗ Decline → reason chuno';
  return null;
}

export function hasManualTestJobs(jobs: PartnerJob[]): boolean {
  return jobs.some(
    (j) => j.id === DEMO_MANUAL_ACCEPT_TEST_JOB_ID || j.id === DEMO_MANUAL_DECLINE_TEST_JOB_ID,
  );
}
