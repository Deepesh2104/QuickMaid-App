import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useOpenTrackBooking } from '../hooks/useOpenTrackBooking';
import { useEffect, useState } from 'react';
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

import type { DemoBooking } from '@/constants/demo';
import { getPartnerLiveLocation, type VisitLocationBridgeEntry } from '@/lib/visit-location-bridge';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface BookingLiveLocationCardProps {
  booking: DemoBooking;
}

export function BookingLiveLocationCard({ booking }: BookingLiveLocationCardProps) {
  const openTrack = useOpenTrackBooking();
  const [live, setLive] = useState<VisitLocationBridgeEntry | null>(null);
  const [waiting, setWaiting] = useState(true);
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 1400, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 0 }),
      ),
      -1,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.5 - pulse.value * 0.12,
  }));

  useEffect(() => {
    if (!booking.bookingRef || booking.status !== 'upcoming') return;
    const load = async () => {
      const ping = await getPartnerLiveLocation(booking.bookingRef!);
      setLive(ping);
      setWaiting(!ping);
    };
    void load();
    const id = setInterval(() => void load(), 8000);
    return () => clearInterval(id);
  }, [booking.bookingRef, booking.status]);

  if (booking.status !== 'upcoming') return null;

  const proName = live?.partnerName ?? booking.maid ?? 'Your pro';
  const updated = live
    ? new Date(live.recordedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <Animated.View entering={FadeInDown.duration(320)} style={styles.wrap}>
      <LinearGradient
        colors={live ? ['#010F0E', '#084F4A', '#0B6E67'] : ['#0F172A', '#1E3A5F', '#2563EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.head}>
          <View style={styles.iconCol}>
            {live ? (
              <>
                <Animated.View style={[styles.pulseRing, pulseStyle]} />
                <View style={styles.iconLive}>
                  <Ionicons name="navigate" size={18} color={colors.white} />
                </View>
              </>
            ) : (
              <View style={styles.iconWait}>
                <Ionicons name="locate-outline" size={18} color="rgba(255,255,255,0.9)" />
              </View>
            )}
          </View>

          <View style={styles.copy}>
            <Text style={styles.eyebrow}>LIVE TRACKING</Text>
            <Text style={styles.title}>
              {live ? `${proName} is on the way` : 'Waiting for live GPS'}
            </Text>
            <Text style={styles.sub}>
              {live
                ? `Updated ${updated} · ${live.lat.toFixed(4)}, ${live.lng.toFixed(4)}`
                : 'Pro will share location when visit starts'}
            </Text>
          </View>

          <View style={[styles.liveBadge, !live && styles.liveBadgeWait]}>
            <View style={[styles.liveDot, !live && styles.liveDotWait]} />
            <Text style={styles.liveBadgeText}>{live ? 'LIVE' : 'SYNC'}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.chip}>
            <Ionicons name="shield-checkmark" size={12} color="#6EE7B7" />
            <Text style={styles.chipText}>Secure trip</Text>
          </View>
          <Pressable
            style={styles.trackBtn}
            onPress={() => openTrack(booking.id)}
          >
            <Text style={styles.trackBtnText}>{live ? 'Open live map' : 'Track visit'}</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.white} />
          </Pressable>
        </View>

        {waiting && !live ? (
          <Text style={styles.waitHint}>Partner app se visit start hone par yahan live dikhega</Text>
        ) : null}
      </LinearGradient>
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
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(18,165,152,0.2)',
    top: -50,
    right: -30,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  iconCol: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(18,165,152,0.35)',
  },
  iconLive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(18,165,152,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  iconWait: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  copy: { flex: 1, gap: 3, paddingTop: 2 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.1,
  },
  title: { fontFamily: fonts.bold, fontSize: 15, color: colors.white, lineHeight: 20 },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 15,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(18,165,152,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.45)',
  },
  liveBadgeWait: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6EE7B7',
  },
  liveDotWait: { backgroundColor: 'rgba(255,255,255,0.5)' },
  liveBadgeText: {
    fontFamily: fonts.extraBold,
    fontSize: 9,
    color: colors.white,
    letterSpacing: 0.6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  chipText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  trackBtnText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
  },
  waitHint: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
  },
});
