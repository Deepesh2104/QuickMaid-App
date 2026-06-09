import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatInr } from '../lib/checkout.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface CheckoutStickyFooterProps {
  amount: number;
  label: string;
  sub?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function CheckoutStickyFooter({ amount, label, sub, onPress, disabled, loading }: CheckoutStickyFooterProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom + spacing.sm }]}>
      <View style={styles.priceBlock}>
        <Text style={styles.price}>{formatInr(amount)}</Text>
        {sub ? <Text style={styles.sub}>{sub}</Text> : null}
      </View>
      <Pressable
        style={[styles.btn, (disabled || loading) && styles.btnOff]}
        onPress={() => {
          if (disabled || loading) return;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        disabled={disabled || loading}
        accessibilityRole="button"
      >
        <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            <Text style={styles.btnText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
              {label}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    shadowColor: '#0F1419',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  priceBlock: { flex: 1, minWidth: 0, gap: 2 },
  price: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
  },
  btn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 15,
    overflow: 'hidden',
    minWidth: 120,
    maxWidth: '62%',
  },
  btnOff: { opacity: 0.5 },
  btnText: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.white,
  },
});
