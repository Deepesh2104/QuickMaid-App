import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/app';
import { patchProfileAccount } from '@/features/profile/lib/profile.storage';

import type {
  BookingDispute,
  DisputeReasonId,
  SupportChatMessage,
  SupportTicket,
  SupportTopic,
} from '../types/support.types';
import { generateDisputeId, generateTicketId, welcomeMessage } from './support.utils';

async function readTickets(): Promise<SupportTicket[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.supportTickets);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SupportTicket[];
  } catch {
    return [];
  }
}

async function writeTickets(tickets: SupportTicket[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.supportTickets, JSON.stringify(tickets));
}

async function readDisputes(): Promise<BookingDispute[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.bookingDisputes);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as BookingDispute[];
  } catch {
    return [];
  }
}

async function writeDisputes(disputes: BookingDispute[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.bookingDisputes, JSON.stringify(disputes));
}

async function bumpProfileTicketCount() {
  const tickets = await readTickets();
  const open = tickets.filter((t) => t.status !== 'resolved').length;
  await patchProfileAccount({ supportTickets: open });
}

export async function listSupportTickets(): Promise<SupportTicket[]> {
  return readTickets();
}

export async function getTicketById(id: string): Promise<SupportTicket | null> {
  const tickets = await readTickets();
  return tickets.find((t) => t.id === id) ?? null;
}

export async function getDisputeByBookingId(bookingId: string): Promise<BookingDispute | null> {
  const disputes = await readDisputes();
  return disputes.find((d) => d.bookingId === bookingId) ?? null;
}

export async function createSupportTicket(input: {
  topic: SupportTopic;
  subject: string;
  bookingId?: string;
  bookingRef?: string;
  paymentId?: string;
  context?: string;
  seedUserMessage?: string;
}): Promise<SupportTicket> {
  const now = new Date().toISOString();
  const welcome: SupportChatMessage = {
    id: `m-welcome-${Date.now()}`,
    from: 'agent',
    text: welcomeMessage(input.topic, input.context),
    at: now,
  };
  const messages: SupportChatMessage[] = [welcome];

  if (input.seedUserMessage?.trim()) {
    messages.push({
      id: `m-user-${Date.now()}`,
      from: 'user',
      text: input.seedUserMessage.trim(),
      at: now,
    });
    messages.push({
      id: `m-auto-${Date.now() + 1}`,
      from: 'agent',
      text: 'Thanks for the details. A specialist will review and reply here shortly — typical response under 30 minutes.',
      at: now,
    });
  }

  const ticket: SupportTicket = {
    id: generateTicketId(),
    topic: input.topic,
    status: 'open',
    subject: input.subject,
    bookingId: input.bookingId,
    bookingRef: input.bookingRef,
    paymentId: input.paymentId,
    createdAt: now,
    updatedAt: now,
    messages,
  };

  const tickets = await readTickets();
  tickets.unshift(ticket);
  await writeTickets(tickets);
  await bumpProfileTicketCount();
  return ticket;
}

export async function appendTicketMessage(
  ticketId: string,
  text: string,
  from: 'user' | 'agent' = 'user',
): Promise<SupportTicket | null> {
  const tickets = await readTickets();
  const idx = tickets.findIndex((t) => t.id === ticketId);
  if (idx < 0) return null;

  const now = new Date().toISOString();
  const ticket = { ...tickets[idx] };
  ticket.messages = [
    ...ticket.messages,
    { id: `m-${Date.now()}`, from, text, at: now },
  ];
  ticket.updatedAt = now;
  tickets[idx] = ticket;
  await writeTickets(tickets);
  return ticket;
}

export async function submitBookingDispute(input: {
  bookingId: string;
  bookingRef?: string;
  service: string;
  reasonId: DisputeReasonId;
  reasonLabel: string;
  description: string;
  refundRequested: boolean;
}): Promise<{ dispute: BookingDispute; ticket: SupportTicket }> {
  const existing = await getDisputeByBookingId(input.bookingId);
  if (existing) {
    const ticket = await getTicketById(existing.ticketId);
    if (ticket) return { dispute: existing, ticket };
  }

  const seed = [
    `Dispute filed for ${input.service}`,
    `Reason: ${input.reasonLabel}`,
    input.description.trim(),
    input.refundRequested ? 'Refund requested: Yes' : 'Refund requested: No',
  ]
    .filter(Boolean)
    .join('\n');

  const ticket = await createSupportTicket({
    topic: 'dispute',
    subject: `Dispute · ${input.bookingRef ?? input.bookingId}`,
    bookingId: input.bookingId,
    bookingRef: input.bookingRef,
    context: `${input.service} · ${input.bookingRef ?? input.bookingId}`,
    seedUserMessage: seed,
  });

  const dispute: BookingDispute = {
    id: generateDisputeId(),
    ticketId: ticket.id,
    bookingId: input.bookingId,
    reasonId: input.reasonId,
    reasonLabel: input.reasonLabel,
    description: input.description.trim(),
    refundRequested: input.refundRequested,
    createdAt: new Date().toISOString(),
    status: 'submitted',
  };

  const disputes = await readDisputes();
  disputes.unshift(dispute);
  await writeDisputes(disputes);
  return { dispute, ticket };
}
