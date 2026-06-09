import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';
import { useTranslation } from '@/i18n/LanguageProvider';
import type { BookingFilter } from './BookingsFilterRail';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const FILTER_LABEL_KEYS: Record<BookingFilter, string> = {
  all: 'bookings.filterLabelAll',
  upcoming: 'bookings.filterLabelUpcoming',
  completed: 'bookings.filterLabelCompleted',
  cancelled: 'bookings.filterLabelCancelled',
};

interface BookingsEmptyStateProps {
  filter: BookingFilter;
}

export function BookingsEmptyState({ filter }: BookingsEmptyStateProps) {
  const { bookDefault } = useStartBooking();
  const { t } = useTranslation();
  const filterLabel = t(FILTER_LABEL_KEYS[filter]);

  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#F4F6F8', '#FFFFFF']} style={StyleSheet.absoluteFill} />

      <View style={styles.iconRing}>
        <View style={styles.icon}>
          <Ionicons name="calendar-outline" size={36} color={colors.primary} />
        </View>
      </View>

      <Text style={styles.title}>{t('bookings.emptyTitle', { filter: filterLabel })}</Text>
      <Text style={styles.sub}>{t('bookings.emptySub')}</Text>

      <Pressable
        style={styles.cta}
        onPress={() => bookDefault()}
        accessibilityRole="button"
      >
        <LinearGradient colors={['#0B6E67', '#084F4A']} style={styles.ctaGrad}>
          <Ionicons name="sparkles" size={16} color={colors.white} />
          <Text style={styles.ctaText}>{t('bookings.emptyCta')}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginHorizontal: layout.pad,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing.section,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  iconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  cta: {
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  ctaGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
  },
  ctaText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
});
