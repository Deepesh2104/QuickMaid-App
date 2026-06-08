import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getProfileAccount } from '@/features/profile/lib/profile.storage';
import type { ProfileAccountData } from '@/features/profile/types/profile.types';
import { getPlanById, isSubscriptionPlan } from '../lib/plus.plans';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function PlusSubscribeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { plan: planId = 'plus' } = useLocalSearchParams<{ plan?: string }>();
  const [account, setAccount] = useState<ProfileAccountData | null>(null);
  const [loading, setLoading] = useState(true);

  const plan = getPlanById(planId);

  useEffect(() => {
    void getProfileAccount().then((a) => {
      setAccount(a);
      setLoading(false);
    });
  }, []);

  if (!isSubscriptionPlan(planId)) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <Text style={styles.emptyTitle}>Invalid plan</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const alreadyPlus = planId === 'plus' && account?.isPlusMember;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0F1419', '#1A2332', '#0B6E67']}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerGlow} />
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>Membership checkout</Text>
            <Text style={styles.headerTitle}>Subscribe</Text>
          </View>
          <View style={styles.backSpacer} />
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.planCard}>
            <LinearGradient colors={['#0F1419', '#1A2332']} style={styles.planHeader}>
              <View style={styles.planIcon}>
                <Ionicons name={planId === 'plus' ? 'diamond' : 'calendar'} size={22} color="#FCD34D" />
              </View>
              <View style={styles.planCopy}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planVisits}>{plan.visits}</Text>
              </View>
              <View>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planPeriod}>{plan.period}</Text>
              </View>
            </LinearGradient>

            <View style={styles.planBody}>
              <View style={styles.savings}>
                <Ionicons name="trending-down" size={14} color={colors.success} />
                <Text style={styles.savingsText}>{plan.savings} on every visit</Text>
              </View>
              {plan.features.map((f) => (
                <View key={f} style={styles.feature}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>

          {alreadyPlus ? (
            <View style={styles.activeCard}>
              <Ionicons name="diamond" size={20} color="#FCD34D" />
              <View style={styles.activeCopy}>
                <Text style={styles.activeTitle}>You're already Plus</Text>
                <Text style={styles.activeSub}>
                  {account?.plusVisitsLeft} visits left · Renews {account?.plusRenewDate}
                </Text>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.note}>
                <Ionicons name="information-circle-outline" size={18} color={colors.primaryDark} />
                <Text style={styles.noteText}>
                  Billed monthly via Razorpay · Cancel anytime before renewal · Visits roll over 30 days
                </Text>
              </View>

              <View style={styles.perks}>
                {[
                  { icon: 'flash-outline' as const, text: 'Instant activation after payment' },
                  { icon: 'wallet-outline' as const, text: 'Use QuickMaid wallet balance' },
                  { icon: 'shield-checkmark-outline' as const, text: 'Secure UPI & card via Razorpay' },
                ].map((p) => (
                  <View key={p.text} style={styles.perkRow}>
                    <Ionicons name={p.icon} size={16} color={colors.primary} />
                    <Text style={styles.perkText}>{p.text}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      )}

      {!loading && !alreadyPlus ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <View style={styles.footerCopy}>
            <Text style={styles.footerLabel}>{plan.price}{plan.period}</Text>
            <Text style={styles.footerSub}>Billed today · Auto-renews monthly</Text>
          </View>
          <Pressable
            style={styles.footerBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push({ pathname: '/plus/payment', params: { plan: planId } } as Href);
            }}
          >
            <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
            <Text style={styles.footerBtnText}>Continue</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: layout.pad },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  emptyBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.pill },
  emptyBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  header: { paddingHorizontal: layout.pad, paddingBottom: spacing.xl, overflow: 'hidden' },
  headerGlow: {
    position: 'absolute',
    right: -30,
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(252,211,77,0.12)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  backSpacer: { width: 42 },
  headerCopy: { flex: 1, alignItems: 'center', gap: 2 },
  headerEyebrow: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  headerTitle: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.white },
  scroll: { padding: layout.pad, gap: spacing.lg },
  planCard: { borderRadius: radius.xxl, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(15,20,25,0.08)' },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(252,211,77,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planCopy: { flex: 1, gap: 2 },
  planName: { fontFamily: fonts.extraBold, fontSize: 17, color: colors.white },
  planVisits: { fontFamily: fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  planPrice: { fontFamily: fonts.extraBold, fontSize: 22, color: '#6EE7B7', textAlign: 'right' },
  planPeriod: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.65)', textAlign: 'right' },
  planBody: { backgroundColor: colors.white, padding: spacing.lg, gap: spacing.sm },
  savings: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.successBg,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: spacing.xs,
  },
  savingsText: { fontFamily: fonts.bold, fontSize: 11, color: colors.success },
  feature: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  featureText: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkSecondary },
  activeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#FFFAEB',
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(247,144,9,0.2)',
  },
  activeCopy: { flex: 1, gap: 2 },
  activeTitle: { fontFamily: fonts.bold, fontSize: 14, color: '#B54708' },
  activeSub: { fontFamily: fonts.medium, fontSize: 12, color: '#93370D' },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryLight,
  },
  noteText: { flex: 1, fontFamily: fonts.medium, fontSize: 12, color: colors.primaryDark, lineHeight: 18 },
  perks: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  perkText: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  footerCopy: { flex: 1, gap: 2 },
  footerLabel: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.ink },
  footerSub: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    borderRadius: radius.pill,
    overflow: 'hidden',
    minWidth: 140,
  },
  footerBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
});
