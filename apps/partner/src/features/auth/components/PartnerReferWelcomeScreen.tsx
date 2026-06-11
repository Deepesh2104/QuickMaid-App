import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { QmButton } from '@/components/ui/QmButton';
import { PartnerAuthLayout } from '@/features/auth/components/PartnerAuthLayout';
import {
  REFER_WELCOME_FAQ,
  REFER_WELCOME_REWARDS,
  REFER_WELCOME_STATS,
  REFER_WELCOME_STEPS,
} from '@/features/auth/constants/refer-welcome.premium';
import { useAuthFlow } from '@/context/AuthFlowContext';
import { formatRs } from '@/features/home/lib/home.greeting';
import { REFERRAL_REWARD_PAISE } from '@/features/referral/constants/referral.premium';
import { normalizeReferralCode } from '@/features/referral/lib/referral.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

const NEW_PARTNER_BONUS_PAISE = 20000;

export function PartnerReferWelcomeScreen() {
  const router = useRouter();
  const { referralCode, setReferralCode } = useAuthFlow();
  const [localCode, setLocalCode] = useState(referralCode);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const normalizedPreview = useMemo(() => normalizeReferralCode(localCode), [localCode]);
  const hasValidPreview = normalizedPreview.length > 3;

  const continueToApply = (code: string) => {
    setReferralCode(normalizeReferralCode(code));
    router.push('/(auth)/apply' as Href);
  };

  const skipReferral = () => {
    Haptics.selectionAsync();
    setReferralCode('');
    router.push('/(auth)/apply' as Href);
  };

  return (
    <PartnerAuthLayout
      eyebrow="REFERRAL PROGRAM"
      title="Invite bonus details"
      subtitle="Kisi partner ne invite kiya? Code daalo. Nahi? Skip karke apply karo."
      stats={[...REFER_WELCOME_STATS]}
      showLogo={false}
      onBack={() => router.back()}
      footer={
        <>
          <QmButton
            label="Continue to application"
            icon="arrow-forward"
            onPress={() => continueToApply(localCode)}
          />
          <QmButton label="Skip — no referral code" variant="secondary" onPress={skipReferral} />
        </>
      }
    >
      <View style={styles.body}>
        <Animated.View entering={FadeInDown.duration(280)}>
          <LinearGradient
            colors={['#FFFBEB', '#FFFFFF', '#E6F4F2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroGlow} />
            <View style={styles.heroBadge}>
              <Ionicons name="gift" size={14} color={colors.partnerGold} />
              <Text style={styles.heroBadgeText}>QM REFER PROGRAM</Text>
            </View>
            <Text style={styles.heroTitle}>Join with a referral code</Text>
            <Text style={styles.heroSub}>
              Valid code → referrer {formatRs(REFERRAL_REWARD_PAISE)} · aapko {formatRs(NEW_PARTNER_BONUS_PAISE)}{' '}
              pehli job par
            </Text>
            <View style={styles.heroChips}>
              <View style={styles.heroChip}>
                <Text style={styles.heroChipVal}>7d</Text>
                <Text style={styles.heroChipLbl}>Code window</Text>
              </View>
              <View style={styles.heroChip}>
                <Text style={styles.heroChipVal}>∞</Text>
                <Text style={styles.heroChipLbl}>Invites</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(40).duration(300)}>
          <Text style={styles.sectionEyebrow}>REFERRAL CODE</Text>
          <Text style={styles.sectionTitle}>Partner ne code diya?</Text>
          <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.codeCard}>
            <Text style={styles.codeLabel}>Enter code (e.g. QM-9032107)</Text>
            <TextInput
              style={styles.codeInput}
              value={localCode}
              onChangeText={(v) => setLocalCode(v.toUpperCase())}
              placeholder="QM-XXXXXX"
              placeholderTextColor={colors.placeholder}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            {hasValidPreview ? (
              <View style={styles.previewPill}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={styles.previewText}>Will save as {normalizedPreview}</Text>
              </View>
            ) : (
              <Text style={styles.codeHint}>Optional — galat code par bonus skip, apply block nahi</Text>
            )}
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(300)}>
          <Text style={styles.sectionEyebrow}>HOW IT WORKS</Text>
          <View style={styles.stepsCard}>
            {REFER_WELCOME_STEPS.map((step, i) => (
              <View key={step.title} style={[styles.stepRow, i < REFER_WELCOME_STEPS.length - 1 && styles.stepBorder]}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <View style={styles.stepIcon}>
                  <Ionicons name={step.icon} size={16} color={colors.primaryDark} />
                </View>
                <View style={styles.stepCopy}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepSub}>{step.sub}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(300)}>
          <Text style={styles.sectionEyebrow}>REWARDS</Text>
          <View style={styles.rewardCard}>
            {REFER_WELCOME_REWARDS.map((row, i) => (
              <LinearGradient
                key={row.who}
                colors={i === 0 ? ['#FFFBEB', '#FFF'] : ['#E6F4F2', '#FFF']}
                style={[styles.rewardRow, i < REFER_WELCOME_REWARDS.length - 1 && styles.stepBorder]}
              >
                <View style={styles.rewardCopy}>
                  <Text style={styles.rewardWho}>{row.who}</Text>
                  <Text style={styles.rewardWhen}>{row.when}</Text>
                </View>
                <Text style={styles.rewardAmount}>{row.amount}</Text>
              </LinearGradient>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(300)}>
          <Text style={styles.sectionEyebrow}>FAQ</Text>
          <View style={styles.faqCard}>
            {REFER_WELCOME_FAQ.map((item, i) => {
              const open = expandedFaq === i;
              return (
                <Pressable
                  key={item.q}
                  style={[styles.faqRow, i < REFER_WELCOME_FAQ.length - 1 && styles.stepBorder]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setExpandedFaq(open ? null : i);
                  }}
                >
                  <View style={styles.faqHead}>
                    <Text style={styles.faqQ}>{item.q}</Text>
                    <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.muted} />
                  </View>
                  {open ? <Text style={styles.faqA}>{item.a}</Text> : null}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(300)}>
          <Pressable
            style={styles.policyLink}
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/legal/referral-policy' as Href);
            }}
          >
            <LinearGradient colors={['#E6F4F2', '#FFFFFF']} style={styles.policyGrad}>
              <Ionicons name="document-text-outline" size={18} color={colors.primary} />
              <View style={styles.policyCopy}>
                <Text style={styles.policyTitle}>QuickMaid Referral Policy</Text>
                <Text style={styles.policySub}>Eligibility, payout rules, fraud & disputes</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </PartnerAuthLayout>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.md },
  heroCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(217,119,6,0.2)',
    overflow: 'hidden',
    ...shadow.card,
  },
  heroGlow: {
    position: 'absolute',
    top: -24,
    right: -16,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(245,158,11,0.2)',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.partnerGoldBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  heroBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.partnerGold,
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  heroSub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
  },
  heroChips: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  heroChip: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  heroChipVal: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.primaryDark },
  heroChipLbl: { fontFamily: fonts.regular, fontSize: 9, color: colors.muted },
  sectionEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.8,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  codeCard: {
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.14)',
    ...shadow.sm,
  },
  codeLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.inkSecondary,
  },
  codeInput: {
    fontFamily: fonts.extraBold,
    fontSize: 24,
    color: colors.primaryDark,
    letterSpacing: 2,
    paddingVertical: spacing.sm,
    textAlign: 'center',
  },
  codeHint: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.mutedLight,
    lineHeight: 14,
    textAlign: 'center',
  },
  previewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.successBg,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },
  previewText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.success },
  stepsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  stepBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { fontFamily: fonts.bold, fontSize: 10, color: colors.primaryDark },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCopy: { flex: 1, gap: 2 },
  stepTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  stepSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 16 },
  rewardCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
    ...shadow.sm,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  rewardCopy: { flex: 1 },
  rewardWho: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  rewardWhen: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.muted,
    lineHeight: 14,
    marginTop: 2,
  },
  rewardAmount: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.primaryDark },
  faqCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  faqRow: { paddingVertical: spacing.md },
  faqHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  faqQ: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.ink,
    lineHeight: 17,
  },
  faqA: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 17,
    marginTop: spacing.sm,
  },
  policyLink: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  policyGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  policyCopy: { flex: 1, gap: 2 },
  policyTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.primaryDark },
  policySub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted, lineHeight: 14 },
});
