import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { DemoBooking } from '@/constants/demo';
import { useOpenProProfile } from '@/features/pro/hooks/useOpenProProfile';
import { resolveMaidId } from '../lib/maid.profile';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface BookingProAssignedCardProps {
  booking: DemoBooking;
}

export function BookingProAssignedCard({ booking }: BookingProAssignedCardProps) {
  const openProProfile = useOpenProProfile();

  if (booking.status !== 'upcoming' || !booking.maid) return null;

  const assignedAt = booking.maidAssignedAt
    ? new Date(booking.maidAssignedAt).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.wrap}>
      <LinearGradient
        colors={['#422006', '#92400E', '#B45309']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.head}>
          <View style={styles.icon}>
            <Ionicons name="person-circle" size={20} color="#FCD34D" />
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>PRO CONFIRMED</Text>
            <Text style={styles.title}>{booking.maid} accepted your visit</Text>
            {assignedAt ? (
              <Text style={styles.sub}>Synced via partner bridge · {assignedAt}</Text>
            ) : (
              <Text style={styles.sub}>Auto-assigned · partner will confirm on accept</Text>
            )}
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ACTIVE</Text>
          </View>
        </View>

        <Pressable
          style={styles.profileBtn}
          onPress={() =>
            openProProfile(resolveMaidId(booking.maid, booking.maidId), {
              name: booking.maid,
              bookingId: booking.id,
              status: booking.status,
            })
          }
        >
          <Text style={styles.profileBtnText}>View pro profile</Text>
          <Ionicons name="arrow-forward" size={14} color="#FCD34D" />
        </Pressable>
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
    borderColor: 'rgba(252,211,77,0.22)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(252,211,77,0.12)',
    top: -40,
    right: -20,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
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
  title: { fontFamily: fonts.bold, fontSize: 15, color: colors.white, lineHeight: 20 },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(252,211,77,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.35)',
  },
  badgeText: {
    fontFamily: fonts.extraBold,
    fontSize: 9,
    color: '#FCD34D',
    letterSpacing: 0.6,
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.25)',
  },
  profileBtnText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: '#FCD34D',
  },
});
