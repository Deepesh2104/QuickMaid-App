import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PartnerTrustStrip } from '@/features/home/components/PartnerHomeSections';
import { formatRs } from '@/features/home/lib/home.greeting';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import {
  EARNINGS_FAQ,
  EARNINGS_HOW_STEPS,
  EARNINGS_TIPS,
  earningsPremium,
  PAYOUT_SCHEDULE,
} from '@/features/earnings/constants/earnings.premium';
import { useOpenSupportChat } from '@/features/support/hooks/useOpenSupportChat';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

export function PartnerEarningsBalanceCard({
  weekNet,
  todayNet,
  goalPct,
  pendingPayout,
}: {
  weekNet: string;
  todayNet: string;
  goalPct: number;
  pendingPayout: string;
}) {
  return (
    <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={styles.balanceCard}>
      <View style={styles.balanceGlow} />
      <View style={styles.balanceTop}>
        <View>
          <Text style={styles.balanceEyebrow}>THIS WEEK · NET</Text>
          <Text style={styles.balanceValue}>{weekNet}</Text>
          <Text style={styles.balanceSub}>Today {todayNet} · after 10% fee</Text>
        </View>
        <View style={styles.balanceRing}>
          <Text style={styles.balancePct}>{goalPct}%</Text>
          <Text style={styles.balanceGoal}>goal</Text>
        </View>
      </View>
      <View style={styles.balanceTrack}>
        <View style={[styles.balanceFill, { width: `${goalPct}%` }]} />
      </View>
      <View style={styles.balanceFoot}>
        <Ionicons name="wallet-outline" size={13} color={colors.partnerGold} />
        <Text style={styles.balanceHint}>Next payout est. {pendingPayout} · {PAYOUT_SCHEDULE.day}</Text>
      </View>
    </LinearGradient>
  );
}

export function PartnerEarningsPayoutStrip({
  nextAmount,
  upiId,
  kycVerified,
}: {
  nextAmount: string;
  upiId?: string;
  kycVerified: boolean;
}) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.payoutStrip}
      onPress={() => router.push('/payout/upcoming' as Href)}
    >
      <View style={styles.payoutIcon}>
        <Ionicons name="calendar" size={16} color={colors.partnerGold} />
      </View>
      <View style={styles.payoutCopy}>
        <Text style={styles.payoutTitle}>Next payout · {PAYOUT_SCHEDULE.day}</Text>
        <Text style={styles.payoutSub}>
          {PAYOUT_SCHEDULE.window}
          {!kycVerified ? ' · Complete KYC to unlock' : ''}
        </Text>
        {upiId ? <Text style={styles.payoutUpi} numberOfLines={1}>{upiId}</Text> : null}
      </View>
      <View style={styles.payoutAmtCol}>
        <Text style={styles.payoutAmt}>{nextAmount}</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.mutedLight} />
      </View>
    </Pressable>
  );
}

export function PartnerEarningsUpiCard({ upiId }: { upiId?: string }) {
  const router = useRouter();

  return (
    <Pressable style={styles.upiCard} onPress={() => router.push('/(tabs)/profile' as Href)}>
      <LinearGradient colors={[...earningsPremium.tealGradient]} style={StyleSheet.absoluteFill} />
      <View style={styles.upiIcon}>
        <Ionicons name="phone-portrait-outline" size={20} color={colors.primaryDark} />
      </View>
      <View style={styles.upiCopy}>
        <Text style={styles.upiEyebrow}>PAYOUT DESTINATION</Text>
        <Text style={styles.upiTitle}>UPI ID</Text>
        <Text style={styles.upiValue}>{upiId ?? 'Add UPI in Profile'}</Text>
      </View>
      <View style={styles.upiEdit}>
        <Text style={styles.upiEditText}>Edit</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.primaryDark} />
      </View>
    </Pressable>
  );
}

export function PartnerEarningsBreakdownCard({
  gross,
  fee,
  net,
}: {
  gross: string;
  fee: string;
  net: string;
}) {
  return (
    <View style={styles.breakWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="Breakdown"
        title="Fee transparency"
        subtitle="What you see is what you earn"
        icon="receipt-outline"
        compact
      />
      <View style={styles.breakCard}>
        <View style={styles.breakRow}>
          <Text style={styles.breakLabel}>Gross credits</Text>
          <Text style={styles.breakVal}>{gross}</Text>
        </View>
        <View style={styles.breakDivider} />
        <View style={styles.breakRow}>
          <Text style={styles.breakLabel}>Platform fee ({PAYOUT_SCHEDULE.feePct}%)</Text>
          <Text style={[styles.breakVal, styles.breakFee]}>-{fee}</Text>
        </View>
        <View style={styles.breakDivider} />
        <View style={styles.breakRow}>
          <Text style={styles.breakNetLabel}>You keep</Text>
          <Text style={styles.breakNet}>{net}</Text>
        </View>
      </View>
    </View>
  );
}

export function PartnerEarningsPendingCard({
  scheduled,
  completedPending,
}: {
  scheduled: string;
  completedPending: string;
}) {
  const router = useRouter();

  return (
    <View style={styles.pendingWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="Pipeline"
        title="Earnings on the way"
        subtitle="Scheduled + awaiting payout batch"
        icon="hourglass-outline"
        compact
        actionLabel="Schedule"
        onAction={() => router.push('/(tabs)/schedule' as Href)}
      />
      <View style={styles.pendingRow}>
        <View style={styles.pendingCard}>
          <Ionicons name="calendar-outline" size={16} color={colors.primary} />
          <Text style={styles.pendingLabel}>Scheduled</Text>
          <Text style={styles.pendingVal}>{scheduled}</Text>
        </View>
        <View style={styles.pendingCard}>
          <Ionicons name="time-outline" size={16} color={colors.partnerGold} />
          <Text style={styles.pendingLabel}>Pending pay</Text>
          <Text style={styles.pendingVal}>{completedPending}</Text>
        </View>
      </View>
    </View>
  );
}

export function PartnerEarningsHowItWorks() {
  return (
    <View style={styles.howWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="How it works"
        title="From job to UPI"
        subtitle="Three steps every partner follows"
        icon="git-network-outline"
        compact
      />
      <View style={styles.howList}>
        {EARNINGS_HOW_STEPS.map((step, i) => (
          <View key={step.step} style={styles.howCard}>
            <LinearGradient colors={[...earningsPremium.tealGradient]} style={StyleSheet.absoluteFill} />
            <View style={styles.howStepCol}>
              <Text style={styles.howStep}>{step.step}</Text>
              {i < EARNINGS_HOW_STEPS.length - 1 ? <View style={styles.howLine} /> : null}
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

export function PartnerEarningsPerformance({
  paidOut,
  credits,
  weekJobs,
}: {
  paidOut: string;
  credits: string;
  weekJobs: number;
}) {
  const stats = [
    { label: 'Paid out', value: paidOut, icon: 'arrow-up-circle' as const, tint: colors.muted },
    { label: 'Credits', value: credits, icon: 'add-circle' as const, tint: colors.success },
    { label: 'Jobs', value: String(weekJobs), icon: 'briefcase' as const, tint: colors.primary },
  ];

  return (
    <View style={styles.perfWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="Your stats"
        title="Earnings performance"
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

export function PartnerEarningsTips() {
  return (
    <View style={styles.tipsWrap}>
      <PartnerRequestsSectionHeader eyebrow="Pro tips" title="Maximise payouts" icon="bulb-outline" compact />
      <View style={styles.tipsRow}>
        {EARNINGS_TIPS.map((tip) => (
          <View key={tip.title} style={styles.tipCard}>
            <LinearGradient colors={[...earningsPremium.goldGradient]} style={StyleSheet.absoluteFill} />
            <Ionicons name={tip.icon} size={18} color={colors.partnerGold} />
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipSub}>{tip.sub}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function PartnerEarningsFaq() {
  const router = useRouter();

  return (
    <View style={styles.faqWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="FAQ"
        title="Payout questions"
        icon="help-circle-outline"
        actionLabel="Help"
        onAction={() => router.push('/(tabs)/help' as Href)}
        compact
      />
      <View style={styles.faqList}>
        {EARNINGS_FAQ.map((item) => (
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

export function PartnerEarningsSupportCard() {
  const openSupportChat = useOpenSupportChat();

  return (
    <View style={styles.supportWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="Need help?"
        title="Payout support"
        subtitle="Missing payment or UPI issue"
        icon="headset-outline"
        compact
      />
      <Pressable
        style={styles.supportCard}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          openSupportChat({ topic: 'payout', context: 'Payout status or UPI issue' });
        }}
      >
        <LinearGradient colors={[...earningsPremium.tealGradient]} style={StyleSheet.absoluteFill} />
        <View style={styles.supportIcon}>
          <Ionicons name="chatbubble-ellipses" size={20} color={colors.primaryDark} />
        </View>
        <View style={styles.supportCopy}>
          <Text style={styles.supportTitle}>Chat about payouts</Text>
          <Text style={styles.supportSub}>Trace UPI credit · KYC · failed transfers</Text>
        </View>
        <Ionicons name="arrow-forward" size={16} color={colors.primaryDark} />
      </Pressable>
    </View>
  );
}

const EMPTY_FILTER_COPY: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; title: string; sub: string; cta: string; route: Href }
> = {
  all: {
    icon: 'layers-outline',
    title: 'No activity yet',
    sub: 'Complete visits — job credits and Monday payouts show up here',
    cta: 'Open schedule',
    route: '/(tabs)/schedule',
  },
  credits: {
    icon: 'add-circle-outline',
    title: 'No job credits yet',
    sub: 'Finish a visit with OTP — net earning credits after the 10% fee',
    cta: 'Open schedule',
    route: '/(tabs)/schedule',
  },
  payouts: {
    icon: 'arrow-up-circle-outline',
    title: 'No payouts yet',
    sub: 'First Monday transfer after KYC approval and completed week',
    cta: 'Complete KYC',
    route: '/kyc',
  },
  this_week: {
    icon: 'calendar-outline',
    title: 'Quiet week so far',
    sub: 'Go online and accept jobs — this week filter updates live',
    cta: 'Go online',
    route: '/(tabs)',
  },
};

export function PartnerEarningsFilterEmpty({
  filterLabel,
  filter = 'all',
}: {
  filterLabel: string;
  filter?: string;
}) {
  const router = useRouter();
  const copy = EMPTY_FILTER_COPY[filter] ?? {
    icon: 'wallet-outline' as const,
    title: `No ${filterLabel.toLowerCase()} yet`,
    sub: 'Complete jobs to see credits and payouts here',
    cta: 'Open schedule',
    route: '/(tabs)/schedule' as Href,
  };

  return (
    <View style={styles.filterEmpty}>
      <LinearGradient colors={['#E6F4F2', '#FFFFFF']} style={styles.filterEmptyIcon}>
        <Ionicons name={copy.icon} size={26} color={colors.primary} />
      </LinearGradient>
      <Text style={styles.filterEmptyTitle}>{copy.title}</Text>
      <Text style={styles.filterEmptySub}>{copy.sub}</Text>
      <Pressable
        style={styles.filterEmptyBtn}
        onPress={() => {
          Haptics.selectionAsync();
          router.push(copy.route);
        }}
      >
        <Text style={styles.filterEmptyBtnText}>{copy.cta}</Text>
        <Ionicons name="arrow-forward" size={14} color={colors.white} />
      </Pressable>
    </View>
  );
}

export function PartnerEarningsTrustFooter() {
  return (
    <View style={styles.trustWrap}>
      <PartnerTrustStrip />
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerBrand}>QuickMaid Partner</Text>
        <Text style={styles.footerSub}>Secure UPI payouts · Raipur</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCard: { borderRadius: radius.xxl, padding: spacing.lg, overflow: 'hidden', gap: spacing.sm, ...shadow.md },
  balanceGlow: {
    position: 'absolute',
    right: -15,
    top: -15,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(252,211,77,0.18)',
  },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceEyebrow: { fontFamily: fonts.bold, fontSize: 9, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.8 },
  balanceValue: { fontFamily: fonts.extraBold, fontSize: 28, color: colors.white, letterSpacing: -0.5 },
  balanceSub: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  balanceRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(252,211,77,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  balancePct: { fontFamily: fonts.extraBold, fontSize: 13, color: colors.partnerGold },
  balanceGoal: { fontFamily: fonts.medium, fontSize: 8, color: 'rgba(255,255,255,0.6)' },
  balanceTrack: { height: 5, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.2)', overflow: 'hidden' },
  balanceFill: { height: '100%', borderRadius: 3, backgroundColor: colors.partnerGold },
  balanceFoot: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  balanceHint: { fontFamily: fonts.regular, fontSize: 10, color: 'rgba(255,255,255,0.65)' },

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
  payoutSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
  payoutUpi: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.primaryDark },
  payoutAmtCol: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  payoutAmt: { fontFamily: fonts.extraBold, fontSize: 13, color: colors.partnerGold },

  upiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.md,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  upiIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upiCopy: { flex: 1, gap: 2 },
  upiEyebrow: { fontFamily: fonts.bold, fontSize: 9, color: colors.muted, letterSpacing: 0.6 },
  upiTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.muted },
  upiValue: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.ink },
  upiEdit: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  upiEditText: { fontFamily: fonts.bold, fontSize: 12, color: colors.primaryDark },

  breakWrap: { gap: spacing.sm },
  breakCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  breakRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  breakLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  breakVal: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  breakFee: { color: colors.warning },
  breakDivider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.divider },
  breakNetLabel: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  breakNet: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.partnerGold },

  pendingWrap: { gap: spacing.sm },
  pendingRow: { flexDirection: 'row', gap: spacing.sm },
  pendingCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: 4,
    alignItems: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  pendingLabel: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  pendingVal: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.ink },

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
  perfIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  perfValue: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.ink },
  perfLabel: { fontFamily: fonts.medium, fontSize: 9, color: colors.muted, textAlign: 'center' },

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
  supportSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },

  filterEmpty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  filterEmptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  filterEmptyTitle: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  filterEmptySub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 17,
    maxWidth: 280,
  },
  filterEmptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryDark,
  },
  filterEmptyBtnText: { fontFamily: fonts.bold, fontSize: 12, color: colors.white },

  trustWrap: { gap: spacing.md, marginTop: spacing.sm },
  footer: { alignItems: 'center', gap: 4, paddingBottom: spacing.sm },
  footerLine: { width: 40, height: 3, borderRadius: 2, backgroundColor: colors.divider },
  footerBrand: { fontFamily: fonts.bold, fontSize: 11, color: colors.muted },
  footerSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.mutedLight },
});
