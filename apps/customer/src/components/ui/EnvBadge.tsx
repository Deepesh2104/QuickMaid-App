import { StyleSheet, Text, View } from 'react-native';

import { getAppEnv } from '@/config/env';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export function EnvBadge() {
  const env = getAppEnv();
  if (env === 'production') return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{env.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'center',
    backgroundColor: colors.warningBg,
    borderWidth: 1,
    borderColor: 'rgba(180,71,8,0.2)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    marginBottom: spacing.sm,
  },
  text: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.warning,
  },
});
