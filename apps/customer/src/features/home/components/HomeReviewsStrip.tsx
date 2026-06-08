import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { premium } from '../constants/home.premium';
import { HomeSectionHeader } from './HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const REVIEWS = [
  {
    name: 'Priya S.',
    area: 'Civil Lines',
    rating: 5,
    text: 'Deep clean was spotless. Pro arrived on time and kitchen looked brand new.',
    service: 'Deep Cleaning',
  },
  {
    name: 'Rahul M.',
    area: 'Pandri',
    rating: 5,
    text: 'Booked regular cleaning — same maid every week. Super reliable in Raipur.',
    service: 'Regular Cleaning',
  },
  {
    name: 'Anjali K.',
    area: 'Telibandha',
    rating: 4,
    text: 'Bathroom service was thorough. Tiles and taps shine like new.',
    service: 'Bathroom Cleaning',
  },
];

export function HomeReviewsStrip() {
  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Real customers"
        title="Loved in Raipur"
        subtitle="4.85★ average from 50k+ homes"
        icon="chatbubble-ellipses-outline"
        compact
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {REVIEWS.map((r) => (
          <View key={r.name} style={styles.card}>
            <LinearGradient colors={['#FAFBFC', '#FFFFFF']} style={styles.cardBg} />
            <View style={styles.quoteIcon}>
              <Ionicons name="chatbubble" size={14} color={colors.primary} />
            </View>
            <View style={styles.stars}>
              {Array.from({ length: r.rating }).map((_, i) => (
                <Ionicons key={i} name="star" size={12} color={colors.star} />
              ))}
            </View>
            <Text style={styles.text} numberOfLines={3}>
              "{r.text}"
            </Text>
            <View style={styles.footer}>
              <View>
                <Text style={styles.name}>{r.name}</Text>
                <Text style={styles.area}>
                  {r.area} · {r.service}
                </Text>
              </View>
              <View style={styles.verified}>
                <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const CARD_W = layout.screenWidth * 0.78;

const styles = StyleSheet.create({
  block: { ...premium.section },
  row: {
    paddingHorizontal: layout.pad,
    gap: spacing.md,
    paddingRight: layout.pad + spacing.md,
  },
  card: {
    width: CARD_W,
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
    ...premium.surface,
    minHeight: 168,
  },
  cardBg: { ...StyleSheet.absoluteFill },
  quoteIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stars: { flexDirection: 'row', gap: 2 },
  text: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.inkSecondary,
    lineHeight: 20,
    minHeight: 60,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
  },
  area: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  verifiedText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.primaryDark,
  },
});
