import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { BookingStatus, DemoBooking } from '@/constants/demo';
import { HomePhoto } from '@/features/home/components/HomePhoto';
import { getServiceImages } from '@/features/home/constants/unsplash.images';
import { useOpenCancelBooking } from '../hooks/useOpenCancelBooking';
import { useOpenRateBooking } from '../hooks/useOpenRateBooking';
import { useOpenReschedule } from '../hooks/useOpenReschedule';
import { useOpenBookingDocument } from '../hooks/useOpenBookingDocument';
import { useOpenSupport } from '@/features/help/hooks/useOpenSupport';
import { useOpenTrackBooking } from '../hooks/useOpenTrackBooking';
import { usePendingVisitComplete } from '../hooks/usePendingVisitComplete';
import { getBookingById } from '../lib/booking.lookup';
import { getBookingImageId } from '../utils/bookings.utils';
import { BookingCompletionOtpCard } from './BookingCompletionOtpCard';
import { BookingRefundStatusCard } from './BookingRefundStatusCard';
import { BookingReviewSubmittedCard } from './BookingReviewSubmittedCard';
import { BookingVisitCompleteModal } from './BookingVisitCompleteModal';
import { BookingVisitCompletedCard } from './BookingVisitCompletedCard';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const HERO_H = 300;
const SHEET_OVERLAP = spacing.lg;

const STATUS_THEME: Record<
  BookingStatus,
  { label: string; ink: string; tone: string; hero: readonly [string, string] }
> = {
  upcoming: { label: 'Upcoming', ink: '#175CD3', tone: '#EEF6FF', hero: ['#1E3A8A', '#0F172A'] },
  completed: { label: 'Completed', ink: '#027A48', tone: '#ECFDF5', hero: ['#065F46', '#0F172A'] },
  cancelled: { label: 'Cancelled', ink: '#D92D20', tone: '#FEF3F2', hero: ['#991B1B', '#0F172A'] },
};

const TIMELINE: Record<BookingStatus, { icon: keyof typeof Ionicons.glyphMap; title: string; sub: string; done: boolean }[]> = {
  upcoming: [
    { icon: 'checkmark-circle', title: 'Booking confirmed', sub: 'Payment secured', done: true },
    { icon: 'person', title: 'Pro auto-assigned', sub: 'Verified maid matched', done: true },
    { icon: 'key', title: 'Completion OTP', sub: 'Share when job is done', done: true },
    { icon: 'navigate', title: 'Visit day', sub: 'Live tracking on the way', done: false },
  ],
  completed: [
    { icon: 'checkmark-circle', title: 'Booking confirmed', sub: 'Payment secured', done: true },
    { icon: 'person', title: 'Pro assigned', sub: 'Visit completed', done: true },
    { icon: 'key', title: 'OTP verified', sub: 'Job marked complete', done: true },
    { icon: 'star', title: 'Rate your visit', sub: 'Tell us how it went', done: false },
  ],
  cancelled: [
    { icon: 'close-circle', title: 'Booking cancelled', sub: 'No charge applied', done: true },
    { icon: 'refresh', title: 'Rebook anytime', sub: 'Same pro available', done: false },
  ],
};

function getTimeline(booking: DemoBooking) {
  const steps = [...TIMELINE[booking.status]];
  if (booking.status === 'completed' && booking.reviewedAt && booking.reviewRating) {
    steps[3] = {
      ...steps[3],
      done: true,
      sub: `${booking.reviewRating}★ rating submitted`,
    };
  }
  return steps;
}

const ACTIONS: Record<BookingStatus, { id: string; icon: keyof typeof Ionicons.glyphMap; label: string; primary?: boolean }[]> = {
  upcoming: [
    { id: 'track', icon: 'locate-outline', label: 'Track pro' },
    { id: 'reschedule', icon: 'calendar-outline', label: 'Reschedule' },
    { id: 'cancel', icon: 'close-circle-outline', label: 'Cancel' },
    { id: 'help', icon: 'chatbubble-ellipses-outline', label: 'Support', primary: true },
  ],
  completed: [
    { id: 'invoice', icon: 'document-text-outline', label: 'Invoice' },
    { id: 'receipt', icon: 'receipt-outline', label: 'Receipt' },
    { id: 'rate', icon: 'star-outline', label: 'Rate visit', primary: true },
  ],
  cancelled: [
    { id: 'rebook', icon: 'refresh', label: 'Book again', primary: true },
    { id: 'help', icon: 'chatbubble-ellipses-outline', label: 'Support' },
  ],
};

export function BookingDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<DemoBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const { payload, visible, checkPending, dismiss } = usePendingVisitComplete();
  const openReschedule = useOpenReschedule();
  const openCancel = useOpenCancelBooking();
  const openRate = useOpenRateBooking();
  const openTrack = useOpenTrackBooking();
  const openDocument = useOpenBookingDocument();
  const openSupport = useOpenSupport();

  const loadBooking = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const b = await getBookingById(id);
    setBooking(b ?? null);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void loadBooking();
  }, [loadBooking]);

  useFocusEffect(
    useCallback(() => {
      void loadBooking();
      void checkPending();
    }, [loadBooking, checkPending]),
  );

  const onOtpVerified = useCallback(async () => {
    await loadBooking();
    await checkPending();
  }, [loadBooking, checkPending]);

  if (loading) {
    return (
      <View style={[styles.loader, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <Ionicons name="calendar-outline" size={48} color={colors.muted} />
        <Text style={styles.emptyTitle}>Booking not found</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const theme = STATUS_THEME[booking.status];
  const imageId = getBookingImageId(booking.service);
  const timeline = getTimeline(booking);
  const actions = ACTIONS[booking.status].map((a) =>
    a.id === 'rate' && booking.reviewedAt
      ? { ...a, label: 'View review', icon: 'star' as const }
      : a,
  );

  const onAction = (actionId: string) => {
    Haptics.selectionAsync();
    if (actionId === 'reschedule') {
      openReschedule(booking!.id);
    }
    if (actionId === 'cancel') {
      openCancel(booking!.id);
    }
    if (actionId === 'rate') {
      openRate(booking!.id);
    }
    if (actionId === 'track') {
      openTrack(booking!.id);
    }
    if (actionId === 'invoice') {
      openDocument(booking!.id, 'invoice');
    }
    if (actionId === 'receipt') {
      openDocument(booking!.id, 'receipt');
    }
  };

  const shareBooking = async () => {
    try {
      await Share.share({
        message: `QuickMaid booking ${booking.bookingRef ?? booking.id}\n${booking.service} · ${booking.date} ${booking.time}\n${booking.address}`,
      });
    } catch {
      // dismissed
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        <View style={styles.hero}>
          <HomePhoto uri={getServiceImages(imageId)} style={styles.heroImg} overlay="none" />
          <LinearGradient colors={[...theme.hero]} locations={[0.2, 1]} style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={['transparent', 'rgba(15,20,25,0.75)']}
            style={StyleSheet.absoluteFill}
          />

          <View style={[styles.heroTop, { paddingTop: insets.top + spacing.sm }]}>
            <Pressable style={styles.floatBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={colors.white} />
            </Pressable>
            <Pressable style={styles.floatBtn} onPress={shareBooking}>
              <Ionicons name="share-outline" size={20} color={colors.white} />
            </Pressable>
          </View>

          <View style={styles.heroBottom}>
            <View style={[styles.statusBadge, { backgroundColor: theme.tone }]}>
              <Text style={[styles.statusText, { color: theme.ink }]}>{theme.label}</Text>
            </View>
            <Text style={styles.heroService}>{booking.service}</Text>
            <View style={styles.heroMeta}>
              <View style={styles.metaChip}>
                <Ionicons name="calendar-outline" size={12} color={colors.white} />
                <Text style={styles.metaText}>{booking.date}</Text>
              </View>
              <View style={styles.metaChip}>
                <Ionicons name="time-outline" size={12} color={colors.white} />
                <Text style={styles.metaText}>{booking.time}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.refCard}>
            <View>
              <Text style={styles.refLabel}>Booking reference</Text>
              <Text style={styles.refValue}>{booking.bookingRef ?? booking.id}</Text>
            </View>
            <Text style={styles.price}>{booking.price}</Text>
          </View>

          <View style={styles.maidCard}>
            <LinearGradient colors={['#F8FDFC', colors.white]} style={StyleSheet.absoluteFill} />
            <View style={styles.maidAvatar}>
              <Text style={styles.maidInitial}>{booking.maid.charAt(0)}</Text>
            </View>
            <View style={styles.maidCopy}>
              <Text style={styles.maidEyebrow}>Your pro</Text>
              <Text style={styles.maidName}>{booking.maid}</Text>
              <Text style={styles.maidMeta}>
                {booking.maidRating ? `${booking.maidRating}★` : 'Verified'}
                {booking.maidJobs ? ` · ${booking.maidJobs} jobs` : ''}
                {booking.duration ? ` · ${booking.duration}` : ''}
              </Text>
            </View>
            {booking.status === 'upcoming' ? (
              <View style={styles.autoTag}>
                <Ionicons name="flash" size={10} color="#B45309" />
                <Text style={styles.autoText}>Auto</Text>
              </View>
            ) : null}
          </View>

          {booking.status === 'completed' ? <BookingVisitCompletedCard booking={booking} /> : null}

          {booking.status === 'completed' && booking.reviewedAt ? (
            <BookingReviewSubmittedCard booking={booking} />
          ) : null}

          {booking.status === 'cancelled' ? <BookingRefundStatusCard booking={booking} /> : null}

          {booking.status === 'upcoming' && booking.completionOtp ? (
            <BookingCompletionOtpCard booking={booking} compact onVerified={onOtpVerified} />
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Visit details</Text>
            <View style={styles.detailCard}>
              {[
                { icon: 'location-outline' as const, label: 'Address', value: booking.address },
                { icon: 'time-outline' as const, label: 'Slot', value: `${booking.date} · ${booking.time}` },
                { icon: 'hourglass-outline' as const, label: 'Duration', value: booking.duration ?? 'As per service' },
              ].map((row, i, arr) => (
                <View key={row.label} style={[styles.detailRow, i < arr.length - 1 && styles.detailBorder]}>
                  <View style={styles.detailIcon}>
                    <Ionicons name={row.icon} size={16} color={colors.primaryDark} />
                  </View>
                  <View style={styles.detailCopy}>
                    <Text style={styles.detailLabel}>{row.label}</Text>
                    <Text style={styles.detailValue}>{row.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status timeline</Text>
            <View style={styles.timelineCard}>
              {timeline.map((step, i) => (
                <View key={step.title} style={styles.timelineRow}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, step.done && styles.timelineDotDone]}>
                      <Ionicons name={step.icon} size={14} color={step.done ? colors.white : colors.muted} />
                    </View>
                    {i < timeline.length - 1 ? <View style={[styles.timelineLine, step.done && styles.timelineLineDone]} /> : null}
                  </View>
                  <View style={styles.timelineCopy}>
                    <Text style={[styles.timelineTitle, step.done && styles.timelineTitleDone]}>{step.title}</Text>
                    <Text style={styles.timelineSub}>{step.sub}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            {actions.map((a) => (
              <Pressable
                key={a.id}
                style={[styles.actionBtn, a.primary && styles.actionPrimary]}
                onPress={() => onAction(a.id)}
              >
                {a.primary ? (
                  <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
                ) : null}
                <Ionicons name={a.icon} size={16} color={a.primary ? colors.white : colors.primaryDark} />
                <Text style={[styles.actionText, a.primary && styles.actionTextPrimary]}>{a.label}</Text>
              </Pressable>
            ))}
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
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <Pressable
            style={styles.footerBtn}
            onPress={() => booking && openSupport({ chat: true, topic: `Message ${booking.maid}` })}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primaryDark} />
            <Text style={styles.footerBtnText}>Message pro</Text>
          </Pressable>
          <Pressable
            style={styles.footerPrimary}
            onPress={() => openTrack(booking.id)}
          >
            <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
            <Ionicons name="navigate" size={18} color={colors.white} />
            <Text style={styles.footerPrimaryText}>Track live</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F8' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: layout.pad },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  emptyBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.pill },
  emptyBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  hero: { height: HERO_H, backgroundColor: colors.ink },
  heroImg: { ...StyleSheet.absoluteFill },
  heroTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: layout.pad,
    zIndex: 2,
  },
  floatBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(15,20,25,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  heroBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: layout.pad,
    paddingBottom: layout.pad + SHEET_OVERLAP + spacing.md,
    gap: spacing.sm,
    zIndex: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusText: { fontFamily: fonts.bold, fontSize: 11 },
  heroService: { fontFamily: fonts.extraBold, fontSize: 26, color: colors.white, letterSpacing: -0.6 },
  heroMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  metaText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.white, lineHeight: 18 },
  sheet: {
    marginTop: -SHEET_OVERLAP,
    backgroundColor: '#F4F6F8',
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.xl,
    gap: spacing.lg,
    zIndex: 3,
  },
  refCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  refLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  refValue: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.primaryDark, letterSpacing: 0.5 },
  price: { fontFamily: fonts.extraBold, fontSize: 22, color: colors.ink },
  maidCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  maidAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maidInitial: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.primaryDark },
  maidCopy: { flex: 1, gap: 2 },
  maidEyebrow: { fontFamily: fonts.bold, fontSize: 10, color: colors.muted, letterSpacing: 0.6, textTransform: 'uppercase' },
  maidName: { fontFamily: fonts.extraBold, fontSize: 17, color: colors.ink },
  maidMeta: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  autoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  autoText: { fontFamily: fonts.bold, fontSize: 10, color: '#B45309' },
  section: { gap: spacing.md },
  sectionTitle: { fontFamily: fonts.extraBold, fontSize: 17, color: colors.ink },
  detailCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  detailRow: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  detailBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCopy: { flex: 1, gap: 2 },
  detailLabel: { fontFamily: fonts.bold, fontSize: 11, color: colors.muted },
  detailValue: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink, lineHeight: 20 },
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotDone: { backgroundColor: colors.primary },
  timelineLine: { width: 2, flex: 1, minHeight: 16, backgroundColor: colors.divider, marginVertical: 4 },
  timelineLineDone: { backgroundColor: colors.primaryLight },
  timelineCopy: { flex: 1, gap: 2, paddingBottom: spacing.xs },
  timelineTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.muted },
  timelineTitleDone: { color: colors.ink },
  timelineSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  actions: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
    overflow: 'hidden',
  },
  actionPrimary: { borderWidth: 0 },
  actionText: { fontFamily: fonts.bold, fontSize: 13, color: colors.primaryDark },
  actionTextPrimary: { color: colors.white },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  footerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 14,
    backgroundColor: colors.primaryLight,
  },
  footerBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryDark },
  footerPrimary: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 14,
    overflow: 'hidden',
  },
  footerPrimaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
});
