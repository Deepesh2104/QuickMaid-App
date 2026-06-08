import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../../src/theme/fonts';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeFloatingSearch } from '../../src/components/home/HomeFloatingSearch';
import { HomeHero } from '../../src/components/home/HomeHero';
import { HomeServiceTile } from '../../src/components/home/HomeServiceTile';
import { ServiceListCard } from '../../src/components/home/ServiceListCard';
import { CategoryChip } from '../../src/components/ui/CategoryChip';
import { FeaturedCard } from '../../src/components/ui/FeaturedCard';
import { PromoCard } from '../../src/components/ui/PromoCard';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { UserProfile } from '../../src/constants/app';
import { CATEGORIES, FEATURED_SERVICES, HOME_SERVICES } from '../../src/constants/services';
import { getUserProfile } from '../../src/lib/storage';
import { colors } from '../../src/theme/colors';
import { layout, radius, shadow, spacing } from '../../src/theme/spacing';
import { type } from '../../src/theme/typography';

const SHEET_OVERLAP = 16;

const TRUST = [
  { icon: 'shield-checkmark' as const, value: '4.85★', label: 'Rated' },
  { icon: 'people' as const, value: '50k+', label: 'Homes' },
  { icon: 'time' as const, value: '98%', label: 'On-time' },
];

const FEATURED_TAGS = ['Most booked', 'Best value', 'Top rated'];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    getUserProfile().then(setProfile);
  }, []);

  const firstName = profile?.name?.split(' ')[0];

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return HOME_SERVICES;
    return HOME_SERVICES.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        <HomeHero
          paddingTop={insets.top}
          firstName={firstName}
          city={profile?.city ?? 'Raipur'}
          locality={profile?.locality}
        />

        <View style={[styles.sheet, { marginTop: -SHEET_OVERLAP }]}>
          <HomeFloatingSearch />

          {/* Main 2x2 booking grid */}
          <View style={styles.block}>
            <Text style={styles.sectionTitle}>Book a service</Text>
            <Text style={styles.sectionSub}>Tap to book · Same-day slots available</Text>
            <View style={styles.tileGrid}>
              {HOME_SERVICES.map((s) => (
                <HomeServiceTile
                  key={s.id}
                  name={s.name}
                  price={`From ${s.price}`}
                  duration={s.duration}
                  icon={s.icon}
                  tint={s.tint}
                />
              ))}
            </View>
          </View>

          {/* Rebook */}
          <Pressable style={styles.rebook}>
            <View style={styles.rebookIcon}>
              <Ionicons name="refresh" size={16} color={colors.primary} />
            </View>
            <View style={styles.rebookText}>
              <Text style={styles.rebookTitle}>Rebook Regular Cleaning</Text>
              <Text style={styles.rebookSub}>Last visit 5 days ago · ₹149</Text>
            </View>
            <View style={styles.rebookBtn}>
              <Text style={styles.rebookBtnText}>Book</Text>
            </View>
          </Pressable>

          {/* Stats strip */}
          <View style={styles.statsStrip}>
            {TRUST.map((t, i) => (
              <View key={t.label} style={[styles.statItem, i > 0 && styles.statBorder]}>
                <Ionicons name={t.icon} size={14} color={colors.primary} />
                <Text style={styles.statValue}>{t.value}</Text>
                <Text style={styles.statLabel}>{t.label}</Text>
              </View>
            ))}
          </View>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
            style={styles.chipsScroll}
          >
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat.id}
                label={cat.label}
                icon={cat.icon}
                active={activeCategory === cat.id}
                onPress={() => setActiveCategory(cat.id)}
              />
            ))}
          </ScrollView>

          {/* Featured */}
          <View style={styles.block}>
            <SectionHeader title="Popular near you" subtitle="Raipur's most booked" action="See all" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredRow}
            >
              {FEATURED_SERVICES.map((s, i) => (
                <FeaturedCard
                  key={s.id}
                  name={s.name}
                  location={s.location ?? profile?.city ?? 'Raipur'}
                  price={s.price}
                  rating={s.rating}
                  duration={s.duration ?? ''}
                  icon={s.icon}
                  tint={s.tint}
                  tag={FEATURED_TAGS[i]}
                />
              ))}
            </ScrollView>
          </View>

          {/* Promo */}
          <View style={styles.block}>
            <PromoCard
              title="Flat 20% off"
              subtitle="On your first booking in Raipur. Limited slots."
              code="FIRST20"
            />
          </View>

          {/* Service list */}
          <View style={styles.block}>
            <SectionHeader
              title="All cleaning services"
              subtitle={`${filteredServices.length} services · Verified professionals`}
            />
            {filteredServices.map((s) => (
              <ServiceListCard
                key={s.id}
                name={s.name}
                price={s.price}
                rating={s.rating}
                reviews={s.reviews}
                desc={s.desc}
                duration={s.duration}
                icon={s.icon}
                tint={s.tint}
              />
            ))}
          </View>

          {/* Plus */}
          <Pressable style={styles.plusBanner}>
            <View style={styles.plusRow}>
              <Ionicons name="diamond" size={22} color={colors.primary} />
              <View style={styles.plusText}>
                <Text style={styles.plusTitle}>QuickMaid Plus</Text>
                <Text style={styles.plusSub}>Unlimited reschedules · 10% off · Priority support</Text>
              </View>
              <Ionicons name="arrow-forward" size={18} color={colors.muted} />
            </View>
          </Pressable>

          <Text style={styles.footer}>QuickMaid · Trusted home cleaning in Raipur</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgSubtle,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.bgSubtle,
  },
  sheet: {
    flexGrow: 1,
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingBottom: spacing.xxl,
    ...shadow.lg,
  },
  block: {
    paddingHorizontal: layout.pad,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...type.h2,
    color: colors.ink,
    fontFamily: fonts.extraBold,
    letterSpacing: -0.4,
  },
  sectionSub: {
    ...type.bodySm,
    color: colors.muted,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.cardGap,
  },
  rebook: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: layout.pad,
    marginBottom: spacing.xl,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  rebookIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rebookText: { flex: 1 },
  rebookTitle: {
    ...type.bodySm,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  rebookSub: {
    ...type.caption,
    color: colors.muted,
    marginTop: 2,
  },
  rebookBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rebookBtnText: {
    ...type.caption,
    color: colors.white,
    fontFamily: fonts.bold,
  },
  statsStrip: {
    flexDirection: 'row',
    marginHorizontal: layout.pad,
    marginBottom: spacing.xl,
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statBorder: {
    borderLeftWidth: 1,
    borderLeftColor: colors.divider,
  },
  statValue: {
    ...type.bodySm,
    fontFamily: fonts.extraBold,
    color: colors.ink,
  },
  statLabel: {
    ...type.caption,
    fontSize: 10,
    color: colors.muted,
    fontFamily: fonts.semiBold,
  },
  chipsScroll: {
    marginBottom: spacing.xl,
  },
  chipsRow: {
    paddingHorizontal: layout.pad,
  },
  featuredRow: {
    paddingRight: layout.pad,
  },
  plusBanner: {
    marginHorizontal: layout.pad,
    marginBottom: spacing.xl,
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  plusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  plusText: { flex: 1 },
  plusTitle: {
    ...type.bodySm,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  plusSub: {
    ...type.caption,
    color: colors.muted,
    marginTop: 2,
  },
  footer: {
    ...type.caption,
    color: colors.mutedLight,
    textAlign: 'center',
    marginHorizontal: layout.pad,
    paddingBottom: spacing.md,
  },
});
