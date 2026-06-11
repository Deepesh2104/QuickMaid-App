import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatInr } from '@/features/checkout/lib/checkout.utils';
import type { DemoBooking } from '@/constants/demo';
import { formatRefundLines, type RefundBreakdown } from '../lib/booking.cancel';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface BookingCancelSuccessModalProps {
  visible: boolean;
  booking: DemoBooking | null;
  breakdown: RefundBreakdown | null;
  onClose: () => void;
  onRebook: () => void;
}

export function BookingCancelSuccessModal({
  visible,
  booking,
  breakdown,
  onClose,
  onRebook,
}: BookingCancelSuccessModalProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [visible]);

  if (!booking || !breakdown) return null;

  const refundLines = formatRefundLines(breakdown);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.card}>
          <LinearGradient colors={['#FEF3F2', '#FFFFFF']} style={styles.cardBg} />

          <View style={styles.iconWrap}>
            <LinearGradient colors={['#F04438', '#D92D20']} style={styles.iconGrad}>
              <Ionicons name="checkmark" size={32} color={colors.white} />
            </LinearGradient>
          </View>

          <Text style={styles.title}>Booking cancelled</Text>
          <Text style={styles.sub}>Refund initiate ho chuka hai — koi cancellation fee nahi</Text>

          <View style={styles.refundCard}>
            <Text style={styles.refundTotal}>{formatInr(breakdown.refundTotal)}</Text>
            <Text style={styles.refundLabel}>Total refund</Text>
            {booking.refundTxnId ? (
              <Text style={styles.refundId}>Ref {booking.refundTxnId}</Text>
            ) : null}
          </View>

          <View style={styles.lines}>
            {refundLines.map((line) => (
              <View key={line.label} style={styles.line}>
                <View style={styles.lineLeft}>
                  <Ionicons name="arrow-undo-outline" size={16} color="#027A48" />
                  <View>
                    <Text style={styles.lineLabel}>{line.label}</Text>
                    <Text style={styles.lineEta}>{line.eta}</Text>
                  </View>
                </View>
                <Text style={styles.lineAmount}>{line.amount}</Text>
              </View>
            ))}
          </View>

          <View style={styles.bridgeStrip}>
            <LinearGradient colors={['#450A0A', '#B91C1C']} style={StyleSheet.absoluteFill} />
            <Ionicons name="checkmark-circle" size={14} color="#FCA5A5" />
            <Text style={styles.bridgeText}>
              Partner bridge synced · job removed from pro schedule
            </Text>
          </View>

          <View style={styles.points}>
            {[
              'Pro ko visit cancel notify ho gaya',
              'Wallet refund turant credit hoga',
              'UPI/card refund Razorpay se aayega',
            ].map((p) => (
              <View key={p} style={styles.point}>
                <Ionicons name="checkmark-circle" size={14} color="#027A48" />
                <Text style={styles.pointText}>{p}</Text>
              </View>
            ))}
          </View>

          <Pressable style={styles.primary} onPress={onRebook} accessibilityRole="button">
            <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
            <Text style={styles.primaryText}>Book again</Text>
            <Ionicons name="refresh" size={16} color={colors.white} />
          </Pressable>

          <Pressable style={styles.secondary} onPress={onClose} accessibilityRole="button">
            <Text style={styles.secondaryText}>Back to bookings</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,20,25,0.55)',
    justifyContent: 'center',
    paddingHorizontal: layout.pad,
  },
  card: {
    borderRadius: radius.xxl,
    padding: spacing.xl,
    overflow: 'hidden',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  cardBg: { ...StyleSheet.absoluteFill },
  iconWrap: { alignItems: 'center', marginTop: spacing.xs },
  iconGrad: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 19,
  },
  refundCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  refundTotal: { fontFamily: fonts.extraBold, fontSize: 28, color: '#027A48', letterSpacing: -0.5 },
  refundLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  refundId: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.mutedLight, marginTop: 4 },
  lines: { gap: spacing.sm },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.05)',
  },
  lineLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  lineLabel: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink },
  lineEta: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  lineAmount: { fontFamily: fonts.bold, fontSize: 13, color: '#027A48' },
  bridgeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(252,165,165,0.25)',
  },
  bridgeText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 15,
  },
  points: { gap: spacing.sm },
  point: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  pointText: { flex: 1, fontFamily: fonts.medium, fontSize: 12, color: colors.muted, lineHeight: 17 },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 14,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  primaryText: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  secondary: { alignItems: 'center', paddingVertical: spacing.sm },
  secondaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryDark },
});
