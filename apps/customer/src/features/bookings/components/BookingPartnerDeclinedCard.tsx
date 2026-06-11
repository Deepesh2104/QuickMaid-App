import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { DemoBooking } from '@/constants/demo';
import { getBookingStatusForRef } from '@/lib/booking-status-bridge.storage';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface BookingPartnerDeclinedCardProps {
  booking: DemoBooking;
}

export function BookingPartnerDeclinedCard({ booking }: BookingPartnerDeclinedCardProps) {
  const [declined, setDeclined] = useState(false);
  const [partnerName, setPartnerName] = useState<string | null>(null);

  useEffect(() => {
    if (!booking.bookingRef || booking.status !== 'upcoming') return;
    const load = async () => {
      const entry = await getBookingStatusForRef(booking.bookingRef!);
      const reassignment =
        booking.partnerReassignPending === true ||
        booking.maid === 'Finding your pro…' ||
        entry?.event === 'partner_declined';
      setDeclined(reassignment);
      setPartnerName(booking.lastDeclinedPartner ?? entry?.partnerName ?? null);
    };
    void load();
    const id = setInterval(() => void load(), 12_000);
    return () => clearInterval(id);
  }, [
    booking.bookingRef,
    booking.status,
    booking.partnerReassignPending,
    booking.maid,
    booking.lastDeclinedPartner,
  ]);

  if (!declined || booking.status !== 'upcoming') return null;

  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.wrap}>
      <LinearGradient
        colors={['#1E1B4B', '#4338CA', '#6366F1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.head}>
          <View style={styles.icon}>
            <Ionicons name="people-outline" size={18} color={colors.white} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>REASSIGNMENT</Text>
            <Text style={styles.title}>
              {partnerName ? `${partnerName} unavailable` : 'Pro unavailable'}
            </Text>
            <Text style={styles.sub}>Finding next available pro · bridge sync active</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AUTO</Text>
          </View>
        </View>

        <View style={styles.steps}>
          <Step done label="Partner declined" />
          <Step active label="Reassigning" />
          <Step label="New pro notify" />
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

function Step({ done, active, label }: { done?: boolean; active?: boolean; label: string }) {
  return (
    <View style={styles.step}>
      <View
        style={[
          styles.stepDot,
          done && styles.stepDotDone,
          active && styles.stepDotActive,
        ]}
      />
      <Text style={[styles.stepLabel, (done || active) && styles.stepLabelOn]}>{label}</Text>
    </View>
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
    borderColor: 'rgba(165,180,252,0.3)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(99,102,241,0.25)',
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
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(165,180,252,0.35)',
  },
  badgeText: {
    fontFamily: fonts.extraBold,
    fontSize: 9,
    color: '#C7D2FE',
    letterSpacing: 0.6,
  },
  steps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  step: { flex: 1, alignItems: 'center', gap: 4 },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  stepDotDone: { backgroundColor: '#A5B4FC' },
  stepDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#C7D2FE',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  stepLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
  },
  stepLabelOn: { color: 'rgba(255,255,255,0.9)', fontFamily: fonts.semiBold },
});
