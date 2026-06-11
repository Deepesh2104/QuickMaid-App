import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { DEMO_VISIT_COMPLETION_OTP } from '@/constants/app';
import type { DemoBooking } from '@/constants/demo';
import { formatOtpDigits } from '../lib/maid.assign';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface BookingTrackOtpCardProps {
  booking: DemoBooking;
}

export function BookingTrackOtpCard({ booking }: BookingTrackOtpCardProps) {
  if (!booking.completionOtp) return null;

  const digits = formatOtpDigits(booking.completionOtp);
  const isUnified = booking.completionOtp === DEMO_VISIT_COMPLETION_OTP;

  return (
    <Animated.View entering={FadeInDown.delay(180).duration(320)} style={styles.wrap}>
      <LinearGradient
        colors={['#422006', '#78350F', '#B45309']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.head}>
          <View style={styles.icon}>
            <Ionicons name="key" size={18} color="#FCD34D" />
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>VISIT COMPLETION OTP</Text>
            <Text style={styles.title}>Share when cleaning is done</Text>
          </View>
          {isUnified ? (
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>DEMO</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.digitRow}>
          {digits.map((d, i) => (
            <View key={`${d}-${i}`} style={styles.digitBox}>
              <Text style={styles.digit}>{d}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bridgeRow}>
          <Ionicons name="sync" size={12} color="#FCD34D" />
          <Text style={styles.bridgeText}>
            Pro enters same code · bridge closes booking + rating modal
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadow.md,
  },
  card: {
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.25)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(252,211,77,0.15)',
    top: -30,
    right: -10,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  title: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  demoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(252,211,77,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.35)',
  },
  demoBadgeText: {
    fontFamily: fonts.extraBold,
    fontSize: 9,
    color: '#FCD34D',
    letterSpacing: 0.6,
  },
  digitRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  digitBox: {
    flex: 1,
    aspectRatio: 0.9,
    maxHeight: 48,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(252,211,77,0.4)',
  },
  digit: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: '#78350F',
    letterSpacing: 1,
  },
  bridgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  bridgeText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 14,
  },
});
