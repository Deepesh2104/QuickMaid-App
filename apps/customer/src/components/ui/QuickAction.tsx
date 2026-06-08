import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../../theme/fonts';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tint: string;
  onPress?: () => void;
}

export function QuickAction({ icon, label, tint, onPress }: QuickActionProps) {
  return (
    <Pressable style={styles.wrap} onPress={onPress}>
      <View style={[styles.icon, { backgroundColor: tint }]}>
        <Ionicons name={icon} size={21} color={colors.inkSecondary} />
      </View>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  icon: {
    width: 54,
    height: 54,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  label: {
    ...type.caption,
    color: colors.ink,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
    lineHeight: 14,
  },
});
