import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import type { DemoBooking } from '@/constants/demo';
import { verifyMaidCompletionOtp } from '../lib/booking.completion';
import { formatOtpDigits } from '../lib/maid.assign';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface BookingCompletionOtpCardProps {
  booking: DemoBooking;
  compact?: boolean;
  onVerified?: () => void;
}

export function BookingCompletionOtpCard({ booking, compact, onVerified }: BookingCompletionOtpCardProps) {
  const [verifying, setVerifying] = useState(false);
  const [waitNote, setWaitNote] = useState(false);

  if (!booking.completionOtp || booking.status !== 'upcoming') return null;

  const digits = formatOtpDigits(booking.completionOtp);

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
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.card}>
        <View style={styles.head}>
          <View style={styles.headIcon}>
            <Ionicons name="key" size={18} color={colors.white} />
          </View>
          <View style={styles.headCopy}>
            <Text style={styles.eyebrow}>Visit completion OTP</Text>
            <Text style={styles.title}>Share with {booking.maid}</Text>
          </View>
          <View style={styles.autoBadge}>
            <Ionicons name="flash" size={10} color="#FCD34D" />
            <Text style={styles.autoText}>Auto-assigned</Text>
          </View>
        </View>

        <View style={styles.otpRow}>
          {digits.map((d, i) => (
            <View key={`${d}-${i}`} style={styles.digitBox}>
              <Text style={styles.digit}>{d}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.hint}>
          Jab cleaning complete ho jaye, yeh 6-digit OTP apni maid ko dein. Pro apni app mein OTP daalegi — turant &quot;Visit complete&quot; confirmation dikhega.
        </Text>

        {waitNote ? (
          <View style={styles.waiting}>
            <ActivityIndicator size="small" color="#FCD34D" />
            <Text style={styles.waitingText}>Pro OTP verify kare tab tak wait karein…</Text>
          </View>
        ) : null}

        <Pressable
          style={styles.demoBtn}
          disabled={verifying}
          onPress={async () => {
            setVerifying(true);
            setWaitNote(true);
            const result = await verifyMaidCompletionOtp(booking.id, booking.completionOtp!);
            setVerifying(false);
            if (result.ok) onVerified?.();
            else setWaitNote(false);
          }}
        >
          <Text style={styles.demoText}>
            {verifying ? 'Verifying…' : 'Demo: Pro ne OTP daal diya'}
          </Text>
        </Pressable>

        {!compact ? (
          <View style={styles.maidRow}>
            <View style={styles.maidAvatar}>
              <Text style={styles.maidInitial}>{booking.maid.charAt(0)}</Text>
            </View>
            <View style={styles.maidCopy}>
              <Text style={styles.maidName}>{booking.maid}</Text>
              <Text style={styles.maidMeta}>
                {booking.maidRating ? `${booking.maidRating}★ · ` : ''}
                {booking.maidJobs ? `${booking.maidJobs} jobs` : 'Verified pro'}
              </Text>
            </View>
            <Pressable style={styles.shareBtn} onPress={shareOtp} accessibilityLabel="Share OTP">
              <Ionicons name="share-outline" size={16} color={colors.white} />
              <Text style={styles.shareText}>Share</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.shareBtnCompact} onPress={shareOtp}>
            <Ionicons name="share-outline" size={14} color={colors.white} />
            <Text style={styles.shareText}>Share OTP</Text>
          </Pressable>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: layout.pad, marginBottom: spacing.md },
  wrapCompact: { marginHorizontal: 0, marginBottom: 0 },
  card: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headCopy: { flex: 1, gap: 2 },
  eyebrow: { fontFamily: fonts.bold, fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.8, textTransform: 'uppercase' },
  title: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
  autoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  autoText: { fontFamily: fonts.bold, fontSize: 9, color: '#FCD34D' },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.xs },
  digitBox: {
    flex: 1,
    aspectRatio: 0.85,
    maxHeight: 52,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  digit: { fontFamily: fonts.extraBold, fontSize: 22, color: colors.primaryDark, letterSpacing: 1 },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: 'rgba(255,255,255,0.82)', lineHeight: 17 },
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
  maidInitial: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.primaryDark },
  maidCopy: { flex: 1, gap: 2 },
  maidName: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  maidMeta: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  shareBtnCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  shareText: { fontFamily: fonts.bold, fontSize: 12, color: colors.white },
  waiting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: spacing.sm,
    borderRadius: radius.lg,
  },
  waitingText: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.85)' },
  demoBtn: {
    alignSelf: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderStyle: 'dashed',
  },
  demoText: { fontFamily: fonts.semiBold, fontSize: 11, color: 'rgba(255,255,255,0.75)' },
});
