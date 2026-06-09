import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatInr } from '@/features/checkout/lib/checkout.utils';
import { useProfileAccount } from '@/features/profile/hooks/useProfileAccount';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { buildReferralSummary, getReferralEvents } from '../lib/referral.storage';
import type { ReferralEvent, ReferralEventStatus } from '../types/referral.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const STATUS_THEME: Record<ReferralEventStatus, { label: string; ink: string; tone: string }> = {
  credited: { label: 'Credited', ink: '#027A48', tone: '#ECFDF3' },
  pending: { label: 'Pending', ink: '#B45309', tone: '#FFFBEB' },
  expired: { label: 'Expired', ink: '#667085', tone: '#F2F4F7' },
};

const STEPS = [
  { icon: 'share-social-outline' as const, title: 'Share your code', sub: 'WhatsApp, SMS or any app' },
  { icon: 'person-add-outline' as const, title: 'Friend books', sub: 'They use your code at checkout' },
  { icon: 'wallet-outline' as const, title: 'You both earn', sub: '₹100 wallet credit each' },
];

function formatReferralDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ReferralRewardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { account, loading: accountLoading } = useProfileAccount();
  const [events, setEvents] = useState<ReferralEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const list = await getReferralEvents();
    setEvents(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const summary = useMemo(
    () => buildReferralSummary(account?.referralCode ?? 'QM100', events),
    [account?.referralCode, events],
  );

  const share = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `Book home cleaning on QuickMaid with my code ${summary.code} — we both get ₹100! https://quickmaid.app`,
      });
    } catch {
      // dismissed
    }
  };

  const copyCode = async () => {
    await Clipboard.setStringAsync(summary.code);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (accountLoading || loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#2E1065', '#53389E', '#6941C6', '#7F56D9']}
        locations={[0, 0.35, 0.7, 1]}
        style={[styles.hero, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.glowA} />
        <View style={styles.glowB} />

        <View style={styles.heroRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>REFERRAL REWARDS</Text>
            <Text style={styles.heroTitle}>Give ₹100, get ₹100</Text>
          </View>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Your referral code</Text>
          <View style={styles.codeRow}>
            <Text style={styles.code}>{summary.code}</Text>
            <Pressable style={styles.copyBtn} onPress={() => void copyCode()} accessibilityLabel="Copy code">
              <Ionicons name="copy-outline" size={16} color="#53389E" />
            </Pressable>
          </View>
          <Text style={styles.codeSub}>Friends save on first clean · You earn wallet credit</Text>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statVal}>{formatInr(summary.totalEarned)}</Text>
              <Text style={styles.statLbl}>Total earned</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statVal}>{formatInr(summary.pendingAmount)}</Text>
              <Text style={styles.statLbl}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statVal}>{summary.successfulReferrals}</Text>
              <Text style={styles.statLbl}>Successful</Text>
            </View>
          </View>

          <HomeSectionHeader
            eyebrow="How it works"
            title="Earn in 3 steps"
            subtitle="No limit on referrals"
            icon="flash-outline"
            compact
          />

          <View style={styles.stepsCard}>
            {STEPS.map((step, i) => (
              <View key={step.title} style={[styles.step, i < STEPS.length - 1 && styles.stepBorder]}>
                <View style={styles.stepIcon}>
                  <Ionicons name={step.icon} size={18} color="#53389E" />
                </View>
                <View style={styles.stepCopy}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepSub}>{step.sub}</Text>
                </View>
                <Text style={styles.stepNum}>{i + 1}</Text>
              </View>
            ))}
          </View>

          <HomeSectionHeader
            eyebrow="Your invites"
            title="Referral history"
            subtitle={`${events.length} invite${events.length === 1 ? '' : 's'} tracked`}
            icon="people-outline"
            compact
          />

          <View style={styles.list}>
            {events.map((event, i) => {
              const theme = STATUS_THEME[event.status];
              return (
                <View key={event.id} style={[styles.event, i < events.length - 1 && styles.eventBorder]}>
                  <View style={[styles.eventIcon, { backgroundColor: theme.tone }]}>
                    <Ionicons
                      name={event.status === 'credited' ? 'checkmark-circle' : 'time-outline'}
                      size={16}
                      color={theme.ink}
                    />
                  </View>
                  <View style={styles.eventCopy}>
                    <Text style={styles.eventName}>{event.friendName}</Text>
                    <Text style={styles.eventMeta}>
                      {formatReferralDate(event.createdAt)}
                      {event.friendPhone ? ` · ${event.friendPhone}` : ''}
                    </Text>
                  </View>
                  <View style={styles.eventRight}>
                    <Text style={styles.eventAmt}>+{formatInr(event.rewardAmount)}</Text>
                    <View style={[styles.eventPill, { backgroundColor: theme.tone }]}>
                      <Text style={[styles.eventPillText, { color: theme.ink }]}>{theme.label}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.trustCard}>
            <Ionicons name="information-circle-outline" size={18} color="#53389E" />
            <Text style={styles.trustText}>
              Rewards credit to your QuickMaid wallet after your friend completes their first paid visit.
              Pending invites expire after 30 days.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <Pressable style={styles.shareBtn} onPress={() => void share()}>
          <LinearGradient
            colors={['#53389E', '#6941C6', '#7F56D9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shareGrad}
          >
            <Ionicons name="share-social" size={18} color={colors.white} />
            <Text style={styles.shareText}>Share referral code</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F8' },

  hero: { paddingBottom: spacing.xl + spacing.md, overflow: 'hidden' },
  glowA: {
    position: 'absolute',
    right: -40,
    top: 40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(233,215,254,0.18)',
  },
  glowB: {
    position: 'absolute',
    left: -30,
    bottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.pad,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: { flex: 1, gap: 2 },
  heroEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.1,
  },
  heroTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.white,
    letterSpacing: -0.4,
  },
  codeCard: {
    marginHorizontal: layout.pad,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.xxl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    gap: spacing.sm,
  },
  codeLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  code: {
    flex: 1,
    fontFamily: fonts.extraBold,
    fontSize: 28,
    color: colors.white,
    letterSpacing: 4,
  },
  copyBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
  },

  sheet: {
    marginTop: -spacing.lg,
    backgroundColor: '#F4F6F8',
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginBottom: spacing.lg,
  },

  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: layout.pad,
    marginBottom: spacing.section,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  statVal: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  statLbl: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  stepsCard: {
    marginHorizontal: layout.pad,
    marginBottom: spacing.section,
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  stepBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: '#F4F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCopy: { flex: 1, gap: 2 },
  stepTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  stepSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  stepNum: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.bgMuted,
  },

  list: {
    marginHorizontal: layout.pad,
    marginBottom: spacing.section,
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  event: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  eventBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  eventIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventCopy: { flex: 1, gap: 2 },
  eventName: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  eventMeta: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
  eventRight: { alignItems: 'flex-end', gap: 4 },
  eventAmt: { fontFamily: fonts.bold, fontSize: 13, color: '#53389E' },
  eventPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  eventPillText: { fontFamily: fonts.bold, fontSize: 9 },

  trustCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginHorizontal: layout.pad,
    backgroundColor: '#F4F3FF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(105,65,198,0.12)',
  },
  trustText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
    backgroundColor: 'rgba(244,246,248,0.96)',
  },
  shareBtn: { borderRadius: radius.pill, overflow: 'hidden' },
  shareGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
  },
  shareText: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
});
