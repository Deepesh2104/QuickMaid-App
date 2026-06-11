import { type Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { syncBookingsFromPartnerStatusBridge } from '@/lib/booking-status-bridge.storage';
import { useHomeDeliveryAddress } from '../hooks/useHomeDeliveryAddress';
import { useHomeProfile } from '../hooks/useHomeProfile';
import { HomeDeliverToSheet } from './HomeDeliverToSheet';
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
import { HomeQuickGrid } from './HomeQuickGrid';
import { HomeRebookCard } from './HomeRebookCard';
import { HomeReviewsStrip } from './HomeReviewsStrip';
import { HomeSkeleton } from './HomeSkeleton';
import { HomeTrustStrip } from './HomeTrustStrip';
import { HomeUrgentStrip } from './HomeUrgentStrip';

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tabScrollPad } = useLayoutMetrics();
  const { profile, loading, refresh } = useHomeProfile();
  const {
    defaultAddress,
    deliverTitle,
    deliverLine,
    addresses,
    selectAddress,
    refresh: refreshDelivery,
  } = useHomeDeliveryAddress();
  const { unreadCount } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);
  const [deliverOpen, setDeliverOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refreshDelivery();
      void syncBookingsFromPartnerStatusBridge();
    }, [refreshDelivery]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refresh(), refreshDelivery()]);
    setRefreshing(false);
  }, [refresh, refreshDelivery]);

  if (loading && !profile) {
    return <HomeSkeleton />;
  }

  const city = profile?.city ?? 'Raipur';
  const firstName = profile?.name?.split(' ')[0];

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
        contentContainerStyle={[styles.scroll, { paddingBottom: tabScrollPad }]}
      >
        <HomeHeader
          paddingTop={insets.top}
          firstName={firstName}
          avatarUri={profile?.avatarUri}
          deliverTitle={deliverTitle}
          deliverLine={deliverLine}
          unreadCount={unreadCount}
          onDeliverTo={() => {
            if (addresses.length === 0) {
              router.push('/account/address-picker' as Href);
            } else {
              setDeliverOpen(true);
            }
          }}
        />

        <View style={styles.canvas}>
          <HomeQuickGrid />

          <View style={styles.lowerSheet}>
            <View style={styles.sheetHandle} />
            <HomeTrustStrip />
            <HomeRebookCard />
            <HomeUrgentStrip />
            <HomeFeaturedRail city={city} />
            <HomeHowItWorks />

            <HomeOffersRow />
            <HomeReviewsStrip />
            <HomeGuaranteeCard />
            <HomePlusCard />
            <HomeCoverageStrip />
            <HomeFaqPreview />
            <HomePaymentTrust />
            <HomeHelpCta />

            <View style={styles.footer}>
              <View style={styles.footerLine} />
              <Text style={styles.footerBrand}>QuickMaid</Text>
              <Text style={styles.footerSub}>Premium home cleaning · {city}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <HomeDeliverToSheet
        visible={deliverOpen}
        addresses={addresses}
        activeId={defaultAddress?.id}
        onClose={() => setDeliverOpen(false)}
        onSelect={(addr) => void selectAddress(addr)}
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
});
