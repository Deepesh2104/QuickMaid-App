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



import { ListPagination } from '@/components/ui/ListPagination';
import type { PartnerJob } from '@/constants/demo';
import { usePartner } from '@/context/PartnerContext';

import { formatRs, netEarningPaise } from '@/features/home/lib/home.greeting';

import { REQUEST_FILTERS } from '@/features/jobs/constants/requests.premium';

import { PartnerAutoAssignBanner } from '@/features/jobs/components/PartnerAutoAssignBanner';
import { PartnerJobAcceptedModal } from '@/features/jobs/components/PartnerJobAcceptedModal';
import { PartnerJobDeclineModal } from '@/features/jobs/components/PartnerJobDeclineModal';
import { PartnerRequestCard } from '@/features/jobs/components/PartnerRequestCard';

import {

  PartnerRequestsEmptyPremium,

  PartnerRequestsBestMatch,

  PartnerRequestsHelpStrip,

  PartnerRequestsHowItWorks,

  PartnerRequestsOnlineBanner,

  PartnerRequestsSectionHeader,

} from '@/features/jobs/components/PartnerRequestsSections';

import { usePartnerAlert } from '@/context/PartnerAlertContext';
import type { DeclineReasonId } from '@/features/jobs/constants/decline.premium';
import { passedToNextPartnerMessage } from '@/features/jobs/lib/decline.utils';
import { useDispatchAssign } from '@/features/jobs/context/DispatchAssignContext';
import { acceptBlockedMessage } from '@/features/kyc/lib/kyc.routing';
import { usePartnerDispatch } from '@/features/jobs/hooks/usePartnerDispatch';
import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';
import { usePartnerI18n } from '@/i18n/usePartnerI18n';
import { useDispatchInboxAlerts } from '@/features/jobs/hooks/useDispatchInboxAlerts';
import { buildManualOffers } from '@/features/jobs/lib/dispatch.utils';
import { OFFER_WINDOW_LABEL_MINUTES } from '@/features/jobs/lib/offer-expiry.utils';
import { hasManualTestJobs, manualTestHint } from '@/features/jobs/lib/manual-test.utils';
import { resetAcceptDeclineTestJobs, resetPartnerJobsToDemo } from '@/features/jobs/lib/jobs.storage';
import { JobListSkeleton } from '@/components/ui/Skeleton';
import { usePartnerPreferences } from '@/features/settings/hooks/usePartnerPreferences';

import {

  filterCount,

  filterPendingJobs,

  getBestMatchJob,

  groupPendingByVisit,

  type RequestFilter,

} from '@/features/jobs/lib/requests.utils';

import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { useListPagination } from '@/hooks/useListPagination';
import { REQUESTS_PAGE_SIZE } from '@/lib/pagination';

import { fonts } from '@/theme/fonts';

import { colors } from '@/theme/colors';

import { layout, radius, spacing } from '@/theme/spacing';



interface PartnerRequestsScreenProps {

  variant?: 'tab' | 'stack';

}



export function PartnerRequestsScreen({ variant = 'stack' }: PartnerRequestsScreenProps) {

  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { width } = useWindowDimensions();

  const compact = width < 360;

  const { tabScrollPad } = useLayoutMetrics();

  const { profile, state, setOnline } = usePartner();
  const { alert } = usePartnerAlert();

  const { pending, active, loading, refresh, acceptJob, declineJob, canAcceptJobs } = usePartnerJobs();
  const { t } = usePartnerI18n();
  const { prefs } = usePartnerPreferences();
  const { offers, primaryOffer, moreOffers, offerCount } = usePartnerDispatch(
    pending,
    active,
    profile,
    state.isOnline,
  );
  const {
    lastAssigned,
    bannerMinimized,
    minimizeBanner,
    expandBanner,
    dismiss: dismissAssign,
  } = useDispatchAssign();
  const manualMode = !prefs.autoAssignOffers;
  useDispatchInboxAlerts(manualMode && state.isOnline);
  const manualOffers = useMemo(
    () => buildManualOffers(pending, profile, state.isOnline),
    [pending, profile, state.isOnline],
  );
  const bestMatch = useMemo(
    () =>
      manualMode && state.isOnline && manualOffers.length > 0
        ? getBestMatchJob(manualOffers, profile, state.isOnline, active)
        : null,
    [manualMode, state.isOnline, manualOffers, profile, active],
  );
  const manualInboxOffers = useMemo(
    () => (bestMatch ? manualOffers.filter((j) => j.id !== bestMatch.id) : manualOffers),
    [manualOffers, bestMatch],
  );
  const inboxOffers = manualMode ? manualOffers : offers;
  const inboxCount = manualMode ? manualOffers.length : offerCount;

  const isTab = variant === 'tab';

  const bottomPad = isTab ? tabScrollPad : insets.bottom + spacing.xl;

  const [filter, setFilter] = useState<RequestFilter>('all');

  const [refreshing, setRefreshing] = useState(false);

  const [acceptedJob, setAcceptedJob] = useState<PartnerJob | null>(null);
  const [declineTarget, setDeclineTarget] = useState<{ id: string; ref: string } | null>(null);
  const [declining, setDeclining] = useState(false);
  const [resetting, setResetting] = useState(false);

  const dispatchPool = useMemo(
    () => (manualMode ? manualInboxOffers : moreOffers.map((o) => o as PartnerJob)),
    [manualMode, manualInboxOffers, moreOffers],
  );
  const filtered = useMemo(() => filterPendingJobs(dispatchPool, filter), [dispatchPool, filter]);

  const { visibleItems, hasMore, loadMore, showing } = useListPagination(
    filtered,
    REQUESTS_PAGE_SIZE,
    filter,
  );

  const grouped = useMemo(() => groupPendingByVisit(visibleItems), [visibleItems]);

  const totalEarnings = useMemo(
    () => inboxOffers.reduce((sum, j) => sum + netEarningPaise(j.amountPaise), 0),
    [inboxOffers],
  );

  const nearestKm = useMemo(() => {
    const distances = inboxOffers.map((j) => j.distanceKm).filter((d): d is number => d != null);
    return distances.length ? Math.min(...distances) : null;
  }, [inboxOffers]);



  const activeFilter = REQUEST_FILTERS.find((f) => f.id === filter);



  const onRefresh = async () => {

    setRefreshing(true);

    await refresh();

    setRefreshing(false);

  };

  const onResetDemo = async () => {
    setRefreshing(true);
    await resetPartnerJobsToDemo();
    await refresh();
    setRefreshing(false);
  };

  const onResetTest = async () => {
    setResetting(true);
    await resetAcceptDeclineTestJobs();
    await refresh();
    setResetting(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const onAccept = async (job: PartnerJob) => {
    if (!canAcceptJobs) {
      alert({
        title: t('kycBlockTitle'),
        message: acceptBlockedMessage(profile?.kycStatus),
        variant: 'warning',
        icon: 'shield-outline',
        buttons: [
          { text: 'Later', style: 'cancel' },
          { text: 'Open KYC', onPress: () => router.push('/kyc' as Href) },
        ],
      });
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const updated = await acceptJob(job.id);
    if (updated) setAcceptedJob(updated);
  };



  const onDecline = (id: string, ref: string) => {
    Haptics.selectionAsync();
    setDeclineTarget({ id, ref });
  };

  const confirmDecline = async (reasonId: DeclineReasonId) => {
    if (!declineTarget) return;
    setDeclining(true);
    const updated = await declineJob(declineTarget.id, reasonId);
    setDeclining(false);
    setDeclineTarget(null);
    if (updated) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      alert({
        title: 'Job agle partner ko gayi',
        message: passedToNextPartnerMessage(updated),
        variant: 'info',
        icon: 'swap-horizontal-outline',
      });
    }
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
          {isTab ? (
            <View style={styles.tabIcon}>
              <Ionicons name="mail-open" size={18} color={colors.partnerGold} />
            </View>
          ) : (
            <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </Pressable>
          )}
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>{manualMode ? 'MANUAL' : 'DISPATCH'}</Text>
            <Text style={styles.headerTitle}>{manualMode ? 'Job requests' : 'Job offers'}</Text>
            <Text style={styles.headerSub}>
              {manualMode
                ? state.isOnline
                  ? `Accept ya Decline · ${OFFER_WINDOW_LABEL_MINUTES}m window`
                  : 'Online karo offers ke liye'
                : state.isOnline
                  ? 'Slot + zone match'
                  : 'Go live for offers'}{' '}
              · {profile?.zone ?? 'Your zone'}
              {nearestKm != null ? ` · ${nearestKm} km nearest` : ''}
            </Text>
          </View>
          {inboxCount > 0 ? (
            <View style={styles.livePill}>
              <Text style={styles.liveText}>{inboxCount}</Text>
            </View>
          ) : manualMode ? (
            <Pressable
              style={styles.resetHeadBtn}
              onPress={() => void onResetTest()}
              disabled={resetting}
            >
              <Ionicons name="refresh" size={14} color={colors.white} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.statBar}>
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{inboxCount}</Text>
            <Text style={styles.statLabel}>{manualMode ? 'Requests' : 'Offers'}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{formatRs(totalEarnings)}</Text>
            <Text style={styles.statLabel}>Potential</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{active.length}</Text>
            <Text style={styles.statLabel}>Accepted</Text>
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
          <JobListSkeleton count={4} />
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

            contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}

          >

            <Animated.View entering={FadeInDown.duration(320)}>

              <PartnerRequestsOnlineBanner

                isOnline={state.isOnline}

                autoAssign={prefs.autoAssignOffers}

                onToggle={(v) => void setOnline(v)}

              />

            {!manualMode && lastAssigned ? (
              <PartnerAutoAssignBanner
                job={lastAssigned}
                minimized={bannerMinimized}
                onMinimize={minimizeBanner}
                onExpand={expandBanner}
                onDismiss={dismissAssign}
              />
            ) : null}

            </Animated.View>

            {manualMode && hasManualTestJobs(manualOffers) ? (
              <Animated.View entering={FadeInDown.delay(40).duration(300)} style={styles.testBanner}>
                <Text style={styles.testBannerText}>
                  1) <Text style={styles.testBold}>MANUAL</Text> → Accept → Schedule{'\n'}
                  2) <Text style={styles.testBold}>DECLINE TEST</Text> → Decline → alert
                </Text>
                <Pressable
                  style={styles.testResetBtn}
                  onPress={() => void onResetTest()}
                  disabled={resetting}
                >
                  <Text style={styles.testResetText}>{resetting ? '...' : 'Reset test'}</Text>
                </Pressable>
              </Animated.View>
            ) : null}

            {!manualMode ? (
              <Animated.View entering={FadeInDown.delay(30).duration(300)} style={styles.autoModeCard}>
                <Ionicons name="flash" size={20} color={colors.partnerGold} />
                <View style={styles.autoModeCopy}>
                  <Text style={styles.autoModeTitle}>Auto-assign ON</Text>
                  <Text style={styles.autoModeSub}>
                    Offers yahan nahi aati — Settings se OFF karo ya Schedule tab kholo. Match hote hi
                    auto-accept.
                  </Text>
                </View>
                <Pressable
                  style={styles.autoModeBtn}
                  onPress={() => router.push('/(tabs)/schedule' as Href)}
                >
                  <Text style={styles.autoModeBtnText}>Schedule</Text>
                </Pressable>
              </Animated.View>
            ) : null}

            {manualMode ? (
            <>
            {bestMatch ? (
              <Animated.View entering={FadeInDown.delay(20).duration(300)}>
                <PartnerRequestsBestMatch
                  job={bestMatch}
                  onAccept={() => void onAccept(bestMatch)}
                  onOpen={() => router.push(`/job/${bestMatch.id}` as Href)}
                />
              </Animated.View>
            ) : null}

            <View style={styles.filterSection}>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterWrap}>

                {REQUEST_FILTERS.map((f) => {

                  const on = filter === f.id;

                  const count = filterCount(dispatchPool, f.id);

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

                      <Ionicons

                        name={f.icon}

                        size={14}

                        color={on ? colors.white : colors.muted}

                      />

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



            {filtered.length === 0 && (manualMode ? manualOffers.length === 0 : !primaryOffer) ? (
              <PartnerRequestsEmptyPremium
                isOnline={state.isOnline}
                zone={profile?.zone}
                filterLabel={filter !== 'all' ? activeFilter?.label : undefined}
                slotsMismatch={
                  state.isOnline &&
                  pending.length > 0 &&
                  (manualMode ? manualOffers.length === 0 : offerCount === 0)
                }
                onResetDemo={() => void (manualMode ? onResetTest() : onResetDemo())}
              />
            ) : filtered.length > 0 ? (

              <>

                <View style={styles.inboxHead}>
                  <Text style={styles.inboxTitle}>
                    {filter === 'all' ? (manualMode ? 'All requests' : 'More offers') : activeFilter?.label}
                  </Text>
                  <Text style={styles.inboxCount}>
                    {filtered.length} waiting · {OFFER_WINDOW_LABEL_MINUTES}m demo ·{' '}
                    {manualMode ? 'Decline → next partner' : 'slot matched'}
                  </Text>
                </View>



                <View style={styles.inboxList}>

                  {grouped.map((group) => (

                    <View key={group.label} style={styles.group}>

                      <View style={styles.groupHead}>

                        <View style={styles.groupDot} />

                        <Text style={styles.groupLabel}>{group.label}</Text>

                        <View style={styles.groupCount}>

                          <Text style={styles.groupCountText}>{group.jobs.length}</Text>

                        </View>

                      </View>

                      <View style={styles.groupList}>

                        {group.jobs.map((job) => {
                          const hint = manualMode ? manualTestHint(job) : null;
                          return (
                            <View key={job.id}>
                              {hint ? <Text style={styles.cardHint}>{hint}</Text> : null}
                              <PartnerRequestCard
                                job={job}
                                dense
                                showOfferTimer={manualMode}
                                onAccept={() => void onAccept(job)}
                                onDecline={() => onDecline(job.id, job.bookingRef)}
                              />
                            </View>
                          );
                        })}

                      </View>

                    </View>

                  ))}

                </View>

                <ListPagination
                  showing={showing}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                  label="Load more requests"
                />

              </>

            ) : null}

            {manualMode && manualOffers.length > 0 ? (
              <Animated.View entering={FadeInDown.delay(120).duration(320)}>
                <PartnerRequestsHowItWorks />
              </Animated.View>
            ) : null}

            </>
            ) : null}



            <Animated.View entering={FadeInDown.delay(140).duration(360)}>
              <PartnerRequestsHelpStrip />
            </Animated.View>

          </ScrollView>

        )}

      </View>



      <PartnerJobAcceptedModal
        visible={acceptedJob != null}
        job={acceptedJob}
        onClose={() => setAcceptedJob(null)}
        onViewSchedule={() => {
          setAcceptedJob(null);
          router.push('/(tabs)/schedule' as Href);
        }}
      />

      <PartnerJobDeclineModal
        visible={declineTarget != null}
        bookingRef={declineTarget?.ref ?? ''}
        loading={declining}
        onClose={() => {
          if (!declining) setDeclineTarget(null);
        }}
        onConfirm={(reasonId) => void confirmDecline(reasonId)}
      />
    </View>

  );

}



const SHEET_OVERLAP = 14;
const SHEET_BG = '#EFF8F7';



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
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(217,119,6,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1, gap: 1 },
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
  livePill: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.partnerGold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  liveText: { fontFamily: fonts.bold, fontSize: 12, color: colors.white },
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

  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  scroll: { paddingHorizontal: layout.pad, paddingTop: spacing.sm },

  filterSection: { marginBottom: spacing.lg, marginHorizontal: -layout.pad },

  filterWrap: { paddingHorizontal: layout.pad, gap: spacing.sm },

  filterChip: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 6,

    paddingHorizontal: 14,

    paddingVertical: 10,

    borderRadius: radius.pill,

    backgroundColor: colors.white,

    borderWidth: StyleSheet.hairlineWidth,

    borderColor: colors.border,

    overflow: 'hidden',

  },

  filterChipOn: { borderColor: colors.primary },

  filterText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.muted },

  filterTextOn: { color: colors.white },

  filterBadge: {

    minWidth: 18,

    height: 18,

    borderRadius: 9,

    backgroundColor: colors.bgMuted,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 5,

  },

  filterBadgeOn: { backgroundColor: 'rgba(255,255,255,0.25)' },

  filterBadgeText: { fontFamily: fonts.bold, fontSize: 10, color: colors.muted },

  filterBadgeTextOn: { color: colors.white },

  inboxHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  inboxTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  inboxCount: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted },
  inboxList: { marginBottom: spacing.lg, gap: spacing.md },

  group: { gap: spacing.sm },

  groupHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },

  groupDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.partnerGold },

  groupLabel: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, letterSpacing: 0.2 },

  groupCount: {

    backgroundColor: colors.partnerGoldBg,

    paddingHorizontal: 8,

    paddingVertical: 2,

    borderRadius: radius.pill,

  },

  groupCountText: { fontFamily: fonts.bold, fontSize: 10, color: colors.partnerGold },

  groupList: { gap: spacing.sm },

  resetHeadBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(217,119,6,0.2)',
  },
  autoModeCopy: { flex: 1, gap: 2 },
  autoModeTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  autoModeSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },
  autoModeBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  autoModeBtnText: { fontFamily: fonts.bold, fontSize: 11, color: colors.primaryDark },
  testBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: radius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.35)',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  testBannerText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.inkSecondary,
    lineHeight: 17,
  },
  testBold: { fontFamily: fonts.bold, color: colors.ink },
  testResetBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  testResetText: { fontFamily: fonts.bold, fontSize: 11, color: colors.primaryDark },
  cardHint: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.primaryDark,
    marginBottom: 4,
  },

});


