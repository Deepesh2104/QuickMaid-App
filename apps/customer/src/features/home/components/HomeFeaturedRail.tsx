import { Ionicons } from '@expo/vector-icons';

import * as Haptics from 'expo-haptics';

import { LinearGradient } from 'expo-linear-gradient';

import { useState } from 'react';

import { Pressable, ScrollView, StyleSheet, Text, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

import Animated, {

  useAnimatedStyle,

  useSharedValue,

  withSpring,

} from 'react-native-reanimated';



import type { ServiceItem } from '@/constants/services';
import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';
import { useOpenServiceDetail } from '@/features/service/hooks/useOpenServiceDetail';

import { FEATURED_SERVICES } from '@/constants/services';

import { getServiceImages } from '../constants/unsplash.images';

import { HomePhoto } from './HomePhoto';

import { HomeSectionHeader } from './HomeSectionHeader';

import { fonts } from '@/theme/fonts';

import { colors } from '@/theme/colors';

import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { layout, radius, spacing } from '@/theme/spacing';



const AnimatedPress = Animated.createAnimatedComponent(Pressable);



const CARD_H = 240;



const BADGES = [

  { label: 'Most booked', icon: 'flame' as const, tone: '#FFF4ED', ink: '#C4320A' },

  { label: 'Best value', icon: 'pricetag' as const, tone: '#ECFDF3', ink: '#027A48' },

  { label: 'Top rated', icon: 'trophy' as const, tone: '#FFFAEB', ink: '#B54708' },

];



function FeaturedCard({ service, index, cardW }: { service: ServiceItem; index: number; cardW: number }) {
  const { bookService } = useStartBooking();
  const openDetail = useOpenServiceDetail();
  const scale = useSharedValue(1);

  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const badge = BADGES[index] ?? BADGES[0];



  return (

    <AnimatedPress

      style={[styles.card, { width: cardW }, anim]}

      onPressIn={() => {

        scale.value = withSpring(0.97, { damping: 14, stiffness: 320 });

      }}

      onPressOut={() => {

        scale.value = withSpring(1, { damping: 14, stiffness: 320 });

      }}

      onPress={() => openDetail(service.id)}

      accessibilityRole="button"

      accessibilityLabel={`View ${service.name}, ${service.price}`}

    >

      <HomePhoto uri={getServiceImages(service.id)} style={styles.photo} overlay="none" tint={service.tint} />

      <LinearGradient

        colors={['transparent', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.82)']}

        locations={[0.35, 0.62, 1]}

        style={StyleSheet.absoluteFill}

      />



      <Text style={styles.watermark}>{String(index + 1).padStart(2, '0')}</Text>



      <View style={[styles.badge, { backgroundColor: badge.tone }]}>

        <Ionicons name={badge.icon} size={11} color={badge.ink} />

        <Text style={[styles.badgeText, { color: badge.ink }]}>{badge.label}</Text>

      </View>



      <View style={styles.glassFooter}>

        <View style={styles.footerInner}>

          <View style={styles.copy}>

            <Text style={styles.name} numberOfLines={1}>

              {service.name}

            </Text>

            <View style={styles.metaRow}>

              <View style={styles.metaItem}>

                <Ionicons name="star" size={11} color={colors.star} />

                <Text style={styles.metaText}>{service.rating}</Text>

              </View>

              <Text style={styles.metaDot}>·</Text>

              <Text style={styles.metaText}>{service.duration}</Text>

              <Text style={styles.metaDot}>·</Text>

              <Text style={styles.metaText}>{service.reviews} booked</Text>

            </View>

          </View>

          <View style={styles.priceCol}>

            <Text style={styles.price}>{service.price}</Text>

            <Pressable
              style={styles.bookBtn}
              onPress={(e) => {
                e.stopPropagation?.();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                bookService(service);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Book ${service.name}`}
            >
              <Text style={styles.bookText}>Book</Text>
              <Ionicons name="arrow-forward" size={11} color={colors.white} />
            </Pressable>

          </View>

        </View>

      </View>

    </AnimatedPress>

  );

}



interface HomeFeaturedRailProps {
  city: string;
}

export function HomeFeaturedRail({ city }: HomeFeaturedRailProps) {

  const [active, setActive] = useState(0);
  const { railCardW } = useLayoutMetrics();
  const snap = railCardW + spacing.md;



  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {

    const x = e.nativeEvent.contentOffset.x;

    const idx = Math.round(x / snap);

    setActive(Math.min(Math.max(idx, 0), FEATURED_SERVICES.length - 1));

  };



  return (

    <View style={styles.block}>

      <HomeSectionHeader
        eyebrow="Curated for you"
        title="This week's picks"
        subtitle={`${city} · packages & specialty cleans`}
        icon="flame"
      />



      <ScrollView

        horizontal

        showsHorizontalScrollIndicator={false}

        decelerationRate="fast"

        snapToInterval={snap}

        onScroll={onScroll}

        scrollEventThrottle={16}

        contentContainerStyle={styles.row}

      >

        {FEATURED_SERVICES.map((s, i) => (

          <FeaturedCard key={s.id} service={s} index={i} cardW={railCardW} />

        ))}

      </ScrollView>



      <View style={styles.dots}>

        {FEATURED_SERVICES.map((s, i) => (

          <View key={s.id} style={[styles.dot, i === active && styles.dotOn]} />

        ))}

      </View>

    </View>

  );

}



const styles = StyleSheet.create({

  block: { marginBottom: spacing.section },

  row: {

    paddingHorizontal: layout.pad,

    gap: spacing.md,

    paddingRight: layout.pad + spacing.md,

  },

  card: {

    height: CARD_H,

    borderRadius: radius.xxl,

    overflow: 'hidden',

    backgroundColor: colors.bgSubtle,

  },

  photo: { ...StyleSheet.absoluteFill },

  watermark: {

    position: 'absolute',

    top: spacing.lg,

    right: spacing.lg,

    fontFamily: fonts.extraBold,

    fontSize: 52,

    color: 'rgba(255,255,255,0.1)',

    letterSpacing: -2,

  },

  badge: {

    position: 'absolute',

    top: spacing.md,

    left: spacing.md,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 5,

    borderRadius: radius.pill,

    paddingHorizontal: 10,

    paddingVertical: 6,

  },

  badgeText: {

    fontFamily: fonts.bold,

    fontSize: 10,

    letterSpacing: 0.2,

  },

  glassFooter: {

    position: 'absolute',

    left: spacing.sm,

    right: spacing.sm,

    bottom: spacing.sm,

    borderRadius: radius.xl,

    overflow: 'hidden',

    backgroundColor: 'rgba(255,255,255,0.14)',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.2)',

  },

  footerInner: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    padding: spacing.md,

    gap: spacing.md,

  },

  copy: { flex: 1, minWidth: 0, gap: 4 },

  name: {

    fontFamily: fonts.extraBold,

    fontSize: 17,

    color: colors.white,

    letterSpacing: -0.3,

  },

  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },

  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },

  metaText: {

    fontFamily: fonts.medium,

    fontSize: 11,

    color: 'rgba(255,255,255,0.88)',

  },

  metaDot: { color: 'rgba(255,255,255,0.45)', fontSize: 11 },

  priceCol: { alignItems: 'flex-end', gap: 6 },

  price: {

    fontFamily: fonts.extraBold,

    fontSize: 20,

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

  dots: {

    flexDirection: 'row',

    justifyContent: 'center',

    gap: 6,

    marginTop: spacing.md,

  },

  dot: {

    width: 6,

    height: 6,

    borderRadius: 3,

    backgroundColor: colors.bgMuted,

  },

  dotOn: {

    width: 18,

    backgroundColor: colors.primary,

  },

});


