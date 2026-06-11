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

import type { PartnerJob } from '@/constants/demo';
import { getCustomerBridgeEvents } from '@/features/jobs/lib/booking-status-bridge.storage';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface PartnerBridgeSyncBannerProps {
  activeJobs: PartnerJob[];
  onRefresh: () => void;
}

export function PartnerBridgeSyncBanner({ activeJobs, onRefresh }: PartnerBridgeSyncBannerProps) {
  const [customerEvents, setCustomerEvents] = useState(0);
  const [cancelCount, setCancelCount] = useState(0);
  const [rescheduleCount, setRescheduleCount] = useState(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1200, easing: Easing.out(Easing.quad) }),
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
    const load = async () => {
      const events = await getCustomerBridgeEvents();
      setCustomerEvents(events.length);
      setCancelCount(events.filter((e) => e.event === 'customer_cancelled').length);
      setRescheduleCount(events.filter((e) => e.event === 'customer_rescheduled').length);
    };
    void load();
    const id = setInterval(() => void load(), 15_000);
    return () => clearInterval(id);
  }, [activeJobs]);

  if (!activeJobs.length && customerEvents === 0) return null;

  const liveCount = activeJobs.filter((j) => j.status === 'in_progress').length;

  return (
    <Pressable
      style={styles.wrap}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onRefresh();
      }}
    >
      <LinearGradient
        colors={['#0F172A', '#1E3A5F', '#1570EF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.topRow}>
          <View style={styles.iconWrap}>
            <Animated.View style={[styles.pulseRing, pulseStyle]} />
            <Ionicons name="swap-horizontal" size={18} color={colors.white} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>CUSTOMER BRIDGE</Text>
            <Text style={styles.title}>Lifecycle sync</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>LIVE</Text>
          </View>
        </View>

        <Text style={styles.sub}>
          Tap to pull customer cancel & reschedule · lifecycle events sync both ways
        </Text>

        {(cancelCount > 0 || rescheduleCount > 0) ? (
          <View style={styles.eventChips}>
            {cancelCount > 0 ? (
              <View style={styles.chipCancel}>
                <Ionicons name="close-circle" size={11} color="#FCA5A5" />
                <Text style={styles.chipCancelText}>{cancelCount} cancel</Text>
              </View>
            ) : null}
            {rescheduleCount > 0 ? (
              <View style={styles.chipReschedule}>
                <Ionicons name="calendar" size={11} color="#5EEAD4" />
                <Text style={styles.chipRescheduleText}>{rescheduleCount} reschedule</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={styles.pipeline}>
          <PipeStep icon="checkmark-circle" label="Accept" />
          <PipeStep icon="navigate" label="Live GPS" />
          <PipeStep icon="key" label="OTP done" />
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{activeJobs.length}</Text>
            <Text style={styles.statLabel}>Scheduled</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statNum, liveCount > 0 && styles.statNumLive]}>{liveCount}</Text>
            <Text style={styles.statLabel}>On visit</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>{customerEvents}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function PipeStep({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.pipeStep}>
      <View style={styles.pipeIcon}>
        <Ionicons name={icon} size={11} color="#93C5FD" />
      </View>
      <Text style={styles.pipeLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
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
  glow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(21,112,239,0.25)',
    top: -30,
    right: -10,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(21,112,239,0.35)',
  },
  copy: { flex: 1, gap: 2 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.1,
  },
  title: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(21,112,239,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.4)',
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
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 16,
  },
  eventChips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chipCancel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(220,38,38,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(252,165,165,0.35)',
  },
  chipCancelText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: '#FCA5A5',
  },
  chipReschedule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(13,148,136,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(94,234,212,0.35)',
  },
  chipRescheduleText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: '#5EEAD4',
  },
  pipeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  pipeStep: { flex: 1, alignItems: 'center', gap: 4 },
  pipeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipeLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statNum: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
  },
  statNumLive: { color: '#93C5FD' },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
});
