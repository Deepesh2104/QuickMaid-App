import type { SupportChatMessage, SupportTopic, TicketStatus } from '../types/support.types';

export const DISPUTE_REASONS = [
  { id: 'quality' as const, label: 'Poor service quality', icon: 'star-half-outline' as const },
  { id: 'incomplete' as const, label: 'Job incomplete', icon: 'alert-circle-outline' as const },
  { id: 'damage' as const, label: 'Damage to property', icon: 'warning-outline' as const },
  { id: 'behavior' as const, label: 'Pro behavior concern', icon: 'person-outline' as const },
  { id: 'billing' as const, label: 'Billing / overcharge', icon: 'card-outline' as const },
  { id: 'other' as const, label: 'Something else', icon: 'ellipsis-horizontal-outline' as const },
];

const TOPIC_GREETINGS: Record<SupportTopic, string> = {
  booking: 'Need help with a booking? Share your booking ref or describe the issue.',
  payment: 'Payment or invoice question? Share your payment ID or booking ref.',
  plus: 'Questions about Plus membership? Happy to help.',
  partner: 'Issue with your cleaning pro? Tell us what happened.',
  dispute: 'Your dispute has been logged. Our team will review and reply here.',
  other: 'How can we help you today?',
};

export function normalizeSupportTopic(raw?: string): SupportTopic {
  if (!raw) return 'other';
  const key = raw.toLowerCase();
  if (key === 'booking' || key === 'payment' || key === 'plus' || key === 'partner' || key === 'dispute') {
    return key;
  }
  if (key.includes('booking') || key.includes('qm-') || key.includes('visit')) return 'booking';
  if (key.includes('payment') || key.includes('invoice') || key.includes('receipt')) return 'payment';
  if (key.includes('plus') || key.includes('membership')) return 'plus';
  if (key.includes('maid') || key.includes('pro') || key.includes('partner') || key.includes('message')) {
    return 'partner';
  }
  return 'other';
}

export function welcomeMessage(topic: SupportTopic, context?: string) {
  const base = `Hi! I'm from QuickMaid Support. ${TOPIC_GREETINGS[topic]}`;
  if (context?.trim()) {
    return `${base}\n\nContext: ${context.trim()}`;
  }
  return base;
}

export function generateTicketId() {
  return `TKT-${Date.now().toString(36).toUpperCase()}`;
}

export function generateDisputeId() {
  return `DSP-${Date.now().toString(36).toUpperCase()}`;
}

export function supportTopicMeta(topic: SupportTopic) {
  const map = {
    booking: { label: 'Booking', icon: 'calendar-outline' as const, tone: '#E8F5F3' },
    payment: { label: 'Payment', icon: 'card-outline' as const, tone: '#EEF6FF' },
    plus: { label: 'Plus', icon: 'diamond-outline' as const, tone: '#FFFBEB' },
    partner: { label: 'Pro', icon: 'person-outline' as const, tone: '#F3E8FF' },
    dispute: { label: 'Dispute', icon: 'warning-outline' as const, tone: '#FEF2F2' },
    other: { label: 'General', icon: 'chatbubble-outline' as const, tone: '#F4F6F8' },
  } as const;
  return map[topic];
}

export function formatTicketWhen(iso: string) {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function lastMessagePreview(messages: SupportChatMessage[], max = 72) {
  const last = [...messages].reverse().find((m) => m.from !== 'system');
  if (!last) return 'No messages yet';
  const prefix = last.from === 'user' ? 'You: ' : 'Support: ';
  const text = `${prefix}${last.text}`.replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function ticketStatusTheme(status: TicketStatus) {
  const map = {
    open: { label: 'Open', ink: '#175CD3', tone: '#EEF6FF' },
    in_review: { label: 'In review', ink: '#B45309', tone: '#FFFBEB' },
    resolved: { label: 'Resolved', ink: '#027A48', tone: '#ECFDF5' },
  } as const;
  return map[status];
}
