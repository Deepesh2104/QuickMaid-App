import { Ionicons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCheckout } from '@/context/CheckoutContext';
import { computeOrderSummary } from '../lib/checkout.utils';
import { CheckoutPriceSummary } from './CheckoutPriceSummary';
import { CheckoutShell } from './CheckoutShell';
import { CheckoutStickyFooter } from './CheckoutStickyFooter';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function CheckoutCartScreen() {
  const router = useRouter();
  const { draft, account } = useCheckout();
  const item = draft.items[0];
  const summary = account ? computeOrderSummary(draft, account) : null;

  if (!item) {
    return (
      <CheckoutShell step="cart" title="My cart">
        <View style={styles.empty}>
          <Ionicons name="cart-outline" size={48} color={colors.mutedLight} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Browse services on Home to book a visit</Text>
        </View>
      </CheckoutShell>
    );
  }

  return (
    <CheckoutShell
      step="cart"
      title="My cart"
      footer={
        summary ? (
          <CheckoutStickyFooter
            amount={summary.payable}
            label="Select address"
            sub={`${item.name} · 1 item`}
            onPress={() => router.push('/checkout/address' as Href)}
          />
        ) : null
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.trust}>
          <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
          <Text style={styles.trustText}>Verified pros · Pay after service available</Text>
        </View>

        <View style={styles.lineCard}>
          <View style={[styles.icon, { backgroundColor: '#E6F4F2' }]}>
            <Ionicons name={item.icon} size={22} color={colors.primaryDark} />
          </View>
          <View style={styles.lineCopy}>
            <Text style={styles.lineName}>{item.name}</Text>
            {item.duration ? <Text style={styles.lineMeta}>{item.duration} · Raipur</Text> : null}
            <Text style={styles.linePrice}>{item.price}</Text>
          </View>
          <View style={styles.qty}>
            <Text style={styles.qtyText}>Qty 1</Text>
          </View>
        </View>

        <View style={styles.perks}>
          <View style={styles.perk}>
            <Ionicons name="checkmark-circle" size={14} color="#059669" />
            <Text style={styles.perkText}>Background-verified maid</Text>
          </View>
          <View style={styles.perk}>
            <Ionicons name="checkmark-circle" size={14} color="#059669" />
            <Text style={styles.perkText}>Free reschedule up to 2 hrs before</Text>
          </View>
          <View style={styles.perk}>
            <Ionicons name="checkmark-circle" size={14} color="#059669" />
            <Text style={styles.perkText}>100% satisfaction guarantee</Text>
          </View>
        </View>

        {summary ? <CheckoutPriceSummary summary={summary} /> : null}
      </ScrollView>
    </CheckoutShell>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: layout.pad,
    gap: spacing.md,
    paddingBottom: 120,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: layout.pad,
  },
  emptyTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.ink,
  },
  emptySub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: radius.xl,
  },
  trustText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  lineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineCopy: { flex: 1, gap: 2 },
  lineName: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.ink,
  },
  lineMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  linePrice: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.primaryDark,
    marginTop: 4,
  },
  qty: {
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  qtyText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.muted,
  },
  perks: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  perkText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.ink,
  },
});
