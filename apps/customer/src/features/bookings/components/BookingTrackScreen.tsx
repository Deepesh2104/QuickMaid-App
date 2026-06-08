import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { DemoBooking } from '@/constants/demo';
import { useOpenSupport } from '@/features/help/hooks/useOpenSupport';
import { getBookingById } from '../lib/booking.lookup';
import {
  TRACK_STEPS,
  etaLabel,
  initialTrackState,
  phaseFromProgress,
  phaseLabel,
  type TrackPhase,
} from '../lib/booking.tracking';
import { BookingTrackMap } from './BookingTrackMap';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const STEP_ICONS: Record<TrackPhase, keyof typeof Ionicons.glyphMap> = {
  assigned: 'person',
  en_route: 'bicycle',
  nearby: 'navigate',
  arrived: 'home',
};

export function BookingTrackScreen() {
  const router = useRouter();
  const openSupport = useOpenSupport();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<DemoBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0.35);
  const [etaMin, setEtaMin] = useState(12);

  const loadBooking = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const b = await getBookingById(id);
    setBooking(b ?? null);
    if (b) {
      const initial = initialTrackState(b.id);
      setProgress(initial.progress);
      setEtaMin(initial.etaMin);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void loadBooking();
  }, [loadBooking]);

  useEffect(() => {
    if (!booking || booking.status !== 'upcoming') return;

    const timer = setInterval(() => {
      setEtaMin((m) => Math.max(1, m - 1));
      setProgress((p) => Math.min(0.96, p + 0.04));
    }, 6000);

    return () => clearInterval(timer);
  }, [booking]);

  const phase = useMemo(() => phaseFromProgress(progress), [progress]);
  const stepIndex = TRACK_STEPS.findIndex((s) => s.id === phase);

  const shareTrip = async () => {
    if (!booking) return;
    try {
      await Share.share({
        message: `QuickMaid live trip\n${booking.maid} is on the way to ${booking.address}\n${etaLabel(etaMin)} · Ref ${booking.bookingRef ?? booking.id}`,
      });
    } catch {
      // dismissed
    }
  };

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
        <Ionicons name="navigate-outline" size={48} color={colors.muted} />
        <Text style={styles.emptyTitle}>Booking not found</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  if (booking.status !== 'upcoming') {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <Ionicons name="time-outline" size={48} color={colors.muted} />
        <Text style={styles.emptyTitle}>Tracking unavailable</Text>
        <Text style={styles.emptySub}>Live map sirf upcoming visits ke liye hai</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.mapArea}>
        <BookingTrackMap progress={progress} address={booking.address} />

        <View style={[styles.mapTop, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable style={styles.floatBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.ink} />
          </Pressable>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Pressable style={styles.floatBtn} onPress={() => void shareTrip()} accessibilityRole="button">
            <Ionicons name="share-outline" size={20} color={colors.ink} />
          </Pressable>
        </View>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.handle} />

        <View style={styles.etaRow}>
          <View>
            <Text style={styles.eta}>{etaLabel(etaMin)}</Text>
            <Text style={styles.phase}>{phaseLabel(phase)}</Text>
          </View>
          <View style={styles.etaBadge}>
            <Ionicons name="time-outline" size={14} color={colors.primaryDark} />
            <Text style={styles.etaBadgeText}>{booking.time}</Text>
          </View>
        </View>

        <View style={styles.progress}>
          <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>

        <View style={styles.steps}>
          {TRACK_STEPS.map((step, i) => {
            const done = i <= stepIndex;
            const active = i === stepIndex;
            return (
              <View key={step.id} style={styles.stepWrap}>
                <View style={styles.stepCol}>
                  <View style={[styles.stepDot, done && styles.stepDotDone, active && styles.stepDotActive]}>
                    <Ionicons
                      name={STEP_ICONS[step.id]}
                      size={12}
                      color={done ? colors.white : colors.muted}
                    />
                  </View>
                  <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>{step.label}</Text>
                </View>
                {i < TRACK_STEPS.length - 1 ? (
                  <View style={[styles.stepLine, done && styles.stepLineDone]} />
                ) : null}
              </View>
            );
          })}
        </View>

        <View style={styles.proCard}>
          <View style={styles.proAvatar}>
            <Text style={styles.proInitial}>{booking.maid.charAt(0)}</Text>
          </View>
          <View style={styles.proCopy}>
            <Text style={styles.proName}>{booking.maid}</Text>
            <Text style={styles.proMeta}>
              {booking.service}
              {booking.maidRating ? ` · ${booking.maidRating}★` : ''}
              {booking.maidJobs ? ` · ${booking.maidJobs} jobs` : ''}
            </Text>
            <Text style={styles.proRef}>{booking.bookingRef ?? booking.id}</Text>
          </View>
          <View style={styles.verified}>
            <Ionicons name="shield-checkmark" size={12} color="#027A48" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.actionBtn}
            onPress={() => {
              Haptics.selectionAsync();
              void Linking.openURL('tel:+919876543210');
            }}
          >
            <Ionicons name="call-outline" size={18} color={colors.primaryDark} />
            <Text style={styles.actionText}>Call</Text>
          </Pressable>
          <Pressable
            style={styles.actionBtn}
            onPress={() => booking && openSupport({ chat: true, topic: `Track visit · ${booking.maid}` })}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primaryDark} />
            <Text style={styles.actionText}>Message</Text>
          </Pressable>
          <Pressable
            style={styles.actionPrimary}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              void shareTrip();
            }}
          >
            <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
            <Ionicons name="share-social-outline" size={16} color={colors.white} />
            <Text style={styles.actionPrimaryText}>Share trip</Text>
          </Pressable>
        </View>

        <View style={styles.safety}>
          <Ionicons name="shield-outline" size={16} color={colors.primaryDark} />
          <Text style={styles.safetyText}>
            OTP tabhi share karein jab kaam poora ho. Trip link family ke saath share kar sakte ho.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F8' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: layout.pad,
    backgroundColor: '#F4F6F8',
  },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  emptySub: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted, textAlign: 'center' },
  emptyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  emptyBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  mapArea: { flex: 1, minHeight: 300, position: 'relative' },
  mapTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.pad,
    zIndex: 2,
  },
  floatBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(2,122,72,0.2)',
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  liveText: { fontFamily: fonts.bold, fontSize: 11, color: colors.success, letterSpacing: 0.5 },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    gap: spacing.md,
    marginTop: -spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginBottom: spacing.xs,
  },
  etaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eta: { fontFamily: fonts.extraBold, fontSize: 26, color: colors.ink, letterSpacing: -0.5 },
  phase: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  etaBadgeText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primaryDark },
  progress: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.bgMuted,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: colors.primary },
  steps: { flexDirection: 'row', alignItems: 'flex-start' },
  stepWrap: { flex: 1, flexDirection: 'row', alignItems: 'flex-start' },
  stepCol: { alignItems: 'center', gap: 4, flex: 1 },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: { backgroundColor: colors.primary },
  stepDotActive: { borderWidth: 2, borderColor: '#6EE7B7' },
  stepLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 12,
  },
  stepLabelDone: { color: colors.primaryDark, fontFamily: fonts.semiBold },
  stepLine: {
    width: 12,
    height: 2,
    backgroundColor: colors.bgMuted,
    marginTop: 12,
  },
  stepLineDone: { backgroundColor: colors.primary },
  proCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#F8FDFC',
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  proAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proInitial: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.primaryDark },
  proCopy: { flex: 1, gap: 2 },
  proName: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  proMeta: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  proRef: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.primary },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  verifiedText: { fontFamily: fonts.bold, fontSize: 10, color: '#027A48' },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
  },
  actionText: { fontFamily: fonts.bold, fontSize: 13, color: colors.primaryDark },
  actionPrimary: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  actionPrimaryText: { fontFamily: fonts.bold, fontSize: 13, color: colors.white },
  safety: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
  },
  safetyText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.primaryDark,
    lineHeight: 16,
  },
});
