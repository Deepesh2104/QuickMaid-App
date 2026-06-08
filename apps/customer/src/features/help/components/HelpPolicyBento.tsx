import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { useOpenLegal } from '@/features/legal/hooks/useOpenLegal';
import type { LegalDocId } from '@/features/legal/types/legal.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const TOP_POLICIES: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  sub: string;
  gradient: readonly [string, string];
  ink: string;
  doc: LegalDocId;
}[] = [
  {
    icon: 'close-circle-outline',
    title: 'Cancellation',
    sub: 'Free till 2 hrs before',
    gradient: ['#FEF3F2', '#FFFFFF'],
    ink: '#D92D20',
    doc: 'cancellation',
  },
  {
    icon: 'cash-outline',
    title: 'Refunds',
    sub: '3–5 days back',
    gradient: ['#FFF8EE', '#FFFFFF'],
    ink: '#B54708',
    doc: 'cancellation',
  },
];

const SAFETY = {
  icon: 'shield-checkmark-outline' as const,
  title: 'Safety guarantee',
  sub: 'Verified pros · Insured visits · Pay only after service',
  gradient: ['#E6F4F2', '#FFFFFF'] as const,
  ink: colors.primaryDark,
  doc: 'terms' as LegalDocId,
};

const GAP = spacing.sm;
const HALF_W = (layout.screenWidth - layout.pad * 2 - GAP) / 2;
const FULL_W = layout.screenWidth - layout.pad * 2;

export function HelpPolicyBento() {
  const openLegal = useOpenLegal();

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Policies"
        title="Know your rights"
        subtitle="Transparent · No surprises"
        icon="document-text-outline"
        compact
      />

      <View style={styles.topRow}>
        {TOP_POLICIES.map((p) => (
          <Pressable
            key={p.title}
            style={styles.halfCard}
            onPress={() => {
              Haptics.selectionAsync();
              openLegal(p.doc);
            }}
            accessibilityRole="button"
          >
            <LinearGradient colors={[...p.gradient]} style={StyleSheet.absoluteFill} />
            <View style={[styles.icon, { backgroundColor: colors.white }]}>
              <Ionicons name={p.icon} size={18} color={p.ink} />
            </View>
            <View style={styles.copy}>
              <Text style={styles.title} numberOfLines={1}>
                {p.title}
              </Text>
              <Text style={styles.sub} numberOfLines={2}>
                {p.sub}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={styles.banner}
        onPress={() => {
          Haptics.selectionAsync();
          openLegal(SAFETY.doc);
        }}
        accessibilityRole="button"
      >
        <LinearGradient colors={[...SAFETY.gradient]} style={StyleSheet.absoluteFill} />
        <View style={[styles.bannerIcon, { backgroundColor: colors.white }]}>
          <Ionicons name={SAFETY.icon} size={20} color={SAFETY.ink} />
        </View>
        <View style={styles.bannerCopy}>
          <Text style={styles.bannerTitle}>{SAFETY.title}</Text>
          <Text style={styles.bannerSub}>{SAFETY.sub}</Text>
        </View>
        <View style={styles.bannerBadge}>
          <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
          <Text style={styles.bannerBadgeText}>Protected</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  topRow: {
    flexDirection: 'row',
    gap: GAP,
    paddingHorizontal: layout.pad,
    marginBottom: GAP,
  },
  halfCard: {
    width: HALF_W,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.xl,
    padding: spacing.md,
    overflow: 'hidden',
    minHeight: 80,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.05)',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  copy: { flex: 1, gap: 2, minWidth: 0 },
  title: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.muted,
    lineHeight: 14,
  },
  banner: {
    width: FULL_W,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bannerCopy: { flex: 1, gap: 3, minWidth: 0 },
  bannerTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  bannerSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 15,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexShrink: 0,
  },
  bannerBadgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.primaryDark,
  },
});
