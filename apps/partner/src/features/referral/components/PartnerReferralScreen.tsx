import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';
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
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

function referralCode(publicId?: string, phone?: string): string {
  if (publicId) return publicId.replace(/^MD-/, 'QM-');
  if (phone) return `QM-${phone.slice(-6)}`;
  return 'QM-PARTNER';
}

export function PartnerReferralScreen() {
  const router = useRouter();
  const { profile } = usePartner();
  const { alert } = usePartnerAlert();
  const code = referralCode(profile?.publicId, profile?.phone);
  const earned = DEMO_REFERRALS.filter((r) => r.status === 'paid').length * REFERRAL_REWARD_PAISE;

  const shareReferral = async () => {
    Haptics.selectionAsync();
    const message =
      `QuickMaid partner bano aur safai ki jobs kamao! Mera referral code: ${code}. Register karte waqt daalna — pehli job complete par bonus. https://quickmaid.in/partner`;
    try {
      await Share.share({ message, title: 'QuickMaid partner referral' });
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
      footer={<QmButton label="Code share karo" icon="share-social-outline" onPress={() => void shareReferral()} />}
    >
      <Animated.View entering={FadeInDown.duration(280)} style={styles.codeCard}>
        <Text style={styles.codeLabel}>Tumhara referral code</Text>
        <Text style={styles.codeValue}>{code}</Text>
        <Text style={styles.codeHint}>Apply form ya support chat mein share karo</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(40).duration(300)} style={styles.block}>
        <PartnerRequestsSectionHeader eyebrow="How it works" title="3 steps" icon="footsteps-outline" compact />
        <View style={styles.steps}>
          {REFERRAL_STEPS.map((step, i) => (
            <View key={step.title} style={styles.stepRow}>
              <View style={styles.stepIcon}>
                <Ionicons name={step.icon} size={18} color={colors.primary} />
              </View>
              <View style={styles.stepCopy}>
                <Text style={styles.stepTitle}>
                  {i + 1}. {step.title}
                </Text>
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
  codeCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.35)',
  },
  codeLabel: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted },
  codeValue: { fontFamily: fonts.extraBold, fontSize: 26, color: colors.primary, letterSpacing: 1 },
  codeHint: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  block: { gap: spacing.sm },
  steps: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  stepRow: { flexDirection: 'row', gap: spacing.sm },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
