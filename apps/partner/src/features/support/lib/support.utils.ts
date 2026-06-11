import type { PartnerSupportTopic, SupportChatMessage, TicketStatus } from '../types/support.types';

const TOPIC_GREETINGS: Record<PartnerSupportTopic, string> = {
  payout: 'Payout question? Share your week or UPI ID and we will check status.',
  job: 'Issue with a visit or job request? Share the booking ref or describe what happened.',
  kyc: 'KYC or document upload help? Tell us where you are stuck.',
  safety: 'Safety concern at a visit? Tell us immediately — we escalate these first.',
  other: 'How can partner ops help you today?',
};

export function normalizeSupportTopic(raw?: string): PartnerSupportTopic {
  if (!raw) return 'other';
  const key = raw.toLowerCase();
  if (key === 'payout' || key === 'job' || key === 'kyc' || key === 'safety') return key;
  if (key.includes('payout') || key.includes('payment') || key.includes('upi') || key.includes('wallet')) {
    return 'payout';
  }
  if (key.includes('job') || key.includes('visit') || key.includes('customer') || key.includes('qm-')) {
    return 'job';
  }
  if (key.includes('kyc') || key.includes('aadhaar') || key.includes('document')) return 'kyc';
  if (key.includes('safety') || key.includes('emergency') || key.includes('unsafe')) return 'safety';
  return 'other';
}

export function welcomeMessage(topic: PartnerSupportTopic, context?: string) {
  const base = `Hi! I'm from QuickMaid Partner Ops. ${TOPIC_GREETINGS[topic]}`;
  if (context?.trim()) {
    return `${base}\n\nContext: ${context.trim()}`;
  }
  return base;
}

export function generateTicketId() {
  return `P-TKT-${Date.now().toString(36).toUpperCase()}`;
}

export function ticketStatusTheme(status: TicketStatus) {
  const map = {
    open: { label: 'Open', ink: '#175CD3', tone: '#EEF6FF' },
    in_review: { label: 'In review', ink: '#B45309', tone: '#FFFBEB' },
    resolved: { label: 'Resolved', ink: '#027A48', tone: '#ECFDF5' },
  } as const;
  return map[status];
}

export function lastMessagePreview(messages: SupportChatMessage[], max = 72) {
  const last = [...messages].reverse().find((m) => m.from !== 'system');
  if (!last) return 'No messages yet';
  const prefix = last.from === 'user' ? 'You: ' : 'Ops: ';
  const text = `${prefix}${last.text}`.replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
