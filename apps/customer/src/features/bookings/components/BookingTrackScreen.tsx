import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
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
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingDetailSkeleton } from '@/components/ui/Skeleton';
import type { DemoBooking } from '@/constants/demo';
import { useOpenSupport } from '@/features/help/hooks/useOpenSupport';
import { resolveMaidId } from '../lib/maid.profile';
import { useOpenProProfile } from '@/features/pro/hooks/useOpenProProfile';
import { getPartnerLiveLocation, type VisitLocationBridgeEntry } from '@/lib/visit-location-bridge';
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
import { BookingTrackOtpCard } from './BookingTrackOtpCard';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, shadow, spacing } from '@/theme/spacing';

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
  const [live, setLive] = useState<VisitLocationBridgeEntry | null>(null);

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
    if (!booking?.bookingRef || booking.status !== 'upcoming') return;

    const poll = async () => {
      const ping = await getPartnerLiveLocation(booking.bookingRef!);
      setLive(ping);
      if (ping) {
        const ageSec = Math.max(0, (Date.now() - new Date(ping.recordedAt).getTime()) / 1000);
        const derived = Math.min(0.92, 0.42 + ageSec / 600);
        setProgress(derived);
        setEtaMin(Math.max(2, Math.round(14 - derived * 12)));
      }
    };

    void poll();
    const timer = setInterval(() => void poll(), 8000);
    return () => clearInterval(timer);
  }, [booking]);

  const proName = live?.partnerName ?? booking?.maid ?? 'Your pro';
  const phase = useMemo(() => (live ? 'en_route' : phaseFromProgress(progress)), [live, progress]);
  const stepIndex = TRACK_STEPS.findIndex((s) => s.id === phase);
  const progressPct = tripProgressPercent(progress);
  const showOtp = (phase === 'nearby' || phase === 'arrived') && Boolean(booking?.completionOtp);

  const shareTrip = async () => {
    if (!booking) return;
    try {
      await Share.share({
        message: `QuickMaid live trip\n${proName} is on the way to ${booking.address}\n${etaLabel(etaMin)} · Ref ${booking.bookingRef ?? booking.id}`,
      });
    } catch {
      // dismissed
    }
  };

  if (loading) {
    return <BookingDetailSkeleton />;
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
      <View style={styles.mapArea}>
        <BookingTrackMap
          progress={progress}
          live={Boolean(live)}
          liveCoords={live ? { lat: live.lat, lng: live.lng } : null}
          address={booking.address}
        />

        <View style={[styles.mapBar, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable style={styles.mapBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <Pressable
            style={styles.mapBtn}
            onPress={() => openSupport({ chat: true, topic: `Track · ${proName}` })}
          >
            <Ionicons name="help-circle-outline" size={22} color={colors.white} />
          </Pressable>
        </View>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetInner}>
          <Animated.View entering={FadeInDown.duration(280)}>
            <Text style={styles.eyebrow}>LIVE TRIP</Text>
            <Text style={styles.statusLine}>{partnerStatusLine(proName, phase)}</Text>
          </Animated.View>

          {live ? (
            <Animated.View entering={FadeInDown.delay(60).duration(300)} style={styles.liveStrip}>
              <Ionicons name="radio" size={14} color="#6EE7B7" />
              <Text style={styles.liveStripText}>
                GPS · {live.lat.toFixed(4)}, {live.lng.toFixed(4)} ·{' '}
                {new Date(live.recordedAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </Animated.View>
          ) : (
            <Text style={styles.waitLine}>Waiting for pro to share live location…</Text>
          )}

          <Animated.View entering={FadeInDown.delay(100).duration(320)}>
            <LinearGradient
              colors={['#010F0E', '#084F4A', '#0B6E67']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.etaHero}
            >
              <View style={styles.etaHeroTop}>
                <View>
                  <Text style={styles.etaHeroLabel}>Arriving in</Text>
                  <View style={styles.etaBlock}>
                    <Text style={styles.etaNum}>{etaMinutesLabel(etaMin)}</Text>
                    {etaMinutesUnit(etaMin) ? (
                      <Text style={styles.etaUnit}>{etaMinutesUnit(etaMin)}</Text>
                    ) : null}
                  </View>
                </View>
                <View style={styles.ringWrap}>
                  <Text style={styles.ringPct}>{progressPct}%</Text>
                  <Text style={styles.ringLabel}>trip</Text>
                </View>
              </View>
              <Text style={styles.etaSub}>
                {distanceRemaining(progress)} away · {booking.time} slot · {booking.bookingRef}
              </Text>
              <View style={styles.progressTrack}>
                <LinearGradient
                  colors={['#FCD34D', '#6EE7B7', '#12A598']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${progressPct}%` }]}
                />
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(140).duration(320)} style={styles.timelineCard}>
            <Text style={styles.cardEyebrow}>TRIP TIMELINE</Text>
            <View style={styles.steps}>
              {TRACK_STEPS.map((step, i) => {
                const done = i <= stepIndex;
                const active = i === stepIndex;
                return (
                  <View key={step.id} style={styles.stepItem}>
                    <View style={[styles.stepDot, done && styles.stepDotDone, active && styles.stepDotActive]}>
                      {active ? <View style={styles.stepDotCore} /> : null}
                    </View>
                    <Text style={[styles.stepLabel, (done || active) && styles.stepLabelOn]}>
                      {step.shortLabel}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Animated.View>

          {showOtp && booking.completionOtp ? <BookingTrackOtpCard booking={booking} /> : null}

          <Animated.View entering={FadeInDown.delay(200).duration(320)} style={styles.proCard}>
            <Pressable
              style={styles.proTap}
              onPress={() => {
                openProProfile(resolveMaidId(booking.maid, booking.maidId), {
                  name: booking.maid,
                  bookingId: booking.id,
                  status: booking.status,
                });
              }}
            >
              <LinearGradient colors={['#E6F4F2', '#FFFFFF']} style={styles.proAvatarRing}>
                <View style={styles.proAvatar}>
                  <Text style={styles.proInitial}>{proName.charAt(0)}</Text>
                </View>
              </LinearGradient>
              <View style={styles.proInfo}>
                <Text style={styles.proName}>{proName}</Text>
                <Text style={styles.proRole}>
                  Verified cleaning pro
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
          </Animated.View>

          <View style={styles.actionRow}>
            <Pressable style={styles.actionBtn} onPress={() => void Linking.openURL('tel:+919876543210')}>
              <Ionicons name="call" size={16} color={colors.white} />
              <Text style={styles.actionBtnText}>Call</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, styles.actionBtnGhost]}
              onPress={() => openSupport({ chat: true, topic: `Track · ${proName}` })}
            >
              <Ionicons name="chatbubble-ellipses" size={16} color={colors.primary} />
              <Text style={[styles.actionBtnText, styles.actionBtnTextGhost]}>Support</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.actionBtnGhost]} onPress={() => void shareTrip()}>
              <Ionicons name="share-outline" size={16} color={colors.primary} />
              <Text style={[styles.actionBtnText, styles.actionBtnTextGhost]}>Share</Text>
            </Pressable>
          </View>

          <View style={styles.safetyCard}>
            <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
            <View style={styles.safetyCopy}>
              <Text style={styles.safetyTitle}>Secure visit protocol</Text>
              <Text style={styles.safetySub}>
                Live GPS active · OTP verified completion · 24×7 support on trip
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#010F0E' },
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
  mapArea: { flex: 1, minHeight: 300 },
  mapBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: layout.pad,
    zIndex: 10,
  },
  mapBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    maxHeight: '52%',
    ...shadow.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E4E7EC',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  sheetInner: {
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.mutedLight,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  statusLine: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.ink,
    lineHeight: 23,
  },
  liveStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: '#ECFDF3',
    borderWidth: 1,
    borderColor: 'rgba(18,165,152,0.2)',
    marginTop: -4,
  },
  liveStripText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: '#027A48',
  },
  waitLine: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: '#1570EF',
    marginTop: -4,
  },
  etaHero: {
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  etaHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  etaHeroLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 2,
  },
  etaBlock: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  etaNum: {
    fontFamily: fonts.extraBold,
    fontSize: 44,
    color: colors.white,
    letterSpacing: -2,
    lineHeight: 48,
  },
  etaUnit: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
  },
  ringWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: 'rgba(110,231,183,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  ringPct: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: '#6EE7B7',
  },
  ringLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
  },
  etaSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.72)',
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  timelineCard: {
    padding: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.sm,
  },
  cardEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.mutedLight,
    letterSpacing: 1,
  },
  steps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: { alignItems: 'center', gap: 6, flex: 1 },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E4E7EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: { backgroundColor: colors.primaryLight, borderWidth: 2, borderColor: colors.primary },
  stepDotActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  stepDotCore: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  stepLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: colors.mutedLight,
    textAlign: 'center',
  },
  stepLabelOn: { color: colors.primaryDark, fontFamily: fonts.semiBold },
  otpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#010F0E',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.35)',
  },
  otpLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  otpTitle: { fontFamily: fonts.bold, fontSize: 12, color: '#FCD34D' },
  otpSub: { fontFamily: fonts.medium, fontSize: 10, color: 'rgba(252,211,77,0.75)' },
  otpCode: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: '#FCD34D',
    letterSpacing: 4,
  },
  proCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadow.sm,
  },
  proTap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minWidth: 0,
  },
  proAvatarRing: {
    padding: 3,
    borderRadius: 28,
  },
  proAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proInitial: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.primaryDark,
  },
  proInfo: { flex: 1, gap: 2 },
  proName: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  proRole: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  callCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  actionBtnGhost: {
    backgroundColor: colors.primaryLight,
  },
  actionBtnText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.white,
  },
  actionBtnTextGhost: {
    color: colors.primary,
  },
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: '#F0FDF9',
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  safetyCopy: { flex: 1, gap: 2 },
  safetyTitle: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  safetySub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },
});
