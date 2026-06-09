import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/app';

import type { ReferralEvent, ReferralSummary } from '../types/referral.types';

const DEMO_EVENTS: ReferralEvent[] = [
  {
    id: 'ref_1',
    friendName: 'Neha K.',
    friendPhone: '****4521',
    status: 'credited',
    rewardAmount: 100,
    createdAt: '2026-05-18T10:00:00.000Z',
    creditedAt: '2026-05-20T14:30:00.000Z',
  },
  {
    id: 'ref_2',
    friendName: 'Amit S.',
    friendPhone: '****8890',
    status: 'credited',
    rewardAmount: 100,
    createdAt: '2026-04-02T09:15:00.000Z',
    creditedAt: '2026-04-05T11:00:00.000Z',
  },
  {
    id: 'ref_3',
    friendName: 'Sneha P.',
    friendPhone: '****3312',
    status: 'pending',
    rewardAmount: 100,
    createdAt: '2026-06-01T16:45:00.000Z',
  },
];

export async function getReferralEvents(): Promise<ReferralEvent[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.referralLedger);
    if (!raw) return DEMO_EVENTS;
    const parsed = JSON.parse(raw) as ReferralEvent[];
    return parsed.length ? parsed : DEMO_EVENTS;
  } catch {
    return DEMO_EVENTS;
  }
}

export function buildReferralSummary(code: string, events: ReferralEvent[]): ReferralSummary {
  const credited = events.filter((e) => e.status === 'credited');
  const pending = events.filter((e) => e.status === 'pending');

  return {
    code,
    totalEarned: credited.reduce((sum, e) => sum + e.rewardAmount, 0),
    pendingAmount: pending.reduce((sum, e) => sum + e.rewardAmount, 0),
    successfulReferrals: credited.length,
    pendingReferrals: pending.length,
  };
}
