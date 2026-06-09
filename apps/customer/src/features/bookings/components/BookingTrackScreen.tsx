import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { DemoBooking } from '@/constants/demo';
import { useOpenSupport } from '@/features/help/hooks/useOpenSupport';
import { resolveMaidId } from '../lib/maid.profile';
import { useOpenProProfile } from '@/features/pro/hooks/useOpenProProfile';
import { getBookingById } from '../lib/booking.lookup';
import {
  TRACK_STEPS,
  distanceRemaining,
  etaLabel,
  etaMinutesLabel,
  etaMinutesUnit,
  initialTrackState,
  partnerStatusLine,
  phaseFromProgress,
  tripProgressPercent,
} from '../lib/booking.tracking';
import { BookingTrackMap } from './BookingTrackMap';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function BookingTrackScreen() {
  const router = useRouter();
  const openSupport = useOpenSupport();
  const openProProfile = useOpenProProfile();
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
  const progressPct = tripProgressPercent(progress);
  const showOtp = (phase === 'nearby' || phase === 'arrived') && Boolean(booking?.completionOtp);

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
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.emptyTitle}>Booking not found</Text>
        <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
          <Text style={styles.primaryBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  if (booking.status !== 'upcoming') {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.emptyTitle}>Tracking unavailable</Text>
        <Text style={styles.emptySub}>Live tracking sirf upcoming visits ke liye</Text>
        <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
          <Text style={styles.primaryBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Map — hero, Swiggy style */}
      <View style={styles.mapArea}>
        <BookingTrackMap progress={progress} />

        <View style={[styles.mapBar, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable style={styles.mapBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.ink} />
          </Pressable>
          <Pressable
            style={styles.mapBtn}
            onPress={() => openSupport({ chat: true, topic: `Track · ${booking.maid}` })}
          >
            <Ionicons name="help-circle-outline" size={22} color={colors.ink} />
          </Pressable>
        </View>
      </View>

      {/* Bottom sheet — Zomato white card */}
      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetInner}>
          <Text style={styles.statusLine}>{partnerStatusLine(booking.maid, phase)}</Text>

          <View style={styles.etaBlock}>
            <Text style={styles.etaNum}>{etaMinutesLabel(etaMin)}</Text>
            {etaMinutesUnit(etaMin) ? (
              <Text style={styles.etaUnit}>{etaMinutesUnit(etaMin)}</Text>
            ) : null}
          </View>

          <Text style={styles.etaSub}>
            {distanceRemaining(progress)} away · {booking.time} slot
          </Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>

          <View style={styles.steps}>
            {TRACK_STEPS.map((step, i) => {
              const done = i <= stepIndex;
              const active = i === stepIndex;
              return (
                <View key={step.id} style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepDot,
                      done && styles.stepDotDone,
                      active && styles.stepDotActive,
                    ]}
                  />
                  <Text style={[styles.stepLabel, (done || active) && styles.stepLabelOn]}>
                    {step.shortLabel}
                  </Text>
                </View>
              );
            })}
          </View>

          {showOtp && booking.completionOtp ? (
            <View style={styles.otpBox}>
              <View style={styles.otpLeft}>
                <Ionicons name="key" size={18} color="#B54708" />
                <View>
                  <Text style={styles.otpTitle}>Share OTP when done</Text>
                  <Text style={styles.otpSub}>Tabhi dena jab cleaning complete ho</Text>
                </View>
              </View>
              <Text style={styles.otpCode}>{booking.completionOtp}</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          {/* Partner row — Swiggy delivery executive */}
          <View style={styles.partnerRow}>
            <Pressable
              style={styles.partnerTap}
              onPress={() => {
                openProProfile(resolveMaidId(booking.maid, booking.maidId), {
                  name: booking.maid,
                  bookingId: booking.id,
                  status: booking.status,
                });
              }}
              accessibilityRole="button"
              accessibilityLabel={`View ${booking.maid} profile`}
            >
              <View style={styles.partnerAvatar}>
                <Text style={styles.partnerInitial}>{booking.maid.charAt(0)}</Text>
              </View>
              <View style={styles.partnerInfo}>
                <Text style={styles.partnerName}>{booking.maid}</Text>
                <Text style={styles.partnerRole}>
                  Your cleaning pro
                  {booking.maidRating ? ` · ${booking.maidRating}★` : ''}
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.callCircle}
              onPress={() => {
                Haptics.selectionAsync();
                void Linking.openURL('tel:+919876543210');
              }}
            >
              <Ionicons name="call" size={20} color={colors.white} />
            </Pressable>
          </View>

          <Pressable
            style={styles.callWide}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              void Linking.openURL('tel:+919876543210');
            }}
          >
            <Ionicons name="call" size={18} color={colors.white} />
            <Text style={styles.callWideText}>Call {booking.maid.split(' ')[0]}</Text>
          </Pressable>

          <View style={styles.orderBox}>
            <View style={styles.orderRow}>
              <Ionicons name="sparkles-outline" size={16} color={colors.muted} />
              <Text style={styles.orderService}>{booking.service}</Text>
            </View>
            <View style={styles.orderRow}>
              <Ionicons name="location-outline" size={16} color={colors.muted} />
              <Text style={styles.orderAddress} numberOfLines={2}>
                {booking.address}
              </Text>
            </View>
            <Text style={styles.orderRef}>Booking · {booking.bookingRef ?? booking.id}</Text>
          </View>

          <View style={styles.footerLinks}>
            <Pressable
              style={styles.footerLink}
              onPress={() => openSupport({ chat: true, topic: `Track · ${booking.maid}` })}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.primary} />
              <Text style={styles.footerLinkText}>Chat with support</Text>
            </Pressable>
            <Pressable style={styles.footerLink} onPress={() => void shareTrip()}>
              <Ionicons name="share-outline" size={16} color={colors.primary} />
              <Text style={styles.footerLinkText}>Share trip</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: layout.pad,
    backgroundColor: colors.white,
  },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
  emptySub: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted, textAlign: 'center' },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  primaryBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  mapArea: { flex: 1, minHeight: 280 },
  mapBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: layout.pad,
  },
  mapBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -16,
    maxHeight: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  sheetInner: {
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  statusLine: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.ink,
    lineHeight: 21,
  },
  etaBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  etaNum: {
    fontFamily: fonts.extraBold,
    fontSize: 48,
    color: colors.ink,
    letterSpacing: -2,
    lineHeight: 52,
  },
  etaUnit: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.muted,
    marginBottom: 8,
  },
  etaSub: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    marginTop: -4,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EEEEEE',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  steps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  stepItem: { alignItems: 'center', gap: 6, flex: 1 },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
  },
  stepDotDone: { backgroundColor: colors.primary },
  stepDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  stepLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.mutedLight,
    textAlign: 'center',
  },
  stepLabelOn: { color: colors.primaryDark, fontFamily: fonts.semiBold },
  otpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFAEB',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FEDF89',
  },
  otpLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  otpTitle: { fontFamily: fonts.bold, fontSize: 12, color: '#B54708' },
  otpSub: { fontFamily: fonts.medium, fontSize: 10, color: '#B54708', opacity: 0.8 },
  otpCode: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: '#B54708',
    letterSpacing: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  partnerTap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minWidth: 0,
  },
  partnerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerInitial: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.primaryDark,
  },
  partnerInfo: { flex: 1, gap: 2 },
  partnerName: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  partnerRole: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  callCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callWide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  callWideText: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  orderBox: {
    backgroundColor: '#FAFAFA',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  orderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  orderService: { flex: 1, fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink },
  orderAddress: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.muted, lineHeight: 18 },
  orderRef: { fontFamily: fonts.medium, fontSize: 11, color: colors.mutedLight },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingTop: spacing.xs,
  },
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
  },
  footerLinkText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primary },
});
