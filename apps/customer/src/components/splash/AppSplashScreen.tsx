import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { fonts } from '../../theme/fonts';
import { layout, radius, spacing } from '../../theme/spacing';

export const SPLASH_DELAY_MS = 1800;
export const SPLASH_EXIT_MS = 480;

const TRUST = [
  { icon: 'shield-checkmark' as const, label: 'Verified pros', delay: 280 },
  { icon: 'flash' as const, label: 'Same-day slots', delay: 380 },
  { icon: 'diamond' as const, label: 'Plus savings', delay: 480 },
];

const STATS = [
  { value: '50k+', label: 'Homes cleaned' },
  { value: '4.85★', label: 'Rated service' },
  { value: '98%', label: 'On-time' },
];

function useFadeUp(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 620,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 620,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return { opacity, transform: [{ translateY }] };
}

function TrustPill({ icon, label, delay }: { icon: keyof typeof Ionicons.glyphMap; label: string; delay: number }) {
  const anim = useFadeUp(delay);
  return (
    <Animated.View style={[styles.trustPill, anim]}>
      <View style={styles.trustIcon}>
        <Ionicons name={icon} size={12} color="#6EE7B7" />
      </View>
      <Text style={styles.trustText}>{label}</Text>
    </Animated.View>
  );
}

export function AppSplashScreen() {
  const insets = useSafeAreaInsets();
  const heroScale = useRef(new Animated.Value(0.88)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const ringSpin = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.35)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const floatA = useRef(new Animated.Value(0)).current;
  const floatB = useRef(new Animated.Value(0)).current;
  const sparkle = useRef(new Animated.Value(0)).current;

  const badgeAnim = useFadeUp(120);
  const statsAnim = useFadeUp(560);
  const bottomAnim = useFadeUp(640);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(heroScale, {
        toValue: 1,
        damping: 13,
        stiffness: 110,
        mass: 0.9,
        useNativeDriver: true,
      }),
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: SPLASH_DELAY_MS,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: false,
      }),
      Animated.loop(
        Animated.timing(ringSpin, {
          toValue: 1,
          duration: 12000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowPulse, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowPulse, {
            toValue: 0.35,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmer, {
            toValue: 1,
            duration: 2200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(shimmer, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.delay(800),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatA, { toValue: 1, duration: 3200, useNativeDriver: true }),
          Animated.timing(floatA, { toValue: 0, duration: 3200, useNativeDriver: true }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatB, { toValue: 1, duration: 4200, useNativeDriver: true }),
          Animated.timing(floatB, { toValue: 0, duration: 4200, useNativeDriver: true }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkle, { toValue: 1, duration: 900, useNativeDriver: true }),
          Animated.timing(sparkle, { toValue: 0.2, duration: 900, useNativeDriver: true }),
        ]),
      ),
    ]).start();
  }, [floatA, floatB, glowPulse, heroOpacity, heroScale, progress, ringSpin, shimmer, sparkle]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const ringRotate = ringSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shimmerX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 160],
  });

  const floatAY = floatA.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });
  const floatBY = floatB.interpolate({ inputRange: [0, 1], outputRange: [0, 12] });

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#010F0E', '#042824', '#084F4A', '#0B6E67', '#12A598']}
        locations={[0, 0.28, 0.55, 0.78, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={['rgba(252,211,77,0.14)', 'transparent', 'rgba(110,231,183,0.1)']}
        locations={[0, 0.45, 1]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="35%" rx="50%" ry="40%">
            <Stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.22" />
            <Stop offset="100%" stopColor="#010F0E" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="50%" cy="32%" r="220" fill="url(#glow)" />
      </Svg>

      <Animated.View style={[styles.orbGold, { opacity: glowPulse, transform: [{ translateY: floatAY }] }]} />
      <Animated.View style={[styles.orbMint, { opacity: glowPulse, transform: [{ translateY: floatBY }] }]} />
      <View style={styles.gridOverlay} pointerEvents="none" />

      <Animated.View style={[styles.orbitWrap, { transform: [{ rotate: ringRotate }] }]} pointerEvents="none">
        <View style={styles.orbitRing} />
        <View style={styles.orbitDot} />
      </Animated.View>

      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: Math.max(insets.bottom, 24) },
        ]}
      >
        <Animated.View style={[styles.topBadge, badgeAnim]}>
          <View style={styles.livePulse}>
            <View style={styles.liveDot} />
          </View>
          <Text style={styles.topBadgeEyebrow}>PREMIUM HOME CARE</Text>
          <View style={styles.badgeDivider} />
          <Text style={styles.topBadgeText}>Now in Raipur</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.hero,
            { opacity: heroOpacity, transform: [{ scale: heroScale }] },
          ]}
        >
          <Animated.View style={[styles.heroGlow, { opacity: glowPulse }]} />

          <View style={styles.logoStack}>
            <LinearGradient
              colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.06)']}
              style={styles.logoGlass}
            >
              <LinearGradient colors={['#0F1419', '#1A2332']} style={styles.logoInner}>
                <Ionicons name="sparkles" size={28} color="#6EE7B7" />
                <Animated.View style={[styles.sparkleAccent, { opacity: sparkle }]}>
                  <Ionicons name="diamond" size={14} color="#FCD34D" />
                </Animated.View>
              </LinearGradient>
              <Animated.View style={[styles.shimmerBar, { transform: [{ translateX: shimmerX }] }]} />
            </LinearGradient>
          </View>

          <Text style={styles.brand}>QuickMaid</Text>
          <View style={styles.brandRow}>
            <View style={styles.brandLine} />
            <Text style={styles.brandSub}>Spotless homes · Trusted pros</Text>
            <View style={styles.brandLine} />
          </View>
          <Text style={styles.tagline}>Book verified maids in minutes.{'\n'}Pay securely · Track live.</Text>
        </Animated.View>

        <Animated.View style={[styles.statsGlass, statsAnim]}>
          {STATS.map((s, i) => (
            <View key={s.label} style={[styles.statCell, i > 0 && styles.statCellBorder]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        <View style={styles.trustRow}>
          {TRUST.map((item) => (
            <TrustPill key={item.label} icon={item.icon} label={item.label} delay={item.delay} />
          ))}
        </View>

        <Animated.View style={[styles.bottom, bottomAnim]}>
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
                <LinearGradient
                  colors={['#6EE7B7', '#FFFFFF', '#FCD34D']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>
            <Text style={styles.progressLabel}>Preparing your experience</Text>
          </View>
          <Text style={styles.footer}>QuickMaid Customer · v1.0</Text>
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
  orbGold: {
    position: 'absolute',
    top: '18%',
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(252,211,77,0.12)',
  },
  orbMint: {
    position: 'absolute',
    bottom: '22%',
    left: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(110,231,183,0.1)',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.04,
    borderWidth: 0,
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  orbitWrap: {
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitRing: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  orbitDot: {
    position: 'absolute',
    top: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FCD34D',
    shadowColor: '#FCD34D',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
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
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  livePulse: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(74,222,128,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  topBadgeEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: '#FCD34D',
    letterSpacing: 1.2,
  },
  badgeDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  topBadgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: -spacing.xl,
  },
  heroGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(110,231,183,0.16)',
  },
  logoStack: {
    marginBottom: spacing.md,
  },
  logoGlass: {
    width: 96,
    height: 96,
    borderRadius: 28,
    padding: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  logoInner: {
    flex: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleAccent: {
    position: 'absolute',
    top: 10,
    right: 12,
  },
  shimmerBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 40,
    backgroundColor: 'rgba(255,255,255,0.18)',
    transform: [{ skewX: '-18deg' }],
  },
  brand: {
    fontFamily: fonts.extraBold,
    fontSize: 38,
    color: '#FFFFFF',
    letterSpacing: -1.2,
    lineHeight: 42,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  brandLine: {
    width: 28,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  brandSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.72)',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  tagline: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 22,
    maxWidth: 300,
  },
  statsGlass: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    minWidth: 96,
  },
  statCellBorder: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.62)',
    marginTop: 2,
    textAlign: 'center',
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
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(15,20,25,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.22)',
  },
  trustIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(110,231,183,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: 'rgba(255,255,255,0.92)',
  },
  bottom: {
    gap: spacing.md,
  },
  progressWrap: {
    gap: spacing.sm,
  },
  progressTrack: {
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  footer: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.38)',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
});
