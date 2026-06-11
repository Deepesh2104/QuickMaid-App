import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingDetailSkeleton } from '@/components/ui/Skeleton';
import type { BookingStatus, DemoBooking } from '@/constants/demo';
import { formatInr } from '@/features/checkout/lib/checkout.utils';
import { HomePhoto } from '@/features/home/components/HomePhoto';
import { getServiceImages } from '@/features/home/constants/unsplash.images';
import { useOpenCancelBooking } from '../hooks/useOpenCancelBooking';
import { useOpenRateBooking } from '../hooks/useOpenRateBooking';
import { useOpenReschedule } from '../hooks/useOpenReschedule';
import { useOpenBookingDocument } from '../hooks/useOpenBookingDocument';
import { useOpenSupport } from '@/features/help/hooks/useOpenSupport';
import { useOpenBookingDispute } from '@/features/support/hooks/useOpenBookingDispute';
import { useOpenTrackBooking } from '../hooks/useOpenTrackBooking';
import { usePartnerLivePing } from '../hooks/usePartnerLivePing';
import { usePendingVisitComplete } from '../hooks/usePendingVisitComplete';
import { useRebookBooking } from '../hooks/useRebookBooking';
import {
  getBookingStatusForRef,
  syncBookingsFromPartnerStatusBridge,
} from '@/lib/booking-status-bridge.storage';
import type { BookingStatusBridgeEntry } from '../../../../shared/booking-status-bridge';
import { getBookingById } from '../lib/booking.lookup';
import { buildLiveTimeline, timelineProgress } from '../lib/booking.timeline';
import { resolveMaidProfile } from '../lib/maid.profile';
import { getBookingImageId } from '../utils/bookings.utils';
import { BookingLiveLocationCard } from './BookingLiveLocationCard';
import { BookingPartnerDeclinedCard } from './BookingPartnerDeclinedCard';
import { useOpenProProfile } from '@/features/pro/hooks/useOpenProProfile';
import { BookingRefundStatusCard } from './BookingRefundStatusCard';
import { BookingReviewSubmittedCard } from './BookingReviewSubmittedCard';
import { BookingVisitCompleteModal } from './BookingVisitCompleteModal';
import { BookingVisitCompletedCard } from './BookingVisitCompletedCard';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const VISUAL_H = 196;

const STATUS_THEME: Record<
  BookingStatus,
  { label: string; ink: string; tone: string; icon: keyof typeof Ionicons.glyphMap; accent: string }
> = {
  upcoming: { label: 'Upcoming visit', ink: '#175CD3', tone: '#EEF6FF', icon: 'time-outline', accent: '#3B82F6' },
  completed: { label: 'Visit completed', ink: '#027A48', tone: '#ECFDF5', icon: 'checkmark-circle', accent: '#10B981' },
  cancelled: { label: 'Cancelled', ink: '#D92D20', tone: '#FEF3F2', icon: 'close-circle', accent: '#EF4444' },
};

const ACTIONS: Record<
  BookingStatus,
  { id: string; icon: keyof typeof Ionicons.glyphMap; label: string; sub: string; primary?: boolean }[]
> = {
  upcoming: [
    { id: 'track', icon: 'locate-outline', label: 'Track pro', sub: 'Live location' },
    { id: 'reschedule', icon: 'calendar-outline', label: 'Reschedule', sub: 'Change slot' },
    { id: 'cancel', icon: 'close-circle-outline', label: 'Cancel', sub: 'Free window' },
    { id: 'help', icon: 'chatbubble-ellipses-outline', label: 'Support', sub: '24×7 help', primary: true },
  ],
  completed: [
    { id: 'invoice', icon: 'document-text-outline', label: 'Invoice', sub: 'Tax invoice' },
    { id: 'receipt', icon: 'receipt-outline', label: 'Receipt', sub: 'Payment proof' },
    { id: 'rate', icon: 'star-outline', label: 'Rate visit', sub: 'Share feedback', primary: true },
    { id: 'dispute', icon: 'alert-circle-outline', label: 'Report issue', sub: 'File dispute' },
    { id: 'help', icon: 'chatbubble-ellipses-outline', label: 'Support', sub: 'Live chat' },
  ],
  cancelled: [
    { id: 'rebook', icon: 'refresh', label: 'Book again', sub: 'Same service', primary: true },
    { id: 'help', icon: 'chatbubble-ellipses-outline', label: 'Support', sub: '24×7 help' },
  ],
};

function SectionBlock({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      {eyebrow ? (
        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowDot} />
          <Text style={styles.eyebrow}>{eyebrow}</Text>
        </View>
      ) : null}
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={[styles.detailRow, highlight && styles.detailRowHighlight]}>
      <View style={[styles.detailIcon, highlight && styles.detailIconHighlight]}>
        <Ionicons name={icon} size={16} color={highlight ? colors.white : colors.primaryDark} />
      </View>
      <View style={styles.detailCopy}>
        <Text style={[styles.detailLabel, highlight && styles.detailLabelHighlight]}>{label}</Text>
        <Text style={[styles.detailValue, highlight && styles.detailValueHighlight]}>{value}</Text>
      </View>
    </View>
  );
}

export function BookingDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const narrow = width < 360;
  const actionW = (width - layout.pad * 2 - spacing.sm) / 2;
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<DemoBooking | null>(null);
  const [bridgeStatus, setBridgeStatus] = useState<BookingStatusBridgeEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const { payload, visible, checkPending, dismiss } = usePendingVisitComplete();
  const openProProfile = useOpenProProfile();
  const openReschedule = useOpenReschedule();
  const openCancel = useOpenCancelBooking();
  const openRate = useOpenRateBooking();
  const openTrack = useOpenTrackBooking();
  const livePing = usePartnerLivePing(booking?.bookingRef, booking?.status === 'upcoming');
  const openDocument = useOpenBookingDocument();
  const openSupport = useOpenSupport();
  const openDispute = useOpenBookingDispute();
  const rebook = useRebookBooking();

  const loadBooking = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    await syncBookingsFromPartnerStatusBridge();
    const b = await getBookingById(id);
    setBooking(b ?? null);
    if (b?.bookingRef) {
      setBridgeStatus(await getBookingStatusForRef(b.bookingRef));
    } else {
      setBridgeStatus(null);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (!booking?.bookingRef) return;
    const poll = async () => {
      setBridgeStatus(await getBookingStatusForRef(booking.bookingRef!));
    };
    const id = setInterval(() => void poll(), 8_000);
    return () => clearInterval(id);
  }, [booking?.bookingRef]);

  useEffect(() => {
    void loadBooking();
  }, [loadBooking]);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        await loadBooking();
        await checkPending();
      })();
    }, [loadBooking, checkPending]),
  );

  const copyRef = async (ref: string) => {
    await Clipboard.setStringAsync(ref);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (loading) {
    return <BookingDetailSkeleton />;
  }

  if (!booking) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <View style={styles.emptyIcon}>
          <Ionicons name="calendar-outline" size={32} color={colors.muted} />
        </View>
        <Text style={styles.emptyTitle}>Booking not found</Text>
        <Text style={styles.emptySub}>This order may have been removed or the link expired.</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const theme = STATUS_THEME[booking.status];
  const maidProfile = resolveMaidProfile(booking);
  const imageId = getBookingImageId(booking.service);
  const timeline = buildLiveTimeline(booking, bridgeStatus, Boolean(livePing));
  const progress = timelineProgress(timeline);
  const needsRating = booking.status === 'completed' && !booking.reviewedAt;
  const actions = ACTIONS[booking.status]
    .map((a) =>
      a.id === 'rate' && booking.reviewedAt
        ? { ...a, label: 'View review', sub: `${booking.reviewRating ?? ''}★ submitted`, icon: 'star' as const }
        : a,
    )
    .sort((a, b) => {
      if (!needsRating) return 0;
      if (a.id === 'rate') return -1;
      if (b.id === 'rate') return 1;
      return 0;
    })
    .map((a) =>
      a.id === 'rate' && needsRating
        ? { ...a, primary: true, rateHighlight: true as const }
        : a,
    );

  const onAction = (actionId: string) => {
    Haptics.selectionAsync();
    if (actionId === 'reschedule') openReschedule(booking.id);
    if (actionId === 'cancel') openCancel(booking.id);
    if (actionId === 'rate' && booking.status === 'completed') openRate(booking.id);
    if (actionId === 'track') openTrack(booking.id);
    if (actionId === 'invoice') openDocument(booking.id, 'invoice');
    if (actionId === 'receipt') openDocument(booking.id, 'receipt');
    if (actionId === 'rebook') rebook(booking.service);
    if (actionId === 'dispute') openDispute(booking.id);
    if (actionId === 'help') {
      openSupport({
        chat: true,
        topic: 'booking',
        bookingId: booking.id,
      });
    }
  };

  const shareBooking = async () => {
    try {
      await Share.share({
        message: [
          `QuickMaid booking ${booking.bookingRef ?? booking.id}`,
          `${booking.service} · ${booking.date} ${booking.time}`,
          booking.address,
          booking.status === 'upcoming' && booking.completionOtp
            ? `Visit OTP: ${booking.completionOtp}`
            : '',
        ]
          .filter(Boolean)
          .join('\n'),
      });
    } catch {
      // dismissed
    }
  };

  const shareOtp = async () => {
    if (!booking.completionOtp) return;
    try {
      await Share.share({
        message: `QuickMaid visit OTP for ${booking.maid}: ${booking.completionOtp}\nBooking ${booking.bookingRef ?? booking.id}`,
      });
    } catch {
      // dismissed
    }
  };

  const hasPayment = booking.amountPaid !== undefined || booking.paymentLabel;
  const showVisitOtp = booking.status === 'upcoming' && Boolean(booking.completionOtp);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#010F0E', '#084F4A', '#0B6E67', '#12A598']}
        locations={[0, 0.28, 0.62, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerRow}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>BOOKING DETAIL</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {booking.service}
            </Text>
          </View>
          <Pressable style={styles.headerBtn} onPress={() => void shareBooking()} accessibilityLabel="Share booking">
            <Ionicons name="share-outline" size={20} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Ionicons name="calendar-outline" size={13} color="#6EE7B7" />
            <Text style={styles.headerStatVal} numberOfLines={1}>
              {booking.date}
            </Text>
            <Text style={styles.headerStatLbl}>Date</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Ionicons name="time-outline" size={13} color="#6EE7B7" />
            <Text style={styles.headerStatVal}>{booking.time}</Text>
            <Text style={styles.headerStatLbl}>Slot</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Ionicons name="hourglass-outline" size={13} color="#6EE7B7" />
            <Text style={styles.headerStatVal} numberOfLines={1}>
              {booking.duration ?? '—'}
            </Text>
            <Text style={styles.headerStatLbl}>Duration</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Ionicons name="cash-outline" size={13} color="#FCD34D" />
            <Text style={styles.headerStatVal}>{booking.price}</Text>
            <Text style={styles.headerStatLbl}>Paid</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + (booking.status === 'upcoming' ? 130 : 40) }}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.visualCard}>
            <HomePhoto uri={getServiceImages(imageId)} style={styles.visualImg} overlay="none" />
            <LinearGradient
              colors={['transparent', 'rgba(1,15,14,0.55)', 'rgba(1,15,14,0.88)']}
              locations={[0.2, 0.65, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.visualBadge}>
              <Ionicons name={booking.icon} size={14} color={colors.primaryDark} />
              <Text style={styles.visualBadgeText}>{booking.service}</Text>
            </View>
            <View style={styles.visualBottom}>
              <View style={[styles.statusPill, { backgroundColor: theme.tone }]}>
                <Ionicons name={theme.icon} size={12} color={theme.ink} />
                <Text style={[styles.statusText, { color: theme.ink }]}>{theme.label}</Text>
              </View>
              <View style={styles.progressWrap}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme.accent }]} />
                </View>
                <Text style={styles.progressLbl}>{progress}% complete</Text>
              </View>
            </View>
          </View>

          <LinearGradient colors={['#FFFFFF', '#F8FDFC']} style={styles.summaryCard}>
            <View style={styles.summaryTop}>
              <View style={styles.summaryCopy}>
                <Text style={styles.summaryEyebrow}>BOOKING REFERENCE</Text>
                <Text style={styles.summaryRef}>{booking.bookingRef ?? booking.id}</Text>
              </View>
              <View style={styles.summaryTopRight}>
                <Pressable
                  style={styles.copyBtn}
                  onPress={() => void copyRef(booking.bookingRef ?? booking.id)}
                  accessibilityLabel="Copy booking reference"
                >
                  <Ionicons name="copy-outline" size={14} color={colors.primaryDark} />
                </Pressable>
                {booking.status === 'completed' ? (
                  <Pressable
                    style={[styles.rateRefBtn, needsRating && styles.rateRefBtnHighlight]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      openRate(booking.id);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={needsRating ? 'Rate your visit' : 'View your review'}
                  >
                    <Ionicons
                      name={booking.reviewedAt ? 'star' : 'star-outline'}
                      size={14}
                      color={needsRating ? colors.primary : colors.star}
                    />
                    <Text style={[styles.rateRefText, needsRating && styles.rateRefTextHighlight]}>
                      {needsRating ? 'Rate' : 'Rated'}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryBottom}>
              <View style={styles.summaryLeft}>
                <Text style={styles.summaryAmountLbl}>Total amount</Text>
                <Text
                  style={[styles.summaryAmount, narrow && styles.summaryAmountNarrow]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                >
                  {booking.price}
                </Text>
                {booking.walletUsed && booking.walletUsed > 0 ? (
                  <View style={styles.walletChipInline}>
                    <Ionicons name="wallet-outline" size={11} color={colors.primaryDark} />
                    <Text style={styles.walletChipText} numberOfLines={1}>
                      {formatInr(booking.walletUsed)} wallet
                    </Text>
                  </View>
                ) : null}
              </View>
              {showVisitOtp ? (
                <View style={styles.summaryOtpCol}>
                  <Text style={styles.summaryOtpLbl}>Visit OTP</Text>
                  <View style={styles.summaryOtpRow}>
                    <Text
                      style={[
                        styles.summaryOtpCode,
                        narrow && styles.summaryOtpCodeNarrow,
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    >
                      {booking.completionOtp}
                    </Text>
                    <Pressable
                      style={styles.summaryOtpShare}
                      onPress={() => void shareOtp()}
                      accessibilityLabel="Share OTP"
                    >
                      <Ionicons name="share-outline" size={14} color={colors.primaryDark} />
                    </Pressable>
                  </View>
                </View>
              ) : booking.walletUsed && booking.walletUsed > 0 ? (
                <View style={styles.walletChip}>
                  <Ionicons name="wallet-outline" size={12} color={colors.primaryDark} />
                  <Text style={styles.walletChipText}>
                    {formatInr(booking.walletUsed)} wallet
                  </Text>
                </View>
              ) : null}
            </View>
          </LinearGradient>

          <Pressable
            style={styles.proCard}
            onPress={() => {
              openProProfile(maidProfile.id, {
                name: booking.maid,
                bookingId: booking.id,
                status: booking.status,
              });
            }}
            accessibilityRole="button"
            accessibilityLabel={`View ${booking.maid} profile`}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F4FBFA', '#EAF8F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.proTop}>
              <View style={styles.proAvatarRing}>
                <LinearGradient colors={['#6EE7B7', '#34D399']} style={styles.proAvatarGrad}>
                  <Text style={styles.proInitial}>{booking.maid.charAt(0)}</Text>
                </LinearGradient>
                {booking.status === 'upcoming' ? (
                  <View style={styles.proLive}>
                    <View style={styles.proLiveDot} />
                  </View>
                ) : null}
              </View>
              <View style={styles.proCopy}>
                <View style={styles.proLabelRow}>
                  <Text style={styles.proEyebrow}>ASSIGNED PRO</Text>
                  {maidProfile.badge ? (
                    <View style={styles.proBadge}>
                      <Ionicons name="ribbon" size={9} color="#B45309" />
                      <Text style={styles.proBadgeText}>{maidProfile.badge}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.proName} numberOfLines={1}>
                  {booking.maid}
                </Text>
                <View style={styles.proChips}>
                  <View style={styles.proChip}>
                    <Ionicons name="star" size={10} color={colors.star} />
                    <Text style={styles.proChipText}>{maidProfile.rating}</Text>
                  </View>
                  <View style={styles.proChip}>
                    <Ionicons name="briefcase-outline" size={10} color={colors.primaryDark} />
                    <Text style={styles.proChipText}>
                      {maidProfile.jobs.toLocaleString('en-IN')} jobs
                    </Text>
                  </View>
                  <View style={styles.proChip}>
                    <Ionicons name="timer-outline" size={10} color={colors.primaryDark} />
                    <Text style={styles.proChipText}>{maidProfile.onTimeRate}% on time</Text>
                  </View>
                </View>
              </View>
              {booking.status === 'upcoming' ? (
                <View style={styles.proActions}>
                  <Pressable
                    style={styles.proActionBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      openSupport({ chat: true, topic: `Message ${booking.maid}` });
                    }}
                  >
                    <Ionicons name="chatbubble-ellipses" size={16} color={colors.primaryDark} />
                  </Pressable>
                  <Pressable
                    style={[styles.proActionBtn, styles.proActionPrimary]}
                    onPress={(e) => {
                      e.stopPropagation();
                      openTrack(booking.id);
                    }}
                  >
                    <Ionicons name="navigate" size={16} color={colors.white} />
                  </Pressable>
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={18} color={colors.primaryDark} />
              )}
            </View>
            <View style={styles.proFooter}>
              <Ionicons name="person-circle-outline" size={14} color={colors.primary} />
              <Text style={styles.proFooterText}>View profile · ratings & feedback</Text>
              <Ionicons name="arrow-forward" size={12} color={colors.primary} />
            </View>
          </Pressable>
          {booking.status === 'completed' ? <BookingVisitCompletedCard booking={booking} /> : null}
          {booking.status === 'completed' && booking.reviewedAt ? (
            <BookingReviewSubmittedCard booking={booking} />
          ) : null}
          {booking.status === 'cancelled' ? <BookingRefundStatusCard booking={booking} /> : null}
          {booking.status === 'upcoming' ? <BookingPartnerDeclinedCard booking={booking} /> : null}
          <BookingLiveLocationCard booking={booking} />

          <SectionBlock eyebrow="VISIT" title="Where & when">
            <View style={styles.detailCard}>
              <DetailRow icon="location" label="Service address" value={booking.address} highlight />
              <View style={styles.detailSep} />
              <DetailRow icon="calendar-outline" label="Scheduled slot" value={`${booking.date} · ${booking.time}`} />
              <View style={styles.detailSep} />
              <DetailRow
                icon="hourglass-outline"
                label="Estimated duration"
                value={booking.duration ?? 'As per service package'}
              />
            </View>
          </SectionBlock>

          <SectionBlock eyebrow="LIVE STATUS" title="Status timeline">
            <View style={styles.timelineCard}>
              {timeline.map((step, i) => {
                const isLast = i === timeline.length - 1;
                const isActive = step.active ?? (!step.done && (i === 0 || timeline[i - 1]?.done));
                return (
                  <View key={step.id} style={styles.timelineRow}>
                    <View style={styles.timelineLeft}>
                      <View
                        style={[
                          styles.timelineDot,
                          step.done && styles.timelineDotDone,
                          isActive && !step.done && styles.timelineDotActive,
                        ]}
                      >
                        <Ionicons
                          name={step.done ? 'checkmark' : step.icon}
                          size={step.done ? 16 : 14}
                          color={step.done || isActive ? colors.white : colors.muted}
                        />
                      </View>
                      {!isLast ? (
                        <View style={[styles.timelineLine, step.done && styles.timelineLineDone]} />
                      ) : null}
                    </View>
                    <View style={[styles.timelineCopy, isActive && !step.done && styles.timelineCopyActive]}>
                      <Text
                        style={[
                          styles.timelineTitle,
                          step.done && styles.timelineTitleDone,
                          isActive && !step.done && styles.timelineTitleActive,
                        ]}
                      >
                        {step.title}
                      </Text>
                      <Text style={styles.timelineSub}>{step.sub}</Text>
                      {step.otpValue ? (
                        <View style={styles.timelineOtpRow}>
                          {step.otpValue.split('').map((digit, di) => (
                            <View key={`${step.id}-otp-${di}`} style={styles.timelineOtpDigit}>
                              <Text style={styles.timelineOtpDigitText}>{digit}</Text>
                            </View>
                          ))}
                        </View>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          </SectionBlock>

          {hasPayment ? (
            <SectionBlock eyebrow="PAYMENT" title="Payment summary">
              <View style={styles.paymentCard}>
                {booking.paymentLabel ? (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Method</Text>
                    <Text style={styles.paymentValue}>{booking.paymentLabel}</Text>
                  </View>
                ) : null}
                {booking.amountPaid !== undefined ? (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Amount paid</Text>
                    <Text style={styles.paymentValue}>{formatInr(booking.amountPaid)}</Text>
                  </View>
                ) : null}
                {booking.walletUsed && booking.walletUsed > 0 ? (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Wallet used</Text>
                    <Text style={styles.paymentValue}>{formatInr(booking.walletUsed)}</Text>
                  </View>
                ) : null}
                <Pressable
                  style={styles.receiptLink}
                  onPress={() => openDocument(booking.id, 'receipt')}
                >
                  <Ionicons name="receipt-outline" size={14} color={colors.primaryDark} />
                  <Text style={styles.receiptLinkText}>View payment receipt</Text>
                  <Ionicons name="chevron-forward" size={14} color={colors.muted} />
                </Pressable>
              </View>
            </SectionBlock>
          ) : null}

          <SectionBlock eyebrow="ACTIONS" title="Quick actions">
            <View style={styles.actionsGrid}>
              {actions.map((a) => {
                const rateHighlight = 'rateHighlight' in a && a.rateHighlight;
                return (
                <Pressable
                  key={a.id}
                  style={[
                    styles.actionCard,
                    { width: narrow ? '100%' : actionW },
                    a.primary && styles.actionCardPrimary,
                    rateHighlight && styles.actionCardRate,
                  ]}
                  onPress={() => onAction(a.id)}
                >
                  {a.primary ? (
                    <LinearGradient
                      colors={['#084F4A', '#0B6E67', '#12A598']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                  ) : null}
                  <View style={[styles.actionIcon, a.primary && styles.actionIconPrimary]}>
                    <Ionicons
                      name={a.icon}
                      size={18}
                      color={a.primary ? colors.white : colors.primaryDark}
                    />
                  </View>
                  <Text style={[styles.actionLabel, a.primary && styles.actionLabelPrimary]}>
                    {a.label}
                  </Text>
                  <Text style={[styles.actionSub, a.primary && styles.actionSubPrimary]}>
                    {a.sub}
                  </Text>
                </Pressable>
              );
              })}
            </View>
          </SectionBlock>

          <View style={styles.trustCard}>
            <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
            <Text style={styles.trustText}>
              Every pro is background-verified. Your OTP confirms job completion — QuickMaid never shares it publicly.
            </Text>
          </View>
        </View>
      </ScrollView>

      <BookingVisitCompleteModal
        visible={visible}
        payload={payload}
        onClose={dismiss}
        onRate={() => {
          const rateId = payload?.bookingId ?? booking.id;
          dismiss();
          openRate(rateId);
        }}
      />

      {booking.status === 'upcoming' ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
          {livePing ? (
            <View style={styles.footerLiveStrip}>
              <View style={styles.footerLiveDot} />
              <Text style={styles.footerLiveText}>
                GPS live · updated{' '}
                {new Date(livePing.recordedAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          ) : null}
          <View style={styles.footerRow}>
            <Pressable
              style={styles.footerSecondary}
              onPress={() => openSupport({ chat: true, topic: `Message ${booking.maid}` })}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primaryDark} />
              <Text style={styles.footerSecondaryText}>Message pro</Text>
            </Pressable>
            <Pressable style={styles.footerPrimary} onPress={() => openTrack(booking.id)}>
              <LinearGradient
                colors={
                  livePing
                    ? ['#010F0E', '#084F4A', '#12A598']
                    : ['#084F4A', '#0B6E67', '#12A598']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.footerPrimaryGrad}
              >
                <Ionicons name="navigate" size={18} color={colors.white} />
                <Text style={styles.footerPrimaryText}>
                  {livePing ? 'Open live map' : 'Track live'}
                </Text>
                <Ionicons name="arrow-forward" size={16} color={colors.white} />
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: '#F4F6F8',
  },
  loaderText: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },

  header: { paddingBottom: spacing.lg },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.pad,
    gap: spacing.md,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerCopy: { flex: 1, gap: 2 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: -0.3,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginHorizontal: layout.pad,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.15)',
  },
  headerStat: { flex: 1, alignItems: 'center', gap: 3, minWidth: 0 },
  headerStatVal: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.white,
    textAlign: 'center',
  },
  headerStatLbl: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  headerDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  sheet: {
    marginTop: -spacing.md,
    backgroundColor: '#F4F6F8',
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginBottom: spacing.xs,
  },

  visualCard: {
    height: VISUAL_H,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    backgroundColor: colors.ink,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.2)',
  },
  visualImg: { ...StyleSheet.absoluteFill },
  visualBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  visualBadgeText: { fontFamily: fonts.bold, fontSize: 12, color: colors.primaryDark },
  visualBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
    gap: spacing.sm,
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  statusText: { fontFamily: fonts.bold, fontSize: 11 },
  progressWrap: { gap: 4 },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  progressLbl: { fontFamily: fonts.medium, fontSize: 10, color: 'rgba(255,255,255,0.7)' },

  summaryCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.12)',
    overflow: 'hidden',
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  summaryCopy: { flex: 1, gap: 4, minWidth: 0 },
  summaryTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 0,
  },
  summaryEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1.1,
  },
  summaryRef: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.primaryDark,
    letterSpacing: 0.4,
  },
  copyBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateRefBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  rateRefBtnHighlight: {
    borderColor: 'rgba(11,110,103,0.28)',
    backgroundColor: '#E6F4F2',
  },
  rateRefText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.muted,
  },
  rateRefTextHighlight: {
    fontFamily: fonts.extraBold,
    color: colors.primaryDark,
  },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },
  summaryBottom: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  summaryLeft: {
    flex: 1,
    gap: 4,
    minWidth: 0,
    paddingRight: spacing.xs,
  },
  summaryAmountLbl: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  summaryAmount: {
    fontFamily: fonts.extraBold,
    fontSize: 28,
    color: colors.ink,
    letterSpacing: -0.8,
  },
  summaryAmountNarrow: { fontSize: 22 },
  walletChipInline: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginTop: 2,
  },
  walletChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  walletChipText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.primaryDark },
  summaryOtpCol: {
    alignItems: 'flex-end',
    gap: 4,
    flexShrink: 0,
    maxWidth: '48%',
  },
  summaryOtpLbl: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  summaryOtpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6FAF6',
    paddingLeft: spacing.sm,
    paddingRight: 4,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(18,165,152,0.2)',
  },
  summaryOtpCode: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: '#084F4A',
    letterSpacing: 2,
  },
  summaryOtpCodeNarrow: {
    fontSize: 14,
    letterSpacing: 1,
  },
  summaryOtpShare: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(18,165,152,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  proCard: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(110,231,183,0.35)',
    shadowColor: '#084F4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  proTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  proAvatarRing: { position: 'relative', flexShrink: 0 },
  proAvatarGrad: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  proInitial: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.primaryDark },
  proLive: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  proCopy: { flex: 1, gap: 4, minWidth: 0 },
  proLabelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  proEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  proBadgeText: { fontFamily: fonts.bold, fontSize: 9, color: '#B45309' },
  proName: { fontFamily: fonts.extraBold, fontSize: 17, color: colors.ink },
  proChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  proChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  proChipText: { fontFamily: fonts.semiBold, fontSize: 10, color: colors.primaryDark },
  proActions: { gap: spacing.xs, flexShrink: 0 },
  proActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proActionPrimary: { backgroundColor: colors.primary },
  proFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(11,110,103,0.12)',
    backgroundColor: 'rgba(110,231,183,0.08)',
  },
  proFooterText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primaryDark,
  },

  section: { gap: spacing.md },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1,
  },
  sectionTitle: { fontFamily: fonts.extraBold, fontSize: 17, color: colors.ink, letterSpacing: -0.3 },

  detailCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  detailRow: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  detailRowHighlight: {
    backgroundColor: colors.primaryDark,
    margin: spacing.sm,
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  detailSep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  detailIconHighlight: { backgroundColor: 'rgba(255,255,255,0.15)' },
  detailCopy: { flex: 1, gap: 3 },
  detailLabel: { fontFamily: fonts.bold, fontSize: 11, color: colors.muted },
  detailLabelHighlight: { color: 'rgba(255,255,255,0.65)' },
  detailValue: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink, lineHeight: 20 },
  detailValueHighlight: { color: colors.white },

  timelineCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  timelineRow: { flexDirection: 'row', gap: spacing.md },
  timelineLeft: { alignItems: 'center' },
  timelineDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.divider,
  },
  timelineDotDone: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  timelineDotActive: {
    backgroundColor: '#12A598',
    borderColor: '#6EE7B7',
    shadowColor: '#12A598',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 20,
    backgroundColor: colors.divider,
    marginVertical: 4,
  },
  timelineLineDone: { backgroundColor: '#6EE7B7' },
  timelineCopy: { flex: 1, gap: 4, paddingBottom: spacing.sm },
  timelineCopyActive: {
    backgroundColor: '#E6FAF6',
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginLeft: -spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(18,165,152,0.15)',
  },
  timelineTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.muted },
  timelineTitleDone: { color: colors.ink },
  timelineTitleActive: { color: '#084F4A' },
  timelineSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 17 },
  timelineOtpRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: spacing.xs,
  },
  timelineOtpDigit: {
    flex: 1,
    maxWidth: 44,
    aspectRatio: 1,
    backgroundColor: '#E6FAF6',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(18,165,152,0.25)',
  },
  timelineOtpDigitText: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: '#084F4A',
    letterSpacing: 0.5,
  },

  paymentCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  paymentLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  paymentValue: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  receiptLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  receiptLinkText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.primaryDark,
  },

  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionCard: {
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: 6,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
    overflow: 'hidden',
    minHeight: 96,
  },
  actionCardPrimary: { borderWidth: 0 },
  actionCardRate: {
    borderWidth: 0,
    shadowColor: '#0B6E67',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconPrimary: { backgroundColor: 'rgba(255,255,255,0.2)' },
  actionLabel: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  actionLabelPrimary: { color: colors.white },
  actionSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  actionSubPrimary: { color: 'rgba(255,255,255,0.75)' },

  trustCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  trustText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: spacing.sm,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
    backgroundColor: 'rgba(244,246,248,0.96)',
  },
  footerLiveStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: '#ECFDF3',
    borderWidth: 1,
    borderColor: 'rgba(18,165,152,0.2)',
  },
  footerLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#12A598',
  },
  footerLiveText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: '#027A48',
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  footerSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  footerSecondaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryDark },
  footerPrimary: { flex: 1.3, borderRadius: radius.pill, overflow: 'hidden' },
  footerPrimaryGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 15,
  },
  footerPrimaryText: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.white },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: layout.pad,
    backgroundColor: '#F4F6F8',
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  emptyTitle: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.ink },
  emptySub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 19,
  },
  emptyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
  },
  emptyBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
});
