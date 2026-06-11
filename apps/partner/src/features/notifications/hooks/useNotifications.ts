import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '../lib/notifications.storage';
import type { AppNotification } from '../types/notification.types';

export function useNotifications() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [all, count] = await Promise.all([getNotifications(), getUnreadCount()]);
    setItems(all);
    setUnreadCount(count);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const markRead = useCallback(
    async (id: string) => {
      await markNotificationRead(id);
      await refresh();
    },
    [refresh],
  );

  const markAllRead = useCallback(async () => {
    await markAllNotificationsRead(items.map((n) => n.id));
    await refresh();
  }, [items, refresh]);

  return { items, unreadCount, loading, refresh, markRead, markAllRead };
}
