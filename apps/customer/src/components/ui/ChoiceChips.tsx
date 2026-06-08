import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts } from '../../theme/fonts';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface ChoiceChipsProps {
  label: string;
  hint?: string;
  optional?: boolean;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function ChoiceChips({
  label,
  hint,
  optional,
  options,
  value,
  onChange,
}: ChoiceChipsProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {optional ? <Text style={styles.optional}>Optional</Text> : null}
      </View>
      <View style={styles.row}>
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={[styles.chip, selected && styles.chipOn]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextOn]}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    ...type.bodySm,
    color: colors.inkSecondary,
    fontFamily: fonts.semiBold,
  },
  optional: {
    ...type.caption,
    color: colors.mutedLight,
    fontFamily: fonts.medium,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSubtle,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipOn: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipText: {
    ...type.bodySm,
    color: colors.inkSecondary,
    fontFamily: fonts.medium,
  },
  chipTextOn: {
    color: colors.primaryDark,
    fontFamily: fonts.semiBold,
  },
  hint: {
    ...type.caption,
    color: colors.muted,
    marginTop: spacing.sm,
    lineHeight: 16,
  },
});
