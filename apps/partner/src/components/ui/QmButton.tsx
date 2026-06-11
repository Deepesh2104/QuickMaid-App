import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, shadow, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface QmButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  size?: 'md' | 'lg';
}

export function QmButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  icon,
  fullWidth = true,
  size = 'lg',
}: QmButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const isFilled = variant === 'primary' || variant === 'dark';
  const variantStyle =
    variant === 'secondary'
      ? styles.secondary
      : variant === 'ghost'
        ? styles.ghost
        : variant === 'dark'
          ? styles.dark
          : styles.primary;

  const labelStyle =
    variant === 'secondary'
      ? styles.secondaryLabel
      : isFilled
        ? styles.filledLabel
        : styles.ghostLabel;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        fullWidth && styles.fullWidth,
        variantStyle,
        variant === 'primary' && shadow.sm,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isFilled ? colors.white : colors.primary} />
      ) : (
        <View style={styles.row}>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={isFilled ? colors.white : colors.primary}
              style={styles.icon}
            />
          )}
          <Text style={labelStyle}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  lg: { minHeight: 52 },
  md: { minHeight: 44 },
  fullWidth: { width: '100%' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  icon: { marginRight: 8 },
  primary: { backgroundColor: colors.primary },
  dark: { backgroundColor: colors.ink },
  filledLabel: { ...type.button, color: colors.white },
  secondary: {
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  secondaryLabel: { ...type.button, color: colors.ink },
  ghost: { backgroundColor: 'transparent', minHeight: 40 },
  ghostLabel: { ...type.button, color: colors.primary },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
