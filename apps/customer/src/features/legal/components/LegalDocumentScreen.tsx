import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LEGAL_DOCUMENTS } from '../constants/legal.content';
import type { LegalDocId } from '../types/legal.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function LegalDocumentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { doc: docId } = useLocalSearchParams<{ doc: string }>();
  const doc = LEGAL_DOCUMENTS[docId as LegalDocId];

  if (!doc) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <Text style={styles.emptyText}>Document not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.emptyLink}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const share = async () => {
    const text = [doc.title, doc.summary, '', ...doc.sections.map((s) => `${s.heading}\n${s.body}`)].join('\n\n');
    try {
      await Share.share({ message: text, title: doc.title });
    } catch {
      // dismissed
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0F1419', '#1A2332']}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>{doc.eyebrow}</Text>
            <Text style={styles.title}>{doc.title}</Text>
          </View>
          <Pressable style={styles.shareBtn} onPress={() => void share()} accessibilityRole="button">
            <Ionicons name="share-outline" size={20} color={colors.white} />
          </Pressable>
        </View>
        <Text style={styles.updated}>Last updated · {doc.updated}</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primaryDark} />
          <Text style={styles.summary}>{doc.summary}</Text>
        </View>

        {doc.sections.map((section, i) => (
          <View key={section.heading} style={styles.section}>
            <View style={styles.sectionHead}>
              <View style={styles.sectionNum}>
                <Text style={styles.sectionNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.sectionTitle}>{section.heading}</Text>
            </View>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        <View style={styles.footerNote}>
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
          <Text style={styles.footerNoteText}>Demo legal copy · Replace with counsel-approved text in production.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyText: { fontFamily: fonts.medium, fontSize: 14, color: colors.muted },
  emptyLink: { fontFamily: fonts.bold, fontSize: 14, color: colors.primary },
  header: { paddingHorizontal: layout.pad, paddingBottom: spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1, gap: 2 },
  eyebrow: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  title: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.white },
  shareBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updated: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: spacing.sm },
  scroll: { padding: layout.pad, gap: spacing.lg },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  summary: { flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.primaryDark, lineHeight: 19 },
  section: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionNumText: { fontFamily: fonts.bold, fontSize: 12, color: colors.primaryDark },
  sectionTitle: { flex: 1, fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  sectionBody: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, lineHeight: 20 },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  footerNoteText: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
});
