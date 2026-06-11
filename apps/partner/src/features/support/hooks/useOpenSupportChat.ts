import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';

import type { PartnerSupportTopic } from '../types/support.types';

export function useOpenSupportChat() {
  const router = useRouter();

  return (opts?: {
    topic?: PartnerSupportTopic | string;
    ticketId?: string;
    jobId?: string;
    context?: string;
  }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/support/chat',
      params: {
        topic: opts?.topic ?? '',
        ticketId: opts?.ticketId ?? '',
        jobId: opts?.jobId ?? '',
        context: opts?.context ?? '',
      },
    } as Href);
  };
}
