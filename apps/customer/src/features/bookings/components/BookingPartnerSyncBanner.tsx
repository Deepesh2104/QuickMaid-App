import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { DemoBooking } from '@/constants/demo';
import { getPartnerLiveLocation } from '@/lib/visit-location-bridge';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface BookingPartnerSyncBannerProps {
  upcoming: DemoBooking[];
  bridgeAlertCount?: number;
  onRefresh: () => void;
}

export function BookingPartnerSyncBanner({
  upcoming,
  bridgeAlertCount = 0,
  onRefresh,
}: BookingPartnerSyncBannerProps) {
  const [liveCount, setLiveCount] = useState(0);
  const [syncedCount, setSyncedCount] = useState(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 1200, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 0 }),
      ),
      -1,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.55 - pulse.value * 0.15,
  }));

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const refs = upcoming.map((b) => b.bookingRef).filter(Boolean) as string[];
      if (!refs.length) {
        if (!cancelled) {
          setLiveCount(0);
          setSyncedCount(0);
        }
        return;
      }
      const pings = await Promise.all(refs.map((ref) => getPartnerLiveLocation(ref)));
      if (!cancelled) {
        setLiveCount(pings.filter(Boolean).length);
        setSyncedCount(refs.length);
      }
    };
    void check();
    const id = setInterval(() => void check(), 10_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [upcoming]);

  if (!upcoming.length) return null;

  const isLive = liveCount > 0;

  return (
    <Pressable
      style={styles.wrap}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onRefresh();
      }}
      accessibilityRole="button"
      accessibilityLabel="Sync partner app updates"
    >
      <LinearGradient
        colors={isLive ? ['#010F0E', '#084F4A', '#0B6E67'] : ['#0F172A', '#1E3A5F', '#1570EF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glowA} pointerEvents="none" />
        <View style={styles.glowB} pointerEvents="none" />

        <View style={styles.topRow}>
          <View style={styles.iconWrap}>
            {isLive ? (
              <>
                <Animated.View style={[styles.liveRing, pulseStyle]} />
                <View style={styles.liveCore}>
                  <Ionicons name="radio" size={16} color={colors.white} />
                </View>
              </>
            ) : (
              <Ionicons name="sync" size={18} color={colors.white} />
            )}
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>PARTNER BRIDGE</Text>
            <Text style={styles.title}>
              {isLive ? 'Live visits connected' : 'Sync partner updates'}
            </Text>
          </View>
          <View style={[styles.badge, isLive && styles.badgeLive]}>
            <Text style={styles.badgeText}>{isLive ? 'LIVE' : 'SYNC'}</Text>
          </View>
        </View>

        <Text style={styles.sub}>
          {isLive
            ? `${liveCount} of ${syncedCount} visit${syncedCount > 1 ? 's' : ''} sharing GPS · tap to refresh`
            : 'Pull or tap after partner accepts or starts visit'}
        </Text>

        {bridgeAlertCount > 0 ? (
          <View style={styles.alertChip}>
            <Ionicons name="notifications" size={11} color="#93C5FD" />
            <Text style={styles.alertChipText}>
              {bridgeAlertCount} bridge alert{bridgeAlertCount > 1 ? 's' : ''} in inbox
            </Text>
          </View>
        ) : null}

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{upcoming.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statNum, isLive && styles.statNumLive]}>{liveCount}</Text>
            <Text style={styles.statLabel}>Live GPS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.85)" />
            <Text style={styles.statLabel}>Refresh</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadow.md,
  },
  card: {
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  glowA: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -40,
    right: -20,
  },
  glowB: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(18,165,152,0.25)',
    bottom: -30,
    left: 20,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(18,165,152,0.35)',
  },
  liveCore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(18,165,152,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1.2,
  },
  title: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeLive: {
    backgroundColor: 'rgba(18,165,152,0.35)',
    borderColor: 'rgba(18,165,152,0.6)',
  },
  badgeText: {
    fontFamily: fonts.extraBold,
    fontSize: 10,
    color: colors.white,
    letterSpacing: 0.8,
  },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 16,
  },
  alertChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(21,112,239,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.35)',
  },
  alertChipText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: '#93C5FD',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statNum: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
  },
  statNumLive: { color: '#6EE7B7' },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
