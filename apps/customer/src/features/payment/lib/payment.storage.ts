import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/app';

import type { PaymentRecord } from '../types/payment.types';

export async function getPaymentHistory(): Promise<PaymentRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.paymentHistory);
    if (!raw) return [];
    return JSON.parse(raw) as PaymentRecord[];
  } catch {
    return [];
  }
}

export async function getPaymentById(id: string): Promise<PaymentRecord | undefined> {
  const history = await getPaymentHistory();
  return history.find((r) => r.id === id || r.paymentId === id || r.orderId === id);
}

export async function addPaymentRecord(record: PaymentRecord): Promise<void> {
  const existing = await getPaymentHistory();
  await AsyncStorage.setItem(STORAGE_KEYS.paymentHistory, JSON.stringify([record, ...existing].slice(0, 50)));
}
