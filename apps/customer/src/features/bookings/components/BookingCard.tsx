import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import type { DemoBooking } from '@/constants/demo';
import { HomePhoto } from '@/features/home/components/HomePhoto';
import { getServiceImages } from '@/features/home/constants/unsplash.images';
import { useOpenBookingDetail } from '../hooks/useOpenBookingDetail';
import { useOpenRateBooking } from '../hooks/useOpenRateBooking';
import { useRebookBooking } from '../hooks/useRebookBooking';
import { getBookingImageId } from '../utils/bookings.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const AnimatedPress = Animated.createAnimatedComponent(Pressable);

const STATUS = {
  upcoming: {
    label: 'Upcoming',
    gradient: ['#EEF6FF', '#FFFFFF'] as const,
    ink: '#175CD3',
    accent: '#175CD3',
  },
  completed: {
    label: 'Completed',
    gradient: ['#ECFDF5', '#FFFFFF'] as const,
    ink: '#027A48',
    accent: colors.primary,
  },
  cancelled: {
    label: 'Cancelled',
    gradient: ['#FEF3F2', '#FFFFFF'] as const,
    ink: '#D92D20',
    accent: '#D92D20',
  },
};

interface BookingCardProps {
  booking: DemoBooking;
  index: number;
  showRebook?: boolean;
}

export function BookingCard({ booking, index, showRebook }: BookingCardProps) {
  const openDetail = useOpenBookingDetail();
  const openRate = useOpenRateBooking();
  const rebook = useRebookBooking();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const status = STATUS[booking.status];
  const initial = booking.maid.charAt(0);
  const imageId = getBookingImageId(booking.service);

  return (
    <AnimatedPress
      style={[styles.card, anim]}
      onPressIn={() => {
        scale.value = withSpring(0.98, { damping: 16, stiffness: 360 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 16, stiffness: 360 });
      }}
      onPress={() => openDetail(booking.id)}
      accessibilityRole="button"
      accessibilityLabel={`${booking.service}, ${status.label}`}
    >
      <LinearGradient colors={[...status.gradient]} style={StyleSheet.absoluteFill} />

      <View style={styles.row}>
        <View style={styles.thumbWrap}>
          <HomePhoto uri={getServiceImages(imageId)} style={styles.thumb} overlay="none" borderRadius={radius.lg} />
          <View style={[styles.statusDot, { backgroundColor: status.accent }]} />
        </View>

        <View style={styles.main}>
          <View style={styles.head}>
            <Text style={styles.name}>{booking.service}</Text>
            <Text style={styles.price}>{booking.price}</Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={12} color={colors.muted} />
            <Text style={styles.meta}>
              {booking.date} · {booking.time}
            </Text>
          </View>

          <View style={styles.proRow}>
            <View style={styles.avatar}>
              <Text style={styles.initial}>{initial}</Text>
            </View>
            <Text style={styles.maid} numberOfLines={1}>
              {booking.maid}
            </Text>
            <View style={[styles.badge, { backgroundColor: `${status.ink}18` }]}>
              <Text style={[styles.badgeText, { color: status.ink }]}>{status.label}</Text>
            </View>
          </View>

          <View style={styles.addrRow}>
            <Ionicons name="location-outline" size={11} color={colors.mutedLight} />
            <Text style={styles.addr} numberOfLines={1}>
              {booking.address}
            </Text>
          </View>

          {booking.bookingRef ? (
            <View style={styles.ref}>
              <Ionicons name="receipt-outline" size={11} color={colors.primary} />
              <Text style={styles.refText}>{booking.bookingRef}</Text>
            </View>
          ) : null}

          {booking.status === 'upcoming' && booking.completionOtp ? (
            <View style={styles.otpStrip}>
              <Ionicons name="key-outline" size={12} color={colors.primaryDark} />
              <Text style={styles.otpLabel}>Completion OTP</Text>
              <Text style={styles.otpCode}>{booking.completionOtp}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {showRebook && booking.status === 'completed' ? (
        <View style={styles.actions}>
          <Pressable
            style={styles.rateBtn}
            onPress={() => openRate(booking.id)}
            accessibilityRole="button"
          >
            <Ionicons
              name={booking.reviewedAt ? 'star' : 'star-outline'}
              size={14}
              color={booking.reviewedAt ? '#F79009' : colors.inkSecondary}
            />
            <Text style={styles.rateText}>{booking.reviewedAt ? 'Review' : 'Rate'}</Text>
          </Pressable>
          <Pressable
            style={styles.rebookBtn}
            onPress={() => rebook(booking.service)}
            accessibilityRole="button"
          >
            <LinearGradient colors={['#0B6E67', '#084F4A']} style={styles.rebookGrad}>
              <Ionicons name="refresh" size={14} color={colors.white} />
              <Text style={styles.rebookText}>Rebook same pro</Text>
            </LinearGradient>
          </Pressable>
        </View>
      ) : null}

      {booking.status === 'cancelled' ? (
        <Pressable style={styles.bookAgain} onPress={() => rebook(booking.service)} accessibilityRole="button">
          <Text style={styles.bookAgainText}>Book again</Text>
          <Ionicons name="arrow-forward" size={13} color={colors.primary} />
        </Pressable>
      ) : null}

      <Text style={styles.index}>{String(index + 1).padStart(2, '0')}</Text>
    </AnimatedPress>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: layout.pad,
    marginBottom: spacing.md,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  row: { flexDirection: 'row', gap: spacing.md },
  thumbWrap: { position: 'relative' },
  thumb: { width: 72, height: 88 },
  statusDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.white,
  },
  main: { flex: 1, gap: 5, minWidth: 0 },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  price: {
    fontFamily: fonts.extraBold,
    fontSize: 17,
    color: colors.primary,
    letterSpacing: -0.3,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
  },
  proRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: fonts.extraBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
  maid: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.inkSecondary,
  },
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
  },
  addrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addr: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.muted,
  },
  ref: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 2,
  },
  refText: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    color: colors.primaryDark,
  },
  otpStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: '#E6F4F2',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.15)',
  },
  otpLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.primaryDark,
  },
  otpCode: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: colors.primaryDark,
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(15,20,25,0.06)',
  },
  rateBtn: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: radius.pill,
    paddingVertical: 11,
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  rateText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.inkSecondary,
  },
  rebookBtn: {
    flex: 1.4,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  rebookGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
  },
  rebookText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
  },
  bookAgain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(15,20,25,0.06)',
  },
  bookAgainText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.primary,
  },
  index: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.md,
    fontFamily: fonts.extraBold,
    fontSize: 28,
    color: 'rgba(15,20,25,0.04)',
    letterSpacing: -1,
  },
});
