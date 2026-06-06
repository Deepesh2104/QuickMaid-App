import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/spacing';

interface IconBadgeProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  bg?: string;
  style?: ViewStyle;
  variant?: 'soft' | 'solid' | 'outline';
}

export function IconBadge({
  name,
  size = 20,
  color = colors.primary,
  bg = colors.primaryLight,
  style,
  variant = 'soft',
}: IconBadgeProps) {
  const variantStyle =
    variant === 'solid'
      ? { backgroundColor: colors.primary }
      : variant === 'outline'
        ? { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border }
        : { backgroundColor: bg };

  const iconColor = variant === 'solid' ? colors.white : color;

  return (
    <View style={[styles.wrap, variantStyle, style]}>
      <Ionicons name={name} size={size} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
