import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PhoneInput } from '@/components/ui/PhoneInput';
import { QmButton } from '@/components/ui/QmButton';
import { PartnerAuthLayout } from '@/features/auth/components/PartnerAuthLayout';
import { LOGIN_STATS, LOGIN_TRUST } from '@/features/auth/constants/auth.premium';
import { useAuthFlow } from '@/context/AuthFlowContext';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export default function LoginScreen() {
  const router = useRouter();
  const { setPhone } = useAuthFlow();
  const [phone, setPhoneLocal] = useState('');
  const [error, setError] = useState('');
  const isValid = phone.length === 10;

  const handleContinue = () => {
    if (!isValid) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setPhone(phone);
    router.push('/(auth)/otp');
  };

  return (
    <PartnerAuthLayout
      eyebrow="PARTNER SIGN IN"
      title="Welcome back"
      subtitle="Manage jobs, earnings & schedule in one app"
      stats={LOGIN_STATS}
      footer={
        <QmButton
          label="Continue"
          icon="arrow-forward"
          onPress={handleContinue}
          disabled={!isValid}
        />
      }
    >
      <View style={styles.body}>
        <Text style={styles.sectionEyebrow}>MOBILE NUMBER</Text>
        <Text style={styles.title}>Sign in with OTP</Text>
        <Text style={styles.subtitle}>
          We&apos;ll send a 6-digit code. Same number works if you&apos;re also a QuickMaid customer.
        </Text>

        <PhoneInput
          onChangeText={(v) => {
            setPhoneLocal(v);
            if (error) setError('');
          }}
          error={error}
        />

        <View style={styles.demoPill}>
          <Ionicons name="sparkles-outline" size={15} color={colors.primaryDark} />
          <Text style={styles.demoText}>Demo — any 10-digit number · OTP 123456</Text>
        </View>

        <View style={styles.trustCard}>
          {LOGIN_TRUST.map((item, index) => (
            <View key={item.text}>
              {index > 0 ? <View style={styles.trustDivider} /> : null}
              <View style={styles.trustRow}>
                <View style={styles.trustIcon}>
                  <Ionicons name={item.icon} size={14} color={colors.primaryDark} />
                </View>
                <Text style={styles.trustText}>{item.text}</Text>
              </View>
            </View>
          ))}
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
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.partnerGoldBg,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(217,119,6,0.14)',
  },
  demoText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.partnerGold,
    lineHeight: 16,
  },
  trustCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    marginTop: spacing.sm,
  },
  trustRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  trustIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.ink,
    lineHeight: 16,
  },
  trustDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
});
