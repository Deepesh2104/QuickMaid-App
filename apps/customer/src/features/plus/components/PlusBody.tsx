import { StyleSheet, Text, View } from 'react-native';

import { PLANS } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, spacing } from '@/theme/spacing';

import { PlusCompareSection } from './PlusCompareSection';
import { PlusCoverageStrip } from './PlusCoverageStrip';
import { PlusFaqSection } from './PlusFaqSection';
import { PlusHowItWorks } from './PlusHowItWorks';
import { PlusMemberTrust } from './PlusMemberTrust';
import { PlusPerksGrid } from './PlusPerksGrid';
import { PlusPlanPicker } from './PlusPlanPicker';
import { PlusSavingsTicker } from './PlusSavingsTicker';
import { PlusSocialProof } from './PlusSocialProof';
import { PlusUpgradeNudge } from './PlusUpgradeNudge';
import { PlusValueBanner } from './PlusValueBanner';

interface PlusBodyProps {
  selectedPlan: string;
  onSelectPlan: (id: string) => void;
}

const FOOTER_COPY: Record<string, string> = {
  plus: 'Recommended for regular homes · Save 20% every month',
  flex: 'Perfect for occasional cleans · 6 visits, your pace',
  onetime: 'No commitment · Try QuickMaid first',
};

export function PlusBody({ selectedPlan, onSelectPlan }: PlusBodyProps) {
  const plan = PLANS.find((p) => p.id === selectedPlan);

  return (
    <View style={styles.block}>
      <PlusValueBanner />
      <PlusPerksGrid />
      <PlusPlanPicker selected={selectedPlan} onSelect={onSelectPlan} />
      <PlusSavingsTicker selectedPlan={selectedPlan} />
      <PlusUpgradeNudge selectedPlan={selectedPlan} onSelectPlan={onSelectPlan} />
      <PlusSocialProof />
      <PlusCompareSection />
      <PlusHowItWorks />
      <PlusCoverageStrip />
      <PlusFaqSection />
      <PlusMemberTrust />

      <View style={styles.footer}>
        <Text style={styles.footerBrand}>QuickMaid {plan?.name.replace('QuickMaid ', '') ?? 'Plus'}</Text>
        <Text style={styles.footerSub}>{FOOTER_COPY[selectedPlan] ?? FOOTER_COPY.plus}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {},
  footer: {
    alignItems: 'center',
    gap: 4,
    marginHorizontal: layout.pad,
    paddingTop: spacing.xs,
    paddingBottom: 0,
  },
  footerBrand: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: colors.muted,
    letterSpacing: 0.4,
  },
  footerSub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.mutedLight,
    textAlign: 'center',
    lineHeight: 17,
  },
});
