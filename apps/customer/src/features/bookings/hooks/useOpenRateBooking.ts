import { type Href, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export function useOpenRateBooking() {
  const router = useRouter();

  return (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/booking/rate/[id]', params: { id } } as Href);
  };
}
