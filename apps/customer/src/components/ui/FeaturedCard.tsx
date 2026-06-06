import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, shadow, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface FeaturedCardProps {
  name: string;
  location: string;
  price: string;
  rating: string;
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  tag?: string;
  onPress?: () => void;
}

export function FeaturedCard({
  name,
  location,
  price,
  rating,
  duration,
  icon,
  tint,
  tag,
  onPress,
}: FeaturedCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.image, { backgroundColor: tint }]}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={28} color={colors.inkSecondary} />
        </View>
        {tag ? (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={11} color={colors.muted} />
          <Text style={styles.location} numberOfLines={1}>{location}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.priceCol}>
            <Text style={styles.from}>From</Text>
            <Text style={styles.price}>{price}</Text>
          </View>
          <View style={styles.ratingCol}>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={10} color={colors.star} />
              <Text style={styles.rating}>{rating}</Text>
            </View>
            <Text style={styles.duration}>{duration}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 216,
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    ...shadow.card,
  },
  image: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.ink,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    ...type.caption,
    fontSize: 9,
    fontWeight: '700',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  body: { padding: spacing.md },
  name: {
    ...type.bodySm,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.md,
  },
  location: {
    ...type.caption,
    color: colors.muted,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  priceCol: {},
  from: {
    ...type.caption,
    fontSize: 9,
    color: colors.muted,
    textTransform: 'uppercase',
  },
  price: {
    ...type.bodySm,
    fontWeight: '800',
    color: colors.ink,
  },
  ratingCol: { alignItems: 'flex-end' },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rating: {
    ...type.caption,
    fontWeight: '700',
    color: colors.ink,
  },
  duration: {
    ...type.caption,
    fontSize: 10,
    color: colors.muted,
    marginTop: 2,
  },
});
