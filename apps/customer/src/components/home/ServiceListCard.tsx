import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, shadow, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface ServiceListCardProps {
  name: string;
  price: string;
  rating: string;
  reviews: string;
  desc?: string;
  duration?: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  onPress?: () => void;
}

export function ServiceListCard({
  name,
  price,
  rating,
  reviews,
  desc,
  duration,
  icon,
  tint,
  onPress,
}: ServiceListCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: tint }]}>
        <Ionicons name={icon} size={22} color={colors.inkSecondary} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        {desc ? <Text style={styles.desc} numberOfLines={1}>{desc}</Text> : null}
        <View style={styles.meta}>
          <Ionicons name="star" size={10} color={colors.star} />
          <Text style={styles.rating}>{rating}</Text>
          <Text style={styles.reviews}>({reviews})</Text>
          {duration ? (
            <>
              <Text style={styles.sep}>·</Text>
              <Text style={styles.duration}>{duration}</Text>
            </>
          ) : null}
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.price}>{price}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.md,
    ...shadow.sm,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  name: {
    ...type.bodySm,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 2,
  },
  desc: {
    ...type.caption,
    color: colors.muted,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rating: {
    ...type.caption,
    fontWeight: '700',
    color: colors.ink,
  },
  reviews: {
    ...type.caption,
    color: colors.muted,
  },
  sep: {
    ...type.caption,
    color: colors.mutedLight,
    marginHorizontal: 2,
  },
  duration: {
    ...type.caption,
    color: colors.muted,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  price: {
    ...type.bodySm,
    fontWeight: '800',
    color: colors.ink,
  },
});
