import { Ionicons } from '@expo/vector-icons';

import * as Haptics from 'expo-haptics';

import { LinearGradient } from 'expo-linear-gradient';

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Animated, {

  useAnimatedStyle,

  useSharedValue,

  withSpring,

} from 'react-native-reanimated';



import type { ServiceItem } from '@/constants/services';

import { FEATURED_SERVICES } from '@/constants/services';

import { getServiceImages } from '../constants/unsplash.images';

import { HomePhoto } from './HomePhoto';

import { fonts } from '@/theme/fonts';

import { colors } from '@/theme/colors';

import { layout, radius, shadow, spacing } from '@/theme/spacing';



const AnimatedPress = Animated.createAnimatedComponent(Pressable);



const CARD_W = layout.screenWidth * 0.78;

const CARD_H = 212;



const BADGES = [

  { label: 'Most booked', icon: 'flame' as const, tone: '#FFF4ED', ink: '#C4320A' },

  { label: 'Best value', icon: 'pricetag' as const, tone: '#ECFDF3', ink: '#027A48' },

  { label: 'Top rated', icon: 'trophy' as const, tone: '#FFFAEB', ink: '#B54708' },

];



function FeaturedCard({ service, index }: { service: ServiceItem; index: number }) {

  const scale = useSharedValue(1);

  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const badge = BADGES[index] ?? BADGES[0];



  return (

    <AnimatedPress

      style={[styles.card, anim]}

      onPressIn={() => {

        scale.value = withSpring(0.97, { damping: 14, stiffness: 320 });

      }}

      onPressOut={() => {

        scale.value = withSpring(1, { damping: 14, stiffness: 320 });

      }}

      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}

      accessibilityRole="button"

      accessibilityLabel={`Book ${service.name}, ${service.price}`}

    >

      <HomePhoto

        uri={getServiceImages(service.id)}

        style={styles.photo}

        overlay="none"

        tint={service.tint}

      />



      <LinearGradient

        colors={['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.72)']}

        locations={[0.35, 0.62, 1]}

        style={StyleSheet.absoluteFill}

      />



      <View style={[styles.badge, { backgroundColor: badge.tone }]}>

        <Ionicons name={badge.icon} size={11} color={badge.ink} />

        <Text style={[styles.badgeText, { color: badge.ink }]}>{badge.label}</Text>

      </View>



      <View style={styles.ratingPill}>

        <Ionicons name="star" size={11} color={colors.star} />

        <Text style={styles.ratingText}>{service.rating}</Text>

        <Text style={styles.reviewsText}>({service.reviews})</Text>

      </View>



      <View style={styles.footer}>

        <View style={styles.copy}>

          <Text style={styles.name} numberOfLines={1}>

            {service.name}

          </Text>

          <View style={styles.meta}>

            <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.85)" />

            <Text style={styles.metaText}>{service.duration}</Text>

            <Text style={styles.metaDot}>·</Text>

            <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.85)" />

            <Text style={styles.metaText}>{service.location}</Text>

          </View>

        </View>



        <View style={styles.priceCol}>

          <Text style={styles.price}>{service.price}</Text>

          <View style={styles.bookBtn}>

            <Text style={styles.bookText}>Book</Text>

            <Ionicons name="arrow-forward" size={12} color={colors.white} />

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

  return (

    <View style={styles.block}>

      <View style={styles.head}>

        <View style={styles.headLeft}>

          <View style={styles.headIcon}>

            <Ionicons name="flame" size={16} color={colors.primary} />

          </View>

          <View>

            <Text style={styles.title}>Popular near you</Text>

            <Text style={styles.sub}>Top picks in {city} this week</Text>

          </View>

        </View>

        <Pressable

          style={styles.seeAll}

          onPress={() => Haptics.selectionAsync()}

          accessibilityRole="button"

          accessibilityLabel="See all popular services"

        >

          <Text style={styles.link}>See all</Text>

          <Ionicons name="chevron-forward" size={14} color={colors.primary} />

        </Pressable>

      </View>



      <ScrollView

        horizontal

        showsHorizontalScrollIndicator={false}

        decelerationRate="fast"

        snapToInterval={CARD_W + spacing.md}

        contentContainerStyle={styles.row}

      >

        {FEATURED_SERVICES.map((s, i) => (

          <FeaturedCard key={s.id} service={s} index={i} />

        ))}

      </ScrollView>

    </View>

  );

}



const styles = StyleSheet.create({

  block: { marginBottom: spacing.xxl, marginTop: spacing.sm },

  head: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    paddingHorizontal: layout.pad,

    marginBottom: spacing.lg,

  },

  headLeft: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: spacing.md,

    flex: 1,

    minWidth: 0,

  },

  headIcon: {

    width: 40,

    height: 40,

    borderRadius: radius.md,

    backgroundColor: colors.primaryLight,

    alignItems: 'center',

    justifyContent: 'center',

  },

  title: {

    fontFamily: fonts.extraBold,

    fontSize: 20,

    color: colors.ink,

    letterSpacing: -0.4,

  },

  sub: {

    fontFamily: fonts.regular,

    fontSize: 13,

    color: colors.muted,

    marginTop: 2,

  },

  seeAll: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 2,

    paddingLeft: spacing.sm,

  },

  link: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primary },

  row: {

    paddingHorizontal: layout.pad,

    gap: spacing.md,

    paddingRight: layout.pad + spacing.md,

    paddingVertical: 4,

  },

  card: {

    width: CARD_W,

    height: CARD_H,

    borderRadius: radius.xxl,

    overflow: 'hidden',

    backgroundColor: colors.bgSubtle,

    ...shadow.sm,

  },

  photo: {

    ...StyleSheet.absoluteFill,

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

  ratingPill: {

    position: 'absolute',

    top: spacing.md,

    right: spacing.md,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 3,

    backgroundColor: 'rgba(255,255,255,0.94)',

    borderRadius: radius.pill,

    paddingHorizontal: 9,

    paddingVertical: 5,

  },

  ratingText: {

    fontFamily: fonts.bold,

    fontSize: 11,

    color: colors.ink,

  },

  reviewsText: {

    fontFamily: fonts.medium,

    fontSize: 10,

    color: colors.muted,

  },

  footer: {

    position: 'absolute',

    left: 0,

    right: 0,

    bottom: 0,

    flexDirection: 'row',

    alignItems: 'flex-end',

    justifyContent: 'space-between',

    padding: spacing.lg,

    gap: spacing.md,

  },

  copy: { flex: 1, minWidth: 0, gap: 6 },

  name: {

    fontFamily: fonts.extraBold,

    fontSize: 18,

    color: colors.white,

    letterSpacing: -0.3,

  },

  meta: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 4,

    flexWrap: 'wrap',

  },

  metaText: {

    fontFamily: fonts.medium,

    fontSize: 12,

    color: 'rgba(255,255,255,0.9)',

  },

  metaDot: {

    fontFamily: fonts.regular,

    fontSize: 12,

    color: 'rgba(255,255,255,0.5)',

  },

  priceCol: {

    alignItems: 'flex-end',

    gap: 8,

  },

  price: {

    fontFamily: fonts.extraBold,

    fontSize: 20,

    color: colors.white,

    letterSpacing: -0.4,

  },

  bookBtn: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 4,

    backgroundColor: colors.primary,

    borderRadius: radius.pill,

    paddingHorizontal: 14,

    paddingVertical: 8,

  },

  bookText: {

    fontFamily: fonts.bold,

    fontSize: 12,

    color: colors.white,

  },

});


