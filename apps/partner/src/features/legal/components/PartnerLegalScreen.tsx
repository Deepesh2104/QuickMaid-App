import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PartnerStackShell } from '@/components/ui/PartnerStackShell';
import {
  isLegalSlug,
  LEGAL_DOCUMENTS,
} from '@/features/legal/constants/legal-content';
import { LEGAL_STATS } from '@/features/legal/constants/legal.premium';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export function PartnerLegalScreen() {
  const { slug: slugParam } = useLocalSearchParams<{ slug?: string | string[] }>();
  const slugRaw = typeof slugParam === 'string' ? slugParam : 'privacy';
  const slug = isLegalSlug(slugRaw) ? slugRaw : 'privacy';
  const doc = LEGAL_DOCUMENTS[slug];

  const stats = [
    { value: doc.updated.split(' ').pop() ?? '2025', label: 'Updated' },
    ...LEGAL_STATS.slice(1),
  ];

  return (
    <PartnerStackShell
      eyebrow={doc.eyebrow}
      title={doc.title}
      subtitle={`Updated ${doc.updated} · In-app viewer`}
      icon="document-text-outline"
      stats={stats}
    >
      <Animated.View entering={FadeInDown.duration(260)} style={styles.toc}>
        <PartnerRequestsSectionHeader
          eyebrow="Contents"
          title="Quick navigation"
          icon="list-outline"
          compact
        />
        <View style={styles.tocCard}>
          {doc.sections.map((section, i) => (
            <View key={section.heading} style={[styles.tocRow, i < doc.sections.length - 1 && styles.tocBorder]}>
              <Text style={styles.tocNum}>{i + 1}</Text>
              <Text style={styles.tocLabel}>{section.heading}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {doc.sections.map((section, i) => (
        <Animated.View
          key={section.heading}
          entering={FadeInDown.delay(40 + i * 30).duration(260)}
          style={styles.section}
        >
          <View style={styles.sectionHead}>
            <View style={styles.sectionIcon}>
              <Ionicons name="document-outline" size={14} color={colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>{section.heading}</Text>
          </View>
          <Text style={styles.sectionBody}>{section.body}</Text>
        </Animated.View>
      ))}

      <View style={styles.footerNote}>
        <Ionicons name="mail-outline" size={14} color={colors.muted} />
        <Text style={styles.footerText}>
          Questions? Help tab se chat karo ya legal@quickmaid.in par likho.
        </Text>
      </View>
    </PartnerStackShell>
  );
}

const styles = StyleSheet.create({
  toc: { gap: spacing.sm },
  tocCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
    overflow: 'hidden',
  },
  tocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  tocBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
  tocNum: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.primary,
    width: 18,
  },
  tocLabel: { flex: 1, fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink },
  section: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { flex: 1, fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  sectionBody: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkSecondary, lineHeight: 19 },
  footerNote: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  footerText: { flex: 1, fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 16 },
});
