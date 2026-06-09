import { type Href, useRouter } from 'expo-router';
import { useCallback } from 'react';

import type { NotificationAction } from '../types/notification.types';

export function useNotificationNavigation() {
  const router = useRouter();

  return useCallback(
    (action?: NotificationAction) => {
      if (!action || action.type === 'none') return false;

      if (action.type === 'booking' && action.id) {
        router.push({ pathname: '/booking/[id]', params: { id: action.id } } as Href);
        return true;
      }
      if (action.type === 'bookings') {
        router.replace('/(tabs)/bookings' as Href);
        return true;
      }
      if (action.type === 'plans') {
        router.replace('/(tabs)/plans' as Href);
        return true;
      }
      if (action.type === 'service' && action.id) {
        router.push({ pathname: '/service/[id]', params: { id: action.id } } as Href);
        return true;
      }
      if (action.type === 'home') {
        router.replace('/(tabs)' as Href);
        return true;
      }
      if (action.type === 'profile') {
        router.replace('/(tabs)/profile' as Href);
        return true;
      }
      if (action.type === 'pro' && action.id) {
        router.push({ pathname: '/pro/[id]', params: { id: action.id } } as Href);
        return true;
      }

      return false;
    },
    [router],
  );
}
