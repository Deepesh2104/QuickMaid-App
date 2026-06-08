import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FAQ_ITEMS } from '@/constants/demo';
import { premium } from '../constants/home.premium';
import { HomeSectionHeader } from './HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function HomeFaqPreview() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Got questions?"
        title="Quick answers"
        subtitle="Everything you need to know"
        icon="help-circle-outline"
        compact
      />
      <View style={styles.list}>
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <Pressable
              key={item.q}
              style={[styles.item, i < FAQ_ITEMS.length - 1 && styles.itemBorder]}
              onPress={() => {
                Haptics.selectionAsync();
                setOpen(isOpen ? null : i);
              }}
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
            >
              {isOpen ? (
                <LinearGradient colors={['#F8FAFB', '#FFFFFF']} style={styles.itemBg} />
              ) : null}
              <View style={styles.head}>
                <View style={[styles.qIcon, isOpen && styles.qIconOn]}>
                  <Ionicons name="help-circle" size={16} color={isOpen ? colors.white : colors.primary} />
                </View>
                <Text style={[styles.q, isOpen && styles.qOn]}>{item.q}</Text>
                <Ionicons
                  name={isOpen ? 'chevron-up-circle' : 'chevron-down-circle'}
                  size={20}
                  color={isOpen ? colors.primary : colors.mutedLight}
                />
              </View>
              {isOpen ? <Text style={styles.a}>{item.a}</Text> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { ...premium.section },
  list: {
    marginHorizontal: layout.pad,
    overflow: 'hidden',
    ...premium.surface,
  },
  item: {
    padding: spacing.lg,
    gap: spacing.sm,
    position: 'relative',
  },
  itemBg: { ...StyleSheet.absoluteFill },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  qIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qIconOn: {
    backgroundColor: colors.primary,
  },
  q: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
    lineHeight: 19,
  },
  qOn: {
    color: colors.primaryDark,
  },
  a: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
    paddingLeft: 38,
  },
});
