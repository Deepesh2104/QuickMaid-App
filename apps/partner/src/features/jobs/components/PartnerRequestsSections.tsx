import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import type { PartnerJob } from '@/constants/demo';
import { PARTNER_FAQ_ITEMS } from '@/constants/demo';
import { formatRs, netEarningPaise } from '@/features/home/lib/home.greeting';
import { PartnerTrustStrip } from '@/features/home/components/PartnerHomeSections';
import {
  REQUEST_HOW_STEPS,
  REQUEST_TIPS,
  requestsPremium,
} from '@/features/jobs/constants/requests.premium';
import { useOfferCountdown } from '@/features/jobs/hooks/useOfferCountdown';
import { formatOfferCountdown } from '@/features/jobs/lib/offer-expiry.utils';
import { usePartnerI18n } from '@/i18n/usePartnerI18n';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, shadow, spacing } from '@/theme/spacing';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export function PartnerRequestsSectionHeader({
  eyebrow,
  title,
  subtitle,
  icon,
  actionLabel,
  onAction,
  compact,
}: SectionHeaderProps) {
  return (
    <View style={[styles.sectionHead, compact && styles.sectionHeadCompact]}>
      <View style={styles.sectionLeft}>
        {icon ? (
          <View style={[styles.sectionIconOuter, compact && styles.sectionIconOuterCompact]}>
            <LinearGradient
              colors={[...requestsPremium.iconGradient]}
              style={[styles.sectionIcon, compact && styles.sectionIconCompact]}
            >
              <Ionicons name={icon} size={compact ? 16 : 18} color={colors.partnerGold} />
            </LinearGradient>
          </View>
        ) : null}
        <View style={styles.sectionCopy}>
          {eyebrow ? (
            <View style={styles.eyebrowRow}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrow}>{eyebrow}</Text>
            </View>
          ) : null}
          <Text style={[styles.sectionTitle, compact && styles.sectionTitleCompact]}>{title}</Text>
          {subtitle ? <Text style={styles.sectionSub}>{subtitle}</Text> : null}
        </View>
      </View>
      {actionLabel && onAction ? (
        <Pressable
          style={styles.sectionAction}
          onPress={() => {
            Haptics.selectionAsync();
            onAction();
          }}
        >
          <Text style={styles.sectionActionText}>{actionLabel}</Text>
          <Ionicons name="chevron-forward" size={12} color={colors.primaryDark} />
        </Pressable>
      ) : null}
    </View>
  );
}

interface OnlineBannerProps {
  isOnline: boolean;
  autoAssign?: boolean;
  onToggle: (next: boolean) => void;
}

export function PartnerRequestsOnlineBanner({ isOnline, autoAssign, onToggle }: OnlineBannerProps) {
  const { t } = usePartnerI18n();

  return (
    <View style={[styles.onlineBanner, isOnline ? styles.onlineOn : styles.onlineOff]}>
      <View style={[styles.onlineIcon, isOnline ? styles.onlineIconOn : styles.onlineIconOff]}>
        <Ionicons
          name={isOnline ? 'radio' : 'radio-outline'}
          size={18}
          color={isOnline ? colors.success : colors.warning}
        />
      </View>
      <View style={styles.onlineCopy}>
        <Text style={[styles.onlineTitle, isOnline ? styles.onlineTitleOn : styles.onlineTitleOff]}>
          {isOnline ? t('liveForOffers') : t('goOnlineDispatch')}
        </Text>
        <Text style={styles.onlineSub}>
          {isOnline
            ? autoAssign
              ? t('autoAssignOn')
              : t('manualOffers')
            : t('goOffline')}
        </Text>
      </View>
      <Switch
        value={isOnline}
        onValueChange={(v) => {
          Haptics.selectionAsync();
          onToggle(v);
        }}
        trackColor={{ false: 'rgba(180,71,8,0.2)', true: colors.partnerGold }}
        thumbColor={colors.white}
        ios_backgroundColor="rgba(180,71,8,0.2)"
      />
    </View>
  );
}

interface BestMatchProps {
  job: PartnerJob;
  onAccept: () => void;
  onOpen: () => void;
}

export function PartnerRequestsBestMatch({ job, onAccept, onOpen }: BestMatchProps) {
  const net = netEarningPaise(job.amountPaise);
  const { secondsLeft, expired } = useOfferCountdown(job.id, true);

  return (
    <View style={styles.bestWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="Job offer"
        title="Assigned to you"
        subtitle="Slot + zone match · respond before timer ends"
        icon="sparkles"
        compact
      />
      <Pressable style={styles.bestCard} onPress={onOpen}>
        <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={StyleSheet.absoluteFill} />
        <View style={styles.bestGlow} />
        <View style={styles.bestTop}>
          <View style={styles.bestBadge}>
            <Ionicons name="flash" size={12} color={colors.partnerGold} />
            <Text style={styles.bestBadgeText}>UC DISPATCH</Text>
          </View>
          <View style={[styles.timerPill, expired && styles.timerPillExpired]}>
            <Ionicons name="timer-outline" size={12} color={colors.white} />
            <Text style={styles.timerText}>
              {expired ? 'Expired' : formatOfferCountdown(secondsLeft)}
            </Text>
          </View>
        </View>
        <Text style={styles.bestService}>{job.service}</Text>
        <Text style={styles.bestCustomer}>
          {job.customerName} · {job.zone}
          {job.distanceKm ? ` · ${job.distanceKm} km` : ''}
        </Text>
        <Text style={styles.bestAddress} numberOfLines={1}>{job.address}</Text>
        <View style={styles.bestFoot}>
          <View>
            <Text style={styles.bestEarnLabel}>You earn</Text>
            <Text style={styles.bestEarn}>{formatRs(net)}</Text>
          </View>
          {!expired ? (
            <Pressable
              style={styles.bestAccept}
              onPress={(e) => {
                e.stopPropagation?.();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onAccept();
              }}
            >
              <Text style={styles.bestAcceptText}>Accept now</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.primaryDark} />
            </Pressable>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}

export function PartnerRequestsPerformance() {
  const stats = [
    { label: 'Accept rate', value: '94%', icon: 'checkmark-circle' as const, tint: colors.success },
    { label: 'Avg response', value: '8 min', icon: 'speedometer' as const, tint: colors.primary },
    { label: 'This week', value: '6 jobs', icon: 'briefcase' as const, tint: colors.partnerGold },
  ];

  return (
    <View style={styles.perfWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="Your stats"
        title="Inbox performance"
        subtitle="Better response time → more offers"
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

export function PartnerRequestsHowItWorks() {
  return (
    <View style={styles.howWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="How it works"
        title="From request to payout"
        subtitle="Three steps every partner follows"
        icon="git-network-outline"
        compact
      />
      <View style={styles.howList}>
        {REQUEST_HOW_STEPS.map((step, i) => (
          <View key={step.step} style={styles.howCard}>
            <LinearGradient colors={[...requestsPremium.tealGradient]} style={StyleSheet.absoluteFill} />
            <View style={styles.howStepCol}>
              <Text style={styles.howStep}>{step.step}</Text>
              {i < REQUEST_HOW_STEPS.length - 1 ? <View style={styles.howLine} /> : null}
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

interface ActivePreviewProps {
  jobs: PartnerJob[];
}

export function PartnerRequestsActivePreview({ jobs }: ActivePreviewProps) {
  const router = useRouter();
  if (jobs.length === 0) return null;

  return (
    <View style={styles.activeWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="Accepted"
        title="On your schedule"
        subtitle="Visits you already confirmed"
        icon="calendar-outline"
        actionLabel="Schedule"
        onAction={() => router.push('/(tabs)/schedule' as Href)}
        compact
      />
      <View style={styles.activeList}>
        {jobs.slice(0, 2).map((job) => (
          <Pressable
            key={job.id}
            style={styles.activeCard}
            onPress={() => router.push(`/job/${job.id}` as Href)}
          >
            <View style={styles.activeIcon}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            </View>
            <View style={styles.activeCopy}>
              <Text style={styles.activeTitle} numberOfLines={1}>{job.service}</Text>
              <Text style={styles.activeSub} numberOfLines={1}>
                {job.visitDate} · {job.slotLabel}
              </Text>
            </View>
            <Text style={styles.activeEarn}>{formatRs(netEarningPaise(job.amountPaise))}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function PartnerRequestsTips() {
  return (
    <View style={styles.tipsWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="Pro tips"
        title="Win more requests"
        icon="bulb-outline"
        compact
      />
      <View style={styles.tipsRow}>
        {REQUEST_TIPS.map((tip) => (
          <View key={tip.title} style={styles.tipCard}>
            <LinearGradient colors={['#FFFBEB', colors.white]} style={StyleSheet.absoluteFill} />
            <Ionicons name={tip.icon} size={18} color={colors.partnerGold} />
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipSub}>{tip.sub}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function PartnerRequestsFaqPreview() {
  const router = useRouter();
  const items = PARTNER_FAQ_ITEMS.slice(0, 2);

  return (
    <View style={styles.faqWrap}>
      <PartnerRequestsSectionHeader
        eyebrow="FAQ"
        title="Common questions"
        icon="help-circle-outline"
        actionLabel="Help"
        onAction={() => router.push('/(tabs)/help' as Href)}
        compact
      />
      <View style={styles.faqList}>
        {items.map((item) => (
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

export function PartnerRequestsHelpStrip() {
  const router = useRouter();

  return (
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
        <Text style={styles.helpTitle}>How requests work?</Text>
        <Text style={styles.helpSub}>FAQ, tips & partner support — Help tab</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
    </Pressable>
  );
}

export function PartnerRequestsTrustFooter() {
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

export function PartnerRequestsEmptyPremium({
  isOnline,
  zone,
  filterLabel,
  slotsMismatch,
  onResetDemo,
}: {
  isOnline: boolean;
  zone?: string;
  filterLabel?: string;
  slotsMismatch?: boolean;
  onResetDemo?: () => void;
}) {
  const title = !isOnline
    ? 'You are offline'
    : slotsMismatch
      ? 'No offers for your slots'
      : filterLabel
        ? `No ${filterLabel.toLowerCase()} offers`
        : 'No job offers right now';
  const sub = !isOnline
    ? 'Urban Company style: offers tabhi aate hain jab aap live ho. Switch on above.'
    : slotsMismatch
      ? 'Pending jobs hain par aapke active slots / zone se match nahi karte. Slots ya work address update karo.'
      : filterLabel
        ? 'Try another filter or wait — new offers arrive when customers book your windows.'
        : `Live in ${zone ?? 'your zone'}. Offers auto-match your morning / afternoon / Sunday slots.`;

  return (
    <View style={styles.emptyPremium}>
      <LinearGradient colors={['#E6F4F2', colors.white]} style={styles.emptyIcon}>
        <Ionicons name={isOnline ? 'mail-open-outline' : 'moon-outline'} size={32} color={colors.primary} />
      </LinearGradient>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySub}>{sub}</Text>
      {!isOnline ? (
        <Text style={styles.emptyTip}>Step 1: Online toggle ON karo (upar wala switch)</Text>
      ) : (
        <Text style={styles.emptyTip}>
          Check Schedule tab — auto-accept jobs wahan ho sakti hain. Start visit khud dabana.
        </Text>
      )}
      {onResetDemo ? (
        <Pressable
          style={styles.emptyResetBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onResetDemo();
          }}
        >
          <Ionicons name="refresh" size={14} color={colors.white} />
          <Text style={styles.emptyResetText}>Reset demo jobs</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  sectionHeadCompact: { marginBottom: spacing.sm },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1, minWidth: 0 },
  sectionIconOuter: { ...requestsPremium.surfaceSoft, padding: 2 },
  sectionIconOuterCompact: { borderRadius: radius.md },
  sectionIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.lg - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionIconCompact: { width: 34, height: 34, borderRadius: radius.md - 2 },
  sectionCopy: { flex: 1, minWidth: 0, gap: 3 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eyebrowDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.partnerGold },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.partnerGold,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.ink,
    letterSpacing: -0.5,
    lineHeight: 24,
  },
  sectionTitleCompact: { fontSize: 17, lineHeight: 21 },
  sectionSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 17 },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  sectionActionText: { fontFamily: fonts.bold, fontSize: 11, color: colors.primaryDark },
  onlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xxl,
    borderWidth: 1,
    marginBottom: spacing.lg,
    ...shadow.sm,
  },
  onlineOn: { backgroundColor: colors.successBg, borderColor: 'rgba(2,122,72,0.12)' },
  onlineOff: { backgroundColor: colors.warningBg, borderColor: 'rgba(180,71,8,0.12)' },
  onlineIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  onlineIconOn: {},
  onlineIconOff: {},
  onlineCopy: { flex: 1, gap: 3 },
  onlineTitle: { fontFamily: fonts.bold, fontSize: 14 },
  onlineTitleOn: { color: colors.success },
  onlineTitleOff: { color: colors.warning },
  onlineSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },
  bestWrap: { marginBottom: spacing.xl },
  bestCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    overflow: 'hidden',
    gap: spacing.sm,
    ...shadow.md,
  },
  bestGlow: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(252,211,77,0.2)',
  },
  bestTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  bestBadgeText: { fontFamily: fonts.bold, fontSize: 9, color: colors.partnerGold, letterSpacing: 0.8 },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  timerPillExpired: { backgroundColor: 'rgba(220,38,38,0.45)' },
  timerText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.white },
  bestService: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.white, letterSpacing: -0.3 },
  bestCustomer: { fontFamily: fonts.medium, fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  bestAddress: { fontFamily: fonts.regular, fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  bestFoot: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: spacing.sm },
  bestEarnLabel: { fontFamily: fonts.medium, fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  bestEarn: { fontFamily: fonts.extraBold, fontSize: 22, color: colors.partnerGold },
  bestAccept: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  bestAcceptText: { fontFamily: fonts.bold, fontSize: 13, color: colors.primaryDark },
  perfWrap: { marginBottom: spacing.xl },
  perfRow: { flexDirection: 'row', gap: spacing.sm },
  perfCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadow.sm,
  },
  perfIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  perfValue: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.ink },
  perfLabel: { fontFamily: fonts.medium, fontSize: 9, color: colors.muted, textAlign: 'center' },
  howWrap: { marginBottom: spacing.xl },
  howList: { gap: spacing.sm },
  howCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.1)',
  },
  howStepCol: { alignItems: 'center', width: 28 },
  howStep: { fontFamily: fonts.extraBold, fontSize: 11, color: colors.primary },
  howLine: { width: 2, flex: 1, minHeight: 12, backgroundColor: 'rgba(11,110,103,0.15)', marginTop: 4 },
  howIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  howCopy: { flex: 1, gap: 3 },
  howTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  howSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 17 },
  activeWrap: { marginBottom: spacing.xl },
  activeList: { gap: spacing.sm },
  activeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadow.sm,
  },
  activeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCopy: { flex: 1, minWidth: 0, gap: 2 },
  activeTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  activeSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  activeEarn: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.partnerGold },
  tipsWrap: { marginBottom: spacing.xl },
  tipsRow: { flexDirection: 'row', gap: spacing.sm },
  tipCard: {
    flex: 1,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: 6,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(217,119,6,0.12)',
    minHeight: 108,
  },
  tipTitle: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  tipSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted, lineHeight: 14 },
  faqWrap: { marginBottom: spacing.xl },
  faqList: { gap: spacing.sm },
  faqCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadow.sm,
  },
  faqQ: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, paddingRight: 24 },
  faqA: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 17 },
  faqChev: { position: 'absolute', right: spacing.lg, top: spacing.lg },
  helpStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    marginBottom: spacing.lg,
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
  trustWrap: { marginTop: spacing.md },
  footer: { alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.lg, gap: 4 },
  footerLine: { width: 40, height: 3, borderRadius: 2, backgroundColor: colors.divider, marginBottom: spacing.sm },
  footerBrand: { fontFamily: fonts.extraBold, fontSize: 13, color: colors.muted, letterSpacing: 0.5 },
  footerSub: { fontFamily: fonts.medium, fontSize: 11, color: colors.mutedLight },
  emptyPremium: { alignItems: 'center', paddingVertical: spacing.xxxl, gap: spacing.md },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  emptyTitle: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.ink },
  emptySub: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
    paddingHorizontal: layout.pad,
  },
  emptyTip: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 280,
  },
  emptyResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryDark,
  },
  emptyResetText: { fontFamily: fonts.bold, fontSize: 12, color: colors.white },
});
