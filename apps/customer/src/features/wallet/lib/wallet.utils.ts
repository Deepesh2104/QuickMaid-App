import type { WalletTransaction, WalletTxnKind, WalletTxnSource } from '../types/wallet.types';

export function formatWalletWhen(iso: string) {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function walletSourceMeta(source: WalletTxnSource) {
  const map = {
    topup: { label: 'Top-up', icon: 'add-circle-outline' as const, tone: '#ECFDF5' },
    booking: { label: 'Booking', icon: 'calendar-outline' as const, tone: '#EEF6FF' },
    plus: { label: 'Plus', icon: 'diamond-outline' as const, tone: '#FFFBEB' },
    refund: { label: 'Refund', icon: 'refresh-outline' as const, tone: '#F0FDF4' },
    promo: { label: 'Promo', icon: 'gift-outline' as const, tone: '#FDF4FF' },
    adjustment: { label: 'Adjustment', icon: 'swap-horizontal-outline' as const, tone: '#F4F6F8' },
  } as const;
  return map[source];
}

export function walletKindSign(kind: WalletTxnKind) {
  return kind === 'debit' ? '-' : '+';
}

export function isWalletCredit(kind: WalletTxnKind) {
  return kind === 'credit' || kind === 'refund' || kind === 'bonus';
}

export function walletFilterMatch(txn: WalletTransaction, filter: 'all' | 'credit' | 'debit') {
  if (filter === 'all') return true;
  if (filter === 'credit') return isWalletCredit(txn.kind);
  return txn.kind === 'debit';
}
