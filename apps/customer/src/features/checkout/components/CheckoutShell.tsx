import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CheckoutStep } from '../types/checkout.types';
import { CheckoutStepBar } from './CheckoutStepBar';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, spacing } from '@/theme/spacing';

interface CheckoutShellProps {
  step: CheckoutStep;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  hideSteps?: boolean;
}

export function CheckoutShell({ step, title, children, footer, hideSteps }: CheckoutShellProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          style={styles.back}
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.spacer} />
      </View>

      {!hideSteps ? <CheckoutStepBar current={step} /> : null}

      <View style={styles.body}>{children}</View>
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
    gap: spacing.md,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  spacer: { width: 40 },
  body: { flex: 1 },
});
