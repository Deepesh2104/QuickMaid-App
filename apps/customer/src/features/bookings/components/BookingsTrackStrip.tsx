import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DemoBooking } from '@/constants/demo';
import { useOpenTrackBooking } from '../hooks/useOpenTrackBooking';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface BookingsTrackStripProps {
  booking: DemoBooking;
}

export function BookingsTrackStrip({ booking }: BookingsTrackStripProps) {
  const openTrack = useOpenTrackBooking();
  const initial = booking.maid.charAt(0);

  return (
    <Pressable
      style={styles.wrap}
      onPress={() => {
        Haptics.selectionAsync();
        openTrack(booking.id);
      }}
      accessibilityRole="button"
      accessibilityLabel={`Track ${booking.maid}`}
    >
      <LinearGradient colors={['#ECFDF5', '#FFFFFF']} style={StyleSheet.absoluteFill} />

      <View style={styles.left}>
        <View style={styles.avatar}>
          <Text style={styles.initial}>{initial}</Text>
          <View style={styles.pulse} />
        </View>
        <View style={styles.copy}>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Pro on the way</Text>
          </View>
          <Text style={styles.name}>{booking.maid}</Text>
          <Text style={styles.eta}>Arrives in ~12 min · {booking.time}</Text>
        </View>
      </View>

      <View style={styles.progress}>
        <View style={styles.progressFill} />
      </View>
      <View style={styles.mapHint}>
        <Ionicons name="navigate" size={14} color={colors.primary} />
        <Text style={styles.mapText}>Live tracking active</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(2,122,72,0.15)',
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.primaryDark,
  },
  pulse: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
  },
  copy: { flex: 1, gap: 2 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  liveText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  name: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.ink,
  },
  eta: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },
  progress: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.bgMuted,
    overflow: 'hidden',
  },
  progressFill: {
    width: '68%',
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  mapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  mapText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
});
