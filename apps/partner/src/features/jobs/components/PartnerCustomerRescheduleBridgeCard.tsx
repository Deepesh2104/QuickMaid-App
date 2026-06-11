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

interface PartnerCustomerRescheduleBridgeCardProps {
  job: PartnerJob;
}

export function PartnerCustomerRescheduleBridgeCard({ job }: PartnerCustomerRescheduleBridgeCardProps) {
  const [bridge, setBridge] = useState<BookingStatusBridgeEntry | null>(null);

  useEffect(() => {
    const load = async () => setBridge(await getBookingStatusForRef(job.bookingRef));
    void load();
    const id = setInterval(() => void load(), 12_000);
    return () => clearInterval(id);
  }, [job.bookingRef]);

  if (bridge?.event !== 'customer_rescheduled') return null;
  if (job.status === 'declined' || job.status === 'completed') return null;

  const visitDate = bridge.visitDate ?? job.visitDate;
  const slotLabel = bridge.slotLabel ?? job.slotLabel;

  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.wrap}>
      <LinearGradient
        colors={['#042F2E', '#0D9488', '#2DD4BF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.head}>
          <View style={styles.icon}>
            <Ionicons name="calendar" size={20} color={colors.white} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>CUSTOMER RESCHEDULED</Text>
            <Text style={styles.title}>New slot synced to your calendar</Text>
            <Text style={styles.sub}>{job.customerName} · Ref {job.bookingRef}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        </View>

        <View style={styles.slotRow}>
          <View style={styles.slotChip}>
            <Ionicons name="calendar-outline" size={14} color="#5EEAD4" />
            <Text style={styles.slotText}>{visitDate}</Text>
          </View>
          <View style={styles.slotChip}>
            <Ionicons name="time-outline" size={14} color="#5EEAD4" />
            <Text style={styles.slotText}>{slotLabel}</Text>
          </View>
        </View>

        <View style={styles.trust}>
          <Ionicons name="checkmark-circle" size={12} color="#6EE7B7" />
          <Text style={styles.trustText}>
            Pull sync on Home ya Settings — calendar auto-updates on same device demo
          </Text>
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
    borderColor: 'rgba(94,234,212,0.3)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(45,212,191,0.2)',
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
  title: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(94,234,212,0.35)',
  },
  badgeText: {
    fontFamily: fonts.extraBold,
    fontSize: 9,
    color: '#5EEAD4',
    letterSpacing: 0.6,
  },
  slotRow: { flexDirection: 'row', gap: spacing.sm },
  slotChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(94,234,212,0.2)',
  },
  slotText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
  },
  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  trustText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 14,
  },
});
