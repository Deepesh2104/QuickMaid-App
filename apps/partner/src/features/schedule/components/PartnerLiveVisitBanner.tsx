import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import type { PartnerJob } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface PartnerLiveVisitBannerProps {
  job: PartnerJob;
}

export function PartnerLiveVisitBanner({ job }: PartnerLiveVisitBannerProps) {
  const router = useRouter();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.45, { duration: 1300, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 0 }),
      ),
      -1,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.5 - pulse.value * 0.12,
  }));

  return (
    <Animated.View entering={FadeInDown.duration(280)}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push(`/job/${job.id}` as Href);
        }}
        style={styles.wrap}
      >
        <LinearGradient
          colors={['#010F0E', '#084F4A', '#0B6E67']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.glow} pointerEvents="none" />

          <View style={styles.row}>
            <View style={styles.iconCol}>
              <Animated.View style={[styles.pulseRing, pulseStyle]} />
              <View style={styles.iconLive}>
                <Ionicons name="radio" size={16} color={colors.white} />
              </View>
            </View>

            <View style={styles.copy}>
              <Text style={styles.eyebrow}>VISIT LIVE · GPS ON</Text>
              <Text style={styles.title}>{job.service}</Text>
              <Text style={styles.sub} numberOfLines={1}>
                {job.customerName} · {job.slotLabel} · Ref {job.bookingRef}
              </Text>
            </View>

            <View style={styles.cta}>
              <Text style={styles.ctaText}>Open</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.white} />
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.chip}>
              <Ionicons name="navigate" size={12} color="#6EE7B7" />
              <Text style={styles.chipText}>Customer track screen live</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons name="shield-checkmark" size={12} color="#FCD34D" />
              <Text style={styles.chipText}>Bridge sync</Text>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadow.md,
  },
  card: {
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.25)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(18,165,152,0.22)',
    top: -35,
    right: -15,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconCol: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  pulseRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(18,165,152,0.35)',
  },
  iconLive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#12A598',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  copy: { flex: 1, gap: 2, minWidth: 0 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: '#6EE7B7',
    letterSpacing: 1,
  },
  title: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.72)',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  ctaText: { fontFamily: fonts.bold, fontSize: 11, color: colors.white },
  footer: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  chipText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
  },
});
