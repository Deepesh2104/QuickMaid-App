import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PartnerStackShell } from '@/components/ui/PartnerStackShell';
import { QmButton } from '@/components/ui/QmButton';
import { usePartner } from '@/context/PartnerContext';
import { usePartnerAlert } from '@/context/PartnerAlertContext';
import { formatRs } from '@/features/home/lib/home.greeting';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import {
  DEMO_REFERRALS,
  REFERRAL_STATUS_META,
} from '@/features/referral/constants/referral.demo';
import {
  REFERRAL_FAQ,
  REFERRAL_REWARD_PAISE,
  REFERRAL_STATS,
  REFERRAL_STEPS,
} from '@/features/referral/constants/referral.premium';
import { normalizeReferralCode } from '@/features/referral/lib/referral.utils';
import { copyToClipboard } from '@/lib/clipboard';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

function referralCode(publicId?: string, phone?: string): string {
  if (publicId) return normalizeReferralCode(publicId.replace(/^MD-/, 'QM-'));
  if (phone) return normalizeReferralCode(`QM-${phone.slice(-6)}`);
  return 'QM-PARTNER';
}

export function PartnerReferralScreen() {
  const router = useRouter();
  const { profile } = usePartner();
  const { alert } = usePartnerAlert();
  const [copied, setCopied] = useState(false);
  const code = referralCode(profile?.publicId, profile?.phone);
  const earned = DEMO_REFERRALS.filter((r) => r.status === 'paid').length * REFERRAL_REWARD_PAISE;

  const shareMessage =
    `QuickMaid partner bano aur safai ki jobs kamao! Mera referral code: ${code}. Register karte waqt daalna — pehli job complete par bonus. https://quickmaid.in/partner`;

  const copyCode = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const ok = await copyToClipboard(code);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const shareReferral = async () => {
    Haptics.selectionAsync();
    try {
      await Share.share({ message: shareMessage, title: 'QuickMaid partner referral' });
    } catch {
      alert({
        title: 'Referral code',
        message: code,
        variant: 'teal',
        icon: 'gift-outline',
        hint: 'Code copy karke WhatsApp par bhejo',
        buttons: [{ text: 'OK' }],
      });
    }
  };

  return (
    <PartnerStackShell
      eyebrow="EARN MORE"
      title="Refer a partner"
      subtitle={`Dusri maid ko invite karo — ${formatRs(REFERRAL_REWARD_PAISE)} bonus jab wo pehli job complete kare`}
      icon="gift"
      stats={[...REFERRAL_STATS]}
      footer={
        <View style={styles.footerRow}>
          <QmButton
            label={copied ? 'Copied!' : 'Copy code'}
            icon={copied ? 'checkmark' : 'copy-outline'}
            variant="secondary"
            onPress={() => void copyCode()}
          />
          <QmButton label="Share invite" icon="share-social-outline" onPress={() => void shareReferral()} />
        </View>
      }
    >
      <Animated.View entering={FadeInDown.duration(280)}>
        <LinearGradient
          colors={['#FFFBEB', '#FFFFFF', '#E6F4F2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.codeCard}
        >
          <View style={styles.codeGlow} />
          <View style={styles.codeTop}>
            <View style={styles.codeBadge}>
              <Ionicons name="gift" size={14} color={colors.partnerGold} />
              <Text style={styles.codeBadgeText}>YOUR CODE</Text>
            </View>
            {copied ? (
              <View style={styles.copiedPill}>
                <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                <Text style={styles.copiedText}>Copied</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.codeValue}>{code}</Text>
          <Text style={styles.codeHint}>
            Nayi partner refer-welcome screen par daale · tumhe {formatRs(REFERRAL_REWARD_PAISE)} milega
          </Text>
          <View style={styles.codeActions}>
            <Pressable style={styles.codeActionBtn} onPress={() => void copyCode()}>
              <Ionicons name="copy-outline" size={16} color={colors.primaryDark} />
              <Text style={styles.codeActionText}>Copy</Text>
            </Pressable>
            <View style={styles.codeActionDiv} />
            <Pressable style={styles.codeActionBtn} onPress={() => void shareReferral()}>
              <Ionicons name="logo-whatsapp" size={16} color="#128C7E" />
              <Text style={styles.codeActionText}>Share</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(40).duration(300)} style={styles.block}>
        <PartnerRequestsSectionHeader eyebrow="How it works" title="3 steps" icon="footsteps-outline" compact />
        <View style={styles.steps}>
          {REFERRAL_STEPS.map((step, i) => (
            <View key={step.title} style={[styles.stepRow, i < REFERRAL_STEPS.length - 1 && styles.stepBorder]}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <View style={styles.stepIcon}>
                <Ionicons name={step.icon} size={16} color={colors.primary} />
              </View>
              <View style={styles.stepCopy}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepSub}>{step.sub}</Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(300)} style={styles.block}>
        <PartnerRequestsSectionHeader
          eyebrow="History"
          title="My referrals"
          subtitle={`${formatRs(earned)} earned so far`}
          icon="people-outline"
          compact
        />
        <View style={styles.historyCard}>
          {DEMO_REFERRALS.map((ref, i) => {
            const meta = REFERRAL_STATUS_META[ref.status];
            return (
              <View key={ref.id} style={[styles.historyRow, i < DEMO_REFERRALS.length - 1 && styles.historyBorder]}>
                <View style={[styles.historyIcon, { backgroundColor: meta.bg }]}>
                  <Ionicons name={meta.icon} size={16} color={meta.color} />
                </View>
                <View style={styles.historyCopy}>
                  <Text style={styles.historyName}>{ref.name}</Text>
                  <Text style={styles.historyNote}>{ref.note}</Text>
                  <Text style={styles.historyMeta}>
                    {ref.joinedAt !== '—' ? `Joined ${ref.joinedAt}` : 'Invite pending'} · {ref.phoneMask}
                  </Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={[styles.historyStatus, { color: meta.color }]}>{meta.label}</Text>
                  <Text style={styles.historyBonus}>{formatRs(ref.bonusPaise)}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(300)}>
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
              <Text style={styles.policyTitle}>Referral policy</Text>
              <Text style={styles.policySub}>Eligibility, ₹500 payout rules & fraud guidelines</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
          </LinearGradient>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(300)} style={styles.block}>
        <PartnerRequestsSectionHeader eyebrow="FAQ" title="Common questions" icon="help-circle-outline" compact />
        <View style={styles.faq}>
          {REFERRAL_FAQ.map((item) => (
            <View key={item.q} style={styles.faqRow}>
              <Text style={styles.faqQ}>{item.q}</Text>
              <Text style={styles.faqA}>{item.a}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <QmButton label="Wapas jao" variant="ghost" onPress={() => router.back()} />
    </PartnerStackShell>
  );
}

const styles = StyleSheet.create({
  footerRow: { gap: spacing.sm },
  codeCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(217,119,6,0.22)',
    overflow: 'hidden',
    ...shadow.card,
  },
  codeGlow: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(245,158,11,0.18)',
  },
  codeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.partnerGoldBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  codeBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.partnerGold,
    letterSpacing: 0.8,
  },
  copiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.successBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  copiedText: { fontFamily: fonts.bold, fontSize: 10, color: colors.success },
  codeValue: {
    fontFamily: fonts.extraBold,
    fontSize: 30,
    color: colors.primaryDark,
    letterSpacing: 2,
    textAlign: 'center',
  },
  codeHint: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 16,
  },
  codeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  codeActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  codeActionDiv: {
    width: StyleSheet.hairlineWidth,
    height: 28,
    backgroundColor: colors.divider,
  },
  codeActionText: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  block: { gap: spacing.sm },
  steps: {
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
  stepBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
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
  historyCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.2)',
    ...shadow.sm,
  },
  historyRow: { flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.sm },
  historyBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyCopy: { flex: 1, gap: 2 },
  historyName: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  historyNote: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  historyMeta: { fontFamily: fonts.medium, fontSize: 10, color: colors.mutedLight },
  historyRight: { alignItems: 'flex-end', gap: 2 },
  historyStatus: { fontFamily: fonts.bold, fontSize: 10 },
  historyBonus: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.ink },
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
  faq: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  faqRow: { gap: 4 },
  faqQ: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink },
  faqA: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 16 },
});
