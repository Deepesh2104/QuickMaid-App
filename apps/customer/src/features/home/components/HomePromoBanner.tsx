import { Ionicons } from '@expo/vector-icons';

import * as Haptics from 'expo-haptics';

import { LinearGradient } from 'expo-linear-gradient';

import { Alert, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';

import Animated, {

  useAnimatedStyle,

  useSharedValue,

  withSpring,

} from 'react-native-reanimated';



import { HOME_IMAGES } from '../constants/unsplash.images';

import { HomePhoto } from './HomePhoto';

import { HomeSectionHeader } from './HomeSectionHeader';

import { fonts } from '@/theme/fonts';

import { colors } from '@/theme/colors';

import { layout, radius, spacing } from '@/theme/spacing';



const AnimatedPress = Animated.createAnimatedComponent(Pressable);



export function HomePromoBanner() {

  const { bookDefault } = useStartBooking();
  const scale = useSharedValue(1);

  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));



  return (

    <View style={styles.block}>

      <HomeSectionHeader

        eyebrow="Limited offer"

        title="First booking deal"

        subtitle="New customers only"

        icon="gift-outline"

        compact

      />

      <AnimatedPress

        style={[styles.ticket, anim]}

        onPressIn={() => {

          scale.value = withSpring(0.98, { damping: 16, stiffness: 360 });

        }}

        onPressOut={() => {

          scale.value = withSpring(1, { damping: 16, stiffness: 360 });

        }}

        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          bookDefault();
        }}

        accessibilityRole="button"

        accessibilityLabel="20 percent off first booking, code FIRST20"

      >

        <HomePhoto uri={HOME_IMAGES.promo} style={styles.photo} overlay="none" tint={colors.primaryLight} />

        <LinearGradient

          colors={['rgba(8,79,74,0.88)', 'rgba(11,110,103,0.95)']}

          start={{ x: 0, y: 0 }}

          end={{ x: 1, y: 1 }}

          style={StyleSheet.absoluteFill}

        />



        <View style={styles.notchTop} />

        <View style={styles.notchBottom} />



        <View style={styles.content}>

          <View style={styles.left}>

            <Text style={styles.kicker}>Use code at checkout</Text>

            <Text style={styles.title}>Flat 20% off{'\n'}your first clean</Text>

            <Text style={styles.sub}>Raipur · Valid till midnight</Text>

          </View>

          <View style={styles.right}>

            <Text style={styles.pctNum}>20</Text>

            <Text style={styles.pctSign}>%</Text>

            <Text style={styles.pctOff}>OFF</Text>

          </View>

        </View>



        <View style={styles.codeStrip}>

          <View style={styles.dashed} />

          <View style={styles.codeRow}>

            <Text style={styles.code}>FIRST20</Text>

            <Pressable
              style={styles.copyBtn}
              onPress={() => {
                Haptics.selectionAsync();
                void Share.share({ message: 'QuickMaid coupon: FIRST20 — 20% off your first clean' });
                Alert.alert('Coupon copied', 'Use FIRST20 at checkout payment step.');
              }}
            >
              <Ionicons name="copy-outline" size={14} color={colors.primaryDark} />
              <Text style={styles.copyText}>Copy</Text>
            </Pressable>

          </View>

        </View>

      </AnimatedPress>

    </View>

  );

}



const styles = StyleSheet.create({

  block: { marginBottom: spacing.section },

  ticket: {

    marginHorizontal: layout.pad,

    borderRadius: radius.xxl,

    overflow: 'hidden',

    minHeight: 176,

  },

  photo: { ...StyleSheet.absoluteFill },

  notchTop: {

    position: 'absolute',

    left: '36%',

    top: -8,

    width: 16,

    height: 16,

    borderRadius: 8,

    backgroundColor: colors.bgSubtle,

    zIndex: 2,

  },

  notchBottom: {

    position: 'absolute',

    left: '36%',

    bottom: 44,

    width: 16,

    height: 16,

    borderRadius: 8,

    backgroundColor: colors.bgSubtle,

    zIndex: 2,

  },

  content: {

    flexDirection: 'row',

    padding: spacing.xl,

    paddingBottom: spacing.lg,

    gap: spacing.md,

    zIndex: 1,

  },

  left: { flex: 1, gap: 6 },

  kicker: {

    fontFamily: fonts.bold,

    fontSize: 10,

    letterSpacing: 0.8,

    color: '#6EE7B7',

    textTransform: 'uppercase',

  },

  title: {

    fontFamily: fonts.extraBold,

    fontSize: 24,

    color: colors.white,

    letterSpacing: -0.6,

    lineHeight: 28,

  },

  sub: {

    fontFamily: fonts.regular,

    fontSize: 12,

    color: 'rgba(255,255,255,0.82)',

  },

  right: { alignItems: 'center', justifyContent: 'center', paddingRight: 4 },

  pctNum: {

    fontFamily: fonts.extraBold,

    fontSize: 44,

    color: colors.white,

    letterSpacing: -2,

    lineHeight: 44,

  },

  pctSign: {

    fontFamily: fonts.extraBold,

    fontSize: 18,

    color: '#6EE7B7',

    marginTop: -6,

  },

  pctOff: {

    fontFamily: fonts.bold,

    fontSize: 11,

    color: '#6EE7B7',

    letterSpacing: 1.2,

  },

  codeStrip: {

    borderTopWidth: 1,

    borderTopColor: 'rgba(255,255,255,0.16)',

    paddingHorizontal: spacing.xl,

    paddingVertical: spacing.md,

    zIndex: 1,

  },

  dashed: {

    position: 'absolute',

    top: 0,

    left: spacing.xl,

    right: spacing.xl,

    borderTopWidth: 1,

    borderStyle: 'dashed',

    borderColor: 'rgba(255,255,255,0.2)',

  },

  codeRow: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

  },

  code: {

    fontFamily: fonts.extraBold,

    fontSize: 18,

    color: colors.white,

    letterSpacing: 2,

  },

  copyBtn: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 5,

    backgroundColor: colors.white,

    borderRadius: radius.pill,

    paddingHorizontal: 12,

    paddingVertical: 7,

  },

  copyText: {

    fontFamily: fonts.bold,

    fontSize: 11,

    color: colors.primaryDark,

  },

});


