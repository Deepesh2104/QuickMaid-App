import type { PartnerJob } from '@/constants/demo';
import { RATING_OVERVIEW } from '@/features/profile/constants/rating.premium';

export interface ComputedRatingOverview {
  score: number;
  totalReviews: number;
  onTimeRate: number;
  repeatCustomers: number;
  fiveStarPercent: number;
  completedVisits: number;
}

export function computeRatingFromJobs(completed: PartnerJob[]): ComputedRatingOverview {
  const n = completed.length;
  const base = RATING_OVERVIEW.score;
  const bonus = Math.min(0.15, n * 0.008);
  const score = Math.min(5, Math.round((base + bonus) * 10) / 10);

  return {
    score,
    totalReviews: RATING_OVERVIEW.totalReviews + Math.floor(n / 2),
    onTimeRate: Math.min(99, RATING_OVERVIEW.onTimeRate + Math.floor(n / 3)),
    repeatCustomers: Math.min(95, RATING_OVERVIEW.repeatCustomers + Math.floor(n / 4)),
    fiveStarPercent: Math.min(98, RATING_OVERVIEW.fiveStarPercent + Math.floor(n / 5)),
    completedVisits: n,
  };
}
