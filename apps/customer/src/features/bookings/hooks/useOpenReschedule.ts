import { type Href, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export function useOpenReschedule() {
  const router = useRouter();

  return (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/booking/reschedule/[id]', params: { id } } as Href);
  };
}
