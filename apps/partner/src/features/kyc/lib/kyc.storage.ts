import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/app';
import { isValidPan, normalizePan } from '@/features/kyc/lib/kyc.validation';
import type {
  KycAadhaarVerification,
  KycBankDetails,
  KycDraft,
  KycDocumentKind,
  KycDocumentUpload,
  KycPanVerification,
} from '@/features/kyc/types/kyc.types';

const EMPTY_BANK: KycBankDetails = {
  accountHolderName: '',
  accountNumber: '',
  ifsc: '',
};

const EMPTY_AADHAAR: KycAadhaarVerification = {
  number: '',
  verified: false,
  method: 'digilocker_otp',
};

const EMPTY_PAN: KycPanVerification = {
  number: '',
  verified: false,
  method: 'digilocker_otp',
};

export const EMPTY_KYC_DRAFT: KycDraft = {
  documents: [],
  aadhaar: { ...EMPTY_AADHAAR },
  pan: { ...EMPTY_PAN },
  panNumber: '',
  bank: { ...EMPTY_BANK },
  upiId: '',
  consentAccepted: false,
};

function migrateLegacyDraft(raw: Record<string, unknown>): Partial<KycDraft> {
  const legacy = raw as Partial<KycDraft> & { aadhaarLast4?: string };
  const patch: Partial<KycDraft> = { ...legacy };

  if (!legacy.aadhaar) {
    const last4 = typeof legacy.aadhaarLast4 === 'string' ? legacy.aadhaarLast4 : '';
    patch.aadhaar = {
      number: '',
      verified: false,
      method: 'digilocker_otp',
      maskedMobile: last4 ? `••••••${last4}` : undefined,
    };
  }

  if (!legacy.pan) {
    const panNum = normalizePan(legacy.panNumber ?? '');
    patch.pan = {
      number: panNum,
      verified: isValidPan(panNum),
      method: 'digilocker_otp',
      verifiedAt: isValidPan(panNum) ? new Date().toISOString() : undefined,
    };
  }

  return patch;
}

export function normalizeKycDraft(raw: Partial<KycDraft> | null | undefined): KycDraft {
  if (!raw) {
    return { ...EMPTY_KYC_DRAFT, bank: { ...EMPTY_BANK }, aadhaar: { ...EMPTY_AADHAAR }, pan: { ...EMPTY_PAN } };
  }

  const migrated = migrateLegacyDraft(raw as Record<string, unknown>);
  const aadhaar = migrated.aadhaar ?? EMPTY_AADHAAR;
  const pan = migrated.pan ?? EMPTY_PAN;
  const panNumber = pan.verified && pan.number ? pan.number : migrated.panNumber ?? pan.number ?? '';

  return {
    documents: (migrated.documents ?? []).filter((d) => d.kind === 'selfie'),
    aadhaar: {
      number: aadhaar.number ?? '',
      verified: Boolean(aadhaar.verified),
      verifiedAt: aadhaar.verifiedAt,
      method: 'digilocker_otp',
      holderName: aadhaar.holderName,
      maskedMobile: aadhaar.maskedMobile,
    },
    pan: {
      number: pan.number ?? '',
      verified: Boolean(pan.verified),
      verifiedAt: pan.verifiedAt,
      method: 'digilocker_otp',
      holderName: pan.holderName,
      maskedMobile: pan.maskedMobile,
    },
    panNumber,
    bank: {
      accountHolderName: migrated.bank?.accountHolderName ?? '',
      accountNumber: migrated.bank?.accountNumber ?? '',
      ifsc: migrated.bank?.ifsc ?? '',
      verified: Boolean(migrated.bank?.verified),
      verifiedAt: migrated.bank?.verifiedAt,
      bankName: migrated.bank?.bankName,
    },
    upiId: migrated.upiId ?? '',
    upiVerified: Boolean(migrated.upiVerified),
    upiVerifiedAt: migrated.upiVerifiedAt,
    consentAccepted: migrated.consentAccepted ?? false,
    submittedAt: migrated.submittedAt,
    rejectionReason: migrated.rejectionReason,
  };
}

export async function getKycDraft(): Promise<KycDraft> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.kycDraft);
  if (!raw) {
    return { ...EMPTY_KYC_DRAFT, bank: { ...EMPTY_BANK }, aadhaar: { ...EMPTY_AADHAAR }, pan: { ...EMPTY_PAN } };
  }
  try {
    return normalizeKycDraft(JSON.parse(raw) as Partial<KycDraft>);
  } catch {
    return { ...EMPTY_KYC_DRAFT, bank: { ...EMPTY_BANK }, aadhaar: { ...EMPTY_AADHAAR }, pan: { ...EMPTY_PAN } };
  }
}

export async function saveKycDraft(draft: KycDraft): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.kycDraft, JSON.stringify(draft));
}

export async function resetKycDraft(): Promise<KycDraft> {
  await AsyncStorage.removeItem(STORAGE_KEYS.kycDraft);
  return { ...EMPTY_KYC_DRAFT, bank: { ...EMPTY_BANK }, aadhaar: { ...EMPTY_AADHAAR }, pan: { ...EMPTY_PAN } };
}

export async function patchKycDraft(patch: Partial<KycDraft>): Promise<KycDraft> {
  const draft = await getKycDraft();
  const mergedPan = patch.pan ? { ...draft.pan, ...patch.pan } : draft.pan;
  const next = normalizeKycDraft({
    ...draft,
    ...patch,
    bank: patch.bank ? { ...draft.bank, ...patch.bank } : draft.bank,
    aadhaar: patch.aadhaar ? { ...draft.aadhaar, ...patch.aadhaar } : draft.aadhaar,
    pan: mergedPan,
    panNumber: patch.pan?.number ?? patch.panNumber ?? (mergedPan.verified ? mergedPan.number : draft.panNumber),
  });
  await saveKycDraft(next);
  return next;
}

export async function upsertKycDocument(kind: KycDocumentKind, uri: string): Promise<KycDraft> {
  const draft = await getKycDraft();
  const upload: KycDocumentUpload = {
    kind,
    uri,
    uploadedAt: new Date().toISOString(),
  };
  const documents = [...draft.documents.filter((d) => d.kind !== kind), upload];
  return patchKycDraft({ documents });
}

export async function removeKycDocument(kind: KycDocumentKind): Promise<KycDraft> {
  const draft = await getKycDraft();
  return patchKycDraft({
    documents: draft.documents.filter((d) => d.kind !== kind),
  });
}

export async function markKycSubmitted(): Promise<KycDraft> {
  return patchKycDraft({
    submittedAt: new Date().toISOString(),
    rejectionReason: undefined,
  });
}

export async function seedKycDraftFromProfile(input: {
  upiId?: string;
  accountHolderName?: string;
}): Promise<KycDraft> {
  const draft = await getKycDraft();
  const patch: Partial<KycDraft> = {};
  if (!draft.upiId.trim() && input.upiId?.trim()) {
    patch.upiId = input.upiId.trim();
  }
  if (!draft.bank.accountHolderName.trim() && input.accountHolderName?.trim()) {
    patch.bank = {
      ...draft.bank,
      accountHolderName: input.accountHolderName.trim(),
    };
  }
  if (Object.keys(patch).length === 0) return draft;
  return patchKycDraft(patch);
}

export function documentUri(draft: KycDraft, kind: KycDocumentKind): string | undefined {
  return draft.documents.find((d) => d.kind === kind)?.uri;
}
