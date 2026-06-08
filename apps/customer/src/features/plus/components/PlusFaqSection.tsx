import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PLUS_FAQ_ITEMS } from '@/constants/demo';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function PlusFaqSection() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Membership FAQ"
        title="Plan questions"
        subtitle="Before you subscribe"
        icon="help-circle-outline"
        compact
      />

      <View style={styles.list}>
        {PLUS_FAQ_ITEMS.map((item, i) => {
          const open = expanded === i;
          return (
            <Pressable
              key={item.q}
              style={[styles.card, open && styles.cardOpen]}
              onPress={() => {
                Haptics.selectionAsync();
                setExpanded(open ? null : i);
              }}
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
            >
              {open ? (
                <LinearGradient
                  colors={['rgba(255,248,238,0.8)', '#FFFFFF']}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
              <View style={styles.head}>
                <View style={[styles.badge, open && styles.badgeOn]}>
                  <Ionicons name="diamond-outline" size={12} color={open ? colors.white : '#B54708'} />
                </View>
                <Text style={[styles.q, open && styles.qOpen]}>{item.q}</Text>
                <Ionicons
                  name={open ? 'chevron-up-circle' : 'chevron-down-circle'}
                  size={20}
                  color={open ? '#B54708' : colors.mutedLight}
                />
              </View>
              {open ? <Text style={styles.a}>{item.a}</Text> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  list: {
    paddingHorizontal: layout.pad,
    gap: spacing.sm,
  },
  card: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  cardOpen: { borderColor: 'rgba(181,71,8,0.2)' },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  badge: {
    width: 28,
    height: 28,
    borderRadius: radius.md,
    backgroundColor: '#FFFAEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeOn: { backgroundColor: '#B54708' },
  q: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
    lineHeight: 19,
  },
  qOpen: { color: '#93370D' },
  a: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginLeft: 38,
  },
});
