import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
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
import { DEMO_EARNINGS, WEEKLY_EARNING_GOAL_PAISE, type EarningRow, type PartnerJob } from '@/constants/demo';
import { usePartner } from '@/context/PartnerContext';
import { formatRs } from '@/features/home/lib/home.greeting';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';
import { EARNINGS_FILTERS } from '@/features/earnings/constants/earnings.premium';
import { PartnerEarningsActivityCard } from '@/features/earnings/components/PartnerEarningsActivityCard';
import { PartnerJobEarningFocusCard } from '@/features/earnings/components/PartnerJobEarningFocusCard';
import {
  PartnerEarningsBalanceCard,
  PartnerEarningsBreakdownCard,
  PartnerEarningsFilterEmpty,
  PartnerEarningsPendingCard,
  PartnerEarningsPayoutStrip,
  PartnerEarningsUpiCard,
} from '@/features/earnings/components/PartnerEarningsSections';
import {
  earningsCreditTotal,
  earningsFeeAmount,
  earningsFilterCount,
  earningsGrossFromNet,
  earningsWeekNet,
  filterEarnings,
  findEarningForJob,
  groupEarningsByDay,
  mergeEarningsLedger,
  nextPayoutEstimate,
  pendingFromJobs,
  scheduledEarnings,
  weekGoalPct,
  type EarningsFilter,
} from '@/features/earnings/lib/earnings.utils';
import { getPartnerJobById } from '@/features/jobs/lib/jobs.storage';
import { jobEarningsBreakdown } from '@/features/jobs/lib/job-detail.utils';
import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { useListPagination } from '@/hooks/useListPagination';
import { EARNINGS_PAGE_SIZE } from '@/lib/pagination';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const SHEET_OVERLAP = 14;
const SHEET_BG = '#EFF8F7';

export function PartnerEarningsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { jobId: jobIdParam } = useLocalSearchParams<{ jobId?: string | string[] }>();
  const jobId = typeof jobIdParam === 'string' ? jobIdParam : undefined;
  const { width } = useWindowDimensions();
  const compact = width < 360;
  const { tabScrollPad } = useLayoutMetrics();
  const { state, profile } = usePartner();
  const { jobs, refresh } = usePartnerJobs();

  const [filter, setFilter] = useState<EarningsFilter>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [focusJob, setFocusJob] = useState<PartnerJob | null>(null);

  useEffect(() => {
    if (!jobId) {
      setFocusJob(null);
      return;
    }
    void getPartnerJobById(jobId).then(setFocusJob);
  }, [jobId, jobs]);

  const ledger = useMemo(() => mergeEarningsLedger(DEMO_EARNINGS, jobs), [jobs]);

  const visitEarningRow = useMemo(
    () => (focusJob ? findEarningForJob(focusJob, ledger) : null),
    [focusJob, ledger],
  );
  const visitBreakdown = useMemo(
    () => (focusJob ? jobEarningsBreakdown(focusJob) : null),
    [focusJob],
  );
  const isVisitFocus = Boolean(focusJob && visitBreakdown);

  const filtered = useMemo(() => {
    if (isVisitFocus && visitEarningRow) return [visitEarningRow];
    return filterEarnings(ledger, filter);
  }, [filter, isVisitFocus, visitEarningRow, ledger]);
  const { visibleItems, hasMore, loadMore, showing } = useListPagination(
    filtered,
    EARNINGS_PAGE_SIZE,
    filter,
  );
  const grouped = useMemo(() => groupEarningsByDay(visibleItems), [visibleItems]);
  const creditTotal = useMemo(() => earningsCreditTotal(ledger), [ledger]);
  const weekNetPaise = useMemo(() => earningsWeekNet(ledger), [ledger]);
  const weekNet = useMemo(() => formatRs(weekNetPaise), [weekNetPaise]);
  const todayNet = useMemo(() => formatRs(state.todayEarningsPaise), [state.todayEarningsPaise]);
  const goalPct = useMemo(
    () => weekGoalPct(weekNetPaise, WEEKLY_EARNING_GOAL_PAISE),
    [weekNetPaise],
  );
  const grossPaise = useMemo(() => earningsGrossFromNet(creditTotal), [creditTotal]);
  const feePaise = useMemo(() => earningsFeeAmount(grossPaise), [grossPaise]);
  const pendingCompleted = useMemo(() => pendingFromJobs(jobs), [jobs]);
  const scheduled = useMemo(() => scheduledEarnings(jobs), [jobs]);
  const nextPayoutPaise = useMemo(
    () => nextPayoutEstimate(creditTotal, pendingCompleted),
    [creditTotal, pendingCompleted],
  );
  const activeFilter = EARNINGS_FILTERS.find((f) => f.id === filter);
  const kycVerified = profile?.kycStatus === 'verified';

  const clearVisitFocus = () => {
    router.replace('/(tabs)/earnings' as Href);
  };

  const openActivityRow = (row: EarningRow) => {
    if (row.kind === 'payout') {
      router.push(`/payout/${row.id}` as Href);
      return;
    }
    const job = jobs.find((j) => j.bookingRef === row.subtitle);
    if (job) {
      router.push({ pathname: '/(tabs)/earnings', params: { jobId: job.id } } as Href);
    }
  };

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
            <Ionicons name="wallet" size={18} color={colors.partnerGold} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>{isVisitFocus ? 'VISIT EARNING' : 'YOUR WALLET'}</Text>
            <Text style={styles.headerTitle}>{isVisitFocus ? 'This job' : 'Earnings'}</Text>
            <Text style={styles.headerSub} numberOfLines={2}>
              {isVisitFocus && focusJob
                ? `${focusJob.bookingRef} · ${focusJob.customerName}`
                : 'Credits, payouts & UPI · weekly Monday'}
            </Text>
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{isVisitFocus ? '1' : ledger.length}</Text>
          </View>
        </View>

        <View style={styles.statBar}>
          {isVisitFocus && visitBreakdown ? (
            <>
              <View style={styles.statChip}>
                <Text style={styles.statNum} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                  {formatRs(visitBreakdown.gross)}
                </Text>
                <Text style={styles.statLabel}>Gross</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statChip}>
                <Text style={styles.statNum}>{formatRs(visitBreakdown.fee)}</Text>
                <Text style={styles.statLabel}>Fee</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statChip}>
                <Text style={styles.statNum}>{formatRs(visitBreakdown.net)}</Text>
                <Text style={styles.statLabel}>Your net</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statChip}>
                <Text style={styles.statNum} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                  {weekNet}
                </Text>
                <Text style={styles.statLabel}>Week net</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statChip}>
                <Text style={styles.statNum}>{todayNet}</Text>
                <Text style={styles.statLabel}>Today</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statChip}>
                <Text style={styles.statNum}>{formatRs(nextPayoutPaise)}</Text>
                <Text style={styles.statLabel}>Next pay</Text>
              </View>
            </>
          )}
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
          contentContainerStyle={[styles.scroll, { paddingBottom: tabScrollPad }]}
        >
          {isVisitFocus && focusJob ? (
            <Animated.View entering={FadeInDown.duration(300)}>
              <PartnerJobEarningFocusCard job={focusJob} onViewAll={clearVisitFocus} />
            </Animated.View>
          ) : (
            <>
              <Animated.View entering={FadeInDown.duration(300)}>
                <PartnerEarningsBalanceCard
                  weekNet={weekNet}
                  todayNet={todayNet}
                  goalPct={goalPct}
                  pendingPayout={formatRs(nextPayoutPaise)}
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(80).duration(300)}>
                <PartnerEarningsPayoutStrip
                  nextAmount={formatRs(nextPayoutPaise)}
                  upiId={profile?.upiId}
                  kycVerified={kycVerified}
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(120).duration(300)}>
                <PartnerEarningsUpiCard upiId={profile?.upiId} />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(140).duration(300)}>
                <PartnerEarningsBreakdownCard
                  gross={formatRs(grossPaise)}
                  fee={formatRs(feePaise)}
                  net={formatRs(creditTotal)}
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(160).duration(300)}>
                <PartnerEarningsPendingCard
                  scheduled={formatRs(scheduled)}
                  completedPending={formatRs(pendingCompleted)}
                />
              </Animated.View>
            </>
          )}

          {!isVisitFocus ? (
          <View style={styles.filterSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterWrap}>
              {EARNINGS_FILTERS.map((f) => {
                const on = filter === f.id;
                const count = earningsFilterCount(ledger, f.id);
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
          ) : null}

          <Animated.View entering={FadeInDown.delay(180).duration(320)} style={styles.section}>
            <PartnerRequestsSectionHeader
              eyebrow="Ledger"
              title={isVisitFocus ? 'Visit credit' : 'Recent activity'}
              subtitle={
                isVisitFocus && focusJob
                  ? `${focusJob.bookingRef} · net ${formatRs(visitBreakdown?.net ?? 0)}`
                  : `${filtered.length} transaction${filtered.length === 1 ? '' : 's'} · ${activeFilter?.label ?? 'All'}`
              }
              icon="list-outline"
              compact
            />

            {filtered.length === 0 ? (
              <PartnerEarningsFilterEmpty
                filterLabel={activeFilter?.label ?? 'activity'}
                filter={filter}
              />
            ) : (
              <>
                <View style={styles.inboxHead}>
                  <Text style={styles.inboxTitle}>{filter === 'all' ? 'All' : activeFilter?.label}</Text>
                  <Text style={styles.inboxCount}>{filtered.length} rows</Text>
                </View>
                <View style={styles.groups}>
                  {grouped.map((group, gIdx) => (
                    <View key={group.label} style={styles.group}>
                      <View style={styles.groupHead}>
                        <View style={styles.groupDot} />
                        <Text style={styles.groupLabel}>{group.label}</Text>
                        <View style={styles.groupPill}>
                          <Text style={styles.groupCount}>{group.rows.length}</Text>
                        </View>
                      </View>
                      <View style={styles.groupList}>
                        {group.rows.map((row, rIdx) => (
                          <Animated.View
                            key={row.id}
                            entering={FadeInDown.delay(gIdx * 40 + rIdx * 30).duration(280)}
                          >
                            <PartnerEarningsActivityCard
                              row={row}
                              compact={compact}
                              highlighted={isVisitFocus}
                              onPress={() => openActivityRow(row)}
                            />
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
                  label="Load more activity"
                />
              </>
            )}
          </Animated.View>
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
  groupLabel: { fontFamily: fonts.bold, fontSize: 12, color: colors.inkSecondary, letterSpacing: 0.3 },
  groupPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  groupCount: { fontFamily: fonts.bold, fontSize: 10, color: colors.primaryDark },
  groupList: { gap: spacing.sm },
});
