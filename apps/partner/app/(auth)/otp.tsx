import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OtpInput } from '@/components/ui/OtpInput';
import { QmButton } from '@/components/ui/QmButton';
import { DEMO_OTP } from '@/constants/app';
import { PartnerAuthLayout } from '@/features/auth/components/PartnerAuthLayout';
import { useAuthFlow } from '@/context/AuthFlowContext';
import { kycPostAuthHref } from '@/features/kyc/lib/kyc.routing';
import { isReturningPartner, signInExistingPartner } from '@/lib/storage';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export default function OtpScreen() {
  const router = useRouter();
  const { phone } = useAuthFlow();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const formatted = phone ? `+91 ${phone.replace(/(\d{5})(\d{5})/, '$1 $2')}` : '+91 —';

  const stats = useMemo(
    () => [
      { value: '6', label: 'Digit code' },
      { value: DEMO_OTP, label: 'Demo OTP' },
      { value: timer > 0 ? `${timer}s` : 'Ready', label: 'Resend' },
    ],
    [timer],
  );

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const verify = async () => {
    if (otp.length !== 6) {
      setError('Enter the complete 6-digit code');
      return;
    }
    if (otp !== DEMO_OTP) {
      setError(`Incorrect code. Demo OTP is ${DEMO_OTP}`);
      return;
    }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const returning = await isReturningPartner(phone);
    if (returning) {
      const signedIn = await signInExistingPartner(phone);
      setLoading(false);
      router.replace(kycPostAuthHref(signedIn?.kycStatus, false) as Href);
      return;
    }

    setLoading(false);
    router.push('/(auth)/apply');
  };

  const resend = () => {
    if (timer > 0) return;
    Haptics.selectionAsync();
    setTimer(30);
    setOtp('');
    setError('');
  };

  return (
    <PartnerAuthLayout
      eyebrow="VERIFY OTP"
      title="Enter your code"
      subtitle={`Sent to ${formatted}`}
      stats={stats}
      showLogo={false}
      onBack={() => router.back()}
      footer={
        <QmButton
          label="Verify & continue"
          icon="shield-checkmark"
          onPress={() => void verify()}
          loading={loading}
          disabled={otp.length !== 6}
        />
      }
    >
      <View style={styles.body}>
        <Text style={styles.sectionEyebrow}>ONE-TIME PASSWORD</Text>
        <Text style={styles.title}>6-digit verification</Text>
        <Text style={styles.subtitle}>
          Enter the code we sent to your mobile. Demo partners use {DEMO_OTP}.
        </Text>

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

        <Pressable
          style={[styles.resendBtn, timer > 0 && styles.resendDisabled]}
          onPress={resend}
          disabled={timer > 0}
        >
          <Ionicons
            name="refresh-outline"
            size={15}
            color={timer > 0 ? colors.mutedLight : colors.primary}
          />
          <Text style={[styles.resendText, timer > 0 && styles.resendTextMuted]}>
            {timer > 0 ? `Resend code in ${timer}s` : 'Resend code (demo)'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.changeBtn}
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
        >
          <Ionicons name="call-outline" size={14} color={colors.primaryDark} />
          <Text style={styles.changeText}>Change number · {formatted}</Text>
        </Pressable>

        <View style={styles.securePill}>
          <Ionicons name="lock-closed" size={14} color={colors.primaryDark} />
          <Text style={styles.secureText}>OTP expires in 10 minutes · never share with anyone</Text>
        </View>
      </View>
    </PartnerAuthLayout>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.md },
  sectionEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  otpCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  resendDisabled: { opacity: 0.7 },
  resendText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.primary,
  },
  resendTextMuted: { color: colors.muted },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  changeText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  securePill: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
    marginTop: spacing.xs,
  },
  secureText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 15,
  },
});
