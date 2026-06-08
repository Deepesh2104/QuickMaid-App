import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import type { DemoBooking } from '@/constants/demo';
import { REVIEW_TAGS, ratingLabel } from '../lib/booking.review';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface BookingReviewSubmittedCardProps {
  booking: DemoBooking;
}

export function BookingReviewSubmittedCard({ booking }: BookingReviewSubmittedCardProps) {
  if (!booking.reviewedAt || !booking.reviewRating) return null;

  const tagLabels = (booking.reviewTags ?? [])
    .map((id) => REVIEW_TAGS.find((t) => t.id === id)?.label)
    .filter(Boolean) as string[];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Ionicons name="star" size={18} color="#F79009" />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>Your review</Text>
          <Text style={styles.sub}>{ratingLabel(booking.reviewRating)}</Text>
        </View>
        <View style={styles.stars}>
          {Array.from({ length: 5 }, (_, i) => (
            <Ionicons
              key={i}
              name={i < booking.reviewRating! ? 'star' : 'star-outline'}
              size={14}
              color="#F79009"
            />
          ))}
        </View>
      </View>

      {tagLabels.length > 0 ? (
        <View style={styles.tags}>
          {tagLabels.map((label) => (
            <View key={label} style={styles.tag}>
              <Text style={styles.tagText}>{label}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {booking.reviewText ? <Text style={styles.text}>{booking.reviewText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFAEB',
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(247,144,9,0.2)',
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.bold, fontSize: 14, color: '#B54708' },
  sub: { fontFamily: fonts.medium, fontSize: 12, color: '#93370D' },
  stars: { flexDirection: 'row', gap: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(247,144,9,0.2)',
  },
  tagText: { fontFamily: fonts.semiBold, fontSize: 11, color: '#B54708' },
  text: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.inkSecondary,
    lineHeight: 19,
  },
});
