import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { usePartner } from '@/context/PartnerContext';
import type { KycStatus } from '@/constants/app';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';
import { syncCustomerBookingBridge } from '@/features/jobs/lib/booking-partner-bridge';
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
  const [busy, setBusy] = useState<'none' | 'all' | 'test' | 'bridge' | 'kyc'>('none');

  const toggleKycDemo = async () => {
    setBusy('kyc');
    const next: KycStatus = profile?.kycStatus === 'verified' ? 'pending' : 'verified';
    await updateProfile({ kycStatus: next });
    setBusy('none');
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const run = async (kind: 'all' | 'test' | 'bridge') => {
    setBusy(kind);
    if (kind === 'all') await resetPartnerJobsToDemo();
    else if (kind === 'test') await resetAcceptDeclineTestJobs();
    else await syncCustomerBookingBridge();
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
      <View style={styles.card}>
        <Pressable
          style={styles.row}
          onPress={() => void run('test')}
          disabled={busy !== 'none'}
        >
          <View style={[styles.icon, { backgroundColor: '#FFFBEB' }]}>
            <Ionicons name="hand-left-outline" size={16} color="#B45309" />
          </View>
          <View style={styles.copy}>
            <Text style={styles.title}>Reset Accept/Decline test</Text>
            <Text style={styles.sub}>MANUAL + DECLINE TEST cards wapas pending</Text>
          </View>
          <Text style={styles.action}>{busy === 'test' ? '...' : 'Run'}</Text>
        </Pressable>
        <View style={styles.divider} />
        <Pressable
          style={styles.row}
          onPress={() => void run('bridge')}
          disabled={busy !== 'none'}
        >
          <View style={[styles.icon, { backgroundColor: '#EEF6FF' }]}>
            <Ionicons name="link-outline" size={16} color="#175CD3" />
          </View>
          <View style={styles.copy}>
            <Text style={styles.title}>Sync customer bookings</Text>
            <Text style={styles.sub}>Bridge queue → pending partner jobs (demo)</Text>
          </View>
          <Text style={styles.action}>{busy === 'bridge' ? '...' : 'Run'}</Text>
        </Pressable>
        <View style={styles.divider} />
        <Pressable
          style={styles.row}
          onPress={() => void toggleKycDemo()}
          disabled={busy !== 'none'}
        >
          <View style={[styles.icon, { backgroundColor: '#FEF3F2' }]}>
            <Ionicons name="shield-outline" size={16} color="#D92D20" />
          </View>
          <View style={styles.copy}>
            <Text style={styles.title}>Toggle KYC gate (demo)</Text>
            <Text style={styles.sub}>
              Ab: {profile?.kycStatus ?? 'pending'} — accept block test ke liye
            </Text>
          </View>
          <Text style={styles.action}>{busy === 'kyc' ? '...' : 'Flip'}</Text>
        </Pressable>
        <View style={styles.divider} />
        <Pressable
          style={styles.row}
          onPress={() => void run('all')}
          disabled={busy !== 'none'}
        >
          <View style={[styles.icon, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="briefcase-outline" size={16} color={colors.primaryDark} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.title}>Reset all demo jobs</Text>
            <Text style={styles.sub}>Saari visits seed state — Schedule khali</Text>
          </View>
          <Text style={styles.action}>{busy === 'all' ? '...' : 'Run'}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.sm },
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
