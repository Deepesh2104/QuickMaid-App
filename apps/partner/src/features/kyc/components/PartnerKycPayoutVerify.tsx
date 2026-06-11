import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { QmButton } from '@/components/ui/QmButton';
import { verifyBankAccountInternal, verifyUpiInternal } from '@/features/kyc/lib/kyc.bank';
import {
  isValidAccountNumber,
  isValidIfsc,
  isValidUpi,
  maskAccount,
  normalizeAccountNumber,
  normalizeIfsc,
} from '@/features/kyc/lib/kyc.validation';
import type { KycDraft } from '@/features/kyc/types/kyc.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export function PartnerKycPayoutVerify({
  draft,
  expectedName,
  onBankChange,
  onBankVerified,
  onUpiChange,
  onUpiVerified,
}: {
  draft: KycDraft;
  expectedName?: string;
  onBankChange: (patch: Partial<KycDraft['bank']>) => void;
  onBankVerified: (bank: KycDraft['bank']) => void;
  onUpiChange: (upi: string) => void;
  onUpiVerified: () => void;
}) {
  const [bankVerified, setBankVerified] = useState(Boolean(draft.bank.verified));
  const [upiVerified, setUpiVerified] = useState(Boolean(draft.upiVerified));
  const [bankLoading, setBankLoading] = useState(false);
  const [upiLoading, setUpiLoading] = useState(false);
  const [bankError, setBankError] = useState('');
  const [upiError, setUpiError] = useState('');
  const [bankSuccess, setBankSuccess] = useState('');
  const [upiSuccess, setUpiSuccess] = useState('');

  useEffect(() => {
    setBankVerified(Boolean(draft.bank.verified));
  }, [draft.bank.verified]);

  useEffect(() => {
    setUpiVerified(Boolean(draft.upiVerified));
  }, [draft.upiVerified]);

  const canVerifyBank =
    Boolean(expectedName?.trim()) &&
    draft.bank.accountHolderName.trim().length >= 3 &&
    isValidAccountNumber(draft.bank.accountNumber) &&
    isValidIfsc(draft.bank.ifsc);

  const canVerifyUpi = Boolean(expectedName?.trim()) && isValidUpi(draft.upiId);

  const verifyBank = async () => {
    if (!canVerifyBank || bankLoading) return;
    setBankError('');
    setBankSuccess('');
    setBankLoading(true);
    const result = await verifyBankAccountInternal(
      draft.bank.accountNumber,
      draft.bank.ifsc,
      draft.bank.accountHolderName,
      expectedName ?? '',
    );
    setBankLoading(false);
    if (!result.ok || !result.bank) {
      setBankError(result.error ?? 'Bank verify nahi ho paya');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setBankSuccess(result.successMessage ?? 'Bank verify ho gaya');
    setTimeout(() => {
      setBankVerified(true);
      onBankVerified(result.bank!);
    }, 900);
  };

  const verifyUpi = async () => {
    if (!canVerifyUpi || upiLoading) return;
    setUpiError('');
    setUpiSuccess('');
    setUpiLoading(true);
    const result = await verifyUpiInternal(draft.upiId, expectedName ?? '');
    setUpiLoading(false);
    if (!result.ok) {
      setUpiError(result.error ?? 'UPI verify nahi ho paya');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setUpiSuccess(result.successMessage ?? 'UPI verify ho gaya');
    setTimeout(() => {
      setUpiVerified(true);
      onUpiVerified();
    }, 900);
  };

  const resetBank = () => {
    Haptics.selectionAsync();
    setBankVerified(false);
    setBankSuccess('');
    setBankError('');
    onBankChange({
      accountHolderName: draft.bank.accountHolderName,
      accountNumber: '',
      ifsc: '',
      verified: false,
      verifiedAt: undefined,
      bankName: undefined,
    });
  };

  const resetUpi = () => {
    Haptics.selectionAsync();
    setUpiVerified(false);
    setUpiSuccess('');
    setUpiError('');
    onUpiChange('');
  };

  return (
    <View style={styles.wrap}>
      {expectedName ? (
        <View style={styles.nameChip}>
          <Ionicons name="person-outline" size={14} color={colors.primaryDark} />
          <Text style={styles.nameChipText}>Naam match hoga: {expectedName}</Text>
        </View>
      ) : (
        <Text style={styles.warnText}>Pehle Aadhaar / PAN verify complete karo</Text>
      )}

      {/* Bank */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Ionicons name="business-outline" size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>Bank account</Text>
        </View>

        {bankVerified && draft.bank.verified ? (
          <View style={styles.verifiedCard}>
            <View style={styles.verifiedRow}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <View style={styles.verifiedCopy}>
                <Text style={styles.verifiedTitle}>{draft.bank.accountHolderName}</Text>
                <Text style={styles.verifiedSub}>
                  {draft.bank.bankName ?? 'Bank'} · {maskAccount(draft.bank.accountNumber)}
                </Text>
                <Text style={styles.verifiedMeta}>IFSC {draft.bank.ifsc}</Text>
              </View>
            </View>
            <Pressable onPress={resetBank}>
              <Text style={styles.changeBtnText}>Bank details change karo</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.fieldCard}>
              <Text style={styles.fieldLabel}>Account holder name</Text>
              <TextInput
                style={styles.textInput}
                value={draft.bank.accountHolderName}
                onChangeText={(t) => {
                  setBankError('');
                  setBankSuccess('');
                  onBankChange({ accountHolderName: t, verified: false });
                }}
                placeholder="Passbook jaisa naam"
                placeholderTextColor={colors.placeholder}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.fieldCard}>
              <Text style={styles.fieldLabel}>Account number</Text>
              <TextInput
                style={styles.textInput}
                value={draft.bank.accountNumber}
                onChangeText={(t) => {
                  setBankError('');
                  setBankSuccess('');
                  onBankChange({ accountNumber: normalizeAccountNumber(t), verified: false });
                }}
                keyboardType="number-pad"
                placeholder="9–18 digits"
                placeholderTextColor={colors.placeholder}
              />
            </View>
            <View style={styles.fieldCard}>
              <Text style={styles.fieldLabel}>IFSC code</Text>
              <TextInput
                style={styles.monoInput}
                value={draft.bank.ifsc}
                onChangeText={(t) => {
                  setBankError('');
                  setBankSuccess('');
                  onBankChange({ ifsc: normalizeIfsc(t), verified: false });
                }}
                autoCapitalize="characters"
                maxLength={11}
                placeholder="SBIN0001234"
                placeholderTextColor={colors.placeholder}
              />
              <Text style={styles.fieldHint}>Verify par internal API · naam compare hoga</Text>
            </View>
            <QmButton
              label="Bank verify karo"
              icon="shield-checkmark"
              onPress={() => void verifyBank()}
              loading={bankLoading}
              disabled={!canVerifyBank}
            />
            {bankSuccess ? (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={styles.successText}>{bankSuccess}</Text>
              </View>
            ) : null}
            {bankError ? <Text style={styles.errorText}>{bankError}</Text> : null}
          </>
        )}
      </View>

      {/* UPI */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Ionicons name="wallet-outline" size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>UPI (Monday payout)</Text>
        </View>

        {upiVerified && draft.upiVerified ? (
          <View style={styles.verifiedCard}>
            <View style={styles.verifiedRow}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <View style={styles.verifiedCopy}>
                <Text style={styles.verifiedTitle}>{draft.upiId}</Text>
                <Text style={styles.verifiedMeta}>Weekly payout yahan jayegi</Text>
              </View>
            </View>
            <Pressable onPress={resetUpi}>
              <Text style={styles.changeBtnText}>UPI change karo</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.fieldCard}>
              <Text style={styles.fieldLabel}>UPI ID</Text>
              <TextInput
                style={styles.textInput}
                value={draft.upiId}
                onChangeText={(t) => {
                  setUpiError('');
                  setUpiSuccess('');
                  onUpiChange(t.trim().toLowerCase());
                }}
                autoCapitalize="none"
                placeholder="name@okaxis"
                placeholderTextColor={colors.placeholder}
              />
              <Text style={styles.fieldHint}>Internal API se VPA naam verify hoga</Text>
            </View>
            <QmButton
              label="UPI verify karo"
              icon="checkmark-done"
              onPress={() => void verifyUpi()}
              loading={upiLoading}
              disabled={!canVerifyUpi}
            />
            {upiSuccess ? (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={styles.successText}>{upiSuccess}</Text>
              </View>
            ) : null}
            {upiError ? <Text style={styles.errorText}>{upiError}</Text> : null}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  nameChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(11,110,103,0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  nameChipText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.primaryDark },
  warnText: { fontFamily: fonts.medium, fontSize: 11, color: colors.error },
  section: { gap: spacing.sm },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
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
  textInput: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: spacing.xs,
  },
  monoInput: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.ink,
    letterSpacing: 1,
    paddingVertical: spacing.xs,
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
  errorText: { fontFamily: fonts.medium, fontSize: 11, color: colors.error },
  verifiedCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.25)',
  },
  verifiedRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  verifiedCopy: { flex: 1, gap: 2 },
  verifiedTitle: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.ink },
  verifiedSub: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primaryDark },
  verifiedMeta: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  changeBtnText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primary },
});
