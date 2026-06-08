import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const ISSUES = [
  {
    id: 'booking',
    icon: 'calendar' as const,
    label: 'Booking',
    tagline: 'Visits & slots',
    bullets: ['Reschedule or cancel a visit', 'Track when your maid arrives', 'Add notes for next clean'],
    header: ['#0B6E67', '#084F4A'] as const,
    glow: 'rgba(110,231,183,0.22)',
  },
  {
    id: 'payment',
    icon: 'card' as const,
    label: 'Payment',
    tagline: 'Bills & refunds',
    bullets: ['UPI or card payment issues', 'Download visit invoice', 'Refund status & timeline'],
    header: ['#175CD3', '#1245A8'] as const,
    glow: 'rgba(147,197,253,0.25)',
  },
  {
    id: 'plus',
    icon: 'diamond' as const,
    label: 'Plus',
    tagline: 'Membership',
    bullets: ['Compare Plus vs Flex plans', 'Update billing details', 'Pause or cancel membership'],
    header: ['#B54708', '#93370D'] as const,
    glow: 'rgba(251,191,36,0.2)',
  },
  {
    id: 'partner',
    icon: 'person' as const,
    label: 'Partner',
    tagline: 'Your maid',
    bullets: ['Request a different partner', 'Report quality concerns', 'Share visit feedback'],
    header: ['#6941C6', '#53389E'] as const,
    glow: 'rgba(214,187,251,0.25)',
  },
  {
    id: 'other',
    icon: 'sparkles' as const,
    label: 'Other',
    tagline: 'Anything else',
    bullets: ['Account & app questions', 'Service area & coverage', 'Partnership enquiries'],
    header: ['#344054', '#1D2939'] as const,
    glow: 'rgba(208,213,221,0.2)',
  },
];

interface HelpIssueSectionProps {
  onOpenChat: (topic?: string) => void;
}

export function HelpIssueSection({ onOpenChat }: HelpIssueSectionProps) {
  const [active, setActive] = useState('booking');
  const selected = ISSUES.find((i) => i.id === active) ?? ISSUES[0];
  const activeIndex = ISSUES.findIndex((i) => i.id === active);

  const openChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onOpenChat(selected.id);
  };

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Your issue"
        title="What's going on?"
        subtitle="Swipe to pick · We'll handle the rest"
        icon="compass-outline"
        compact
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
      >
        {ISSUES.map((issue) => {
          const on = active === issue.id;
          return (
            <Pressable
              key={issue.id}
              style={styles.chip}
              onPress={() => {
                Haptics.selectionAsync();
                setActive(issue.id);
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
            >
              {on ? (
                <LinearGradient
                  colors={[...issue.header]}
                  style={styles.chipIconOn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={issue.icon} size={22} color={colors.white} />
                </LinearGradient>
              ) : (
                <View style={styles.chipIcon}>
                  <Ionicons name={issue.icon} size={22} color={colors.primary} />
                </View>
              )}
              <Text style={[styles.chipLabel, on && styles.chipLabelOn]}>{issue.label}</Text>
              <Text style={[styles.chipTag, on && styles.chipTagOn]} numberOfLines={1}>
                {issue.tagline}
              </Text>
              {on ? <View style={styles.chipBarOn} /> : <View style={styles.chipBar} />}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.dots}>
        {ISSUES.map((issue, i) => (
          <View key={issue.id} style={[styles.dot, i === activeIndex && styles.dotOn]} />
        ))}
      </View>

      <View style={styles.card}>
        <LinearGradient colors={[...selected.header]} style={styles.cardHeader}>
          <View style={[styles.cardGlow, { backgroundColor: selected.glow }]} />
          <View style={styles.cardHeaderLeft}>
            <View style={styles.cardHeaderIcon}>
              <Ionicons name={selected.icon} size={24} color={colors.white} />
            </View>
            <View style={styles.cardHeaderCopy}>
              <Text style={styles.cardEyebrow}>Selected issue</Text>
              <Text style={styles.cardTitle}>{selected.label}</Text>
              <Text style={styles.cardTagline}>{selected.tagline}</Text>
            </View>
          </View>
          <View style={styles.etaBadge}>
            <Ionicons name="flash" size={11} color="#6EE7B7" />
            <Text style={styles.etaText}>~2 min</Text>
          </View>
        </LinearGradient>

        <View style={styles.cardBody}>
          <Text style={styles.bulletsTitle}>We can help you with</Text>
          {selected.bullets.map((b) => (
            <View key={b} style={styles.bulletRow}>
              <View style={styles.bulletCheck}>
                <Ionicons name="checkmark" size={12} color={colors.primaryDark} />
              </View>
              <Text style={styles.bulletText}>{b}</Text>
            </View>
          ))}

          <Pressable style={styles.chatBtn} onPress={openChat} accessibilityRole="button">
            <LinearGradient
              colors={['#0B6E67', '#084F4A']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
            <Ionicons name="chatbubble-ellipses" size={18} color={colors.white} />
            <Text style={styles.chatBtnText}>Chat about {selected.label.toLowerCase()}</Text>
            <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.85)" />
          </Pressable>

          <Text style={styles.cardFoot}>Avg. first reply under 5 minutes</Text>
        </View>
      </View>
    </View>
  );
}

const CHIP_W = 88;

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  rail: {
    paddingHorizontal: layout.pad,
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  chip: {
    width: CHIP_W,
    alignItems: 'center',
    gap: 6,
    paddingTop: spacing.xs,
  },
  chipIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  chipIconOn: {
    width: 56,
    height: 56,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.muted,
  },
  chipLabelOn: {
    color: colors.ink,
  },
  chipTag: {
    fontFamily: fonts.regular,
    fontSize: 9,
    color: colors.mutedLight,
    textAlign: 'center',
  },
  chipTagOn: {
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  chipBar: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginTop: 2,
  },
  chipBarOn: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.bgMuted,
  },
  dotOn: {
    width: 18,
    backgroundColor: colors.primary,
  },
  card: {
    marginHorizontal: layout.pad,
    overflow: 'hidden',
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.xxl,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    right: -24,
    top: -24,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cardHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardHeaderIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderCopy: { flex: 1, gap: 1 },
  cardEyebrow: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.white,
    letterSpacing: -0.4,
  },
  cardTagline: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  etaText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.white,
  },
  cardBody: {
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.bg,
  },
  bulletsTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: 3,
  },
  bulletCheck: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.inkSecondary,
    lineHeight: 19,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radius.pill,
    paddingVertical: 15,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  chatBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
  cardFoot: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.mutedLight,
    textAlign: 'center',
    marginTop: 4,
  },
});
