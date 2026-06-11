import { getApiBaseUrl } from '@/config/env';
import type { KycPanVerification } from '@/features/kyc/types/kyc.types';
import { namesMatch } from '@/features/kyc/lib/kyc.name';
import { isValidPan, normalizePan } from '@/features/kyc/lib/kyc.validation';

export type PanLookupResult = {
  ok: boolean;
  error?: string;
  holderName?: string;
};

/** Demo ITD records — real app replaces via internal API */
const DEMO_PAN_HOLDERS: Record<string, string> = {
  SUNIV1234A: 'Sunita Verma',
  ABCDE1234F: 'Sunita Verma',
  VERMA1234S: 'Sunita Verma',
};

const DEMO_PAN_FALLBACK_HOLDER = 'Rajesh Patel';

/** Internal PAN lookup — production hits apiBaseUrl, demo uses local registry */
export async function fetchPanDetailsInternal(panNumber: string): Promise<PanLookupResult> {
  const normalized = normalizePan(panNumber);
  if (!isValidPan(normalized)) {
    return { ok: false, error: 'Sahi 10-character PAN daalo (ABCDE1234F)' };
  }

  const baseUrl = getApiBaseUrl();
  if (baseUrl) {
    try {
      const res = await fetch(`${baseUrl}/internal/kyc/pan/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pan: normalized }),
      });
      if (!res.ok) {
        return { ok: false, error: 'PAN lookup fail — dubara try karo' };
      }
      const data = (await res.json()) as { holderName?: string; name?: string };
      const holderName = (data.holderName ?? data.name ?? '').trim();
      if (!holderName) {
        return { ok: false, error: 'PAN par koi naam nahi mila' };
      }
      return { ok: true, holderName };
    } catch {
      return { ok: false, error: 'Network error — connection check karo' };
    }
  }

  await new Promise((r) => setTimeout(r, 650));
  const holderName = DEMO_PAN_HOLDERS[normalized] ?? DEMO_PAN_FALLBACK_HOLDER;
  return { ok: true, holderName };
}

/** PAN verify — internal API + naam match with profile/Aadhaar name */
export async function verifyDigiLockerPan(
  panNumber: string,
  expectedHolderName: string,
): Promise<{
  ok: boolean;
  error?: string;
  successMessage?: string;
  verification?: KycPanVerification;
}> {
  const normalized = normalizePan(panNumber);
  if (!isValidPan(normalized)) {
    return { ok: false, error: 'Sahi 10-character PAN daalo (ABCDE1234F)' };
  }

  const expected = expectedHolderName.trim();
  if (!expected) {
    return { ok: false, error: 'Pehle profile / Aadhaar naam complete karo' };
  }

  const lookup = await fetchPanDetailsInternal(normalized);
  if (!lookup.ok || !lookup.holderName) {
    return { ok: false, error: lookup.error ?? 'PAN details nahi mili' };
  }

  if (!namesMatch(expected, lookup.holderName)) {
    return {
      ok: false,
      error: `Naam match nahi hua. Aapka naam: ${expected} · PAN par: ${lookup.holderName}`,
    };
  }

  return {
    ok: true,
    successMessage: `PAN verify ho gaya — naam match (${lookup.holderName})`,
    verification: {
      number: normalized,
      verified: true,
      verifiedAt: new Date().toISOString(),
      method: 'digilocker_otp',
      holderName: lookup.holderName,
    },
  };
}
