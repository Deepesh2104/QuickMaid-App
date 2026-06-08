import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';
import { HOME_IMAGES } from '../constants/unsplash.images';
import { HomePhoto } from './HomePhoto';
import { HomeSectionHeader } from './HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const AnimatedPress = Animated.createAnimatedComponent(Pressable);

export function HomeSeasonalBanner() {
  const { bookById } = useStartBooking();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Seasonal"
        title="Festival ready homes"
        subtitle="Pre-Diwali & monsoon specials"
        icon="sunny-outline"
        compact
      />
      <AnimatedPress
        style={[styles.card, anim]}
        onPressIn={() => {
          scale.value = withSpring(0.98, { damping: 16, stiffness: 360 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 16, stiffness: 360 });
        }}
        onPress={() => bookById('diwali')}
        accessibilityRole="button"
        accessibilityLabel="Pre-festival deep clean from 599 rupees"
      >
        <HomePhoto uri={HOME_IMAGES.deep} style={styles.photo} overlay="none" tint="#FFF4ED" />
        <LinearGradient
          colors={['rgba(15,20,25,0.2)', 'rgba(180,83,9,0.88)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.badge}>
          <Ionicons name="flame" size={11} color="#C4320A" />
          <Text style={styles.badgeText}>Trending now</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Pre-festival deep clean</Text>
          <Text style={styles.sub}>Full home scrub · Kitchen shine · Entrance decor-ready</Text>
          <View style={styles.footer}>
            <Text style={styles.price}>From ₹599</Text>
            <View style={styles.cta}>
              <Text style={styles.ctaText}>Book now</Text>
              <Ionicons name="arrow-forward" size={12} color={colors.white} />
            </View>
          </View>
        </View>
      </AnimatedPress>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  card: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    minHeight: 156,
  },
  photo: { ...StyleSheet.absoluteFill },
  badge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    zIndex: 1,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: '#C4320A',
  },
  content: {
    padding: spacing.lg,
    gap: 6,
    zIndex: 1,
    justifyContent: 'flex-end',
    flex: 1,
    minHeight: 156,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.white,
    letterSpacing: -0.4,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 17,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  price: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  ctaText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
  },
});
