import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface BookingDisputeSuccessModalProps {
  visible: boolean;
  ticketId: string;
  onOpenChat: () => void;
  onClose: () => void;
}

export function BookingDisputeSuccessModal({
  visible,
  ticketId,
  onOpenChat,
  onClose,
}: BookingDisputeSuccessModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.card}>
        <LinearGradient colors={['#ECFDF5', '#FFFFFF']} style={StyleSheet.absoluteFill} />
        <View style={styles.icon}>
          <Ionicons name="checkmark-circle" size={40} color="#059669" />
        </View>
        <Text style={styles.title}>Dispute submitted</Text>
        <Text style={styles.sub}>
          Case {ticketId} is logged. Our team will review within 24 hours and update you in chat.
        </Text>
        <Pressable style={styles.primary} onPress={onOpenChat}>
          <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={styles.primaryGrad}>
            <Ionicons name="chatbubbles" size={18} color={colors.white} />
            <Text style={styles.primaryText}>Open support chat</Text>
          </LinearGradient>
        </Pressable>
        <Pressable style={styles.secondary} onPress={onClose}>
          <Text style={styles.secondaryText}>Back to booking</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(1,15,14,0.55)',
  },
  card: {
    position: 'absolute',
    left: layout.pad,
    right: layout.pad,
    top: '28%',
    borderRadius: radius.xxl + 4,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(5,150,105,0.2)',
  },
  icon: { marginBottom: spacing.xs },
  title: { fontFamily: fonts.extraBold, fontSize: 20, color: '#047857', letterSpacing: -0.4 },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 21,
  },
  primary: { alignSelf: 'stretch', borderRadius: radius.pill, overflow: 'hidden', marginTop: spacing.sm },
  primaryGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 15,
  },
  primaryText: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.white },
  secondary: { paddingVertical: spacing.sm },
  secondaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryDark },
});
