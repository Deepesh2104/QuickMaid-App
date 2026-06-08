import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useOpenPlusSubscribe } from '@/features/plus/hooks/useOpenPlusSubscribe';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface ProfileMembershipBannerProps {
  isPlusMember?: boolean;
  visitsLeft?: number;
  renewDate?: string;
}

export function ProfileMembershipBanner({ isPlusMember = true, visitsLeft = 8, renewDate = '1 Jul' }: ProfileMembershipBannerProps) {
  const router = useRouter();
  const openSubscribe = useOpenPlusSubscribe();

  if (isPlusMember) {
    return (
      <Pressable
        style={styles.plusWrap}
        onPress={() => router.push('/(tabs)/plans' as Href)}
        accessibilityRole="button"
      >
        <LinearGradient colors={['#0F1419', '#1A2332']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
        <View style={styles.glow} />
        <View style={styles.plusIcon}>
          <Ionicons name="diamond" size={22} color="#FCD34D" />
        </View>
        <View style={styles.plusCopy}>
          <Text style={styles.plusTitle}>QuickMaid Plus</Text>
          <Text style={styles.plusSub}>{visitsLeft} of 12 visits left · Renews {renewDate}</Text>
        </View>
        <View style={styles.plusBadge}>
          <Text style={styles.plusBadgeText}>Active</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={styles.upgradeWrap}
      onPress={() => openSubscribe('plus')}
      accessibilityRole="button"
    >
      <LinearGradient colors={['#FFF8EE', '#FFFAEB']} style={StyleSheet.absoluteFill} />
      <View style={styles.upgradeIcon}>
        <Ionicons name="diamond-outline" size={20} color="#B54708" />
      </View>
      <View style={styles.upgradeCopy}>
        <Text style={styles.upgradeTitle}>Upgrade to Plus</Text>
        <Text style={styles.upgradeSub}>Save 20% · Same maid · Priority slots</Text>
      </View>
      <Ionicons name="arrow-forward-circle" size={26} color="#B54708" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  plusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    marginBottom: spacing.section,
  },
  glow: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(252,211,77,0.12)',
  },
  plusIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(252,211,77,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusCopy: { flex: 1, gap: 2 },
  plusTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.white,
  },
  plusSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  plusBadge: {
    backgroundColor: 'rgba(110,231,183,0.15)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  plusBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: '#6EE7B7',
    textTransform: 'uppercase',
  },
  upgradeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    marginBottom: spacing.section,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(181,71,8,0.15)',
  },
  upgradeIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: '#FEF0C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeCopy: { flex: 1, gap: 2 },
  upgradeTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: '#93370D',
  },
  upgradeSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
});
