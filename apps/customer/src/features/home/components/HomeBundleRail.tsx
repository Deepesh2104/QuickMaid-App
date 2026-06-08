import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { HOME_SERVICES } from '@/constants/services';
import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';
import { getServiceImages } from '../constants/unsplash.images';
import { HomePhoto } from './HomePhoto';
import { HomeSectionHeader } from './HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const AnimatedPress = Animated.createAnimatedComponent(Pressable);

const BUNDLE_IDS = ['bhk2deep', 'monthly', 'diwali', 'sofa3plus'];
const BUNDLES = HOME_SERVICES.filter((s) => BUNDLE_IDS.includes(s.id));

function BundleCard({ service, tag }: { service: (typeof BUNDLES)[0]; tag: string }) {
  const { bookService } = useStartBooking();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPress
      style={[styles.card, anim]}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 14, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 320 });
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        bookService(service);
      }}
      accessibilityRole="button"
      accessibilityLabel={`${service.name}, ${service.price}`}
    >
      <HomePhoto uri={getServiceImages(service.id)} style={styles.photo} overlay="none" tint={service.tint} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={StyleSheet.absoluteFill} />
      <View style={styles.tag}>
        <Text style={styles.tagText}>{tag}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.name} numberOfLines={2}>
          {service.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{service.price}</Text>
          <View style={styles.book}>
            <Ionicons name="arrow-forward" size={12} color={colors.white} />
          </View>
        </View>
      </View>
    </AnimatedPress>
  );
}

const TAGS = ['Save 20%', 'Best value', 'Festival', 'Combo'];

export function HomeBundleRail() {
  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Smart combos"
        title="Bundle & save"
        subtitle="Packages built for Raipur homes"
        icon="cube-outline"
        compact
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {BUNDLES.map((s, i) => (
          <BundleCard key={s.id} service={s} tag={TAGS[i] ?? 'Popular'} />
        ))}
      </ScrollView>
    </View>
  );
}

const CARD_W = layout.screenWidth * 0.58;

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  row: {
    paddingHorizontal: layout.pad,
    gap: spacing.md,
    paddingRight: layout.pad + spacing.md,
  },
  card: {
    width: CARD_W,
    height: 168,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    backgroundColor: colors.bgSubtle,
  },
  photo: { ...StyleSheet.absoluteFill },
  tag: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.primaryDark,
  },
  footer: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    gap: 6,
  },
  name: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.white,
    letterSpacing: -0.2,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
  },
  book: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
