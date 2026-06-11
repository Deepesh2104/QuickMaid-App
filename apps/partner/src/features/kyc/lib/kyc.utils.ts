import { KYC_DOCUMENT_SLOTS } from '@/features/kyc/constants/kyc.premium';
import { documentUri } from '@/features/kyc/lib/kyc.storage';
import {
  isValidAccountNumber,
  isValidAadhaar,
  isValidIfsc,
  isValidPan,
  isValidUpi,
} from '@/features/kyc/lib/kyc.validation';
import type { KycChecklistItem, KycDraft } from '@/features/kyc/types/kyc.types';

export function kycUploadProgress(draft: KycDraft): number {
  const required = KYC_DOCUMENT_SLOTS.filter((s) => s.required);
  if (required.length === 0) return 0;
  const done = required.filter((s) => Boolean(documentUri(draft, s.kind))).length;
  return Math.round((done / required.length) * 100);
}

export function kycChecklist(draft: KycDraft): KycChecklistItem[] {
  const selfieDone = Boolean(documentUri(draft, 'selfie'));
  const aadhaarVerified = draft.aadhaar.verified && isValidAadhaar(draft.aadhaar.number);
  const panVerified = draft.pan.verified && isValidPan(draft.pan.number);

  return [
    {
      id: 'aadhaar_verified',
      label: 'Aadhaar verified (DigiLocker OTP)',
      done: aadhaarVerified,
      required: true,
    },
    { id: 'selfie', label: 'Live selfie uploaded', done: selfieDone, required: true },
    {
      id: 'pan_verified',
      label: 'PAN verified (DigiLocker)',
      done: panVerified,
      required: true,
    },
    {
      id: 'bank_verified',
      label: 'Bank verified (internal API)',
      done:
        Boolean(draft.bank.verified) &&
        draft.bank.accountHolderName.trim().length >= 3 &&
        isValidAccountNumber(draft.bank.accountNumber) &&
        isValidIfsc(draft.bank.ifsc),
      required: true,
    },
    {
      id: 'upi_verified',
      label: 'UPI verified (internal API)',
      done: Boolean(draft.upiVerified) && isValidUpi(draft.upiId),
      required: true,
    },
    { id: 'consent', label: 'Consent accepted', done: draft.consentAccepted, required: true },
  ];
}

export function kycOverallProgress(draft: KycDraft): number {
  const items = kycChecklist(draft).filter((i) => i.required);
  const done = items.filter((i) => i.done).length;
  return Math.round((done / items.length) * 100);
}

export function kycCanSubmit(draft: KycDraft): boolean {
  return kycChecklist(draft).filter((i) => i.required).every((i) => i.done);
}

export function kycValidationError(draft: KycDraft): string | null {
  const checklist = kycChecklist(draft);
  const missing = checklist.filter((i) => i.required && !i.done);
  if (missing.length === 0) return null;
  return missing[0].label;
}
