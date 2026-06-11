import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatInr } from '@/features/checkout/lib/checkout.utils';
import type { DemoBooking } from '@/constants/demo';
import type { RefundBreakdown } from '../lib/booking.cancel';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface BookingCancelConfirmModalProps {
  visible: boolean;
  booking: DemoBooking | null;
  breakdown: RefundBreakdown | null;
  reasonLabel: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function BookingCancelConfirmModal({
  visible,
  booking,
  breakdown,
  reasonLabel,
  loading,
  onClose,
  onConfirm,
}: BookingCancelConfirmModalProps) {
  const insets = useSafeAreaInsets();
  if (!booking || !breakdown) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, { paddingBottom: insets.bottom }]}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <View style={styles.iconCircle}>
              <Ionicons name="warning-outline" size={28} color="#D92D20" />
            </View>
          </View>

          <Text style={styles.title}>Cancel this visit?</Text>
          <Text style={styles.sub}>
            {booking.service} · {booking.date} · {booking.maid} ko notify kiya jayega
          </Text>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Reason</Text>
              <Text style={styles.summaryValue}>{reasonLabel}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Refund</Text>
              <Text style={styles.summaryRefund}>{formatInr(breakdown.refundTotal)}</Text>
            </View>
          </View>

          <Text style={styles.hint}>Yeh action undo nahi ho sakta. Pro auto-unassign ho jayegi.</Text>

          <View style={styles.bridgeStrip}>
            <LinearGradient colors={['#450A0A', '#991B1B']} style={StyleSheet.absoluteFill} />
            <Ionicons name="swap-horizontal" size={14} color="#FCA5A5" />
            <Text style={styles.bridgeText}>
              Partner app se job auto-remove · bridge sync on confirm
            </Text>
          </View>

          <Pressable
            style={[styles.danger, loading && styles.btnOff]}
            onPress={onConfirm}
            disabled={loading}
            accessibilityRole="button"
          >
            <LinearGradient colors={['#D92D20', '#B42318']} style={StyleSheet.absoluteFill} />
            <Text style={styles.dangerText}>{loading ? 'Cancelling…' : 'Yes, cancel booking'}</Text>
          </Pressable>

          <Pressable style={styles.secondary} onPress={onClose} disabled={loading} accessibilityRole="button">
            <Text style={styles.secondaryText}>Keep my booking</Text>
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
    justifyContent: 'flex-end',
    paddingHorizontal: layout.pad,
    paddingTop: layout.pad,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  iconWrap: { alignItems: 'center' },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF3F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 19,
  },
  summary: {
    backgroundColor: '#F9FAFB',
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  summaryValue: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  summaryRefund: { fontFamily: fonts.extraBold, fontSize: 15, color: '#027A48' },
  hint: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 16,
  },
  bridgeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(252,165,165,0.3)',
  },
  bridgeText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 15,
  },
  danger: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingVertical: 14,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  dangerText: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  btnOff: { opacity: 0.6 },
  secondary: { alignItems: 'center', paddingVertical: spacing.sm },
  secondaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryDark },
});
