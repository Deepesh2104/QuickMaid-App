import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export type HomeSortOption = 'popular' | 'price_low' | 'price_high' | 'name';

const SORT_OPTIONS: { id: HomeSortOption; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'popular', label: 'Popular first', icon: 'flame-outline' },
  { id: 'price_low', label: 'Price: low to high', icon: 'trending-down-outline' },
  { id: 'price_high', label: 'Price: high to low', icon: 'trending-up-outline' },
  { id: 'name', label: 'Name A–Z', icon: 'text-outline' },
];

interface HomeServiceFilterSheetProps {
  visible: boolean;
  sort: HomeSortOption;
  onClose: () => void;
  onSortChange: (sort: HomeSortOption) => void;
}

export function HomeServiceFilterSheet({ visible, sort, onClose, onSortChange }: HomeServiceFilterSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.handle} />
        <Text style={styles.title}>Sort services</Text>
        <Text style={styles.sub}>Applies to the full catalogue list</Text>

        {SORT_OPTIONS.map((opt) => {
          const on = sort === opt.id;
          return (
            <Pressable
              key={opt.id}
              style={[styles.row, on && styles.rowOn]}
              onPress={() => {
                Haptics.selectionAsync();
                onSortChange(opt.id);
                onClose();
              }}
            >
              <Ionicons name={opt.icon} size={18} color={on ? colors.primaryDark : colors.muted} />
              <Text style={[styles.rowLabel, on && styles.rowLabelOn]}>{opt.label}</Text>
              {on ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : null}
            </Pressable>
          );
        })}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15,20,25,0.45)' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.bgMuted,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  title: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.ink },
  sub: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted, marginBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  rowOn: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  rowLabel: { flex: 1, fontFamily: fonts.semiBold, fontSize: 14, color: colors.muted },
  rowLabelOn: { color: colors.primaryDark, fontFamily: fonts.bold },
});
