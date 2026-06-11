import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEMO_REFERRALS, type ReferralRecord } from '@/features/referral/constants/referral.demo';

const LEDGER_KEY = '@qmp/referral_ledger_v1';

async function readLedger(): Promise<ReferralRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(LEDGER_KEY);
    return raw ? (JSON.parse(raw) as ReferralRecord[]) : [];
  } catch {
    return [];
  }
}

export async function getPartnerReferrals(): Promise<ReferralRecord[]> {
  const ledger = await readLedger();
  const ids = new Set(ledger.map((r) => r.id));
  const seed = DEMO_REFERRALS.filter((r) => !ids.has(r.id));
  return [...ledger, ...seed];
}

export async function addReferralSignup(name: string, phoneMask: string): Promise<ReferralRecord> {
  const row: ReferralRecord = {
    id: `ref_${Date.now()}`,
    name,
    phoneMask,
    status: 'registered',
    joinedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    bonusPaise: 50000,
    note: 'Nayi signup — pehli job ka wait',
  };
  const ledger = await readLedger();
  await AsyncStorage.setItem(LEDGER_KEY, JSON.stringify([row, ...ledger]));
  return row;
}

export async function markReferralCompleted(referralId: string): Promise<void> {
  const ledger = await readLedger();
  const next = ledger.map((r) =>
    r.id === referralId ? { ...r, status: 'completed' as const, note: 'Pehli job done — bonus queued' } : r,
  );
  await AsyncStorage.setItem(LEDGER_KEY, JSON.stringify(next));
}
