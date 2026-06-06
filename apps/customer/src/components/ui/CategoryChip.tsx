import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, shadow, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface CategoryChipProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  active?: boolean;
  onPress?: () => void;
}

export function CategoryChip({ label, icon, active = false, onPress }: CategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={14}
          color={active ? colors.white : colors.inkSecondary}
        />
      ) : null}
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadow.sm,
  },
  label: {
    ...type.bodySm,
    fontWeight: '600',
    color: colors.inkSecondary,
  },
  labelActive: {
    color: colors.white,
    fontWeight: '700',
  },
});
