import type { PartnerJob } from '@/constants/demo';
import { RATING_OVERVIEW } from '@/features/profile/constants/rating.premium';
import type { PartnerCustomerReview } from '@/features/profile/lib/partner-reviews.storage';

export interface ComputedRatingOverview {
  score: number;
  totalReviews: number;
  onTimeRate: number;
  repeatCustomers: number;
  fiveStarPercent: number;
  completedVisits: number;
}

export function computeRatingFromJobs(
  completed: PartnerJob[],
  bridgeReviews: PartnerCustomerReview[] = [],
): ComputedRatingOverview {
  const n = completed.length;
  const bridgeCount = bridgeReviews.length;
  const bridgeAvg =
    bridgeCount > 0
      ? bridgeReviews.reduce((sum, r) => sum + r.stars, 0) / bridgeCount
      : null;
  const fiveStarBridge = bridgeReviews.filter((r) => r.stars >= 5).length;

  const base = RATING_OVERVIEW.score;
  const jobBonus = Math.min(0.1, n * 0.006);
  const reviewBonus = bridgeAvg != null ? Math.min(0.12, (bridgeAvg - 4) * 0.08) : 0;
  const score = Math.min(
    5,
    Math.round((bridgeAvg != null ? bridgeAvg * 0.35 + base * 0.65 + jobBonus + reviewBonus : base + jobBonus) * 10) /
      10,
  );

  const totalReviews = RATING_OVERVIEW.totalReviews + Math.floor(n / 2) + bridgeCount;
  const fiveStarPercent =
    bridgeCount > 0
      ? Math.min(99, Math.round(((RATING_OVERVIEW.fiveStarPercent * 0.7 + (fiveStarBridge / bridgeCount) * 100 * 0.3))))
      : Math.min(98, RATING_OVERVIEW.fiveStarPercent + Math.floor(n / 5));

  return {
    score,
    totalReviews,
    onTimeRate: Math.min(99, RATING_OVERVIEW.onTimeRate + Math.floor(n / 3)),
    repeatCustomers: Math.min(95, RATING_OVERVIEW.repeatCustomers + Math.floor(n / 4)),
    fiveStarPercent,
    completedVisits: n,
  };
}
