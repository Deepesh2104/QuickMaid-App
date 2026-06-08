import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SUPPORT_CONTACT } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

type ChatMessage = {
  id: string;
  from: 'agent' | 'user';
  text: string;
};

interface HelpChatWindowProps {
  visible: boolean;
  topic?: string;
  onClose: () => void;
}

const TOPIC_GREETINGS: Record<string, string> = {
  booking: 'Need help with a booking? Tell us your visit date or booking ref.',
  payment: 'Questions about payment or invoice? Share your booking ID.',
  plus: 'Curious about Plus plans? We can help you pick the right one.',
  partner: 'Issue with your cleaning partner? Describe what happened.',
  other: 'How can we help you today?',
};

function welcomeFor(topic?: string) {
  const key = topic && TOPIC_GREETINGS[topic] ? topic : 'other';
  return `Hi! I'm from QuickMaid Support. ${TOPIC_GREETINGS[key]}`;
}

export function HelpChatWindow({ visible, topic, onClose }: HelpChatWindowProps) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (visible) {
      setMessages([{ id: 'welcome', from: 'agent', text: welcomeFor(topic) }]);
      setDraft('');
      setTyping(false);
    }
  }, [visible, topic]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, from: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setDraft('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          from: 'agent',
          text: 'Thanks! A support agent will reply here shortly. Typical wait is under 5 minutes.',
        },
      ]);
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 700);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const handleClose = () => {
    Haptics.selectionAsync();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={handleClose}>
      <View style={styles.root}>
        <LinearGradient colors={['#084F4A', '#0B6E67', '#0B6E67']} style={styles.header}>
          <View style={[styles.headerInner, { paddingTop: insets.top + spacing.sm }]}>
            <Pressable
              style={styles.closeBtn}
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Close chat"
            >
              <Ionicons name="chevron-down" size={22} color={colors.white} />
            </Pressable>

            <View style={styles.headerCenter}>
              <View style={styles.avatar}>
                <Ionicons name="headset" size={20} color={colors.primaryDark} />
              </View>
              <View>
                <Text style={styles.headerTitle}>QuickMaid Support</Text>
                <View style={styles.onlineRow}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.headerSub}>Online · {SUPPORT_CONTACT.replyTime}</Text>
                </View>
              </View>
            </View>

            <Pressable style={styles.moreBtn} onPress={handleClose} accessibilityRole="button">
              <Ionicons name="ellipsis-horizontal" size={18} color={colors.white} />
            </Pressable>
          </View>
        </LinearGradient>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.thread}
            contentContainerStyle={styles.threadContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          >
            <View style={styles.datePill}>
              <Text style={styles.dateText}>Today</Text>
            </View>

            {messages.map((m) => (
              <View
                key={m.id}
                style={[styles.bubbleWrap, m.from === 'user' && styles.bubbleWrapOut]}
              >
                {m.from === 'agent' ? (
                  <View style={styles.agentMini}>
                    <Ionicons name="person-circle" size={22} color={colors.primary} />
                  </View>
                ) : null}
                <View style={[styles.bubble, m.from === 'user' ? styles.bubbleOut : styles.bubbleIn]}>
                  <Text style={[styles.bubbleText, m.from === 'user' && styles.bubbleTextOut]}>
                    {m.text}
                  </Text>
                </View>
              </View>
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

          <View style={[styles.composer, { paddingBottom: insets.bottom + spacing.sm }]}>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor={colors.mutedLight}
                value={draft}
                onChangeText={setDraft}
                multiline
                maxLength={500}
              />
              <Pressable
                style={[styles.sendBtn, !draft.trim() && styles.sendBtnOff]}
                onPress={handleSend}
                disabled={!draft.trim()}
                accessibilityRole="button"
                accessibilityLabel="Send message"
              >
                <Ionicons
                  name="send"
                  size={18}
                  color={draft.trim() ? colors.white : colors.mutedLight}
                />
              </Pressable>
            </View>
            <Text style={styles.composerHint}>{SUPPORT_CONTACT.hours}</Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgSubtle },
  flex: { flex: 1 },
  header: { paddingBottom: spacing.md },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.pad,
    gap: spacing.sm,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6EE7B7',
  },
  headerSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
  },
  moreBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thread: { flex: 1 },
  threadContent: {
    paddingHorizontal: layout.pad,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  datePill: {
    alignSelf: 'center',
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: spacing.sm,
  },
  dateText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.muted,
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
    backgroundColor: colors.bg,
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
  bubbleTextOut: {
    fontFamily: fonts.medium,
    color: colors.white,
  },
  typingBubble: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.mutedLight,
    opacity: 0.4,
  },
  typingDotMid: { opacity: 0.65 },
  typingDotLate: { opacity: 0.9 },
  composer: {
    backgroundColor: colors.bg,
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
    backgroundColor: colors.bgSubtle,
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
    textAlignVertical: 'center',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnOff: { backgroundColor: colors.bgMuted },
  composerHint: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.mutedLight,
    textAlign: 'center',
  },
});
