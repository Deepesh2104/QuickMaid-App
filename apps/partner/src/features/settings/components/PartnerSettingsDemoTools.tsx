import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { DEMO_AUTH_OTP, DEMO_VISIT_COMPLETION_OTP } from '@/constants/app';
import { usePartner } from '@/context/PartnerContext';
import type { KycStatus } from '@/constants/app';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';
import { syncCustomerBookingBridge } from '@/features/jobs/lib/booking-partner-bridge';
import {
  syncCustomerRatingsFromStatusBridge,
  syncJobsFromCustomerStatusBridge,
} from '@/features/jobs/lib/booking-status-bridge.storage';
import {
  resetAcceptDeclineTestJobs,
  resetPartnerJobsToDemo,
} from '@/features/jobs/lib/jobs.storage';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

export function PartnerSettingsDemoTools() {
  const { profile, updateProfile } = usePartner();
  const { refresh } = usePartnerJobs();
  const [busy, setBusy] = useState<'none' | 'all' | 'test' | 'bridge' | 'kyc' | 'status' | 'ratings'>('none');

  const toggleKycDemo = async () => {
    setBusy('kyc');
    const next: KycStatus = profile?.kycStatus === 'verified' ? 'pending' : 'verified';
    await updateProfile({ kycStatus: next });
    setBusy('none');
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const run = async (kind: 'all' | 'test' | 'bridge' | 'status' | 'ratings') => {
    setBusy(kind);
    if (kind === 'all') await resetPartnerJobsToDemo();
    else if (kind === 'test') await resetAcceptDeclineTestJobs();
    else if (kind === 'bridge') await syncCustomerBookingBridge();
    else if (kind === 'status') await syncJobsFromCustomerStatusBridge();
    else await syncCustomerRatingsFromStatusBridge();
    await refresh();
    setBusy('none');
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <Animated.View entering={FadeInDown.delay(80).duration(280)} style={styles.block}>
      <PartnerRequestsSectionHeader
        eyebrow="Demo"
        title="Reset test data"
        subtitle="Fresh jobs for auto-assign or Accept/Decline test"
        icon="refresh-outline"
        compact
      />

      <LinearGradient
        colors={['#0F172A', '#1E3A5F', '#1570EF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bridgeHero}
      >
        <View style={styles.bridgeGlow} pointerEvents="none" />
        <View style={styles.bridgeHead}>
          <Ionicons name="git-network-outline" size={20} color={colors.white} />
          <View style={styles.bridgeCopy}>
            <Text style={styles.bridgeEyebrow}>CUSTOMER BRIDGE</Text>
            <Text style={styles.bridgeTitle}>Cross-app sync tools</Text>
          </View>
        </View>
        <Text style={styles.bridgeSub}>
          Orders, lifecycle events, cancel/reschedule — demo AsyncStorage bridge
        </Text>
        <View style={styles.otpStrip}>
          <Ionicons name="keypad-outline" size={14} color="#FCD34D" />
          <Text style={styles.otpStripText}>
            Unified OTP {DEMO_AUTH_OTP} · login + visit completion (customer app bhi same)
          </Text>
        </View>
        <View style={styles.bridgeActions}>
          <Pressable
            style={styles.bridgeBtn}
            onPress={() => void run('bridge')}
            disabled={busy !== 'none'}
          >
            <Ionicons name="download-outline" size={14} color={colors.white} />
            <Text style={styles.bridgeBtnText}>
              {busy === 'bridge' ? 'Syncing…' : 'Pull customer orders'}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.bridgeBtn, styles.bridgeBtnAlt]}
            onPress={() => void run('status')}
            disabled={busy !== 'none'}
          >
            <Ionicons name="sync-outline" size={14} color="#93C5FD" />
            <Text style={[styles.bridgeBtnText, styles.bridgeBtnTextAlt]}>
              {busy === 'status' ? 'Syncing…' : 'Pull cancel/reschedule'}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.bridgeBtn, styles.bridgeBtnAlt]}
            onPress={() => void run('ratings')}
            disabled={busy !== 'none'}
          >
            <Ionicons name="star-outline" size={14} color="#FCD34D" />
            <Text style={[styles.bridgeBtnText, styles.bridgeBtnTextAlt]}>
              {busy === 'ratings' ? 'Syncing…' : 'Pull customer ratings'}
            </Text>
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.card}>
        <DemoRow
          icon="hand-left-outline"
          iconBg="#FFFBEB"
          iconColor="#B45309"
          title="Reset Accept/Decline test"
          sub="MANUAL + DECLINE TEST cards wapas pending"
          action={busy === 'test' ? '...' : 'Run'}
          onPress={() => void run('test')}
          disabled={busy !== 'none'}
        />
        <View style={styles.divider} />
        <DemoRow
          icon="shield-outline"
          iconBg="#FEF3F2"
          iconColor="#D92D20"
          title="Toggle KYC gate (demo)"
          sub={`Ab: ${profile?.kycStatus ?? 'pending'} — accept block test ke liye`}
          action={busy === 'kyc' ? '...' : 'Flip'}
          onPress={() => void toggleKycDemo()}
          disabled={busy !== 'none'}
        />
        <View style={styles.divider} />
        <DemoRow
          icon="briefcase-outline"
          iconBg={colors.primaryLight}
          iconColor={colors.primaryDark}
          title="Reset all demo jobs"
          sub="Saari visits seed state — Schedule khali"
          action={busy === 'all' ? '...' : 'Run'}
          onPress={() => void run('all')}
          disabled={busy !== 'none'}
        />
      </View>
    </Animated.View>
  );
}

function DemoRow({
  icon,
  iconBg,
  iconColor,
  title,
  sub,
  action,
  onPress,
  disabled,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  sub: string;
  action: string;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={disabled}>
      <View style={[styles.icon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={16} color={iconColor} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      <Text style={styles.action}>{action}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.sm },
  bridgeHero: {
    borderRadius: radius.xxl,
    padding: spacing.md,
    gap: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    ...shadow.md,
  },
  bridgeGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(21,112,239,0.3)',
    top: -30,
    right: -10,
  },
  bridgeHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bridgeCopy: { flex: 1, gap: 2 },
  bridgeEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  bridgeTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  bridgeSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 15,
  },
  otpStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(252,211,77,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.25)',
  },
  otpStripText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: '#FCD34D',
    lineHeight: 15,
  },
  bridgeActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  bridgeBtn: {
    flexGrow: 1,
    flexBasis: '46%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  bridgeBtnAlt: {
    backgroundColor: 'rgba(21,112,239,0.25)',
    borderColor: 'rgba(147,197,253,0.3)',
  },
  bridgeBtnText: { fontFamily: fonts.bold, fontSize: 11, color: colors.white },
  bridgeBtnTextAlt: { color: '#93C5FD' },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink },
  sub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted, lineHeight: 14 },
  action: { fontFamily: fonts.bold, fontSize: 12, color: colors.primary },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
});
