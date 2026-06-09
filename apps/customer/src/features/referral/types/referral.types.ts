export type ReferralEventStatus = 'pending' | 'credited' | 'expired';

export interface ReferralEvent {
  id: string;
  friendName: string;
  friendPhone?: string;
  status: ReferralEventStatus;
  rewardAmount: number;
  createdAt: string;
  creditedAt?: string;
}

export interface ReferralSummary {
  code: string;
  totalEarned: number;
  pendingAmount: number;
  successfulReferrals: number;
  pendingReferrals: number;
}
