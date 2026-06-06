import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QmButton } from '../../src/components/ui/QmButton';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { PLANS } from '../../src/constants/demo';
import { colors } from '../../src/theme/colors';
import { layout, radius, shadow, spacing } from '../../src/theme/spacing';
import { type } from '../../src/theme/typography';

export default function PlansScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.heroIcon}>
          <Ionicons name="diamond" size={28} color={colors.primary} />
        </View>
        <SectionHeader
          title="QuickMaid Plus"
          subtitle="Save more with monthly plans. Verified maids, priority slots."
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        {PLANS.map((plan) => (
          <View key={plan.id} style={[styles.planCard, plan.popular && styles.planPopular]}>
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Recommended</Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planVisits}>{plan.visits}</Text>
              </View>
              <View style={styles.priceBlock}>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planPeriod}>{plan.period}</Text>
              </View>
            </View>

            <View style={styles.savingsPill}>
              <Text style={styles.savingsText}>{plan.savings}</Text>
            </View>

            <View style={styles.features}>
              {plan.features.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>

            <QmButton
              label={plan.popular ? 'Start Plus membership' : `Choose ${plan.name}`}
              variant={plan.popular ? 'primary' : 'secondary'}
              onPress={() => {}}
            />
          </View>
        ))}

        <View style={styles.guarantee}>
          <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
          <Text style={styles.guaranteeTitle}>Satisfaction guarantee</Text>
          <Text style={styles.guaranteeSub}>
            Not happy? We'll re-clean or refund within 24 hours.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSubtle },
  header: { paddingHorizontal: layout.pad, paddingBottom: spacing.sm },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  body: { paddingHorizontal: layout.pad, paddingTop: spacing.lg, gap: spacing.lg },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadow.card,
  },
  planPopular: { borderColor: colors.primary, borderWidth: 2 },
  popularBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: spacing.md,
  },
  popularText: { ...type.overline, color: colors.white, fontSize: 9 },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  planName: { ...type.h2, color: colors.ink },
  planVisits: { ...type.bodySm, color: colors.muted, marginTop: 2 },
  priceBlock: { alignItems: 'flex-end' },
  planPrice: { ...type.h1, color: colors.primary },
  planPeriod: { ...type.caption, color: colors.muted },
  savingsPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.successBg,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: spacing.lg,
  },
  savingsText: { ...type.caption, color: colors.success, fontWeight: '700' },
  features: { gap: spacing.sm, marginBottom: spacing.xl },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  featureText: { ...type.bodySm, color: colors.inkSecondary },
  guarantee: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    gap: spacing.sm,
    ...shadow.sm,
  },
  guaranteeTitle: { ...type.h3, color: colors.ink },
  guaranteeSub: { ...type.bodySm, color: colors.muted, textAlign: 'center', lineHeight: 20 },
});
