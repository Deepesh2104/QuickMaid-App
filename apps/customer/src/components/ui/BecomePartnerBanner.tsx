import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { openPartnerAppStore } from '@/lib/openPartnerStore';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { type } from '@/theme/typography';

interface BecomePartnerBannerProps {
  compact?: boolean;
}

export function BecomePartnerBanner({ compact }: BecomePartnerBannerProps) {
  const open = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    void openPartnerAppStore();
  };

  return (
    <Pressable
      style={[styles.wrap, compact && styles.wrapCompact]}
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel="Become a Partner — opens QuickMaid Partner app on Play Store"
    >
      <LinearGradient colors={['#F0FDF9', '#FFFFFF']} style={StyleSheet.absoluteFill} />
      <View style={styles.icon}>
        <Ionicons name="briefcase-outline" size={20} color={colors.primaryDark} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>Want to earn with QuickMaid?</Text>
        <Text style={styles.title}>Become a Partner</Text>
        {!compact ? (
          <Text style={styles.sub}>Apply on the Partner app — verified pros only</Text>
        ) : null}
      </View>
      <View style={styles.cta}>
        <Ionicons name="logo-google-playstore" size={18} color={colors.primary} />
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.16)',
    overflow: 'hidden',
  },
  wrapCompact: {
    paddingVertical: spacing.md,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  eyebrow: {
    ...type.caption,
    color: colors.muted,
    fontFamily: fonts.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontSize: 10,
  },
  title: {
    ...type.bodySm,
    color: colors.ink,
    fontFamily: fonts.extraBold,
    fontSize: 15,
  },
  sub: {
    ...type.caption,
    color: colors.muted,
    lineHeight: 16,
    marginTop: 2,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
