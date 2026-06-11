import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PartnerProfile } from '@/constants/app';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface SectionHeaderProps {
  title: string;
  count: number;
  accent?: string;
}

export function PartnerSectionHeader({ title, count, accent = colors.primary }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={[styles.countPill, { backgroundColor: `${accent}18` }]}>
        <Text style={[styles.countText, { color: accent }]}>{count}</Text>
      </View>
    </View>
  );
}

export function PartnerKycBanner({ profile }: { profile: PartnerProfile | null }) {
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
        <Text style={styles.kycSub}>Tap to start KYC flow · payouts unlock after verify</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
    </Pressable>
  );
}

export function PartnerOfflineEmpty() {
  return (
    <View style={styles.offline}>
      <View style={styles.offlineIcon}>
        <Ionicons name="moon-outline" size={28} color={colors.muted} />
      </View>
      <Text style={styles.offlineTitle}>You&apos;re offline</Text>
      <Text style={styles.offlineSub}>
        Go online to start receiving job requests in your service zone. Most partners get their first offer within minutes.
      </Text>
    </View>
  );
}

export function PartnerWaitingEmpty({ zone = 'Raipur' }: { zone?: string }) {
  return (
    <View style={styles.offline}>
      <View style={[styles.offlineIcon, styles.waitingIcon]}>
        <Ionicons name="radio-outline" size={28} color={colors.primary} />
      </View>
      <Text style={styles.offlineTitle}>Waiting for offers</Text>
      <Text style={styles.offlineSub}>
        You&apos;re live in {zone}. Offers auto-match your active slots — Urban Company style dispatch.
      </Text>
    </View>
  );
}

export function PartnerTrustStrip() {
  return (
    <View style={styles.trust}>
      {[
        { icon: 'shield-checkmark' as const, label: 'Verified payouts' },
        { icon: 'flash' as const, label: 'Fast dispatch' },
        { icon: 'headset' as const, label: '24×7 support' },
      ].map((t) => (
        <View key={t.label} style={styles.trustItem}>
          <Ionicons name={t.icon} size={14} color={colors.primary} />
          <Text style={styles.trustText}>{t.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.ink,
    letterSpacing: -0.2,
  },
  countPill: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  countText: { fontFamily: fonts.extraBold, fontSize: 13 },
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
  offline: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  offlineIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  waitingIcon: { backgroundColor: colors.primaryLight },
  offlineTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  offlineSub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 300,
  },
  trust: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    gap: spacing.sm,
  },
  trustItem: { flex: 1, alignItems: 'center', gap: 6 },
  trustText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 13,
  },
});
