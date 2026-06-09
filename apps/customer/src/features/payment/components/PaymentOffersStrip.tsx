import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { listCouponWallet } from '@/features/coupons/lib/coupon.storage';
import { useEffect, useState } from 'react';
import { formatInr } from '@/features/checkout/lib/checkout.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface PaymentOffersStripProps {
  appliedCode?: string;
  discount: number;
  onApply: (code: string) => void;
  onRemove: () => void;
}

export function PaymentOffersStrip({ appliedCode, discount, onApply, onRemove }: PaymentOffersStripProps) {
  const router = useRouter();
  const [activeCoupons, setActiveCoupons] = useState<{ code: string; title: string }[]>([]);

  useEffect(() => {
    void listCouponWallet().then((rows) => {
      setActiveCoupons(
        rows
          .filter((c) => c.status === 'active')
          .slice(0, 4)
          .map((c) => ({ code: c.code, title: c.title })),
      );
    });
  }, [appliedCode]);

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Ionicons name="pricetag" size={16} color="#B45309" />
        <Text style={styles.title}>Offers & coupons</Text>
        <Pressable
          style={styles.walletLink}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/account/coupon-wallet' as Href);
          }}
        >
          <Text style={styles.walletLinkText}>Wallet</Text>
          <Ionicons name="chevron-forward" size={12} color="#B45309" />
        </Pressable>
      </View>

      {appliedCode ? (
        <View style={styles.applied}>
          <View>
            <Text style={styles.code}>{appliedCode} applied</Text>
            <Text style={styles.saved}>You save {formatInr(discount)}</Text>
          </View>
          <Pressable onPress={() => { Haptics.selectionAsync(); onRemove(); }}>
            <Text style={styles.remove}>Remove</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.list}>
          {activeCoupons.map((c) => (
            <Pressable
              key={c.code}
              style={styles.coupon}
              onPress={() => {
                Haptics.selectionAsync();
                onApply(c.code);
              }}
            >
              <Text style={styles.couponCode}>{c.code}</Text>
              <Text style={styles.couponLabel} numberOfLines={2}>{c.title}</Text>
              <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFBEB',
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minWidth: 0 },
  title: { flex: 1, minWidth: 0, fontFamily: fonts.bold, fontSize: 14, color: '#92400E' },
  walletLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  walletLinkText: { fontFamily: fonts.semiBold, fontSize: 11, color: '#B45309' },
  list: { gap: spacing.sm },
  coupon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(245,158,11,0.15)',
  },
  couponCode: { fontFamily: fonts.extraBold, fontSize: 13, color: '#B45309' },
  couponLabel: { flex: 1, minWidth: 0, fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  applied: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  code: { fontFamily: fonts.bold, fontSize: 14, color: '#059669' },
  saved: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  remove: { fontFamily: fonts.bold, fontSize: 13, color: '#D92D20' },
});
