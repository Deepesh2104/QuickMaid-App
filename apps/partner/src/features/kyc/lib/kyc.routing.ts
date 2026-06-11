import type { KycStatus } from '@/constants/app';

/** Demo: only verified partners can accept jobs (matches Phase 4 403). */
export function canPartnerAcceptJobs(status?: KycStatus): boolean {
  return status === 'verified';
}

export function acceptBlockedMessage(status?: KycStatus): string {
  if (status === 'under_review') {
    return 'KYC review chal rahi hai — verify hone ke baad jobs accept kar sakte ho.';
  }
  if (status === 'rejected') {
    return 'KYC reject ho gayi — dubara submit karke accept karo.';
  }
  return 'Pehle KYC complete karo — tab hi jobs accept ho sakti hain.';
}
import type { KycDraft } from '@/features/kyc/types/kyc.types';
import { kycChecklist } from '@/features/kyc/lib/kyc.utils';

export type KycWizardStep = 'intro' | 'aadhaar' | 'documents' | 'pan' | 'payout' | 'review';

export const KYC_WIZARD_STEPS: { id: KycWizardStep; label: string; short: string }[] = [
  { id: 'intro', label: 'Start', short: '0' },
  { id: 'aadhaar', label: 'Aadhaar', short: '1' },
  { id: 'documents', label: 'Selfie', short: '2' },
  { id: 'pan', label: 'PAN', short: '3' },
  { id: 'payout', label: 'Payout', short: '4' },
  { id: 'review', label: 'Submit', short: '5' },
];

export function needsKycCompletion(status?: KycStatus): boolean {
  return !status || status === 'pending' || status === 'rejected';
}

export function kycPostAuthHref(status?: KycStatus, welcome = true): string {
  if (needsKycCompletion(status)) {
    return welcome ? '/kyc?welcome=1' : '/kyc';
  }
  return '/(tabs)';
}

export function resolveKycWizardStart(draft: KycDraft, welcome?: boolean): KycWizardStep {
  if (welcome) return 'intro';

  const checklist = kycChecklist(draft);
  const aadhaarDone = checklist.find((i) => i.id === 'aadhaar_verified')?.done;
  const selfieDone = checklist.find((i) => i.id === 'selfie')?.done;
  const panDone = checklist.find((i) => i.id === 'pan_verified')?.done;
  const payoutDone =
    checklist.find((i) => i.id === 'bank_verified')?.done &&
    checklist.find((i) => i.id === 'upi_verified')?.done;

  if (!aadhaarDone) return 'aadhaar';
  if (!selfieDone) return 'documents';
  if (!panDone) return 'pan';
  if (!payoutDone) return 'payout';
  return 'review';
}

export function stepIndex(step: KycWizardStep): number {
  return KYC_WIZARD_STEPS.findIndex((s) => s.id === step);
}

export function canAdvanceFromStep(step: KycWizardStep, draft: KycDraft): boolean {
  const checklist = kycChecklist(draft);
  const done = (id: string) => checklist.find((i) => i.id === id)?.done ?? false;

  switch (step) {
    case 'intro':
      return true;
    case 'aadhaar':
      return done('aadhaar_verified');
    case 'documents':
      return done('selfie');
    case 'pan':
      return done('pan_verified');
    case 'payout':
      return done('bank_verified') && done('upi_verified');
    case 'review':
      return checklist.filter((i) => i.required).every((i) => i.done);
    default:
      return false;
  }
}

export function nextWizardStep(step: KycWizardStep): KycWizardStep | null {
  const idx = stepIndex(step);
  if (idx < 0 || idx >= KYC_WIZARD_STEPS.length - 1) return null;
  return KYC_WIZARD_STEPS[idx + 1].id;
}

export function prevWizardStep(step: KycWizardStep): KycWizardStep | null {
  const idx = stepIndex(step);
  if (idx <= 0) return null;
  return KYC_WIZARD_STEPS[idx - 1].id;
}
