export type PartnerSupportTopic = 'payout' | 'job' | 'kyc' | 'safety' | 'other';

export type TicketStatus = 'open' | 'in_review' | 'resolved';

export interface SupportChatMessage {
  id: string;
  from: 'agent' | 'user' | 'system';
  text: string;
  at: string;
}

export interface SupportTicket {
  id: string;
  topic: PartnerSupportTopic;
  status: TicketStatus;
  subject: string;
  jobId?: string;
  jobRef?: string;
  createdAt: string;
  updatedAt: string;
  messages: SupportChatMessage[];
}
