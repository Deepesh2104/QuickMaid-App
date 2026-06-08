import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import type { ServiceItem } from '@/constants/services';
import { HOME_SERVICES } from '@/constants/services';
import { getServiceImages } from '../constants/unsplash.images';
import { HomePhoto } from './HomePhoto';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const AnimatedPress = Animated.createAnimatedComponent(Pressable);

const TILE_W = (layout.screenWidth - layout.pad * 2 - layout.cardGap) / 2;
const TILE_H = 204;

function Tile({ service }: { service: ServiceItem }) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPress
      style={[styles.tile, anim]}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 15, stiffness: 340 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 340 });
      }}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      accessibilityRole="button"
      accessibilityLabel={`Book ${service.name}, from ${service.price}`}
    >
      <HomePhoto
        uri={getServiceImages(service.id)}
        style={styles.photo}
        overlay="none"
        tint={service.tint}
      />

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.08)', 'rgba(0,0,0,0.78)']}
        locations={[0.32, 0.58, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: service.tint }]}>
          <Ionicons name={service.icon} size={15} color={colors.primaryDark} />
        </View>
        <View style={styles.ratingPill}>
          <Ionicons name="star" size={10} color={colors.star} />
          <Text style={styles.ratingText}>{service.rating}</Text>
        </View>
      </View>

      {service.duration ? (
        <View style={styles.durationChip}>
          <Ionicons name="time-outline" size={10} color={colors.inkSecondary} />
          <Text style={styles.durationText}>{service.duration}</Text>
        </View>
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.name} numberOfLines={1}>
          {service.name}
        </Text>
        <Text style={styles.desc} numberOfLines={1}>
          {service.desc}
        </Text>

        <View style={styles.actionRow}>
          <View style={styles.priceBlock}>
            <Text style={styles.fromLabel}>From</Text>
            <Text style={styles.price}>{service.price}</Text>
          </View>
          <View style={styles.bookBtn}>
            <Text style={styles.bookText}>Book</Text>
            <Ionicons name="arrow-forward" size={11} color={colors.white} />
          </View>
        </View>
      </View>
    </AnimatedPress>
  );
}

export function HomeQuickGrid() {
  return (
    <View style={styles.block}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="flash" size={17} color={colors.primary} />
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Book instantly</Text>
          <View style={styles.subRow}>
            <View style={styles.subItem}>
              <Ionicons name="shield-checkmark" size={11} color={colors.primary} />
              <Text style={styles.sub}>Verified pros</Text>
            </View>
            <Text style={styles.subDot}>·</Text>
            <View style={styles.subItem}>
              <Ionicons name="flash-outline" size={11} color={colors.primary} />
              <Text style={styles.sub}>Same-day slots</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.grid}>
        {HOME_SERVICES.map((s) => (
          <Tile key={s.id} service={s} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingHorizontal: layout.pad,
    marginBottom: spacing.xxxl,
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1, minWidth: 0 },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 6,
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },
  subDot: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.mutedLight,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.cardGap,
  },
  tile: {
    width: TILE_W,
    height: TILE_H,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    backgroundColor: colors.bgSubtle,
  },
  photo: {
    ...StyleSheet.absoluteFill,
  },
  topRow: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.65)',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.ink,
  },
  durationChip: {
    position: 'absolute',
    top: 46,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  durationText: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    color: colors.inkSecondary,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
    gap: 2,
  },
  name: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.white,
    letterSpacing: -0.2,
  },
  desc: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.82)',
    marginBottom: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceBlock: {
    gap: 1,
  },
  fromLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  price: {
    fontFamily: fonts.extraBold,
    fontSize: 17,
    color: colors.white,
    letterSpacing: -0.3,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  bookText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.white,
  },
});
