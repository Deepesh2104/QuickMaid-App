import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface ListPaginationProps {
  showing: string;
  hasMore: boolean;
  onLoadMore: () => void;
  label?: string;
}

export function ListPagination({ showing, hasMore, onLoadMore, label = 'Load more' }: ListPaginationProps) {
  if (!hasMore && showing.startsWith('0')) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.showing}>Showing {showing}</Text>
      {hasMore ? (
        <Pressable
          style={styles.btn}
          onPress={() => {
            Haptics.selectionAsync();
            onLoadMore();
          }}
          accessibilityRole="button"
        >
          <Text style={styles.btnText}>{label}</Text>
          <Ionicons name="chevron-down" size={14} color={colors.primaryDark} />
        </Pressable>
      ) : (
        <Text style={styles.end}>All caught up</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  showing: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.15)',
  },
  btnText: { fontFamily: fonts.bold, fontSize: 12, color: colors.primaryDark },
  end: { fontFamily: fonts.semiBold, fontSize: 10, color: colors.mutedLight },
});
