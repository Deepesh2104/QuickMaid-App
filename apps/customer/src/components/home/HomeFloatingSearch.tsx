import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { layout, radius, shadow, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

const QUICK_TAGS = ['Deep clean', 'Regular', 'Kitchen', 'Bathroom'];

interface HomeFloatingSearchProps {
  onPress?: () => void;
}

export function HomeFloatingSearch({ onPress }: HomeFloatingSearchProps) {
  return (
    <View style={styles.wrap}>
      <Pressable style={styles.bar} onPress={onPress}>
        <Ionicons name="search" size={18} color={colors.primary} />
        <Text style={styles.placeholder}>Search for cleaning services...</Text>
      </Pressable>
      <ScrollTags />
    </View>
  );
}

function ScrollTags() {
  return (
    <View style={styles.tags}>
      {QUICK_TAGS.map((tag) => (
        <View key={tag} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: layout.pad,
    marginTop: -32,
    marginBottom: spacing.xl,
    zIndex: 20,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadow.lg,
  },
  placeholder: {
    ...type.body,
    color: colors.muted,
    flex: 1,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tagText: {
    ...type.caption,
    color: colors.inkSecondary,
    fontWeight: '600',
  },
});
