export type SupportTopic = 'booking' | 'payment' | 'plus' | 'partner' | 'dispute' | 'other';

export type TicketStatus = 'open' | 'in_review' | 'resolved';

export type DisputeReasonId =
  | 'quality'
  | 'incomplete'
  | 'damage'
  | 'behavior'
  | 'billing'
  | 'other';

export interface SupportChatMessage {
  id: string;
  from: 'agent' | 'user' | 'system';
  text: string;
  at: string;
}

export interface SupportTicket {
  id: string;
  topic: SupportTopic;
  status: TicketStatus;
  subject: string;
  bookingId?: string;
  bookingRef?: string;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
  messages: SupportChatMessage[];
}

export interface BookingDispute {
  id: string;
  ticketId: string;
  bookingId: string;
  reasonId: DisputeReasonId;
  reasonLabel: string;
  description: string;
  refundRequested: boolean;
  createdAt: string;
  status: 'submitted' | 'in_review' | 'resolved';
}
