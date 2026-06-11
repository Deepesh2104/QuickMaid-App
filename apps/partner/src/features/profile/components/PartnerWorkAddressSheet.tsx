import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PartnerSavedAddress } from '@/constants/app';
import { PartnerAddressFormModal } from '@/features/profile/components/PartnerAddressFormModal';
import { getAddressLabelText } from '@/features/profile/lib/address.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface PartnerWorkAddressSheetProps {
  visible: boolean;
  addresses: PartnerSavedAddress[];
  activeId?: string;
  onClose: () => void;
  onSelect: (addr: PartnerSavedAddress) => void;
  onSave: (addr: Omit<PartnerSavedAddress, 'isDefault'> & { isDefault?: boolean }) => void;
}

export function PartnerWorkAddressSheet({
  visible,
  addresses,
  activeId,
  onClose,
  onSelect,
  onSave,
}: PartnerWorkAddressSheetProps) {
  const insets = useSafeAreaInsets();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PartnerSavedAddress | null>(null);

  const openAdd = () => {
    Haptics.selectionAsync();
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (addr: PartnerSavedAddress) => {
    Haptics.selectionAsync();
    setEditing(addr);
    setFormOpen(true);
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
          <View style={styles.handle} />
          <View style={styles.head}>
            <Text style={styles.title}>Work from</Text>
            <Text style={styles.sub}>Pick where you start jobs — dispatch uses this for matching</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
            {addresses.map((addr) => {
              const on = addr.id === activeId;
              return (
                <Pressable
                  key={addr.id}
                  style={[styles.card, on && styles.cardOn]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    onSelect(addr);
                    onClose();
                  }}
                >
                  <View style={styles.radio}>{on ? <View style={styles.radioDot} /> : null}</View>
                  <View style={styles.copy}>
                    <View style={styles.labelRow}>
                      <View style={styles.labelPill}>
                        <Ionicons
                          name={addr.label === 'Home' ? 'home-outline' : 'location-outline'}
                          size={12}
                          color={colors.primaryDark}
                        />
                        <Text style={styles.labelText}>{getAddressLabelText(addr)}</Text>
                      </View>
                      {on ? <Text style={styles.activeTag}>ACTIVE</Text> : null}
                    </View>
                    <Text style={styles.line} numberOfLines={2}>{addr.line}</Text>
                    <Text style={styles.meta}>
                      {addr.zone}
                      {addr.pincode ? ` · PIN ${addr.pincode}` : ''}
                    </Text>
                  </View>
                  <Pressable style={styles.editBtn} onPress={() => openEdit(addr)}>
                    <Ionicons name="create-outline" size={16} color={colors.primary} />
                  </Pressable>
                </Pressable>
              );
            })}

            <Pressable style={styles.addBtn} onPress={openAdd}>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.addText}>Add new address</Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>

      <PartnerAddressFormModal
        visible={formOpen}
        editing={editing}
        onClose={() => setFormOpen(false)}
        onSave={(addr) => {
          onSave(addr);
          setFormOpen(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15,20,25,0.45)' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    maxHeight: '72%',
    paddingTop: spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginBottom: spacing.md,
  },
  head: { paddingHorizontal: layout.pad, marginBottom: spacing.md, gap: 4 },
  title: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.ink, letterSpacing: -0.4 },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  list: { paddingHorizontal: layout.pad, gap: spacing.sm, paddingBottom: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: 'rgba(15,20,25,0.06)',
    backgroundColor: colors.white,
  },
  cardOn: { borderColor: colors.primary, backgroundColor: '#F8FDFC' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  copy: { flex: 1, gap: 4, minWidth: 0 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  labelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  labelText: { fontFamily: fonts.bold, fontSize: 11, color: colors.primaryDark },
  activeTag: { fontFamily: fonts.bold, fontSize: 9, color: colors.primary, letterSpacing: 0.5 },
  line: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink, lineHeight: 18 },
  meta: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.2)',
    marginTop: spacing.xs,
  },
  addText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primary },
});
