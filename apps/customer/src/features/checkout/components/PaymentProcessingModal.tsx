import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

import type { PaymentStep } from '../lib/checkout.payment';
import { formatInr } from '../lib/checkout.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const STEP_COPY: Record<PaymentStep, { title: string; sub: string }> = {
  init: { title: 'Connecting securely', sub: 'Razorpay · 256-bit encrypted' },
  authorizing: { title: 'Authorizing payment', sub: 'Confirm in your UPI app if prompted' },
  confirming: { title: 'Confirming order', sub: 'Almost there…' },
  done: { title: 'Payment successful', sub: 'Placing your booking now' },
};

interface PaymentProcessingModalProps {
  visible: boolean;
  step: PaymentStep;
  amount: number;
  methodLabel: string;
}

export function PaymentProcessingModal({ visible, step, amount, methodLabel }: PaymentProcessingModalProps) {
  const copy = STEP_COPY[step];
  const done = step === 'done';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.hero}>
            {done ? (
              <View style={styles.check}>
                <Ionicons name="checkmark" size={36} color={colors.white} />
              </View>
            ) : (
              <ActivityIndicator size="large" color="#6EE7B7" />
            )}
          </LinearGradient>

          <Text style={styles.amount}>{formatInr(amount)}</Text>
          <Text style={styles.method}>{methodLabel}</Text>

          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.sub}>{copy.sub}</Text>

          <View style={styles.steps}>
            {(['init', 'authorizing', 'confirming', 'done'] as PaymentStep[]).map((s, i) => {
              const order = ['init', 'authorizing', 'confirming', 'done'];
              const current = order.indexOf(step);
              const active = i <= current;
              return (
                <View key={s} style={[styles.dot, active && styles.dotOn]} />
              );
            })}
          </View>
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
    maxWidth: 340,
    backgroundColor: colors.white,
    borderRadius: radius.xxl + 4,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  hero: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  check: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    fontFamily: fonts.extraBold,
    fontSize: 28,
    color: colors.ink,
    letterSpacing: -0.8,
  },
  method: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.ink,
    marginTop: spacing.sm,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
  },
  steps: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.divider,
  },
  dotOn: {
    backgroundColor: colors.primary,
    width: 20,
  },
});
