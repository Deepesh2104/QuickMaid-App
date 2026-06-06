import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, shadow, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface QmInputProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: string;
}

export function QmInput({
  label,
  hint,
  error,
  prefix,
  style,
  value,
  onChangeText,
  onFocus,
  onBlur,
  ...rest
}: QmInputProps) {
  const [text, setText] = useState(String(value ?? ''));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setText(String(value ?? ''));
  }, [value]);

  const hasValue = text.length > 0;

  const handleChange = (t: string) => {
    setText(t);
    onChangeText?.(t);
  };

  return (
    <View style={styles.wrap} collapsable={false}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        collapsable={false}
        style={[
          styles.field,
          focused && styles.fieldFocused,
          error ? styles.fieldError : null,
          hasValue && !error && !focused ? styles.fieldFilled : null,
        ]}
      >
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          placeholderTextColor={colors.placeholder}
          style={[styles.input, prefix ? styles.inputPrefix : null, style]}
          selectionColor={colors.primary}
          value={text}
          onChangeText={handleChange}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          underlineColorAndroid="transparent"
          editable
          {...rest}
        />
        {hasValue && !error && !focused ? (
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
        ) : null}
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={colors.error} />
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: {
    ...type.bodySm,
    color: colors.inkSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSubtle,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    minHeight: 54,
    paddingHorizontal: spacing.lg,
  },
  fieldFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.bg,
    ...shadow.sm,
  },
  fieldFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  fieldError: {
    borderColor: colors.error,
    backgroundColor: colors.errorBg,
  },
  prefix: {
    ...type.body,
    color: colors.ink,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...type.body,
    color: colors.ink,
    paddingVertical: spacing.md,
  },
  inputPrefix: { paddingLeft: 0 },
  hint: { ...type.caption, color: colors.muted, marginTop: spacing.sm },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: spacing.sm,
  },
  error: { ...type.caption, color: colors.error, fontWeight: '500' },
});
