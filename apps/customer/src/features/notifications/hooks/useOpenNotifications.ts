import { type Href, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export function useOpenNotifications() {
  const router = useRouter();

  return () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/notifications' as Href);
  };
}
