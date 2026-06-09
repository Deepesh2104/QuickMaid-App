import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { Linking } from 'react-native';

import { SUPPORT_CONTACT } from '@/constants/demo';
import { normalizeSupportTopic } from '@/features/support/lib/support.utils';

export function useOpenSupport() {
  const router = useRouter();

  return (opts?: {
    chat?: boolean;
    topic?: string;
    call?: boolean;
    bookingId?: string;
    paymentId?: string;
    ticketId?: string;
  }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (opts?.call) {
      void Linking.openURL(`tel:${SUPPORT_CONTACT.phone.replace(/\s/g, '')}`);
      return;
    }
    if (opts?.chat) {
      router.push({
        pathname: '/support/chat',
        params: {
          topic: normalizeSupportTopic(opts.topic),
          context: opts.topic ?? '',
          bookingId: opts.bookingId ?? '',
          paymentId: opts.paymentId ?? '',
          ticketId: opts.ticketId ?? '',
        },
      } as Href);
      return;
    }
    router.push('/(tabs)/support' as Href);
  };
}
