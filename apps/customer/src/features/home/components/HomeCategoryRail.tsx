import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { CATEGORIES } from '@/constants/services';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface HomeCategoryRailProps {
  active: string;
  onSelect: (id: string) => void;
}

export function HomeCategoryRail({ active, onSelect }: HomeCategoryRailProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {CATEGORIES.map((cat) => {
        const on = active === cat.id;
        return (
          <Pressable
            key={cat.id}
            style={[styles.chip, on && styles.chipOn]}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(cat.id);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
          >
            <Ionicons name={cat.icon} size={15} color={on ? colors.white : colors.muted} />
            <Text style={[styles.label, on && styles.labelOn]}>{cat.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginBottom: spacing.lg },
  row: { paddingHorizontal: layout.pad, gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.chipBg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  label: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.muted },
  labelOn: { color: colors.white },
});
