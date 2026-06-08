import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface PaymentFailedModalProps {
  visible: boolean;
  message: string;
  onRetry: () => void;
  onClose: () => void;
}

export function PaymentFailedModal({ visible, message, onRetry, onClose }: PaymentFailedModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name="close-circle" size={40} color="#D92D20" />
          </View>
          <Text style={styles.title}>Payment failed</Text>
          <Text style={styles.msg}>{message}</Text>
          <Text style={styles.hint}>No amount was deducted. You can retry or pick another method.</Text>

          <Pressable
            style={styles.retry}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onRetry();
            }}
          >
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
          <Pressable style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Change payment method</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,20,25,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.pad,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: { marginBottom: spacing.xs },
  title: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.ink },
  msg: { fontFamily: fonts.medium, fontSize: 14, color: '#D92D20', textAlign: 'center' },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'center', lineHeight: 17 },
  retry: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  retryText: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  cancel: { paddingVertical: spacing.sm },
  cancelText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.primary },
});
