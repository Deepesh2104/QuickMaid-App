import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HOME_SERVICES } from '@/constants/services';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, spacing } from '@/theme/spacing';

import { useHomeProfile } from '../hooks/useHomeProfile';
import { useHomeSearch } from '../hooks/useHomeSearch';
import { HomeCategoryRail } from './HomeCategoryRail';
import { HomeFeaturedRail } from './HomeFeaturedRail';
import { HomeHeader } from './HomeHeader';
import { HomePlusCard } from './HomePlusCard';
import { HomePromoBanner } from './HomePromoBanner';
import { HomeQuickGrid } from './HomeQuickGrid';
import { HomeRebookCard } from './HomeRebookCard';
import { HomeSearchBar } from './HomeSearchBar';
import { HomeServiceFeed } from './HomeServiceFeed';
import { HomeSkeleton } from './HomeSkeleton';
import { HomeTrustStrip } from './HomeTrustStrip';

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { profile, loading, refresh } = useHomeProfile();
  const { control, watch, setValue } = useHomeSearch();
  const [category, setCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

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
    return list;
  }, [category, query]);

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
  const bottomPad = Math.max(insets.bottom, spacing.sm);

  return (
    <View style={styles.root}>
      <ScrollView
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
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad }]}
      >
        <HomeHeader
          paddingTop={insets.top}
          firstName={firstName}
          city={city}
          locality={profile?.locality}
        />

        <View style={styles.body}>
          <HomeSearchBar control={control} onQuickTag={onQuickTag} />

          <View style={styles.sections}>
            <HomeQuickGrid />
            <HomeRebookCard />
            <HomeTrustStrip />
            <HomeCategoryRail active={category} onSelect={setCategory} />
            <HomeFeaturedRail city={city} />
            <HomePromoBanner />

            <View style={styles.feedHead}>
              <Text style={styles.feedTitle}>All services</Text>
              <Text style={styles.feedSub}>
                {filtered.length} available · Background-verified pros
              </Text>
            </View>

            <View style={styles.feed}>
              <HomeServiceFeed services={filtered} query={query} />
            </View>

            <HomePlusCard />
            <Text style={styles.footer}>QuickMaid · Premium cleaning in Raipur</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scrollContent: {},
  body: {
    backgroundColor: colors.bg,
  },
  sections: {
    gap: spacing.xs,
  },
  feedHead: {
    paddingHorizontal: layout.pad,
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  feedTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  feedSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },
  feed: {
    paddingHorizontal: layout.pad,
    marginBottom: spacing.xl,
  },
  footer: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.mutedLight,
    textAlign: 'center',
    marginHorizontal: layout.pad,
    marginBottom: spacing.xs,
  },
});
