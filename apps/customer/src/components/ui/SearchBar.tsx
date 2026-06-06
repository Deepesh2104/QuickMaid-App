import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface SearchBarProps {
  placeholder?: string;
  onPress?: () => void;
  variant?: 'default' | 'hero';
}

export function SearchBar({
  placeholder = 'Search services, offers...',
  onPress,
  variant = 'default',
}: SearchBarProps) {
  const isHero = variant === 'hero';

  return (
    <Pressable
      style={[styles.bar, isHero && styles.barHero]}
      onPress={onPress}
    >
      <Ionicons
        name="search-outline"
        size={20}
        color={isHero ? 'rgba(255,255,255,0.7)' : colors.muted}
      />
      <Text style={[styles.text, isHero && styles.textHero]}>{placeholder}</Text>
      {isHero ? (
        <View style={styles.filterChip}>
          <Ionicons name="options-outline" size={14} color={colors.primaryDark} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.searchBg,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  barHero: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: 'rgba(255,255,255,0.3)',
    ...{
      shadowColor: '#0F1419',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    },
  },
  text: { ...type.body, color: colors.muted, flex: 1 },
  textHero: { color: colors.muted },
  filterChip: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
