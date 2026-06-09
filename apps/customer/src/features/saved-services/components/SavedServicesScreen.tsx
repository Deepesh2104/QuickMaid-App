import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { buildCatalogueHref } from '@/features/home/lib/home.catalogue';
import { HomeServiceCard, HomeServiceEmpty } from '@/features/home/components/HomeServiceCard';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { useProfileAccount } from '@/features/profile/hooks/useProfileAccount';
import { resolveSavedServices } from '../lib/saved.services';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function SavedServicesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { account, loading, toggleSavedService } = useProfileAccount();

  const services = useMemo(
    () => resolveSavedServices(account?.savedServiceIds ?? []),
    [account?.savedServiceIds],
  );

  if (loading && !account) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#010F0E', '#084F4A', '#0B6E67', '#12A598']}
        locations={[0, 0.3, 0.65, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>YOUR SHORTLIST</Text>
            <Text style={styles.headerTitle}>Saved services</Text>
          </View>
          <View style={styles.countBadge}>
            <Ionicons name="heart" size={12} color="#FBBF24" />
            <Text style={styles.countText}>{services.length}</Text>
          </View>
        </View>

        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>{services.length}</Text>
            <Text style={styles.headerStatLbl}>Saved</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>1-tap</Text>
            <Text style={styles.headerStatLbl}>Rebook</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>Sync</Text>
            <Text style={styles.headerStatLbl}>All devices</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {services.length === 0 ? (
            <View style={styles.emptyWrap}>
              <HomeServiceEmpty query="" />
              <Pressable
                style={styles.browseBtn}
                onPress={() => router.push(buildCatalogueHref() as Href)}
              >
                <Text style={styles.browseBtnText}>Browse catalogue</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.white} />
              </Pressable>
            </View>
          ) : (
            <>
              <HomeSectionHeader
                eyebrow="Favourites"
                title="Book again anytime"
                subtitle="Tap a card to view or book · Heart to remove"
                icon="heart"
                compact
              />
              <View style={styles.list}>
                {services.map((service, index) => (
                  <View key={service.id} style={styles.cardWrap}>
                    <HomeServiceCard service={service} index={index} />
                    <Pressable
                      style={styles.unsaveBtn}
                      onPress={() => {
                        Haptics.selectionAsync();
                        void toggleSavedService(service.id);
                      }}
                      accessibilityLabel={`Remove ${service.name} from saved`}
                    >
                      <Ionicons name="heart-dislike" size={16} color="#D92D20" />
                    </Pressable>
                  </View>
                ))}
              </View>

              <Pressable
                style={styles.exploreCard}
                onPress={() => router.push(buildCatalogueHref() as Href)}
              >
                <LinearGradient colors={['#F0FDF9', '#FFFFFF']} style={StyleSheet.absoluteFill} />
                <Ionicons name="grid-outline" size={22} color={colors.primaryDark} />
                <View style={styles.exploreCopy}>
                  <Text style={styles.exploreTitle}>Discover more services</Text>
                  <Text style={styles.exploreSub}>Browse full catalogue & save favourites</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: { paddingBottom: spacing.lg },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.pad,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1, gap: 2 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.white,
    letterSpacing: -0.4,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  countText: { fontFamily: fonts.bold, fontSize: 13, color: colors.white },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: layout.pad,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  headerStat: { flex: 1, alignItems: 'center', gap: 3 },
  headerStatVal: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.white },
  headerStatLbl: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  headerDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  sheet: {
    marginTop: -spacing.md,
    backgroundColor: '#F4F6F8',
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginBottom: spacing.lg,
  },
  list: {
    paddingHorizontal: layout.pad,
    gap: spacing.md,
  },
  cardWrap: { position: 'relative' },
  unsaveBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(217,45,32,0.2)',
    zIndex: 10,
  },
  emptyWrap: {
    paddingHorizontal: layout.pad,
    gap: spacing.lg,
    alignItems: 'center',
  },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  browseBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  exploreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: layout.pad,
    marginTop: spacing.section,
    padding: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.14)',
  },
  exploreCopy: { flex: 1, gap: 2 },
  exploreTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  exploreSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
});
