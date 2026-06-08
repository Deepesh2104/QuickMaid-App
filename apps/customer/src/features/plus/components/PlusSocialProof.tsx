import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const REVIEWS = [
  {
    name: 'Priya S.',
    area: 'Shankar Nagar',
    text: 'Plus saved us ₹600 last month. Same maid every time!',
    rating: 5,
  },
  {
    name: 'Rahul M.',
    area: 'Sector 5',
    text: 'Priority slots are real — booked Sunday morning easily.',
    rating: 5,
  },
  {
    name: 'Anita K.',
    area: 'Telibandha',
    text: 'Flex 6 is perfect for our small flat. Great value.',
    rating: 5,
  },
];

export function PlusSocialProof() {
  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Raipur homes"
        title="Loved by members"
        subtitle="2,400+ households on Plus"
        icon="heart-outline"
        compact
      />

      <View style={styles.statBanner}>
        <LinearGradient colors={['#FFF8EE', '#FFFFFF']} style={StyleSheet.absoluteFill} />
        <View style={styles.statLeft}>
          <Text style={styles.statValue}>4.9</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Ionicons key={s} name="star" size={12} color="#F59E0B" />
            ))}
          </View>
          <Text style={styles.statLabel}>Member rating</Text>
        </View>
        <View style={styles.statSep} />
        <View style={styles.statRight}>
          <Text style={styles.statBig}>2,400+</Text>
          <Text style={styles.statSub}>Active members in Raipur</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {REVIEWS.map((r) => (
          <View key={r.name} style={styles.review}>
            <View style={styles.reviewStars}>
              {Array.from({ length: r.rating }).map((_, i) => (
                <Ionicons key={i} name="star" size={10} color="#F59E0B" />
              ))}
            </View>
            <Text style={styles.reviewText}>"{r.text}"</Text>
            <Text style={styles.reviewName}>
              {r.name} · {r.area}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const REVIEW_W = 220;

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  statBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(181,71,8,0.12)',
  },
  statLeft: { alignItems: 'center', paddingHorizontal: spacing.md, gap: 2 },
  statValue: {
    fontFamily: fonts.extraBold,
    fontSize: 28,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  stars: { flexDirection: 'row', gap: 2 },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.muted,
  },
  statSep: {
    width: StyleSheet.hairlineWidth,
    height: 48,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.md,
  },
  statRight: { flex: 1, gap: 2 },
  statBig: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: '#B54708',
  },
  statSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
  row: {
    paddingHorizontal: layout.pad,
    gap: spacing.sm,
    paddingRight: layout.pad + spacing.sm,
  },
  review: {
    width: REVIEW_W,
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  reviewStars: { flexDirection: 'row', gap: 2 },
  reviewText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.inkSecondary,
    lineHeight: 18,
    flex: 1,
  },
  reviewName: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.muted,
  },
});
