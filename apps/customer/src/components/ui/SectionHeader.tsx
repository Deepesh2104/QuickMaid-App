import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts } from '../../theme/fonts';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, subtitle, action, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {action && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  text: { flex: 1 },
  title: { ...type.h3, color: colors.ink, fontFamily: fonts.bold },
  subtitle: { ...type.bodySm, color: colors.muted, marginTop: 2 },
  action: { ...type.bodySm, color: colors.primary, fontFamily: fonts.semiBold },
});
