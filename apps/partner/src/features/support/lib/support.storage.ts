import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/app';

import type { PartnerSupportTopic, SupportChatMessage, SupportTicket } from '../types/support.types';
import { generateTicketId, welcomeMessage } from './support.utils';

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

export async function listSupportTickets(): Promise<SupportTicket[]> {
  return readTickets();
}

export async function getTicketById(id: string): Promise<SupportTicket | null> {
  const tickets = await readTickets();
  return tickets.find((t) => t.id === id) ?? null;
}

export async function createSupportTicket(input: {
  topic: PartnerSupportTopic;
  subject: string;
  jobId?: string;
  jobRef?: string;
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
      text: 'Thanks for the details. Partner ops is reviewing — typical reply under 30 minutes.',
      at: now,
    });
  }

  const ticket: SupportTicket = {
    id: generateTicketId(),
    topic: input.topic,
    status: 'open',
    subject: input.subject,
    jobId: input.jobId,
    jobRef: input.jobRef,
    createdAt: now,
    updatedAt: now,
    messages,
  };

  const tickets = await readTickets();
  tickets.unshift(ticket);
  await writeTickets(tickets);
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
  ticket.messages = [...ticket.messages, { id: `m-${Date.now()}`, from, text, at: now }];
  ticket.updatedAt = now;
  tickets[idx] = ticket;
  await writeTickets(tickets);
  return ticket;
}
