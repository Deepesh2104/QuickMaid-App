import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { DEMO_VISIT_COMPLETION_OTP } from '@/constants/app';
import type { DemoBooking } from '@/constants/demo';
import { getPartnerLiveLocation } from '@/lib/visit-location-bridge';
import { HomePhoto } from '@/features/home/components/HomePhoto';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { getServiceImages } from '@/features/home/constants/unsplash.images';
import { useOpenBookingDetail } from '../hooks/useOpenBookingDetail';
import { useOpenReschedule } from '../hooks/useOpenReschedule';
import { useOpenSupport } from '@/features/help/hooks/useOpenSupport';
import { useOpenTrackBooking } from '../hooks/useOpenTrackBooking';
import { getBookingImageId } from '../utils/bookings.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const AnimatedPress = Animated.createAnimatedComponent(Pressable);

function getSteps(booking: DemoBooking, gpsLive: boolean) {
  const hasOtp = Boolean(booking.completionOtp);
  return [
    { id: 'confirmed', label: 'Confirmed', done: true },
    { id: 'assigned', label: 'Pro auto-assigned', done: true },
    { id: 'otp', label: 'OTP ready', done: hasOtp },
    { id: 'ontheway', label: gpsLive ? 'Live GPS' : 'On the way', done: gpsLive },
  ];
}

interface BookingUpcomingHeroProps {
  booking: DemoBooking;
}

export function BookingUpcomingHero({ booking }: BookingUpcomingHeroProps) {
  const openDetail = useOpenBookingDetail();
  const openReschedule = useOpenReschedule();
  const openTrack = useOpenTrackBooking();
  const openSupport = useOpenSupport();
  const [gpsLive, setGpsLive] = useState(false);
  const scale = useSharedValue(1);
  const pulse = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.55 - pulse.value * 0.15,
  }));

  useEffect(() => {
    if (!gpsLive) return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 1100, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 0 }),
      ),
      -1,
    );
  }, [gpsLive, pulse]);

  useEffect(() => {
    if (!booking.bookingRef) return;
    const poll = async () => {
      const ping = await getPartnerLiveLocation(booking.bookingRef!);
      setGpsLive(Boolean(ping));
    };
    void poll();
    const id = setInterval(() => void poll(), 8000);
    return () => clearInterval(id);
  }, [booking.bookingRef]);

  const initial = booking.maid.charAt(0);
  const imageId = getBookingImageId(booking.service);
  const steps = getSteps(booking, gpsLive);

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Next visit"
        title="Coming up soon"
        subtitle={`${booking.date} at ${booking.time}`}
        icon="navigate-outline"
        compact
      />

      <AnimatedPress
        style={[styles.card, anim]}
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 14, stiffness: 320 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 320 });
        }}
        onPress={() => openDetail(booking.id)}
        accessibilityRole="button"
        accessibilityLabel={`Upcoming ${booking.service}`}
      >
        <HomePhoto uri={getServiceImages(imageId)} style={styles.photo} overlay="none" tint={colors.primaryLight} />
        <LinearGradient
          colors={['rgba(15,20,25,0.1)', 'rgba(15,20,25,0.55)', 'rgba(15,20,25,0.92)']}
          locations={[0.2, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.topRow}>
          <View style={[styles.live, gpsLive && styles.liveOn]}>
            {gpsLive ? <Animated.View style={[styles.livePulse, pulseStyle]} /> : null}
            <View style={[styles.liveDot, gpsLive && styles.liveDotOn]} />
            <Text style={[styles.liveText, gpsLive && styles.liveTextOn]}>
              {gpsLive ? 'GPS LIVE' : 'UPCOMING'}
            </Text>
          </View>
          {booking.bookingRef ? (
            <View style={styles.ref}>
              <Text style={styles.refText}>{booking.bookingRef}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.bottom}>
          <View style={styles.proRow}>
            <View style={styles.avatar}>
              <Text style={styles.initial}>{initial}</Text>
            </View>
            <View style={styles.proCopy}>
              <Text style={styles.service}>{booking.service}</Text>
              <Text style={styles.maid}>
                {booking.maid}
                {booking.maidRating ? ` · ${booking.maidRating}★` : ''} · {booking.duration ?? '2 hrs'}
              </Text>
            </View>
            <Text style={styles.price}>{booking.price}</Text>
          </View>

          {booking.completionOtp ? (
            <View style={styles.otpStrip}>
              <Ionicons name="key" size={12} color="#FCD34D" />
              <Text style={styles.otpStripLabel}>Visit OTP</Text>
              <Text style={styles.otpStripCode}>{booking.completionOtp}</Text>
              {booking.completionOtp === DEMO_VISIT_COMPLETION_OTP ? (
                <View style={styles.otpDemoTag}>
                  <Text style={styles.otpDemoText}>DEMO</Text>
                </View>
              ) : null}
            </View>
          ) : null}

          <View style={styles.steps}>
            {steps.map((s, i) => (
              <View key={s.id} style={styles.stepWrap}>
                <View style={styles.stepCol}>
                  <View style={[styles.stepDot, s.done && styles.stepDotDone]}>
                    {s.done ? <Ionicons name="checkmark" size={10} color={colors.white} /> : null}
                  </View>
                  <Text style={[styles.stepLabel, s.done && styles.stepLabelDone]}>{s.label}</Text>
                </View>
                {i < steps.length - 1 ? (
                  <View style={[styles.stepLine, s.done && styles.stepLineDone]} />
                ) : null}
              </View>
            ))}
          </View>
        </View>
      </AnimatedPress>

      <View style={styles.actions}>
        <Pressable
          style={styles.actionBtn}
          onPress={() => openReschedule(booking.id)}
          accessibilityRole="button"
        >
          <Ionicons name="calendar-outline" size={16} color={colors.primaryDark} />
          <Text style={styles.actionText}>Reschedule</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, gpsLive && styles.actionBtnLive]}
          onPress={() => openTrack(booking.id)}
          accessibilityRole="button"
        >
          <Ionicons
            name={gpsLive ? 'navigate' : 'locate-outline'}
            size={16}
            color={gpsLive ? '#1570EF' : colors.primaryDark}
          />
          <Text style={[styles.actionText, gpsLive && styles.actionTextLive]}>
            {gpsLive ? 'Live map' : 'Track pro'}
          </Text>
        </Pressable>
        <Pressable
          style={styles.actionPrimary}
          onPress={() => openSupport({ chat: true, topic: `Message ${booking.maid}` })}
          accessibilityRole="button"
        >
          <LinearGradient colors={['#0B6E67', '#084F4A']} style={styles.actionGrad}>
            <Ionicons name="chatbubble-ellipses" size={15} color={colors.white} />
            <Text style={styles.actionPrimaryText}>Message</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const CARD_H = 268;

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  card: {
    marginHorizontal: layout.pad,
    height: CARD_H,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    backgroundColor: colors.bgSubtle,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  photo: { ...StyleSheet.absoluteFill },
  topRow: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  live: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    overflow: 'hidden',
  },
  liveOn: {
    backgroundColor: 'rgba(1,15,14,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.45)',
  },
  livePulse: {
    position: 'absolute',
    left: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(18,165,152,0.35)',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.mutedLight,
  },
  liveDotOn: { backgroundColor: '#6EE7B7' },
  liveText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.5,
  },
  liveTextOn: { color: '#6EE7B7' },
  ref: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  refText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.white,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
    gap: spacing.md,
    zIndex: 2,
  },
  proRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.primaryDark,
  },
  proCopy: { flex: 1, gap: 2 },
  service: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: -0.3,
  },
  maid: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.78)',
  },
  price: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: '#6EE7B7',
    letterSpacing: -0.4,
  },
  otpStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(252,211,77,0.15)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.3)',
    marginBottom: spacing.sm,
  },
  otpStripLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
  },
  otpStripCode: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: '#FCD34D',
    letterSpacing: 1,
  },
  otpDemoTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  otpDemoText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: '#FCD34D',
    letterSpacing: 0.5,
  },
  steps: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  stepWrap: { flex: 1, flexDirection: 'row', alignItems: 'flex-start' },
  stepCol: { flex: 1, alignItems: 'center', gap: 4 },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  stepDotDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  stepLabel: {
    fontFamily: fonts.medium,
    fontSize: 8,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  stepLabelDone: { color: 'rgba(255,255,255,0.9)', fontFamily: fonts.semiBold },
  stepLine: {
    width: 12,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginTop: 9,
  },
  stepLineDone: { backgroundColor: 'rgba(110,231,183,0.6)' },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: layout.pad,
    marginTop: spacing.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    paddingVertical: 13,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  actionText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  actionBtnLive: {
    backgroundColor: '#EFF8FF',
    borderColor: 'rgba(21,112,239,0.25)',
  },
  actionTextLive: { color: '#1570EF' },
  actionPrimary: {
    flex: 1.15,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  actionGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 13,
  },
  actionPrimaryText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
  },
});
