import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PIN_LENGTH } from '../lib/appLock.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface PinKeypadProps {
  value: string;
  onChange: (next: string) => void;
  error?: string;
  title?: string;
  subtitle?: string;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'] as const;

export function PinKeypad({ value, onChange, error, title, subtitle }: PinKeypadProps) {
  const onKey = (key: (typeof KEYS)[number]) => {
    Haptics.selectionAsync();
    if (key === 'back') {
      onChange(value.slice(0, -1));
      return;
    }
    if (!key || value.length >= PIN_LENGTH) return;
    onChange(value + key);
  };

  return (
    <View style={styles.wrap}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}

      <View style={styles.dots}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <View key={i} style={[styles.dot, i < value.length && styles.dotFilled]} />
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : <View style={styles.errorSpacer} />}

      <View style={styles.grid}>
        {KEYS.map((key, index) => {
          if (key === '') {
            return <View key={`spacer-${index}`} style={styles.keySpacer} />;
          }
          const isBack = key === 'back';
          return (
            <Pressable
              key={key}
              style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
              onPress={() => onKey(key)}
              accessibilityRole="button"
              accessibilityLabel={isBack ? 'Delete' : key}
            >
              {isBack ? (
                <Ionicons name="backspace-outline" size={22} color={colors.ink} />
              ) : (
                <Text style={styles.keyText}>{key}</Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.md },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.ink,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  error: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.error,
    minHeight: 18,
  },
  errorSpacer: { minHeight: 18 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 264,
    justifyContent: 'center',
    gap: spacing.md,
  },
  key: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  keyPressed: {
    backgroundColor: colors.primaryLight,
  },
  keySpacer: {
    width: 72,
    height: 72,
  },
  keyText: {
    fontFamily: fonts.extraBold,
    fontSize: 26,
    color: colors.ink,
  },
});
