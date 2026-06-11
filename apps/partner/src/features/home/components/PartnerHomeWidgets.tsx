import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
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
import { formatRs } from '@/features/home/lib/home.greeting';
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
      <View style={styles.zoneIcon}>
        <Ionicons name="map" size={18} color={colors.primary} />
      </View>
      <View style={styles.zoneCopy}>
        <Text style={styles.zoneTitle}>Your zone · {z}</Text>
        <Text style={styles.zoneSub}>{demand.jobs} open requests nearby today</Text>
      </View>
      <View style={[styles.demandPill, { backgroundColor: `${demandColor}18` }]}>
        <Text style={[styles.demandText, { color: demandColor }]}>{demandLabel}</Text>
      </View>
    </View>
  );
}

export function PartnerWeeklyGoal() {
  const weekCredits = DEMO_EARNINGS.filter((e) => e.kind === 'credit').reduce((s, e) => s + e.amountPaise, 0);
  const pct = Math.min(100, Math.round((weekCredits / WEEKLY_EARNING_GOAL_PAISE) * 100));

  return (
    <View style={styles.goal}>
      <View style={styles.goalHead}>
        <Text style={styles.goalTitle}>Weekly target</Text>
        <Text style={styles.goalAmt}>
          {formatRs(weekCredits)} / {formatRs(WEEKLY_EARNING_GOAL_PAISE)}
        </Text>
      </View>
      <View style={styles.goalTrack}>
        <View style={[styles.goalFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.goalSub}>{pct}% of ₹1,500 weekly goal · Payout every Monday</Text>
    </View>
  );
}

export function PartnerTodayTimeline({ jobs }: { jobs: PartnerJob[] }) {
  const router = useRouter();
  if (jobs.length === 0) return null;

  return (
    <View style={styles.timeline}>
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
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.lg,
    ...shadow.sm,
  },
  zoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneCopy: { flex: 1, gap: 2 },
  zoneTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  zoneSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  demandPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  demandText: { fontFamily: fonts.bold, fontSize: 10 },
  goal: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  goalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  goalAmt: { fontFamily: fonts.bold, fontSize: 12, color: colors.primary },
  goalTrack: { height: 8, backgroundColor: colors.bgMuted, borderRadius: 4, overflow: 'hidden' },
  goalFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  goalSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  timeline: {
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
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
    backgroundColor: colors.warningBg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(180,71,8,0.18)',
    marginTop: spacing.md,
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
