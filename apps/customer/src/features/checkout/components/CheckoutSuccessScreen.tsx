import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCheckout } from '@/context/CheckoutContext';
import { BookingCompletionOtpCard } from '@/features/bookings/components/BookingCompletionOtpCard';
import { CheckoutPartnerBridgeCard } from '@/features/checkout/components/CheckoutPartnerBridgeCard';
import { CheckoutProAssignmentCard } from '@/features/checkout/components/CheckoutProAssignmentCard';
import { formatInr } from '../lib/checkout.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function CheckoutSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { ref } = useLocalSearchParams<{ ref?: string }>();
  const { lastOrder, clearCheckout } = useCheckout();
  const order = lastOrder;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const goBookings = () => {
    clearCheckout();
    router.replace('/(tabs)/bookings' as never);
  };

  const goHome = () => {
    clearCheckout();
    router.replace('/(tabs)' as never);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <LinearGradient colors={['#010F0E', '#084F4A', '#0B6E67']} style={styles.heroGlow}>
            <LinearGradient colors={['#12A598', '#0B6E67']} style={styles.checkCircle}>
              <Ionicons name="checkmark" size={48} color={colors.white} />
            </LinearGradient>
          </LinearGradient>
          <Text style={styles.title}>Order placed!</Text>
          <Text style={styles.sub}>
            {order?.completionOtp
              ? `Pro auto-assigned · ${order.maid}`
              : 'Payment confirmed · Pro assignment in progress'}
          </Text>
        </View>

        <View style={styles.refCard}>
          <Text style={styles.refLabel}>Booking reference</Text>
          <Text style={styles.ref}>{ref ?? order?.bookingRef ?? 'QM-CONFIRMED'}</Text>
          {order?.paymentTxnId ? (
            <Text style={styles.txn}>
              {order.gatewayPaymentId ? `Razorpay ${order.gatewayPaymentId}` : `Txn ${order.paymentTxnId}`}
            </Text>
          ) : null}
          {order?.gatewayOrderId ? (
            <Text style={styles.txn}>Order {order.gatewayOrderId}</Text>
          ) : null}
        </View>

        {order ? (
          <>
            <CheckoutProAssignmentCard order={order} />
            <CheckoutPartnerBridgeCard order={order} />

            <View style={styles.payCard}>
              <View style={styles.payRow}>
                <Ionicons name="shield-checkmark" size={20} color="#059669" />
                <View style={styles.payCopy}>
                  <Text style={styles.payTitle}>Payment successful</Text>
                  <Text style={styles.paySub}>{order.paymentLabel}</Text>
                </View>
                <Text style={styles.payAmt}>
                  {order.amountPaid > 0 ? formatInr(order.amountPaid) : '₹0'}
                </Text>
              </View>
              {order.walletUsed > 0 ? (
                <Text style={styles.walletNote}>Includes {formatInr(order.walletUsed)} from wallet</Text>
              ) : null}
            </View>

            <View style={styles.summary}>
              <View style={styles.sumRow}>
                <Ionicons name={order.icon} size={20} color={colors.primaryDark} />
                <View style={styles.sumCopy}>
                  <Text style={styles.sumName}>{order.service}</Text>
                  <Text style={styles.sumMeta}>
                    {order.date} · {order.slotLabel ?? order.time}
                  </Text>
                  <Text style={styles.sumAddr} numberOfLines={2}>{order.address}</Text>
                </View>
                <Text style={styles.sumPrice}>{order.price}</Text>
              </View>
            </View>

            {order.completionOtp ? (
              <View style={styles.otpWrap}>
                <BookingCompletionOtpCard
                  booking={{
                    id: order.id,
                    service: order.service,
                    icon: order.icon,
                    date: order.date,
                    time: order.time,
                    maid: order.maid,
                    price: order.price,
                    status: 'upcoming',
                    address: order.address,
                    bookingRef: order.bookingRef,
                    duration: order.duration,
                    maidId: order.maidId,
                    maidRating: order.maidRating,
                    maidJobs: order.maidJobs,
                    completionOtp: order.completionOtp,
                    maidAssignedAt: order.maidAssignedAt,
                  }}
                />
              </View>
            ) : null}
          </>
        ) : null}

        <View style={styles.timeline}>
          <Text style={styles.timelineTitle}>What happens next</Text>
          {[
            { icon: 'person-add-outline' as const, t: 'Pro auto-assigned', d: order?.maid ?? 'Best available pro' },
            { icon: 'key-outline' as const, t: 'Completion OTP', d: 'Share with pro when job is done' },
            { icon: 'navigate-outline' as const, t: 'Live tracking', d: 'On visit day' },
            { icon: 'star-outline' as const, t: 'Rate your visit', d: 'After OTP verified' },
          ].map((step, i) => (
            <View key={step.t} style={styles.step}>
              <View style={styles.stepLeft}>
                <View style={styles.stepIcon}>
                  <Ionicons name={step.icon} size={16} color={colors.primaryDark} />
                </View>
                {i < 3 ? <View style={styles.stepLine} /> : null}
              </View>
              <View style={styles.stepCopy}>
                <Text style={styles.stepTitle}>{step.t}</Text>
                <Text style={styles.stepSub}>{step.d}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={styles.primaryBtn} onPress={goBookings} accessibilityRole="button">
          <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
          <Text style={styles.primaryText}>View my bookings</Text>
          <Ionicons name="calendar-outline" size={18} color={colors.white} />
        </Pressable>

        <Pressable style={styles.ghostBtn} onPress={goHome} accessibilityRole="button">
          <Text style={styles.ghostText}>Back to home</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  scroll: {
    padding: layout.pad,
    gap: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  heroGlow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 26,
    color: colors.ink,
    letterSpacing: -0.6,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
  },
  refCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  refLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },
  ref: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.primaryDark,
    letterSpacing: 1,
  },
  txn: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.mutedLight,
    marginTop: 4,
  },
  payCard: {
    backgroundColor: '#ECFDF3',
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(5,150,105,0.2)',
  },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  payCopy: { flex: 1, gap: 2 },
  payTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: '#059669',
  },
  paySub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: '#047857',
  },
  payAmt: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: '#059669',
  },
  walletNote: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: '#047857',
  },
  summary: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  sumRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  sumCopy: { flex: 1, gap: 2 },
  sumName: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.ink,
  },
  sumMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  sumAddr: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.mutedLight,
    marginTop: 2,
  },
  sumPrice: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.primaryDark,
  },
  otpWrap: { marginHorizontal: -layout.pad },
  timeline: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  timelineTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.ink,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stepLeft: { alignItems: 'center' },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 20,
    backgroundColor: colors.divider,
    marginVertical: 4,
  },
  stepCopy: { flex: 1, paddingBottom: spacing.sm, gap: 2 },
  stepTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  stepSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 16,
    overflow: 'hidden',
  },
  primaryText: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.white,
  },
  ghostBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  ghostText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.primary,
  },
});
