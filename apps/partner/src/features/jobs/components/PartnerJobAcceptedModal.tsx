import { Ionicons } from '@expo/vector-icons';

import * as Haptics from 'expo-haptics';

import { LinearGradient } from 'expo-linear-gradient';

import { useEffect } from 'react';

import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import Animated, {

  FadeIn,

  FadeInDown,

  ZoomIn,

  useAnimatedStyle,

  useSharedValue,

  withRepeat,

  withSequence,

  withTiming,

} from 'react-native-reanimated';

import { useSafeAreaInsets } from 'react-native-safe-area-context';



import type { PartnerJob } from '@/constants/demo';

import { formatRs, netEarningPaise } from '@/features/home/lib/home.greeting';

import { fonts } from '@/theme/fonts';

import { colors } from '@/theme/colors';

import { layout, radius, shadow, spacing } from '@/theme/spacing';



interface PartnerJobAcceptedModalProps {

  visible: boolean;

  job: PartnerJob | null;

  onClose: () => void;

  onViewSchedule: () => void;

}



const NEXT_STEPS = [

  'Customer app bridge sync — pro assigned notify',

  'Start visit par live GPS + track screen update',

  'OTP complete par customer booking close + payout batch',

];



export function PartnerJobAcceptedModal({

  visible,

  job,

  onClose,

  onViewSchedule,

}: PartnerJobAcceptedModalProps) {

  const insets = useSafeAreaInsets();

  const { height: screenH, width: screenW } = useWindowDimensions();

  const compact = screenW < 360;

  const cardMaxH = Math.min(screenH * 0.72, 520);

  const ringScale = useSharedValue(1);



  useEffect(() => {

    if (!visible) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    ringScale.value = withRepeat(

      withSequence(

        withTiming(1.06, { duration: 700 }),

        withTiming(1, { duration: 700 }),

      ),

      -1,

      true,

    );

  }, [visible, ringScale]);



  const ringStyle = useAnimatedStyle(() => ({

    transform: [{ scale: ringScale.value }],

  }));



  if (!job) return null;



  const net = netEarningPaise(job.amountPaise);



  const close = () => {

    Haptics.selectionAsync();

    onClose();

  };



  const viewSchedule = () => {

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    onViewSchedule();

  };



  return (

    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>

      <Animated.View

        entering={FadeIn.duration(220)}

        style={[

          styles.backdrop,

          { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.sm },

        ]}

      >

        <Animated.View

          entering={FadeInDown.duration(320).springify()}

          style={[styles.card, { maxHeight: cardMaxH }]}

        >

          <LinearGradient colors={['#FFFBEB', '#FFFFFF', '#F8FDFC']} style={styles.cardBg} />

          <View style={styles.goldBar} />



          <ScrollView

            showsVerticalScrollIndicator={false}

            bounces={false}

            keyboardShouldPersistTaps="handled"

            contentContainerStyle={styles.scroll}

          >

            <Animated.View entering={ZoomIn.delay(80).duration(360).springify()} style={styles.iconWrap}>

              <Animated.View style={[styles.iconRing, ringStyle]}>

                <LinearGradient

                  colors={['rgba(217,119,6,0.2)', 'rgba(252,211,77,0.06)']}

                  style={styles.iconRingGrad}

                />

              </Animated.View>

              <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.iconGrad}>

                <Ionicons name="checkmark" size={compact ? 24 : 28} color={colors.white} />

              </LinearGradient>

            </Animated.View>



            <View style={styles.badge}>

              <Ionicons name="sparkles" size={10} color={colors.partnerGold} />

              <Text style={styles.badgeText}>CONFIRMED</Text>

            </View>



            <Text style={[styles.title, compact && styles.titleCompact]}>You&apos;re booked!</Text>

            <Text style={styles.sub} numberOfLines={2}>

              {job.bookingRef} added to your schedule

            </Text>



            <View style={styles.earnCard}>

              <LinearGradient colors={['#084F4A', '#0B6E67']} style={StyleSheet.absoluteFill} />

              <View style={styles.earnLeft}>

                <Text style={styles.earnLabel}>You earn</Text>

                <Text style={styles.earnValue}>{formatRs(net)}</Text>

              </View>

              <Ionicons name="wallet-outline" size={18} color={colors.partnerGold} />

            </View>



            {job.customerBookingId ? (
              <View style={styles.bridgeStrip}>
                <LinearGradient colors={['#0F172A', '#1570EF']} style={StyleSheet.absoluteFill} />
                <Ionicons name="sync" size={14} color="#93C5FD" />
                <Text style={styles.bridgeStripText}>
                  Customer app notified · {job.customerName} sees you as assigned pro
                </Text>
              </View>
            ) : null}

            <View style={styles.summary}>

              <SummaryRow icon="sparkles-outline" text={job.service} />

              <SummaryRow icon="person-outline" text={job.customerName} />

              <SummaryRow icon="calendar-outline" text={`${job.visitDate} · ${job.slotLabel}`} />

              <SummaryRow icon="location-outline" text={`${job.address}, ${job.zone}`} lines={2} />

            </View>



            <View style={styles.points}>

              {NEXT_STEPS.map((p) => (

                <View key={p} style={styles.point}>

                  <Ionicons name="checkmark-circle" size={13} color={colors.primary} />

                  <Text style={styles.pointText}>{p}</Text>

                </View>

              ))}

            </View>

          </ScrollView>



          <View style={styles.footer}>

            <Pressable style={styles.primary} onPress={viewSchedule} accessibilityRole="button">

              <LinearGradient colors={['#084F4A', '#0B6E67']} style={StyleSheet.absoluteFill} />

              <Ionicons name="calendar-outline" size={16} color={colors.white} />

              <Text style={styles.primaryText}>View schedule</Text>

            </Pressable>

            <Pressable style={styles.secondary} onPress={close} accessibilityRole="button">

              <Text style={styles.secondaryText}>Keep browsing</Text>

            </Pressable>

          </View>

        </Animated.View>

      </Animated.View>

    </Modal>

  );

}



function SummaryRow({

  icon,

  text,

  lines = 1,

}: {

  icon: keyof typeof Ionicons.glyphMap;

  text: string;

  lines?: number;

}) {

  return (

    <View style={styles.summaryRow}>

      <Ionicons name={icon} size={13} color={colors.primaryDark} />

      <Text style={styles.summaryText} numberOfLines={lines}>{text}</Text>

    </View>

  );

}



const styles = StyleSheet.create({

  backdrop: {

    flex: 1,

    backgroundColor: 'rgba(1,15,14,0.62)',

    justifyContent: 'center',

    paddingHorizontal: layout.pad,

  },

  card: {

    borderRadius: radius.xxl,

    overflow: 'hidden',

    borderWidth: 1,

    borderColor: 'rgba(217,119,6,0.16)',

    ...shadow.lg,

  },

  cardBg: { ...StyleSheet.absoluteFill },

  goldBar: {

    position: 'absolute',

    top: 0,

    left: 0,

    right: 0,

    height: 3,

    backgroundColor: colors.partnerGold,

    zIndex: 1,

  },

  scroll: {

    paddingHorizontal: spacing.lg,

    paddingTop: spacing.lg,

    paddingBottom: spacing.sm,

    gap: spacing.sm,

  },

  iconWrap: { alignItems: 'center' },

  iconRing: {

    position: 'absolute',

    width: 64,

    height: 64,

    borderRadius: 32,

    overflow: 'hidden',

  },

  iconRingGrad: { flex: 1 },

  iconGrad: {

    width: 52,

    height: 52,

    borderRadius: 26,

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: 2,

    borderColor: 'rgba(255,255,255,0.3)',

  },

  badge: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 4,

    alignSelf: 'center',

    backgroundColor: colors.partnerGoldBg,

    paddingHorizontal: 10,

    paddingVertical: 4,

    borderRadius: radius.pill,

  },

  badgeText: {

    fontFamily: fonts.bold,

    fontSize: 9,

    color: colors.partnerGold,

    letterSpacing: 0.8,

  },

  title: {

    fontFamily: fonts.extraBold,

    fontSize: 20,

    color: colors.ink,

    textAlign: 'center',

    letterSpacing: -0.4,

  },

  titleCompact: { fontSize: 18 },

  sub: {

    fontFamily: fonts.medium,

    fontSize: 12,

    color: colors.muted,

    textAlign: 'center',

    lineHeight: 17,

  },

  earnCard: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    borderRadius: radius.lg,

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.sm + 2,

    overflow: 'hidden',

  },

  earnLeft: { gap: 1 },

  earnLabel: { fontFamily: fonts.medium, fontSize: 10, color: 'rgba(255,255,255,0.7)' },

  earnValue: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.partnerGold, letterSpacing: -0.3 },

  bridgeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.3)',
  },

  bridgeStripText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 15,
  },

  summary: {

    backgroundColor: colors.white,

    borderRadius: radius.lg,

    padding: spacing.md,

    gap: 6,

    borderWidth: StyleSheet.hairlineWidth,

    borderColor: 'rgba(15,20,25,0.06)',

  },

  summaryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },

  summaryText: { flex: 1, fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink, lineHeight: 16 },

  points: { gap: 5, paddingTop: 2 },

  point: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },

  pointText: { flex: 1, fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },

  footer: {

    paddingHorizontal: spacing.lg,

    paddingTop: spacing.sm,

    paddingBottom: spacing.md,

    gap: 4,

    borderTopWidth: StyleSheet.hairlineWidth,

    borderTopColor: 'rgba(15,20,25,0.06)',

    backgroundColor: 'rgba(255,255,255,0.92)',

  },

  primary: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: spacing.sm,

    borderRadius: radius.pill,

    paddingVertical: 12,

    overflow: 'hidden',

  },

  primaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },

  secondary: { alignItems: 'center', paddingVertical: 6 },

  secondaryText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primaryDark },

});


