import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { useNotifications } from '../hooks/useNotifications';
import {
  NOTIFICATION_FILTERS,
  groupNotificationsByDay,
} from '../lib/notifications.utils';
import type { AppNotification, NotificationCategory } from '../types/notification.types';
import { NotificationCard } from './NotificationCard';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, unreadCount, loading, markRead, markAllRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | NotificationCategory>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((n) => n.category === filter);
  }, [items, filter]);

  const groups = useMemo(() => groupNotificationsByDay(filtered), [filtered]);

  const onOpen = async (notification: AppNotification) => {
    if (!notification.read) {
      await markRead(notification.id);
    }

    const action = notification.action;
    if (!action || action.type === 'none') return;

    if (action.type === 'booking' && action.id) {
      router.push({ pathname: '/booking/[id]', params: { id: action.id } } as Href);
      return;
    }
    if (action.type === 'bookings') {
      router.replace('/(tabs)/bookings' as Href);
      return;
    }
    if (action.type === 'plans') {
      router.replace('/(tabs)/plans' as Href);
      return;
    }
    if (action.type === 'service' && action.id) {
      router.push({ pathname: '/service/[id]', params: { id: action.id } } as Href);
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#084F4A', '#0B6E67', '#12A598']}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerGlow} />
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>Inbox</Text>
            <Text style={styles.headerTitle}>Notifications</Text>
          </View>
          {unreadCount > 0 ? (
            <Pressable
              style={styles.markBtn}
              onPress={() => {
                Haptics.selectionAsync();
                void markAllRead();
              }}
              accessibilityRole="button"
            >
              <Text style={styles.markText}>Read all</Text>
            </Pressable>
          ) : (
            <View style={styles.markSpacer} />
          )}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{unreadCount}</Text>
            <Text style={styles.summaryLabel}>Unread</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{items.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {NOTIFICATION_FILTERS.map((f) => {
          const on = filter === f.id;
          const count =
            f.id === 'all'
              ? items.length
              : items.filter((n) => n.category === f.id).length;
          return (
            <Pressable
              key={f.id}
              style={[styles.filterChip, on && styles.filterChipOn]}
              onPress={() => {
                Haptics.selectionAsync();
                setFilter(f.id);
              }}
            >
              <Text style={[styles.filterText, on && styles.filterTextOn]}>{f.label}</Text>
              {count > 0 ? (
                <View style={[styles.filterBadge, on && styles.filterBadgeOn]}>
                  <Text style={[styles.filterBadgeText, on && styles.filterBadgeTextOn]}>{count}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="notifications-off-outline" size={48} color={colors.muted} />
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptySub}>Booking alerts, pro updates & offers yahan dikhenge</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xl }]}
        >
          {groups.map((group) => (
            <View key={group.label} style={styles.group}>
              <HomeSectionHeader
                eyebrow={group.label}
                title={group.label === 'Today' ? 'Fresh updates' : group.label}
                subtitle={`${group.items.length} alert${group.items.length === 1 ? '' : 's'}`}
                icon="time-outline"
                compact
              />
              <View style={styles.cards}>
                {group.items.map((n) => (
                  <NotificationCard
                    key={n.id}
                    notification={n}
                    onPress={() => void onOpen(n)}
                  />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  header: {
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    right: -30,
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(110,231,183,0.18)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerCopy: { flex: 1, gap: 2 },
  headerEyebrow: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  headerTitle: { fontFamily: fonts.extraBold, fontSize: 22, color: colors.white, letterSpacing: -0.3 },
  markBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  markText: { fontFamily: fonts.bold, fontSize: 11, color: colors.white },
  markSpacer: { width: 64 },
  summary: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryNum: { fontFamily: fonts.extraBold, fontSize: 22, color: colors.white },
  summaryLabel: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 4,
  },
  filters: {
    paddingHorizontal: layout.pad,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  filterChipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted },
  filterTextOn: { color: colors.white, fontFamily: fonts.bold },
  filterBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeOn: { backgroundColor: 'rgba(255,255,255,0.25)' },
  filterBadgeText: { fontFamily: fonts.bold, fontSize: 10, color: colors.muted },
  filterBadgeTextOn: { color: colors.white },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: layout.pad,
  },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  emptySub: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 19,
  },
  list: { gap: spacing.section },
  group: { gap: spacing.sm },
  cards: { paddingHorizontal: layout.pad, gap: spacing.sm },
});
