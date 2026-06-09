import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/app';

import type { WalletTransaction, WalletTxnKind, WalletTxnSource } from '../types/wallet.types';

async function readTransactions(): Promise<WalletTransaction[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.walletTransactions);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as WalletTransaction[];
  } catch {
    return [];
  }
}

async function writeTransactions(rows: WalletTransaction[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.walletTransactions, JSON.stringify(rows.slice(0, 80)));
}

function txnId() {
  return `WLT-${Date.now().toString(36).toUpperCase()}`;
}

async function seedDemoTransactions() {
  const now = Date.now();
  const seed: WalletTransaction[] = [
    {
      id: 'WLT-DEMO-1',
      kind: 'credit',
      source: 'topup',
      amount: 200,
      title: 'Wallet top-up',
      subtitle: 'UPI · Demo credit',
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
    {
      id: 'WLT-DEMO-2',
      kind: 'debit',
      source: 'booking',
      amount: 50,
      title: 'Regular home clean',
      subtitle: 'QM-RAI-2401',
      refId: 'ord_demo',
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
  ];
  await writeTransactions(seed);
  return seed;
}

export async function listWalletTransactions(): Promise<WalletTransaction[]> {
  const rows = await readTransactions();
  if (rows.length) return rows;
  return seedDemoTransactions();
}

export async function addWalletTransaction(input: {
  kind: WalletTxnKind;
  source: WalletTxnSource;
  amount: number;
  title: string;
  subtitle?: string;
  refId?: string;
}): Promise<WalletTransaction> {
  const txn: WalletTransaction = {
    id: txnId(),
    ...input,
    createdAt: new Date().toISOString(),
  };
  const rows = await readTransactions();
  await writeTransactions([txn, ...rows]);
  return txn;
}
