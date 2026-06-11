import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { DEMO_VISIT_COMPLETION_OTP } from '@/constants/app';
import type { DemoBooking } from '@/constants/demo';
import { formatOtpDigits } from '../lib/maid.assign';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface BookingCompletionOtpCardProps {
  booking: DemoBooking;
  compact?: boolean;
  onVerified?: () => void;
}

export function BookingCompletionOtpCard({ booking, compact }: BookingCompletionOtpCardProps) {
  if (!booking.completionOtp || booking.status !== 'upcoming') return null;

  const digits = formatOtpDigits(booking.completionOtp);
  const isUnified = booking.completionOtp === DEMO_VISIT_COMPLETION_OTP;

  const shareOtp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `QuickMaid visit OTP for ${booking.maid}: ${booking.completionOtp}\nBooking ${booking.bookingRef ?? booking.id}\nShare with your pro when cleaning is complete.`,
      });
    } catch {
      // dismissed
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={[styles.wrap, compact && styles.wrapCompact]}
    >
      <LinearGradient
        colors={['#010F0E', '#084F4A', '#0B6E67', '#12A598']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.head}>
          <View style={styles.headIcon}>
            <Ionicons name="key" size={18} color="#084F4A" />
          </View>
          <View style={styles.headCopy}>
            <Text style={styles.eyebrow}>VISIT OTP</Text>
            <Text style={styles.title}>Share with {booking.maid}</Text>
          </View>
          {isUnified ? (
            <View style={styles.unifiedBadge}>
              <Ionicons name="flash" size={9} color="#6EE7B7" />
              <Text style={styles.unifiedText}>DEMO</Text>
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

        <Text style={styles.hint}>
          Jab cleaning complete ho, yeh code pro ko dein. Partner app mein verify hone par visit complete
          hoga.
        </Text>

        {!compact ? (
          <View style={styles.maidRow}>
            <View style={styles.maidAvatar}>
              <Text style={styles.maidInitial}>{booking.maid.charAt(0)}</Text>
            </View>
            <View style={styles.maidCopy}>
              <Text style={styles.maidName}>{booking.maid}</Text>
              <Text style={styles.maidMeta}>
                {booking.maidRating ? `${booking.maidRating}★ · ` : ''}
                {booking.maidJobs ? `${booking.maidJobs.toLocaleString('en-IN')} jobs` : 'Verified pro'}
              </Text>
            </View>
            <Pressable style={styles.shareBtn} onPress={() => void shareOtp()} accessibilityLabel="Share OTP">
              <Ionicons name="share-outline" size={16} color="#084F4A" />
              <Text style={styles.shareText}>Share</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.shareBtnCompact} onPress={() => void shareOtp()}>
            <Ionicons name="share-outline" size={14} color="#6EE7B7" />
            <Text style={styles.shareTextCompact}>Share OTP with pro</Text>
          </Pressable>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md, ...shadow.md },
  wrapCompact: { marginBottom: 0 },
  card: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.22)',
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(110,231,183,0.1)',
    top: -40,
    right: -20,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headCopy: { flex: 1, gap: 2 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.1,
  },
  title: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
  unifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.3)',
  },
  unifiedText: {
    fontFamily: fonts.extraBold,
    fontSize: 9,
    color: '#6EE7B7',
    letterSpacing: 0.6,
  },
  digitRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.xs },
  digitBox: {
    flex: 1,
    aspectRatio: 0.85,
    maxHeight: 54,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(110,231,183,0.35)',
  },
  digit: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: '#084F4A',
    letterSpacing: 1,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 17,
  },
  maidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  maidAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maidInitial: { fontFamily: fonts.extraBold, fontSize: 16, color: '#084F4A' },
  maidCopy: { flex: 1, gap: 2 },
  maidName: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  maidMeta: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#6EE7B7',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  shareText: { fontFamily: fonts.bold, fontSize: 12, color: '#084F4A' },
  shareBtnCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.35)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  shareTextCompact: { fontFamily: fonts.bold, fontSize: 12, color: '#6EE7B7' },
});
