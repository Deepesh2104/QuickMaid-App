import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';

export function useOpenBookingDispute() {
  const router = useRouter();

  return (bookingId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: '/booking/dispute/[id]', params: { id: bookingId } } as Href);
  };
}
