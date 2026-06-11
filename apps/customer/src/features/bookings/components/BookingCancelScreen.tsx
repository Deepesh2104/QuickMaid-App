import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormScreenSkeleton } from '@/components/ui/Skeleton';
import type { DemoBooking } from '@/constants/demo';
import { formatInr } from '@/features/checkout/lib/checkout.utils';
import { cancelBookingById } from '@/features/checkout/lib/bookings.storage';
import { publishCustomerBookingStatus } from '@/lib/booking-status-bridge.storage';
import { getBookingById } from '../lib/booking.lookup';
import {
  CANCEL_REASONS,
  computeRefundBreakdown,
  formatRefundLines,
  generateRefundTxnId,
  type CancelReasonId,
} from '../lib/booking.cancel';
import { BookingChangeBridgeCard } from './BookingChangeBridgeCard';
import { BookingCancelConfirmModal } from './BookingCancelConfirmModal';
import { BookingCancelSuccessModal } from './BookingCancelSuccessModal';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function BookingCancelScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<DemoBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reasonId, setReasonId] = useState<CancelReasonId | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [cancelledBooking, setCancelledBooking] = useState<DemoBooking | null>(null);

  const loadBooking = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const b = await getBookingById(id);
    setBooking(b ?? null);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void loadBooking();
  }, [loadBooking]);

  const breakdown = useMemo(
    () => (booking ? computeRefundBreakdown(booking) : null),
    [booking],
  );

  const refundLines = useMemo(
    () => (breakdown ? formatRefundLines(breakdown) : []),
    [breakdown],
  );

  const reasonLabel = CANCEL_REASONS.find((r) => r.id === reasonId)?.label ?? '';
  const canProceed = Boolean(reasonId && breakdown);

  const confirmCancel = async () => {
    if (!booking || !breakdown || !reasonId || saving) return;
    setSaving(true);

    const refundTxnId = generateRefundTxnId();
    const updated = await cancelBookingById(booking.id, {
      cancelReason: reasonLabel,
      refundAmount: breakdown.refundTotal,
      refundTxnId,
      walletRefund: breakdown.walletRefund,
      gatewayRefund: breakdown.gatewayRefund,
      paymentLabel: breakdown.paymentLabel,
      bookingRef: booking.bookingRef,
    });

    setSaving(false);
    setConfirmVisible(false);

    if (!updated) return;

    if (updated.bookingRef) {
      await publishCustomerBookingStatus({
        bookingRef: updated.bookingRef,
        customerBookingId: updated.id,
        event: 'customer_cancelled',
        cancelReason: reasonLabel,
      });
    }

    setCancelledBooking(updated);
    setSuccessVisible(true);
  };

  if (loading) {
    return <FormScreenSkeleton />;
  }

  if (!booking) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <Ionicons name="calendar-outline" size={48} color={colors.muted} />
        <Text style={styles.emptyTitle}>Booking not found</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  if (booking.status !== 'upcoming') {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <Ionicons name="lock-closed-outline" size={48} color={colors.muted} />
        <Text style={styles.emptyTitle}>Cannot cancel</Text>
        <Text style={styles.emptySub}>Sirf upcoming visits cancel ki ja sakti hain</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#7A271A', '#B42318', '#D92D20']}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerGlow} />
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>Free cancellation</Text>
            <Text style={styles.headerTitle}>Cancel booking</Text>
          </View>
          <View style={styles.backBtnSpacer} />
        </View>

        <View style={styles.bookingCard}>
          <Text style={styles.bookingEyebrow}>Upcoming visit</Text>
          <Text style={styles.bookingService}>{booking.service}</Text>
          <View style={styles.bookingMeta}>
            <View style={styles.bookingChip}>
              <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.85)" />
              <Text style={styles.bookingChipText}>{booking.date}</Text>
            </View>
            <View style={styles.bookingChip}>
              <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.85)" />
              <Text style={styles.bookingChipText}>{booking.slotLabel ?? booking.time}</Text>
            </View>
          </View>
          <Text style={styles.bookingPro}>{booking.maid} · {booking.price}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
      >
        <BookingChangeBridgeCard booking={booking} variant="cancel" />

        {breakdown ? (
          <View style={styles.refundBlock}>
            <View style={styles.refundHeader}>
              <Ionicons name="wallet-outline" size={18} color="#027A48" />
              <Text style={styles.refundTitle}>Refund breakdown</Text>
            </View>
            <Text style={styles.refundTotal}>{formatInr(breakdown.refundTotal)}</Text>
            <Text style={styles.refundSub}>Full amount · no cancellation fee</Text>

            <View style={styles.refundLines}>
              {refundLines.map((line) => (
                <View key={line.label} style={styles.refundLine}>
                  <View style={styles.refundLineCopy}>
                    <Text style={styles.refundLineLabel}>{line.label}</Text>
                    <Text style={styles.refundLineEta}>{line.eta}</Text>
                  </View>
                  <Text style={styles.refundLineAmount}>{line.amount}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Why are you cancelling?</Text>
        <View style={styles.reasons}>
          {CANCEL_REASONS.map((r) => {
            const on = reasonId === r.id;
            return (
              <Pressable
                key={r.id}
                style={[styles.reason, on && styles.reasonOn]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setReasonId(r.id);
                }}
              >
                <View style={[styles.reasonIcon, on && styles.reasonIconOn]}>
                  <Ionicons name={r.icon} size={16} color={on ? '#D92D20' : colors.muted} />
                </View>
                <Text style={[styles.reasonText, on && styles.reasonTextOn]}>{r.label}</Text>
                {on ? <Ionicons name="checkmark-circle" size={18} color="#D92D20" /> : null}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.policy}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#027A48" />
          <Text style={styles.policyText}>
            Cancel free up to 2 hours before your slot. Refund Razorpay se original payment method par aayega.
          </Text>
        </View>

        <View style={styles.altCard}>
          <View style={styles.altIcon}>
            <Ionicons name="calendar-outline" size={18} color={colors.primaryDark} />
          </View>
          <View style={styles.altCopy}>
            <Text style={styles.altTitle}>Reschedule instead?</Text>
            <Text style={styles.altSub}>Slot change karna free hai — pro same rahegi</Text>
          </View>
          <Pressable
            style={styles.altBtn}
            onPress={() => router.replace({ pathname: '/booking/reschedule/[id]', params: { id: booking.id } })}
          >
            <Text style={styles.altBtnText}>Reschedule</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={styles.footerCopy}>
          <Text style={styles.footerLabel}>Full refund</Text>
          <Text style={styles.footerSub}>
            {canProceed ? reasonLabel : 'Select a reason to continue'}
          </Text>
        </View>
        <Pressable
          style={[styles.footerBtn, !canProceed && styles.footerBtnOff]}
          onPress={() => {
            if (!canProceed) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setConfirmVisible(true);
          }}
          disabled={!canProceed}
          accessibilityRole="button"
        >
          <LinearGradient colors={['#D92D20', '#B42318']} style={StyleSheet.absoluteFill} />
          <Text style={styles.footerBtnText}>Cancel booking</Text>
        </Pressable>
      </View>

      <BookingCancelConfirmModal
        visible={confirmVisible}
        booking={booking}
        breakdown={breakdown}
        reasonLabel={reasonLabel}
        loading={saving}
        onClose={() => setConfirmVisible(false)}
        onConfirm={() => void confirmCancel()}
      />

      <BookingCancelSuccessModal
        visible={successVisible}
        booking={cancelledBooking}
        breakdown={breakdown}
        onClose={() => {
          setSuccessVisible(false);
          router.replace('/(tabs)/bookings');
        }}
        onRebook={() => {
          setSuccessVisible(false);
          router.replace('/(tabs)');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F8' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: layout.pad,
    backgroundColor: '#F4F6F8',
  },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  emptySub: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted, textAlign: 'center' },
  emptyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  emptyBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  header: {
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    right: -30,
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backBtnSpacer: { width: 42 },
  headerCopy: { flex: 1, alignItems: 'center', gap: 2 },
  headerEyebrow: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  headerTitle: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.white, letterSpacing: -0.3 },
  bookingCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  bookingEyebrow: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  bookingService: { fontFamily: fonts.extraBold, fontSize: 17, color: colors.white },
  bookingMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  bookingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  bookingChipText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.white },
  bookingPro: { fontFamily: fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  scroll: { padding: layout.pad, gap: spacing.lg },
  refundBlock: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: 'rgba(5,150,105,0.2)',
  },
  refundHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  refundTitle: { fontFamily: fonts.bold, fontSize: 13, color: '#065F46' },
  refundTotal: { fontFamily: fonts.extraBold, fontSize: 28, color: '#027A48', letterSpacing: -0.5 },
  refundSub: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  refundLines: { marginTop: spacing.sm, gap: spacing.sm },
  refundLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  refundLineCopy: { flex: 1, gap: 2 },
  refundLineLabel: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink },
  refundLineEta: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  refundLineAmount: { fontFamily: fonts.bold, fontSize: 13, color: '#027A48' },
  sectionTitle: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  reasons: { gap: spacing.sm },
  reason: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  reasonOn: { borderColor: '#FDA29B', backgroundColor: '#FEF3F2' },
  reasonIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonIconOn: { backgroundColor: colors.white },
  reasonText: { flex: 1, fontFamily: fonts.semiBold, fontSize: 14, color: colors.muted },
  reasonTextOn: { color: '#B42318', fontFamily: fonts.bold },
  policy: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: '#ECFDF5',
  },
  policyText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: '#065F46',
    lineHeight: 18,
  },
  altCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  altIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  altCopy: { flex: 1, gap: 2 },
  altTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  altSub: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  altBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  altBtnText: { fontFamily: fonts.bold, fontSize: 12, color: colors.primaryDark },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  footerCopy: { flex: 1, gap: 2 },
  footerLabel: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  footerSub: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  footerBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    borderRadius: radius.pill,
    overflow: 'hidden',
    minWidth: 148,
  },
  footerBtnOff: { opacity: 0.45 },
  footerBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
});
