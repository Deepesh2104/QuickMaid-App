import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { Linking } from 'react-native';

import { SUPPORT_CONTACT } from '@/constants/demo';

export function useOpenSupport() {
  const router = useRouter();

  return (opts?: { chat?: boolean; topic?: string; call?: boolean }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (opts?.call) {
      void Linking.openURL(`tel:${SUPPORT_CONTACT.phone.replace(/\s/g, '')}`);
      return;
    }
    if (opts?.chat) {
      router.push({
        pathname: '/(tabs)/support',
        params: { chat: '1', topic: opts.topic ?? '' },
      } as Href);
      return;
    }
    router.push('/(tabs)/support' as Href);
  };
}
