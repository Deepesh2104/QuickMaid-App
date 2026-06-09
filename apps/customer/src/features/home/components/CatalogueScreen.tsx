import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter, useSegments } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { PAGE_SIZE } from '@/constants/pagination';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';
import { layout, radius, spacing } from '@/theme/spacing';

import { filterAndSortServices } from '../lib/home.catalogue';
import { HomeCategoryRail } from './HomeCategoryRail';
import { HomeSearchBar } from './HomeSearchBar';
import { HomeServiceFeed } from './HomeServiceFeed';
import { HomeServiceFilterSheet, type HomeSortOption } from './HomeServiceFilterSheet';
import { useHomeSearch } from '../hooks/useHomeSearch';

const SORT_LABELS: Record<HomeSortOption, string> = {
  popular: 'Popular',
  price_low: 'Price ↑',
  price_high: 'Price ↓',
  name: 'A–Z',
};

function parseSort(value: string | string[] | undefined): HomeSortOption {
  const v = Array.isArray(value) ? value[0] : value;
  if (v === 'price_low' || v === 'price_high' || v === 'name' || v === 'popular') return v;
  return 'popular';
}

export function CatalogueScreen() {
  const router = useRouter();
  const segments = useSegments();
  const isTabRoute = segments[0] === '(tabs)' && segments[1] === 'catalogue';
  const insets = useSafeAreaInsets();
  const { width, tabScrollPad } = useLayoutMetrics();
  const compact = width < 360;
  const scrollPad = isTabRoute ? tabScrollPad : insets.bottom + spacing.xl;
  const params = useLocalSearchParams<{ category?: string; q?: string; sort?: string }>();
  const { control, watch, setValue } = useHomeSearch();

  const [category, setCategory] = useState(() => {
    const c = Array.isArray(params.category) ? params.category[0] : params.category;
    return c || 'all';
  });
  const [sort, setSort] = useState<HomeSortOption>(() => parseSort(params.sort));
  const [filterOpen, setFilterOpen] = useState(false);

  const query = watch('query');

  useEffect(() => {
    const q = Array.isArray(params.q) ? params.q[0] : params.q;
    if (q) setValue('query', q, { shouldValidate: true });
  }, [params.q, setValue]);

  const filtered = useMemo(
    () => filterAndSortServices({ category, query, sort }),
    [category, query, sort],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#010F0E', '#053D3A', '#084F4A', '#0B6E67', '#12A598']}
        locations={[0, 0.22, 0.48, 0.72, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.meshA} pointerEvents="none" />
        <View style={styles.meshB} pointerEvents="none" />
        <View style={styles.heroWatermark} pointerEvents="none">
          <Ionicons name="grid" size={88} color="rgba(255,255,255,0.04)" />
        </View>

        <View style={styles.headerRow}>
          {isTabRoute ? (
            <View style={styles.backBtn} />
          ) : (
            <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
              <Ionicons name="arrow-back" size={22} color={colors.white} />
            </Pressable>
          )}
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>FULL CATALOGUE</Text>
            <Text style={styles.headerTitle}>All services</Text>
          </View>
          <Pressable
            style={styles.sortBtn}
            onPress={() => {
              Haptics.selectionAsync();
              setFilterOpen(true);
            }}
            accessibilityRole="button"
          >
            <Ionicons name="swap-vertical" size={14} color={colors.white} />
            {!compact ? <Text style={styles.sortBtnText}>Sort</Text> : null}
          </Pressable>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Ionicons name="apps-outline" size={12} color="#6EE7B7" />
            <Text style={styles.summaryNum}>{filtered.length}</Text>
            <Text style={styles.summaryLabel}>Services</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Ionicons name="layers-outline" size={12} color="#6EE7B7" />
            <Text style={styles.summaryNum}>{PAGE_SIZE}</Text>
            <Text style={styles.summaryLabel}>Per page</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Ionicons name="document-text-outline" size={12} color="#FCD34D" />
            <Text style={styles.summaryNum}>{totalPages}</Text>
            <Text style={styles.summaryLabel}>Pages</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.searchDock}>
        <View style={styles.handle} />
        <HomeSearchBar
          inset
          tagsPerView={3}
          control={control}
          onQuickTag={(tag) => setValue('query', tag, { shouldValidate: true })}
          onOpenFilter={() => setFilterOpen(true)}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: scrollPad }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sheet}>
          <View style={styles.sortSection}>
            <Text style={styles.sortHint}>Sort: {SORT_LABELS[sort]}</Text>
            <View style={styles.sortWrap}>
              {(Object.keys(SORT_LABELS) as HomeSortOption[]).map((id) => {
                const on = sort === id;
                const label = compact ? SORT_LABELS[id].split(' ')[0] : SORT_LABELS[id];
                return (
                  <Pressable
                    key={id}
                    style={[styles.sortChip, on && styles.sortChipOn]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSort(id);
                    }}
                  >
                    {on ? (
                      <LinearGradient
                        colors={['#084F4A', '#0B6E67']}
                        style={styles.sortChipGrad}
                      >
                        <Text style={styles.sortChipTextOn}>{label}</Text>
                      </LinearGradient>
                    ) : (
                      <Text style={styles.sortChipText}>{label}</Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <HomeCategoryRail active={category} onSelect={setCategory} />

          <View style={styles.feedHead}>
            <Text style={styles.feedTitle}>
              {filtered.length} service{filtered.length === 1 ? '' : 's'}
              {query ? ` · “${query}”` : ''}
            </Text>
            <Text style={styles.feedSub}>Page through results below</Text>
          </View>

          <View style={styles.feed}>
            <HomeServiceFeed services={filtered} query={`${query}-${category}-${sort}`} />
          </View>
        </View>
      </ScrollView>

      <HomeServiceFilterSheet
        visible={filterOpen}
        sort={sort}
        onClose={() => setFilterOpen(false)}
        onSortChange={setSort}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  header: {
    paddingBottom: spacing.lg,
    overflow: 'hidden',
  },
  meshA: {
    position: 'absolute',
    top: -40,
    right: -28,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(110,231,183,0.14)',
  },
  meshB: {
    position: 'absolute',
    bottom: 8,
    left: -36,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroWatermark: {
    position: 'absolute',
    right: layout.pad,
    top: 52,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.pad,
    gap: spacing.md,
    marginBottom: spacing.md,
    zIndex: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerCopy: { flex: 1, gap: 2 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.white,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(1,15,14,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.22)',
  },
  sortBtnText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: layout.pad,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.2)',
    zIndex: 1,
  },
  summaryItem: { flex: 1, alignItems: 'center', gap: 3 },
  summaryNum: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: -0.3,
  },
  summaryLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  searchDock: {
    marginTop: -spacing.md,
    backgroundColor: '#F4F6F8',
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(15,20,25,0.06)',
  },
  scroll: { flex: 1 },
  sheet: {
    backgroundColor: '#F4F6F8',
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
  sortSection: {
    paddingHorizontal: layout.pad,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  sortHint: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
  },
  sortWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sortChip: {
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  sortChipOn: { borderColor: 'transparent' },
  sortChipGrad: {
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  sortChipText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.inkSecondary,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  sortChipTextOn: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
  },
  feedHead: {
    paddingHorizontal: layout.pad,
    marginBottom: spacing.sm,
    gap: 2,
  },
  feedTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  feedSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
  feed: {
    paddingHorizontal: layout.pad,
  },
});
