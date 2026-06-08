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
import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';
import { useOpenServiceDetail } from '@/features/service/hooks/useOpenServiceDetail';

import { HOME_SERVICES } from '@/constants/services';

import { getServiceImages } from '../constants/unsplash.images';

import { HomePhoto } from './HomePhoto';

import { HomeSectionHeader } from './HomeSectionHeader';

import { fonts } from '@/theme/fonts';

import { colors } from '@/theme/colors';

import { layout, radius, spacing } from '@/theme/spacing';



const AnimatedPress = Animated.createAnimatedComponent(Pressable);



const GAP = layout.cardGap;

const INNER_W = layout.screenWidth - layout.pad * 2;

const HALF_W = (INNER_W - GAP) / 2;



function usePressAnim() {

  const scale = useSharedValue(1);

  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const bind = {

    onPressIn: () => {

      scale.value = withSpring(0.97, { damping: 16, stiffness: 360 });

    },

    onPressOut: () => {

      scale.value = withSpring(1, { damping: 16, stiffness: 360 });

    },

  };

  return { anim, bind };

}



function HeroTile({ service }: { service: ServiceItem }) {
  const { bookService } = useStartBooking();
  const openDetail = useOpenServiceDetail();
  const { anim, bind } = usePressAnim();



  return (

    <AnimatedPress

      style={[styles.hero, anim]}

      {...bind}

      onPress={() => openDetail(service.id)}

      accessibilityRole="button"

      accessibilityLabel={`View ${service.name}`}

    >

      <HomePhoto uri={getServiceImages(service.id)} style={styles.fill} overlay="none" tint={service.tint} />

      <LinearGradient

        colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.82)']}

        locations={[0.2, 0.55, 1]}

        style={StyleSheet.absoluteFill}

      />

      <View style={styles.heroBadge}>

        <Ionicons name="sparkles" size={11} color={colors.primaryDark} />

        <Text style={styles.heroBadgeText}>Most popular</Text>

      </View>

      <View style={styles.heroBody}>

        <View style={styles.heroCopy}>

          <Text style={styles.heroName}>{service.name}</Text>

          <Text style={styles.heroDesc}>{service.desc}</Text>

          <View style={styles.heroMeta}>

            <Ionicons name="star" size={11} color={colors.star} />

            <Text style={styles.heroMetaText}>{service.rating}</Text>

            <Text style={styles.heroMetaDot}>·</Text>

            <Text style={styles.heroMetaText}>{service.duration}</Text>

          </View>

        </View>

        <View style={styles.heroRight}>

          <Text style={styles.heroPrice}>{service.price}</Text>

          <Pressable
            style={styles.heroCta}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              bookService(service);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Book ${service.name}`}
          >
            <Text style={styles.heroCtaText}>Book now</Text>
            <Ionicons name="arrow-forward" size={13} color={colors.white} />
          </Pressable>

        </View>

      </View>

    </AnimatedPress>

  );

}



function CompactTile({ service }: { service: ServiceItem }) {
  const openDetail = useOpenServiceDetail();
  const { anim, bind } = usePressAnim();



  return (

    <AnimatedPress

      style={[styles.compact, anim]}

      {...bind}

      onPress={() => openDetail(service.id)}

      accessibilityRole="button"

      accessibilityLabel={`View ${service.name}`}

    >

      <HomePhoto uri={getServiceImages(service.id)} style={styles.fill} overlay="none" tint={service.tint} />

      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={StyleSheet.absoluteFill} />

      <View style={[styles.compactIcon, { backgroundColor: service.tint }]}>

        <Ionicons name={service.icon} size={14} color={colors.primaryDark} />

      </View>

      <View style={styles.compactFooter}>

        <Text style={styles.compactName} numberOfLines={1}>

          {service.name}

        </Text>

        <Text style={styles.compactPrice}>{service.price}</Text>

      </View>

    </AnimatedPress>

  );

}



function WideTile({ service }: { service: ServiceItem }) {
  const openDetail = useOpenServiceDetail();
  const { anim, bind } = usePressAnim();



  return (

    <AnimatedPress

      style={[styles.wide, anim]}

      {...bind}

      onPress={() => openDetail(service.id)}

      accessibilityRole="button"

      accessibilityLabel={`View ${service.name}`}

    >

      <HomePhoto uri={getServiceImages(service.id)} style={styles.fill} overlay="none" tint={service.tint} />

      <LinearGradient

        colors={['transparent', 'rgba(0,0,0,0.7)']}

        start={{ x: 0, y: 0 }}

        end={{ x: 1, y: 0 }}

        style={StyleSheet.absoluteFill}

      />

      <View style={styles.wideBody}>

        <View style={[styles.compactIcon, { backgroundColor: service.tint }]}>

          <Ionicons name={service.icon} size={14} color={colors.primaryDark} />

        </View>

        <View style={styles.wideCopy}>

          <Text style={styles.wideName}>{service.name}</Text>

          <Text style={styles.wideSub}>

            {service.duration} · {service.rating}★

          </Text>

        </View>

        <View style={styles.widePriceBox}>

          <Text style={styles.widePrice}>{service.price}</Text>

          <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.9)" />

        </View>

      </View>

    </AnimatedPress>

  );

}



export function HomeQuickGrid() {

  const [hero, regular, kitchen, bathroom] = HOME_SERVICES;



  return (

    <View style={styles.block}>

      <HomeSectionHeader

        eyebrow="Instant booking"

        title="Book instantly"

        subtitle="Verified pros · Same-day availability"

        icon="flash"

      />

      <View style={styles.bento}>

        <HeroTile service={hero} />

        <View style={styles.splitRow}>

          <CompactTile service={regular} />

          <CompactTile service={kitchen} />

        </View>

        <WideTile service={bathroom} />

      </View>

    </View>

  );

}



const styles = StyleSheet.create({

  block: { marginBottom: spacing.section },

  bento: { paddingHorizontal: layout.pad, gap: GAP },

  fill: { ...StyleSheet.absoluteFill },

  hero: {

    width: INNER_W,

    height: 188,

    borderRadius: radius.xxl,

    overflow: 'hidden',

    backgroundColor: colors.bgSubtle,

  },

  heroBadge: {

    position: 'absolute',

    top: spacing.md,

    left: spacing.md,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 5,

    backgroundColor: 'rgba(255,255,255,0.94)',

    borderRadius: radius.pill,

    paddingHorizontal: 10,

    paddingVertical: 5,

  },

  heroBadgeText: {

    fontFamily: fonts.bold,

    fontSize: 10,

    color: colors.primaryDark,

  },

  heroBody: {

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

  heroCopy: { flex: 1, gap: 4 },

  heroName: {

    fontFamily: fonts.extraBold,

    fontSize: 22,

    color: colors.white,

    letterSpacing: -0.5,

  },

  heroDesc: {

    fontFamily: fonts.medium,

    fontSize: 12,

    color: 'rgba(255,255,255,0.85)',

  },

  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },

  heroMetaText: {

    fontFamily: fonts.semiBold,

    fontSize: 11,

    color: 'rgba(255,255,255,0.9)',

  },

  heroMetaDot: { color: 'rgba(255,255,255,0.5)' },

  heroRight: { alignItems: 'flex-end', gap: spacing.sm },

  heroPrice: {

    fontFamily: fonts.extraBold,

    fontSize: 22,

    color: colors.white,

    letterSpacing: -0.4,

  },

  heroCta: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 5,

    backgroundColor: colors.primary,

    borderRadius: radius.pill,

    paddingHorizontal: 14,

    paddingVertical: 9,

  },

  heroCtaText: {

    fontFamily: fonts.bold,

    fontSize: 12,

    color: colors.white,

  },

  splitRow: { flexDirection: 'row', gap: GAP },

  compact: {

    width: HALF_W,

    height: 168,

    borderRadius: radius.xxl,

    overflow: 'hidden',

    backgroundColor: colors.bgSubtle,

  },

  compactIcon: {

    position: 'absolute',

    top: spacing.sm,

    left: spacing.sm,

    width: 30,

    height: 30,

    borderRadius: radius.md,

    alignItems: 'center',

    justifyContent: 'center',

  },

  compactFooter: {

    position: 'absolute',

    left: spacing.md,

    right: spacing.md,

    bottom: spacing.md,

    gap: 2,

  },

  compactName: {

    fontFamily: fonts.bold,

    fontSize: 14,

    color: colors.white,

  },

  compactPrice: {

    fontFamily: fonts.extraBold,

    fontSize: 15,

    color: colors.white,

  },

  wide: {

    width: INNER_W,

    height: 112,

    borderRadius: radius.xl,

    overflow: 'hidden',

    backgroundColor: colors.bgSubtle,

  },

  wideBody: {

    ...StyleSheet.absoluteFill,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: spacing.lg,

    gap: spacing.md,

  },

  wideCopy: { flex: 1, gap: 2 },

  wideName: {

    fontFamily: fonts.bold,

    fontSize: 16,

    color: colors.white,

  },

  wideSub: {

    fontFamily: fonts.medium,

    fontSize: 11,

    color: 'rgba(255,255,255,0.82)',

  },

  widePriceBox: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 4,

  },

  widePrice: {

    fontFamily: fonts.extraBold,

    fontSize: 17,

    color: colors.white,

  },

});


