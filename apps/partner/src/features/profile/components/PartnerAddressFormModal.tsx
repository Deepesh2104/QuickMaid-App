import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PartnerAddressLabel, PartnerSavedAddress } from '@/constants/app';
import { RAIPUR_ZONES } from '@/constants/demo';
import { createAddressId } from '@/features/profile/lib/address.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface PartnerAddressFormModalProps {
  visible: boolean;
  editing?: PartnerSavedAddress | null;
  onClose: () => void;
  onSave: (addr: Omit<PartnerSavedAddress, 'isDefault'> & { isDefault?: boolean }) => void;
}

export function PartnerAddressFormModal({ visible, editing, onClose, onSave }: PartnerAddressFormModalProps) {
  const insets = useSafeAreaInsets();
  const [label, setLabel] = useState<PartnerAddressLabel>('Home');
  const [line, setLine] = useState('');
  const [zone, setZone] = useState<string>(RAIPUR_ZONES[0]);
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    if (!visible) return;
    setLabel(editing?.label ?? 'Home');
    setLine(editing?.line ?? '');
    setZone(editing?.zone ?? RAIPUR_ZONES[0]);
    setPincode(editing?.pincode ?? '');
  }, [visible, editing]);

  const submit = () => {
    const trimmed = line.trim();
    if (!trimmed) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave({
      id: editing?.id ?? createAddressId(),
      label,
      line: trimmed,
      zone,
      pincode: pincode.trim() || undefined,
      isDefault: editing?.isDefault ?? addressesCountIsZero(),
    });
    onClose();
  };

  const addressesCountIsZero = () => !editing;

  const close = () => {
    Haptics.selectionAsync();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView
        style={styles.wrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={close} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
          <View style={styles.handle} />
          <View style={styles.headRow}>
            <Pressable
              style={styles.backBtn}
              onPress={close}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={20} color={colors.primary} />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
            <Pressable
              style={styles.closeBtn}
              onPress={close}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Ionicons name="close" size={20} color={colors.muted} />
            </Pressable>
          </View>
          <Text style={styles.title}>{editing ? 'Edit address' : 'Add work address'}</Text>
          <Text style={styles.sub}>Jobs are matched near your base location in Raipur</Text>

          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.form}>
            <Text style={styles.fieldLabel}>Label</Text>
            <View style={styles.labelRow}>
              {(['Home', 'Other'] as PartnerAddressLabel[]).map((l) => {
                const on = label === l;
                return (
                  <Pressable
                    key={l}
                    style={[styles.labelChip, on && styles.labelChipOn]}
                    onPress={() => setLabel(l)}
                  >
                    <Ionicons
                      name={l === 'Home' ? 'home-outline' : 'location-outline'}
                      size={14}
                      color={on ? colors.white : colors.muted}
                    />
                    <Text style={[styles.labelChipText, on && styles.labelChipTextOn]}>{l}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.fieldLabel}>Full address</Text>
            <TextInput
              style={styles.input}
              placeholder="Flat / house no., street, landmark"
              placeholderTextColor={colors.mutedLight}
              value={line}
              onChangeText={setLine}
              multiline
            />

            <Text style={styles.fieldLabel}>Zone</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.zoneRow}>
              {RAIPUR_ZONES.map((z) => {
                const on = zone === z;
                return (
                  <Pressable
                    key={z}
                    style={[styles.zoneChip, on && styles.zoneChipOn]}
                    onPress={() => setZone(z)}
                  >
                    <Text style={[styles.zoneText, on && styles.zoneTextOn]}>{z}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={styles.fieldLabel}>PIN code (optional)</Text>
            <TextInput
              style={styles.inputSingle}
              placeholder="492001"
              placeholderTextColor={colors.mutedLight}
              value={pincode}
              onChangeText={setPincode}
              keyboardType="number-pad"
              maxLength={6}
            />
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.cancelBtn} onPress={close}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.saveBtn, !line.trim() && styles.saveBtnOff]}
              onPress={submit}
              disabled={!line.trim()}
            >
              <Text style={styles.saveText}>Save address</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(15,20,25,0.45)' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    paddingTop: spacing.sm,
    maxHeight: '88%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginBottom: spacing.md,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.pad,
    marginBottom: spacing.sm,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: spacing.xs,
    paddingRight: spacing.sm,
  },
  backText: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.primary },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.ink,
    paddingHorizontal: layout.pad,
    letterSpacing: -0.3,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    paddingHorizontal: layout.pad,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  form: { paddingHorizontal: layout.pad, gap: spacing.sm, paddingBottom: spacing.md },
  fieldLabel: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
  },
  labelRow: { flexDirection: 'row', gap: spacing.sm },
  labelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSubtle,
  },
  labelChipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  labelChipText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.muted },
  labelChipTextOn: { color: colors.white },
  input: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.lg,
    padding: spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputSingle: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  zoneRow: { gap: spacing.sm, paddingVertical: spacing.xs },
  zoneChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  zoneChipOn: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  zoneText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted },
  zoneTextOn: { color: colors.primaryDark },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: layout.pad,
    marginTop: spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  cancelText: { fontFamily: fonts.bold, fontSize: 15, color: colors.muted },
  saveBtn: {
    flex: 1.4,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnOff: { opacity: 0.45 },
  saveText: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
});
