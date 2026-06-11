import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QmButton } from '@/components/ui/QmButton';
import { usePartner } from '@/context/PartnerContext';
import { KYC_INTRO_ITEMS, KYC_INTRO_STEPS_MAID } from '@/features/kyc/constants/kyc.intro';
import {
  KYC_DOCUMENT_SLOTS,
  KYC_REJECTION_REASONS,
  KYC_REVIEW_TIMELINE,
  KYC_STATS,
  KYC_TIPS,
} from '@/features/kyc/constants/kyc.premium';
import { PartnerKycSubmittedModal } from '@/features/kyc/components/PartnerKycSubmittedModal';
import { PartnerKycAadhaarDigiLocker } from '@/features/kyc/components/PartnerKycAadhaarDigiLocker';
import { PartnerKycPanDigiLocker } from '@/features/kyc/components/PartnerKycPanDigiLocker';
import { PartnerKycPayoutVerify } from '@/features/kyc/components/PartnerKycPayoutVerify';
import {
  PartnerKycConsentRow,
  PartnerKycDocumentPreviewModal,
  PartnerKycPickSourceModal,
  PartnerKycProgressCard,
  PartnerKycRejectedBanner,
  PartnerKycSubmittedSummary,
  PartnerKycVerifiedPanel,
} from '@/features/kyc/components/PartnerKycSections';
import { PartnerKycStepBar } from '@/features/kyc/components/PartnerKycStepBar';
import { PartnerKycUploadSlot } from '@/features/kyc/components/PartnerKycUploadSlot';
import { pickKycDocumentFromSource } from '@/features/kyc/lib/kyc.photo';
import {
  canAdvanceFromStep,
  nextWizardStep,
  prevWizardStep,
  resolveKycWizardStart,
  type KycWizardStep,
} from '@/features/kyc/lib/kyc.routing';
import {
  documentUri,
  markKycSubmitted,
  patchKycDraft,
  removeKycDocument,
  resetKycDraft,
  seedKycDraftFromProfile,
  upsertKycDocument,
} from '@/features/kyc/lib/kyc.storage';
import { getAppEnv } from '@/config/env';
import { resetPartnerKycToPending } from '@/lib/storage';
import {
  kycCanSubmit,
  kycChecklist,
  kycOverallProgress,
  kycUploadProgress,
  kycValidationError,
} from '@/features/kyc/lib/kyc.utils';
import type { KycDocumentKind, KycDraft } from '@/features/kyc/types/kyc.types';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import { kycMeta } from '@/features/profile/lib/profile.utils';
import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const SHEET_OVERLAP = 14;
const SHEET_BG = '#EFF8F7';

const EMPTY_DRAFT: KycDraft = {
  documents: [],
  aadhaar: { number: '', verified: false, method: 'digilocker_otp' },
  pan: { number: '', verified: false, method: 'digilocker_otp' },
  panNumber: '',
  bank: { accountHolderName: '', accountNumber: '', ifsc: '' },
  upiId: '',
  consentAccepted: false,
};

export function PartnerKycFlowScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ welcome?: string }>();
  const insets = useSafeAreaInsets();
  const { tabScrollPad } = useLayoutMetrics();
  const { profile, updateProfile, refresh } = usePartner();

  const [draft, setDraft] = useState<KycDraft | null>(null);
  const [wizardStep, setWizardStep] = useState<KycWizardStep>('intro');
  const [loadingSlot, setLoadingSlot] = useState<KycDocumentKind | null>(null);
  const [pickKind, setPickKind] = useState<KycDocumentKind | null>(null);
  const [preview, setPreview] = useState<{ title: string; uri: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitted, setShowSubmitted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [resetting, setResetting] = useState(false);

  const showKycDevReset = __DEV__ || getAppEnv() !== 'production';

  const kyc = kycMeta(profile?.kycStatus);
  const safeDraft = draft ?? EMPTY_DRAFT;

  const checklist = useMemo(() => kycChecklist(safeDraft), [safeDraft]);
  const docProgress = useMemo(() => kycUploadProgress(safeDraft), [safeDraft]);
  const overallProgress = useMemo(() => kycOverallProgress(safeDraft), [safeDraft]);
  const canSubmit = useMemo(
    () => kycCanSubmit(safeDraft) && profile?.kycStatus !== 'verified',
    [safeDraft, profile?.kycStatus],
  );
  const validationHint = useMemo(() => kycValidationError(safeDraft), [safeDraft]);
  const canNext = useMemo(() => canAdvanceFromStep(wizardStep, safeDraft), [wizardStep, safeDraft]);

  const showWizard =
    profile?.kycStatus === 'pending' ||
    profile?.kycStatus === 'rejected' ||
    !profile?.kycStatus;

  const showReviewState = profile?.kycStatus === 'under_review';
  const showVerifiedState = profile?.kycStatus === 'verified';

  const loadDraft = useCallback(async () => {
    let saved = await seedKycDraftFromProfile({
      upiId: profile?.upiId,
      accountHolderName: profile?.name,
    });

    if (profile?.kycStatus === 'rejected' && !saved.rejectionReason) {
      saved = await patchKycDraft({ rejectionReason: KYC_REJECTION_REASONS[0] });
    }

    setDraft(saved);

    if (showWizard) {
      const start = resolveKycWizardStart(saved, params.welcome === '1');
      setWizardStep(start);
    }
  }, [profile?.upiId, profile?.name, profile?.kycStatus, params.welcome, showWizard]);

  useEffect(() => {
    void loadDraft();
  }, [loadDraft]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDraft();
    setRefreshing(false);
  };

  const pickDocument = async (kind: KycDocumentKind, source: 'camera' | 'gallery') => {
    setLoadingSlot(kind);
    const uri = await pickKycDocumentFromSource(kind, source);
    if (uri) {
      const next = await upsertKycDocument(kind, uri);
      setDraft(next);
    }
    setLoadingSlot(null);
  };

  const clearDocument = async (kind: KycDocumentKind) => {
    const next = await removeKycDocument(kind);
    setDraft(next);
  };

  const updateDraft = async (patch: Parameters<typeof patchKycDraft>[0]) => {
    const next = await patchKycDraft(patch);
    setDraft(next);
  };

  const goNext = () => {
    if (!canNext) return;
    Haptics.selectionAsync();
    const next = nextWizardStep(wizardStep);
    if (next) setWizardStep(next);
  };

  const goBack = () => {
    Haptics.selectionAsync();
    if (wizardStep === 'intro') {
      if (router.canGoBack()) router.back();
      else router.replace('/(tabs)' as Href);
      return;
    }
    const prev = prevWizardStep(wizardStep);
    if (prev) setWizardStep(prev);
  };

  const submitKyc = async () => {
    if (!canSubmit || !profile) return;
    setSubmitting(true);
    await markKycSubmitted();
    await updateProfile({
      kycStatus: 'under_review',
      upiId: safeDraft.upiId.trim(),
    });
    setSubmitting(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowSubmitted(true);
  };

  const skipToHome = () => {
    Haptics.selectionAsync();
    router.replace('/(tabs)' as Href);
  };

  const restartKycFromScratch = async () => {
    if (!profile || resetting) return;
    setResetting(true);
    await resetKycDraft();
    await resetPartnerKycToPending();
    await refresh();
    const fresh = await seedKycDraftFromProfile({
      upiId: profile.upiId,
      accountHolderName: profile.name,
    });
    setDraft(fresh);
    setWizardStep('intro');
    setShowSubmitted(false);
    setResetting(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/kyc?welcome=1' as Href);
  };

  const activeSlot = KYC_DOCUMENT_SLOTS.find((s) => s.kind === pickKind);

  const renderWizardStep = () => {
    switch (wizardStep) {
      case 'intro':
        return (
          <Animated.View entering={FadeInDown.duration(280)} style={styles.block}>
            <View style={styles.introHero}>
              <Ionicons name="shield-checkmark" size={28} color={colors.partnerGold} />
              <Text style={styles.introTitle}>KYC se payout unlock hota hai</Text>
              <Text style={styles.introSub}>
                Pehle verify karo, phir har Monday UPI par earning milegi. Jobs ab bhi accept kar sakti ho.
              </Text>
            </View>

            <Text style={styles.introListTitle}>Maid ko ye tayyar rakhna hai</Text>
            {KYC_INTRO_ITEMS.map((item) => (
              <View key={item.title} style={styles.introRow}>
                <View style={styles.introIcon}>
                  <Ionicons name={item.icon} size={18} color={colors.primary} />
                </View>
                <View style={styles.introCopy}>
                  <Text style={styles.introRowTitle}>{item.title}</Text>
                  <Text style={styles.introRowSub}>{item.sub}</Text>
                </View>
              </View>
            ))}

            <View style={styles.flowBox}>
              <Text style={styles.flowTitle}>Poora flow</Text>
              {KYC_INTRO_STEPS_MAID.map((line, i) => (
                <View key={line} style={styles.flowLine}>
                  <Text style={styles.flowNum}>{i + 1}</Text>
                  <Text style={styles.flowText}>{line}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        );

      case 'aadhaar':
        return (
          <Animated.View entering={FadeInDown.duration(280)} style={styles.block}>
            <PartnerRequestsSectionHeader
              eyebrow="Step 1 of 5"
              title="DigiLocker Aadhaar verify"
              subtitle="Number + OTP · photo upload nahi"
              icon="lock-closed-outline"
              compact
            />
            {profile?.kycStatus === 'rejected' ? (
              <PartnerKycRejectedBanner reason={safeDraft.rejectionReason} />
            ) : null}
            <PartnerKycAadhaarDigiLocker
              aadhaar={safeDraft.aadhaar}
              profileName={profile?.name}
              onChangeNumber={(number) => {
                setDraft((prev) =>
                  prev
                    ? {
                        ...prev,
                        aadhaar: {
                          number,
                          verified: false,
                          method: 'digilocker_otp',
                        },
                      }
                    : prev,
                );
                void updateDraft({
                  aadhaar: { number, verified: false, method: 'digilocker_otp' },
                });
              }}
              onVerified={(verification) => {
                setDraft((prev) => (prev ? { ...prev, aadhaar: verification } : prev));
                void updateDraft({ aadhaar: verification });
              }}
            />
          </Animated.View>
        );

      case 'documents':
        return (
          <Animated.View entering={FadeInDown.duration(280)} style={styles.block}>
            <PartnerRequestsSectionHeader
              eyebrow="Step 2 of 5"
              title="Live selfie upload"
              subtitle={`${docProgress}% done · front camera best`}
              icon="document-attach-outline"
              compact
            />
            {profile?.kycStatus === 'rejected' ? (
              <PartnerKycRejectedBanner reason={safeDraft.rejectionReason} />
            ) : null}
            <View style={styles.uploadGrid}>
              {KYC_DOCUMENT_SLOTS.map((slot) => (
                <PartnerKycUploadSlot
                  key={slot.kind}
                  title={slot.title}
                  hint={slot.hint}
                  icon={slot.icon}
                  uri={documentUri(safeDraft, slot.kind)}
                  loading={loadingSlot === slot.kind}
                  onPick={() => setPickKind(slot.kind)}
                  onPreview={() => {
                    const uri = documentUri(safeDraft, slot.kind);
                    if (uri) setPreview({ title: slot.title, uri });
                  }}
                  onClear={() => void clearDocument(slot.kind)}
                />
              ))}
            </View>
            <View style={styles.tips}>
              {KYC_TIPS.slice(0, 3).map((tip) => (
                <View key={tip} style={styles.tipRow}>
                  <View style={styles.tipDot} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        );

      case 'pan':
        return (
          <Animated.View entering={FadeInDown.duration(280)} style={styles.block}>
            <PartnerRequestsSectionHeader
              eyebrow="Step 3 of 5"
              title="DigiLocker PAN verify"
              subtitle="Internal API · naam match · OTP nahi"
              icon="document-text-outline"
              compact
            />
            <PartnerKycPanDigiLocker
              pan={safeDraft.pan}
              expectedName={safeDraft.aadhaar.holderName ?? profile?.name}
              onChangePan={(number) => {
                setDraft((prev) =>
                  prev
                    ? {
                        ...prev,
                        pan: { number, verified: false, method: 'digilocker_otp' },
                        panNumber: number,
                      }
                    : prev,
                );
                void updateDraft({
                  pan: { number, verified: false, method: 'digilocker_otp' },
                  panNumber: number,
                });
              }}
              onVerified={(verification) => {
                setDraft((prev) =>
                  prev ? { ...prev, pan: verification, panNumber: verification.number } : prev,
                );
                void updateDraft({ pan: verification, panNumber: verification.number });
              }}
            />
          </Animated.View>
        );

      case 'payout':
        return (
          <Animated.View entering={FadeInDown.duration(280)} style={styles.block}>
            <PartnerRequestsSectionHeader
              eyebrow="Step 4 of 5"
              title="Bank & UPI details"
              subtitle="Internal API · bank + UPI naam match"
              icon="business-outline"
              compact
            />
            <PartnerKycPayoutVerify
              draft={safeDraft}
              expectedName={
                safeDraft.pan.holderName ?? safeDraft.aadhaar.holderName ?? profile?.name
              }
              onBankChange={(patch) => {
                const nextBank = { ...safeDraft.bank, ...patch };
                setDraft((prev) => (prev ? { ...prev, bank: nextBank } : prev));
                void updateDraft({ bank: nextBank });
              }}
              onBankVerified={(bank) => {
                setDraft((prev) => (prev ? { ...prev, bank } : prev));
                void updateDraft({ bank });
              }}
              onUpiChange={(upi) => {
                setDraft((prev) =>
                  prev ? { ...prev, upiId: upi, upiVerified: false, upiVerifiedAt: undefined } : prev,
                );
                void updateDraft({ upiId: upi, upiVerified: false, upiVerifiedAt: undefined });
              }}
              onUpiVerified={() => {
                const at = new Date().toISOString();
                setDraft((prev) => (prev ? { ...prev, upiVerified: true, upiVerifiedAt: at } : prev));
                void updateDraft({ upiVerified: true, upiVerifiedAt: at });
              }}
            />
          </Animated.View>
        );

      case 'review':
        return (
          <Animated.View entering={FadeInDown.duration(280)} style={styles.block}>
            <PartnerRequestsSectionHeader
              eyebrow="Step 5 of 5"
              title="Review & submit"
              subtitle="Sab check karo, phir bhejo"
              icon="shield-checkmark-outline"
              compact
            />
            <PartnerKycProgressCard progress={overallProgress} checklist={checklist} />
            <PartnerKycSubmittedSummary draft={safeDraft} />
            <PartnerKycConsentRow
              accepted={safeDraft.consentAccepted}
              onToggle={() => {
                const next = !safeDraft.consentAccepted;
                setDraft((prev) => (prev ? { ...prev, consentAccepted: next } : prev));
                void updateDraft({ consentAccepted: next });
              }}
            />
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#032A28', '#084F4A', '#0B6E67']}
        locations={[0, 0.5, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.xs }]}
      >
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={goBack} accessibilityRole="button">
            <Ionicons name="arrow-back" size={20} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>PARTNER KYC</Text>
            <Text style={styles.headerTitle}>
              {showWizard ? 'Verification flow' : 'KYC status'}
            </Text>
            <Text style={styles.headerSub}>{profile?.name ?? 'Partner'} · {kyc.label}</Text>
          </View>
        </View>

        <View style={styles.statBar}>
          {KYC_STATS.map((stat, idx) => (
            <View key={stat.label} style={styles.statRow}>
              {idx > 0 ? <View style={styles.statDivider} /> : null}
              <View style={styles.statChip}>
                <Text style={styles.statNum}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} tintColor={colors.primary} />
          }
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: showWizard ? tabScrollPad + 100 : tabScrollPad + spacing.xl },
          ]}
        >
          <View style={[styles.statusCard, { backgroundColor: kyc.bg }]}>
            <Ionicons name={kyc.icon} size={20} color={kyc.color} />
            <View style={styles.statusCopy}>
              <Text style={[styles.statusTitle, { color: kyc.color }]}>{kyc.label}</Text>
              <Text style={styles.statusSub}>{kyc.hint}</Text>
            </View>
          </View>

          {showWizard ? (
            <>
              {wizardStep !== 'intro' ? <PartnerKycStepBar active={wizardStep} /> : null}
              {renderWizardStep()}
            </>
          ) : null}

          {showVerifiedState ? (
            <View style={styles.block}>
              <PartnerKycVerifiedPanel draft={safeDraft} profileName={profile?.name} />
              <QmButton
                label="Back to jobs"
                icon="briefcase-outline"
                onPress={() => router.replace('/(tabs)' as Href)}
              />
            </View>
          ) : null}

          {showReviewState ? (
            <View style={styles.block}>
              <PartnerRequestsSectionHeader
                eyebrow="Submitted"
                title="Review chal raha hai"
                subtitle="24–48 hours · notification aayegi"
                icon="time-outline"
                compact
              />
              <View style={styles.timeline}>
                {KYC_REVIEW_TIMELINE.map((step, idx) => (
                  <View key={step.title} style={styles.timelineRow}>
                    <View style={[styles.timelineDot, idx === 0 && styles.timelineDotActive]}>
                      <Ionicons name={step.icon} size={14} color={idx === 0 ? colors.primary : colors.muted} />
                    </View>
                    <View style={styles.timelineCopy}>
                      <Text style={styles.timelineTitle}>{step.title}</Text>
                      <Text style={styles.timelineSub}>{step.sub}</Text>
                    </View>
                  </View>
                ))}
              </View>
              <PartnerKycSubmittedSummary draft={safeDraft} />
              <QmButton
                label="Back to jobs"
                icon="briefcase-outline"
                variant="secondary"
                onPress={() => router.replace('/(tabs)' as Href)}
              />
              {showKycDevReset ? (
                <QmButton
                  label="Scratch se dubara test karo"
                  icon="refresh-outline"
                  variant="ghost"
                  loading={resetting}
                  onPress={() => void restartKycFromScratch()}
                />
              ) : null}
            </View>
          ) : null}

          {showVerifiedState && showKycDevReset ? (
            <View style={styles.block}>
              <QmButton
                label="Scratch se dubara test karo"
                icon="refresh-outline"
                variant="ghost"
                loading={resetting}
                onPress={() => void restartKycFromScratch()}
              />
            </View>
          ) : null}
        </ScrollView>

        {showWizard ? (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
            {wizardStep === 'intro' ? (
              <>
                <QmButton
                  label="KYC shuru karein"
                  icon="arrow-forward"
                  onPress={() => {
                    Haptics.selectionAsync();
                    setWizardStep('aadhaar');
                  }}
                />
                <Pressable style={styles.skipBtn} onPress={skipToHome}>
                  <Text style={styles.skipText}>Baad mein karenge · pehle jobs dekho</Text>
                </Pressable>
              </>
            ) : wizardStep === 'review' ? (
              <>
                <QmButton
                  label="Submit for verification"
                  icon="shield-checkmark"
                  onPress={() => void submitKyc()}
                  loading={submitting}
                  disabled={!canSubmit}
                />
                {!canSubmit && validationHint ? (
                  <Text style={styles.footerHint}>Pending: {validationHint}</Text>
                ) : null}
              </>
            ) : (
              <>
                <QmButton
                  label="Agla step"
                  icon="arrow-forward"
                  onPress={goNext}
                  disabled={!canNext}
                />
                {!canNext && validationHint ? (
                  <Text style={styles.footerHint}>Pehle complete karo: {validationHint}</Text>
                ) : null}
              </>
            )}
          </View>
        ) : null}
      </View>

      <PartnerKycPickSourceModal
        visible={pickKind !== null}
        title={activeSlot?.title ?? 'Upload document'}
        preferCamera={activeSlot?.preferCamera}
        onClose={() => setPickKind(null)}
        onSelect={(source) => {
          if (pickKind) void pickDocument(pickKind, source);
        }}
      />

      <PartnerKycDocumentPreviewModal
        visible={preview !== null}
        title={preview?.title ?? ''}
        uri={preview?.uri}
        onClose={() => setPreview(null)}
      />

      <PartnerKycSubmittedModal
        visible={showSubmitted}
        onClose={() => {
          setShowSubmitted(false);
          router.replace('/(tabs)' as Href);
        }}
        onViewEarnings={() => {
          setShowSubmitted(false);
          router.replace('/(tabs)/earnings' as Href);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primaryDark },
  header: {
    paddingHorizontal: layout.pad,
    paddingBottom: SHEET_OVERLAP + spacing.md,
    gap: spacing.sm,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerCopy: { flex: 1, gap: 1 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(252,211,77,0.9)',
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.white,
  },
  headerSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
  },
  statBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(110,231,183,0.1)',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.22)',
  },
  statRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  statChip: { flex: 1, alignItems: 'center', gap: 1 },
  statNum: { fontFamily: fonts.extraBold, fontSize: 13, color: colors.white },
  statLabel: { fontFamily: fonts.medium, fontSize: 9, color: 'rgba(255,255,255,0.6)' },
  statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.14)' },

  sheet: {
    flex: 1,
    marginTop: -SHEET_OVERLAP,
    backgroundColor: SHEET_BG,
    borderTopLeftRadius: radius.xxl + 6,
    borderTopRightRadius: radius.xxl + 6,
    overflow: 'hidden',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(11,110,103,0.22)',
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  scroll: { paddingHorizontal: layout.pad, gap: spacing.lg },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.xl,
  },
  statusCopy: { flex: 1, gap: 2 },
  statusTitle: { fontFamily: fonts.extraBold, fontSize: 13 },
  statusSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },

  block: { gap: spacing.md },
  introHero: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.25)',
  },
  introTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 17,
    color: colors.ink,
    textAlign: 'center',
  },
  introSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
  introListTitle: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.ink,
    marginTop: spacing.xs,
  },
  introRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  introIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introCopy: { flex: 1, gap: 2 },
  introRowTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  introRowSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },

  flowBox: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  flowTitle: { fontFamily: fonts.bold, fontSize: 12, color: colors.primary },
  flowLine: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  flowNum: {
    width: 20,
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.primary,
  },
  flowText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.inkSecondary,
    lineHeight: 17,
  },

  uploadGrid: { gap: spacing.sm },
  tips: { gap: spacing.sm },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  tipText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.inkSecondary, lineHeight: 17 },

  timeline: { gap: spacing.sm },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotActive: {
    borderColor: 'rgba(11,110,103,0.35)',
    backgroundColor: colors.primaryLight,
  },
  timelineCopy: { flex: 1, gap: 2 },
  timelineTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  timelineSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    backgroundColor: SHEET_BG,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  footerHint: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
  },
  skipBtn: { alignItems: 'center', paddingVertical: spacing.xs },
  skipText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted },
});
