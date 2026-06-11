import { StyleSheet, Text, View } from 'react-native';

import {
  KYC_WIZARD_STEPS,
  stepIndex,
  type KycWizardStep,
} from '@/features/kyc/lib/kyc.routing';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

const FLOW_STEPS = KYC_WIZARD_STEPS.filter((s) => s.id !== 'intro');

export function PartnerKycStepBar({ active }: { active: KycWizardStep }) {
  const activeIdx = stepIndex(active);

  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        {FLOW_STEPS.map((step) => {
          const stepIdx = stepIndex(step.id);
          const done = activeIdx > stepIdx;
          const current = active === step.id;
          return (
            <View key={step.id} style={styles.step}>
              <View
                style={[
                  styles.dot,
                  done && styles.dotDone,
                  current && styles.dotActive,
                ]}
              >
                <Text
                  style={[
                    styles.dotText,
                    (done || current) && styles.dotTextOn,
                  ]}
                >
                  {step.short}
                </Text>
              </View>
              <Text style={[styles.label, current && styles.labelActive]} numberOfLines={1}>
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.1)',
  },
  track: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  step: { flex: 1, alignItems: 'center', gap: 4, minWidth: 0 },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dotDone: { backgroundColor: colors.success, borderColor: colors.success },
  dotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dotText: { fontFamily: fonts.bold, fontSize: 11, color: colors.muted },
  dotTextOn: { color: colors.white },
  label: { fontFamily: fonts.medium, fontSize: 9, color: colors.muted, textAlign: 'center' },
  labelActive: { fontFamily: fonts.bold, color: colors.primary },
});
