import { Ionicons } from '@expo/vector-icons';

import * as Haptics from 'expo-haptics';

import { LinearGradient } from 'expo-linear-gradient';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import Animated, {

  useAnimatedStyle,

  useSharedValue,

  withSpring,

} from 'react-native-reanimated';



import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';
import { HOME_IMAGES } from '../constants/unsplash.images';

import { HomePhoto } from './HomePhoto';

import { HomeSectionHeader } from './HomeSectionHeader';

import { fonts } from '@/theme/fonts';

import { colors } from '@/theme/colors';

import { layout, radius, spacing } from '@/theme/spacing';



const AnimatedPress = Animated.createAnimatedComponent(Pressable);



export function HomeRebookCard() {

  const { bookById } = useStartBooking();
  const scale = useSharedValue(1);

  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));



  return (

    <View style={styles.block}>

      <HomeSectionHeader

        eyebrow="Quick repeat"

        title="Book again"

        subtitle="Your last service, one tap away"

        icon="refresh-circle"

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

        onPress={() => bookById('regular')}

        accessibilityRole="button"

        accessibilityLabel="Rebook Regular Cleaning for 149 rupees"

      >

        <HomePhoto uri={HOME_IMAGES.rebook} style={styles.photo} overlay="none" tint={colors.primaryLight} />

        <LinearGradient

          colors={['rgba(11,110,103,0.92)', 'rgba(11,110,103,0.75)', 'rgba(11,110,103,0.45)']}

          start={{ x: 0, y: 0 }}

          end={{ x: 1, y: 0 }}

          style={StyleSheet.absoluteFill}

        />



        <View style={styles.content}>

          <View style={styles.timeline}>

            <View style={styles.pulse} />

            <View style={styles.timelineCopy}>

              <Text style={styles.timelineLabel}>Last cleaned</Text>

              <Text style={styles.timelineValue}>5 days ago</Text>

            </View>

          </View>



          <View style={styles.main}>

            <View style={styles.copy}>

              <Text style={styles.service}>Regular Cleaning</Text>

              <Text style={styles.meta}>Same pro · Same slot available today</Text>

            </View>

            <View style={styles.priceCol}>

              <Text style={styles.price}>₹149</Text>

              <View style={styles.cta}>

                <Text style={styles.ctaText}>Rebook</Text>

                <Ionicons name="arrow-forward" size={14} color={colors.primaryDark} />

              </View>

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

    minHeight: 132,

  },

  photo: { ...StyleSheet.absoluteFill },

  content: {

    padding: spacing.lg,

    gap: spacing.lg,

    zIndex: 1,

  },

  timeline: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: spacing.sm,

  },

  pulse: {

    width: 10,

    height: 10,

    borderRadius: 5,

    backgroundColor: '#6EE7B7',

    borderWidth: 2,

    borderColor: 'rgba(255,255,255,0.5)',

  },

  timelineCopy: { gap: 1 },

  timelineLabel: {

    fontFamily: fonts.semiBold,

    fontSize: 10,

    color: 'rgba(255,255,255,0.75)',

    letterSpacing: 0.4,

    textTransform: 'uppercase',

  },

  timelineValue: {

    fontFamily: fonts.bold,

    fontSize: 13,

    color: colors.white,

  },

  main: {

    flexDirection: 'row',

    alignItems: 'flex-end',

    justifyContent: 'space-between',

    gap: spacing.md,

  },

  copy: { flex: 1, gap: 4 },

  service: {

    fontFamily: fonts.extraBold,

    fontSize: 20,

    color: colors.white,

    letterSpacing: -0.4,

  },

  meta: {

    fontFamily: fonts.medium,

    fontSize: 12,

    color: 'rgba(255,255,255,0.82)',

  },

  priceCol: { alignItems: 'flex-end', gap: spacing.sm },

  price: {

    fontFamily: fonts.extraBold,

    fontSize: 22,

    color: colors.white,

    letterSpacing: -0.4,

  },

  cta: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 5,

    backgroundColor: colors.white,

    borderRadius: radius.pill,

    paddingHorizontal: 16,

    paddingVertical: 10,

  },

  ctaText: {

    fontFamily: fonts.bold,

    fontSize: 13,

    color: colors.primaryDark,

  },

});


