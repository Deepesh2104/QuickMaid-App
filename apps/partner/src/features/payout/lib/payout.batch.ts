import AsyncStorage from '@react-native-async-storage/async-storage';

import type { EarningRow } from '@/constants/demo';
import { appendPartnerNotification } from '@/features/notifications/lib/notifications.storage';

const BATCH_KEY = '@qmp/payout_batches_run_v1';

async function batchesRun(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(BATCH_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function weekId(): string {
  const d = new Date();
  return `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`;
}

/** Demo Monday UPI batch — moves pending credits to payout row once per week. */
export async function runDemoWeeklyPayoutBatch(
  pendingPaise: number,
  upiId?: string,
): Promise<EarningRow | null> {
  if (pendingPaise <= 0) return null;

  const id = weekId();
  const done = await batchesRun();
  if (done.includes(id)) return null;

  const row: EarningRow = {
    id: `payout_${id}`,
    kind: 'payout',
    title: 'Weekly UPI payout',
    subtitle: upiId ?? 'demo.partner@okaxis',
    amountPaise: -pendingPaise,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
  };

  await AsyncStorage.setItem(BATCH_KEY, JSON.stringify([id, ...done]));

  await appendPartnerNotification({
    id: `payout_batch_${id}`,
    kind: 'payout',
    title: 'Monday payout sent',
    body: `₹${(pendingPaise / 100).toFixed(0)} credited to UPI (demo batch)`,
    time: 'Just now',
    createdAt: new Date().toISOString(),
    payoutId: row.id,
  });

  return row;
}

export function mergePayoutBatches(base: EarningRow[], batch: EarningRow | null): EarningRow[] {
  if (!batch) return base;
  if (base.some((r) => r.id === batch.id)) return base;
  return [batch, ...base];
}
