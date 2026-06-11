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
    gradient: ['#F0FAF9', '#F6FDFB', '#FFFFFF'] as const,
    ink: '#0B6E67',
    accent: '#12A598',
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
  rateHighlight,
  compact,
  colW,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  primary?: boolean;
  rateHighlight?: boolean;
  compact?: boolean;
  colW: number;
}) {
  const highlighted = primary || rateHighlight;
  return (
    <Pressable
      style={[
        styles.quickTile,
        highlighted && styles.quickTilePrimary,
        rateHighlight && styles.quickTileRate,
        { width: colW },
      ]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {highlighted ? (
        <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={StyleSheet.absoluteFill} />
      ) : null}
      <Ionicons
        name={icon}
        size={compact ? 16 : 18}
        color={highlighted ? colors.white : colors.primaryDark}
      />
      <Text
        style={[styles.quickTileText, highlighted && styles.quickTileTextPrimary]}
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

function CompletedQuickActions({
  booking,
  compact,
  quickColW,
  onRate,
  onRebook,
  onOpenDetail,
}: {
  booking: DemoBooking;
  compact: boolean;
  quickColW: number;
  onRate: () => void;
  onRebook: () => void;
  onOpenDetail: () => void;
}) {
  if (booking.status !== 'completed') return null;

  const needsRate = !booking.reviewedAt;
  const gridColW = needsRate ? quickColW : (quickColW * 3 + QUICK_GAP * 2 - QUICK_GAP) / 2;

  return (
    <View style={styles.actionsBlock}>
      <Pressable
        style={[styles.rateHero, needsRate && styles.rateHeroHighlight]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onRate();
        }}
        accessibilityRole="button"
        accessibilityLabel={needsRate ? 'Rate your visit' : 'View your review'}
      >
        <LinearGradient
          colors={
            needsRate
              ? ['#084F4A', '#0B6E67', '#12A598']
              : ['#ECFDF5', '#F0FDF9', '#FFFFFF']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.trackHeroLeft}>
          <View style={[styles.trackIcon, !needsRate && styles.rateHeroIconRated]}>
            <Ionicons
              name="star"
              size={18}
              color={needsRate ? colors.star : colors.success}
            />
          </View>
          <View style={styles.trackCopy}>
            <Text style={[styles.trackTitle, !needsRate && styles.rateHeroTitleRated]}>
              {needsRate ? 'Rate your visit' : 'View your review'}
            </Text>
            <Text
              style={[styles.trackSub, !needsRate && styles.rateHeroSubRated]}
              numberOfLines={1}
            >
              {needsRate
                ? `${booking.maid} · ${booking.service} · 30 sec`
                : `${booking.reviewRating ?? ''}★ · ${booking.maid}`}
            </Text>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={needsRate ? colors.white : colors.primary}
        />
      </Pressable>

      <View style={styles.quickGrid}>
        {needsRate ? (
          <QuickAction
            icon="star-outline"
            label="Rate"
            compact={compact}
            colW={gridColW}
            rateHighlight
            onPress={onRate}
          />
        ) : null}
        <QuickAction
          icon="refresh"
          label="Rebook"
          compact={compact}
          colW={gridColW}
          onPress={onRebook}
        />
        <QuickAction
          icon="open-outline"
          label="Open"
          compact={compact}
          colW={gridColW}
          primary={!needsRate}
          onPress={onOpenDetail}
        />
      </View>
    </View>
  );
}

function UpcomingBookingCard({
  booking,
  index,
  showQuickActions,
  compact,
  quickColW,
  openDetail,
  openTrack,
  openReschedule,
  openSupport,
  openProProfile,
}: {
  booking: DemoBooking;
  index: number;
  showQuickActions?: boolean;
  compact: boolean;
  quickColW: number;
  openDetail: (id: string) => void;
  openTrack: (id: string) => void;
  openReschedule: (id: string) => void;
  openSupport: (opts: { chat: boolean; topic: string }) => void;
  openProProfile: (id: string, opts: { name: string; bookingId: string; status: DemoBooking['status'] }) => void;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const initial = booking.maid.charAt(0);
  const imageId = getBookingImageId(booking.service);

  return (
    <AnimatedView style={[styles.upcomingCard, anim]}>
      <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={styles.upcomingStripe} />

      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.985, { damping: 16, stiffness: 360 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 16, stiffness: 360 });
        }}
        onPress={() => openDetail(booking.id)}
        accessibilityRole="button"
        accessibilityLabel={`${booking.service}, upcoming visit`}
      >
        <View style={styles.upcomingVisual}>
          <HomePhoto uri={getServiceImages(imageId)} style={styles.upcomingPhoto} overlay="none" />
          <LinearGradient
            colors={['rgba(1,15,14,0.05)', 'rgba(1,15,14,0.55)', 'rgba(1,15,14,0.88)']}
            locations={[0.1, 0.55, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.upcomingVisualTop}>
            <View style={styles.upcomingLivePill}>
              <View style={styles.liveDot} />
              <Text style={styles.upcomingLiveText}>Upcoming visit</Text>
            </View>
            <Text style={styles.upcomingIndex}>{String(index + 1).padStart(2, '0')}</Text>
          </View>
          <View style={styles.upcomingVisualBottom}>
            <Text style={styles.upcomingService} numberOfLines={2}>
              {booking.service}
            </Text>
            <Text style={styles.upcomingPrice}>{booking.price}</Text>
          </View>
        </View>

        <View style={styles.upcomingBody}>
          <View style={styles.slotChip}>
            <Ionicons name="calendar-outline" size={13} color={colors.primaryDark} />
            <Text style={styles.slotText}>{booking.date}</Text>
            <View style={styles.slotDivider} />
            <Ionicons name="time-outline" size={13} color={colors.primaryDark} />
            <Text style={styles.slotText}>{booking.time}</Text>
            {booking.duration ? (
              <>
                <View style={styles.slotDivider} />
                <Text style={styles.slotMuted}>{booking.duration}</Text>
              </>
            ) : null}
          </View>

          <Pressable
            style={styles.proMiniCard}
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
            <View style={styles.proMiniAvatar}>
              <Text style={styles.proMiniInitial}>{initial}</Text>
            </View>
            <View style={styles.proMiniCopy}>
              <Text style={styles.proMiniLabel}>ASSIGNED PRO</Text>
              <Text style={styles.proMiniName} numberOfLines={1}>
                {booking.maid}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.mutedLight} />
          </Pressable>

          <View style={styles.addrChip}>
            <Ionicons name="location-outline" size={12} color={colors.muted} />
            <Text style={styles.addrChipText} numberOfLines={compact ? 1 : 2}>
              {booking.address}
            </Text>
          </View>

          <View style={styles.upcomingMetaRow}>
            {booking.bookingRef ? (
              <View style={styles.refChip}>
                <Ionicons name="receipt-outline" size={11} color={colors.primaryDark} />
                <Text style={styles.refChipText} numberOfLines={1}>
                  {booking.bookingRef}
                </Text>
              </View>
            ) : null}
            {booking.completionOtp ? (
              <View style={styles.otpChip}>
                <Ionicons name="key-outline" size={11} color={colors.primaryDark} />
                <Text style={styles.otpChipLabel}>OTP</Text>
                <Text style={styles.otpChipCode}>{booking.completionOtp}</Text>
              </View>
            ) : null}
          </View>

          {booking.maidAssignedAt ? (
            <View style={styles.confirmedChip}>
              <Ionicons name="checkmark-circle" size={12} color="#0B6E67" />
              <Text style={styles.confirmedChipText}>Pro confirmed · synced</Text>
            </View>
          ) : null}
        </View>
      </Pressable>

      {showQuickActions ? (
        <View style={styles.upcomingActions}>
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
        </View>
      ) : null}
    </AnimatedView>
  );
}

export function BookingCard({ booking, index, showRebook, showQuickActions }: BookingCardProps) {
  const { width, contentWidth } = useLayoutMetrics();
  const compact = width < 380;
  const cardInnerW = contentWidth - spacing.lg * 2;
  const quickColW = (cardInnerW - QUICK_GAP * 2) / 3;
  const isUpcoming = booking.status === 'upcoming';
  const isCompleted = booking.status === 'completed';
  const needsRating = isCompleted && !booking.reviewedAt;
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

  if (isUpcoming) {
    return (
      <UpcomingBookingCard
        booking={booking}
        index={index}
        showQuickActions={showQuickActions}
        compact={compact}
        quickColW={quickColW}
        openDetail={openDetail}
        openTrack={openTrack}
        openReschedule={openReschedule}
        openSupport={openSupport}
        openProProfile={openProProfile}
      />
    );
  }

  return (
    <AnimatedView
      style={[
        styles.card,
        needsRating && showQuickActions && styles.cardNeedsRate,
        anim,
      ]}
    >
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
              <View style={styles.refRow}>
                <View style={styles.ref}>
                  <Ionicons name="receipt-outline" size={11} color={colors.primary} />
                  <Text style={styles.refText} numberOfLines={1}>
                    {booking.bookingRef}
                  </Text>
                </View>
                {isCompleted ? (
                  <Pressable
                    style={[styles.refRateBtn, needsRating && styles.refRateBtnHighlight]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      openRate(booking.id);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={needsRating ? 'Rate your visit' : 'View your review'}
                  >
                    <Ionicons
                      name={booking.reviewedAt ? 'star' : 'star-outline'}
                      size={11}
                      color={needsRating ? colors.primary : colors.star}
                    />
                    <Text style={[styles.refRateText, needsRating && styles.refRateTextHighlight]}>
                      {needsRating ? 'Rate' : 'Rated'}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}

          </View>
        </View>
      </Pressable>

      {isCompleted && (showQuickActions || showRebook) ? (
        <CompletedQuickActions
          booking={booking}
          compact={compact}
          quickColW={quickColW}
          onRate={() => openRate(booking.id)}
          onRebook={() => rebook(booking.service)}
          onOpenDetail={() => openDetail(booking.id)}
        />
      ) : null}

      {booking.status === 'cancelled' ? (
        <View style={styles.cancelledActions}>
          <Pressable
            style={styles.cancelledPrimary}
            onPress={() => rebook(booking.service)}
            accessibilityRole="button"
          >
            <LinearGradient colors={['#084F4A', '#0B6E67']} style={StyleSheet.absoluteFill} />
            <Ionicons name="refresh" size={15} color={colors.white} />
            <Text style={styles.cancelledPrimaryText}>Book again</Text>
          </Pressable>
          <Pressable
            style={styles.cancelledGhost}
            onPress={() => openSupport({ chat: true, topic: `${booking.service} · cancelled` })}
            accessibilityRole="button"
          >
            <Ionicons name="chatbubble-ellipses-outline" size={15} color={colors.primaryDark} />
            <Text style={styles.cancelledGhostText}>Support</Text>
          </Pressable>
        </View>
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
  cardNeedsRate: {
    borderColor: 'rgba(11,110,103,0.18)',
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
  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginTop: 2,
    width: '100%',
  },
  ref: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  refText: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    color: colors.primaryDark,
    flexShrink: 1,
  },
  refRateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
    flexShrink: 0,
  },
  refRateBtnHighlight: {
    borderColor: 'rgba(11,110,103,0.28)',
    backgroundColor: '#E6F4F2',
  },
  refRateText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.muted,
  },
  refRateTextHighlight: {
    fontFamily: fonts.extraBold,
    color: colors.primaryDark,
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
  syncStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    maxWidth: '100%',
    backgroundColor: '#FFFBEB',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(180,83,9,0.2)',
  },
  syncText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: '#B45309',
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
  rateHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    padding: spacing.md,
    overflow: 'hidden',
    gap: spacing.sm,
  },
  rateHeroHighlight: {
    shadowColor: '#0B6E67',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  rateHeroIconRated: {
    backgroundColor: colors.successBg,
  },
  rateHeroTitleRated: {
    color: colors.primaryDark,
  },
  rateHeroSubRated: {
    color: colors.muted,
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
  quickTileRate: {
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
  upcomingCard: {
    marginHorizontal: layout.pad,
    marginBottom: spacing.md,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.14)',
    shadowColor: '#0B6E67',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  upcomingStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    zIndex: 2,
  },
  upcomingVisual: {
    height: 128,
    overflow: 'hidden',
    backgroundColor: '#084F4A',
  },
  upcomingPhoto: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  upcomingVisualTop: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  upcomingLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#6EE7B7',
  },
  upcomingLiveText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.white,
    letterSpacing: 0.4,
  },
  upcomingIndex: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: 'rgba(255,255,255,0.22)',
    letterSpacing: -0.5,
  },
  upcomingVisualBottom: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.sm,
    zIndex: 2,
  },
  upcomingService: {
    flex: 1,
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: -0.4,
    lineHeight: 22,
  },
  upcomingPrice: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: '#6EE7B7',
    letterSpacing: -0.3,
    flexShrink: 0,
  },
  upcomingBody: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  upcomingActions: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    backgroundColor: '#F0FAF9',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  slotText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.inkSecondary,
  },
  slotMuted: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
  },
  slotDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(11,110,103,0.15)',
  },
  proMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  proMiniAvatar: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  proMiniInitial: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    color: colors.primaryDark,
  },
  proMiniCopy: { flex: 1, gap: 1, minWidth: 0 },
  proMiniLabel: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.8,
  },
  proMiniName: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  addrChip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    minWidth: 0,
  },
  addrChipText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 15,
  },
  upcomingMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  refChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxWidth: '58%',
  },
  refChipText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.primaryDark,
    flexShrink: 1,
  },
  otpChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F4F2',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.15)',
  },
  otpChipLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.primaryDark,
  },
  otpChipCode: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: colors.primaryDark,
    letterSpacing: 1.2,
  },
  confirmedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#F0FAF9',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  confirmedChipText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: '#0B6E67',
  },
  cancelledActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(15,20,25,0.06)',
  },
  cancelledPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radius.lg,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  cancelledPrimaryText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.white,
  },
  cancelledGhost: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radius.lg,
    paddingVertical: 12,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  cancelledGhostText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.primaryDark,
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
