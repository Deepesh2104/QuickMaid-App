import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CATEGORIES } from '@/constants/services';
import { premium } from '../constants/home.premium';
import { HomeSectionHeader } from './HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface HomeCategoryRailProps {
  active: string;
  onSelect: (id: string) => void;
}

export function HomeCategoryRail({ active, onSelect }: HomeCategoryRailProps) {
  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Browse"
        title="Filter services"
        subtitle="Pick a room or view all"
        icon="options-outline"
        compact
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
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
              {on ? (
                <LinearGradient
                  colors={['#0B6E67', '#084F4A']}
                  style={styles.iconWrap}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={cat.icon} size={20} color={colors.white} />
                </LinearGradient>
              ) : (
                <View style={styles.iconWrapOff}>
                  <Ionicons name={cat.icon} size={20} color={colors.primary} />
                </View>
              )}
              <Text style={[styles.label, on && styles.labelOn]}>{cat.label}</Text>
              {on ? <View style={styles.activeBar} /> : <View style={styles.inactiveBar} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { ...premium.section },
  row: {
    paddingHorizontal: layout.pad,
    gap: spacing.md,
  },
  chip: {
    width: 78,
    alignItems: 'center',
    gap: 8,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  chipOn: {},
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapOff: {
    width: 58,
    height: 58,
    borderRadius: radius.xl,
    backgroundColor: colors.bgSubtle,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
  },
  labelOn: {
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  activeBar: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
  inactiveBar: {
    width: 20,
    height: 3,
    marginTop: 2,
  },
});
