import { type Href, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export function useOpenServiceDetail() {
  const router = useRouter();

  return (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/service/[id]', params: { id } } as Href);
  };
}
