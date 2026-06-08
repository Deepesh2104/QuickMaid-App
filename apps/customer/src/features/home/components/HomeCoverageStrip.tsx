import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { HomeSectionHeader } from './HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const AREAS = [
  'Civil Lines',
  'Pandri',
  'Telibandha',
  'Shankar Nagar',
  'Devendra Nagar',
  'Mowa',
  'Amanaka',
  'Fafadih',
  'Gudhiyari',
  'Urla',
];

export function HomeCoverageStrip() {
  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Service area"
        title="We cover Raipur"
        subtitle="50+ neighbourhoods · Expanding soon"
        icon="location-outline"
        compact
      />
      <View style={styles.live}>
        <View style={styles.pulse} />
        <Text style={styles.liveText}>Live in your area</Text>
        <Ionicons name="checkmark-circle" size={14} color={colors.success} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {AREAS.map((area) => (
          <View key={area} style={styles.chip}>
            <Ionicons name="navigate-outline" size={11} color={colors.primary} />
            <Text style={styles.chipText}>{area}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  live: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: layout.pad,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
    backgroundColor: colors.successBg,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  liveText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.success,
  },
  row: {
    paddingHorizontal: layout.pad,
    gap: spacing.sm,
    paddingRight: layout.pad + spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.07)',
  },
  chipText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.inkSecondary,
  },
});
