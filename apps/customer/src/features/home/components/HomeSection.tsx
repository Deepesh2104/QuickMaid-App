import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, spacing } from '@/theme/spacing';

interface HomeSectionProps {
  title: string;
  subtitle?: string;
  action?: string;
  children: React.ReactNode;
  noPad?: boolean;
}

export function HomeSection({ title, subtitle, action, children, noPad }: HomeSectionProps) {
  return (
    <View style={[styles.block, noPad && styles.noPad]}>
      <View style={styles.head}>
        <View style={styles.titles}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
        </View>
        {action ? <Text style={styles.action}>{action}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: spacing.xxxl,
    paddingHorizontal: layout.pad,
  },
  noPad: { paddingHorizontal: 0 },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingHorizontal: layout.pad,
  },
  titles: { flex: 1, gap: 3 },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  action: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.primary,
    marginLeft: spacing.md,
  },
});
