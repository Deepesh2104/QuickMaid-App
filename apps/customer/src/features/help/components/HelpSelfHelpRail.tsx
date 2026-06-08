import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const GUIDES = [
  {
    id: 'reschedule',
    icon: 'calendar-outline' as const,
    title: 'Reschedule visit',
    sub: 'Change date or time',
    gradient: ['#E6F4F2', '#FFFFFF'] as const,
    ink: colors.primaryDark,
    topic: 'booking',
  },
  {
    id: 'payment',
    icon: 'card-outline' as const,
    title: 'Payment issue',
    sub: 'Failed UPI or refund',
    gradient: ['#EEF6FF', '#FFFFFF'] as const,
    ink: '#175CD3',
    topic: 'payment',
  },
  {
    id: 'cancel',
    icon: 'close-circle-outline' as const,
    title: 'Cancel booking',
    sub: 'Free till 2 hrs before',
    gradient: ['#FEF3F2', '#FFFFFF'] as const,
    ink: '#D92D20',
    topic: 'booking',
  },
];

interface HelpSelfHelpRailProps {
  onOpenChat: (topic?: string) => void;
}

export function HelpSelfHelpRail({ onOpenChat }: HelpSelfHelpRailProps) {
  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Self-help"
        title="Fix it yourself"
        subtitle="Guides · Tap to chat"
        icon="book-outline"
        compact
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {GUIDES.map((g) => (
          <Pressable
            key={g.id}
            style={styles.card}
            onPress={() => {
              Haptics.selectionAsync();
              onOpenChat(g.topic);
            }}
            accessibilityRole="button"
          >
            <LinearGradient colors={[...g.gradient]} style={StyleSheet.absoluteFill} />
            <View style={[styles.icon, { backgroundColor: colors.white }]}>
              <Ionicons name={g.icon} size={20} color={g.ink} />
            </View>
            <Text style={styles.title}>{g.title}</Text>
            <Text style={styles.sub}>{g.sub}</Text>
            <View style={styles.link}>
              <Text style={[styles.linkText, { color: g.ink }]}>Get help</Text>
              <Ionicons name="arrow-forward" size={12} color={g.ink} />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const CARD_W = 140;

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  row: {
    paddingHorizontal: layout.pad,
    gap: spacing.sm,
    paddingRight: layout.pad + spacing.sm,
  },
  card: {
    width: CARD_W,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: 4,
    overflow: 'hidden',
    minHeight: 148,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.05)',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.muted,
    flex: 1,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: spacing.xs,
  },
  linkText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
  },
});
