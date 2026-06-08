import * as Haptics from 'expo-haptics';
import { fonts } from '../../theme/fonts';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';

import { colors } from '../../theme/colors';
import { radius, shadow, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
  autoFocus?: boolean;
}

export function OtpInput({ value, onChange, length = 6, error, autoFocus = true }: OtpInputProps) {
  const refs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(autoFocus ? 0 : null);
  const digits = value.padEnd(length, ' ').slice(0, length).split('');
  const isComplete = value.length === length;

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => refs.current[0]?.focus(), 320);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  const updateDigit = (index: number, char: string) => {
    const cleaned = char.replace(/\D/g, '').slice(-1);
    const next = digits.map((d, i) => (i === index ? cleaned : d.trim())).join('').slice(0, length);
    onChange(next.replace(/\s/g, ''));

    if (cleaned && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
    if (cleaned) {
      Haptics.selectionAsync();
    }
  };

  const handlePaste = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, length);
    if (!cleaned) return;
    onChange(cleaned);
    const focusIdx = Math.min(cleaned.length, length - 1);
    refs.current[focusIdx]?.focus();
    if (cleaned.length === length) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleKeyPress = (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index]?.trim() && index > 0) {
      refs.current[index - 1]?.focus();
      const arr = value.split('');
      arr.pop();
      onChange(arr.join(''));
    }
  };

  return (
    <View style={styles.wrap} collapsable={false}>
      <TextInput
        style={styles.hidden}
        value={value}
        onChangeText={handlePaste}
        keyboardType="number-pad"
        maxLength={length}
        textContentType="oneTimeCode"
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        importantForAutofill="yes"
      />

      <View style={styles.row}>
        {digits.map((digit, index) => {
          const filled = Boolean(digit?.trim());
          const focused = focusedIndex === index;

          return (
            <TextInput
              key={index}
              ref={(r) => {
                refs.current[index] = r;
              }}
              style={[
                styles.box,
                focused && styles.boxFocused,
                filled && !error && styles.boxFilled,
                error && styles.boxError,
              ]}
              value={digit.trim()}
              onChangeText={(t) => {
                if (t.length > 1) {
                  handlePaste(t);
                  return;
                }
                updateDigit(index, t);
              }}
              onKeyPress={(e) => handleKeyPress(index, e)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex((i) => (i === index ? null : i))}
              keyboardType="number-pad"
              maxLength={Platform.OS === 'android' ? length : 1}
              selectTextOnFocus
              textAlign="center"
              selectionColor={colors.primary}
            />
          );
        })}
      </View>

      <View style={styles.meta}>
        {error ? (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={14} color={colors.error} />
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : (
          <Text style={styles.counter}>
            {isComplete ? 'Code complete' : `${value.length} of ${length} digits`}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  hidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.sm,
  },
  box: {
    flex: 1,
    height: 56,
    backgroundColor: colors.bgSubtle,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.ink,
    ...Platform.select({
      ios: { fontVariant: ['tabular-nums'] },
      android: {},
    }),
  },
  boxFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.bg,
    borderWidth: 2,
    ...shadow.sm,
  },
  boxFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  boxError: {
    borderColor: colors.error,
    backgroundColor: colors.errorBg,
  },
  meta: {
    marginTop: spacing.md,
    minHeight: 18,
  },
  counter: {
    ...type.caption,
    color: colors.muted,
    fontFamily: fonts.medium,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  error: {
    ...type.caption,
    color: colors.error,
    fontFamily: fonts.medium,
  },
});
