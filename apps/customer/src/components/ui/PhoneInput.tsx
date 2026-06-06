import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, shadow, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface PhoneInputProps {
  onChangeText: (digits: string) => void;
  error?: string;
}

export function PhoneInput({ onChangeText, error }: PhoneInputProps) {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);

  const digits = text.replace(/\D/g, '').slice(0, 10);
  const isComplete = digits.length === 10;

  const handleChange = (raw: string) => {
    const cleaned = raw.replace(/\D/g, '').slice(0, 10);
    setText(cleaned);
    onChangeText(cleaned);
  };

  return (
    <View collapsable={false}>
      <View
        collapsable={false}
        style={[
          styles.wrap,
          focused && styles.wrapFocused,
          error ? styles.wrapError : null,
          isComplete && !error ? styles.wrapComplete : null,
        ]}
      >
        <View style={styles.codeChip} pointerEvents="none">
          <Text style={styles.flag}>🇮🇳</Text>
          <Text style={styles.code}>+91</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="9876543210"
          placeholderTextColor={colors.placeholder}
          keyboardType="phone-pad"
          maxLength={10}
          value={text}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChangeText={handleChange}
          selectionColor={colors.primary}
          returnKeyType="done"
          editable
          underlineColorAndroid="transparent"
        />

        {isComplete && !error ? (
          <Ionicons name="checkmark-circle" size={22} color={colors.success} />
        ) : null}
      </View>

      <View style={styles.meta}>
        {error ? (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={14} color={colors.error} />
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : (
          <Text style={styles.counter}>
            {isComplete ? 'Valid mobile number' : `${digits.length} of 10 digits`}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingRight: spacing.md,
    paddingLeft: spacing.sm,
    minHeight: 60,
    gap: spacing.sm,
  },
  wrapFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    ...shadow.sm,
  },
  wrapError: {
    borderColor: colors.error,
    backgroundColor: colors.errorBg,
  },
  wrapComplete: {
    borderColor: colors.success,
    backgroundColor: colors.successBg,
  },
  codeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.md,
  },
  flag: { fontSize: 16 },
  code: {
    ...type.body,
    fontWeight: '700',
    color: colors.ink,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
    letterSpacing: 0.5,
    paddingVertical: 14,
    paddingHorizontal: 4,
    margin: 0,
  },
  meta: {
    marginTop: spacing.sm,
    minHeight: 18,
  },
  counter: {
    ...type.caption,
    color: colors.mutedLight,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  error: {
    ...type.caption,
    color: colors.error,
    fontWeight: '500',
  },
});
