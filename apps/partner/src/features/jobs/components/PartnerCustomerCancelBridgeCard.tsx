import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { PartnerJob } from '@/constants/demo';
import type { BookingStatusBridgeEntry } from '../../../../shared/booking-status-bridge';
import { getBookingStatusForRef } from '@/features/jobs/lib/booking-status-bridge.storage';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface PartnerCustomerCancelBridgeCardProps {
  job: PartnerJob;
}

export function PartnerCustomerCancelBridgeCard({ job }: PartnerCustomerCancelBridgeCardProps) {
  const [bridge, setBridge] = useState<BookingStatusBridgeEntry | null>(null);

  useEffect(() => {
    const load = async () => setBridge(await getBookingStatusForRef(job.bookingRef));
    void load();
    const id = setInterval(() => void load(), 12_000);
    return () => clearInterval(id);
  }, [job.bookingRef]);

  const isCustomerCancel =
    bridge?.event === 'customer_cancelled' ||
    job.declineReason?.toLowerCase().includes('customer') ||
    job.declineReason?.toLowerCase().includes('cancel');

  if (!isCustomerCancel) return null;

  const reason = bridge?.cancelReason ?? job.declineReason ?? 'Customer cancelled booking';

  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.wrap}>
      <LinearGradient
        colors={['#450A0A', '#991B1B', '#DC2626']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.head}>
          <View style={styles.icon}>
            <Ionicons name="close-circle" size={20} color={colors.white} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>CUSTOMER CANCELLED</Text>
            <Text style={styles.title}>Visit removed from schedule</Text>
            <Text style={styles.sub}>Ref {job.bookingRef} · bridge synced</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>VOID</Text>
          </View>
        </View>

        <View style={styles.reasonRow}>
          <Ionicons name="chatbubble-ellipses-outline" size={14} color="#FCA5A5" />
          <Text style={styles.reasonText}>{reason}</Text>
        </View>

        <View style={styles.pipeline}>
          <PipeStep done icon="phone-portrait-outline" label="Customer app" />
          <PipeStep done icon="swap-horizontal" label="Bridge" />
          <PipeStep done icon="briefcase" label="Job declined" />
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

function PipeStep({
  done,
  icon,
  label,
}: {
  done?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.pipeStep}>
      <View style={[styles.pipeDot, done && styles.pipeDotDone]}>
        <Ionicons name={icon} size={11} color={colors.white} />
      </View>
      <Text style={styles.pipeLabel}>{label}</Text>
    </View>
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
    borderColor: 'rgba(252,165,165,0.3)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(220,38,38,0.25)',
    top: -30,
    right: -10,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  title: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(252,165,165,0.35)',
  },
  badgeText: {
    fontFamily: fonts.extraBold,
    fontSize: 9,
    color: '#FCA5A5',
    letterSpacing: 0.6,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  reasonText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 16,
  },
  pipeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  pipeStep: { flex: 1, alignItems: 'center', gap: 5 },
  pipeDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipeDotDone: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pipeLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});
