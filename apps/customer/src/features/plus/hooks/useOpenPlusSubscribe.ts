import { type Href, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';

import { isSubscriptionPlan } from '../lib/plus.plans';

export function useOpenPlusSubscribe() {
  const router = useRouter();
  const { bookDefault } = useStartBooking();

  return (planId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isSubscriptionPlan(planId)) {
      bookDefault();
      return;
    }
    router.push({ pathname: '/plus/subscribe', params: { plan: planId } } as Href);
  };
}
