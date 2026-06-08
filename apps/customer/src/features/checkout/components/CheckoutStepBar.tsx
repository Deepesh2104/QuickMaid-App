import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import type { CheckoutStep } from '../types/checkout.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const STEPS: { id: CheckoutStep; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'cart', label: 'Cart', icon: 'cart-outline' },
  { id: 'address', label: 'Address', icon: 'location-outline' },
  { id: 'schedule', label: 'Slot', icon: 'calendar-outline' },
  { id: 'payment', label: 'Pay', icon: 'card-outline' },
];

interface CheckoutStepBarProps {
  current: CheckoutStep;
}

export function CheckoutStepBar({ current }: CheckoutStepBarProps) {
  const idx = STEPS.findIndex((s) => s.id === current);

  return (
    <View style={styles.wrap}>
      {STEPS.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <View key={s.id} style={styles.step}>
            <View style={[styles.dot, done && styles.dotDone, active && styles.dotActive]}>
              {done ? (
                <Ionicons name="checkmark" size={12} color={colors.white} />
              ) : (
                <Ionicons name={s.icon} size={12} color={active ? colors.white : colors.muted} />
              )}
            </View>
            <Text style={[styles.label, active && styles.labelActive, done && styles.labelDone]}>{s.label}</Text>
            {i < STEPS.length - 1 ? <View style={[styles.line, done && styles.lineDone]} /> : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: layout.pad,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.divider,
    zIndex: 1,
  },
  dotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dotDone: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.muted,
    marginTop: 4,
  },
  labelActive: {
    fontFamily: fonts.bold,
    color: colors.primaryDark,
  },
  labelDone: {
    color: colors.primary,
  },
  line: {
    position: 'absolute',
    top: 14,
    left: '55%',
    right: '-45%',
    height: 2,
    backgroundColor: colors.divider,
    zIndex: 0,
  },
  lineDone: {
    backgroundColor: colors.primaryLight,
  },
});
