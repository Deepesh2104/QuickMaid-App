import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts } from '../../theme/fonts';
import { layout, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

export const SPLASH_DELAY_MS = 1500;
export const SPLASH_EXIT_MS = 400;

const TRUST = [
  { icon: 'shield-checkmark' as const, label: 'Verified' },
  { icon: 'flash' as const, label: 'Instant' },
  { icon: 'star' as const, label: '4.8★' },
];

export function AppSplashScreen() {
  const insets = useSafeAreaInsets();
  const heroY = useRef(new Animated.Value(10)).current;
  const heroScale = useRef(new Animated.Value(0.96)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroY, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(heroScale, {
        toValue: 1,
        damping: 14,
        stiffness: 120,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: SPLASH_DELAY_MS,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 0.9,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0.45,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ),
    ]).start();
  }, [heroY, heroScale, progress, glow]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#021A18', '#084F4A', '#0B6E67', '#0E9A90']}
        locations={[0, 0.35, 0.7, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.meshTop} pointerEvents="none" />
      <View style={styles.meshBottom} pointerEvents="none" />
      <View style={styles.ring1} pointerEvents="none" />
      <View style={styles.ring2} pointerEvents="none" />

      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: Math.max(insets.bottom, 20) },
        ]}
      >
        <View style={styles.topBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.topBadgeText}>Now in Raipur</Text>
        </View>

        <Animated.View
          style={[styles.hero, { transform: [{ translateY: heroY }, { scale: heroScale }] }]}
        >
          <Animated.View style={[styles.glowOrb, { opacity: glow }]} pointerEvents="none" />

          <View style={styles.logoCard}>
            <Text style={styles.logoMark}>Q</Text>
          </View>

          <Text style={styles.brand}>QuickMaid</Text>
          <Text style={styles.brandSub}>Home cleaning</Text>
          <Text style={styles.tagline}>Trusted maids at your doorstep</Text>
        </Animated.View>

        <View style={styles.trustRow}>
          {TRUST.map((item) => (
            <View key={item.label} style={styles.trustPill}>
              <Ionicons name={item.icon} size={13} color="rgba(255,255,255,0.95)" />
              <Text style={styles.trustText}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottom}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.footer}>v1.0 · Demo</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B6E67',
  },
  meshTop: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  meshBottom: {
    position: 'absolute',
    bottom: 120,
    left: -70,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  ring1: {
    position: 'absolute',
    right: 24,
    top: '38%',
    width: 120,
    height: 120,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  ring2: {
    position: 'absolute',
    right: 48,
    top: '41%',
    width: 72,
    height: 72,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.pad,
    justifyContent: 'space-between',
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  topBadgeText: {
    ...type.caption,
    fontFamily: fonts.semiBold,
    color: 'rgba(255,255,255,0.92)',
    letterSpacing: 0.3,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: -spacing.xxl,
  },
  glowOrb: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  logoCard: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoMark: {
    fontFamily: fonts.extraBold,
    fontSize: 34,
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  brand: {
    fontFamily: fonts.extraBold,
    fontSize: 32,
    color: '#FFFFFF',
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  brandSub: {
    ...type.caption,
    fontFamily: fonts.medium,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.4,
    marginTop: -2,
  },
  tagline: {
    ...type.body,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    marginTop: spacing.md,
    maxWidth: 280,
    lineHeight: 24,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  trustText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
  },
  bottom: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  progressTrack: {
    height: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  footer: {
    ...type.caption,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
  },
});
