import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { QmButton } from '@/components/ui/QmButton';
import { verifyDigiLockerPan } from '@/features/kyc/lib/kyc.pan';
import { isValidPan, maskPan, normalizePan } from '@/features/kyc/lib/kyc.validation';
import type { KycPanVerification } from '@/features/kyc/types/kyc.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export function PartnerKycPanDigiLocker({
  pan,
  expectedName,
  onVerified,
  onChangePan,
}: {
  pan: KycPanVerification;
  /** Profile / Aadhaar verified name — PAN ITD naam se match hoga */
  expectedName?: string;
  onVerified: (verification: KycPanVerification) => void;
  onChangePan: (number: string) => void;
}) {
  const [verified, setVerified] = useState(pan.verified);
  const [panInput, setPanInput] = useState(pan.number ? normalizePan(pan.number) : '');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVerified(pan.verified);
  }, [pan.verified]);

  const normalized = normalizePan(panInput);
  const canVerify = isValidPan(normalized) && Boolean(expectedName?.trim());

  const verifyPan = async () => {
    if (!canVerify || loading) return;
    setError('');
    setSuccessMessage('');
    setLoading(true);
    onChangePan(normalized);
    const result = await verifyDigiLockerPan(normalized, expectedName ?? '');
    setLoading(false);
    if (!result.ok || !result.verification) {
      setError(result.error ?? 'PAN verify nahi ho paya');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSuccessMessage(result.successMessage ?? 'PAN verify ho gaya — naam match');
    setTimeout(() => {
      setVerified(true);
      onVerified(result.verification!);
    }, 900);
  };

  const restart = () => {
    Haptics.selectionAsync();
    setVerified(false);
    setPanInput('');
    setError('');
    setSuccessMessage('');
    onChangePan('');
  };

  if (verified && pan.verified) {
    return (
      <View style={styles.verifiedCard}>
        <View style={styles.digiBadge}>
          <Ionicons name="document-text" size={14} color="#B45309" />
          <Text style={styles.digiBadgeText}>DigiLocker · ITD verified</Text>
        </View>
        <View style={styles.verifiedRow}>
          <Ionicons name="checkmark-circle" size={28} color={colors.success} />
          <View style={styles.verifiedCopy}>
            <Text style={styles.verifiedTitle}>{pan.holderName ?? expectedName ?? 'Partner'}</Text>
            <Text style={styles.verifiedSub}>PAN {maskPan(pan.number)}</Text>
            <Text style={styles.verifiedMeta}>Naam match ho gaya · OTP nahi chahiye</Text>
          </View>
        </View>
        <Pressable style={styles.changeBtn} onPress={restart}>
          <Text style={styles.changeBtnText}>Dusra PAN use karo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <View style={[styles.heroIcon, styles.heroIconPan]}>
          <Ionicons name="document-text-outline" size={22} color="#B45309" />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>DigiLocker se PAN verify</Text>
          <Text style={styles.heroSub}>
            PAN daalo — internal API se naam aayega aur aapke profile naam se match hoga.
          </Text>
        </View>
      </View>

      {expectedName ? (
        <View style={styles.nameChip}>
          <Ionicons name="person-outline" size={14} color="#92400E" />
          <Text style={styles.nameChipText}>Match hoga: {expectedName}</Text>
        </View>
      ) : (
        <Text style={styles.warnText}>Pehle profile naam ya Aadhaar verify complete karo</Text>
      )}

      <View style={styles.fieldCard}>
        <Text style={styles.fieldLabel}>PAN number</Text>
        <TextInput
          style={styles.panInput}
          value={panInput}
          onChangeText={(t) => {
            setPanInput(normalizePan(t));
            setError('');
            setSuccessMessage('');
          }}
          autoCapitalize="characters"
          maxLength={10}
          placeholder="ABCDE1234F"
          placeholderTextColor={colors.placeholder}
        />
        <Text style={styles.fieldHint}>Verify par internal API call · naam compare hoga</Text>
      </View>

      <QmButton
        label="PAN verify karo"
        icon="shield-checkmark"
        onPress={() => void verifyPan()}
        loading={loading}
        disabled={!canVerify}
      />

      {successMessage ? (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  hero: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: 'rgba(252,211,77,0.12)',
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(180,83,9,0.18)',
  },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconPan: { backgroundColor: '#FFFBEB' },
  heroCopy: { flex: 1, gap: 4 },
  heroTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  heroSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 16 },
  nameChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  nameChipText: { fontFamily: fonts.semiBold, fontSize: 11, color: '#92400E' },
  warnText: { fontFamily: fonts.medium, fontSize: 11, color: colors.error },
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
  panInput: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.ink,
    letterSpacing: 2,
    paddingVertical: spacing.sm,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.25)',
  },
  successText: { flex: 1, fontFamily: fonts.semiBold, fontSize: 12, color: '#15803D' },
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
    backgroundColor: '#FFFBEB',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  digiBadgeText: { fontFamily: fonts.bold, fontSize: 10, color: '#92400E' },
  verifiedRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  verifiedCopy: { flex: 1, gap: 2 },
  verifiedTitle: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  verifiedSub: { fontFamily: fonts.semiBold, fontSize: 13, color: '#B45309' },
  verifiedMeta: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  changeBtn: { alignSelf: 'flex-start', paddingVertical: 4 },
  changeBtnText: { fontFamily: fonts.semiBold, fontSize: 12, color: '#B45309' },
  errorText: { fontFamily: fonts.medium, fontSize: 11, color: colors.error },
});
