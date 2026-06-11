import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PartnerStackShell } from '@/components/ui/PartnerStackShell';
import { QmButton } from '@/components/ui/QmButton';
import { usePartner } from '@/context/PartnerContext';
import {
  BOOK_HOME_STATS,
  BOOK_HOME_STEPS,
  BOOK_HOME_TRUST,
} from '@/features/book-home/constants/book-home.premium';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import { CUSTOMER_PLAY_URL, openCustomerAppForBooking } from '@/lib/customer-handoff';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export function PartnerBookHomeScreen() {
  const router = useRouter();
  const { profile } = usePartner();
  const [opening, setOpening] = useState(false);
  const [lastResult, setLastResult] = useState<'opened' | 'store' | null>(null);

  const openCustomer = async () => {
    setOpening(true);
    Haptics.selectionAsync();
    const result = await openCustomerAppForBooking(profile?.phone);
    setLastResult(result);
    setOpening(false);
  };

  return (
    <PartnerStackShell
      eyebrow="DUAL ROLE"
      title="Ghar ki safai book karo"
      subtitle="Partner bhi ho, customer bhi — ek hi number se QuickMaid customer app kholo"
      icon="home"
      stats={[...BOOK_HOME_STATS]}
      footer={
        <>
          <QmButton
            label="QuickMaid customer app kholo"
            icon="open-outline"
            onPress={() => void openCustomer()}
            loading={opening}
          />
          <QmButton
            label="Play Store par dekho"
            icon="logo-google-playstore"
            variant="secondary"
            onPress={() => void openCustomerAppForBooking()}
          />
        </>
      }
    >
      <Animated.View entering={FadeInDown.duration(280)} style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Ionicons name="swap-horizontal" size={24} color={colors.primary} />
        </View>
        <Text style={styles.heroTitle}>Customer app handoff</Text>
        <Text style={styles.heroSub}>
          Pehle QuickMaid customer app try karenge. Agar install nahi hai to Play Store khulega.
        </Text>
        {profile?.phone ? (
          <View style={styles.phoneChip}>
            <Ionicons name="phone-portrait-outline" size={14} color={colors.primary} />
            <Text style={styles.phoneText}>+91 {profile.phone} auto-fill hoga</Text>
          </View>
        ) : null}
      </Animated.View>

      {lastResult === 'store' ? (
        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={16} color={colors.warning} />
          <Text style={styles.noteText}>
            Customer app install nahi mili — Play Store khola gaya. Install ke baad dubara try karo.
          </Text>
        </View>
      ) : null}

      <Animated.View entering={FadeInDown.delay(60).duration(300)} style={styles.block}>
        <PartnerRequestsSectionHeader
          eyebrow="How it works"
          title="3 simple steps"
          icon="footsteps-outline"
          compact
        />
        <View style={styles.steps}>
          {BOOK_HOME_STEPS.map((step, i) => (
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

      <Animated.View entering={FadeInDown.delay(120).duration(300)} style={styles.block}>
        <PartnerRequestsSectionHeader
          eyebrow="Trust"
          title="Why QuickMaid customer app"
          icon="shield-checkmark-outline"
          compact
        />
        <View style={styles.trust}>
          {BOOK_HOME_TRUST.map((line) => (
            <View key={line} style={styles.trustRow}>
              <View style={styles.trustDot} />
              <Text style={styles.trustText}>{line}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <Text style={styles.footerHint}>Store: {CUSTOMER_PLAY_URL}</Text>
      <QmButton label="Wapas jao" variant="ghost" onPress={() => router.back()} />
    </PartnerStackShell>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: { fontFamily: fonts.extraBold, fontSize: 17, color: colors.ink },
  heroSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
  phoneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  phoneText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primaryDark },
  note: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: 'rgba(252,211,77,0.15)',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.35)',
  },
  noteText: { flex: 1, fontFamily: fonts.medium, fontSize: 11, color: colors.inkSecondary, lineHeight: 16 },
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
  trust: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  trustRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  trustDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  trustText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.inkSecondary, lineHeight: 17 },
  footerHint: {
    fontFamily: fonts.regular,
    fontSize: 9,
    color: colors.muted,
    textAlign: 'center',
  },
});
