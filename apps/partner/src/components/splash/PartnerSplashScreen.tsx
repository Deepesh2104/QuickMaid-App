import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QmLogo } from '@/components/ui/QmLogo';
import { fonts } from '@/theme/fonts';
import { layout, radius, spacing } from '@/theme/spacing';

export const SPLASH_DELAY_MS = 1400;
export const SPLASH_EXIT_MS = 380;

export function PartnerSplashScreen() {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(10)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: SPLASH_DELAY_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  }, [opacity, progress, rise]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#010F0E', '#032A28', '#084F4A']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.glow} pointerEvents="none" />

      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}
      >
        <Animated.View
          style={[styles.stack, { opacity, transform: [{ translateY: rise }] }]}
        >
          <QmLogo size="lg" light showText={false} />
          <Text style={styles.brand}>QuickMaid Partner</Text>
          <Text style={styles.tagline}>Earn with trust · Work on your terms</Text>

          <View style={styles.bottom}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
            <Text style={styles.footer}>Verified payouts · Flexible slots</Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#010F0E',
  },
  glow: {
    position: 'absolute',
    alignSelf: 'center',
    top: '38%',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(252,211,77,0.07)',
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.pad,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stack: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    gap: spacing.sm,
  },
  brand: {
    fontFamily: fonts.extraBold,
    fontSize: 28,
    color: '#FFFFFF',
    letterSpacing: -0.6,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: spacing.lg,
  },
  bottom: {
    width: '100%',
    maxWidth: 220,
    alignSelf: 'center',
    gap: spacing.sm,
  },
  progressTrack: {
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: '#FCD34D',
  },
  footer: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
});
