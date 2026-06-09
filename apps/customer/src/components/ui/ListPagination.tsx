import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { premium } from '@/features/home/constants/home.premium';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface ListPaginationProps {
  page: number;
  totalPages: number;
  start: number;
  end: number;
  total: number;
  onPageChange: (page: number) => void;
  label?: string;
  itemLabel?: string;
  compact?: boolean;
}

function PagerButton({
  label,
  icon,
  disabled,
  onPress,
  variant,
}: {
  label: string;
  icon: 'chevron-back' | 'chevron-forward';
  disabled: boolean;
  onPress: () => void;
  variant: 'prev' | 'next';
}) {
  return (
    <Pressable
      style={[styles.pagerBtn, variant === 'next' && styles.pagerBtnNext, disabled && styles.pagerBtnOff]}
      onPress={() => {
        if (disabled) return;
        Haptics.selectionAsync();
        onPress();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      {variant === 'prev' ? (
        <Ionicons name={icon} size={16} color={disabled ? colors.mutedLight : colors.primaryDark} />
      ) : null}
      <Text style={[styles.pagerBtnText, disabled && styles.pagerBtnTextOff]}>{label}</Text>
      {variant === 'next' ? (
        <Ionicons name={icon} size={16} color={disabled ? colors.mutedLight : colors.primaryDark} />
      ) : null}
    </Pressable>
  );
}

export function ListPagination({
  page,
  totalPages,
  start,
  end,
  total,
  onPageChange,
  label = 'Page',
  itemLabel = 'items',
  compact,
}: ListPaginationProps) {
  if (totalPages <= 1) return null;

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <View style={styles.statusCard}>
        <View style={styles.statusTop}>
          <View>
            <Text style={styles.statusLabel}>{label}</Text>
            <Text style={styles.statusValue}>
              {page + 1} <Text style={styles.statusOf}>of {totalPages}</Text>
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              {start + 1}–{end} of {total} {itemLabel}
            </Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${((page + 1) / totalPages) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.pager}>
        <PagerButton
          label="Previous"
          icon="chevron-back"
          disabled={!canPrev}
          variant="prev"
          onPress={() => onPageChange(Math.max(0, page - 1))}
        />
        <View style={styles.pageDots}>
          {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
            let dotPage = i;
            if (totalPages > 7) {
              const windowStart = Math.max(0, Math.min(page - 3, totalPages - 7));
              dotPage = windowStart + i;
            }
            const active = dotPage === page;
            return (
              <Pressable
                key={dotPage}
                style={[styles.dot, active && styles.dotOn]}
                onPress={() => {
                  Haptics.selectionAsync();
                  onPageChange(dotPage);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Go to page ${dotPage + 1}`}
              />
            );
          })}
        </View>
        <PagerButton
          label="Next"
          icon="chevron-forward"
          disabled={!canNext}
          variant="next"
          onPress={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, marginTop: spacing.sm },
  wrapCompact: { marginHorizontal: 0 },
  statusCard: {
    ...premium.surfaceSoft,
    padding: spacing.md,
    gap: spacing.sm,
  },
  statusTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statusLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  statusValue: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  statusOf: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
  statusBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexShrink: 1,
  },
  statusBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.primaryDark,
    textAlign: 'right',
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.bgMuted,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  pager: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  pagerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  pagerBtnNext: { flexDirection: 'row' },
  pagerBtnOff: { opacity: 0.45 },
  pagerBtnText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  pagerBtnTextOff: { color: colors.mutedLight },
  pageDots: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.bgMuted,
  },
  dotOn: {
    width: 18,
    backgroundColor: colors.primary,
  },
});
