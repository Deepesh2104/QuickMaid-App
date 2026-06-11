import { Ionicons } from '@expo/vector-icons';

import * as Haptics from 'expo-haptics';

import { LinearGradient } from 'expo-linear-gradient';

import { type Href, useRouter } from 'expo-router';

import { Pressable, StyleSheet, Text, View } from 'react-native';



import type { PartnerJob } from '@/constants/demo';

import { formatRs, netEarningPaise } from '@/features/home/lib/home.greeting';

import { useOfferCountdown } from '@/features/jobs/hooks/useOfferCountdown';
import { formatOfferCountdown } from '@/features/jobs/lib/offer-expiry.utils';
import { responseMinutesLeft } from '@/features/jobs/lib/requests.utils';
import { usePartnerI18n } from '@/i18n/usePartnerI18n';

import { fonts } from '@/theme/fonts';

import { colors } from '@/theme/colors';

import { radius, shadow, spacing } from '@/theme/spacing';



interface PartnerRequestCardProps {

  job: PartnerJob;

  compact?: boolean;

  /** Tighter inbox layout for Requests tab (not the large premium card). */
  dense?: boolean;

  /** Live countdown for manual pending offers */
  showOfferTimer?: boolean;

  premium?: boolean;

  onAccept?: () => void;

  onDecline?: () => void;

}



function serviceIcon(service: string): keyof typeof Ionicons.glyphMap {

  if (service.toLowerCase().includes('deep')) return 'sparkles';

  if (service.toLowerCase().includes('kitchen')) return 'restaurant-outline';

  return 'home-outline';

}



export function PartnerRequestCard({
  job,
  compact = false,
  dense = false,
  showOfferTimer = false,
  premium = false,
  onAccept,
  onDecline,
}: PartnerRequestCardProps) {

  const router = useRouter();
  const { t } = usePartnerI18n();

  const net = netEarningPaise(job.amountPaise);

  const showActions = !compact && onAccept && onDecline;

  const mins = responseMinutesLeft(job.id);
  const { secondsLeft, expired } = useOfferCountdown(job.id, showOfferTimer && !!showActions);



  const openDetail = () => {

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    router.push(`/job/${job.id}` as Href);

  };



  if (premium) {

    return (

      <View style={styles.premiumCard}>

        <LinearGradient colors={['#FFFBEB', colors.white]} style={styles.premiumTopGrad} />

        <View style={styles.premiumGoldStrip} />

        <Pressable onPress={openDetail} style={({ pressed }) => [styles.premiumBody, pressed && styles.pressed]}>

          <View style={styles.premiumHead}>

            <View style={styles.premiumRef}>

              <Text style={styles.premiumRefText}>{job.bookingRef}</Text>

            </View>

            <View style={styles.premiumTimer}>

              <Ionicons name="timer-outline" size={11} color={colors.warning} />

              <Text style={styles.premiumTimerText}>{mins}m</Text>

            </View>

            <View style={styles.newTagPremium}>

              <Text style={styles.newTextPremium}>NEW</Text>

            </View>

          </View>



          <View style={styles.premiumMain}>

            <View style={styles.premiumIcon}>

              <Ionicons name={serviceIcon(job.service)} size={20} color={colors.partnerGold} />

            </View>

            <View style={styles.premiumCopy}>

              <Text style={styles.premiumService} numberOfLines={1}>{job.service}</Text>

              <View style={styles.premiumCustomerRow}>

                <View style={styles.premiumAvatar}>

                  <Text style={styles.premiumAvatarText}>{job.customerName.charAt(0)}</Text>

                </View>

                <Text style={styles.premiumCustomer} numberOfLines={1}>{job.customerName}</Text>

              </View>

            </View>

            <View style={styles.premiumEarnCol}>

              <Text style={styles.premiumEarnLabel}>You earn</Text>

              <Text style={styles.premiumEarn}>{formatRs(net)}</Text>

            </View>

          </View>



          <View style={styles.premiumAddressRow}>

            <Ionicons name="location-outline" size={14} color={colors.muted} />

            <Text style={styles.premiumAddress} numberOfLines={1}>{job.address}</Text>

          </View>



          <View style={styles.premiumChips}>

            <View style={styles.chip}>

              <Ionicons name="calendar-outline" size={11} color={colors.primary} />

              <Text style={styles.chipText}>{job.visitDate}</Text>

            </View>

            <View style={styles.chip}>

              <Ionicons name="time-outline" size={11} color={colors.primary} />

              <Text style={styles.chipText} numberOfLines={1}>{job.slotLabel}</Text>

            </View>

            {job.distanceKm ? (

              <View style={styles.chip}>

                <Ionicons name="navigate-outline" size={11} color={colors.primary} />

                <Text style={styles.chipText}>{job.distanceKm} km</Text>

              </View>

            ) : null}

            <View style={[styles.chip, styles.chipZone]}>

              <Text style={styles.chipZoneText}>{job.zone}</Text>

            </View>

          </View>

        </Pressable>



        {showActions ? (

          <View style={styles.premiumActions}>

            <Pressable

              style={styles.declineBtnPremium}

              onPress={() => {

                Haptics.selectionAsync();

                onDecline();

              }}

            >

              <Ionicons name="close" size={16} color={colors.muted} />

              <Text style={styles.declineTextPremium}>Decline</Text>

            </Pressable>

            <Pressable

              style={styles.acceptBtnPremium}

              onPress={() => {

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                onAccept();

              }}

            >

              <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.acceptGradPremium}>

                <Ionicons name="checkmark" size={16} color={colors.white} />

                <Text style={styles.acceptTextPremium}>Accept job</Text>

              </LinearGradient>

            </Pressable>

          </View>

        ) : null}

      </View>

    );

  }



  return (

    <View style={styles.card}>

      <View style={styles.accent} />



      <View style={styles.main}>

        <Pressable

          onPress={openDetail}

          style={({ pressed }) => [styles.body, dense && styles.bodyDense, pressed && styles.pressed]}

          accessibilityRole="button"

          accessibilityLabel={`Request ${job.bookingRef}`}

        >

          <View style={styles.row1}>

            <View style={[styles.icon, dense && styles.iconDense]}>

              <Ionicons name={serviceIcon(job.service)} size={dense ? 14 : 16} color={colors.partnerGold} />

            </View>

            <Text style={styles.service} numberOfLines={1}>{job.service}</Text>

            <Text style={styles.earn}>{formatRs(net)}</Text>

          </View>



          <Text style={styles.line2} numberOfLines={1}>

            {job.customerName} · {job.zone}

          </Text>



          <View style={styles.row3}>

            <Text style={styles.meta} numberOfLines={1}>

              {job.visitDate} · {job.slotLabel}

              {job.distanceKm ? ` · ${job.distanceKm} km` : ''}

            </Text>

            {showOfferTimer && showActions ? (
              <View style={[styles.newTag, expired && styles.timerTagExpired]}>
                <Ionicons
                  name="timer-outline"
                  size={9}
                  color={expired ? colors.error : colors.partnerGold}
                />
                <Text style={[styles.newText, expired && styles.timerTextExpired]}>
                  {expired ? 'EXP' : formatOfferCountdown(secondsLeft)}
                </Text>
              </View>
            ) : (
              <View style={styles.newTag}>
                <Text style={styles.newText}>NEW</Text>
              </View>
            )}

          </View>

        </Pressable>



        {showActions && !expired ? (

          <View style={[styles.actions, dense && styles.actionsDense]}>

            <Pressable

              style={[styles.declineBtn, dense && styles.declineBtnDense]}

              onPress={() => {

                Haptics.selectionAsync();

                onDecline();

              }}

            >

              <Text style={styles.declineText}>Decline</Text>

            </Pressable>

            <Pressable

              style={styles.acceptBtn}

              onPress={() => {

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                onAccept();

              }}

            >

              <LinearGradient
                colors={['#084F4A', '#0B6E67']}
                style={[styles.acceptGrad, dense && styles.acceptGradDense]}
              >

                <Text style={styles.acceptText}>Accept</Text>

              </LinearGradient>

            </Pressable>

          </View>

        ) : showActions && expired ? (
          <View style={[styles.expiredRow, dense && styles.expiredRowDense]}>
            <Ionicons name="time-outline" size={12} color={colors.error} />
            <Text style={styles.expiredText}>{t('offerWindowClosed')}</Text>
          </View>
        ) : null}

      </View>

    </View>

  );

}



const styles = StyleSheet.create({

  card: {

    flexDirection: 'row',

    backgroundColor: colors.white,

    borderRadius: radius.lg,

    overflow: 'hidden',

    borderWidth: StyleSheet.hairlineWidth,

    borderColor: colors.border,

    ...shadow.sm,

  },

  accent: { width: 3, backgroundColor: colors.partnerGold },

  main: { flex: 1 },

  body: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm, gap: 4 },

  bodyDense: { paddingHorizontal: spacing.sm, paddingTop: spacing.sm, paddingBottom: spacing.xs, gap: 2 },

  pressed: { opacity: 0.92 },

  row1: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },

  icon: {

    width: 28,

    height: 28,

    borderRadius: 8,

    backgroundColor: colors.partnerGoldBg,

    alignItems: 'center',

    justifyContent: 'center',

  },

  iconDense: { width: 24, height: 24, borderRadius: 6 },

  service: {

    flex: 1,

    fontFamily: fonts.bold,

    fontSize: 14,

    color: colors.ink,

  },

  earn: {

    fontFamily: fonts.extraBold,

    fontSize: 15,

    color: colors.partnerGold,

  },

  line2: {

    fontFamily: fonts.medium,

    fontSize: 12,

    color: colors.muted,

    paddingLeft: 36,

  },

  row3: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: spacing.sm,

    paddingLeft: 36,

  },

  meta: {

    flex: 1,

    fontFamily: fonts.regular,

    fontSize: 11,

    color: colors.mutedLight,

  },

  newTag: {

    backgroundColor: colors.partnerGoldBg,

    paddingHorizontal: 6,

    paddingVertical: 2,

    borderRadius: 4,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 2,

  },

  timerTagExpired: { backgroundColor: '#FEF3F2' },

  newText: {

    fontFamily: fonts.bold,

    fontSize: 8,

    color: colors.partnerGold,

    letterSpacing: 0.4,

  },

  timerTextExpired: { color: colors.error },

  actions: {

    flexDirection: 'row',

    gap: spacing.sm,

    paddingHorizontal: spacing.md,

    paddingBottom: spacing.md,

    paddingTop: 2,

  },

  actionsDense: { paddingHorizontal: spacing.sm, paddingBottom: spacing.sm, gap: spacing.xs },
  expiredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.xs,
  },
  expiredRowDense: { paddingHorizontal: spacing.sm, paddingBottom: spacing.sm },
  expiredText: { fontFamily: fonts.medium, fontSize: 11, color: colors.error },

  declineBtn: {

    flex: 1,

    alignItems: 'center',

    paddingVertical: 9,

    borderRadius: radius.pill,

    backgroundColor: colors.bgSubtle,

    borderWidth: StyleSheet.hairlineWidth,

    borderColor: colors.border,

  },

  declineBtnDense: { paddingVertical: 7 },

  declineText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.muted },

  acceptBtn: { flex: 1.4, borderRadius: radius.pill, overflow: 'hidden' },

  acceptGrad: {

    alignItems: 'center',

    paddingVertical: 9,

  },

  acceptGradDense: { paddingVertical: 7 },

  acceptText: { fontFamily: fonts.bold, fontSize: 13, color: colors.white },

  premiumCard: {

    backgroundColor: colors.white,

    borderRadius: radius.xxl,

    overflow: 'hidden',

    borderWidth: StyleSheet.hairlineWidth,

    borderColor: 'rgba(217,119,6,0.15)',

    ...shadow.md,

  },

  premiumTopGrad: {

    position: 'absolute',

    top: 0,

    left: 0,

    right: 0,

    height: 56,

  },

  premiumGoldStrip: {

    position: 'absolute',

    top: 0,

    left: 0,

    right: 0,

    height: 3,

    backgroundColor: colors.partnerGold,

  },

  premiumBody: { padding: spacing.lg, gap: spacing.sm },

  premiumHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },

  premiumRef: {

    backgroundColor: colors.bgSubtle,

    paddingHorizontal: 8,

    paddingVertical: 4,

    borderRadius: radius.pill,

  },

  premiumRefText: { fontFamily: fonts.bold, fontSize: 10, color: colors.muted, letterSpacing: 0.3 },

  premiumTimer: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 3,

    backgroundColor: colors.warningBg,

    paddingHorizontal: 8,

    paddingVertical: 4,

    borderRadius: radius.pill,

  },

  premiumTimerText: { fontFamily: fonts.bold, fontSize: 10, color: colors.warning },

  newTagPremium: {

    marginLeft: 'auto',

    backgroundColor: colors.partnerGold,

    paddingHorizontal: 8,

    paddingVertical: 4,

    borderRadius: radius.pill,

  },

  newTextPremium: { fontFamily: fonts.bold, fontSize: 9, color: colors.white, letterSpacing: 0.5 },

  premiumMain: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },

  premiumIcon: {

    width: 44,

    height: 44,

    borderRadius: 14,

    backgroundColor: colors.partnerGoldBg,

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: 1,

    borderColor: 'rgba(217,119,6,0.15)',

  },

  premiumCopy: { flex: 1, minWidth: 0, gap: 4 },

  premiumService: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.ink, letterSpacing: -0.3 },

  premiumCustomerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  premiumAvatar: {

    width: 20,

    height: 20,

    borderRadius: 10,

    backgroundColor: colors.primaryLight,

    alignItems: 'center',

    justifyContent: 'center',

  },

  premiumAvatarText: { fontFamily: fonts.bold, fontSize: 10, color: colors.primary },

  premiumCustomer: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted, flex: 1 },

  premiumEarnCol: { alignItems: 'flex-end' },

  premiumEarnLabel: { fontFamily: fonts.medium, fontSize: 9, color: colors.muted },

  premiumEarn: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.partnerGold },

  premiumAddressRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  premiumAddress: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.muted },

  premiumChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },

  chip: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 4,

    backgroundColor: colors.primaryLight,

    paddingHorizontal: 8,

    paddingVertical: 4,

    borderRadius: radius.pill,

  },

  chipText: { fontFamily: fonts.semiBold, fontSize: 10, color: colors.primaryDark, maxWidth: 120 },

  chipZone: { backgroundColor: colors.bgSubtle },

  chipZoneText: { fontFamily: fonts.semiBold, fontSize: 10, color: colors.muted },

  premiumActions: {

    flexDirection: 'row',

    gap: spacing.sm,

    paddingHorizontal: spacing.lg,

    paddingBottom: spacing.lg,

    paddingTop: 2,

  },

  declineBtnPremium: {

    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 4,

    paddingVertical: 12,

    borderRadius: radius.pill,

    backgroundColor: colors.bgSubtle,

    borderWidth: StyleSheet.hairlineWidth,

    borderColor: colors.border,

  },

  declineTextPremium: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.muted },

  acceptBtnPremium: { flex: 1.6, borderRadius: radius.pill, overflow: 'hidden' },

  acceptGradPremium: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 6,

    paddingVertical: 12,

  },

  acceptTextPremium: { fontFamily: fonts.bold, fontSize: 13, color: colors.white },

});


