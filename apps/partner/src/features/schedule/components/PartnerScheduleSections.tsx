import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PartnerJob } from '@/constants/demo';
import { usePartner } from '@/context/PartnerContext';
import { formatRs, netEarningPaise } from '@/features/home/lib/home.greeting';
import { PartnerSlotToggleCard } from '@/features/slots/components/PartnerSlotToggleCard';
import { resolvePreferredSlotIds, slotsSummaryLabel } from '@/features/slots/lib/slots.utils';
import { PartnerTrustStrip } from '@/features/home/components/PartnerHomeSections';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';
import { resetPartnerJobsToDemo } from '@/features/jobs/lib/jobs.storage';
import { usePartnerPreferences } from '@/features/settings/hooks/usePartnerPreferences';
import {
  PREFERRED_SLOTS,
  SCHEDULE_FAQ,
  SCHEDULE_HOW_STEPS,
  SCHEDULE_PAYOUT,
  SCHEDULE_SAFETY,
  SCHEDULE_TIPS,
  schedulePremium,
  WEEK_DAYS,
} from '@/features/schedule/constants/schedule.premium';
import { useOpenSupportChat } from '@/features/support/hooks/useOpenSupportChat';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

export function PartnerScheduleTodayBanner({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <View style={styles.todayBanner}>
      <View style={styles.todayIcon}>
        <Ionicons name="today" size={16} color={colors.primary} />
      </View>
      <View style={styles.todayCopy}>
        <Text style={styles.todayTitle}>
          {count} visit{count === 1 ? '' : 's'} today
        </Text>
        <Text style={styles.todaySub}>Reach 10 min early — call customer if delayed</Text>
      </View>
    </View>
  );
}

interface NextUpProps {
  job: PartnerJob;
}

export function PartnerScheduleNextUp({ job }: NextUpProps) {
  const router = useRouter();
  const net = netEarningPaise(job.amountPaise);
  const isLive = job.status === 'in_progress';

  return (
    <View style={styles.nextWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="Up next"
        title={isLive ? 'Visit in progress' : 'Your next visit'}
        subtitle="Fastest route from your work base"
        icon="flash-outline"
        compact
      />
      <Pressable
        style={styles.nextCard}
        onPress={() => router.push(`/job/${job.id}` as Href)}
      >
        <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={StyleSheet.absoluteFill} />
        <View style={styles.nextGlow} />
        <View style={styles.nextTop}>
          <View style={styles.nextBadge}>
            <Ionicons name={isLive ? 'play-circle' : 'calendar'} size={12} color={colors.partnerGold} />
            <Text style={styles.nextBadgeText}>{isLive ? 'LIVE NOW' : job.visitDate.toUpperCase()}</Text>
          </View>
          {job.distanceKm ? (
            <Text style={styles.nextDist}>{job.distanceKm} km away</Text>
          ) : null}
        </View>
        <Text style={styles.nextService}>{job.service}</Text>
        <Text style={styles.nextCustomer}>
          {job.customerName} · {job.slotLabel}
        </Text>
        <Text style={styles.nextAddress} numberOfLines={1}>{job.address}</Text>
        <View style={styles.nextFoot}>
          <View>
            <Text style={styles.nextEarnLabel}>You earn</Text>
            <Text style={styles.nextEarn}>{formatRs(net)}</Text>
          </View>
          <View style={styles.nextCta}>
            <Text style={styles.nextCtaText}>Open job</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.primaryDark} />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export function PartnerSchedulePreferredSlots() {
  const router = useRouter();
  const { profile } = usePartner();
  const activeIds = resolvePreferredSlotIds(profile);

  return (
    <View style={styles.slotsWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="Availability"
        title="Preferred slots"
        subtitle={slotsSummaryLabel(activeIds)}
        icon="time-outline"
        compact
      />
      <View style={styles.slotsList}>
        {PREFERRED_SLOTS.map((slot) => (
          <PartnerSlotToggleCard
            key={slot.id}
            slotId={slot.id}
            label={slot.label}
            sub={slot.sub}
            icon={slot.icon}
            peak={slot.peak}
            active={activeIds.includes(slot.id)}
          />
        ))}
      </View>
      <Pressable
        style={styles.slotEditBtn}
        onPress={() => {
          Haptics.selectionAsync();
          router.push('/slots' as Href);
        }}
      >
        <Ionicons name="options-outline" size={14} color={colors.primary} />
        <Text style={styles.slotEditText}>Choose your slots</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.mutedLight} />
      </Pressable>
    </View>
  );
}

export function PartnerScheduleWeekGlance({ dots }: { dots: boolean[] }) {
  return (
    <View style={styles.weekWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="Overview"
        title="Week at a glance"
        subtitle="Days with confirmed visits highlighted"
        icon="grid-outline"
        compact
      />
      <View style={styles.weekCard}>
        <View style={styles.weekRow}>
          {WEEK_DAYS.map((day, i) => (
            <View key={day} style={styles.weekCol}>
              <Text style={styles.weekDay}>{day}</Text>
              <View style={[styles.weekDot, dots[i] && styles.weekDotOn]}>
                {dots[i] ? <View style={styles.weekDotCore} /> : null}
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.weekHint}>Tap a visit card for maps, customer call & payout details</Text>
      </View>
    </View>
  );
}

interface WorkBaseProps {
  title: string;
  line: string;
}

export function PartnerScheduleWorkBase({ title, line }: WorkBaseProps) {
  const router = useRouter();

  return (
    <View style={styles.baseWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="Your base"
        title="Work address"
        subtitle="Travel estimates use this location"
        icon="home-outline"
        actionLabel="Edit"
        onAction={() => router.push('/(tabs)/profile' as Href)}
        compact
      />
      <Pressable
        style={styles.baseCard}
        onPress={() => {
          Haptics.selectionAsync();
          router.push('/(tabs)/profile' as Href);
        }}
      >
        <View style={styles.baseIcon}>
          <Ionicons name="location" size={16} color={colors.primaryDark} />
        </View>
        <View style={styles.baseCopy}>
          <Text style={styles.baseTitle}>{title}</Text>
          <Text style={styles.baseLine} numberOfLines={2}>{line}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
      </Pressable>
    </View>
  );
}

export function PartnerScheduleHowItWorks() {
  return (
    <View style={styles.howWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="How it works"
        title="From accept to payout"
        subtitle="Your schedule follows three simple steps"
        icon="git-network-outline"
        compact
      />
      <View style={styles.howList}>
        {SCHEDULE_HOW_STEPS.map((step, i) => (
          <View key={step.step} style={styles.howCard}>
            <LinearGradient colors={[...schedulePremium.tealGradient]} style={StyleSheet.absoluteFill} />
            <View style={styles.howStepCol}>
              <Text style={styles.howStep}>{step.step}</Text>
              {i < SCHEDULE_HOW_STEPS.length - 1 ? <View style={styles.howLine} /> : null}
            </View>
            <View style={styles.howIcon}>
              <Ionicons name={step.icon} size={18} color={colors.primary} />
            </View>
            <View style={styles.howCopy}>
              <Text style={styles.howTitle}>{step.title}</Text>
              <Text style={styles.howSub}>{step.sub}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function PartnerScheduleTips() {
  return (
    <View style={styles.tipsWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="Pro tips"
        title="Stay on schedule"
        icon="bulb-outline"
        compact
      />
      <View style={styles.tipsRow}>
        {SCHEDULE_TIPS.map((tip) => (
          <View key={tip.title} style={styles.tipCard}>
            <LinearGradient colors={[...schedulePremium.goldGradient]} style={StyleSheet.absoluteFill} />
            <Ionicons name={tip.icon} size={18} color={colors.partnerGold} />
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipSub}>{tip.sub}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function PartnerSchedulePerformance({ visitCount, onTimeRate }: { visitCount: number; onTimeRate: string }) {
  const stats = [
    { label: 'On-time', value: onTimeRate, icon: 'time-outline' as const, tint: colors.success },
    { label: 'This week', value: `${visitCount} visits`, icon: 'calendar-outline' as const, tint: colors.primary },
    { label: 'Rating', value: '4.9', icon: 'star-outline' as const, tint: colors.partnerGold },
  ];

  return (
    <View style={styles.perfWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="Your stats"
        title="Schedule performance"
        subtitle="On-time visits unlock more offers"
        icon="analytics-outline"
        compact
      />
      <View style={styles.perfRow}>
        {stats.map((s) => (
          <View key={s.label} style={styles.perfCard}>
            <View style={[styles.perfIcon, { backgroundColor: `${s.tint}14` }]}>
              <Ionicons name={s.icon} size={16} color={s.tint} />
            </View>
            <Text style={styles.perfValue}>{s.value}</Text>
            <Text style={styles.perfLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function PartnerScheduleFaq() {
  const router = useRouter();

  return (
    <View style={styles.faqWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="FAQ"
        title="Schedule questions"
        icon="help-circle-outline"
        actionLabel="Help"
        onAction={() => router.push('/(tabs)/help' as Href)}
        compact
      />
      <View style={styles.faqList}>
        {SCHEDULE_FAQ.map((item) => (
          <Pressable
            key={item.q}
            style={styles.faqCard}
            onPress={() => router.push('/(tabs)/help' as Href)}
          >
            <Text style={styles.faqQ}>{item.q}</Text>
            <Text style={styles.faqA} numberOfLines={2}>{item.a}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} style={styles.faqChev} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function PartnerScheduleEmpty({ zone }: { zone?: string }) {
  const router = useRouter();
  const { prefs } = usePartnerPreferences();
  const { refresh } = usePartnerJobs();
  const autoAssign = prefs.autoAssignOffers;

  const onReset = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await resetPartnerJobsToDemo();
    await refresh();
  };

  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Ionicons name="calendar-outline" size={32} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>No visits scheduled yet</Text>
      <Text style={styles.emptySub}>
        {autoAssign
          ? `Jobs tab par online karo — auto-assign har free slot mein ek visit confirm karega${zone ? ` (${zone})` : ''}.`
          : `Requests tab se Accept karo — confirmed visits yahan dikhengi${zone ? ` (${zone})` : ''}.`}
      </Text>
      <Pressable
        style={styles.emptyBtn}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push(autoAssign ? '/(tabs)' : '/(tabs)/requests');
        }}
      >
        <LinearGradient colors={['#084F4A', '#0B6E67']} style={StyleSheet.absoluteFill} />
        <Ionicons name={autoAssign ? 'flash-outline' : 'mail-open-outline'} size={16} color={colors.white} />
        <Text style={styles.emptyBtnText}>{autoAssign ? 'Go online on Jobs' : 'Open Requests'}</Text>
      </Pressable>
      <Pressable style={styles.emptyResetBtn} onPress={() => void onReset()}>
        <Text style={styles.emptyResetText}>Reset demo jobs</Text>
      </Pressable>
    </View>
  );
}

export function PartnerScheduleWeekEarningsCard({
  weekEarnings,
  visitCount,
  goalPct,
}: {
  weekEarnings: string;
  visitCount: number;
  goalPct: number;
}) {
  return (
    <View style={styles.earnWrap}>
      <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={styles.earnCard}>
        <View style={styles.earnGlow} />
        <View style={styles.earnTop}>
          <View>
            <Text style={styles.earnEyebrow}>THIS WEEK</Text>
            <Text style={styles.earnValue}>{weekEarnings}</Text>
            <Text style={styles.earnSub}>{visitCount} scheduled visit{visitCount === 1 ? '' : 's'}</Text>
          </View>
          <View style={styles.earnRing}>
            <Text style={styles.earnPct}>{goalPct}%</Text>
            <Text style={styles.earnGoal}>goal</Text>
          </View>
        </View>
        <View style={styles.earnTrack}>
          <View style={[styles.earnFill, { width: `${goalPct}%` }]} />
        </View>
        <Text style={styles.earnHint}>₹1,500 weekly target · payout every Monday</Text>
      </LinearGradient>
    </View>
  );
}

export function PartnerScheduleLiveBanner({ job }: { job: PartnerJob }) {
  const router = useRouter();

  return (
    <Pressable style={styles.liveBanner} onPress={() => router.push(`/job/${job.id}` as Href)}>
      <View style={styles.livePulse}>
        <View style={styles.liveDotAnim} />
      </View>
      <View style={styles.liveCopy}>
        <Text style={styles.liveTitle}>Visit in progress</Text>
        <Text style={styles.liveSub} numberOfLines={1}>
          {job.service} · {job.customerName}
        </Text>
      </View>
      <View style={styles.liveCta}>
        <Text style={styles.liveCtaText}>Open</Text>
        <Ionicons name="arrow-forward" size={12} color="#1570EF" />
      </View>
    </Pressable>
  );
}

export function PartnerSchedulePayoutStrip({ amount }: { amount: string }) {
  const router = useRouter();

  return (
    <Pressable style={styles.payoutStrip} onPress={() => router.push('/payout/upcoming' as Href)}>
      <View style={styles.payoutIcon}>
        <Ionicons name="wallet-outline" size={16} color={colors.partnerGold} />
      </View>
      <View style={styles.payoutCopy}>
        <Text style={styles.payoutTitle}>Next payout · {SCHEDULE_PAYOUT.day}</Text>
        <Text style={styles.payoutSub}>{SCHEDULE_PAYOUT.note}</Text>
      </View>
      <View style={styles.payoutAmtCol}>
        <Text style={styles.payoutAmt}>{amount}</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.mutedLight} />
      </View>
    </Pressable>
  );
}

export function PartnerScheduleCompletedPreview({ jobs }: { jobs: PartnerJob[] }) {
  const router = useRouter();
  if (jobs.length === 0) return null;

  return (
    <View style={styles.doneWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="History"
        title="Recently completed"
        subtitle="Payout included in next Monday batch"
        icon="ribbon-outline"
        actionLabel="View all"
        onAction={() => router.push('/job/history' as Href)}
        compact
      />
      <View style={styles.doneList}>
        {jobs.slice(0, 3).map((job) => (
          <Pressable
            key={job.id}
            style={styles.doneCard}
            onPress={() => router.push(`/job/${job.id}` as Href)}
          >
            <View style={styles.doneIcon}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            </View>
            <View style={styles.doneCopy}>
              <Text style={styles.doneTitle} numberOfLines={1}>{job.service}</Text>
              <Text style={styles.doneSub} numberOfLines={1}>
                {job.visitDate} · {job.customerName}
              </Text>
            </View>
            <Text style={styles.doneEarn}>{formatRs(netEarningPaise(job.amountPaise))}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function PartnerScheduleSafetyCard() {
  return (
    <View style={styles.safetyWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="Safety"
        title="Before every visit"
        icon="shield-half-outline"
        compact
      />
      <View style={styles.safetyCard}>
        {SCHEDULE_SAFETY.map((item) => (
          <View key={item.text} style={styles.safetyRow}>
            <Ionicons name={item.icon} size={14} color={colors.primary} />
            <Text style={styles.safetyText}>{item.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function PartnerScheduleSupportCard() {
  const openSupportChat = useOpenSupportChat();

  return (
    <View style={styles.supportWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="Need help?"
        title="Reschedule or issues"
        subtitle="Ops team replies in minutes"
        icon="headset-outline"
        compact
      />
      <Pressable
        style={styles.supportCard}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          openSupportChat({ topic: 'job', context: 'Schedule change or visit issue' });
        }}
      >
        <LinearGradient colors={[...schedulePremium.tealGradient]} style={StyleSheet.absoluteFill} />
        <View style={styles.supportIcon}>
          <Ionicons name="chatbubble-ellipses" size={20} color={colors.primaryDark} />
        </View>
        <View style={styles.supportCopy}>
          <Text style={styles.supportTitle}>Chat with partner support</Text>
          <Text style={styles.supportSub}>Late arrival, customer no-show, slot change</Text>
        </View>
        <Ionicons name="arrow-forward" size={16} color={colors.primaryDark} />
      </Pressable>
    </View>
  );
}

export function PartnerScheduleFilterEmpty({ filterLabel }: { filterLabel: string }) {
  return (
    <View style={styles.filterEmpty}>
      <Ionicons name="filter-outline" size={22} color={colors.muted} />
      <Text style={styles.filterEmptyTitle}>No {filterLabel.toLowerCase()} visits</Text>
      <Text style={styles.filterEmptySub}>Try another filter or accept more requests</Text>
    </View>
  );
}

export function PartnerScheduleTrustFooter() {
  return (
    <View style={styles.trustWrap}>
      <PartnerTrustStrip />
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerBrand}>QuickMaid Partner</Text>
        <Text style={styles.footerSub}>Premium dispatch · Raipur</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  todayBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  todayIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCopy: { flex: 1, gap: 2 },
  todayTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.primaryDark },
  todaySub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },

  nextWrap: { gap: spacing.sm },
  nextCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    overflow: 'hidden',
    gap: spacing.xs,
    ...shadow.md,
  },
  nextGlow: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(252,211,77,0.15)',
  },
  nextTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nextBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  nextBadgeText: { fontFamily: fonts.bold, fontSize: 9, color: colors.partnerGold, letterSpacing: 0.6 },
  nextDist: { fontFamily: fonts.semiBold, fontSize: 10, color: 'rgba(255,255,255,0.75)' },
  nextService: { fontFamily: fonts.extraBold, fontSize: 17, color: colors.white },
  nextCustomer: { fontFamily: fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  nextAddress: { fontFamily: fonts.regular, fontSize: 11, color: 'rgba(255,255,255,0.65)' },
  nextFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  nextEarnLabel: { fontFamily: fonts.medium, fontSize: 9, color: 'rgba(255,255,255,0.6)' },
  nextEarn: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.partnerGold },
  nextCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  nextCtaText: { fontFamily: fonts.bold, fontSize: 12, color: colors.primaryDark },

  slotsWrap: { gap: spacing.sm },
  slotsList: { gap: spacing.sm },
  slotEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  slotEditText: { flex: 1, fontFamily: fonts.semiBold, fontSize: 12, color: colors.primary },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.md,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  slotIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotCopy: { flex: 1, gap: 2 },
  slotLabel: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  slotSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  slotBadges: { alignItems: 'flex-end', gap: 4 },
  peakBadge: {
    backgroundColor: colors.partnerGoldBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  peakText: { fontFamily: fonts.bold, fontSize: 8, color: colors.warning, letterSpacing: 0.4 },
  onBadge: {
    backgroundColor: colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  onText: { fontFamily: fonts.bold, fontSize: 9, color: colors.success },

  weekWrap: { gap: spacing.sm },
  weekCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weekCol: { alignItems: 'center', gap: 6, flex: 1 },
  weekDay: { fontFamily: fonts.bold, fontSize: 9, color: colors.muted },
  weekDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDotOn: { backgroundColor: colors.primaryLight },
  weekDotCore: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  weekHint: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted, textAlign: 'center' },

  baseWrap: { gap: spacing.sm },
  baseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  baseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseCopy: { flex: 1, gap: 2 },
  baseTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  baseLine: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },

  howWrap: { gap: spacing.sm },
  howList: { gap: spacing.sm },
  howCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.md,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  howStepCol: { alignItems: 'center', width: 28 },
  howStep: { fontFamily: fonts.extraBold, fontSize: 11, color: colors.primary },
  howLine: { width: 1, flex: 1, minHeight: 12, backgroundColor: 'rgba(11,110,103,0.15)', marginTop: 4 },
  howIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  howCopy: { flex: 1, gap: 2 },
  howTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  howSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },

  tipsWrap: { gap: spacing.sm },
  tipsRow: { flexDirection: 'row', gap: spacing.sm },
  tipCard: {
    flex: 1,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.xs,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(217,119,6,0.1)',
    minWidth: 0,
  },
  tipTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.ink },
  tipSub: { fontFamily: fonts.regular, fontSize: 9, color: colors.muted, lineHeight: 13 },

  perfWrap: { gap: spacing.sm },
  perfRow: { flexDirection: 'row', gap: spacing.sm },
  perfCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  perfIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfValue: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.ink },
  perfLabel: { fontFamily: fonts.medium, fontSize: 9, color: colors.muted, textAlign: 'center' },

  faqWrap: { gap: spacing.sm },
  faqList: { gap: spacing.sm },
  faqCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    paddingRight: spacing.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  faqQ: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 4 },
  faqA: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },
  faqChev: { position: 'absolute', right: spacing.md, top: '50%', marginTop: -8 },

  emptyWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyTitle: { fontFamily: fonts.extraBold, fontSize: 17, color: colors.ink, textAlign: 'center' },
  emptySub: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, textAlign: 'center', lineHeight: 19 },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  emptyBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  emptyResetBtn: { marginTop: spacing.xs, paddingVertical: spacing.sm },
  emptyResetText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primary },

  earnWrap: {},
  earnCard: { borderRadius: radius.xxl, padding: spacing.lg, overflow: 'hidden', gap: spacing.sm, ...shadow.md },
  earnGlow: {
    position: 'absolute',
    right: -15,
    top: -15,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(252,211,77,0.18)',
  },
  earnTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  earnEyebrow: { fontFamily: fonts.bold, fontSize: 9, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.8 },
  earnValue: { fontFamily: fonts.extraBold, fontSize: 24, color: colors.white, letterSpacing: -0.5 },
  earnSub: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  earnRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(252,211,77,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  earnPct: { fontFamily: fonts.extraBold, fontSize: 13, color: colors.partnerGold },
  earnGoal: { fontFamily: fonts.medium, fontSize: 8, color: 'rgba(255,255,255,0.6)' },
  earnTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    overflow: 'hidden',
  },
  earnFill: { height: '100%', borderRadius: 3, backgroundColor: colors.partnerGold },
  earnHint: { fontFamily: fonts.regular, fontSize: 10, color: 'rgba(255,255,255,0.6)' },

  liveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#EEF6FF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(21,112,239,0.18)',
  },
  livePulse: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDotAnim: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1570EF' },
  liveCopy: { flex: 1, gap: 2, minWidth: 0 },
  liveTitle: { fontFamily: fonts.bold, fontSize: 13, color: '#175CD3' },
  liveSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  liveCta: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  liveCtaText: { fontFamily: fonts.bold, fontSize: 11, color: '#1570EF' },

  payoutStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  payoutIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.partnerGoldBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payoutCopy: { flex: 1, gap: 2, minWidth: 0 },
  payoutTitle: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  payoutSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted, lineHeight: 14 },
  payoutAmtCol: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  payoutAmt: { fontFamily: fonts.extraBold, fontSize: 13, color: colors.partnerGold },

  doneWrap: { gap: spacing.sm },
  doneList: { gap: spacing.sm },
  doneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  doneIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneCopy: { flex: 1, gap: 2, minWidth: 0 },
  doneTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  doneSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  doneEarn: { fontFamily: fonts.bold, fontSize: 12, color: colors.success },

  safetyWrap: { gap: spacing.sm },
  safetyCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  safetyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  safetyText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 17 },

  supportWrap: { gap: spacing.sm },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.md,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  supportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportCopy: { flex: 1, gap: 2 },
  supportTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  supportSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },

  filterEmpty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  filterEmptyTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  filterEmptySub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'center' },

  trustWrap: { gap: spacing.md, marginTop: spacing.sm },
  footer: { alignItems: 'center', gap: 4, paddingBottom: spacing.sm },
  footerLine: { width: 40, height: 3, borderRadius: 2, backgroundColor: colors.divider },
  footerBrand: { fontFamily: fonts.bold, fontSize: 11, color: colors.muted },
  footerSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.mutedLight },
});
