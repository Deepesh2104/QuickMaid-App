export type KycDocumentKind = 'selfie';

export interface KycDocumentUpload {
  kind: KycDocumentKind;
  uri: string;
  uploadedAt: string;
}

export interface KycBankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifsc: string;
  verified?: boolean;
  verifiedAt?: string;
  bankName?: string;
}

export interface KycAadhaarVerification {
  number: string;
  verified: boolean;
  verifiedAt?: string;
  method: 'digilocker_otp';
  holderName?: string;
  maskedMobile?: string;
}

export interface KycPanVerification {
  number: string;
  verified: boolean;
  verifiedAt?: string;
  method: 'digilocker_otp';
  holderName?: string;
  maskedMobile?: string;
}

export interface KycDraft {
  documents: KycDocumentUpload[];
  aadhaar: KycAadhaarVerification;
  pan: KycPanVerification;
  /** Synced from pan.number when DigiLocker verified */
  panNumber: string;
  bank: KycBankDetails;
  upiId: string;
  upiVerified?: boolean;
  upiVerifiedAt?: string;
  consentAccepted: boolean;
  submittedAt?: string;
  rejectionReason?: string;
}

export interface KycChecklistItem {
  id: string;
  label: string;
  done: boolean;
  required: boolean;
}
