import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  KYC_CONSENT_TEXT,
  KYC_REJECTION_REASONS,
  KYC_VERIFIED_PERKS,
} from '@/features/kyc/constants/kyc.premium';
import {
  maskAccount,
  maskAadhaar,
  maskPan,
  normalizeAccountNumber,
  normalizeIfsc,
  normalizePan,
} from '@/features/kyc/lib/kyc.validation';
import type { KycChecklistItem, KycDraft } from '@/features/kyc/types/kyc.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

export function PartnerKycProgressCard({
  progress,
  checklist,
}: {
  progress: number;
  checklist: KycChecklistItem[];
}) {
  const missing = checklist.filter((i) => i.required && !i.done);

  return (
    <View style={styles.progressCard}>
      <View style={styles.progressTop}>
        <Text style={styles.progressTitle}>Verification progress</Text>
        <Text style={styles.progressPct}>{progress}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      {missing.length > 0 ? (
        <Text style={styles.progressHint}>Next: {missing[0].label}</Text>
      ) : (
        <Text style={styles.progressHintReady}>Ready to submit for review</Text>
      )}
      <View style={styles.checklist}>
        {checklist.map((item) => (
          <View key={item.id} style={styles.checkRow}>
            <Ionicons
              name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
              size={14}
              color={item.done ? colors.success : colors.mutedLight}
            />
            <Text style={[styles.checkLabel, item.done && styles.checkLabelDone]}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function PartnerKycPickSourceModal({
  visible,
  title,
  preferCamera,
  onClose,
  onSelect,
}: {
  visible: boolean;
  title: string;
  preferCamera?: boolean;
  onClose: () => void;
  onSelect: (source: 'camera' | 'gallery') => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.pickBackdrop} onPress={onClose}>
        <Pressable style={styles.pickSheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.pickTitle}>{title}</Text>
          {preferCamera ? (
            <Text style={styles.pickSub}>Selfie works best with your front camera</Text>
          ) : null}
          <Pressable
            style={styles.pickRow}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect('camera');
              onClose();
            }}
          >
            <Ionicons name="camera-outline" size={20} color={colors.primary} />
            <Text style={styles.pickRowText}>Take photo</Text>
          </Pressable>
          <Pressable
            style={styles.pickRow}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect('gallery');
              onClose();
            }}
          >
            <Ionicons name="images-outline" size={20} color={colors.primary} />
            <Text style={styles.pickRowText}>Choose from gallery</Text>
          </Pressable>
          <Pressable style={styles.pickCancel} onPress={onClose}>
            <Text style={styles.pickCancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function PartnerKycDocumentPreviewModal({
  visible,
  title,
  uri,
  onClose,
}: {
  visible: boolean;
  title: string;
  uri?: string;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.previewBackdrop}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle} numberOfLines={1}>{title}</Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={24} color={colors.white} />
          </Pressable>
        </View>
        {uri ? (
          <Image source={{ uri }} style={styles.previewImage} resizeMode="contain" />
        ) : null}
      </View>
    </Modal>
  );
}

export function PartnerKycPanField({
  panNumber,
  onPanChange,
}: {
  panNumber: string;
  onPanChange: (value: string) => void;
}) {
  return (
    <View style={styles.fieldStack}>
      <View style={styles.fieldCard}>
        <Text style={styles.fieldLabel}>PAN number</Text>
        <TextInput
          style={styles.panInput}
          value={panNumber}
          onChangeText={(t) => onPanChange(normalizePan(t))}
          autoCapitalize="characters"
          maxLength={10}
          placeholder="ABCDE1234F"
          placeholderTextColor={colors.placeholder}
        />
        <Text style={styles.fieldHint}>
          10-character PAN · DigiLocker Aadhaar name se match hona chahiye
        </Text>
      </View>
    </View>
  );
}

export function PartnerKycPayoutFields({
  draft,
  onBankChange,
  onUpiChange,
}: {
  draft: KycDraft;
  onBankChange: (patch: Partial<KycDraft['bank']>) => void;
  onUpiChange: (upi: string) => void;
}) {
  return (
    <View style={styles.fieldStack}>
      <View style={styles.fieldCard}>
        <Text style={styles.fieldLabel}>Account holder name</Text>
        <TextInput
          style={styles.textInput}
          value={draft.bank.accountHolderName}
          onChangeText={(t) => onBankChange({ accountHolderName: t })}
          placeholder="As per bank passbook"
          placeholderTextColor={colors.placeholder}
          autoCapitalize="words"
        />
      </View>
      <View style={styles.fieldCard}>
        <Text style={styles.fieldLabel}>Account number</Text>
        <TextInput
          style={styles.textInput}
          value={draft.bank.accountNumber}
          onChangeText={(t) => onBankChange({ accountNumber: normalizeAccountNumber(t) })}
          keyboardType="number-pad"
          placeholder="9–18 digits"
          placeholderTextColor={colors.placeholder}
        />
      </View>
      <View style={styles.fieldCard}>
        <Text style={styles.fieldLabel}>IFSC code</Text>
        <TextInput
          style={styles.panInput}
          value={draft.bank.ifsc}
          onChangeText={(t) => onBankChange({ ifsc: normalizeIfsc(t) })}
          autoCapitalize="characters"
          maxLength={11}
          placeholder="SBIN0001234"
          placeholderTextColor={colors.placeholder}
        />
        <Text style={styles.fieldHint}>11-character bank branch code</Text>
      </View>
      <View style={styles.fieldCard}>
        <Text style={styles.fieldLabel}>UPI ID (weekly payouts)</Text>
        <TextInput
          style={styles.textInput}
          value={draft.upiId}
          onChangeText={onUpiChange}
          autoCapitalize="none"
          placeholder="name@okaxis"
          placeholderTextColor={colors.placeholder}
        />
      </View>
    </View>
  );
}

export function PartnerKycConsentRow({
  accepted,
  onToggle,
}: {
  accepted: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable style={styles.consentRow} onPress={onToggle}>
      <View style={[styles.consentBox, accepted && styles.consentBoxOn]}>
        {accepted ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
      </View>
      <Text style={styles.consentText}>{KYC_CONSENT_TEXT}</Text>
    </Pressable>
  );
}

export function PartnerKycWelcomeBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <View style={styles.welcomeBanner}>
      <Ionicons name="sparkles" size={18} color={colors.partnerGold} />
      <View style={styles.welcomeCopy}>
        <Text style={styles.welcomeTitle}>Welcome, partner!</Text>
        <Text style={styles.welcomeSub}>Complete KYC now to unlock Monday UPI payouts</Text>
      </View>
      <Pressable onPress={onDismiss} hitSlop={8}>
        <Ionicons name="close" size={18} color={colors.muted} />
      </Pressable>
    </View>
  );
}

export function PartnerKycRejectedBanner({ reason }: { reason?: string }) {
  const text = reason ?? KYC_REJECTION_REASONS[0];
  return (
    <View style={styles.rejectBanner}>
      <Ionicons name="alert-circle" size={16} color={colors.error} />
      <View style={styles.rejectCopy}>
        <Text style={styles.rejectTitle}>Previous submission rejected</Text>
        <Text style={styles.rejectText}>{text}</Text>
      </View>
    </View>
  );
}

export function PartnerKycSubmittedSummary({ draft }: { draft: KycDraft }) {
  const aadhaarLabel = draft.aadhaar.verified
    ? `${maskAadhaar(draft.aadhaar.number)} · DigiLocker`
    : '—';

  return (
    <View style={styles.summaryCard}>
      <SummaryRow label="Aadhaar" value={aadhaarLabel} />
      <SummaryRow
        label="PAN"
        value={
          draft.pan.verified
            ? `${maskPan(draft.pan.number)} · DigiLocker`
            : maskPan(draft.panNumber)
        }
      />
      <SummaryRow
        label="Bank"
        value={
          draft.bank.verified
            ? `${maskAccount(draft.bank.accountNumber)} · ${draft.bank.bankName ?? 'Verified'}`
            : maskAccount(draft.bank.accountNumber)
        }
      />
      <SummaryRow label="IFSC" value={draft.bank.ifsc || '—'} />
      <SummaryRow
        label="UPI"
        value={draft.upiVerified ? `${draft.upiId} · Verified` : draft.upiId || '—'}
        last
      />
    </View>
  );
}

export function PartnerKycVerifiedPanel({
  draft,
  profileName,
}: {
  draft: KycDraft;
  profileName?: string;
}) {
  return (
    <View style={styles.verifiedBlock}>
      <View style={styles.verifiedPerks}>
        {KYC_VERIFIED_PERKS.map((perk) => (
          <View key={perk.label} style={styles.perkChip}>
            <Ionicons name={perk.icon} size={14} color={colors.primary} />
            <Text style={styles.perkText}>{perk.label}</Text>
          </View>
        ))}
      </View>
      <PartnerKycSubmittedSummary draft={draft} />
      <Text style={styles.verifiedName}>
        Verified as {profileName ?? 'Partner'} · documents on file
      </Text>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.summaryRow, !last && styles.summaryRowBorder]}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
    ...shadow.sm,
  },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  progressPct: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.primary },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryLight,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  progressHint: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  progressHintReady: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.success },
  checklist: { gap: 6, marginTop: spacing.xs },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  checkLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  checkLabelDone: { color: colors.inkSecondary },

  pickBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(3,42,40,0.5)',
    justifyContent: 'flex-end',
  },
  pickSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow.lg,
  },
  pickTitle: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.ink },
  pickSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginBottom: spacing.xs },
  pickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  pickRowText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink },
  pickCancel: { alignItems: 'center', paddingVertical: spacing.md },
  pickCancelText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.muted },

  previewBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  previewTitle: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
    marginRight: spacing.md,
  },
  previewImage: { flex: 1, width: '100%' },

  fieldStack: { gap: spacing.sm },
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
    letterSpacing: 8,
    paddingVertical: spacing.sm,
  },
  panInput: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.ink,
    letterSpacing: 1,
    paddingVertical: spacing.sm,
  },
  textInput: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: spacing.sm,
  },

  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.14)',
  },
  consentBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  consentBoxOn: { backgroundColor: colors.primary },
  consentText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.inkSecondary,
    lineHeight: 16,
  },

  welcomeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(252,211,77,0.15)',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.35)',
  },
  welcomeCopy: { flex: 1, gap: 2 },
  welcomeTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  welcomeSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },

  rejectBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.18)',
  },
  rejectCopy: { flex: 1, gap: 2 },
  rejectTitle: { fontFamily: fonts.bold, fontSize: 12, color: colors.error },
  rejectText: { fontFamily: fonts.medium, fontSize: 11, color: colors.error, lineHeight: 16 },

  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    gap: spacing.md,
  },
  summaryRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  summaryLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  summaryValue: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.ink,
    textAlign: 'right',
  },

  verifiedBlock: { gap: spacing.sm },
  verifiedPerks: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  perkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  perkText: { fontFamily: fonts.semiBold, fontSize: 10, color: colors.primaryDark },
  verifiedName: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
  },
});
