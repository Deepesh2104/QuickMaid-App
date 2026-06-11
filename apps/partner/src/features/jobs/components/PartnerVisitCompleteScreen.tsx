import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { FormScreenSkeleton } from '@/components/ui/Skeleton';
import { OtpInput } from '@/components/ui/OtpInput';
import { PartnerStackShell } from '@/components/ui/PartnerStackShell';
import { QmButton } from '@/components/ui/QmButton';
import type { PartnerJob } from '@/constants/demo';
import { formatRs, netEarningPaise } from '@/features/home/lib/home.greeting';
import { VISIT_COMPLETE_STEPS } from '@/features/jobs/constants/complete.premium';
import {
  VISIT_COMPLETE_DEMO_OTP,
  VISIT_COMPLETE_TIPS,
} from '@/features/jobs/constants/complete.premium';
import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';
import { getPartnerJobById } from '@/features/jobs/lib/jobs.storage';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import { PartnerVisitOtpUnifiedCard } from '@/features/jobs/components/PartnerVisitOtpUnifiedCard';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export function PartnerVisitCompleteScreen() {
  const router = useRouter();
  const { completeVisit } = usePartnerJobs();
  const { id: idParam } = useLocalSearchParams<{ id?: string | string[] }>();
  const jobId = typeof idParam === 'string' ? idParam : '';

  const [job, setJob] = useState<PartnerJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    void (async () => {
      const found = await getPartnerJobById(jobId);
      setJob(found);
      setLoading(false);
    })();
  }, [jobId]);

  if (loading) {
    return <FormScreenSkeleton />;
  }

  if (!job) {
    return (
      <View style={styles.loader}>
        <Text style={styles.missingTitle}>Job not found</Text>
        <QmButton label="Go back" variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  const net = netEarningPaise(job.amountPaise);

  const submit = async () => {
    if (otp.length !== 6 || submitting) return;
    setSubmitting(true);
    setError('');
    const result = await completeVisit(job.id, otp);
    setSubmitting(false);
    if (!result.ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(result.error);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setJob(result.job);
    setDone(true);
  };

  const stats = [
    { value: job.customerName.split(' ')[0], label: 'Customer' },
    { value: job.bookingRef, label: 'Booking' },
    { value: formatRs(net), label: 'You earn' },
  ];

  const headerExtra = (
    <View style={styles.liveBadge}>
      <View style={styles.liveDot} />
      <Text style={styles.liveText}>{done ? 'VISIT COMPLETE' : 'VISIT LIVE'}</Text>
    </View>
  );

  return (
    <PartnerStackShell
      eyebrow={done ? 'SUCCESS' : 'COMPLETION'}
      title={done ? 'Badhai ho!' : 'Finish visit'}
      subtitle={
        done
          ? `${formatRs(net)} Monday payout batch mein shamil hogi`
          : 'Customer ka 6-digit completion OTP daalo'
      }
      icon="checkmark-done"
      headerColors={
        done
          ? (['#032A28', '#084F4A', '#0B6E67'] as const)
          : (['#0C1E3F', '#175CD3', '#1570EF'] as const)
      }
      stats={stats}
      headerExtra={headerExtra}
      keyboardShouldPersistTaps="handled"
      sheetBg={done ? '#EFF8F7' : '#EFF6FF'}
      footer={
        done ? (
          <>
            <QmButton
              label="Earnings dekho"
              icon="wallet-outline"
              onPress={() =>
                router.replace({
                  pathname: '/(tabs)/earnings',
                  params: { jobId: job.id },
                } as Href)
              }
            />
            <QmButton
              label="Schedule par jao"
              icon="calendar-outline"
              variant="secondary"
              onPress={() => router.replace('/(tabs)/schedule' as Href)}
            />
          </>
        ) : (
          <>
            <QmButton
              label="Verify & finish visit"
              icon="checkmark-done"
              onPress={() => void submit()}
              loading={submitting}
              disabled={otp.length !== 6}
            />
            <Pressable style={styles.skipBtn} onPress={() => router.back()}>
              <Text style={styles.skipText}>Abhi kaam chal raha hai</Text>
            </Pressable>
          </>
        )
      }
    >
      {done ? (
        <Animated.View entering={FadeInDown.duration(320)} style={styles.successCard}>
          <Ionicons name="checkmark-circle" size={56} color={colors.success} />
          <Text style={styles.successTitle}>Visit verified!</Text>
          <Text style={styles.successSub}>
            {job.customerName} ne OTP confirm kiya. Earning ledger mein add ho gayi.
          </Text>
        </Animated.View>
      ) : (
        <>
          <Animated.View entering={FadeInDown.duration(280)} style={styles.block}>
            <PartnerRequestsSectionHeader
              eyebrow="Steps"
              title="Completion flow"
              icon="list-outline"
              compact
            />
            <View style={styles.stepsCard}>
              {VISIT_COMPLETE_STEPS.map((step, i) => (
                <View key={step.text} style={styles.stepRow}>
                  <View style={styles.stepNum}>
                    <Text style={styles.stepNumText}>{i + 1}</Text>
                  </View>
                  <Ionicons name={step.icon} size={16} color="#1570EF" />
                  <Text style={styles.stepText}>{step.text}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(280)} style={styles.block}>
            <PartnerRequestsSectionHeader
              eyebrow="OTP"
              title="Customer app se OTP"
              icon="keypad-outline"
              compact
            />
            <PartnerVisitOtpUnifiedCard expectedOtp={job.completionOtp} />
            <View style={styles.otpCard}>
              <OtpInput
                value={otp}
                onChange={(v) => {
                  setOtp(v);
                  if (error) setError('');
                }}
                error={error}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(140).duration(280)}>
            <View style={styles.tips}>
              {VISIT_COMPLETE_TIPS.map((tip) => (
                <View key={tip} style={styles.tipRow}>
                  <View style={styles.tipDot} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </>
      )}
    </PartnerStackShell>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  missingTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#6EE7B7' },
  liveText: { fontFamily: fonts.bold, fontSize: 9, color: colors.white, letterSpacing: 0.8 },
  block: { gap: spacing.sm },
  stepsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(21,112,239,0.15)',
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EEF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { fontFamily: fonts.bold, fontSize: 11, color: '#1570EF' },
  stepText: { flex: 1, fontFamily: fonts.medium, fontSize: 12, color: colors.inkSecondary },
  otpCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
    gap: spacing.sm,
  },
  demoOtpHint: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primaryDark,
    textAlign: 'center',
  },
  tips: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1570EF',
    marginTop: 6,
  },
  tipText: { flex: 1, fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 16 },
  successCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.25)',
  },
  successTitle: { fontFamily: fonts.extraBold, fontSize: 22, color: colors.ink },
  successSub: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  skipBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  skipText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.muted },
});
