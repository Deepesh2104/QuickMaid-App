import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QmLogo } from '@/components/ui/QmLogo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export const SPLASH_DELAY_MS = 2000;
export const SPLASH_EXIT_MS = 480;

const STATS = [
  { value: '₹18k+', label: 'Avg monthly' },
  { value: '4.9', label: 'Partner rating' },
  { value: '2.4k', label: 'Active pros' },
];

const TRUST = [
  { icon: 'shield-checkmark' as const, label: 'Verified payouts' },
  { icon: 'calendar' as const, label: 'Flexible slots' },
  { icon: 'trophy' as const, label: 'Top performer perks' },
];

export function PartnerSplashScreen() {
  const insets = useSafeAreaInsets();
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(24)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    ).start();
  }, [fade, rise, shimmer]);

  const glowOpacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.75] });

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#032A28', '#084F4A', '#0B6E67', '#0D8A82']} style={StyleSheet.absoluteFill} />

      <Animated.View style={[styles.glow, { opacity: glowOpacity }]} pointerEvents="none" />

      <View style={[styles.content, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl }]}>
        <Animated.View style={{ opacity: fade, transform: [{ translateY: rise }] }}>
          <QmLogo size="lg" light />
          <Text style={styles.eyebrow}>PARTNER PROGRAM</Text>
          <Text style={styles.title}>Earn with trust.{'\n'}Work on your terms.</Text>
          <Text style={styles.sub}>Raipur&apos;s premium home-service network for verified professionals.</Text>
        </Animated.View>

        <Animated.View style={[styles.statsRow, { opacity: fade }]}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View style={[styles.trustRow, { opacity: fade }]}>
          {TRUST.map((t) => (
            <View key={t.label} style={styles.trustPill}>
              <Ionicons name={t.icon} size={14} color={colors.partnerGold} />
              <Text style={styles.trustText}>{t.label}</Text>
            </View>
          ))}
        </Animated.View>

        <Text style={styles.footer}>QuickMaid Partner · Aadhaar verified · Weekly UPI payouts</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#032A28' },
  glow: {
    position: 'absolute',
    top: '18%',
    alignSelf: 'center',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(217,119,6,0.18)',
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.pad,
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: 'rgba(255,255,255,0.55)',
    marginTop: spacing.xxl,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 30,
    lineHeight: 38,
    color: colors.white,
    marginTop: spacing.sm,
    letterSpacing: -0.6,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.78)',
    marginTop: spacing.md,
    maxWidth: 320,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: spacing.lg,
  },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.white },
  statLabel: { fontFamily: fonts.medium, fontSize: 10, color: 'rgba(255,255,255,0.65)' },
  trustRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  trustText: { fontFamily: fonts.semiBold, fontSize: 11, color: 'rgba(255,255,255,0.9)' },
  footer: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
  },
});
