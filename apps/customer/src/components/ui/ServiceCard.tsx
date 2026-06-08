import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../../theme/fonts';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { layout, radius, shadow, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface ServiceCardProps {
  name: string;
  price: string;
  rating: string;
  reviews: string;
  duration?: string;
  desc?: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  onPress?: () => void;
}

export function ServiceCard({
  name,
  price,
  rating,
  reviews,
  duration,
  desc,
  icon,
  tint,
  onPress,
}: ServiceCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.image, { backgroundColor: tint }]}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={22} color={colors.inkSecondary} />
        </View>
        {duration ? (
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={9} color={colors.muted} />
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        {desc ? <Text style={styles.desc} numberOfLines={1}>{desc}</Text> : null}

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={11} color={colors.star} />
          <Text style={styles.rating}>{rating}</Text>
          <Text style={styles.reviews}>({reviews})</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>{price}</Text>
          <View style={styles.bookBtn}>
            <Text style={styles.bookText}>Book</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: layout.serviceCardW,
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadow.card,
  },
  image: {
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 3,
    ...shadow.sm,
  },
  durationText: {
    ...type.caption,
    fontSize: 9,
    fontFamily: fonts.semiBold,
    color: colors.inkSecondary,
  },
  body: { padding: spacing.md },
  name: {
    ...type.bodySm,
    fontFamily: fonts.bold,
    color: colors.ink,
    lineHeight: 18,
    marginBottom: 2,
  },
  desc: {
    ...type.caption,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: spacing.md,
  },
  rating: { ...type.caption, fontFamily: fonts.bold, color: colors.ink },
  reviews: { ...type.caption, color: colors.muted },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    ...type.bodySm,
    color: colors.ink,
    fontFamily: fonts.extraBold,
  },
  bookBtn: {
    backgroundColor: colors.ink,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  bookText: {
    ...type.caption,
    color: colors.white,
    fontFamily: fonts.bold,
  },
});
