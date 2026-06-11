export type PayoutStatus = 'scheduled' | 'sent' | 'failed';

export interface PayoutJobLine {
  bookingRef: string;
  title: string;
  netPaise: number;
  date: string;
}

export interface PayoutDetailView {
  id: string;
  status: PayoutStatus;
  title: string;
  amountPaise: number;
  upiMask: string;
  batchPeriod: string;
  processedLabel?: string;
  scheduledLabel?: string;
  utr?: string;
  lines: PayoutJobLine[];
  grossPaise: number;
  feePaise: number;
  netPaise: number;
}
