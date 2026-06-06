import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
  light?: boolean;
}

export function ScreenHeader({ title, subtitle, onBack, right, light }: ScreenHeaderProps) {
  const titleColor = light ? colors.white : colors.ink;
  const subColor = light ? 'rgba(255,255,255,0.78)' : colors.muted;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
            <Ionicons name="chevron-back" size={22} color={light ? colors.white : colors.ink} />
          </Pressable>
        ) : (
          <View style={styles.backSpacer} />
        )}
        {right ?? <View style={styles.backSpacer} />}
      </View>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: subColor }]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backSpacer: {
    width: 40,
  },
  title: {
    ...type.h1,
  },
  subtitle: {
    ...type.bodySm,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
});
