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
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ListPagination } from '@/components/ui/ListPagination';
import { PAGE_SIZE_NOTIFICATIONS } from '@/constants/pagination';
import { usePagination } from '@/hooks/usePagination';
import { useNotifications } from '../hooks/useNotifications';
import { NOTIFICATION_FILTERS, notificationDayLabel } from '../lib/notifications.utils';
import type { AppNotification, NotificationCategory } from '../types/notification.types';
import { NotificationCard } from './NotificationCard';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const compact = width < 360;
  const { items, unreadCount, loading, markRead, markAllRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | NotificationCategory>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((n) => n.category === filter);
  }, [items, filter]);

  const { page, setPage, totalPages, start, end, slice, total } = usePagination(
    filtered,
    PAGE_SIZE_NOTIFICATIONS,
    filter,
  );

  const onOpen = async (notification: AppNotification) => {
    if (!notification.read) {
      await markRead(notification.id);
    }
    router.push(`/notifications/${notification.id}` as Href);
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#010F0E', '#084F4A', '#0B6E67', '#12A598']}
        locations={[0, 0.3, 0.65, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerGlowA} />
        <View style={styles.headerGlowB} />

        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>PREMIUM INBOX</Text>
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
              <Ionicons name="checkmark-done" size={14} color={colors.white} />
              <Text style={styles.markText}>{compact ? 'Read' : 'Read all'}</Text>
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
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{filtered.length}</Text>
            <Text style={styles.summaryLabel}>Showing</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.filterSection}>
        <View style={styles.filterWrap}>
          {NOTIFICATION_FILTERS.map((f) => {
            const on = filter === f.id;
            const count =
              f.id === 'all'
                ? items.length
                : items.filter((n) => n.category === f.id).length;
            const label = compact ? f.shortLabel : f.label;

            return (
              <Pressable
                key={f.id}
                style={[styles.filterChip, on && styles.filterChipOn]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setFilter(f.id);
                }}
              >
                {on ? (
                  <LinearGradient
                    colors={['#084F4A', '#0B6E67']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.filterChipGrad}
                  >
                    <FilterChipContent
                      icon={f.icon}
                      label={label}
                      count={count}
                      active
                    />
                  </LinearGradient>
                ) : (
                  <FilterChipContent icon={f.icon} label={label} count={count} active={false} />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <LinearGradient colors={['#E6F4F2', '#FFFFFF']} style={styles.emptyIcon}>
            <Ionicons name="notifications-off-outline" size={34} color={colors.primary} />
          </LinearGradient>
          <Text style={styles.emptyTitle}>No alerts here</Text>
          <Text style={styles.emptySub}>
            Booking updates, pro messages, payments & offers will appear in your premium inbox
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xl }]}
        >
          {slice.map((n, idx) => {
            const day = notificationDayLabel(n.createdAt);
            const prevDay = idx > 0 ? notificationDayLabel(slice[idx - 1].createdAt) : null;
            const showHeader = day !== prevDay;

            return (
              <View key={n.id} style={styles.group}>
                {showHeader ? (
                  <View style={styles.groupHead}>
                    <View style={styles.groupPill}>
                      <Ionicons name="time-outline" size={12} color={colors.primary} />
                      <Text style={styles.groupPillText}>{day}</Text>
                    </View>
                  </View>
                ) : null}
                <View style={styles.cards}>
                  <NotificationCard notification={n} onPress={() => void onOpen(n)} />
                </View>
              </View>
            );
          })}

          <ListPagination
            page={page}
            totalPages={totalPages}
            start={start}
            end={end}
            total={total}
            onPageChange={setPage}
            label="Inbox page"
            itemLabel="alerts"
          />
        </ScrollView>
      )}
    </View>
  );
}

function FilterChipContent({
  icon,
  label,
  count,
  active,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <View style={styles.filterInner}>
      <Ionicons name={icon} size={12} color={active ? colors.white : colors.muted} />
      <Text style={[styles.filterText, active && styles.filterTextOn]} numberOfLines={1}>
        {label}
      </Text>
      {count > 0 ? (
        <View style={[styles.filterBadge, active && styles.filterBadgeOn]}>
          <Text style={[styles.filterBadgeText, active && styles.filterBadgeTextOn]}>{count}</Text>
        </View>
      ) : null}
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
  headerGlowA: {
    position: 'absolute',
    right: -30,
    top: -20,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(110,231,183,0.2)',
  },
  headerGlowB: {
    position: 'absolute',
    left: -40,
    bottom: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(252,211,77,0.12)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  headerCopy: { flex: 1, gap: 2 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(252,211,77,0.9)',
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 24,
    color: colors.white,
    letterSpacing: -0.4,
  },
  markBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  markText: { fontFamily: fonts.bold, fontSize: 11, color: colors.white },
  markSpacer: { width: 72 },
  summary: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryNum: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.white },
  summaryLabel: { fontFamily: fonts.medium, fontSize: 10, color: 'rgba(255,255,255,0.75)' },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 4,
  },
  filterSection: {
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: '#F4F6F8',
  },
  filterWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    borderRadius: radius.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.08)',
    backgroundColor: colors.white,
    maxWidth: '100%',
  },
  filterChipOn: {
    borderColor: colors.primary,
  },
  filterChipGrad: {
    borderRadius: radius.pill,
  },
  filterInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.muted,
    flexShrink: 1,
  },
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
  filterBadgeOn: { backgroundColor: 'rgba(255,255,255,0.22)' },
  filterBadgeText: { fontFamily: fonts.bold, fontSize: 9, color: colors.muted },
  filterBadgeTextOn: { color: colors.white },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: layout.pad,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  emptyTitle: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.ink },
  emptySub: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  list: { gap: spacing.section, paddingTop: spacing.sm },
  group: { gap: spacing.sm },
  groupHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.pad,
  },
  groupPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  groupPillText: { fontFamily: fonts.bold, fontSize: 11, color: colors.primary },
  groupCount: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  cards: { paddingHorizontal: layout.pad, gap: spacing.sm },
});
