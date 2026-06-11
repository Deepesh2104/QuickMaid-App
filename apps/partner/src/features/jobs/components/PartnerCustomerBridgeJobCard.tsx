import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { PartnerJob } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface PartnerCustomerBridgeJobCardProps {
  job: PartnerJob;
}

export function PartnerCustomerBridgeJobCard({ job }: PartnerCustomerBridgeJobCardProps) {
  if (!job.customerBookingId) return null;

  const preferred = job.customerPreferredMaidName;

  return (
    <Animated.View entering={FadeInDown.duration(280)} style={styles.wrap}>
      <LinearGradient
        colors={['#0F172A', '#1E3A5F', '#1570EF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.head}>
          <View style={styles.icon}>
            <Ionicons name="phone-portrait-outline" size={18} color={colors.white} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>CUSTOMER APP ORDER</Text>
            <Text style={styles.title}>Bridge booking · accept to sync</Text>
            <Text style={styles.sub}>
              Ref {job.bookingRef}
              {job.customerPublicId ? ` · ${job.customerPublicId}` : ''}
              {job.customerBookingId ? ` · ${job.customerBookingId}` : ''}
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>BRIDGE</Text>
          </View>
        </View>

        {preferred ? (
          <View style={styles.prefRow}>
            <Ionicons name="person-outline" size={14} color="#93C5FD" />
            <Text style={styles.prefText}>
              Customer pre-assigned <Text style={styles.prefName}>{preferred}</Text> — your accept
              updates their app
            </Text>
          </View>
        ) : null}

        <View style={styles.steps}>
          <Step done label="Order received" />
          <Step active={job.status === 'pending'} label="You accept" />
          <Step done={job.status !== 'pending'} label="Customer notified" />
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

function Step({ done, active, label }: { done?: boolean; active?: boolean; label: string }) {
  return (
    <View style={styles.step}>
      <View
        style={[
          styles.stepDot,
          done && styles.stepDotDone,
          active && styles.stepDotActive,
        ]}
      />
      <Text style={[styles.stepLabel, (done || active) && styles.stepLabelOn]}>{label}</Text>
    </View>
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
    borderColor: 'rgba(147,197,253,0.25)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(21,112,239,0.25)',
    top: -30,
    right: -10,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  title: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(21,112,239,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.4)',
  },
  badgeText: {
    fontFamily: fonts.extraBold,
    fontSize: 9,
    color: colors.white,
    letterSpacing: 0.6,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  prefText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 15,
  },
  prefName: { fontFamily: fonts.bold, color: '#93C5FD' },
  steps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  step: { flex: 1, alignItems: 'center', gap: 4 },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  stepDotDone: { backgroundColor: '#6EE7B7' },
  stepDotActive: {
    backgroundColor: '#93C5FD',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  stepLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
  },
  stepLabelOn: { color: 'rgba(255,255,255,0.9)', fontFamily: fonts.semiBold },
});
