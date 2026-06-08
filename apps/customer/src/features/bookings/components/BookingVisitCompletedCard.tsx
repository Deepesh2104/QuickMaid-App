import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import type { DemoBooking } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface BookingVisitCompletedCardProps {
  booking: DemoBooking;
}

export function BookingVisitCompletedCard({ booking }: BookingVisitCompletedCardProps) {
  if (booking.status !== 'completed') return null;

  const verifiedAt = booking.otpVerifiedAt
    ? new Date(booking.otpVerifiedAt).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#ECFDF5', '#FFFFFF']} style={StyleSheet.absoluteFill} />
      <View style={styles.icon}>
        <Ionicons name="checkmark-done-circle" size={28} color="#059669" />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>Visit completed</Text>
        <Text style={styles.sub}>
          {booking.maid} verified your OTP{verifiedAt ? ` · ${verifiedAt}` : ''}
        </Text>
        <Text style={styles.hint}>Service marked done · Invoice & rating available below</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(5,150,105,0.2)',
  },
  icon: { alignSelf: 'flex-start' },
  copy: { flex: 1, gap: 4 },
  title: { fontFamily: fonts.extraBold, fontSize: 16, color: '#047857' },
  sub: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink },
  hint: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },
});
