import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../../theme/fonts';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { layout, radius, shadow, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface HomeServiceTileProps {
  name: string;
  price: string;
  duration?: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  onPress?: () => void;
}

export function HomeServiceTile({
  name,
  price,
  duration,
  icon,
  tint,
  onPress,
}: HomeServiceTileProps) {
  return (
    <Pressable style={styles.tile} onPress={onPress}>
      <View style={[styles.bg, { backgroundColor: tint }]}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={26} color={colors.inkSecondary} />
        </View>
        {duration ? (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
    </Pressable>
  );
}

const TILE_W = (layout.screenWidth - layout.pad * 2 - layout.cardGap) / 2;

const styles = StyleSheet.create({
  tile: {
    width: TILE_W,
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadow.card,
  },
  bg: {
    height: 108,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    ...shadow.sm,
  },
  durationText: {
    ...type.caption,
    fontSize: 9,
    fontFamily: fonts.bold,
    color: colors.inkSecondary,
  },
  body: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  name: {
    ...type.bodySm,
    fontFamily: fonts.bold,
    color: colors.ink,
    lineHeight: 17,
    minHeight: 34,
    marginBottom: 4,
  },
  price: {
    ...type.bodySm,
    fontFamily: fonts.extraBold,
    color: colors.primary,
  },
});
