import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { DemoBooking } from '@/constants/demo';
import { ratingLabel } from '../lib/booking.review';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface BookingRateSuccessModalProps {
  visible: boolean;
  booking: DemoBooking | null;
  rating: number;
  onClose: () => void;
  onDone: () => void;
}

export function BookingRateSuccessModal({
  visible,
  booking,
  rating,
  onClose,
  onDone,
}: BookingRateSuccessModalProps) {
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
          <LinearGradient colors={['#ECFDF5', '#FFFFFF']} style={styles.cardBg} />

          <View style={styles.iconWrap}>
            <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={styles.iconGrad}>
              <Ionicons name="star" size={32} color={colors.white} />
            </LinearGradient>
          </View>

          <Text style={styles.title}>Thank you!</Text>
          <Text style={styles.sub}>
            Aapki rating se {booking.maid} aur dusre customers ko help milti hai
          </Text>

          <View style={styles.stars}>
            {Array.from({ length: 5 }, (_, i) => (
              <Ionicons
                key={i}
                name={i < rating ? 'star' : 'star-outline'}
                size={28}
                color={colors.star}
              />
            ))}
          </View>
          <Text style={styles.ratingLabel}>{ratingLabel(rating)}</Text>

          <View style={styles.points}>
            {[
              'Review pro ke profile par dikhegi',
              'Top-rated pros ko zyada bookings milti hain',
              'Aapka feedback quality improve karta hai',
            ].map((p) => (
              <View key={p} style={styles.point}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={styles.pointText}>{p}</Text>
              </View>
            ))}
          </View>

          <Pressable style={styles.primary} onPress={onDone} accessibilityRole="button">
            <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
            <Text style={styles.primaryText}>Done</Text>
          </Pressable>

          <Pressable style={styles.secondary} onPress={onClose} accessibilityRole="button">
            <Text style={styles.secondaryText}>Back to booking</Text>
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
    alignItems: 'center',
  },
  cardBg: { ...StyleSheet.absoluteFill },
  iconWrap: { marginTop: spacing.xs },
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
    letterSpacing: -0.4,
  },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 19,
  },
  stars: { flexDirection: 'row', gap: 6, marginTop: spacing.xs },
  ratingLabel: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryDark },
  points: { width: '100%', gap: spacing.sm },
  point: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  pointText: { flex: 1, fontFamily: fonts.medium, fontSize: 12, color: colors.muted, lineHeight: 17 },
  primary: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingVertical: 14,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  primaryText: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  secondary: { alignItems: 'center', paddingVertical: spacing.sm },
  secondaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryDark },
});
