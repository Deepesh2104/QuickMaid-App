export interface PlusSubscriptionRecord {
  planId: string;
  planName: string;
  amount: number;
  walletUsed: number;
  txnId: string;
  paymentLabel: string;
  subscribedAt: string;
  renewDate: string;
  visitsLeft: number;
  isPlusMember: boolean;
}
