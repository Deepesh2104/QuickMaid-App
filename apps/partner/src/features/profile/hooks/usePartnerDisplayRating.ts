import { useCallback, useEffect, useState } from 'react';

import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';
import { computeRatingFromJobs } from '@/features/profile/lib/rating.compute';
import { getPartnerCustomerReviews } from '@/features/profile/lib/partner-reviews.storage';
import { syncCustomerRatingsFromStatusBridge } from '@/features/jobs/lib/booking-status-bridge.storage';

export function usePartnerDisplayRating() {
  const { completed } = usePartnerJobs();
  const [label, setLabel] = useState('4.9');

  const refresh = useCallback(async () => {
    await syncCustomerRatingsFromStatusBridge();
    const reviews = await getPartnerCustomerReviews();
    const overview = computeRatingFromJobs(completed, reviews);
    setLabel(overview.score.toFixed(1));
  }, [completed]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ratingLabel: label, refresh };
}
