import type { PartnerJob } from '@/constants/demo';

import { computeRatingFromJobs } from '@/features/profile/lib/rating.compute';

export function ratingPerformanceStats(completed: PartnerJob[], weekJobs: number) {
  const overview = computeRatingFromJobs(completed);
  return {
    ...overview,
    weekJobs,
    trendLabel: overview.completedVisits >= 3 ? '+0.1 this month' : 'Building score',
  };
}

export function completedJobsForRating(jobs: PartnerJob[]): PartnerJob[] {
  return jobs.filter((j) => j.status === 'completed');
}
