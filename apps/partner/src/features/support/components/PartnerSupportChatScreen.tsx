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
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SUPPORT_CONTACT } from '@/constants/demo';
import { getJobById } from '@/features/support/lib/job.lookup';
import {
  appendTicketMessage,
  createSupportTicket,
  getTicketById,
} from '@/features/support/lib/support.storage';
import { supportBotReply } from '@/features/support/lib/support.bot';
import { normalizeSupportTopic, ticketStatusTheme } from '@/features/support/lib/support.utils';
import type { SupportChatMessage, SupportTicket } from '@/features/support/types/support.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const SHEET_OVERLAP = 14;
const SHEET_BG = '#EFF8F7';

const QUICK_REPLIES = [
  'Payout not received',
  'Customer not home',
  'KYC status?',
  'Wrong job details',
];

export function PartnerSupportChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const params = useLocalSearchParams<{
    topic?: string;
    ticketId?: string;
    jobId?: string;
    context?: string;
  }>();

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);

  const topic = normalizeSupportTopic(params.topic);
  const ticketId = Array.isArray(params.ticketId) ? params.ticketId[0] : params.ticketId;
  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;
  const context = Array.isArray(params.context) ? params.context[0] : params.context;

  const load = useCallback(async () => {
    setLoading(true);
    if (ticketId) {
      const existing = await getTicketById(ticketId);
      setTicket(existing);
      setLoading(false);
      return;
    }

    let jobRef: string | undefined;
    let subject = 'Partner support chat';
    let ctx = context;

    if (jobId) {
      const job = await getJobById(jobId);
      if (job) {
        jobRef = job.bookingRef;
        subject = `Help · ${job.service}`;
        ctx = ctx ?? `${job.service} · ${job.bookingRef}`;
      }
    }

    const created = await createSupportTicket({
      topic,
      subject,
      jobId: jobId || undefined,
      jobRef,
      context: ctx,
    });
    setTicket(created);
    setLoading(false);
  }, [ticketId, jobId, context, topic]);

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
        supportBotReply(trimmed, topic),
        'agent',
      );
      if (withReply) setTicket(withReply);
      setTyping(false);
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 900);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#032A28', '#084F4A', '#0B6E67']}
        locations={[0, 0.5, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.xs }]}
      >
        <View style={styles.headerGlowA} />
        <View style={styles.headerGlowB} />

        <View style={styles.headerRow}>
          <Pressable
            style={styles.headerBtn}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color={colors.white} />
          </Pressable>
          <View style={styles.tabIcon}>
            <Ionicons name="headset" size={17} color={colors.partnerGold} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>LIVE PARTNER OPS</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Support chat
            </Text>
            <Text style={styles.headerSub}>{SUPPORT_CONTACT.replyTime}</Text>
          </View>
          <Pressable
            style={styles.headerBtn}
            onPress={() => router.push('/(tabs)/help')}
            accessibilityLabel="Help centre"
          >
            <Ionicons name="help-circle-outline" size={18} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.statBar}>
          <View style={styles.statChip}>
            <Text style={[styles.statNum, styles.statLive]}>Online</Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text style={styles.statNum}>~30m</Text>
            <Text style={styles.statLabel}>Avg reply</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text style={styles.statNum}>9–9</Text>
            <Text style={styles.statLabel}>Daily hrs</Text>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <LinearGradient
            colors={['rgba(230,244,242,0.95)', SHEET_BG]}
            style={styles.sheetTopFade}
            pointerEvents="none"
          />
          <View style={styles.sheetHandle} />

          <Animated.View entering={FadeInDown.duration(300)} style={styles.agentCard}>
            <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.agentAvatar}>
              <Ionicons name="headset" size={20} color={colors.white} />
            </LinearGradient>
            <View style={styles.agentCopy}>
              <View style={styles.agentTitleRow}>
                <Text style={styles.agentName}>Partner ops team</Text>
                <View style={styles.onlinePill}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>Live</Text>
                </View>
              </View>
              <Text style={styles.agentSub}>
                {SUPPORT_CONTACT.hours} · {SUPPORT_CONTACT.phone}
              </Text>
            </View>
          </Animated.View>

          <ScrollView
            ref={scrollRef}
            style={styles.thread}
            contentContainerStyle={styles.threadContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          >
            {ticket ? (
              <Animated.View entering={FadeInDown.delay(40).duration(300)} style={styles.contextCard}>
                <View style={styles.contextTop}>
                  <View style={[styles.statusPill, { backgroundColor: status.tone }]}>
                    <Text style={[styles.statusText, { color: status.ink }]}>{status.label}</Text>
                  </View>
                  <Text style={styles.ticketId}>{ticket.id}</Text>
                </View>
                <Text style={styles.contextSubject}>{ticket.subject}</Text>
                {ticket.jobRef ? <Text style={styles.contextMeta}>Job {ticket.jobRef}</Text> : null}
              </Animated.View>
            ) : null}

            <View style={styles.datePill}>
              <Text style={styles.dateText}>Today</Text>
            </View>

            {messages.map((m, i) => (
              <Animated.View key={m.id} entering={FadeInDown.delay(60 + i * 20).duration(260)}>
                <MessageBubble message={m} />
              </Animated.View>
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
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickScroll}
            >
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
            <Text style={styles.composerHint}>Partner support · Typical reply under 30 min</Text>
          </View>
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
  root: { flex: 1, backgroundColor: colors.primaryDark },
  flex: { flex: 1 },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SHEET_BG,
  },
  header: {
    paddingHorizontal: layout.pad,
    paddingBottom: SHEET_OVERLAP + spacing.md,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  headerGlowA: {
    position: 'absolute',
    right: -20,
    top: -10,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(252,211,77,0.12)',
  },
  headerGlowB: {
    position: 'absolute',
    left: -30,
    bottom: -10,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(110,231,183,0.14)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tabIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(217,119,6,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerCopy: { flex: 1, gap: 1, minWidth: 0 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(252,211,77,0.9)',
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
  },
  statBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(110,231,183,0.1)',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.22)',
  },
  statChip: { flex: 1, alignItems: 'center', gap: 1 },
  statNum: { fontFamily: fonts.extraBold, fontSize: 13, color: colors.white },
  statLive: { color: '#6EE7B7' },
  statLabel: { fontFamily: fonts.medium, fontSize: 8, color: 'rgba(255,255,255,0.6)' },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginVertical: 2,
  },
  sheet: {
    flex: 1,
    marginTop: -SHEET_OVERLAP,
    backgroundColor: SHEET_BG,
    borderTopLeftRadius: radius.xxl + 6,
    borderTopRightRadius: radius.xxl + 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: 'rgba(11,110,103,0.18)',
    overflow: 'hidden',
  },
  sheetTopFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 28,
    zIndex: 0,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(11,110,103,0.22)',
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    zIndex: 1,
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: layout.pad,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  agentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentCopy: { flex: 1, gap: 3 },
  agentTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  agentName: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  onlineText: { fontFamily: fonts.bold, fontSize: 9, color: '#027A48' },
  agentSub: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  thread: { flex: 1 },
  threadContent: {
    paddingHorizontal: layout.pad,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  contextCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  contextTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
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
  quickRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(11,110,103,0.12)',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  quickScroll: { paddingHorizontal: layout.pad, paddingVertical: spacing.sm, gap: spacing.sm },
  quickChip: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
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
    backgroundColor: SHEET_BG,
    borderRadius: radius.xl,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.15)',
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
