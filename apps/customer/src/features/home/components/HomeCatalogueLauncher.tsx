import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { buildCatalogueHref } from '../lib/home.catalogue';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const SHORTCUTS = [
  { label: 'Deep clean', icon: 'home-outline' as const },
  { label: 'Regular', icon: 'sparkles-outline' as const },
  { label: 'Kitchen', icon: 'restaurant-outline' as const },
  { label: 'Bathroom', icon: 'water-outline' as const },
];

interface HomeCatalogueLauncherProps {
  serviceCount?: number;
}

export function HomeCatalogueLauncher({ serviceCount }: HomeCatalogueLauncherProps) {
  const router = useRouter();

  const openCatalogue = (opts?: { q?: string; category?: string }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(buildCatalogueHref(opts) as Href);
  };

  return (
    <View style={styles.wrap}>
      <Pressable
        style={styles.pill}
        onPress={() => openCatalogue()}
        accessibilityRole="button"
        accessibilityLabel="Browse and search all cleaning services"
      >
        <Ionicons name="search" size={18} color={colors.primary} />
        <View style={styles.pillCopy}>
          <Text style={styles.placeholder}>Search services, rooms, packages…</Text>
          {serviceCount != null ? (
            <Text style={styles.hint}>{serviceCount} services · filters & sort inside</Text>
          ) : null}
        </View>
        <View style={styles.browseBtn}>
          <Ionicons name="grid" size={15} color={colors.white} />
        </View>
      </Pressable>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagsRow}
      >
        {SHORTCUTS.map((item) => (
          <Pressable
            key={item.label}
            style={styles.tag}
            onPress={() => openCatalogue({ q: item.label })}
            accessibilityRole="button"
          >
            <Ionicons name={item.icon} size={12} color={colors.primary} />
            <Text style={styles.tagText}>{item.label}</Text>
          </Pressable>
        ))}
        <Pressable
          style={styles.tagMore}
          onPress={() => openCatalogue()}
          accessibilityRole="button"
        >
          <Text style={styles.tagMoreText}>View all</Text>
          <Ionicons name="arrow-forward" size={12} color={colors.primaryDark} />
        </Pressable>
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
  pillCopy: {
    flex: 1,
    minWidth: 0,
    gap: 1,
    paddingVertical: 8,
  },
  placeholder: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.mutedLight,
  },
  hint: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.muted,
  },
  browseBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsRow: {
    paddingHorizontal: layout.pad,
    gap: spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.07)',
  },
  tagText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.inkSecondary,
  },
  tagMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  tagMoreText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primaryDark,
  },
});
