import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { listCouponWallet } from '@/features/coupons/lib/coupon.storage';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function ProfileCouponWalletCard() {
  const router = useRouter();
  const [active, setActive] = useState(0);

  const load = useCallback(async () => {
    const rows = await listCouponWallet();
    setActive(rows.filter((c) => c.status === 'active').length);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return (
    <Pressable
      style={styles.wrap}
      onPress={() => {
        Haptics.selectionAsync();
        router.push('/account/coupon-wallet' as Href);
      }}
      accessibilityRole="button"
    >
      <LinearGradient colors={['#FFFBEB', '#FFFFFF']} style={StyleSheet.absoluteFill} />
      <View style={styles.icon}>
        <Ionicons name="pricetag" size={20} color="#B45309" />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>Coupon wallet</Text>
        <Text style={styles.sub}>
          {active > 0 ? `${active} active offer${active === 1 ? '' : 's'} ready` : 'Save on your next booking'}
        </Text>
      </View>
      <View style={styles.pill}>
        <Text style={styles.pillText}>{active}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: layout.pad,
    marginBottom: spacing.section,
    borderRadius: radius.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(245,158,11,0.18)',
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.ink,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  pill: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#B45309',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pillText: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: colors.white,
  },
});
