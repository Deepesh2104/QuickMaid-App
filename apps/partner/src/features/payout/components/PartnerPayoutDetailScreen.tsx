import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QmButton } from '@/components/ui/QmButton';
import { usePartner } from '@/context/PartnerContext';
import { formatRs } from '@/features/home/lib/home.greeting';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';
import {
  PAYOUT_DETAIL_STATS,
  PAYOUT_STATUS_META,
  PAYOUT_TIMELINE_SCHEDULED,
  PAYOUT_TIMELINE_SENT,
} from '@/features/payout/constants/payout.premium';
import { buildPayoutDetail } from '@/features/payout/lib/payout.utils';
import { useOpenSupportChat } from '@/features/support/hooks/useOpenSupportChat';
import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const SHEET_OVERLAP = 14;
const SHEET_BG = '#EFF8F7';

export function PartnerPayoutDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tabScrollPad } = useLayoutMetrics();
  const { profile } = usePartner();
  const { jobs } = usePartnerJobs();
  const openSupportChat = useOpenSupportChat();

  const { id: idParam } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = typeof idParam === 'string' ? idParam : 'upcoming';

  const payout = useMemo(() => buildPayoutDetail(id, profile, jobs), [id, profile, jobs]);

  if (!payout) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loaderText}>Payout not found</Text>
        <QmButton label="Go back" variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  const meta = PAYOUT_STATUS_META[payout.status];
  const timeline = payout.status === 'scheduled' ? PAYOUT_TIMELINE_SCHEDULED : PAYOUT_TIMELINE_SENT;
  const isUpcoming = payout.id === 'upcoming';

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
            <Ionicons name="wallet" size={17} color={colors.partnerGold} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>PAYOUT DETAIL</Text>
            <Text style={styles.headerTitle} numberOfLines={2}>{payout.title}</Text>
            <Text style={styles.headerSub}>{payout.batchPeriod}</Text>
          </View>
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>{isUpcoming ? 'Estimated transfer' : 'Amount sent'}</Text>
          <Text style={styles.amountValue}>{formatRs(payout.amountPaise)}</Text>
        </View>

        <View style={styles.statBar}>
          {PAYOUT_DETAIL_STATS.map((stat, idx) => (
            <View key={stat.label} style={styles.statWrap}>
              {idx > 0 ? <View style={styles.statDivider} /> : null}
              <View style={styles.statChip}>
                <Text style={styles.statNum}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingBottom: tabScrollPad + spacing.xl }]}
        >
          <Animated.View entering={FadeInDown.duration(300)}>
            <View style={[styles.statusCard, { backgroundColor: meta.bg }]}>
              <View style={[styles.statusIcon, { backgroundColor: colors.white }]}>
                <Ionicons name={meta.icon} size={20} color={meta.color} />
              </View>
              <View style={styles.statusCopy}>
                <Text style={[styles.statusTitle, { color: meta.color }]}>{meta.label}</Text>
                <Text style={styles.statusSub}>{meta.hint}</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(60).duration(300)} style={styles.block}>
            <PartnerRequestsSectionHeader
              eyebrow="Transfer"
              title="Payout info"
              subtitle={payout.processedLabel ?? payout.scheduledLabel ?? payout.batchPeriod}
              icon="information-circle-outline"
              compact
            />
            <View style={styles.infoCard}>
              <InfoRow icon="phone-portrait-outline" label="UPI destination" value={payout.upiMask} />
              {payout.utr ? (
                <InfoRow icon="receipt-outline" label="UTR reference" value={payout.utr} mono />
              ) : null}
              <InfoRow
                icon="calendar-outline"
                label={isUpcoming ? 'Scheduled for' : 'Processed on'}
                value={payout.processedLabel ?? payout.scheduledLabel ?? '—'}
              />
              <InfoRow icon="layers-outline" label="Visits in batch" value={`${payout.lines.length} jobs`} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.block}>
            <PartnerRequestsSectionHeader
              eyebrow="Breakdown"
              title="Amount summary"
              subtitle="Net after 10% platform fee"
              icon="pie-chart-outline"
              compact
            />
            <View style={styles.breakdown}>
              <BreakRow label="Gross credits" value={formatRs(payout.grossPaise)} />
              <BreakRow label="Platform fee (10%)" value={`-${formatRs(payout.feePaise)}`} muted />
              <View style={styles.breakDivider} />
              <BreakRow label="Net payout" value={formatRs(payout.netPaise)} strong />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(140).duration(300)} style={styles.block}>
            <PartnerRequestsSectionHeader
              eyebrow="Included"
              title="Jobs in this batch"
              subtitle={`${payout.lines.length} visit credit${payout.lines.length === 1 ? '' : 's'}`}
              icon="list-outline"
              compact
            />
            <View style={styles.lines}>
              {payout.lines.length === 0 ? (
                <View style={styles.emptyLines}>
                  <Text style={styles.emptyText}>Complete visits this week to build your next payout.</Text>
                </View>
              ) : (
                payout.lines.map((line) => (
                  <View key={line.bookingRef} style={styles.lineRow}>
                    <View style={styles.lineIcon}>
                      <Ionicons name="add-circle" size={14} color={colors.success} />
                    </View>
                    <View style={styles.lineCopy}>
                      <Text style={styles.lineTitle} numberOfLines={1}>{line.title}</Text>
                      <Text style={styles.lineSub}>{line.bookingRef} · {line.date}</Text>
                    </View>
                    <Text style={styles.lineAmt}>{formatRs(line.netPaise)}</Text>
                  </View>
                ))
              )}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(180).duration(300)} style={styles.block}>
            <PartnerRequestsSectionHeader
              eyebrow="Status"
              title="Payout timeline"
              subtitle={isUpcoming ? 'What happens next' : 'How this transfer completed'}
              icon="git-network-outline"
              compact
            />
            <View style={styles.timeline}>
              {timeline.map((step, idx) => (
                <View key={step.title} style={styles.timelineRow}>
                  <View style={styles.timelineRail}>
                    <View style={[styles.timelineDot, idx === 0 && styles.timelineDotActive]}>
                      <Ionicons
                        name={step.icon}
                        size={14}
                        color={idx === 0 ? colors.primary : colors.muted}
                      />
                    </View>
                    {idx < timeline.length - 1 ? <View style={styles.timelineLine} /> : null}
                  </View>
                  <View style={styles.timelineCopy}>
                    <Text style={styles.timelineTitle}>{step.title}</Text>
                    <Text style={styles.timelineSub}>{step.sub}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(220).duration(300)}>
            <QmButton
              label={payout.status === 'failed' ? 'Chat — payout failed' : 'Chat about this payout'}
              icon="chatbubble-ellipses-outline"
              onPress={() =>
                openSupportChat({
                  topic: 'payout',
                  context: `${payout.title} · ${formatRs(payout.netPaise)} · ${payout.batchPeriod}`,
                })
              }
            />
            {!profile?.upiId?.trim() ? (
              <Pressable
                style={styles.upiLink}
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push('/(tabs)/profile' as Href);
                }}
              >
                <Ionicons name="create-outline" size={14} color={colors.primary} />
                <Text style={styles.upiLinkText}>Add UPI ID in Profile</Text>
              </Pressable>
            ) : null}
          </Animated.View>
        </ScrollView>
      </View>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={15} color={colors.primary} />
      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, mono && styles.infoMono]} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

function BreakRow({
  label,
  value,
  muted,
  strong,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <View style={styles.breakRow}>
      <Text style={[styles.breakLabel, strong && styles.breakLabelStrong]}>{label}</Text>
      <Text style={[styles.breakValue, muted && styles.breakMuted, strong && styles.breakStrong]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primaryDark },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: layout.pad,
    backgroundColor: colors.white,
  },
  loaderText: { fontFamily: fonts.medium, fontSize: 14, color: colors.muted },

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
    fontSize: 18,
    color: colors.white,
    letterSpacing: -0.3,
  },
  headerSub: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.65)' },
  amountRow: { gap: 2, paddingTop: spacing.xs },
  amountLabel: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.65)' },
  amountValue: { fontFamily: fonts.extraBold, fontSize: 32, color: colors.white, letterSpacing: -0.5 },

  statBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(110,231,183,0.1)',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.22)',
  },
  statWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  statChip: { flex: 1, alignItems: 'center', gap: 1 },
  statNum: { fontFamily: fonts.extraBold, fontSize: 12, color: colors.white },
  statLabel: { fontFamily: fonts.medium, fontSize: 9, color: 'rgba(255,255,255,0.6)' },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },

  sheet: {
    flex: 1,
    marginTop: -SHEET_OVERLAP,
    backgroundColor: SHEET_BG,
    borderTopLeftRadius: radius.xxl + 6,
    borderTopRightRadius: radius.xxl + 6,
    overflow: 'hidden',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(11,110,103,0.22)',
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  scroll: { paddingHorizontal: layout.pad, gap: spacing.lg, paddingTop: spacing.xs },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.xl,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCopy: { flex: 1, gap: 2 },
  statusTitle: { fontFamily: fonts.extraBold, fontSize: 14 },
  statusSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },

  block: { gap: spacing.sm },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  infoCopy: { flex: 1, gap: 1, minWidth: 0 },
  infoLabel: { fontFamily: fonts.semiBold, fontSize: 10, color: colors.muted, letterSpacing: 0.3 },
  infoValue: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  infoMono: { fontFamily: fonts.semiBold, fontSize: 12, letterSpacing: 0.5 },

  breakdown: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  breakRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  breakLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  breakLabelStrong: { fontFamily: fonts.bold, color: colors.ink },
  breakValue: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  breakMuted: { color: colors.muted },
  breakStrong: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.primaryDark },
  breakDivider: { height: 1, backgroundColor: 'rgba(15,20,25,0.08)', marginVertical: 2 },

  lines: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
    overflow: 'hidden',
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(15,20,25,0.06)',
  },
  lineIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineCopy: { flex: 1, gap: 1, minWidth: 0 },
  lineTitle: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  lineSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
  lineAmt: { fontFamily: fonts.extraBold, fontSize: 12, color: colors.success },
  emptyLines: { padding: spacing.lg },
  emptyText: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'center', lineHeight: 17 },

  timeline: { gap: 0 },
  timelineRow: { flexDirection: 'row', gap: spacing.sm },
  timelineRail: { alignItems: 'center', width: 32 },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotActive: {
    borderColor: 'rgba(11,110,103,0.35)',
    backgroundColor: colors.primaryLight,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: 'rgba(11,110,103,0.15)',
    marginVertical: 4,
  },
  timelineCopy: { flex: 1, paddingBottom: spacing.md, gap: 2 },
  timelineTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  timelineSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },

  upiLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  upiLinkText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primary },
});
