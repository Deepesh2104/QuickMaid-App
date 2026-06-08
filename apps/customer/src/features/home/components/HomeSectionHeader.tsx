import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { premium } from '../constants/home.premium';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface HomeSectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: IoniconName;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export function HomeSectionHeader({
  eyebrow,
  title,
  subtitle,
  icon,
  actionLabel,
  onAction,
  compact,
}: HomeSectionHeaderProps) {
  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <View style={styles.left}>
        {icon ? (
          <View style={[styles.iconOuter, compact && styles.iconOuterCompact]}>
            <LinearGradient
              colors={[...premium.iconGradient]}
              style={[styles.iconBox, compact && styles.iconBoxCompact]}
            >
              <Ionicons name={icon} size={compact ? 16 : 18} color={colors.primaryDark} />
            </LinearGradient>
          </View>
        ) : null}
        <View style={styles.copy}>
          {eyebrow ? (
            <View style={styles.eyebrowRow}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrow}>{eyebrow}</Text>
            </View>
          ) : null}
          <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
          {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
        </View>
      </View>
      {actionLabel && onAction ? (
        <Pressable
          style={styles.action}
          onPress={() => {
            Haptics.selectionAsync();
            onAction();
          }}
          accessibilityRole="button"
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
          <View style={styles.actionIcon}>
            <Ionicons name="chevron-forward" size={12} color={colors.primaryDark} />
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.pad,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  wrapCompact: { marginBottom: spacing.md },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
    minWidth: 0,
  },
  iconOuter: {
    ...premium.surfaceSoft,
    padding: 2,
  },
  iconOuterCompact: { borderRadius: radius.md },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.lg - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxCompact: { width: 34, height: 34, borderRadius: radius.md - 2 },
  copy: { flex: 1, minWidth: 0, gap: 3 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eyebrowDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.ink,
    letterSpacing: -0.6,
    lineHeight: 26,
  },
  titleCompact: { fontSize: 19, lineHeight: 23, letterSpacing: -0.4 },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 7,
  },
  actionText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  actionIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
