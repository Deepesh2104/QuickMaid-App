import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
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

import { QmButton } from '../../src/components/ui/QmButton';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { FAQ_ITEMS } from '../../src/constants/demo';
import { colors } from '../../src/theme/colors';
import { layout, radius, shadow, spacing } from '../../src/theme/spacing';
import { type } from '../../src/theme/typography';

const TOPICS = [
  { id: 'booking', icon: 'calendar-outline' as const, label: 'Booking' },
  { id: 'payment', icon: 'card-outline' as const, label: 'Payment' },
  { id: 'maid', icon: 'person-outline' as const, label: 'Partner' },
  { id: 'other', icon: 'help-circle-outline' as const, label: 'Other' },
];

export default function SupportScreen() {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <SectionHeader title="Help centre" subtitle="Online 7 AM – 10 PM daily" />
        </View>

        <ScrollView
          contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 28 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.statusCard}>
            <View style={styles.statusDot} />
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>Team available now</Text>
              <Text style={styles.statusSub}>Typical reply under 5 minutes</Text>
            </View>
            <Ionicons name="chatbubbles" size={22} color={colors.primary} />
          </View>

          <Text style={styles.sectionTitle}>Quick help</Text>
          <View style={styles.topicGrid}>
            {TOPICS.map((t) => (
              <Pressable key={t.id} style={styles.topicCard}>
                <View style={styles.topicIcon}>
                  <Ionicons name={t.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.topicLabel}>{t.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Send a message</Text>
          <View style={styles.chatCard}>
            <TextInput
              style={styles.input}
              placeholder="Describe your issue..."
              placeholderTextColor={colors.placeholder}
              multiline
              value={message}
              onChangeText={setMessage}
            />
            <QmButton label="Send message" onPress={() => setMessage('')} icon="send" size="md" />
          </View>

          <Text style={styles.sectionTitle}>FAQ</Text>
          {FAQ_ITEMS.map((item, i) => (
            <Pressable
              key={item.q}
              style={styles.faqCard}
              onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQ}>{item.q}</Text>
                <Ionicons
                  name={expandedFaq === i ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.muted}
                />
              </View>
              {expandedFaq === i && <Text style={styles.faqA}>{item.a}</Text>}
            </Pressable>
          ))}

          <View style={styles.contactRow}>
            <ContactChip icon="call-outline" label="Call" />
            <ContactChip icon="mail-outline" label="Email" />
            <ContactChip icon="logo-whatsapp" label="WhatsApp" />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

function ContactChip({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <Pressable style={styles.chip}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.chipLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.bgSubtle },
  header: { paddingHorizontal: layout.pad, paddingBottom: spacing.sm },
  body: { paddingHorizontal: layout.pad },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.successBg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: 'rgba(2,122,72,0.12)',
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  statusText: { flex: 1 },
  statusTitle: { ...type.bodySm, fontWeight: '700', color: colors.success },
  statusSub: { ...type.caption, color: colors.muted },
  sectionTitle: { ...type.h3, color: colors.ink, marginBottom: spacing.md },
  topicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xxl },
  topicCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.sm,
    gap: spacing.sm,
  },
  topicIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicLabel: { ...type.bodySm, fontWeight: '600', color: colors.inkSecondary },
  chatCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.sm,
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
  input: {
    ...type.body,
    color: colors.ink,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: colors.searchBg,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  faqCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    ...shadow.sm,
  },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { ...type.bodySm, fontWeight: '600', color: colors.ink, flex: 1, marginRight: 8 },
  faqA: { ...type.bodySm, color: colors.muted, marginTop: spacing.sm, lineHeight: 20 },
  contactRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  chip: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4,
    ...shadow.sm,
  },
  chipLabel: { ...type.caption, fontWeight: '600', color: colors.inkSecondary },
});
