import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ListPagination } from '@/components/ui/ListPagination';
import { formatRs } from '@/features/home/lib/home.greeting';
import { PartnerJobHistoryCard } from '@/features/jobs/components/PartnerJobHistoryCard';
import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';
import {
  historyJobs,
  historyTotalEarnings,
  sortHistoryJobs,
  type HistoryFilter,
} from '@/features/jobs/lib/history.utils';
import { useListPagination } from '@/hooks/useListPagination';
import { HISTORY_PAGE_SIZE } from '@/lib/pagination';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const SHEET_OVERLAP = 14;
const SHEET_BG = '#EFF8F7';

const FILTERS: { id: HistoryFilter; label: string; shortLabel: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'completed', label: 'Completed', shortLabel: 'Done', icon: 'checkmark-circle-outline' },
  { id: 'declined', label: 'Declined', shortLabel: 'No', icon: 'close-circle-outline' },
  { id: 'all', label: 'All history', shortLabel: 'All', icon: 'archive-outline' },
];

export function PartnerJobHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { jobs, refresh } = usePartnerJobs();
  const [filter, setFilter] = useState<HistoryFilter>('completed');
  const [refreshing, setRefreshing] = useState(false);

  const sorted = useMemo(() => sortHistoryJobs(historyJobs(jobs, filter)), [jobs, filter]);
  const totalEarn = useMemo(() => historyTotalEarnings(sorted), [sorted]);
  const completedCount = useMemo(() => jobs.filter((j) => j.status === 'completed').length, [jobs]);
  const declinedCount = useMemo(() => jobs.filter((j) => j.status === 'declined').length, [jobs]);
  const { visibleItems, hasMore, loadMore, showing } = useListPagination(sorted, HISTORY_PAGE_SIZE, filter);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

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
            <Ionicons name="archive" size={17} color={colors.partnerGold} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>PAST VISITS</Text>
            <Text style={styles.headerTitle}>Job history</Text>
            <Text style={styles.headerSub}>Completed visits · payouts & ratings</Text>
          </View>
        </View>

        <View style={styles.statBar}>
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{formatRs(totalEarn)}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{declinedCount}</Text>
            <Text style={styles.statLabel}>Declined</Text>
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
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        >
          <Animated.View entering={FadeInDown.duration(300)}>
            <Pressable
              style={styles.payoutStrip}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/(tabs)/earnings' as Href);
              }}
            >
              <View style={styles.payoutIcon}>
                <Ionicons name="wallet-outline" size={16} color={colors.primaryDark} />
              </View>
              <View style={styles.payoutCopy}>
                <Text style={styles.payoutTitle}>View earnings & payouts</Text>
                <Text style={styles.payoutSub}>Credits from completed visits · Monday batch</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
            </Pressable>
          </Animated.View>

          <View style={styles.filterRow}>
            {FILTERS.map((f) => {
              const on = filter === f.id;
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
                    <LinearGradient colors={['#084F4A', '#0B6E67']} style={StyleSheet.absoluteFill} />
                  ) : null}
                  <Ionicons name={f.icon} size={13} color={on ? colors.white : colors.muted} />
                  <Text style={[styles.filterText, on && styles.filterTextOn]}>{f.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {sorted.length === 0 ? (
            <Animated.View entering={FadeInDown.delay(80).duration(320)} style={styles.empty}>
              <LinearGradient colors={['#E6F4F2', colors.white]} style={styles.emptyIcon}>
                <Ionicons name="archive-outline" size={32} color={colors.primary} />
              </LinearGradient>
              <Text style={styles.emptyTitle}>No history yet</Text>
              <Text style={styles.emptySub}>
                Complete your first visit — finished jobs and declined requests show up here
              </Text>
              <Pressable
                style={styles.emptyBtn}
                onPress={() => router.push('/(tabs)/schedule' as Href)}
              >
                <Text style={styles.emptyBtnText}>Open schedule</Text>
              </Pressable>
            </Animated.View>
          ) : (
            <View style={styles.list}>
              <View style={styles.listHead}>
                <Text style={styles.listTitle}>
                  {filter === 'completed' ? 'Completed' : filter === 'declined' ? 'Declined' : 'All history'}
                </Text>
                <Text style={styles.listCount}>{sorted.length} record{sorted.length === 1 ? '' : 's'}</Text>
              </View>
              {visibleItems.map((job, i) => (
                <Animated.View key={job.id} entering={FadeInDown.delay(i * 35).duration(280)}>
                  <PartnerJobHistoryCard job={job} />
                </Animated.View>
              ))}
              <ListPagination
                showing={showing}
                hasMore={hasMore}
                onLoadMore={loadMore}
                label="Load more jobs"
              />
            </View>
          )}

          <View style={styles.footer}>
            <View style={styles.footerLine} />
            <Text style={styles.footerBrand}>QuickMaid Partner History</Text>
            <Text style={styles.footerSub}>Ratings boost priority · Raipur</Text>
          </View>
        </ScrollView>
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
    bottom: -10,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(110,231,183,0.14)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tabIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(217,119,6,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
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
  statBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(110,231,183,0.1)',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.22)',
  },
  statChip: { flex: 1, alignItems: 'center', gap: 1, minWidth: 0 },
  statNum: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    color: colors.white,
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 8,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
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
    height: 28,
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
  scroll: { paddingHorizontal: layout.pad, gap: spacing.md, paddingTop: spacing.xs },
  payoutStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  payoutIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payoutCopy: { flex: 1, gap: 2 },
  payoutTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  payoutSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },
  filterRow: { flexDirection: 'row', gap: spacing.sm },
  filterChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.08)',
    overflow: 'hidden',
  },
  filterChipOn: { borderColor: 'transparent' },
  filterText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted },
  filterTextOn: { color: colors.white, fontFamily: fonts.bold },
  list: { gap: spacing.sm },
  listHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  listTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  listCount: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
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
  emptyBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  emptyBtnText: { fontFamily: fonts.bold, fontSize: 13, color: colors.white },
  footer: { alignItems: 'center', paddingTop: spacing.xl, gap: 4 },
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
