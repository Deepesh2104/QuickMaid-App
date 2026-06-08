import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const AREAS = [
  { name: 'Shankar Nagar', homes: '840+' },
  { name: 'Sector 5', homes: '620+' },
  { name: 'Telibandha', homes: '410+' },
  { name: 'Pandri', homes: '380+' },
  { name: 'Devendra Nagar', homes: '290+' },
  { name: 'Mowa', homes: '210+' },
];

const HOME_TYPES = ['1BHK', '2BHK', '3BHK', 'Villa', 'Office'];

export function PlusCoverageStrip() {
  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Raipur coverage"
        title="We serve your area"
        subtitle="Same-day slots in most zones"
        icon="location-outline"
        compact
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.areaRow}>
        {AREAS.map((a) => (
          <View key={a.name} style={styles.areaChip}>
            <Ionicons name="home-outline" size={13} color={colors.primary} />
            <Text style={styles.areaName}>{a.name}</Text>
            <Text style={styles.areaHomes}>{a.homes}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.typeRow}>
        {HOME_TYPES.map((t) => (
          <View key={t} style={styles.typeChip}>
            <Text style={styles.typeText}>{t}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  areaRow: {
    paddingHorizontal: layout.pad,
    gap: spacing.sm,
    paddingRight: layout.pad + spacing.sm,
    marginBottom: spacing.md,
  },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  areaName: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.ink,
  },
  areaHomes: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.muted,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: layout.pad,
  },
  typeChip: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  typeText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
});
