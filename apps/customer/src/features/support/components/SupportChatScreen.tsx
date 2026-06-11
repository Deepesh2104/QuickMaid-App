import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NotificationListSkeleton } from '@/components/ui/Skeleton';
import { SUPPORT_CONTACT } from '@/constants/demo';
import { getBookingById } from '@/features/bookings/lib/booking.lookup';
import {
  appendTicketMessage,
  createSupportTicket,
  getTicketById,
} from '../lib/support.storage';
import { normalizeSupportTopic, ticketStatusTheme } from '../lib/support.utils';
import type { SupportChatMessage, SupportTicket } from '../types/support.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const QUICK_REPLIES = [
  'Where is my pro?',
  'Need to reschedule',
  'Refund status?',
  'Change cleaning pro',
];

export function SupportChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const params = useLocalSearchParams<{
    topic?: string;
    ticketId?: string;
    bookingId?: string;
    paymentId?: string;
    context?: string;
  }>();

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);

  const topic = normalizeSupportTopic(params.topic);
  const ticketId = Array.isArray(params.ticketId) ? params.ticketId[0] : params.ticketId;
  const bookingId = Array.isArray(params.bookingId) ? params.bookingId[0] : params.bookingId;
  const paymentId = Array.isArray(params.paymentId) ? params.paymentId[0] : params.paymentId;
  const context = Array.isArray(params.context) ? params.context[0] : params.context;

  const load = useCallback(async () => {
    setLoading(true);
    if (ticketId) {
      const existing = await getTicketById(ticketId);
      setTicket(existing);
      setLoading(false);
      return;
    }

    let bookingRef: string | undefined;
    let subject = 'Support chat';
    let ctx = context;

    if (bookingId) {
      const booking = await getBookingById(bookingId);
      if (booking) {
        bookingRef = booking.bookingRef;
        subject = `Help · ${booking.service}`;
        ctx = ctx ?? `${booking.service} · ${booking.bookingRef ?? booking.id}`;
      }
    }

    const created = await createSupportTicket({
      topic,
      subject,
      bookingId: bookingId || undefined,
      bookingRef,
      paymentId: paymentId || undefined,
      context: ctx,
    });
    setTicket(created);
    setLoading(false);
  }, [ticketId, bookingId, paymentId, context, topic]);

  useEffect(() => {
    void load();
  }, [load]);

  const messages = ticket?.messages ?? [];
  const status = ticket ? ticketStatusTheme(ticket.status) : ticketStatusTheme('open');

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !ticket) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDraft('');
    const updated = await appendTicketMessage(ticket.id, trimmed, 'user');
    if (updated) setTicket(updated);
    setTyping(true);
    setTimeout(async () => {
      const withReply = await appendTicketMessage(
        ticket.id,
        'Got it. A support specialist is reviewing your message — we typically reply within 30 minutes.',
        'agent',
      );
      if (withReply) setTicket(withReply);
      setTyping(false);
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 900);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  if (loading) {
    return <NotificationListSkeleton count={4} />;
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#010F0E', '#084F4A', '#0B6E67', '#12A598']}
        locations={[0, 0.28, 0.62, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerRow}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>LIVE SUPPORT</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              QuickMaid Help
            </Text>
          </View>
          <Pressable
            style={styles.headerBtn}
            onPress={() => router.push('/(tabs)/support')}
            accessibilityLabel="Help centre"
          >
            <Ionicons name="help-circle-outline" size={20} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.agentCard}>
          <View style={styles.agentAvatar}>
            <Ionicons name="headset" size={20} color={colors.primaryDark} />
          </View>
          <View style={styles.agentCopy}>
            <View style={styles.agentTitleRow}>
              <Text style={styles.agentName}>Support team</Text>
              <View style={styles.onlinePill}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            </View>
            <Text style={styles.agentSub}>{SUPPORT_CONTACT.replyTime} · {SUPPORT_CONTACT.hours}</Text>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.thread}
          contentContainerStyle={styles.threadContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {ticket ? (
            <View style={styles.contextCard}>
              <View style={styles.contextTop}>
                <View style={[styles.statusPill, { backgroundColor: status.tone }]}>
                  <Text style={[styles.statusText, { color: status.ink }]}>{status.label}</Text>
                </View>
                <Text style={styles.ticketId}>{ticket.id}</Text>
              </View>
              <Text style={styles.contextSubject}>{ticket.subject}</Text>
              {ticket.bookingRef ? (
                <Text style={styles.contextMeta}>Booking {ticket.bookingRef}</Text>
              ) : null}
            </View>
          ) : null}

          <View style={styles.datePill}>
            <Text style={styles.dateText}>Today</Text>
          </View>

          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}

          {typing ? (
            <View style={styles.bubbleWrap}>
              <View style={styles.agentMini}>
                <Ionicons name="person-circle" size={22} color={colors.primary} />
              </View>
              <View style={[styles.bubble, styles.bubbleIn, styles.typingBubble]}>
                <View style={styles.typingDots}>
                  <View style={styles.typingDot} />
                  <View style={[styles.typingDot, styles.typingDotMid]} />
                  <View style={[styles.typingDot, styles.typingDotLate]} />
                </View>
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.quickRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickScroll}>
            {QUICK_REPLIES.map((q) => (
              <Pressable key={q} style={styles.quickChip} onPress={() => void send(q)}>
                <Text style={styles.quickText}>{q}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Type your message…"
              placeholderTextColor={colors.mutedLight}
              value={draft}
              onChangeText={setDraft}
              multiline
              maxLength={500}
            />
            <Pressable
              style={[styles.sendBtn, !draft.trim() && styles.sendBtnOff]}
              onPress={() => void send(draft)}
              disabled={!draft.trim()}
            >
              <LinearGradient
                colors={draft.trim() ? ['#084F4A', '#0B6E67'] : ['#E8ECF0', '#E8ECF0']}
                style={styles.sendGrad}
              >
                <Ionicons
                  name="send"
                  size={18}
                  color={draft.trim() ? colors.white : colors.mutedLight}
                />
              </LinearGradient>
            </Pressable>
          </View>
          <Text style={styles.composerHint}>End-to-end support · Typical reply under 30 min</Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function MessageBubble({ message }: { message: SupportChatMessage }) {
  const isUser = message.from === 'user';
  const isSystem = message.from === 'system';

  if (isSystem) {
    return (
      <View style={styles.systemWrap}>
        <Text style={styles.systemText}>{message.text}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.bubbleWrap, isUser && styles.bubbleWrapOut]}>
      {!isUser ? (
        <View style={styles.agentMini}>
          <Ionicons name="person-circle" size={22} color={colors.primary} />
        </View>
      ) : null}
      <View style={[styles.bubble, isUser ? styles.bubbleOut : styles.bubbleIn]}>
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextOut]}>{message.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  flex: { flex: 1 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F8' },

  header: { paddingBottom: spacing.lg },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.pad,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerCopy: { flex: 1, gap: 2 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: -0.3,
  },

  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: layout.pad,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.2)',
  },
  agentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6EE7B7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentCopy: { flex: 1, gap: 3 },
  agentTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  agentName: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#6EE7B7' },
  onlineText: { fontFamily: fonts.bold, fontSize: 9, color: '#6EE7B7' },
  agentSub: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.65)' },

  thread: { flex: 1 },
  threadContent: {
    paddingHorizontal: layout.pad,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  contextCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.md,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  contextTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusText: { fontFamily: fonts.bold, fontSize: 10 },
  ticketId: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  contextSubject: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  contextMeta: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },

  datePill: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  dateText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.muted },

  systemWrap: {
    alignSelf: 'center',
    backgroundColor: colors.bgMuted,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: '90%',
  },
  systemText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
  },

  bubbleWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    maxWidth: '92%',
  },
  bubbleWrapOut: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
    maxWidth: '88%',
  },
  agentMini: { marginBottom: 2 },
  bubble: {
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    maxWidth: '100%',
  },
  bubbleIn: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  bubbleOut: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
  },
  bubbleText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.inkSecondary,
    lineHeight: 20,
  },
  bubbleTextOut: { fontFamily: fonts.medium, color: colors.white },
  typingBubble: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  typingDots: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.mutedLight,
    opacity: 0.4,
  },
  typingDotMid: { opacity: 0.65 },
  typingDotLate: { opacity: 0.9 },

  quickRow: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.divider },
  quickScroll: { paddingHorizontal: layout.pad, paddingVertical: spacing.sm, gap: spacing.sm },
  quickChip: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.15)',
  },
  quickText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primaryDark },

  composer: {
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
    paddingHorizontal: layout.pad,
    gap: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    backgroundColor: '#F4F6F8',
    borderRadius: radius.xl,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  input: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.ink,
    maxHeight: 100,
    minHeight: 40,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
  },
  sendBtn: { borderRadius: radius.lg, overflow: 'hidden' },
  sendBtnOff: { opacity: 0.9 },
  sendGrad: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerHint: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.mutedLight,
    textAlign: 'center',
  },
});
