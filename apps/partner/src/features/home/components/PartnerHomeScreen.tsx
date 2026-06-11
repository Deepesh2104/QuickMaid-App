import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { usePartner } from '@/context/PartnerContext';
import { PartnerWorkAddressSheet } from '@/features/profile/components/PartnerWorkAddressSheet';
import { usePartnerWorkAddress } from '@/features/profile/hooks/usePartnerWorkAddress';
import { PartnerActiveJobBanner } from '@/features/home/components/PartnerActiveJobBanner';
import { PartnerEarningsHero } from '@/features/home/components/PartnerEarningsHero';
import { PartnerHomeHeader } from '@/features/home/components/PartnerHomeHeader';
import { PartnerSectionHeader } from '@/features/home/components/PartnerHomeSections';
import { PartnerRequestsPreview } from '@/features/home/components/PartnerRequestsPreview';
import {
  PartnerDualRoleCard,
  PartnerHomeCompletedStrip,
  PartnerKycBannerPressable,
  PartnerSkillsRow,
  PartnerTodayTimeline,
  PartnerWeeklyGoal,
  PartnerZoneStrip,
} from '@/features/home/components/PartnerHomeWidgets';
import { HOME_PREMIUM } from '@/features/home/constants/home.premium';
import { formatRs } from '@/features/home/lib/home.greeting';
import { PartnerRequestsOnlineBanner } from '@/features/jobs/components/PartnerRequestsSections';
import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';
import { PartnerScheduleVisitCard } from '@/features/schedule/components/PartnerScheduleVisitCard';
import { scheduleInProgressCount } from '@/features/schedule/lib/schedule.utils';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useOpenNotifications } from '@/features/notifications/hooks/useOpenNotifications';
import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const SHEET_OVERLAP = 14;

export function PartnerHomeScreen() {
  const { insets, tabScrollPad } = useLayoutMetrics();
  const router = useRouter();
  const { profile, state, setOnline, refresh, loading } = usePartner();
  const { pending, active, completed, refresh: refreshJobs } = usePartnerJobs();
  const { unreadCount } = useNotifications();
  const openNotifications = useOpenNotifications();
  const {
    addresses,
    defaultAddress,
    workTitle,
    workLine,
    selectAddress,
    saveAddress,
  } = usePartnerWorkAddress();
  const [refreshing, setRefreshing] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);

  const todayJobs = useMemo(
    () => [...pending, ...active].filter((j) => j.visitDate === 'Today'),
    [pending, active],
  );
  const liveJob = useMemo(() => active.find((j) => j.status === 'in_progress') ?? null, [active]);
  const primaryActive = liveJob ?? active[0];
  const liveCount = useMemo(() => scheduleInProgressCount(active), [active]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refresh(), refreshJobs()]);
    setRefreshing(false);
  }, [refresh, refreshJobs]);

  return (
    <View style={styles.root}>
      <PartnerHomeHeader
        paddingTop={insets.top}
        profile={profile}
        unreadCount={unreadCount}
        workTitle={workTitle}
        workLine={workLine}
        openCount={pending.length}
        todayCount={todayJobs.length}
        earningsLabel={formatRs(state.todayEarningsPaise)}
        onNotificationsPress={openNotifications}
        onWorkAddressPress={() => setAddressOpen(true)}
      />

      <View style={styles.sheet}>
        <LinearGradient
          colors={['rgba(230,244,242,0.95)', HOME_PREMIUM.sheetBg]}
          style={styles.sheetTopFade}
          pointerEvents="none"
        />
        <View style={styles.sheetHandle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces
          refreshControl={
            <RefreshControl
              refreshing={refreshing || loading}
              onRefresh={() => void onRefresh()}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          contentContainerStyle={[styles.scroll, { paddingBottom: tabScrollPad }]}
        >
          <Animated.View entering={FadeInDown.duration(300)}>
            <PartnerRequestsOnlineBanner
              isOnline={state.isOnline}
              onToggle={(v) => void setOnline(v)}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(40).duration(320)}>
            <PartnerEarningsHero state={state} />
          </Animated.View>

          {liveCount > 0 && liveJob ? (
            <Animated.View entering={FadeInDown.delay(60).duration(320)}>
              <PartnerActiveJobBanner job={liveJob} />
            </Animated.View>
          ) : primaryActive && !liveJob ? (
            <Animated.View entering={FadeInDown.delay(60).duration(320)}>
              <PartnerActiveJobBanner job={primaryActive} />
            </Animated.View>
          ) : null}

          <Animated.View entering={FadeInDown.delay(80).duration(320)}>
            <PartnerRequestsPreview
              pending={pending}
              isOnline={state.isOnline}
              zone={profile?.zone}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(320)}>
            <PartnerTodayTimeline jobs={todayJobs} />
          </Animated.View>

          {active.length > 1 ? (
            <Animated.View entering={FadeInDown.delay(120).duration(320)} style={styles.section}>
              <PartnerSectionHeader
                title="More active visits"
                count={active.length - 1}
                accent={colors.primary}
              />
              <View style={styles.list}>
                {active.slice(1, 4).map((job) => (
                  <PartnerScheduleVisitCard key={job.id} job={job} compact />
                ))}
              </View>
            </Animated.View>
          ) : null}

          <Animated.View entering={FadeInDown.delay(140).duration(320)}>
            <PartnerZoneStrip zone={profile?.zone} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(160).duration(320)}>
            <PartnerWeeklyGoal />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(170).duration(320)}>
            <PartnerSkillsRow skills={profile?.skills} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(180).duration(320)}>
            <PartnerKycBannerPressable profile={profile} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(320)}>
            <PartnerHomeCompletedStrip jobs={completed} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(220).duration(320)}>
            <PartnerDualRoleCard />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(240).duration(320)}>
            <Pressable
              style={styles.helpStrip}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/(tabs)/help' as Href);
              }}
            >
              <View style={styles.helpIcon}>
                <Ionicons name="chatbubbles-outline" size={16} color={colors.primaryDark} />
              </View>
              <View style={styles.helpCopy}>
                <Text style={styles.helpTitle}>Need help with jobs or payouts?</Text>
                <Text style={styles.helpSub}>FAQ, live chat & call support in Help tab</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
            </Pressable>
          </Animated.View>
        </ScrollView>
      </View>

      <PartnerWorkAddressSheet
        visible={addressOpen}
        addresses={addresses}
        activeId={defaultAddress?.id}
        onClose={() => setAddressOpen(false)}
        onSelect={(addr) => void selectAddress(addr)}
        onSave={(addr) => void saveAddress(addr)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primaryDark },
  sheet: {
    flex: 1,
    marginTop: -SHEET_OVERLAP,
    backgroundColor: HOME_PREMIUM.sheetBg,
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
  scroll: {
    paddingHorizontal: layout.pad,
    gap: spacing.lg,
    paddingTop: spacing.xs,
  },
  section: { gap: spacing.sm },
  list: { gap: spacing.md },
  helpStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    marginBottom: spacing.sm,
  },
  helpIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpCopy: { flex: 1, gap: 2 },
  helpTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  helpSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },
});
