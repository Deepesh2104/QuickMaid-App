import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PartnerNotificationCard } from '@/features/notifications/components/PartnerNotificationCard';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import {
  groupNotificationsByDay,
  NOTIFICATION_FILTERS,
} from '@/features/notifications/lib/notifications.utils';
import type { AppNotification, PartnerNotificationKind } from '@/features/notifications/types/notification.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const SHEET_OVERLAP = 14;
const SHEET_BG = '#EFF8F7';

export function PartnerNotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const compact = width < 360;
  const { items, unreadCount, loading, markRead, markAllRead, refresh } = useNotifications();
  const [filter, setFilter] = useState<'all' | PartnerNotificationKind>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((n) => n.kind === filter);
  }, [items, filter]);

  const grouped = useMemo(() => groupNotificationsByDay(filtered), [filtered]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const onOpen = async (notification: AppNotification) => {
    if (!notification.read) {
      await markRead(notification.id);
    }
    router.push(`/notifications/${notification.id}` as Href);
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#032A28', '#084F4A', '#0B6E67']}
        locations={[0, 0.5, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.xs }]}
      >
        <View style={styles.headerGlowA} />
        <View style={styles.headerGlowB} />

        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={20} color={colors.white} />
          </Pressable>
          <View style={styles.tabIcon}>
            <Ionicons name="notifications" size={17} color={colors.partnerGold} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>PARTNER INBOX</Text>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSub}>Jobs, payouts & partner updates</Text>
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
              <Ionicons name="checkmark-done" size={13} color={colors.white} />
              {!compact ? <Text style={styles.markText}>Read all</Text> : null}
            </Pressable>
          ) : (
            <View style={styles.markSpacer} />
          )}
        </View>

        <View style={styles.statBar}>
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{unreadCount}</Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{items.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{filtered.length}</Text>
            <Text style={styles.statLabel}>Showing</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.sheet}>
        <LinearGradient
          colors={['rgba(230,244,242,0.95)', SHEET_BG]}
          style={styles.sheetTopFade}
          pointerEvents="none"
        />
        <View style={styles.sheetHandle} />

        {unreadCount > 0 ? (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.unreadBanner}>
            <View style={styles.unreadPulse}>
              <View style={styles.unreadDot} />
            </View>
            <View style={styles.unreadIcon}>
              <Ionicons name="notifications" size={14} color={colors.primary} />
            </View>
            <Text style={styles.unreadText}>
              {unreadCount} unread alert{unreadCount === 1 ? '' : 's'} — tap any card to open
            </Text>
          </Animated.View>
        ) : null}

        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterWrap}>
            {NOTIFICATION_FILTERS.map((f) => {
              const on = filter === f.id;
              const count =
                f.id === 'all' ? items.length : items.filter((n) => n.kind === f.id).length;
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
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  ) : null}
                  <Ionicons name={f.icon} size={13} color={on ? colors.white : colors.muted} />
                  <Text style={[styles.filterText, on && styles.filterTextOn]}>{label}</Text>
                  {count > 0 ? (
                    <View style={[styles.filterBadge, on && styles.filterBadgeOn]}>
                      <Text style={[styles.filterBadgeText, on && styles.filterBadgeTextOn]}>{count}</Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.empty}>
            <LinearGradient colors={['#E6F4F2', colors.white]} style={styles.emptyIcon}>
              <Ionicons name="notifications-off-outline" size={30} color={colors.primary} />
            </LinearGradient>
            <Text style={styles.emptyTitle}>Inbox is clear</Text>
            <Text style={styles.emptySub}>
              Job requests, payouts, KYC and zone alerts will land here instantly
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => void onRefresh()}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xl }]}
          >
            {grouped.map((group, gIdx) => (
              <Animated.View
                key={group.label}
                entering={FadeInDown.delay(gIdx * 50).duration(300)}
                style={styles.group}
              >
                <View style={styles.groupHead}>
                  <View style={styles.groupDot} />
                  <Text style={styles.groupLabel}>{group.label}</Text>
                  <View style={styles.groupCount}>
                    <Text style={styles.groupCountText}>{group.items.length}</Text>
                  </View>
                </View>
                <View style={styles.cards}>
                  {group.items.map((n) => (
                    <PartnerNotificationCard
                      key={n.id}
                      notification={n}
                      onPress={() => void onOpen(n)}
                    />
                  ))}
                </View>
              </Animated.View>
            ))}

            <View style={styles.footer}>
              <View style={styles.footerLine} />
              <Text style={styles.footerBrand}>QuickMaid Partner Inbox</Text>
              <Text style={styles.footerSub}>Real-time dispatch · Raipur</Text>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primaryDark },
  header: {
    paddingHorizontal: layout.pad,
    paddingBottom: SHEET_OVERLAP + spacing.md,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  headerGlowA: {
    position: 'absolute',
    right: -20,
    top: -10,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(252,211,77,0.12)',
  },
  headerGlowB: {
    position: 'absolute',
    left: -30,
    bottom: -8,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(110,231,183,0.12)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  tabIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(217,119,6,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1, gap: 1, minWidth: 0 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(252,211,77,0.9)',
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.white,
    letterSpacing: -0.4,
  },
  headerSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
  },
  markBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  markText: { fontFamily: fonts.bold, fontSize: 10, color: colors.white },
  markSpacer: { width: 36 },
  statBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(110,231,183,0.1)',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.22)',
  },
  statChip: { flex: 1, alignItems: 'center', gap: 1 },
  statNum: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.white },
  statLabel: { fontFamily: fonts.medium, fontSize: 9, color: 'rgba(255,255,255,0.6)' },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginVertical: 2,
  },
  sheet: {
    flex: 1,
    marginTop: -SHEET_OVERLAP,
    backgroundColor: SHEET_BG,
    borderTopLeftRadius: radius.xxl + 6,
    borderTopRightRadius: radius.xxl + 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: 'rgba(11,110,103,0.18)',
    overflow: 'hidden',
  },
  sheetTopFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    zIndex: 0,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(11,110,103,0.22)',
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    zIndex: 1,
  },
  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: layout.pad,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: '#EEF6FF',
    borderWidth: 1,
    borderColor: 'rgba(21,112,239,0.18)',
  },
  unreadPulse: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(21,112,239,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1570EF',
  },
  unreadIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: { flex: 1, fontFamily: fonts.semiBold, fontSize: 12, color: colors.primaryDark },
  filterSection: { marginBottom: spacing.sm },
  filterWrap: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.xs,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  filterChipOn: { borderColor: colors.primary },
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
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  emptyTitle: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.ink },
  emptySub: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 280,
  },
  list: { gap: spacing.lg, paddingTop: spacing.xs },
  group: { gap: spacing.sm },
  groupHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: layout.pad,
  },
  groupDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.partnerGold },
  groupLabel: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  groupCount: {
    backgroundColor: colors.partnerGoldBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  groupCountText: { fontFamily: fonts.bold, fontSize: 10, color: colors.partnerGold },
  cards: { paddingHorizontal: layout.pad, gap: spacing.sm },
  footer: { alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.md, gap: 4 },
  footerLine: {
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(11,110,103,0.15)',
    marginBottom: spacing.xs,
  },
  footerBrand: { fontFamily: fonts.bold, fontSize: 12, color: colors.muted, letterSpacing: 0.3 },
  footerSub: { fontFamily: fonts.medium, fontSize: 10, color: colors.mutedLight },
});
