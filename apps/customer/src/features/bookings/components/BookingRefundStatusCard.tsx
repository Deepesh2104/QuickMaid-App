import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { formatInr } from '@/features/checkout/lib/checkout.utils';
import type { DemoBooking } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface BookingRefundStatusCardProps {
  booking: DemoBooking;
}

export function BookingRefundStatusCard({ booking }: BookingRefundStatusCardProps) {
  if (!booking.refundAmount && !booking.refundTxnId) return null;

  const processing = booking.refundStatus === 'processing';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Ionicons name="arrow-undo-circle" size={20} color="#027A48" />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>{processing ? 'Refund processing' : 'Refund completed'}</Text>
          <Text style={styles.sub}>
            {booking.refundAmount ? formatInr(booking.refundAmount) : 'Full amount'} · Razorpay
          </Text>
        </View>
        <View style={[styles.badge, processing ? styles.badgeProcessing : styles.badgeDone]}>
          <Text style={[styles.badgeText, processing ? styles.badgeTextProcessing : styles.badgeTextDone]}>
            {processing ? 'Pending' : 'Done'}
          </Text>
        </View>
      </View>

      {booking.refundTxnId ? (
        <Text style={styles.ref}>Reference {booking.refundTxnId}</Text>
      ) : null}

      {booking.cancelledAt ? (
        <Text style={styles.date}>
          Cancelled {new Date(booking.cancelledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ECFDF5',
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(5,150,105,0.15)',
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.bold, fontSize: 14, color: '#065F46' },
  sub: { fontFamily: fonts.medium, fontSize: 12, color: '#047857' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  badgeProcessing: { backgroundColor: '#FFF8EE' },
  badgeDone: { backgroundColor: colors.white },
  badgeText: { fontFamily: fonts.bold, fontSize: 10 },
  badgeTextProcessing: { color: '#B54708' },
  badgeTextDone: { color: '#027A48' },
  ref: { fontFamily: fonts.semiBold, fontSize: 11, color: '#047857' },
  date: { fontFamily: fonts.medium, fontSize: 11, color: '#059669' },
});
