import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { OtpInput } from '@/components/ui/OtpInput';
import { QmButton } from '@/components/ui/QmButton';
import { DEMO_OTP } from '@/constants/app';
import {
  AADHAAR_OTP_RESEND_SEC,
  sendDigiLockerAadhaarOtp,
  verifyDigiLockerAadhaarOtp,
} from '@/features/kyc/lib/kyc.aadhaar';
import {
  formatAadhaarDisplay,
  isValidAadhaar,
  maskAadhaar,
  normalizeAadhaar,
} from '@/features/kyc/lib/kyc.validation';
import type { KycAadhaarVerification } from '@/features/kyc/types/kyc.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

type Phase = 'input' | 'otp' | 'verified';

export function PartnerKycAadhaarDigiLocker({
  aadhaar,
  profileName,
  onVerified,
  onChangeNumber,
}: {
  aadhaar: KycAadhaarVerification;
  profileName?: string;
  onVerified: (verification: KycAadhaarVerification) => void;
  onChangeNumber: (number: string) => void;
}) {
  const [phase, setPhase] = useState<Phase>(aadhaar.verified ? 'verified' : 'input');
  const [aadhaarInput, setAadhaarInput] = useState(
    aadhaar.number ? formatAadhaarDisplay(aadhaar.number) : '',
  );
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [maskedMobile, setMaskedMobile] = useState(aadhaar.maskedMobile ?? '');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (aadhaar.verified) setPhase('verified');
  }, [aadhaar.verified]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const normalized = normalizeAadhaar(aadhaarInput);
  const canSendOtp = isValidAadhaar(normalized);

  const sendOtp = async () => {
    if (!canSendOtp || sending) return;
    setError('');
    setSending(true);
    onChangeNumber(normalized);
    const result = await sendDigiLockerAadhaarOtp(normalized);
    setSending(false);
    if (!result.ok) {
      setError(result.error ?? 'OTP bhejne mein problem');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setMaskedMobile(result.maskedMobile ?? '');
    setPhase('otp');
    setOtp('');
    setTimer(AADHAAR_OTP_RESEND_SEC);
  };

  const verifyOtp = async () => {
    if (verifying) return;
    setError('');
    setVerifying(true);
    const result = await verifyDigiLockerAadhaarOtp(normalized, otp, profileName ?? 'Partner');
    setVerifying(false);
    if (!result.ok || !result.verification) {
      setError(result.error ?? 'Verification fail');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPhase('verified');
    onVerified(result.verification);
  };

  const restart = () => {
    Haptics.selectionAsync();
    setPhase('input');
    setAadhaarInput('');
    setOtp('');
    setError('');
    setMaskedMobile('');
    onChangeNumber('');
  };

  if (phase === 'verified' && aadhaar.verified) {
    return (
      <View style={styles.verifiedCard}>
        <View style={styles.digiBadge}>
          <Ionicons name="lock-closed" size={14} color={colors.primary} />
          <Text style={styles.digiBadgeText}>DigiLocker · UIDAI OTP verified</Text>
        </View>
        <View style={styles.verifiedRow}>
          <View style={styles.verifiedIcon}>
            <Ionicons name="checkmark-circle" size={28} color={colors.success} />
          </View>
          <View style={styles.verifiedCopy}>
            <Text style={styles.verifiedTitle}>{aadhaar.holderName ?? profileName ?? 'Partner'}</Text>
            <Text style={styles.verifiedSub}>Aadhaar {maskAadhaar(aadhaar.number)}</Text>
            <Text style={styles.verifiedMeta}>
              Mobile {aadhaar.maskedMobile ?? maskedMobile} · Photo upload nahi chahiye
            </Text>
          </View>
        </View>
        <Pressable style={styles.changeBtn} onPress={restart}>
          <Text style={styles.changeBtnText}>Dusra Aadhaar use karo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="lock-closed-outline" size={22} color={colors.primary} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>DigiLocker se Aadhaar verify</Text>
          <Text style={styles.heroSub}>
            Aajkal photo upload ki jagah UIDAI OTP se instant verify hota hai — jaise bank apps mein.
          </Text>
        </View>
      </View>

      {phase === 'input' ? (
        <>
          <View style={styles.fieldCard}>
            <Text style={styles.fieldLabel}>Aadhaar number</Text>
            <TextInput
              style={styles.aadhaarInput}
              value={aadhaarInput}
              onChangeText={(t) => {
                const digits = normalizeAadhaar(t);
                setAadhaarInput(formatAadhaarDisplay(digits));
                setError('');
              }}
              keyboardType="number-pad"
              maxLength={14}
              placeholder="XXXX XXXX XXXX"
              placeholderTextColor={colors.placeholder}
            />
            <Text style={styles.fieldHint}>
              12 digits · OTP Aadhaar-linked mobile par jayega
            </Text>
          </View>

          <QmButton
            label="DigiLocker OTP bhejo"
            icon="paper-plane-outline"
            onPress={() => void sendOtp()}
            loading={sending}
            disabled={!canSendOtp}
          />
        </>
      ) : (
        <>
          <View style={styles.otpBanner}>
            <Ionicons name="phone-portrait-outline" size={16} color={colors.primary} />
            <Text style={styles.otpBannerText}>
              OTP bheja gaya {maskedMobile || '••••••XXXX'} par
            </Text>
          </View>

          <View style={styles.fieldCard}>
            <Text style={styles.fieldLabel}>6-digit OTP</Text>
            <OtpInput value={otp} onChange={setOtp} error={error} />
            <Text style={styles.demoHint}>Demo OTP: {DEMO_OTP}</Text>
          </View>

          <QmButton
            label="OTP verify karo"
            icon="shield-checkmark"
            onPress={() => void verifyOtp()}
            loading={verifying}
            disabled={otp.length !== 6}
          />

          <View style={styles.otpActions}>
            <Pressable
              style={[styles.resendBtn, timer > 0 && styles.resendBtnDisabled]}
              onPress={() => void sendOtp()}
              disabled={timer > 0 || sending}
            >
              <Text style={[styles.resendText, timer > 0 && styles.resendTextMuted]}>
                {timer > 0 ? `Dubara bhejo (${timer}s)` : 'OTP dubara bhejo'}
              </Text>
            </Pressable>
            <Pressable onPress={() => setPhase('input')}>
              <Text style={styles.editAadhaar}>Number change karo</Text>
            </Pressable>
          </View>
        </>
      )}

      {error && phase === 'input' ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.trustRow}>
        <Ionicons name="shield-checkmark-outline" size={14} color={colors.muted} />
        <Text style={styles.trustText}>
          Demo mode — production mein UIDAI / DigiLocker API se connect hoga
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  hero: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: 'rgba(11,110,103,0.08)',
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.14)',
  },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: { flex: 1, gap: 4 },
  heroTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  heroSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 16 },

  fieldCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  fieldLabel: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink },
  fieldHint: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
  aadhaarInput: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.ink,
    letterSpacing: 4,
    paddingVertical: spacing.sm,
  },

  otpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  otpBannerText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primaryDark },
  demoHint: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted, marginTop: spacing.xs },
  otpActions: { alignItems: 'center', gap: spacing.sm },
  resendBtn: { paddingVertical: spacing.sm },
  resendBtnDisabled: { opacity: 0.6 },
  resendText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primary },
  resendTextMuted: { color: colors.muted },
  editAadhaar: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },

  verifiedCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.25)',
  },
  digiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  digiBadgeText: { fontFamily: fonts.bold, fontSize: 10, color: colors.primaryDark },
  verifiedRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  verifiedIcon: {},
  verifiedCopy: { flex: 1, gap: 2 },
  verifiedTitle: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  verifiedSub: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primary },
  verifiedMeta: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  changeBtn: { alignSelf: 'flex-start', paddingVertical: 4 },
  changeBtnText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primary },

  errorText: { fontFamily: fonts.medium, fontSize: 11, color: colors.error },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingHorizontal: spacing.xs,
  },
  trustText: { flex: 1, fontFamily: fonts.regular, fontSize: 10, color: colors.muted, lineHeight: 14 },
});
