import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';

import type { SupportTopic } from '../types/support.types';

export function useOpenSupportChat() {
  const router = useRouter();

  return (opts?: {
    topic?: SupportTopic | string;
    ticketId?: string;
    bookingId?: string;
    paymentId?: string;
    context?: string;
  }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/support/chat',
      params: {
        topic: opts?.topic ?? '',
        ticketId: opts?.ticketId ?? '',
        bookingId: opts?.bookingId ?? '',
        paymentId: opts?.paymentId ?? '',
        context: opts?.context ?? '',
      },
    } as Href);
  };
}
