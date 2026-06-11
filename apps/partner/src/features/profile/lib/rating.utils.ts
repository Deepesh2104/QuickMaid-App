import type { PartnerJob } from '@/constants/demo';

import { RATING_OVERVIEW } from '@/features/profile/constants/rating.premium';

export function ratingFromCompletedJobs(completedCount: number): number {
  const bonus = Math.min(0.09, completedCount * 0.008);
  return Math.min(5, Math.round((RATING_OVERVIEW.score + bonus) * 10) / 10);
}

export function ratingPerformanceStats(completedCount: number, weekJobs: number) {
  return {
    score: ratingFromCompletedJobs(completedCount),
    completedVisits: completedCount,
    weekJobs,
    trendLabel: completedCount >= 3 ? '+0.1 this month' : 'Building score',
  };
}

export function completedJobsForRating(jobs: PartnerJob[]): PartnerJob[] {
  return jobs.filter((j) => j.status === 'completed');
}
