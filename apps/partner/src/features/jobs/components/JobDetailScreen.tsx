import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePartner } from '@/context/PartnerContext';
import { usePartnerAlert } from '@/context/PartnerAlertContext';
import type { PartnerJob } from '@/constants/demo';
import { formatRs } from '@/features/home/lib/home.greeting';
import { JobDetailSkeleton } from '@/components/ui/Skeleton';
import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';
import { passedToNextPartnerMessage } from '@/features/jobs/lib/decline.utils';
import { PartnerJobAcceptedModal } from '@/features/jobs/components/PartnerJobAcceptedModal';
import { PartnerJobDeclineModal } from '@/features/jobs/components/PartnerJobDeclineModal';
import { PartnerJobNavigateSheet } from '@/features/jobs/components/PartnerJobNavigateSheet';
import { PartnerCustomerBridgeJobCard } from '@/features/jobs/components/PartnerCustomerBridgeJobCard';
import { PartnerCustomerCancelBridgeCard } from '@/features/jobs/components/PartnerCustomerCancelBridgeCard';
import { PartnerCustomerRescheduleBridgeCard } from '@/features/jobs/components/PartnerCustomerRescheduleBridgeCard';
import { PartnerLifecycleBridgeCard } from '@/features/jobs/components/PartnerLifecycleBridgeCard';
import { PartnerLiveLocationCard } from '@/features/jobs/components/PartnerLiveLocationCard';
import { PartnerVisitStartModal } from '@/features/jobs/components/PartnerVisitStartModal';
import type { DeclineReasonId } from '@/features/jobs/constants/decline.premium';
import {
  canCallCustomer,
  customerTelUri,
  jobCustomerPhone,
  maskCustomerPhone,
} from '@/features/jobs/lib/job-contact.utils';
import {
  JOB_ASSURANCE,
  jobDisplayAddress,
  jobDurationLabel,
  jobEarningsBreakdown,
  jobNextSteps,
  jobResponseWindow,
  jobStatusMeta,
  jobTravelMins,
  serviceIcon,
} from '@/features/jobs/lib/job-detail.utils';
import { getPartnerJobById } from '@/features/jobs/lib/jobs.storage';
import { acceptBlockedMessage } from '@/features/kyc/lib/kyc.routing';
import { usePartnerPreferences } from '@/features/settings/hooks/usePartnerPreferences';
import { usePartnerI18n } from '@/i18n/usePartnerI18n';
import { usePartnerWorkAddress } from '@/features/profile/hooks/usePartnerWorkAddress';
import { useOpenSupportChat } from '@/features/support/hooks/useOpenSupportChat';
import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, shadow, spacing } from '@/theme/spacing';

const SHEET_OVERLAP = 14;
const FOOTER_ACTION_H = 52;

const VISIT_TIPS = [
  'Reach 10 min early — call customer from here',
  'Carry ID for premium visits',
  'Complete visit before payout is credited',
];

function formatRsPlain(paise: number) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

function InfoRow({
  icon,
  label,
  value,
  sub,
  compact,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  sub?: string;
  compact?: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, compact && styles.infoIconCompact]}>
        <Ionicons name={icon} size={compact ? 14 : 16} color={colors.primaryDark} />
      </View>
      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
        {sub ? <Text style={styles.infoSub}>{sub}</Text> : null}
      </View>
    </View>
  );
}

export function JobDetailScreen() {
  const { id, from: fromParam } = useLocalSearchParams<{ id: string; from?: string | string[] }>();
  const fromHistory = fromParam === 'history' || (Array.isArray(fromParam) && fromParam[0] === 'history');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isCompact, isNarrow, isShort } = useLayoutMetrics();
  const { defaultAddress } = usePartnerWorkAddress();
  const openSupportChat = useOpenSupportChat();
  const { alert } = usePartnerAlert();
  const { profile } = usePartner();
  const { acceptJob, declineJob, startVisit, canAcceptJobs } = usePartnerJobs();
  const { prefs } = usePartnerPreferences();
  const { t } = usePartnerI18n();
  const manualMode = !prefs.autoAssignOffers;
  const [job, setJob] = useState<PartnerJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAccepted, setShowAccepted] = useState(false);
  const [showStartVisit, setShowStartVisit] = useState(false);
  const [startingVisit, setStartingVisit] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [showNavigate, setShowNavigate] = useState(false);

  const stackEarn = isNarrow || isCompact;

  const load = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    const found = await getPartnerJobById(id);
    setJob(found);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const footerPad = useMemo(() => {
    if (!job) return spacing.lg;
    const showPendingFooter = job.status === 'pending' && manualMode;
    const hasFooter =
      showPendingFooter ||
      job.status === 'accepted' ||
      job.status === 'in_progress' ||
      (job.status === 'completed' && !fromHistory);
    // Footer sits outside ScrollView — only add safe-area padding when there is no footer bar.
    if (hasFooter) return spacing.sm;
    return insets.bottom + spacing.lg;
  }, [job, insets.bottom, fromHistory, manualMode]);

  if (loading) {
    return <JobDetailSkeleton />;
  }

  if (!job) {
    return (
      <View style={styles.missing}>
        <Ionicons name="alert-circle-outline" size={40} color={colors.muted} />
        <Text style={styles.missingTitle}>Job not found</Text>
        <Pressable style={styles.missingBtn} onPress={() => router.back()}>
          <Text style={styles.missingBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const status = jobStatusMeta(job.status);
  const { gross, net, fee } = jobEarningsBreakdown(job);
  const responseMins = jobResponseWindow(job);
  const isPending = job.status === 'pending';
  const isAccepted = job.status === 'accepted';
  const isInProgress = job.status === 'in_progress';
  const isCompleted = job.status === 'completed';
  const isDeclined = job.status === 'declined';
  const cardPad = isCompact ? spacing.md : spacing.lg;
  const duration = jobDurationLabel(job.service);
  const travelMins = jobTravelMins(job.distanceKm);
  const nextSteps = jobNextSteps(job.status);
  const zoneMatch = defaultAddress?.zone === job.zone;
  const { primary: addressPrimary, secondary: addressSecondary } = jobDisplayAddress(job);
  const showMapsActions = isPending || isAccepted || isInProgress;

  const accept = async () => {
    if (!canAcceptJobs) {
      alert({
        title: t('kycBlockTitle'),
        message: acceptBlockedMessage(profile?.kycStatus),
        variant: 'warning',
        icon: 'shield-outline',
        buttons: [
          { text: 'Later', style: 'cancel' },
          { text: 'Open KYC', onPress: () => router.push('/kyc' as Href) },
        ],
      });
      return;
    }
    const updated = await acceptJob(job.id);
    if (updated) {
      setJob(updated);
      setShowAccepted(true);
    }
  };

  const decline = () => {
    Haptics.selectionAsync();
    setShowDecline(true);
  };

  const confirmDecline = async (reasonId: DeclineReasonId) => {
    setDeclining(true);
    const updated = await declineJob(job.id, reasonId);
    setDeclining(false);
    setShowDecline(false);
    if (updated) {
      alert({
        title: 'Job agle partner ko gayi',
        message: passedToNextPartnerMessage(updated),
        variant: 'info',
        icon: 'swap-horizontal-outline',
        buttons: [{ text: 'OK', onPress: () => router.back() }],
      });
      return;
    }
    router.back();
  };

  const openMaps = () => {
    Haptics.selectionAsync();
    setShowNavigate(true);
  };

  const openStartVisit = () => {
    Haptics.selectionAsync();
    setShowStartVisit(true);
  };

  const confirmStartVisit = async () => {
    setStartingVisit(true);
    const updated = await startVisit(job.id);
    setStartingVisit(false);
    if (updated) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setJob(updated);
      setShowStartVisit(false);
    }
  };

  const openFinishVisit = () => {
    Haptics.selectionAsync();
    router.push(`/job/complete/${job.id}` as Href);
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#032A28', '#084F4A', '#0B6E67']}
        locations={[0, 0.5, 1]}
        style={[
          styles.header,
          { paddingTop: insets.top + spacing.xs },
          isShort && styles.headerShort,
        ]}
      >
        <View style={styles.headerGlowA} />
        <View style={styles.headerGlowB} />

        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={20} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>JOB DETAIL</Text>
            <Text
              style={[styles.headerTitle, isCompact && styles.headerTitleCompact]}
              numberOfLines={2}
            >
              {job.service}
            </Text>
          </View>
          <View
            style={[
              styles.statusChip,
              { backgroundColor: `${status.accent}22`, borderColor: `${status.accent}44` },
            ]}
          >
            <Ionicons name={status.icon} size={12} color={status.accent} />
          </View>
        </View>

        <View style={styles.statBar}>
          <View style={styles.statChip}>
            <Text style={[styles.statNum, isCompact && styles.statNumCompact]} numberOfLines={1}>
              {job.visitDate}
            </Text>
            <Text style={styles.statLabel}>Visit</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text style={[styles.statNum, isCompact && styles.statNumCompact]} numberOfLines={1}>
              {job.distanceKm ?? '—'} km
            </Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text
              style={[styles.statNum, styles.statEarn, isCompact && styles.statNumCompact]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {formatRs(net)}
            </Text>
            <Text style={styles.statLabel}>You earn</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: footerPad }}
      >
        <View style={styles.sheet}>
          <LinearGradient
            colors={['rgba(255,255,255,0.92)', colors.white]}
            style={styles.sheetFade}
            pointerEvents="none"
          />
          <View style={styles.sheetHandle} />

          {isPending && manualMode && responseMins ? (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.timerBanner}>
              <Ionicons name="timer-outline" size={15} color={colors.warning} />
              <Text style={styles.timerText} numberOfLines={2}>
                Requests tab se ~{responseMins} min mein Accept ya Decline karein
              </Text>
            </Animated.View>
          ) : null}

          {isPending && !manualMode ? (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.arriveBanner}>
              <Ionicons name="flash-outline" size={16} color={colors.partnerGold} />
              <Text style={styles.arriveText} numberOfLines={3}>
                Auto-assign ON — match hone par yeh visit Schedule par confirm ho jayegi. Accept/Decline
                Requests tab par nahi, yahan sirf details hain.
              </Text>
            </Animated.View>
          ) : null}

          {isAccepted ? (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.arriveBanner}>
              <Ionicons name="navigate-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.arriveText} numberOfLines={2}>
                Arrived at the address? Tap Start visit below when you begin work.
              </Text>
            </Animated.View>
          ) : null}

          {isInProgress ? (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.liveBanner}>
              <View style={styles.livePulse}>
                <View style={styles.liveDot} />
              </View>
              <View style={styles.liveCopy}>
                <Text style={styles.liveTitle}>Visit in progress</Text>
                <Text style={styles.liveSub} numberOfLines={2}>
                  Kaam khatam ho? Niche Finish visit dabao aur customer ka OTP daalo
                </Text>
              </View>
            </Animated.View>
          ) : null}

          <Animated.View
            entering={FadeInDown.delay(40).duration(320)}
            style={[styles.earnCard, { padding: cardPad }]}
          >
            <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={StyleSheet.absoluteFill} />
            <View style={styles.earnGlow} />

            <View style={[styles.earnTop, stackEarn && styles.earnTopStack]}>
              <View style={styles.earnTopMain}>
                <View style={[styles.serviceIcon, isCompact && styles.serviceIconCompact]}>
                  <Ionicons
                    name={serviceIcon(job.service)}
                    size={isCompact ? 17 : 20}
                    color={colors.partnerGold}
                  />
                </View>
                <View style={styles.earnCopy}>
                  <Text style={styles.earnRef} numberOfLines={1}>{job.bookingRef}</Text>
                  <Text style={[styles.earnService, isCompact && styles.earnServiceCompact]} numberOfLines={2}>
                    {job.service}
                  </Text>
                </View>
              </View>
              <View style={[styles.statusPill, { backgroundColor: status.tone }, stackEarn && styles.statusPillStack]}>
                <Text style={[styles.statusPillText, { color: status.ink }]} numberOfLines={1}>
                  {status.label}
                </Text>
              </View>
            </View>

            <View style={[styles.earnBreakdown, stackEarn && styles.earnBreakdownStack]}>
              <View style={[styles.earnCol, stackEarn && styles.earnColRow]}>
                <Text style={styles.earnColLabel}>Gross</Text>
                <Text style={styles.earnColVal} numberOfLines={1}>{formatRsPlain(gross)}</Text>
              </View>
              {!stackEarn ? <View style={styles.earnColDivider} /> : null}
              <View style={[styles.earnCol, stackEarn && styles.earnColRow]}>
                <Text style={styles.earnColLabel}>Fee (10%)</Text>
                <Text style={styles.earnColVal} numberOfLines={1}>-{formatRsPlain(fee)}</Text>
              </View>
              {!stackEarn ? <View style={styles.earnColDivider} /> : null}
              <View style={[styles.earnCol, stackEarn && styles.earnColRow]}>
                <Text style={styles.earnColLabel}>You earn</Text>
                <Text style={styles.earnColNet} numberOfLines={1}>{formatRsPlain(net)}</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(60).duration(300)} style={styles.chipsRow}>
            <View style={styles.chip}>
              <Ionicons name="calendar-outline" size={11} color={colors.primary} />
              <Text style={styles.chipText} numberOfLines={1}>{job.visitDate}</Text>
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
            <View style={[styles.chip, zoneMatch && styles.chipMatch]}>
              <Ionicons
                name={zoneMatch ? 'checkmark-circle' : 'location-outline'}
                size={11}
                color={zoneMatch ? colors.primaryDark : colors.primary}
              />
              <Text style={[styles.chipText, zoneMatch && styles.chipMatchText]} numberOfLines={1}>
                {job.zone}
              </Text>
            </View>
          </Animated.View>

          {job.customerBookingId ? <PartnerCustomerBridgeJobCard job={job} /> : null}
          <PartnerCustomerRescheduleBridgeCard job={job} />
          {isDeclined ? <PartnerCustomerCancelBridgeCard job={job} /> : null}

          <Animated.View entering={FadeInDown.delay(80).duration(320)} style={[styles.sectionCard, { padding: cardPad }]}>
            <Text style={styles.sectionEyebrow}>CUSTOMER</Text>
            <View style={styles.customerRow}>
              <LinearGradient
                colors={['#6EE7B7', '#34D399']}
                style={[styles.customerAvatar, isCompact && styles.customerAvatarCompact]}
              >
                <Text style={[styles.customerInitial, isCompact && styles.customerInitialCompact]}>
                  {job.customerName.charAt(0)}
                </Text>
              </LinearGradient>
              <View style={styles.customerCopy}>
                <Text style={styles.customerName} numberOfLines={1}>{job.customerName}</Text>
                <Text style={styles.customerSub} numberOfLines={2}>
                  {canCallCustomer(job)
                    ? maskCustomerPhone(jobCustomerPhone(job))
                    : 'Verified customer · Raipur'}
                </Text>
              </View>
              <Pressable
                style={[styles.callBtn, !canCallCustomer(job) && styles.callBtnDisabled]}
                onPress={() => {
                  Haptics.selectionAsync();
                  if (!canCallCustomer(job)) return;
                  void Linking.openURL(customerTelUri(jobCustomerPhone(job)));
                }}
                disabled={!canCallCustomer(job)}
              >
                <Ionicons
                  name="call-outline"
                  size={17}
                  color={canCallCustomer(job) ? colors.primaryDark : colors.mutedLight}
                />
              </Pressable>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).duration(320)} style={[styles.sectionCard, { padding: cardPad }]}>
            <Text style={styles.sectionEyebrow}>VISIT DETAILS</Text>
            <InfoRow
              compact={isCompact}
              icon="calendar-outline"
              label="When"
              value={job.visitDate}
              sub={job.slotLabel}
            />
            <View style={styles.cardDivider} />
            <InfoRow
              compact={isCompact}
              icon="location-outline"
              label="Address"
              value={addressPrimary}
              sub={addressSecondary}
            />
            {duration ? (
              <>
                <View style={styles.cardDivider} />
                <InfoRow compact={isCompact} icon="hourglass-outline" label="Duration" value={duration} />
              </>
            ) : null}
            {showMapsActions && travelMins ? (
              <>
                <View style={styles.cardDivider} />
                <InfoRow
                  compact={isCompact}
                  icon="car-outline"
                  label="Est. travel"
                  value={`~${travelMins} min`}
                  sub="From your work address"
                />
              </>
            ) : null}
            <View style={styles.cardDivider} />
            <InfoRow compact={isCompact} icon="receipt-outline" label="Booking ID" value={job.bookingRef} />
            {showMapsActions ? (
              <Pressable style={styles.mapsBtn} onPress={openMaps}>
                <Ionicons name="navigate" size={15} color={colors.white} />
                <Text style={styles.mapsBtnText}>Directions</Text>
              </Pressable>
            ) : null}
          </Animated.View>

          {(isAccepted || isInProgress || isCompleted) ? (
            <PartnerLifecycleBridgeCard job={job} />
          ) : null}

          {isInProgress ? (
            <PartnerLiveLocationCard
              jobId={job.id}
              bookingRef={job.bookingRef}
              partnerName={profile?.name}
              active
            />
          ) : null}

          {nextSteps.length > 0 ? (
            <Animated.View entering={FadeInDown.delay(140).duration(320)} style={[styles.sectionCard, { padding: cardPad }]}>
              <Text style={styles.sectionEyebrow}>{"WHAT'S NEXT"}</Text>
              {nextSteps.map((step, index) => (
                <View key={step.text}>
                  {index > 0 ? <View style={styles.cardDivider} /> : null}
                  <View style={styles.nextRow}>
                    <View style={styles.nextIcon}>
                      <Ionicons name={step.icon} size={14} color={colors.primaryDark} />
                    </View>
                    <Text style={styles.nextText}>{step.text}</Text>
                  </View>
                </View>
              ))}
            </Animated.View>
          ) : null}

          {isDeclined && !job.declineReason?.toLowerCase().includes('customer') ? (
            <Animated.View entering={FadeInDown.delay(140).duration(300)} style={styles.declinedBanner}>
              <Ionicons name="information-circle-outline" size={16} color={colors.muted} />
              <Text style={styles.declinedText}>
                This request was declined and returned to the dispatch pool.
              </Text>
            </Animated.View>
          ) : null}

          {showMapsActions ? (
            <Animated.View entering={FadeInDown.delay(160).duration(320)} style={[styles.tipsCard, { padding: cardPad }]}>
              <View style={styles.tipsHead}>
                <Ionicons name="bulb-outline" size={15} color={colors.partnerGold} />
                <Text style={styles.tipsTitle}>Before you go</Text>
              </View>
              {VISIT_TIPS.map((tip) => (
                <View key={tip} style={styles.tipRow}>
                  <Ionicons name="checkmark-circle" size={13} color={colors.primary} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </Animated.View>
          ) : null}

          <Animated.View entering={FadeInDown.delay(180).duration(300)} style={[styles.sectionCard, { padding: cardPad }]}>
            <Text style={styles.sectionEyebrow}>PAYOUT & SUPPORT</Text>
            {JOB_ASSURANCE.map((item, index) => (
              <View key={item.title}>
                {index > 0 ? <View style={styles.cardDivider} /> : null}
                <Pressable
                  style={({ pressed }) => [styles.assuranceRow, pressed && item.topic && styles.assurancePressed]}
                  onPress={
                    item.topic
                      ? () =>
                          openSupportChat({
                            topic: item.topic!,
                            jobId: job.id,
                            context: `${job.bookingRef} · ${job.service}`,
                          })
                      : undefined
                  }
                  disabled={!item.topic}
                >
                  <View style={styles.assuranceIcon}>
                    <Ionicons name={item.icon} size={15} color={colors.primaryDark} />
                  </View>
                  <View style={styles.assuranceCopy}>
                    <Text style={styles.assuranceTitle}>{item.title}</Text>
                    <Text style={styles.assuranceSub}>{item.sub}</Text>
                  </View>
                  {item.topic ? (
                    <Ionicons name="chevron-forward" size={14} color={colors.mutedLight} />
                  ) : null}
                </Pressable>
              </View>
            ))}
          </Animated.View>
        </View>
      </ScrollView>

      {isPending && manualMode ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <Pressable style={styles.declineBtn} onPress={decline}>
            <Ionicons name="close" size={15} color={colors.muted} />
            <Text style={styles.declineText}>Decline</Text>
          </Pressable>
          <Pressable style={styles.acceptBtn} onPress={() => void accept()}>
            <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.acceptGrad}>
              <Ionicons name="checkmark" size={17} color={colors.white} />
              <Text style={styles.acceptText} numberOfLines={1}>Accept</Text>
            </LinearGradient>
          </Pressable>
        </View>
      ) : isPending && !manualMode ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <Pressable
            style={[styles.acceptBtn, styles.acceptBtnFull]}
            onPress={() => router.replace('/(tabs)' as Href)}
          >
            <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.acceptGrad}>
              <Ionicons name="briefcase-outline" size={17} color={colors.white} />
              <Text style={styles.acceptText} numberOfLines={1}>Jobs tab par jao</Text>
            </LinearGradient>
          </Pressable>
        </View>
      ) : isAccepted ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <Pressable style={styles.footerMapsBtn} onPress={openMaps}>
            <Ionicons name="navigate-outline" size={16} color={colors.primary} />
            <Text style={styles.footerMapsText} numberOfLines={1}>Maps</Text>
          </Pressable>
          <Pressable style={styles.acceptBtn} onPress={openStartVisit}>
            <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.acceptGrad}>
              <Ionicons name="play-circle" size={17} color={colors.white} />
              <Text style={styles.acceptText} numberOfLines={1}>Start visit</Text>
            </LinearGradient>
          </Pressable>
        </View>
      ) : isInProgress ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <Pressable style={styles.footerMapsBtn} onPress={openMaps}>
            <Ionicons name="navigate-outline" size={16} color={colors.primary} />
            <Text style={styles.footerMapsText} numberOfLines={1}>Maps</Text>
          </Pressable>
          <Pressable style={styles.acceptBtn} onPress={openFinishVisit}>
            <LinearGradient colors={['#175CD3', '#1570EF']} style={styles.acceptGrad}>
              <Ionicons name="checkmark-done" size={17} color={colors.white} />
              <Text style={styles.acceptText} numberOfLines={1}>Finish visit</Text>
            </LinearGradient>
          </Pressable>
        </View>
      ) : isCompleted && !fromHistory ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <Pressable
            style={[styles.acceptBtn, styles.acceptBtnFull]}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/earnings',
                params: { jobId: job.id },
              } as Href)
            }
          >
            <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.acceptGrad}>
              <Ionicons name="wallet-outline" size={17} color={colors.white} />
              <Text style={styles.acceptText} numberOfLines={1}>This visit earning</Text>
            </LinearGradient>
          </Pressable>
        </View>
      ) : null}

      <PartnerJobDeclineModal
        visible={showDecline}
        bookingRef={job.bookingRef}
        loading={declining}
        onClose={() => setShowDecline(false)}
        onConfirm={(reasonId) => void confirmDecline(reasonId)}
      />

      <PartnerJobNavigateSheet
        visible={showNavigate}
        job={job}
        onClose={() => setShowNavigate(false)}
      />

      <PartnerJobAcceptedModal
        visible={showAccepted}
        job={job}
        onClose={() => {
          setShowAccepted(false);
          router.back();
        }}
        onViewSchedule={() => {
          setShowAccepted(false);
          router.push('/(tabs)/schedule' as Href);
        }}
      />

      <PartnerVisitStartModal
        visible={showStartVisit}
        job={job}
        loading={startingVisit}
        onClose={() => setShowStartVisit(false)}
        onConfirm={() => void confirmStartVisit()}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    padding: layout.pad,
  },
  missingTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, textAlign: 'center' },
  missingBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  missingBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  header: {
    paddingHorizontal: layout.pad,
    paddingBottom: SHEET_OVERLAP + spacing.md,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  headerShort: { paddingBottom: SHEET_OVERLAP + spacing.sm },
  headerGlowA: {
    position: 'absolute',
    right: -20,
    top: -10,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(252,211,77,0.12)',
  },
  headerGlowB: {
    position: 'absolute',
    left: -30,
    bottom: -8,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(110,231,183,0.12)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1, gap: 2, minWidth: 0 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(252,211,77,0.9)',
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  headerTitleCompact: { fontSize: 16, lineHeight: 20 },
  statusChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  statBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(110,231,183,0.1)',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.22)',
  },
  statChip: { flex: 1, alignItems: 'center', gap: 1, minWidth: 0, paddingHorizontal: 2 },
  statNum: { fontFamily: fonts.extraBold, fontSize: 12, color: colors.white, textAlign: 'center' },
  statNumCompact: { fontSize: 11 },
  statEarn: { color: colors.partnerGold },
  statLabel: { fontFamily: fonts.medium, fontSize: 8, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginVertical: 2,
  },
  scroll: { flex: 1, backgroundColor: colors.white },
  sheet: {
    marginTop: -SHEET_OVERLAP,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl + 6,
    borderTopRightRadius: radius.xxl + 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.xl,
    gap: spacing.md,
    overflow: 'hidden',
  },
  sheetFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(11,110,103,0.22)',
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  timerBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.warningBg,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(180,71,8,0.12)',
  },
  timerText: { flex: 1, fontFamily: fonts.semiBold, fontSize: 11, color: colors.warning, lineHeight: 15 },
  arriveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.18)',
  },
  arriveText: { flex: 1, fontFamily: fonts.medium, fontSize: 12, color: colors.primaryDark, lineHeight: 16 },
  liveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#EEF6FF',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(21,112,239,0.2)',
  },
  livePulse: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(21,112,239,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1570EF',
  },
  liveCopy: { flex: 1, gap: 2 },
  liveTitle: { fontFamily: fonts.bold, fontSize: 13, color: '#175CD3' },
  liveSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },
  earnCard: {
    borderRadius: radius.xxl,
    gap: spacing.md,
    overflow: 'hidden',
    ...shadow.md,
  },
  earnGlow: {
    position: 'absolute',
    right: -15,
    top: -15,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(252,211,77,0.18)',
  },
  earnTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  earnTopStack: { flexDirection: 'column', alignItems: 'stretch' },
  earnTopMain: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1, minWidth: 0 },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    flexShrink: 0,
  },
  serviceIconCompact: { width: 38, height: 38, borderRadius: 12 },
  earnCopy: { flex: 1, gap: 2, minWidth: 0 },
  earnRef: { fontFamily: fonts.bold, fontSize: 10, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.4 },
  earnService: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white, letterSpacing: -0.2 },
  earnServiceCompact: { fontSize: 14 },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    flexShrink: 0,
  },
  statusPillStack: { alignSelf: 'flex-start' },
  statusPillText: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 0.3 },
  earnBreakdown: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
  },
  earnBreakdownStack: {
    flexDirection: 'column',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  earnCol: { flex: 1, alignItems: 'center', gap: 2, minWidth: 0 },
  earnColRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: spacing.xs,
  },
  earnColLabel: { fontFamily: fonts.medium, fontSize: 9, color: 'rgba(255,255,255,0.6)' },
  earnColVal: { fontFamily: fonts.bold, fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  earnColNet: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.partnerGold },
  earnColDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: 2,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  sectionEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  customerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  customerAvatarCompact: { width: 40, height: 40, borderRadius: 20 },
  customerInitial: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.primaryDark },
  customerInitialCompact: { fontSize: 16 },
  customerCopy: { flex: 1, gap: 2, minWidth: 0 },
  customerName: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  customerSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  callBtnDisabled: { backgroundColor: colors.bgSubtle, opacity: 0.7 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoIconCompact: { width: 28, height: 28, borderRadius: 14 },
  infoCopy: { flex: 1, gap: 2, minWidth: 0 },
  infoLabel: { fontFamily: fonts.bold, fontSize: 10, color: colors.muted, letterSpacing: 0.4 },
  infoValue: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.ink,
    lineHeight: 19,
    flexShrink: 1,
  },
  infoSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 16 },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.xs,
  },
  mapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 10,
  },
  mapsBtnText: { fontFamily: fonts.bold, fontSize: 13, color: colors.white },
  tipsCard: {
    backgroundColor: colors.partnerGoldBg,
    borderRadius: radius.xl,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(217,119,6,0.12)',
  },
  tipsHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 2 },
  tipsTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  tipText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 16 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    maxWidth: '100%',
  },
  chipMatch: { backgroundColor: '#E6F4F2', borderWidth: 1, borderColor: 'rgba(11,110,103,0.15)' },
  chipText: { fontFamily: fonts.semiBold, fontSize: 10, color: colors.primaryDark },
  chipMatchText: { color: colors.primaryDark },
  nextRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  nextIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  nextText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 17 },
  declinedBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.bgMuted,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  declinedText: { flex: 1, fontFamily: fonts.medium, fontSize: 12, color: colors.muted, lineHeight: 17 },
  assuranceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  assurancePressed: { opacity: 0.85 },
  assuranceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  assuranceCopy: { flex: 1, gap: 2, minWidth: 0 },
  assuranceTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  assuranceSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  declineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: FOOTER_ACTION_H,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  declineText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.muted },
  footerMapsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: FOOTER_ACTION_H,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  footerMapsText: { fontFamily: fonts.bold, fontSize: 13, color: colors.primary },
  liveFooterPill: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: FOOTER_ACTION_H,
    borderRadius: radius.pill,
    backgroundColor: '#EEF6FF',
    borderWidth: 1,
    borderColor: 'rgba(21,112,239,0.25)',
  },
  liveFooterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1570EF',
  },
  liveFooterText: { fontFamily: fonts.bold, fontSize: 13, color: '#175CD3' },
  acceptBtn: { flex: 1.5, borderRadius: radius.pill, overflow: 'hidden', minWidth: 0 },
  acceptBtnFull: { flex: 1 },
  acceptGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: FOOTER_ACTION_H,
    paddingHorizontal: spacing.sm,
  },
  acceptText: { fontFamily: fonts.bold, fontSize: 13, color: colors.white, flexShrink: 1 },
});
