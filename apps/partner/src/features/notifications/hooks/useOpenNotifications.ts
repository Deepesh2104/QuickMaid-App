import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';

export function useOpenNotifications() {
  const router = useRouter();

  return () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/notifications' as Href);
  };
}
