import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';
import { premium } from '../constants/home.premium';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const AnimatedPress = Animated.createAnimatedComponent(Pressable);

export function HomeUrgentStrip() {
  const { bookById } = useStartBooking();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPress
      style={[styles.wrap, anim]}
      onPressIn={() => {
        scale.value = withSpring(0.98, { damping: 16, stiffness: 360 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 16, stiffness: 360 });
      }}
      onPress={() => bookById('regular')}
      accessibilityRole="button"
      accessibilityLabel="Book same-day cleaning, slots from 2 PM"
    >
      <LinearGradient
        colors={['#FFF7ED', '#FFEDD5', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.pulseRing}>
        <View style={styles.icon}>
          <Ionicons name="flash" size={18} color="#B54708" />
        </View>
      </View>
      <View style={styles.copy}>
        <View style={styles.live}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE NOW</Text>
        </View>
        <Text style={styles.title}>Need cleaning today?</Text>
        <Text style={styles.sub}>Same-day slots from 2 PM · Verified pros available</Text>
      </View>
      <LinearGradient colors={['#B54708', '#C4320A']} style={styles.cta}>
        <Text style={styles.ctaText}>Book</Text>
        <Ionicons name="arrow-forward" size={14} color={colors.white} />
      </LinearGradient>
    </AnimatedPress>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...premium.surface,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: layout.pad,
    marginBottom: spacing.section,
    padding: spacing.md,
    gap: spacing.md,
    overflow: 'hidden',
    borderColor: 'rgba(181,71,8,0.12)',
  },
  pulseRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(181,71,8,0.15)',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 3 },
  live: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B54708',
  },
  liveText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: '#B54708',
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.ink,
    letterSpacing: -0.2,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 15,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ctaText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
  },
});
