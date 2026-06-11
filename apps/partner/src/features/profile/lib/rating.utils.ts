import type { PartnerJob } from '@/constants/demo';

import { computeRatingFromJobs } from '@/features/profile/lib/rating.compute';
import type { PartnerCustomerReview } from '@/features/profile/lib/partner-reviews.storage';

export function ratingPerformanceStats(
  completed: PartnerJob[],
  weekJobs: number,
  bridgeReviews: PartnerCustomerReview[] = [],
) {
  const overview = computeRatingFromJobs(completed, bridgeReviews);
  const freshReview = bridgeReviews[0];
  return {
    ...overview,
    weekJobs,
    trendLabel:
      freshReview != null
        ? `+${freshReview.stars}★ from ${freshReview.customerName.split(' ')[0]}`
        : overview.completedVisits >= 3
          ? '+0.1 this month'
          : 'Building score',
  };
}

export function formatBridgeReviewDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Recently';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function mergeRecentReviews(
  bridgeReviews: PartnerCustomerReview[],
  staticReviews: readonly {
    id: string;
    customer: string;
    stars: number;
    date: string;
    text: string;
    service: string;
  }[],
) {
  const fromBridge = bridgeReviews.map((r) => ({
    id: r.id,
    customer: r.customerName,
    stars: r.stars,
    date: formatBridgeReviewDate(r.createdAt),
    text: r.text?.trim() || 'Customer ne rating di — thank you for your service!',
    service: r.service,
    fromBridge: true as const,
  }));
  const seen = new Set(fromBridge.map((r) => r.id));
  const rest = staticReviews.filter((r) => !seen.has(r.id));
  return [...fromBridge, ...rest].slice(0, 8);
}

export function completedJobsForRating(jobs: PartnerJob[]): PartnerJob[] {
  return jobs.filter((j) => j.status === 'completed');
}
