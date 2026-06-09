import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Line, RadialGradient, Stop } from 'react-native-svg';

import { fonts } from '../../theme/fonts';
import { layout, radius, spacing } from '../../theme/spacing';

export const SPLASH_DELAY_MS = 2200;
export const SPLASH_EXIT_MS = 520;

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const TRUST = [
  { icon: 'shield-checkmark' as const, label: 'Verified pros', sub: 'Background checked', delay: 340 },
  { icon: 'flash' as const, label: 'Same-day', sub: '60 min slots', delay: 460 },
  { icon: 'diamond' as const, label: 'Plus perks', sub: 'Up to 25% off', delay: 580 },
];

type StatItem = { value: string; label: string; suffix?: string };

const STATS: StatItem[] = [
  { value: '50k+', label: 'Homes cleaned' },
  { value: '4.85', suffix: '★', label: 'Rated service' },
  { value: '98%', label: 'On-time visits' },
];

const PARTICLES = [
  { x: 0.08, y: 0.14, s: 3, d: 0 },
  { x: 0.22, y: 0.08, s: 2, d: 200 },
  { x: 0.78, y: 0.12, s: 3, d: 400 },
  { x: 0.92, y: 0.22, s: 2, d: 120 },
  { x: 0.06, y: 0.38, s: 2, d: 300 },
  { x: 0.88, y: 0.42, s: 4, d: 500 },
  { x: 0.14, y: 0.62, s: 2, d: 180 },
  { x: 0.72, y: 0.58, s: 3, d: 360 },
  { x: 0.34, y: 0.72, s: 2, d: 80 },
  { x: 0.58, y: 0.78, s: 3, d: 440 },
  { x: 0.9, y: 0.68, s: 2, d: 260 },
  { x: 0.48, y: 0.16, s: 2, d: 620 },
  { x: 0.62, y: 0.28, s: 3, d: 140 },
  { x: 0.18, y: 0.84, s: 2, d: 520 },
];

function useFadeUp(delay = 0, distance = 22) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 720,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 720,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, distance, opacity, translateY]);

  return { opacity, translateY };
}

function useLoopPulse(duration = 1600, min = 0.3, max = 1) {
  const value = useRef(new Animated.Value(min)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: max,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: min,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [duration, max, min, value]);

  return value;
}

function Particle({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  const opacity = useRef(new Animated.Value(0.15)).current;
  const scale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 900,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.12,
            duration: 1100,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.5,
            duration: 1100,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, [delay, opacity, scale]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        {
          left: x * SCREEN_W,
          top: y * SCREEN_H,
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
}

function OrbitRing({
  size,
  duration,
  reverse,
  borderColor,
  dotColor,
}: {
  size: number;
  duration: number;
  reverse?: boolean;
  borderColor: string;
  dotColor: string;
}) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [duration, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: reverse ? ['360deg', '0deg'] : ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.orbitRingWrap,
        { width: size, height: size, borderRadius: size / 2, transform: [{ rotate }] },
      ]}
      pointerEvents="none"
    >
      <View style={[styles.orbitRingLine, { width: size, height: size, borderRadius: size / 2, borderColor }]} />
      <View style={[styles.orbitDot, { backgroundColor: dotColor, top: 2 }]} />
    </Animated.View>
  );
}

function TrustCard({
  icon,
  label,
  sub,
  delay,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub: string;
  delay: number;
}) {
  const { opacity, translateY } = useFadeUp(delay, 16);
  return (
    <Animated.View style={[styles.trustCard, { opacity, transform: [{ translateY }] }]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.04)']}
        style={styles.trustCardGrad}
      >
        <View style={styles.trustIconWrap}>
          <Ionicons name={icon} size={14} color="#FCD34D" />
        </View>
        <Text style={styles.trustLabel}>{label}</Text>
        <Text style={styles.trustSub}>{sub}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

function StatCell({
  value,
  suffix,
  label,
  delay,
  bordered,
}: {
  value: string;
  suffix?: string;
  label: string;
  delay: number;
  bordered?: boolean;
}) {
  const { opacity, translateY } = useFadeUp(delay, 12);
  const pop = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.spring(pop, {
      toValue: 1,
      delay: delay + 200,
      damping: 10,
      stiffness: 140,
      useNativeDriver: true,
    }).start();
  }, [delay, pop]);

  return (
    <Animated.View
      style={[
        styles.statCell,
        bordered && styles.statCellBorder,
        { opacity, transform: [{ translateY }, { scale: pop }] },
      ]}
    >
      <Text style={styles.statValue}>
        {value}
        {suffix ? <Text style={styles.statSuffix}>{suffix}</Text> : null}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

export function AppSplashScreen() {
  const insets = useSafeAreaInsets();
  const heroScale = useRef(new Animated.Value(0.82)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const logoBreathe = useRef(new Animated.Value(1)).current;
  const shimmer = useRef(new Animated.Value(0)).current;
  const aurora = useRef(new Animated.Value(0)).current;
  const scanLine = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const brandGlow = useRef(new Animated.Value(0)).current;

  const glowPulse = useLoopPulse(1800, 0.25, 0.95);
  const badgeAnim = useFadeUp(80, 14);
  const statsAnim = useFadeUp(620, 18);
  const bottomAnim = useFadeUp(700, 14);
  const badgeStyle = { opacity: badgeAnim.opacity, transform: [{ translateY: badgeAnim.translateY }] };
  const statsStyle = { opacity: statsAnim.opacity, transform: [{ translateY: statsAnim.translateY }] };
  const bottomStyle = { opacity: bottomAnim.opacity, transform: [{ translateY: bottomAnim.translateY }] };

  const particles = useMemo(() => PARTICLES, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(heroScale, {
        toValue: 1,
        damping: 11,
        stiffness: 95,
        mass: 0.85,
        useNativeDriver: true,
      }),
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoBreathe, {
            toValue: 1.04,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(logoBreathe, {
            toValue: 1,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.timing(progress, {
        toValue: 1,
        duration: SPLASH_DELAY_MS,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: false,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmer, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(shimmer, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.delay(600),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(aurora, {
            toValue: 1,
            duration: 5000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(aurora, {
            toValue: 0,
            duration: 5000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.loop(
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(brandGlow, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(brandGlow, {
            toValue: 0.4,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ),
    ]).start();
  }, [aurora, brandGlow, heroOpacity, heroScale, logoBreathe, progress, scanLine, shimmer]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const shimmerX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-140, SCREEN_W * 0.55],
  });

  const auroraX = aurora.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 40],
  });

  const scanTranslateY = scanLine.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_H * 0.12, SCREEN_H * 0.88],
  });

  const brandGlowOpacity = brandGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 1],
  });

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#000806', '#011412', '#043530', '#084F4A', '#0B6E67', '#14B8A6']}
        locations={[0, 0.15, 0.38, 0.58, 0.78, 1]}
        start={{ x: 0.05, y: 0 }}
        end={{ x: 0.95, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        style={[styles.auroraLayer, { transform: [{ translateX: auroraX }] }]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={['transparent', 'rgba(252,211,77,0.18)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <LinearGradient
        colors={['rgba(110,231,183,0.12)', 'transparent', 'rgba(252,211,77,0.08)']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'transparent', 'transparent', 'rgba(0,0,0,0.65)']}
        locations={[0, 0.22, 0.72, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <RadialGradient id="heroGlow" cx="50%" cy="34%" rx="55%" ry="42%">
            <Stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.28" />
            <Stop offset="45%" stopColor="#0B6E67" stopOpacity="0.08" />
            <Stop offset="100%" stopColor="#000806" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="goldGlow" cx="80%" cy="20%" rx="35%" ry="30%">
            <Stop offset="0%" stopColor="#FCD34D" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#000806" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="50%" cy="34%" r="260" fill="url(#heroGlow)" />
        <Circle cx="82%" cy="18%" r="140" fill="url(#goldGlow)" />
        <Line x1="12%" y1="20%" x2="28%" y2="32%" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        <Line x1="72%" y1="24%" x2="88%" y2="18%" stroke="rgba(252,211,77,0.1)" strokeWidth={1} />
        <Line x1="8%" y1="70%" x2="22%" y2="58%" stroke="rgba(110,231,183,0.08)" strokeWidth={1} />
        <Line x1="78%" y1="72%" x2="92%" y2="64%" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      </Svg>

      {particles.map((p, i) => (
        <Particle key={i} x={p.x} y={p.y} size={p.s} delay={p.d} />
      ))}

      <Animated.View
        style={[styles.scanLine, { transform: [{ translateY: scanTranslateY }] }]}
        pointerEvents="none"
      />

      <View style={styles.orbitCenter} pointerEvents="none">
        <OrbitRing size={300} duration={16000} borderColor="rgba(255,255,255,0.06)" dotColor="#6EE7B7" />
        <OrbitRing
          size={248}
          duration={11000}
          reverse
          borderColor="rgba(252,211,77,0.12)"
          dotColor="#FCD34D"
        />
        <OrbitRing size={196} duration={8000} borderColor="rgba(110,231,183,0.1)" dotColor="#FFFFFF" />
      </View>

      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: Math.max(insets.bottom, 28) },
        ]}
      >
        <Animated.View style={[styles.crownBadge, badgeStyle]}>
          <LinearGradient
            colors={['rgba(252,211,77,0.22)', 'rgba(255,255,255,0.06)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.crownBadgeGrad}
          >
            <Ionicons name="ribbon" size={13} color="#FCD34D" />
            <Text style={styles.crownText}>INDIA&apos;S PREMIUM HOME SERVICE</Text>
            <View style={styles.crownDivider} />
            <View style={styles.livePulse}>
              <View style={styles.liveDot} />
            </View>
            <Text style={styles.crownCity}>Raipur</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={[
            styles.hero,
            { opacity: heroOpacity, transform: [{ scale: heroScale }] },
          ]}
        >
          <Animated.View style={[styles.heroAura, { opacity: glowPulse }]} />

          <Animated.View style={[styles.logoOuter, { transform: [{ scale: logoBreathe }] }]}>
            <View style={styles.logoHalo} />
            <LinearGradient
              colors={['rgba(252,211,77,0.45)', 'rgba(110,231,183,0.35)', 'rgba(255,255,255,0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoFrame}
            >
              <LinearGradient colors={['#0A1219', '#152232', '#0D9488']} style={styles.logoBody}>
                <Text style={styles.logoMonogram}>Q</Text>
                <View style={styles.logoSparkRow}>
                  <Ionicons name="sparkles" size={11} color="#6EE7B7" />
                </View>
              </LinearGradient>
              <Animated.View style={[styles.logoShimmer, { transform: [{ translateX: shimmerX }] }]} />
            </LinearGradient>
          </Animated.View>

          <View style={styles.brandStack}>
            <Animated.Text style={[styles.brandShadow, { opacity: brandGlowOpacity }]}>
              QuickMaid
            </Animated.Text>
            <Text style={styles.brand}>QuickMaid</Text>
            <LinearGradient
              colors={['transparent', '#FCD34D', '#6EE7B7', 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.brandUnderline}
            />
          </View>

          <View style={styles.brandRow}>
            <View style={styles.brandLine} />
            <Ionicons name="diamond" size={8} color="rgba(252,211,77,0.8)" />
            <Text style={styles.brandSub}>Spotless · Trusted · Instant</Text>
            <Ionicons name="diamond" size={8} color="rgba(252,211,77,0.8)" />
            <View style={styles.brandLine} />
          </View>

          <Text style={styles.tagline}>
            Verified maids at your doorstep.{'\n'}
            Book in 60 seconds · Pay securely · Track live.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.statsGlass, statsStyle]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.03)']}
            style={styles.statsGrad}
          >
            {STATS.map((s, i) => (
              <StatCell
                key={s.label}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                delay={680 + i * 90}
                bordered={i > 0}
              />
            ))}
          </LinearGradient>
        </Animated.View>

        <View style={styles.trustRow}>
          {TRUST.map((item) => (
            <TrustCard
              key={item.label}
              icon={item.icon}
              label={item.label}
              sub={item.sub}
              delay={item.delay}
            />
          ))}
        </View>

        <Animated.View style={[styles.bottom, bottomStyle]}>
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
                <LinearGradient
                  colors={['#059669', '#6EE7B7', '#FFFFFF', '#FCD34D']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.progressHead} />
              </Animated.View>
            </View>
            <View style={styles.progressMeta}>
              <Ionicons name="hourglass-outline" size={11} color="rgba(255,255,255,0.5)" />
              <Text style={styles.progressLabel}>Curating your premium experience</Text>
            </View>
          </View>
          <Text style={styles.footer}>QuickMaid · Crafted with care · v1.0</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000806',
  },
  auroraLayer: {
    ...StyleSheet.absoluteFill,
    opacity: 0.85,
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: '#6EE7B7',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(110,231,183,0.12)',
    shadowColor: '#6EE7B7',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  orbitCenter: {
    position: 'absolute',
    alignSelf: 'center',
    top: '27%',
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitRingWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitRingLine: {
    borderWidth: 1,
  },
  orbitDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 4,
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.pad,
    justifyContent: 'space-between',
  },
  crownBadge: {
    alignSelf: 'center',
  },
  crownBadgeGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.28)',
  },
  crownText: {
    fontFamily: fonts.bold,
    fontSize: 8.5,
    color: '#FCD34D',
    letterSpacing: 1.4,
  },
  crownDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  livePulse: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(74,222,128,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },
  crownCity: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.88)',
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: -spacing.lg,
  },
  heroAura: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(110,231,183,0.14)',
  },
  logoOuter: {
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoHalo: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  logoFrame: {
    width: 112,
    height: 112,
    borderRadius: 32,
    padding: 2.5,
    overflow: 'hidden',
  },
  logoBody: {
    flex: 1,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMonogram: {
    fontFamily: fonts.extraBold,
    fontSize: 48,
    color: '#FFFFFF',
    letterSpacing: -2,
    marginTop: -4,
    textShadowColor: 'rgba(110,231,183,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  logoSparkRow: {
    position: 'absolute',
    bottom: 14,
    right: 16,
  },
  logoShimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 48,
    backgroundColor: 'rgba(255,255,255,0.22)',
    transform: [{ skewX: '-20deg' }],
  },
  brandStack: {
    alignItems: 'center',
    position: 'relative',
  },
  brandShadow: {
    position: 'absolute',
    fontFamily: fonts.extraBold,
    fontSize: 44,
    color: '#6EE7B7',
    letterSpacing: -1.4,
    lineHeight: 48,
    top: 1,
    opacity: 0.4,
  },
  brand: {
    fontFamily: fonts.extraBold,
    fontSize: 44,
    color: '#FFFFFF',
    letterSpacing: -1.4,
    lineHeight: 48,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  brandUnderline: {
    width: 120,
    height: 2,
    borderRadius: 1,
    marginTop: 6,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 4,
  },
  brandLine: {
    width: 32,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  brandSub: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  tagline: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.86)',
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 21,
    maxWidth: 310,
    letterSpacing: 0.1,
  },
  statsGlass: {
    alignSelf: 'center',
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  statsGrad: {
    flexDirection: 'row',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.sm,
    minWidth: 100,
  },
  statCellBorder: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  statSuffix: {
    color: '#FCD34D',
    fontSize: 14,
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.58)',
    marginTop: 3,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  trustCard: {
    flex: 1,
    maxWidth: 112,
  },
  trustCardGrad: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 3,
  },
  trustIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(15,20,25,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  trustSub: {
    fontFamily: fonts.medium,
    fontSize: 8,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  bottom: {
    gap: spacing.md,
  },
  progressWrap: {
    gap: spacing.sm,
  },
  progressTrack: {
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'visible',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    overflow: 'hidden',
    position: 'relative',
  },
  progressHead: {
    position: 'absolute',
    top: -3,
    right: -5,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    shadowColor: '#6EE7B7',
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  progressMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  progressLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.52)',
    letterSpacing: 0.3,
  },
  footer: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.34)',
    textAlign: 'center',
    letterSpacing: 0.6,
  },
});
