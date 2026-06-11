import { getApiBaseUrl } from '@/config/env';
import { namesMatch } from '@/features/kyc/lib/kyc.name';
import {
  isValidAccountNumber,
  isValidIfsc,
  isValidUpi,
  normalizeAccountNumber,
  normalizeIfsc,
} from '@/features/kyc/lib/kyc.validation';
import type { KycBankDetails } from '@/features/kyc/types/kyc.types';

export type IfscLookupResult = {
  ok: boolean;
  error?: string;
  bankName?: string;
  branch?: string;
};

export type BankVerifyResult = {
  ok: boolean;
  error?: string;
  successMessage?: string;
  bank?: KycBankDetails;
};

export type UpiVerifyResult = {
  ok: boolean;
  error?: string;
  successMessage?: string;
};

const DEMO_IFSC_REGISTRY: Record<string, { bankName: string; branch: string }> = {
  SBIN0001234: { bankName: 'State Bank of India', branch: 'Shankar Nagar, Raipur' },
  HDFC0001234: { bankName: 'HDFC Bank', branch: 'Sector 5, Raipur' },
  ICIC0001234: { bankName: 'ICICI Bank', branch: 'Civil Lines, Raipur' },
};

/** Demo accounts that match Sunita Verma profile */
const DEMO_BANK_HOLDERS: Record<string, string> = {
  '1234567890': 'Sunita Verma',
  '9876543210': 'Sunita Verma',
};

const DEMO_BANK_FALLBACK_HOLDER = 'Rajesh Patel';

const DEMO_UPI_HOLDERS: Record<string, string> = {
  'sunita.verma@okaxis': 'Sunita Verma',
  'demo.partner@okaxis': 'Sunita Verma',
  'sunitaverma@paytm': 'Sunita Verma',
};

const DEMO_UPI_FALLBACK_HOLDER = 'Amit Sharma';

export async function fetchIfscDetailsInternal(ifsc: string): Promise<IfscLookupResult> {
  const normalized = normalizeIfsc(ifsc);
  if (!isValidIfsc(normalized)) {
    return { ok: false, error: 'Sahi 11-character IFSC daalo (SBIN0001234)' };
  }

  const baseUrl = getApiBaseUrl();
  if (baseUrl) {
    try {
      const res = await fetch(`${baseUrl}/internal/kyc/ifsc/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ifsc: normalized }),
      });
      if (!res.ok) return { ok: false, error: 'IFSC lookup fail — dubara try karo' };
      const data = (await res.json()) as { bankName?: string; branch?: string };
      if (!data.bankName?.trim()) return { ok: false, error: 'IFSC par bank nahi mili' };
      return { ok: true, bankName: data.bankName.trim(), branch: data.branch?.trim() };
    } catch {
      return { ok: false, error: 'Network error — connection check karo' };
    }
  }

  await new Promise((r) => setTimeout(r, 450));
  const record = DEMO_IFSC_REGISTRY[normalized] ?? {
    bankName: 'Partner Bank',
    branch: 'Raipur Branch',
  };
  return { ok: true, bankName: record.bankName, branch: record.branch };
}

export async function verifyBankAccountInternal(
  accountNumber: string,
  ifsc: string,
  accountHolderName: string,
  expectedHolderName: string,
): Promise<BankVerifyResult> {
  const ac = normalizeAccountNumber(accountNumber);
  const code = normalizeIfsc(ifsc);
  const enteredName = accountHolderName.trim();
  const expected = expectedHolderName.trim();

  if (!isValidAccountNumber(ac)) {
    return { ok: false, error: 'Sahi account number daalo (9–18 digits)' };
  }
  if (!isValidIfsc(code)) {
    return { ok: false, error: 'Sahi IFSC code daalo' };
  }
  if (enteredName.length < 3) {
    return { ok: false, error: 'Account holder naam daalo' };
  }
  if (!expected) {
    return { ok: false, error: 'Pehle Aadhaar / PAN naam verify karo' };
  }
  if (!namesMatch(expected, enteredName)) {
    return {
      ok: false,
      error: `Entered naam match nahi. Expected: ${expected} · Aapne: ${enteredName}`,
    };
  }

  const ifscLookup = await fetchIfscDetailsInternal(code);
  if (!ifscLookup.ok || !ifscLookup.bankName) {
    return { ok: false, error: ifscLookup.error ?? 'IFSC verify nahi ho paya' };
  }

  const baseUrl = getApiBaseUrl();
  let apiHolderName = enteredName;

  if (baseUrl) {
    try {
      const res = await fetch(`${baseUrl}/internal/kyc/bank/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber: ac, ifsc: code }),
      });
      if (!res.ok) return { ok: false, error: 'Bank verify fail — dubara try karo' };
      const data = (await res.json()) as { holderName?: string; accountHolderName?: string };
      apiHolderName = (data.holderName ?? data.accountHolderName ?? '').trim();
      if (!apiHolderName) return { ok: false, error: 'Bank par account naam nahi mila' };
    } catch {
      return { ok: false, error: 'Network error — connection check karo' };
    }
  } else {
    await new Promise((r) => setTimeout(r, 700));
    apiHolderName = DEMO_BANK_HOLDERS[ac] ?? DEMO_BANK_FALLBACK_HOLDER;
  }

  if (!namesMatch(expected, apiHolderName)) {
    return {
      ok: false,
      error: `Bank naam match nahi. Expected: ${expected} · Bank par: ${apiHolderName}`,
    };
  }

  return {
    ok: true,
    successMessage: `Bank verify ho gaya — ${ifscLookup.bankName} · naam match`,
    bank: {
      accountHolderName: apiHolderName,
      accountNumber: ac,
      ifsc: code,
      verified: true,
      verifiedAt: new Date().toISOString(),
      bankName: ifscLookup.bankName,
    },
  };
}

export async function verifyUpiInternal(
  upiId: string,
  expectedHolderName: string,
): Promise<UpiVerifyResult> {
  const vpa = upiId.trim().toLowerCase();
  const expected = expectedHolderName.trim();

  if (!isValidUpi(vpa)) {
    return { ok: false, error: 'Sahi UPI ID daalo (name@bank)' };
  }
  if (!expected) {
    return { ok: false, error: 'Pehle Aadhaar / PAN naam verify karo' };
  }

  const baseUrl = getApiBaseUrl();
  let vpaHolder = expected;

  if (baseUrl) {
    try {
      const res = await fetch(`${baseUrl}/internal/kyc/upi/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upiId: vpa }),
      });
      if (!res.ok) return { ok: false, error: 'UPI verify fail — dubara try karo' };
      const data = (await res.json()) as { holderName?: string; name?: string };
      vpaHolder = (data.holderName ?? data.name ?? '').trim();
      if (!vpaHolder) return { ok: false, error: 'UPI par naam nahi mila' };
    } catch {
      return { ok: false, error: 'Network error — connection check karo' };
    }
  } else {
    await new Promise((r) => setTimeout(r, 550));
    vpaHolder = DEMO_UPI_HOLDERS[vpa] ?? DEMO_UPI_FALLBACK_HOLDER;
  }

  if (!namesMatch(expected, vpaHolder)) {
    return {
      ok: false,
      error: `UPI naam match nahi. Expected: ${expected} · UPI par: ${vpaHolder}`,
    };
  }

  return {
    ok: true,
    successMessage: `UPI verify ho gaya — ${vpa} · naam match (${vpaHolder})`,
  };
}
