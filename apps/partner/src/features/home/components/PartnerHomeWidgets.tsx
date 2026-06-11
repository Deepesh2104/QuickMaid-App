import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PartnerProfile } from '@/constants/app';
import { usePartner } from '@/context/PartnerContext';
import { PREFERRED_SLOTS } from '@/features/slots/constants/slots.premium';
import { resolvePreferredSlotIds } from '@/features/slots/lib/slots.utils';
import {
  DEMO_EARNINGS,
  WEEKLY_EARNING_GOAL_PAISE,
  ZONE_DEMAND_LABEL,
  type PartnerJob,
} from '@/constants/demo';
import { earningsWeekNet, mergeEarningsLedger } from '@/features/earnings/lib/earnings.utils';
import { formatRs } from '@/features/home/lib/home.greeting';
import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';
import { PartnerJobHistoryCard } from '@/features/jobs/components/PartnerJobHistoryCard';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

export function PartnerZoneStrip({ zone }: { zone?: string }) {
  const z = zone ?? 'Shankar Nagar';
  const demand = ZONE_DEMAND_LABEL[z] ?? { level: 'medium' as const, jobs: 5 };
  const demandColor =
    demand.level === 'high' ? colors.success : demand.level === 'medium' ? colors.partnerGold : colors.muted;
  const demandLabel = demand.level === 'high' ? 'High demand' : demand.level === 'medium' ? 'Steady demand' : 'Quiet today';

  return (
    <View style={styles.zone}>
      <LinearGradient colors={['#FFFFFF', '#F4FBFA']} style={StyleSheet.absoluteFill} />
      <View style={styles.zoneIcon}>
        <LinearGradient colors={['#E6F4F2', '#D4EDE9']} style={StyleSheet.absoluteFill} />
        <Ionicons name="map" size={18} color={colors.primary} />
      </View>
      <View style={styles.zoneCopy}>
        <Text style={styles.zoneTitle}>Your zone · {z}</Text>
        <Text style={styles.zoneSub}>{demand.jobs} open requests nearby today</Text>
      </View>
      <View style={[styles.demandPill, { backgroundColor: `${demandColor}18` }]}>
        <View style={[styles.demandDot, { backgroundColor: demandColor }]} />
        <Text style={[styles.demandText, { color: demandColor }]}>{demandLabel}</Text>
      </View>
    </View>
  );
}

export function PartnerWeeklyGoal() {
  const { jobs } = usePartnerJobs();
  const ledger = useMemo(() => mergeEarningsLedger(DEMO_EARNINGS, jobs), [jobs]);
  const weekCredits = earningsWeekNet(ledger);
  const pct = Math.min(100, Math.round((weekCredits / WEEKLY_EARNING_GOAL_PAISE) * 100));

  return (
    <View style={styles.goal}>
      <LinearGradient colors={['#FFFFFF', '#FAFCFB']} style={StyleSheet.absoluteFill} />
      <View style={styles.goalHead}>
        <View style={styles.goalTitleRow}>
          <Ionicons name="trophy-outline" size={14} color={colors.partnerGold} />
          <Text style={styles.goalTitle}>Weekly target</Text>
        </View>
        <Text style={styles.goalAmt}>
          {formatRs(weekCredits)} / {formatRs(WEEKLY_EARNING_GOAL_PAISE)}
        </Text>
      </View>
      <View style={styles.goalTrack}>
        <LinearGradient
          colors={['#084F4A', '#0B6E67', '#12A598']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.goalFill, { width: `${Math.max(pct, 4)}%` }]}
        />
      </View>
      <Text style={styles.goalSub}>{pct}% of ₹1,500 weekly goal · Payout every Monday</Text>
    </View>
  );
}

export function PartnerTodayTimeline({ jobs }: { jobs: PartnerJob[] }) {
  const router = useRouter();

  if (jobs.length === 0) {
    return (
      <View style={styles.timelineEmpty}>
        <LinearGradient colors={['#FFFFFF', '#EFF8F7']} style={StyleSheet.absoluteFill} />
        <View style={styles.timelineEmptyIcon}>
          <Ionicons name="calendar-outline" size={22} color={colors.primary} />
        </View>
        <Text style={styles.timelineEmptyTitle}>No visits today</Text>
        <Text style={styles.timelineEmptySub}>
          Accept a job from Requests — today&apos;s schedule shows up here
        </Text>
        <Pressable
          style={styles.timelineEmptyBtn}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/(tabs)/schedule' as Href);
          }}
        >
          <Text style={styles.timelineEmptyBtnText}>Open schedule</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.primary} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.timeline}>
      <LinearGradient colors={['#FFFFFF', '#F8FDFC']} style={StyleSheet.absoluteFill} />
      <Text style={styles.timelineTitle}>Today&apos;s visits</Text>
      {jobs.map((job, i) => (
        <Pressable
          key={job.id}
          style={styles.timelineRow}
          onPress={() => {
            Haptics.selectionAsync();
            router.push(`/job/${job.id}` as Href);
          }}
        >
          <View style={styles.timelineRail}>
            <View style={[styles.timelineDot, i === 0 && styles.timelineDotFirst]} />
            {i < jobs.length - 1 ? <View style={styles.timelineLine} /> : null}
          </View>
          <View style={styles.timelineCopy}>
            <Text style={styles.timelineTime}>{job.slotLabel}</Text>
            <Text style={styles.timelineService}>{job.service}</Text>
            <Text style={styles.timelineMeta}>{job.customerName} · {job.zone}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
        </Pressable>
      ))}
    </View>
  );
}

export function PartnerSkillsRow({ skills }: { skills?: string[] }) {
  if (!skills?.length) return null;
  return (
    <View style={styles.skills}>
      <Text style={styles.skillsLabel}>Your skills</Text>
      <View style={styles.skillRow}>
        {skills.map((s) => (
          <View key={s} style={styles.skillChip}>
            <Text style={styles.skillText}>{s}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function PartnerSlotsRow() {
  const router = useRouter();
  const { profile } = usePartner();
  const activeIds = resolvePreferredSlotIds(profile);

  return (
    <Pressable
      style={styles.slots}
      onPress={() => {
        Haptics.selectionAsync();
        router.push('/slots' as Href);
      }}
    >
      <View style={styles.slotsHead}>
        <Text style={styles.slotsLabel}>Preferred slots</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.mutedLight} />
      </View>
      {PREFERRED_SLOTS.map((slot) => {
        const on = activeIds.includes(slot.id);
        return (
          <View key={slot.id} style={styles.slotRow}>
            <Ionicons name="time-outline" size={16} color={on ? colors.primary : colors.muted} />
            <Text style={[styles.slotText, !on && styles.slotTextOff]}>{slot.label}</Text>
            <View style={[styles.slotOn, !on && styles.slotOff]}>
              <Text style={[styles.slotOnText, !on && styles.slotOffText]}>{on ? 'On' : 'Off'}</Text>
            </View>
          </View>
        );
      })}
    </Pressable>
  );
}

export function PartnerHomeCompletedStrip({ jobs }: { jobs: PartnerJob[] }) {
  const router = useRouter();
  const completed = jobs.filter((j) => j.status === 'completed');
  if (completed.length === 0) return null;

  const openHistory = () => {
    Haptics.selectionAsync();
    router.push('/job/history' as Href);
  };

  return (
    <View style={styles.historyWrap}>
      <View style={styles.historyHead}>
        <Text style={styles.historyTitle}>Completed visits</Text>
        <Pressable onPress={openHistory} hitSlop={8}>
          <Text style={styles.historyLink}>View all</Text>
        </Pressable>
      </View>
      <View style={styles.historyList}>
        {completed.slice(0, 2).map((job) => (
          <PartnerJobHistoryCard key={job.id} job={job} />
        ))}
      </View>
    </View>
  );
}

export function PartnerDualRoleCard() {
  const router = useRouter();

  return (
    <Pressable
      style={styles.dual}
      onPress={() => {
        Haptics.selectionAsync();
        router.push('/book-home' as Href);
      }}
    >
      <Ionicons name="home" size={22} color={colors.primary} />
      <View style={styles.dualCopy}>
        <Text style={styles.dualTitle}>Book cleaning for my home</Text>
        <Text style={styles.dualSub}>Same phone works as customer — opens QuickMaid app</Text>
      </View>
      <Ionicons name="open-outline" size={18} color={colors.mutedLight} />
    </Pressable>
  );
}

export function PartnerKycBannerPressable({ profile }: { profile: PartnerProfile | null }) {
  const router = useRouter();
  if (!profile || profile.kycStatus === 'verified') return null;

  const label =
    profile.kycStatus === 'under_review'
      ? 'KYC under review'
      : profile.kycStatus === 'rejected'
        ? 'KYC needs attention'
        : 'Complete your KYC';

  return (
    <Pressable
      style={styles.kyc}
      onPress={() => {
        Haptics.selectionAsync();
        router.push('/kyc' as Href);
      }}
    >
      <LinearGradient colors={['#FFFBEB', '#FFF7ED']} style={StyleSheet.absoluteFill} />
      <View style={styles.kycIcon}>
        <Ionicons name="shield-half-outline" size={20} color={colors.warning} />
      </View>
      <View style={styles.kycCopy}>
        <Text style={styles.kycTitle}>{label}</Text>
        <Text style={styles.kycSub}>DigiLocker OTP + bank details for Monday payout</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  zone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
    marginTop: spacing.lg,
    overflow: 'hidden',
    ...shadow.sm,
  },
  zoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  zoneCopy: { flex: 1, gap: 2 },
  zoneTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  zoneSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  demandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  demandDot: { width: 6, height: 6, borderRadius: 3 },
  demandText: { fontFamily: fonts.bold, fontSize: 10 },
  goal: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.1)',
    gap: spacing.sm,
    overflow: 'hidden',
    ...shadow.sm,
  },
  goalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  goalTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  goalAmt: { fontFamily: fonts.bold, fontSize: 12, color: colors.primary },
  goalTrack: { height: 8, backgroundColor: colors.bgMuted, borderRadius: 4, overflow: 'hidden' },
  goalFill: { height: '100%', borderRadius: 4 },
  goalSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  timelineEmpty: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.1)',
    alignItems: 'center',
    gap: spacing.sm,
    overflow: 'hidden',
    ...shadow.sm,
  },
  timelineEmptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineEmptyTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  timelineEmptySub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 17,
  },
  timelineEmptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
  },
  timelineEmptyBtnText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primary },
  timeline: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.1)',
    gap: spacing.md,
    overflow: 'hidden',
    ...shadow.sm,
  },
  timelineTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  timelineRail: { alignItems: 'center', width: 16 },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    borderWidth: 2,
    borderColor: colors.white,
  },
  timelineDotFirst: { backgroundColor: colors.primary, borderColor: colors.primaryLight },
  timelineLine: { width: 2, flex: 1, minHeight: 36, backgroundColor: colors.border, marginTop: 4 },
  timelineCopy: { flex: 1, gap: 2 },
  timelineTime: { fontFamily: fonts.bold, fontSize: 11, color: colors.primary, letterSpacing: 0.3 },
  timelineService: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink },
  timelineMeta: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  skills: { marginTop: spacing.lg, gap: spacing.sm },
  skillsLabel: { fontFamily: fonts.bold, fontSize: 13, color: colors.inkSecondary },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  skillChip: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.15)',
  },
  skillText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primaryDark },
  slots: {
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  slotsHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  slotsLabel: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  slotRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 4 },
  slotText: { flex: 1, fontFamily: fonts.semiBold, fontSize: 13, color: colors.inkSecondary },
  slotTextOff: { color: colors.muted },
  slotOn: { backgroundColor: colors.successBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  slotOff: { backgroundColor: colors.bgMuted },
  slotOnText: { fontFamily: fonts.bold, fontSize: 10, color: colors.success },
  slotOffText: { color: colors.muted },
  dual: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.2)',
  },
  dualCopy: { flex: 1, gap: 2 },
  dualTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  dualSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  kyc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(180,71,8,0.18)',
    marginTop: spacing.md,
    overflow: 'hidden',
    ...shadow.sm,
  },
  kycIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kycCopy: { flex: 1, gap: 4 },
  kycTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.warning },
  kycSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkSecondary, lineHeight: 17 },
  historyWrap: { marginTop: spacing.lg, gap: spacing.sm },
  historyHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  historyTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  historyLink: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primary },
  historyList: { gap: spacing.sm },
});
