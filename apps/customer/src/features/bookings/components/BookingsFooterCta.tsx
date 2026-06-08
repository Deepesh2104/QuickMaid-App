import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const AnimatedPress = Animated.createAnimatedComponent(Pressable);

export function BookingsFooterCta() {
  const { bookDefault } = useStartBooking();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Book more"
        title="Need another clean?"
        subtitle="54 services · Same-day slots"
        icon="add-circle-outline"
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
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          bookDefault();
        }}
        accessibilityRole="button"
        accessibilityLabel="Book a new cleaning visit"
      >
        <LinearGradient
          colors={['#0F1419', '#1A2332', '#0F1419']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.glow} />
        <View style={styles.content}>
          <View style={styles.icon}>
            <Ionicons name="sparkles" size={22} color="#6EE7B7" />
          </View>
          <View style={styles.copy}>
            <Text style={styles.brand}>Book a new clean</Text>
            <Text style={styles.tagline}>Deep · Regular · Kitchen & more</Text>
          </View>
          <View style={styles.explore}>
            <Text style={styles.exploreText}>Go</Text>
            <Ionicons name="arrow-forward" size={12} color={colors.ink} />
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
    minHeight: 88,
  },
  glow: {
    position: 'absolute',
    top: -30,
    right: -10,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(110,231,183,0.12)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    zIndex: 1,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(110,231,183,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  brand: {
    fontFamily: fonts.extraBold,
    fontSize: 17,
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
});
