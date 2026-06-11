import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { DemoBooking } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface BookingRescheduleSuccessModalProps {
  visible: boolean;
  booking: DemoBooking | null;
  onClose: () => void;
  onViewBooking: () => void;
}

export function BookingRescheduleSuccessModal({
  visible,
  booking,
  onClose,
  onViewBooking,
}: BookingRescheduleSuccessModalProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [visible]);

  if (!booking) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.card}>
          <LinearGradient colors={['#E6F4F2', '#FFFFFF']} style={styles.cardBg} />

          <View style={styles.iconWrap}>
            <LinearGradient colors={['#0B6E67', '#084F4A']} style={styles.iconGrad}>
              <Ionicons name="calendar" size={32} color={colors.white} />
            </LinearGradient>
          </View>

          <Text style={styles.title}>Visit rescheduled</Text>
          <Text style={styles.sub}>Naya slot confirm ho gaya — koi extra charge nahi</Text>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Ionicons name="sparkles-outline" size={16} color={colors.primaryDark} />
              <Text style={styles.summaryText}>{booking.service}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.primaryDark} />
              <Text style={styles.summaryText}>{booking.date}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="time-outline" size={16} color={colors.primaryDark} />
              <Text style={styles.summaryText}>
                {booking.slotLabel ?? booking.time}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="person-outline" size={16} color={colors.primaryDark} />
              <Text style={styles.summaryText}>{booking.maid} · same pro</Text>
            </View>
          </View>

          <View style={styles.bridgeStrip}>
            <LinearGradient colors={['#042F2E', '#0D9488']} style={StyleSheet.absoluteFill} />
            <Ionicons name="sync" size={14} color="#5EEAD4" />
            <Text style={styles.bridgeText}>
              Partner calendar updated · {booking.slotLabel ?? booking.time} synced via bridge
            </Text>
          </View>

          <View style={styles.points}>
            {[
              'Pro ko naya slot notify ho jayega',
              'Completion OTP visit ke din same rahega',
              'Cancel free agar 2+ ghante pehle karo',
            ].map((p) => (
              <View key={p} style={styles.point}>
                <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                <Text style={styles.pointText}>{p}</Text>
              </View>
            ))}
          </View>

          <Pressable style={styles.primary} onPress={onViewBooking} accessibilityRole="button">
            <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
            <Text style={styles.primaryText}>View booking</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </Pressable>

          <Pressable style={styles.secondary} onPress={onClose} accessibilityRole="button">
            <Text style={styles.secondaryText}>Done</Text>
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
  summary: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  summaryText: { flex: 1, fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink },
  bridgeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(94,234,212,0.25)',
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
