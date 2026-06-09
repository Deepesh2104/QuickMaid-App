import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CATEGORIES } from '@/constants/services';
import { buildCatalogueHref } from '../lib/home.catalogue';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const BROWSE_CATEGORIES = CATEGORIES.filter((c) => c.id !== 'all').slice(0, 8);

interface HomeCatalogueBrowseCardProps {
  serviceCount: number;
}

export function HomeCatalogueBrowseCard({ serviceCount }: HomeCatalogueBrowseCardProps) {
  const router = useRouter();

  const openCatalogue = (category?: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(buildCatalogueHref({ category: category ?? 'all' }) as Href);
  };

  return (
    <View style={styles.wrap}>
      <Pressable
        style={styles.card}
        onPress={() => openCatalogue()}
        accessibilityRole="button"
        accessibilityLabel={`Browse all ${serviceCount} services`}
      >
        <LinearGradient colors={['#F0FDF9', '#FFFFFF']} style={StyleSheet.absoluteFill} />

        <View style={styles.cardTop}>
          <View style={styles.cardIcon}>
            <Ionicons name="grid" size={20} color={colors.primaryDark} />
          </View>
          <View style={styles.cardCopy}>
            <Text style={styles.cardTitle}>Browse full catalogue</Text>
            <Text style={styles.cardSub}>
              {serviceCount} services · search, filter & sort
            </Text>
          </View>
          <View style={styles.cardCta}>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
        >
          {BROWSE_CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={styles.catChip}
              onPress={(e) => {
                e.stopPropagation?.();
                openCatalogue(cat.id);
              }}
              accessibilityRole="button"
            >
              <View style={styles.catIcon}>
                <Ionicons name={cat.icon} size={16} color={colors.primary} />
              </View>
              <Text style={styles.catLabel} numberOfLines={1}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Pressable>
    </View>
  );
}

/** @deprecated Use HomeCatalogueBrowseCard — kept as alias for imports. */
export const HomeCataloguePreview = HomeCatalogueBrowseCard;

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  card: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.14)',
    gap: spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCopy: { flex: 1, gap: 2 },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.ink,
  },
  cardSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
  cardCta: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catRow: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  catChip: {
    alignItems: 'center',
    gap: 6,
    width: 64,
  },
  catIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.inkSecondary,
    textAlign: 'center',
  },
});
