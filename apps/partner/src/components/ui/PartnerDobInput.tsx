import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import {
  dateToDobString,
  defaultDobPickerDate,
  dobStringToDate,
  formatDobInput,
  maxDobDate,
  minDobDate,
} from '@/lib/dob-input.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface PartnerDobInputProps {
  value: string;
  onChangeText: (formatted: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function clampPickerDate(date: Date): Date {
  const max = maxDobDate();
  const min = minDobDate();
  if (date > max) return max;
  if (date < min) return min;
  return date;
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function DobPickerModal({
  visible,
  initialDate,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  initialDate: Date;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}) {
  const [day, setDay] = useState(initialDate.getDate());
  const [month, setMonth] = useState(initialDate.getMonth());
  const [year, setYear] = useState(initialDate.getFullYear());

  useEffect(() => {
    if (!visible) return;
    const d = clampPickerDate(initialDate);
    setDay(d.getDate());
    setMonth(d.getMonth());
    setYear(d.getFullYear());
  }, [visible, initialDate]);

  const years = useMemo(() => {
    const maxY = maxDobDate().getFullYear();
    const minY = minDobDate().getFullYear();
    const out: number[] = [];
    for (let y = maxY; y >= minY; y -= 1) out.push(y);
    return out;
  }, []);

  const maxDay = daysInMonth(year, month);
  const safeDay = Math.min(day, maxDay);

  const confirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onConfirm(clampPickerDate(new Date(year, month, safeDay)));
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalWrap}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.modalSheet}>
        <Text style={styles.modalTitle}>Select date of birth</Text>
        <View style={styles.pickerRow}>
          <View style={styles.pickerCol}>
            <Text style={styles.pickerLabel}>Day</Text>
            <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
              {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => {
                const on = safeDay === d;
                return (
                  <Pressable
                    key={d}
                    style={[styles.pickerItem, on && styles.pickerItemOn]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setDay(d);
                    }}
                  >
                    <Text style={[styles.pickerItemText, on && styles.pickerItemTextOn]}>
                      {String(d).padStart(2, '0')}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.pickerCol}>
            <Text style={styles.pickerLabel}>Month</Text>
            <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
              {MONTHS.map((label, index) => {
                const on = month === index;
                return (
                  <Pressable
                    key={label}
                    style={[styles.pickerItem, on && styles.pickerItemOn]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setMonth(index);
                      const nextMax = daysInMonth(year, index);
                      if (day > nextMax) setDay(nextMax);
                    }}
                  >
                    <Text style={[styles.pickerItemText, on && styles.pickerItemTextOn]}>{label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.pickerCol}>
            <Text style={styles.pickerLabel}>Year</Text>
            <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
              {years.map((y) => {
                const on = year === y;
                return (
                  <Pressable
                    key={y}
                    style={[styles.pickerItem, on && styles.pickerItemOn]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setYear(y);
                      const nextMax = daysInMonth(y, month);
                      if (day > nextMax) setDay(nextMax);
                    }}
                  >
                    <Text style={[styles.pickerItemText, on && styles.pickerItemTextOn]}>{y}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>

        <View style={styles.modalActions}>
          <Pressable style={styles.modalCancel} onPress={onClose}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.modalConfirm} onPress={confirm}>
            <Text style={styles.modalConfirmText}>Done</Text>
          </Pressable>
        </View>
        </View>
      </View>
    </Modal>
  );
}

export function PartnerDobInput({
  value,
  onChangeText,
  placeholder = 'DD/MM/YYYY',
  style,
  inputStyle,
}: PartnerDobInputProps) {
  const [showPicker, setShowPicker] = useState(false);

  const resolvedPickerDate = useMemo(
    () => clampPickerDate(dobStringToDate(value) ?? defaultDobPickerDate()),
    [value],
  );

  const openPicker = () => {
    Haptics.selectionAsync();
    setShowPicker(true);
  };

  return (
    <View style={style}>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={(text) => onChangeText(formatDobInput(text))}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          keyboardType="number-pad"
          maxLength={10}
          returnKeyType="done"
        />
        <Pressable
          style={styles.calendarBtn}
          onPress={openPicker}
          accessibilityLabel="Pick date of birth"
          hitSlop={6}
        >
          <Ionicons name="calendar-outline" size={20} color={colors.primary} />
        </Pressable>
      </View>

      <DobPickerModal
        visible={showPicker}
        initialDate={resolvedPickerDate}
        onClose={() => setShowPicker(false)}
        onConfirm={(date) => onChangeText(dateToDobString(date))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.ink,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.bgSubtle,
  },
  calendarBtn: {
    width: 46,
    height: 46,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalWrap: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15,20,25,0.45)',
  },
  modalSheet: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.md,
    gap: spacing.md,
  },
  modalTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 17,
    color: colors.ink,
    textAlign: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 200,
  },
  pickerCol: { flex: 1, gap: spacing.xs },
  pickerLabel: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  pickerScroll: {
    flex: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.bgSubtle,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  pickerItem: {
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  pickerItemOn: { backgroundColor: colors.primaryLight },
  pickerItemText: { fontFamily: fonts.medium, fontSize: 14, color: colors.muted },
  pickerItemTextOn: { fontFamily: fonts.bold, color: colors.primaryDark },
  modalActions: { flexDirection: 'row', gap: spacing.sm },
  modalCancel: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSubtle,
  },
  modalCancelText: { fontFamily: fonts.bold, fontSize: 14, color: colors.muted },
  modalConfirm: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  modalConfirmText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
});
