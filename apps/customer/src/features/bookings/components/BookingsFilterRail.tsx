import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { BookingStatus } from '@/constants/demo';
import { useTranslation } from '@/i18n/LanguageProvider';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export type BookingFilter = 'all' | BookingStatus;

const FILTERS: {
  id: BookingFilter;
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: readonly [string, string];
}[] = [
  { id: 'all', labelKey: 'bookings.filterAll', icon: 'layers-outline', gradient: ['#0B6E67', '#084F4A'] },
  { id: 'upcoming', labelKey: 'bookings.filterUpcoming', icon: 'time-outline', gradient: ['#175CD3', '#1245A8'] },
  { id: 'completed', labelKey: 'bookings.filterPast', icon: 'checkmark-circle-outline', gradient: ['#027A48', '#05603A'] },
  { id: 'cancelled', labelKey: 'bookings.filterCancelled', icon: 'close-circle-outline', gradient: ['#475467', '#344054'] },
];

interface BookingsFilterRailProps {
  active: BookingFilter;
  counts: Record<BookingFilter, number>;
  onSelect: (id: BookingFilter) => void;
}

export function BookingsFilterRail({ active, counts, onSelect }: BookingsFilterRailProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
      >
        {FILTERS.map((f) => {
          const on = active === f.id;
          const count = counts[f.id];
          return (
            <Pressable
              key={f.id}
              style={[styles.pill, on && styles.pillOn]}
              onPress={() => {
                Haptics.selectionAsync();
                onSelect(f.id);
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
            >
              {on ? (
                <LinearGradient
                  colors={[...f.gradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
              <Ionicons
                name={f.icon}
                size={15}
                color={on ? colors.white : colors.primary}
              />
                  <Text style={[styles.pillLabel, on && styles.pillLabelOn]}>{t(f.labelKey)}</Text>
              <View style={[styles.badge, on && styles.badgeOn]}>
                <Text style={[styles.badgeText, on && styles.badgeTextOn]}>{count}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  rail: {
    paddingHorizontal: layout.pad,
    gap: spacing.sm,
    paddingRight: layout.pad + spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.1)',
    overflow: 'hidden',
  },
  pillOn: {
    borderColor: 'transparent',
  },
  pillLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.inkSecondary,
  },
  pillLabelOn: {
    fontFamily: fonts.bold,
    color: colors.white,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeOn: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.primaryDark,
  },
  badgeTextOn: {
    color: colors.white,
  },
});
