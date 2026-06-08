import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { VisitCompletePayload } from '../lib/booking.completion';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface BookingVisitCompleteModalProps {
  visible: boolean;
  payload: VisitCompletePayload | null;
  onClose: () => void;
  onRate?: () => void;
}

export function BookingVisitCompleteModal({
  visible,
  payload,
  onClose,
  onRate,
}: BookingVisitCompleteModalProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [visible]);

  if (!payload) return null;

  const time = new Date(payload.completedAt).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.card}>
          <LinearGradient colors={['#ECFDF5', '#FFFFFF']} style={styles.cardBg} />

          <View style={styles.iconWrap}>
            <LinearGradient colors={['#059669', '#047857']} style={styles.iconGrad}>
              <Ionicons name="checkmark-done" size={36} color={colors.white} />
            </LinearGradient>
          </View>

          <Text style={styles.title}>Visit complete!</Text>
          <Text style={styles.sub}>
            <Text style={styles.maid}>{payload.maidName}</Text> ne aapka OTP verify kar diya
          </Text>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Ionicons name="sparkles-outline" size={16} color={colors.primaryDark} />
              <Text style={styles.summaryText}>{payload.service}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#059669" />
              <Text style={styles.summaryText}>OTP verified · {time}</Text>
            </View>
          </View>

          <View style={styles.points}>
            {[
              'OTP card hat gaya — visit ab Completed hai',
              'Payment finalize (agar pending tha)',
              'Ab aap apni maid ko rate kar sakte ho',
            ].map((p) => (
              <View key={p} style={styles.point}>
                <Ionicons name="checkmark-circle" size={14} color="#059669" />
                <Text style={styles.pointText}>{p}</Text>
              </View>
            ))}
          </View>

          <Pressable
            style={styles.primary}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onRate?.();
              onClose();
            }}
          >
            <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
            <Ionicons name="star" size={18} color={colors.white} />
            <Text style={styles.primaryText}>Rate your visit</Text>
          </Pressable>

          <Pressable style={styles.ghost} onPress={onClose}>
            <Text style={styles.ghostText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,20,25,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.pad,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(5,150,105,0.2)',
  },
  cardBg: { ...StyleSheet.absoluteFill, opacity: 0.9 },
  iconWrap: { marginBottom: spacing.xs },
  iconGrad: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.extraBold, fontSize: 26, color: colors.ink, letterSpacing: -0.5 },
  sub: { fontFamily: fonts.medium, fontSize: 15, color: colors.muted, textAlign: 'center', lineHeight: 22 },
  maid: { fontFamily: fonts.bold, color: '#047857' },
  summary: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  summaryText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink },
  points: { width: '100%', gap: spacing.sm },
  point: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  pointText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 17 },
  primary: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 16,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  primaryText: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
  ghost: { paddingVertical: spacing.sm },
  ghostText: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.primary },
});
