export type ReferralStatus = 'pending' | 'registered' | 'completed' | 'paid';

export interface ReferralRecord {
  id: string;
  name: string;
  phoneMask: string;
  status: ReferralStatus;
  joinedAt: string;
  bonusPaise: number;
  note: string;
}

export const DEMO_REFERRALS: ReferralRecord[] = [
  {
    id: 'ref-1',
    name: 'Meena K.',
    phoneMask: '••••3210',
    status: 'paid',
    joinedAt: '12 May',
    bonusPaise: 50000,
    note: 'Pehli job complete · Monday payout',
  },
  {
    id: 'ref-2',
    name: 'Kavita S.',
    phoneMask: '••••7891',
    status: 'completed',
    joinedAt: '28 May',
    bonusPaise: 50000,
    note: 'Bonus next Monday batch mein',
  },
  {
    id: 'ref-3',
    name: 'Anjali P.',
    phoneMask: '••••4567',
    status: 'registered',
    joinedAt: '2 Jun',
    bonusPaise: 50000,
    note: 'Pehli job pending',
  },
  {
    id: 'ref-4',
    name: 'Pending invite',
    phoneMask: '—',
    status: 'pending',
    joinedAt: '—',
    bonusPaise: 50000,
    note: 'Code share kiya · register nahi hui',
  },
];

export const REFERRAL_STATUS_META: Record<
  ReferralStatus,
  { label: string; color: string; bg: string; icon: 'checkmark-circle' | 'time' | 'person-add' | 'hourglass' }
> = {
  paid: { label: 'Paid', color: '#15803D', bg: 'rgba(34,197,94,0.12)', icon: 'checkmark-circle' },
  completed: { label: 'Bonus queued', color: '#B45309', bg: 'rgba(252,211,77,0.2)', icon: 'time' },
  registered: { label: 'Registered', color: '#1570EF', bg: 'rgba(21,112,239,0.1)', icon: 'person-add' },
  pending: { label: 'Invited', color: '#667085', bg: 'rgba(102,112,133,0.1)', icon: 'hourglass' },
};
