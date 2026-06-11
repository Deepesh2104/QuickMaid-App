import { DEMO_OTP } from '@/constants/app';

import type { KycAadhaarVerification } from '@/features/kyc/types/kyc.types';

import { isValidAadhaar, normalizeAadhaar } from '@/features/kyc/lib/kyc.validation';



export const AADHAAR_OTP_RESEND_SEC = 30;



const otpSessions = new Map<string, { sentAt: number; maskedMobile: string }>();



function maskedMobileForAadhaar(aadhaar: string): string {

  const digits = normalizeAadhaar(aadhaar);

  return `••••••${digits.slice(-4)}`;

}



export async function sendDigiLockerAadhaarOtp(

  aadhaarNumber: string,

): Promise<{ ok: boolean; error?: string; maskedMobile?: string }> {

  const normalized = normalizeAadhaar(aadhaarNumber);

  if (!isValidAadhaar(normalized)) {

    return { ok: false, error: 'Sahi 12-digit Aadhaar number daalo' };

  }



  await new Promise((r) => setTimeout(r, 700));



  const maskedMobile = maskedMobileForAadhaar(normalized);

  otpSessions.set(normalized, { sentAt: Date.now(), maskedMobile });

  return { ok: true, maskedMobile };

}



export async function verifyDigiLockerAadhaarOtp(

  aadhaarNumber: string,

  otp: string,

  holderName: string,

): Promise<{ ok: boolean; error?: string; verification?: KycAadhaarVerification }> {

  const normalized = normalizeAadhaar(aadhaarNumber);

  if (!isValidAadhaar(normalized)) {

    return { ok: false, error: 'Sahi 12-digit Aadhaar number daalo' };

  }

  if (otp.length !== 6) {

    return { ok: false, error: 'Poora 6-digit OTP daalo' };

  }



  await new Promise((r) => setTimeout(r, 500));



  if (otp !== DEMO_OTP) {

    return { ok: false, error: `Galat OTP. Demo OTP: ${DEMO_OTP}` };

  }



  const session = otpSessions.get(normalized);

  return {

    ok: true,

    verification: {

      number: normalized,

      verified: true,

      verifiedAt: new Date().toISOString(),

      method: 'digilocker_otp',

      holderName: holderName.trim() || 'Partner',

      maskedMobile: session?.maskedMobile ?? maskedMobileForAadhaar(normalized),

    },

  };

}


