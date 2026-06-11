import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
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

import { useVisitLiveLocation } from '@/features/jobs/hooks/useVisitLiveLocation';
import { usePartnerI18n } from '@/i18n/usePartnerI18n';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

function formatElapsed(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

interface PartnerLiveLocationCardProps {
  jobId: string;
  bookingRef: string;
  partnerName?: string;
  active: boolean;
}

export function PartnerLiveLocationCard({
  jobId,
  bookingRef,
  partnerName,
  active,
}: PartnerLiveLocationCardProps) {
  const { t } = usePartnerI18n();
  const live = useVisitLiveLocation(jobId, active, { bookingRef, partnerName });
  const autoStarted = useRef(false);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!live.sharing) return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.55, { duration: 1400, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 0 }),
      ),
      -1,
    );
  }, [live.sharing, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.5 - pulse.value * 0.12,
  }));

  useEffect(() => {
    if (active && !autoStarted.current) {
      autoStarted.current = true;
      void live.start();
    }
    if (!active) {
      autoStarted.current = false;
      live.stop();
    }
  }, [active, live.start, live.stop]);

  if (!active) return null;

  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.wrap}>
      <LinearGradient
        colors={
          live.sharing
            ? ['#010F0E', '#084F4A', '#0B6E67']
            : ['#0F172A', '#1E3A5F', '#2563EB']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.head}>
          <View style={styles.iconCol}>
            {live.sharing ? (
              <>
                <Animated.View style={[styles.pulseRing, pulseStyle]} />
                <View style={styles.iconLive}>
                  <Ionicons name="radio" size={18} color={colors.white} />
                </View>
              </>
            ) : (
              <View style={styles.iconWait}>
                <Ionicons name="navigate" size={18} color="rgba(255,255,255,0.9)" />
              </View>
            )}
          </View>

          <View style={styles.headCopy}>
            <Text style={styles.eyebrow}>CUSTOMER TRACKING</Text>
            <Text style={styles.title}>
              {live.sharing ? 'Sharing live GPS' : 'Start location share'}
            </Text>
            <Text style={styles.sub}>
              {live.sharing
                ? `Customer app pe live map · ${partnerName ?? 'You'}`
                : 'Visit start par auto-share · customer ETA dekhega'}
            </Text>
          </View>

          <View style={[styles.liveBadge, !live.sharing && styles.liveBadgeWait]}>
            <View style={[styles.liveDot, !live.sharing && styles.liveDotWait]} />
            <Text style={styles.liveBadgeText}>{live.sharing ? 'LIVE' : 'READY'}</Text>
          </View>
        </View>

        {live.sharing ? (
          <View style={styles.livePanel}>
            <View style={styles.liveRow}>
              <Ionicons name="time-outline" size={14} color="#6EE7B7" />
              <Text style={styles.liveLabel}>Broadcasting · {formatElapsed(live.elapsedSec)}</Text>
            </View>
            <Text style={styles.coords}>{live.coordsLabel ?? 'Acquiring GPS…'}</Text>
            <Text style={styles.meta}>
              Updated {live.lastUpdated ?? '—'} · {live.pingCount} {t('pingsSaved')} · Ref{' '}
              {bookingRef}
            </Text>
            <Pressable
              style={styles.stopBtn}
              onPress={() => {
                Haptics.selectionAsync();
                live.stop();
              }}
            >
              <Ionicons name="stop-circle" size={14} color="#FDA29B" />
              <Text style={styles.stopText}>Stop sharing</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={styles.startBtn}
            onPress={() => void live.start()}
            disabled={live.loading}
          >
            <LinearGradient colors={['#12A598', '#0B6E67']} style={StyleSheet.absoluteFill} />
            {live.loading ? (
              <Text style={styles.startText}>Starting GPS…</Text>
            ) : (
              <>
                <Ionicons name="navigate" size={16} color={colors.white} />
                <Text style={styles.startText}>Start live share</Text>
              </>
            )}
          </Pressable>
        )}

        {live.error ? <Text style={styles.error}>{live.error}</Text> : null}

        <View style={styles.trustRow}>
          <Ionicons name="shield-checkmark" size={12} color="#6EE7B7" />
          <Text style={styles.trustText}>Bridge sync · customer track screen updated every 8s</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    marginBottom: spacing.sm,
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
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(18,165,152,0.18)',
    top: -45,
    right: -25,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  iconCol: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
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
    borderColor: 'rgba(255,255,255,0.3)',
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
  headCopy: { flex: 1, gap: 3, paddingTop: 2 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  title: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
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
  livePanel: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveLabel: { fontFamily: fonts.bold, fontSize: 12, color: '#6EE7B7' },
  coords: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.white },
  meta: { fontFamily: fonts.regular, fontSize: 10, color: 'rgba(255,255,255,0.55)' },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingVertical: 4,
  },
  stopText: { fontFamily: fonts.semiBold, fontSize: 12, color: '#FDA29B' },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 12,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  startText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  error: { fontFamily: fonts.medium, fontSize: 11, color: '#FDA29B' },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  trustText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
  },
});
