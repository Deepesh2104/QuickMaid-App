import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PaymentMethod } from '@/features/profile/types/profile.types';
import { UPI_APPS_CATALOG } from '@/features/payment/constants/gateway';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface CheckoutAddPaymentSheetProps {
  visible: boolean;
  type: 'upi' | 'card';
  onClose: () => void;
  onSave: (pm: Omit<PaymentMethod, 'id'>) => void;
}

export function CheckoutAddPaymentSheet({ visible, type, onClose, onSave }: CheckoutAddPaymentSheetProps) {
  const insets = useSafeAreaInsets();
  const [label, setLabel] = useState('');
  const [detail, setDetail] = useState('');

  useEffect(() => {
    if (!visible) return;
    setLabel(type === 'upi' ? 'Google Pay' : 'HDFC Debit');
    setDetail(type === 'upi' ? 'priya@okaxis' : '•••• •••• •••• 4821');
  }, [visible, type]);

  const save = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave({
      type,
      label: label.trim() || (type === 'upi' ? 'UPI' : 'Card'),
      detail: detail.trim(),
      isDefault: false,
      icon: type === 'upi' ? 'phone-portrait-outline' : 'card-outline',
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.root, { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.head}>
          <Text style={styles.title}>Add {type === 'upi' ? 'UPI' : 'card'}</Text>
          <Pressable onPress={onClose} accessibilityLabel="Close">
            <Ionicons name="close" size={24} color={colors.ink} />
          </Pressable>
        </View>

        {type === 'upi' ? (
          <View style={styles.apps}>
            {UPI_APPS_CATALOG.slice(0, 4).map((app) => (
              <Pressable
                key={app.id}
                style={styles.app}
                onPress={() => {
                  Haptics.selectionAsync();
                  setLabel(app.label);
                }}
              >
                <Ionicons name={app.icon} size={18} color={app.color} />
                <Text style={styles.appLabel}>{app.label}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        <Text style={styles.field}>Label</Text>
        <TextInput style={styles.input} value={label} onChangeText={setLabel} placeholderTextColor={colors.placeholder} />

        <Text style={styles.field}>{type === 'upi' ? 'UPI ID' : 'Card number'}</Text>
        <TextInput
          style={styles.input}
          value={detail}
          onChangeText={setDetail}
          autoCapitalize="none"
          keyboardType={type === 'card' ? 'number-pad' : 'default'}
          placeholderTextColor={colors.placeholder}
        />

        <Pressable style={styles.save} onPress={save}>
          <Text style={styles.saveText}>Save & use</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: layout.pad, gap: spacing.sm },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  title: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.ink },
  apps: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  app: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  appLabel: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink },
  field: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted, marginTop: spacing.sm },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.ink,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  save: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveText: { fontFamily: fonts.bold, fontSize: 16, color: colors.white },
});
