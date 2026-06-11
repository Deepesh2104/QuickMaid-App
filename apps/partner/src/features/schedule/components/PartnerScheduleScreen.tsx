import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
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

import { ListPagination } from '@/components/ui/ListPagination';
import { usePartner } from '@/context/PartnerContext';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';
import { SCHEDULE_FILTERS } from '@/features/schedule/constants/schedule.premium';
import { PartnerScheduleVisitCard } from '@/features/schedule/components/PartnerScheduleVisitCard';
import {
  PartnerScheduleCompletedPreview,
  PartnerScheduleEmpty,
  PartnerScheduleFilterEmpty,
  PartnerScheduleLiveBanner,
  PartnerScheduleNextUp,
  PartnerSchedulePreferredSlots,
  PartnerScheduleTodayBanner,
  PartnerScheduleWeekGlance,
  PartnerScheduleWorkBase,
} from '@/features/schedule/components/PartnerScheduleSections';
import {
  filterScheduleJobs,
  groupScheduleBySlot,
  scheduleFilterCount,
  scheduleInProgressCount,
  scheduleNextJob,
  scheduleTodayCount,
  sortCompletedJobs,
  type ScheduleFilter,
  weekGlanceDots,
} from '@/features/schedule/lib/schedule.utils';
import { usePartnerWorkAddress } from '@/features/profile/hooks/usePartnerWorkAddress';
import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { useListPagination } from '@/hooks/useListPagination';
import { SCHEDULE_PAGE_SIZE } from '@/lib/pagination';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const SHEET_OVERLAP = 14;
const SHEET_BG = '#EFF8F7';

export function PartnerScheduleScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const compact = width < 360;
  const { tabScrollPad } = useLayoutMetrics();
  const { profile } = usePartner();
  const { workTitle, workLine } = usePartnerWorkAddress();
  const { active, completed, loading, refresh } = usePartnerJobs();

  const [filter, setFilter] = useState<ScheduleFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => filterScheduleJobs(active, filter), [active, filter]);
  const { visibleItems, hasMore, loadMore, showing } = useListPagination(
    filtered,
    SCHEDULE_PAGE_SIZE,
    filter,
  );
  const grouped = useMemo(() => groupScheduleBySlot(visibleItems), [visibleItems]);
  const todayCount = useMemo(() => scheduleTodayCount(active), [active]);
  const tomorrowCount = useMemo(
    () => active.filter((j) => j.visitDate === 'Tomorrow').length,
    [active],
  );
  const liveCount = useMemo(() => scheduleInProgressCount(active), [active]);
  const liveJob = useMemo(() => active.find((j) => j.status === 'in_progress') ?? null, [active]);
  const nextJob = useMemo(() => scheduleNextJob(filtered.length ? filtered : active), [filtered, active]);
  const weekDots = useMemo(() => weekGlanceDots(active), [active]);
  const recentCompleted = useMemo(() => sortCompletedJobs(completed), [completed]);
  const activeFilter = SCHEDULE_FILTERS.find((f) => f.id === filter);
  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
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
          <View style={styles.tabIcon}>
            <Ionicons name="calendar" size={18} color={colors.partnerGold} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>YOUR CALENDAR</Text>
            <Text style={styles.headerTitle}>Schedule</Text>
            <Text style={styles.headerSub}>
              {profile?.zone ?? 'Your zone'} · visits & slots
            </Text>
          </View>
          {active.length > 0 ? (
            <View style={styles.countPill}>
              <Text style={styles.countText}>{active.length}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.statBar}>
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{active.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{tomorrowCount}</Text>
            <Text style={styles.statLabel}>Tomorrow</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{liveCount || todayCount}</Text>
            <Text style={styles.statLabel}>{liveCount ? 'Live now' : 'Today'}</Text>
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

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.primary} />
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
            contentContainerStyle={[styles.scroll, { paddingBottom: tabScrollPad }]}
          >
            {liveJob ? (
              <Animated.View entering={FadeInDown.duration(300)}>
                <PartnerScheduleLiveBanner job={liveJob} />
              </Animated.View>
            ) : null}

            <Animated.View entering={FadeInDown.delay(40).duration(300)}>
              <PartnerScheduleTodayBanner count={todayCount} />
            </Animated.View>

            <View style={styles.filterSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterWrap}>
                {SCHEDULE_FILTERS.map((f) => {
                  const on = filter === f.id;
                  const count = scheduleFilterCount(active, f.id);
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
                      <Ionicons name={f.icon} size={14} color={on ? colors.white : colors.muted} />
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

            {nextJob ? (
              <Animated.View entering={FadeInDown.delay(120).duration(320)} style={styles.section}>
                <PartnerScheduleNextUp job={nextJob} />
              </Animated.View>
            ) : null}

            <Animated.View entering={FadeInDown.delay(140).duration(320)} style={styles.section}>
              <PartnerRequestsSectionHeader
                eyebrow="Visits"
                title={filtered.length ? 'Confirmed visits' : 'Your calendar'}
                subtitle={
                  filtered.length
                    ? `${filtered.length} visit${filtered.length === 1 ? '' : 's'} · ${activeFilter?.label ?? 'All'}`
                    : 'Accepted jobs appear here automatically'
                }
                icon="briefcase-outline"
                compact
              />

              {active.length === 0 ? (
                <PartnerScheduleEmpty zone={profile?.zone} />
              ) : filtered.length === 0 ? (
                <PartnerScheduleFilterEmpty filterLabel={activeFilter?.label ?? 'matching'} />
              ) : (
                <>
                  <View style={styles.inboxHead}>
                    <Text style={styles.inboxTitle}>{filter === 'all' ? 'Slot windows' : activeFilter?.label}</Text>
                    <Text style={styles.inboxCount}>{filtered.length} scheduled</Text>
                  </View>
                  <View style={styles.groups}>
                    {grouped.map((group, gIdx) => (
                      <View key={group.label} style={styles.group}>
                        <View style={styles.groupHead}>
                          <View style={styles.groupDot} />
                          <View style={styles.groupTitles}>
                            <Text style={styles.groupLabel}>{group.label}</Text>
                            <Text style={styles.groupSub}>{group.sub}</Text>
                          </View>
                          <View style={styles.groupPill}>
                            <Text style={styles.groupCount}>{group.jobs.length}</Text>
                          </View>
                        </View>
                        <View style={styles.groupList}>
                          {group.jobs.map((job, jIdx) => (
                            <Animated.View
                              key={job.id}
                              entering={FadeInDown.delay(gIdx * 40 + jIdx * 30).duration(280)}
                            >
                              <PartnerScheduleVisitCard job={job} compact={compact} />
                            </Animated.View>
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                  <ListPagination
                    showing={showing}
                    hasMore={hasMore}
                    onLoadMore={loadMore}
                    label="Load more visits"
                  />
                </>
              )}
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(180).duration(320)} style={styles.section}>
              <PartnerScheduleCompletedPreview jobs={recentCompleted} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).duration(320)} style={styles.section}>
              <PartnerSchedulePreferredSlots />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(220).duration(320)} style={styles.section}>
              <PartnerScheduleWeekGlance dots={weekDots} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(240).duration(320)} style={styles.section}>
              <PartnerScheduleWorkBase title={workTitle} line={workLine} />
            </Animated.View>
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
    bottom: -10,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(110,231,183,0.14)',
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
  countPill: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.partnerGold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginTop: 4,
  },
  countText: { fontFamily: fonts.bold, fontSize: 12, color: colors.white },
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
  statNum: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.white, textAlign: 'center' },
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
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxl },
  scroll: { paddingHorizontal: layout.pad, gap: spacing.lg, paddingTop: spacing.xs },
  section: { gap: spacing.sm },

  filterSection: { marginBottom: spacing.xs },
  filterWrap: { gap: spacing.sm, paddingVertical: spacing.xs },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.08)',
    overflow: 'hidden',
  },
  filterChipOn: { borderColor: 'transparent' },
  filterText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted },
  filterTextOn: { color: colors.white },
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

  inboxHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  inboxTitle: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  inboxCount: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.muted },

  groups: { gap: spacing.lg },
  group: { gap: spacing.sm },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  groupDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  groupTitles: { flex: 1, gap: 1 },
  groupLabel: { fontFamily: fonts.bold, fontSize: 12, color: colors.inkSecondary, letterSpacing: 0.3 },
  groupSub: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  groupPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  groupCount: { fontFamily: fonts.bold, fontSize: 10, color: colors.primaryDark },
  groupList: { gap: spacing.sm },
});
