export type WalletTxnKind = 'credit' | 'debit' | 'refund' | 'bonus';

export type WalletTxnSource = 'topup' | 'booking' | 'plus' | 'refund' | 'promo' | 'adjustment';

export interface WalletTransaction {
  id: string;
  kind: WalletTxnKind;
  source: WalletTxnSource;
  amount: number;
  title: string;
  subtitle?: string;
  refId?: string;
  createdAt: string;
}
