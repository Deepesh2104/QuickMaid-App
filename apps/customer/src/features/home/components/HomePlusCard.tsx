import { Ionicons } from '@expo/vector-icons';

import * as Haptics from 'expo-haptics';

import { LinearGradient } from 'expo-linear-gradient';

import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Animated, {

  useAnimatedStyle,

  useSharedValue,

  withSpring,

} from 'react-native-reanimated';



import { HomeSectionHeader } from './HomeSectionHeader';

import { fonts } from '@/theme/fonts';

import { colors } from '@/theme/colors';

import { layout, radius, spacing } from '@/theme/spacing';



const AnimatedPress = Animated.createAnimatedComponent(Pressable);



const PERKS = [

  { icon: 'pricetag-outline' as const, label: '10% off' },

  { icon: 'calendar-outline' as const, label: 'Free reschedule' },

  { icon: 'headset-outline' as const, label: 'Priority help' },

];



export function HomePlusCard() {

  const router = useRouter();
  const scale = useSharedValue(1);

  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));



  return (

    <View style={styles.block}>

      <HomeSectionHeader

        eyebrow="Membership"

        title="Go Plus"

        subtitle="Save more on every booking"

        icon="diamond"

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

        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/(tabs)/plans' as Href);
        }}

        accessibilityRole="button"

        accessibilityLabel="QuickMaid Plus membership"

      >

        <LinearGradient

          colors={['#0F1419', '#1A2332', '#0F1419']}

          start={{ x: 0, y: 0 }}

          end={{ x: 1, y: 1 }}

          style={StyleSheet.absoluteFill}

        />



        <View style={styles.glow} />



        <View style={styles.content}>

          <View style={styles.head}>

            <View style={styles.diamond}>

              <Ionicons name="diamond" size={22} color="#FBBF24" />

            </View>

            <View style={styles.headCopy}>

              <Text style={styles.brand}>QuickMaid Plus</Text>

              <Text style={styles.tagline}>Premium home care, less hassle</Text>

            </View>

            <View style={styles.explore}>

              <Text style={styles.exploreText}>Explore</Text>

              <Ionicons name="arrow-forward" size={12} color={colors.ink} />

            </View>

          </View>



          <View style={styles.perks}>

            {PERKS.map((p) => (

              <View key={p.label} style={styles.perk}>

                <Ionicons name={p.icon} size={13} color="#6EE7B7" />

                <Text style={styles.perkText}>{p.label}</Text>

              </View>

            ))}

          </View>

        </View>

      </AnimatedPress>

    </View>

  );

}



const styles = StyleSheet.create({

  block: { marginBottom: spacing.lg },

  card: {

    marginHorizontal: layout.pad,

    borderRadius: radius.xxl,

    overflow: 'hidden',

    minHeight: 140,

  },

  glow: {

    position: 'absolute',

    top: -40,

    right: -20,

    width: 120,

    height: 120,

    borderRadius: 60,

    backgroundColor: 'rgba(110,231,183,0.12)',

  },

  content: {

    padding: spacing.lg,

    gap: spacing.lg,

    zIndex: 1,

  },

  head: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: spacing.md,

  },

  diamond: {

    width: 48,

    height: 48,

    borderRadius: radius.lg,

    backgroundColor: 'rgba(251,191,36,0.15)',

    borderWidth: 1,

    borderColor: 'rgba(251,191,36,0.3)',

    alignItems: 'center',

    justifyContent: 'center',

  },

  headCopy: { flex: 1, gap: 2 },

  brand: {

    fontFamily: fonts.extraBold,

    fontSize: 18,

    color: colors.white,

    letterSpacing: -0.3,

  },

  tagline: {

    fontFamily: fonts.regular,

    fontSize: 12,

    color: 'rgba(255,255,255,0.65)',

  },

  explore: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 4,

    backgroundColor: '#6EE7B7',

    borderRadius: radius.pill,

    paddingHorizontal: 12,

    paddingVertical: 8,

  },

  exploreText: {

    fontFamily: fonts.bold,

    fontSize: 11,

    color: colors.ink,

  },

  perks: {

    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: spacing.sm,

  },

  perk: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 5,

    backgroundColor: 'rgba(255,255,255,0.08)',

    borderRadius: radius.pill,

    paddingHorizontal: 10,

    paddingVertical: 7,

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.1)',

  },

  perkText: {

    fontFamily: fonts.semiBold,

    fontSize: 11,

    color: 'rgba(255,255,255,0.88)',

  },

});


