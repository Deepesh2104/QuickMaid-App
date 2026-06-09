import { type Href, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import type { BookingStatus } from '@/constants/demo';

interface OpenProProfileOptions {
  name?: string;
  bookingId?: string;
  status?: BookingStatus;
}

export function useOpenProProfile() {
  const router = useRouter();

  return (maidId: string, options?: OpenProProfileOptions) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/pro/[id]',
      params: {
        id: maidId,
        ...(options?.name ? { name: options.name } : {}),
        ...(options?.bookingId ? { bookingId: options.bookingId } : {}),
        ...(options?.status ? { status: options.status } : {}),
      },
    } as Href);
  };
}
