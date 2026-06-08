import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import type { OrderSummary } from '../types/checkout.types';
import { formatInr } from '../lib/checkout.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface CheckoutPriceSummaryProps {
  summary: OrderSummary;
  showSavings?: boolean;
}

export function CheckoutPriceSummary({ summary, showSavings = true }: CheckoutPriceSummaryProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Price details</Text>

      <View style={styles.row}>
        <Text style={styles.key}>Service charge</Text>
        <Text style={styles.val}>{formatInr(summary.subtotal)}</Text>
      </View>

      {summary.isPlusMember ? (
        <View style={styles.row}>
          <View style={styles.keyRow}>
            <Ionicons name="diamond" size={12} color="#F59E0B" />
            <Text style={styles.key}>Plus member (10%)</Text>
          </View>
          <Text style={[styles.val, styles.discount]}>-{formatInr(summary.plusDiscount)}</Text>
        </View>
      ) : null}

      {summary.couponDiscount > 0 ? (
        <View style={styles.row}>
          <View style={styles.keyRow}>
            <Ionicons name="pricetag" size={12} color="#B45309" />
            <Text style={styles.key}>Coupon {summary.couponCode}</Text>
          </View>
          <Text style={[styles.val, styles.discount]}>-{formatInr(summary.couponDiscount)}</Text>
        </View>
      ) : null}

      {summary.walletDeduction > 0 ? (
        <View style={styles.row}>
          <View style={styles.keyRow}>
            <Ionicons name="wallet-outline" size={12} color={colors.primary} />
            <Text style={styles.key}>Wallet applied</Text>
          </View>
          <Text style={[styles.val, styles.discount]}>-{formatInr(summary.walletDeduction)}</Text>
        </View>
      ) : null}

      <View style={styles.row}>
        <Text style={styles.key}>Platform fee</Text>
        <Text style={[styles.val, styles.free]}>FREE</Text>
      </View>

      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalKey}>Amount payable</Text>
        <Text style={styles.totalVal}>{formatInr(summary.payable)}</Text>
      </View>

      {showSavings && summary.savings > 0 ? (
        <View style={styles.savings}>
          <LinearGradient colors={['#ECFDF3', '#D1FAE5']} style={StyleSheet.absoluteFill} />
          <Ionicons name="pricetag" size={16} color="#059669" />
          <Text style={styles.savingsText}>You save {formatInr(summary.savings)} on this order</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  key: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.muted,
  },
  val: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  discount: { color: '#059669' },
  free: { color: '#059669', fontFamily: fonts.bold },
  totalRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  totalKey: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.ink,
  },
  totalVal: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.primaryDark,
    letterSpacing: -0.5,
  },
  savings: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  savingsText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: '#059669',
  },
});
