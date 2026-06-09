import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Controller, type Control } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import type { HomeSearchForm } from '../schemas/home-search.schema';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { layout, radius, spacing } from '@/theme/spacing';

const QUICK = [
  { label: 'Deep clean', icon: 'home-outline' as const },
  { label: 'Regular', icon: 'sparkles-outline' as const },
  { label: 'Kitchen', icon: 'restaurant-outline' as const },
  { label: 'Bathroom', icon: 'water-outline' as const },
  { label: 'Packages', icon: 'cube-outline' as const },
  { label: 'Sofa', icon: 'bed-outline' as const },
  { label: 'AC', icon: 'snow-outline' as const },
  { label: 'Outdoor', icon: 'sunny-outline' as const },
];

const TAG_GAP = spacing.sm;

interface HomeSearchBarProps {
  control: Control<HomeSearchForm>;
  onQuickTag: (tag: string) => void;
  onOpenFilter?: () => void;
  /** Catalogue / inner screens — stable position below header */
  inset?: boolean;
  /** Fixed-width tags per viewport (e.g. 3) + horizontal snap scroll */
  tagsPerView?: number;
}

export function HomeSearchBar({
  control,
  onQuickTag,
  onOpenFilter,
  inset,
  tagsPerView,
}: HomeSearchBarProps) {
  const { contentWidth } = useLayoutMetrics();
  const tagW =
    tagsPerView && tagsPerView > 0
      ? (contentWidth - TAG_GAP * (tagsPerView - 1)) / tagsPerView
      : undefined;
  const snap = tagW ? tagW + TAG_GAP : undefined;

  return (
    <View style={[styles.wrap, inset && styles.wrapInset]}>
      <View style={styles.pill}>
        <Ionicons name="search" size={18} color={colors.primary} />
        <Controller
          control={control}
          name="query"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="What needs cleaning today?"
              placeholderTextColor={colors.mutedLight}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="search"
              accessibilityLabel="Search cleaning services"
            />
          )}
        />
        <Pressable
          style={styles.filter}
          onPress={() => {
            Haptics.selectionAsync();
            onOpenFilter?.();
          }}
          accessibilityRole="button"
          accessibilityLabel="Filter services"
        >
          <Ionicons name="options-outline" size={15} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate={snap ? 'fast' : 'normal'}
        snapToAlignment="start"
        snapToInterval={snap}
        contentContainerStyle={styles.tagsRow}
      >
        {QUICK.map((item) => (
          <Pressable
            key={item.label}
            style={[styles.tag, tagW != null && { width: tagW }]}
            onPress={() => {
              Haptics.selectionAsync();
              onQuickTag(item.label);
            }}
            accessibilityRole="button"
          >
            <Ionicons name={item.icon} size={12} color={colors.primary} />
            <Text style={styles.tagText} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: -20,
    marginBottom: spacing.xxl,
    zIndex: 30,
    gap: spacing.md,
  },
  wrapInset: {
    marginTop: 0,
    marginBottom: 0,
    zIndex: 0,
    gap: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: layout.pad,
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    paddingVertical: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 12,
  },
  filter: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsRow: {
    paddingHorizontal: layout.pad,
    gap: TAG_GAP,
    paddingRight: layout.pad,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.07)',
  },
  tagText: {
    flexShrink: 1,
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.inkSecondary,
  },
});
