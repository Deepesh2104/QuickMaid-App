import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CHECKOUT_COUPONS } from '../constants/gateway';
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
  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Ionicons name="pricetag" size={16} color="#B45309" />
        <Text style={styles.title}>Offers & coupons</Text>
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
          {CHECKOUT_COUPONS.map((c) => (
            <Pressable
              key={c.code}
              style={styles.coupon}
              onPress={() => {
                Haptics.selectionAsync();
                onApply(c.code);
              }}
            >
              <Text style={styles.couponCode}>{c.code}</Text>
              <Text style={styles.couponLabel}>{c.label}</Text>
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
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { fontFamily: fonts.bold, fontSize: 14, color: '#92400E' },
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
  couponLabel: { flex: 1, fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
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
