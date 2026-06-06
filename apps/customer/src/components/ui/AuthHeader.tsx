import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  step?: number;
  totalSteps?: number;
}

export function AuthHeader({ title, subtitle, onBack, step, totalSteps }: AuthHeaderProps) {
  return (
    <View style={styles.wrap}>
      {onBack && (
        <Pressable onPress={onBack} style={styles.back} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
      )}
      {step != null && totalSteps != null && (
        <View style={styles.progress}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View key={i} style={[styles.dot, i < step && styles.dotDone, i === step - 1 && styles.dotActive]} />
          ))}
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.xxl },
  back: { marginBottom: spacing.lg },
  progress: { flexDirection: 'row', gap: 6, marginBottom: spacing.xl },
  dot: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  dotDone: { backgroundColor: colors.primary },
  dotActive: { backgroundColor: colors.primary },
  title: { ...type.h1, color: colors.ink, marginBottom: spacing.xs },
  subtitle: { ...type.body, color: colors.muted, lineHeight: 24 },
});
