import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import type { DemoBooking } from '@/constants/demo';
import { HomePhoto } from '@/features/home/components/HomePhoto';
import { getServiceImages } from '@/features/home/constants/unsplash.images';
import { useOpenSupport } from '@/features/help/hooks/useOpenSupport';
import { resolveMaidId } from '../lib/maid.profile';
import { useOpenProProfile } from '@/features/pro/hooks/useOpenProProfile';
import { useOpenBookingDetail } from '../hooks/useOpenBookingDetail';
import { useOpenRateBooking } from '../hooks/useOpenRateBooking';
import { useOpenReschedule } from '../hooks/useOpenReschedule';
import { useOpenTrackBooking } from '../hooks/useOpenTrackBooking';
import { useRebookBooking } from '../hooks/useRebookBooking';
import { getBookingImageId } from '../utils/bookings.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { layout, radius, spacing } from '@/theme/spacing';

const AnimatedView = Animated.View;

const STATUS = {
  upcoming: {
    label: 'Upcoming',
    gradient: ['#EEF6FF', '#F8FBFF', '#FFFFFF'] as const,
    ink: '#175CD3',
    accent: '#175CD3',
    stripe: ['#084F4A', '#0B6E67', '#12A598'] as const,
  },
  completed: {
    label: 'Completed',
    gradient: ['#ECFDF5', '#FFFFFF'] as const,
    ink: '#027A48',
    accent: colors.primary,
    stripe: ['#027A48', '#059669'] as const,
  },
  cancelled: {
    label: 'Cancelled',
    gradient: ['#FEF3F2', '#FFFFFF'] as const,
    ink: '#D92D20',
    accent: '#D92D20',
    stripe: ['#D92D20', '#B42318'] as const,
  },
};

const QUICK_GAP = spacing.sm;

interface BookingCardProps {
  booking: DemoBooking;
  index: number;
  showRebook?: boolean;
  showQuickActions?: boolean;
}

function QuickAction({
  icon,
  label,
  onPress,
  primary,
  compact,
  colW,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  primary?: boolean;
  compact?: boolean;
  colW: number;
}) {
  return (
    <Pressable
      style={[styles.quickTile, primary && styles.quickTilePrimary, { width: colW }]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {primary ? (
        <LinearGradient colors={['#084F4A', '#0B6E67']} style={StyleSheet.absoluteFill} />
      ) : null}
      <Ionicons name={icon} size={compact ? 16 : 18} color={primary ? colors.white : colors.primaryDark} />
      <Text
        style={[styles.quickTileText, primary && styles.quickTileTextPrimary]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {compact && label === 'Reschedule' ? 'Resched' : label}
      </Text>
    </Pressable>
  );
}

function UpcomingQuickActions({
  service,
  maid,
  compact,
  quickColW,
  onOpenDetail,
  onTrack,
  onReschedule,
  onMessage,
}: {
  service: string;
  maid: string;
  compact: boolean;
  quickColW: number;
  onOpenDetail: () => void;
  onTrack: () => void;
  onReschedule: () => void;
  onMessage: () => void;
}) {
  return (
    <View style={styles.actionsBlock}>
      <Pressable
        style={styles.trackHero}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onTrack();
        }}
        accessibilityRole="button"
        accessibilityLabel="Track pro live"
      >
        <LinearGradient
          colors={['#084F4A', '#0B6E67', '#12A598']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.trackHeroLeft}>
          <View style={styles.trackIcon}>
            <Ionicons name="navigate" size={18} color={colors.primaryDark} />
          </View>
          <View style={styles.trackCopy}>
            <Text style={styles.trackTitle}>Track pro live</Text>
            <Text style={styles.trackSub} numberOfLines={1}>
              {maid} · {service}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.white} />
      </Pressable>

      <View style={styles.quickGrid}>
        <QuickAction
          icon="calendar-outline"
          label="Reschedule"
          compact={compact}
          colW={quickColW}
          onPress={onReschedule}
        />
        <QuickAction icon="chatbubble-ellipses-outline" label="Message" compact={compact} colW={quickColW} onPress={onMessage} />
        <QuickAction icon="open-outline" label="Open" compact={compact} colW={quickColW} primary onPress={onOpenDetail} />
      </View>
    </View>
  );
}

export function BookingCard({ booking, index, showRebook, showQuickActions }: BookingCardProps) {
  const { width, contentWidth } = useLayoutMetrics();
  const compact = width < 380;
  const cardInnerW = contentWidth - spacing.lg * 2;
  const quickColW = (cardInnerW - QUICK_GAP * 2) / 3;
  const isUpcoming = booking.status === 'upcoming';
  const openDetail = useOpenBookingDetail();
  const openRate = useOpenRateBooking();
  const openTrack = useOpenTrackBooking();
  const openReschedule = useOpenReschedule();
  const openSupport = useOpenSupport();
  const rebook = useRebookBooking();
  const openProProfile = useOpenProProfile();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const status = STATUS[booking.status];
  const initial = booking.maid.charAt(0);
  const imageId = getBookingImageId(booking.service);
  const thumbW = compact ? 64 : 72;
  const thumbH = compact ? 78 : 88;

  return (
    <AnimatedView style={[styles.card, isUpcoming && showQuickActions && styles.cardUpcoming, anim]}>
      <LinearGradient colors={[...status.stripe]} style={styles.stripe} />
      <LinearGradient colors={[...status.gradient]} style={StyleSheet.absoluteFill} />

      <Pressable
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
        <View style={styles.row}>
          <View style={styles.thumbWrap}>
            <HomePhoto
              uri={getServiceImages(imageId)}
              style={{ width: thumbW, height: thumbH, borderRadius: radius.lg }}
              overlay="none"
              borderRadius={radius.lg}
            />
            <View style={[styles.statusDot, { backgroundColor: status.accent }]} />
          </View>

          <View style={styles.main}>
            <View style={styles.head}>
              <Text style={styles.name} numberOfLines={2}>
                {booking.service}
              </Text>
              <Text style={styles.price} numberOfLines={1}>
                {booking.price}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={12} color={colors.muted} />
              <Text style={styles.meta} numberOfLines={1}>
                {booking.date} · {booking.time}
              </Text>
            </View>

            <Pressable
              style={styles.proRow}
              onPress={() => {
                Haptics.selectionAsync();
                openProProfile(resolveMaidId(booking.maid, booking.maidId), {
                  name: booking.maid,
                  bookingId: booking.id,
                  status: booking.status,
                });
              }}
              accessibilityRole="button"
              accessibilityLabel={`View ${booking.maid} profile`}
            >
              <View style={styles.avatar}>
                <Text style={styles.initial}>{initial}</Text>
              </View>
              <Text style={styles.maid} numberOfLines={1}>
                {booking.maid}
              </Text>
              <Ionicons name="chevron-forward" size={12} color={colors.mutedLight} />
              <View style={[styles.badge, { backgroundColor: `${status.ink}18` }]}>
                <Text style={[styles.badgeText, { color: status.ink }]}>{status.label}</Text>
              </View>
            </Pressable>

            <View style={styles.addrRow}>
              <Ionicons name="location-outline" size={11} color={colors.mutedLight} />
              <Text style={styles.addr} numberOfLines={compact ? 1 : 2}>
                {booking.address}
              </Text>
            </View>

            {booking.bookingRef ? (
              <View style={styles.ref}>
                <Ionicons name="receipt-outline" size={11} color={colors.primary} />
                <Text style={styles.refText} numberOfLines={1}>
                  {booking.bookingRef}
                </Text>
              </View>
            ) : null}

            {isUpcoming && booking.completionOtp ? (
              <View style={styles.otpStrip}>
                <Ionicons name="key-outline" size={12} color={colors.primaryDark} />
                <Text style={styles.otpLabel}>OTP</Text>
                <Text style={styles.otpCode}>{booking.completionOtp}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>

      {showQuickActions && isUpcoming ? (
        <UpcomingQuickActions
          service={booking.service}
          maid={booking.maid}
          compact={compact}
          quickColW={quickColW}
          onOpenDetail={() => openDetail(booking.id)}
          onTrack={() => openTrack(booking.id)}
          onReschedule={() => openReschedule(booking.id)}
          onMessage={() => openSupport({ chat: true, topic: `${booking.service} · ${booking.maid}` })}
        />
      ) : null}

      {showRebook && booking.status === 'completed' ? (
        <View style={styles.actions}>
          <Pressable style={styles.rateBtn} onPress={() => openRate(booking.id)} accessibilityRole="button">
            <Ionicons
              name={booking.reviewedAt ? 'star' : 'star-outline'}
              size={14}
              color={booking.reviewedAt ? '#F79009' : colors.inkSecondary}
            />
            <Text style={styles.rateText}>{booking.reviewedAt ? 'Review' : 'Rate'}</Text>
          </Pressable>
          <Pressable style={styles.rebookBtn} onPress={() => rebook(booking.service)} accessibilityRole="button">
            <LinearGradient colors={['#0B6E67', '#084F4A']} style={styles.rebookGrad}>
              <Ionicons name="refresh" size={14} color={colors.white} />
              <Text style={styles.rebookText} numberOfLines={1}>
                Rebook same pro
              </Text>
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
    </AnimatedView>
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
    backgroundColor: colors.white,
  },
  cardUpcoming: {
    borderColor: 'rgba(11,110,103,0.14)',
    shadowColor: '#0B6E67',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  stripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  thumbWrap: { position: 'relative', flexShrink: 0 },
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
    minWidth: 0,
  },
  price: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.primary,
    letterSpacing: -0.3,
    flexShrink: 0,
    maxWidth: '38%',
    textAlign: 'right',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: 0 },
  meta: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
  },
  proRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
    minWidth: 0,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
    minWidth: 0,
  },
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
  },
  addrRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    minWidth: 0,
  },
  addr: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.muted,
    lineHeight: 14,
  },
  ref: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    maxWidth: '100%',
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
    flexShrink: 1,
  },
  otpStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    maxWidth: '100%',
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
  actionsBlock: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(15,20,25,0.08)',
  },
  trackHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    padding: spacing.md,
    overflow: 'hidden',
    gap: spacing.sm,
  },
  trackHeroLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 0,
  },
  trackIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  trackCopy: { flex: 1, gap: 1, minWidth: 0 },
  trackTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  trackSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.78)',
  },
  quickGrid: {
    flexDirection: 'row',
    gap: QUICK_GAP,
    width: '100%',
  },
  quickTile: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 11,
    paddingHorizontal: 4,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.1)',
    overflow: 'hidden',
  },
  quickTilePrimary: {
    borderColor: colors.primary,
  },
  quickTileText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.primaryDark,
    textAlign: 'center',
    width: '100%',
  },
  quickTileTextPrimary: {
    color: colors.white,
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
    minWidth: 0,
  },
  rebookGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: spacing.sm,
  },
  rebookText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
    flexShrink: 1,
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
    top: spacing.sm + 4,
    right: spacing.md,
    fontFamily: fonts.extraBold,
    fontSize: 28,
    color: 'rgba(15,20,25,0.04)',
    letterSpacing: -1,
  },
});
