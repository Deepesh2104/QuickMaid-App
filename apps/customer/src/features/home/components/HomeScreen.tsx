import { useCallback, useMemo, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HOME_SERVICES } from '@/constants/services';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useHomeProfile } from '../hooks/useHomeProfile';
import { useHomeSearch } from '../hooks/useHomeSearch';
import { HomeBundleRail } from './HomeBundleRail';
import { HomeCategoryRail } from './HomeCategoryRail';
import { HomeCoverageStrip } from './HomeCoverageStrip';
import { HomeFaqPreview } from './HomeFaqPreview';
import { HomeFeaturedRail } from './HomeFeaturedRail';
import { HomeGuaranteeCard } from './HomeGuaranteeCard';
import { HomeHeader } from './HomeHeader';
import { HomeHelpCta } from './HomeHelpCta';
import { HomeHowItWorks } from './HomeHowItWorks';
import { HomeOffersRow } from './HomeOffersRow';
import { HomePaymentTrust } from './HomePaymentTrust';
import { HomePlusCard } from './HomePlusCard';
import { HomePromoBanner } from './HomePromoBanner';
import { HomeQuickGrid } from './HomeQuickGrid';
import { HomeRebookCard } from './HomeRebookCard';
import { HomeReviewsStrip } from './HomeReviewsStrip';
import { HomeSearchBar } from './HomeSearchBar';
import { HomeServiceFilterSheet, type HomeSortOption } from './HomeServiceFilterSheet';
import { HomeSeasonalBanner } from './HomeSeasonalBanner';
import { HomeSectionHeader } from './HomeSectionHeader';
import { HomeServiceFeed } from './HomeServiceFeed';
import { HomeSkeleton } from './HomeSkeleton';
import { HomeTopPros } from './HomeTopPros';
import { HomeTrustStrip } from './HomeTrustStrip';
import { HomeUrgentStrip } from './HomeUrgentStrip';
import { HomeWhyUs } from './HomeWhyUs';

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { profile, loading, refresh } = useHomeProfile();
  const { unreadCount } = useNotifications();
  const { control, watch, setValue } = useHomeSearch();
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<HomeSortOption>('popular');
  const [filterOpen, setFilterOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const catalogueY = useRef(0);
  const lowerSheetY = useRef(0);

  const query = watch('query');

  const filtered = useMemo(() => {
    let list = HOME_SERVICES;
    if (category !== 'all') list = list.filter((s) => s.category === category);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.desc?.toLowerCase().includes(q) ?? false) ||
          s.category.includes(q),
      );
    }
    const priceNum = (p: string) => parseInt(p.replace(/\D/g, ''), 10) || 0;
    const sorted = [...list];
    if (sort === 'price_low') sorted.sort((a, b) => priceNum(a.price) - priceNum(b.price));
    else if (sort === 'price_high') sorted.sort((a, b) => priceNum(b.price) - priceNum(a.price));
    else if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [category, query, sort]);

  const scrollToCatalogue = useCallback(() => {
    setCategory('all');
    setValue('query', '');
    const y = 320 + lowerSheetY.current + catalogueY.current;
    scrollRef.current?.scrollTo({ y, animated: true });
  }, [setValue]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const onQuickTag = useCallback(
    (tag: string) => setValue('query', tag, { shouldValidate: true }),
    [setValue],
  );

  if (loading && !profile) {
    return <HomeSkeleton />;
  }

  const city = profile?.city ?? 'Raipur';
  const firstName = profile?.name?.split(' ')[0];
  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        bounces
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.scroll}
      >
        <HomeHeader
          paddingTop={insets.top}
          firstName={firstName}
          city={city}
          locality={profile?.locality}
          unreadCount={unreadCount}
        />

        <View style={styles.canvas}>
          <HomeSearchBar control={control} onQuickTag={onQuickTag} onOpenFilter={() => setFilterOpen(true)} />
          <HomeQuickGrid />

          <View
            style={styles.lowerSheet}
            onLayout={(e) => {
              lowerSheetY.current = e.nativeEvent.layout.y;
            }}
          >
            <View style={styles.sheetHandle} />
            <HomeTrustStrip />
            <HomeRebookCard />
            <HomeUrgentStrip />
            <HomeCategoryRail active={category} onSelect={setCategory} />
            <HomeFeaturedRail city={city} onSeeAll={scrollToCatalogue} />
            <HomeTopPros />
            <HomeBundleRail />
            <HomePromoBanner />
            <HomeOffersRow />
            <HomeHowItWorks />
            <HomeReviewsStrip />
            <HomeGuaranteeCard />
            <HomeWhyUs />
            <HomeSeasonalBanner />

            <View
              style={styles.catalogue}
              onLayout={(e) => {
                catalogueY.current = e.nativeEvent.layout.y;
              }}
            >
              <HomeSectionHeader
                eyebrow="Full catalogue"
                title="All services"
                subtitle={`${filtered.length} available · Swipe pages below`}
                icon="grid"
              />
              <View style={styles.feed}>
                <HomeServiceFeed services={filtered} query={query} />
              </View>
            </View>

            <HomePlusCard />
            <HomeCoverageStrip />
            <HomeFaqPreview />
            <HomeHelpCta />
            <HomePaymentTrust />

            <View style={styles.footer}>
              <View style={styles.footerLine} />
              <Text style={styles.footerBrand}>QuickMaid</Text>
              <Text style={styles.footerSub}>Premium home cleaning · Raipur</Text>
              <Text style={styles.footerNote}>Made with care for Indian homes</Text>
            </View>
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
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 0 },
  canvas: { backgroundColor: colors.bgSubtle },
  lowerSheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    marginTop: -6,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: 'rgba(15,20,25,0.05)',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.bgMuted,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  catalogue: { marginBottom: spacing.section },
  feed: { paddingHorizontal: layout.pad },
  footer: {
    alignItems: 'center',
    gap: 2,
    marginHorizontal: layout.pad,
    marginBottom: 0,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  footerLine: {
    width: 48,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.bgMuted,
    marginBottom: 0,
  },
  footerBrand: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: colors.muted,
    letterSpacing: 0.4,
  },
  footerSub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.mutedLight,
  },
  footerNote: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.mutedLight,
    marginTop: 0,
    marginBottom: 0,
  },
});
