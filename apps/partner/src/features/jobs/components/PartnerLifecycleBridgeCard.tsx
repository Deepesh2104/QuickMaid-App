import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { JobStatus, PartnerJob } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface PartnerLifecycleBridgeCardProps {
  job: PartnerJob;
}

type StepState = 'done' | 'active' | 'pending';

const LIFECYCLE_STEPS: {
  key: string;
  label: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
  matches: JobStatus[];
}[] = [
  {
    key: 'accepted',
    label: 'Accepted',
    sub: 'Customer app notified',
    icon: 'checkmark-circle',
    matches: ['accepted', 'in_progress', 'completed'],
  },
  {
    key: 'in_progress',
    label: 'Visit live',
    sub: 'GPS shared · customer tracking',
    icon: 'navigate',
    matches: ['in_progress', 'completed'],
  },
  {
    key: 'completed',
    label: 'Completed',
    sub: 'Customer booking closed',
    icon: 'ribbon',
    matches: ['completed'],
  },
];

function stepState(jobStatus: JobStatus, matches: JobStatus[]): StepState {
  if (matches.includes(jobStatus)) {
    const last = matches[matches.length - 1];
    return jobStatus === last ? 'active' : 'done';
  }
  return 'pending';
}

export function PartnerLifecycleBridgeCard({ job }: PartnerLifecycleBridgeCardProps) {
  if (job.status === 'pending' || job.status === 'declined') return null;

  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.wrap}>
      <LinearGradient
        colors={['#010F0E', '#084F4A', '#0B6E67']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.head}>
          <View style={styles.headIcon}>
            <Ionicons name="git-network-outline" size={18} color={colors.white} />
          </View>
          <View style={styles.headCopy}>
            <Text style={styles.eyebrow}>CUSTOMER BRIDGE</Text>
            <Text style={styles.title}>Lifecycle sync active</Text>
            <Text style={styles.sub}>Ref {job.bookingRef} · demo cross-app</Text>
          </View>
          <View style={styles.syncBadge}>
            <View style={styles.syncDot} />
            <Text style={styles.syncText}>SYNC</Text>
          </View>
        </View>

        <View style={styles.pipeline}>
          {LIFECYCLE_STEPS.map((step, index) => {
            const state = stepState(job.status, step.matches);
            const isLast = index === LIFECYCLE_STEPS.length - 1;
            return (
              <View key={step.key} style={styles.stepRow}>
                <View style={styles.stepRail}>
                  <View
                    style={[
                      styles.stepDot,
                      state === 'done' && styles.stepDotDone,
                      state === 'active' && styles.stepDotActive,
                    ]}
                  >
                    <Ionicons
                      name={step.icon}
                      size={12}
                      color={
                        state === 'pending'
                          ? 'rgba(255,255,255,0.35)'
                          : state === 'active'
                            ? colors.white
                            : '#6EE7B7'
                      }
                    />
                  </View>
                  {!isLast ? (
                    <View
                      style={[
                        styles.stepLine,
                        (state === 'done' || state === 'active') && styles.stepLineOn,
                      ]}
                    />
                  ) : null}
                </View>
                <View style={styles.stepCopy}>
                  <Text
                    style={[
                      styles.stepLabel,
                      state !== 'pending' && styles.stepLabelOn,
                      state === 'active' && styles.stepLabelActive,
                    ]}
                  >
                    {step.label}
                  </Text>
                  <Text style={styles.stepSub}>{step.sub}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    ...shadow.md,
  },
  card: {
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(18,165,152,0.2)',
    top: -40,
    right: -20,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  headIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headCopy: { flex: 1, gap: 2 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  title: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  sub: { fontFamily: fonts.medium, fontSize: 10, color: 'rgba(255,255,255,0.65)' },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(18,165,152,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.4)',
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6EE7B7',
  },
  syncText: {
    fontFamily: fonts.extraBold,
    fontSize: 9,
    color: colors.white,
    letterSpacing: 0.6,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(252,211,77,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.25)',
  },
  alertDanger: {
    backgroundColor: 'rgba(217,45,32,0.15)',
    borderColor: 'rgba(253,162,155,0.3)',
  },
  alertText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: '#FCD34D',
    lineHeight: 15,
  },
  alertTextDanger: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: '#FDA29B',
    lineHeight: 15,
  },
  pipeline: { gap: spacing.xs, marginTop: spacing.xs },
  stepRow: { flexDirection: 'row', gap: spacing.sm },
  stepRail: { alignItems: 'center', width: 28 },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: 'rgba(18,165,152,0.25)',
    borderColor: 'rgba(110,231,183,0.35)',
  },
  stepDotActive: {
    backgroundColor: '#12A598',
    borderColor: '#6EE7B7',
    borderWidth: 2,
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 2,
  },
  stepLineOn: { backgroundColor: 'rgba(110,231,183,0.45)' },
  stepCopy: { flex: 1, paddingBottom: spacing.sm, gap: 1 },
  stepLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
  },
  stepLabelOn: { color: 'rgba(255,255,255,0.85)' },
  stepLabelActive: { color: '#6EE7B7', fontFamily: fonts.bold },
  stepSub: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },
});
