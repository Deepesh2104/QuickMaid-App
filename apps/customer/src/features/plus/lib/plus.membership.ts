import { getProfileAccount, saveProfileAccount } from '@/features/profile/lib/profile.storage';
import type { ProfileAccountData } from '@/features/profile/types/profile.types';

import { getPlusSubscription, savePlusSubscription } from './plus.subscribe';

function pausedUntilLabel(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export async function pausePlusMembership(): Promise<ProfileAccountData> {
  const account = await getProfileAccount();
  const updated: ProfileAccountData = {
    ...account,
    plusPaused: true,
    plusPausedUntil: pausedUntilLabel(),
    plan: {
      ...account.plan,
      label: 'QuickMaid Plus · Paused',
    },
  };
  await saveProfileAccount(updated);

  const sub = await getPlusSubscription();
  if (sub) {
    await savePlusSubscription({ ...sub, planName: `${sub.planName} (Paused)` });
  }

  return updated;
}

export async function resumePlusMembership(): Promise<ProfileAccountData> {
  const account = await getProfileAccount();
  const updated: ProfileAccountData = {
    ...account,
    plusPaused: false,
    plusPausedUntil: undefined,
    plan: {
      type: 'plus',
      label: 'QuickMaid Plus · Monthly',
    },
  };
  await saveProfileAccount(updated);

  const sub = await getPlusSubscription();
  if (sub) {
    await savePlusSubscription({
      ...sub,
      planName: sub.planName.replace(' (Paused)', ''),
    });
  }

  return updated;
}

export async function cancelPlusMembership(): Promise<ProfileAccountData> {
  const account = await getProfileAccount();
  const updated: ProfileAccountData = {
    ...account,
    isPlusMember: false,
    plusPaused: false,
    plusPausedUntil: undefined,
    plusVisitsLeft: 0,
    plan: { type: 'instant', label: 'Pay per visit' },
  };
  await saveProfileAccount(updated);
  return updated;
}
