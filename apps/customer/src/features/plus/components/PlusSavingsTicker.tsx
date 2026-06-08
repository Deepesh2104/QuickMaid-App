import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { PLANS } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const SAVINGS: Record<string, { monthly: string; yearly: string; visits: string }> = {
  plus: { monthly: '₹240', yearly: '₹2,880', visits: '12 visits' },
  flex: { monthly: '₹84', yearly: '₹1,008', visits: '6 visits' },
  onetime: { monthly: '₹0', yearly: '₹0', visits: 'Pay per visit' },
};

interface PlusSavingsTickerProps {
  selectedPlan: string;
}

export function PlusSavingsTicker({ selectedPlan }: PlusSavingsTickerProps) {
  const plan = PLANS.find((p) => p.id === selectedPlan) ?? PLANS[0];
  const save = SAVINGS[selectedPlan] ?? SAVINGS.plus;
  const isPlus = selectedPlan === 'plus';

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={isPlus ? ['#FFF8EE', '#FFFAEB'] : ['#E6F4F2', '#FFFFFF']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.left}>
        <View style={[styles.icon, isPlus && styles.iconGold]}>
          <Ionicons name={isPlus ? 'trending-down' : 'calculator-outline'} size={18} color={isPlus ? '#B54708' : colors.primaryDark} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>{plan.name} savings</Text>
          <Text style={[styles.value, isPlus && styles.valueGold]}>
            {save.monthly === '₹0' ? 'No subscription' : `${save.monthly}/mo saved`}
          </Text>
        </View>
      </View>

      {save.monthly !== '₹0' ? (
        <View style={styles.right}>
          <Text style={styles.yearLabel}>Yearly</Text>
          <Text style={[styles.yearValue, isPlus && styles.valueGold]}>{save.yearly}</Text>
          <Text style={styles.visits}>{save.visits}</Text>
        </View>
      ) : (
        <View style={styles.tryBadge}>
          <Text style={styles.tryText}>Try first visit</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: layout.pad,
    borderRadius: radius.xl,
    padding: spacing.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(181,71,8,0.1)',
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGold: { backgroundColor: '#FEF0C7' },
  copy: { gap: 1 },
  eyebrow: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
  },
  value: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.primaryDark,
    letterSpacing: -0.3,
  },
  valueGold: { color: '#B54708' },
  right: { alignItems: 'flex-end', gap: 1 },
  yearLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.muted,
  },
  yearValue: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primaryDark,
  },
  visits: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.mutedLight,
  },
  tryBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tryText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
});
