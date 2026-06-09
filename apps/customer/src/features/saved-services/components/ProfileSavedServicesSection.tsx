import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { useOpenServiceDetail } from '@/features/service/hooks/useOpenServiceDetail';
import { resolveSavedServices } from '../lib/saved.services';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface ProfileSavedServicesSectionProps {
  savedServiceIds: string[];
}

export function ProfileSavedServicesSection({ savedServiceIds }: ProfileSavedServicesSectionProps) {
  const router = useRouter();
  const { bookService } = useStartBooking();
  const openDetail = useOpenServiceDetail();
  const services = useMemo(() => resolveSavedServices(savedServiceIds).slice(0, 4), [savedServiceIds]);

  if (!savedServiceIds.length) return null;

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Favourites"
        title="Saved services"
        subtitle={`${savedServiceIds.length} on your shortlist`}
        icon="heart"
        actionLabel="View all"
        onAction={() => {
          Haptics.selectionAsync();
          router.push('/account/saved-services' as Href);
        }}
        compact
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {services.map((service) => (
          <Pressable
            key={service.id}
            style={styles.chip}
            onPress={() => openDetail(service.id)}
            onLongPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              bookService(service);
            }}
            accessibilityRole="button"
          >
            <View style={styles.chipIcon}>
              <Ionicons name={service.icon} size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.chipName} numberOfLines={1}>
              {service.name}
            </Text>
            <Text style={styles.chipPrice}>{service.price}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const CHIP_W = 128;

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  row: {
    paddingHorizontal: layout.pad,
    gap: spacing.sm,
    paddingRight: layout.pad + spacing.sm,
  },
  chip: {
    width: CHIP_W,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  chipIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipName: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.ink,
  },
  chipPrice: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    color: colors.primaryDark,
  },
});
