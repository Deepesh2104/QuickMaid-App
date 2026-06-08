import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PLANS } from '@/constants/demo';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { useOpenPlusSubscribe } from '../hooks/useOpenPlusSubscribe';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const PLAN_STYLE: Record<
  string,
  { header: readonly [string, string]; glow: string; icon: keyof typeof Ionicons.glyphMap; tag: string }
> = {
  plus: { header: ['#0F1419', '#1A2332'], glow: 'rgba(251,191,36,0.18)', icon: 'diamond', tag: 'Best value' },
  flex: { header: ['#0B6E67', '#084F4A'], glow: 'rgba(110,231,183,0.2)', icon: 'calendar', tag: 'Flexible' },
  onetime: { header: ['#344054', '#1D2939'], glow: 'rgba(208,213,221,0.15)', icon: 'sparkles', tag: 'Try first' },
};

interface PlusPlanPickerProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function PlusPlanPicker({ selected, onSelect }: PlusPlanPickerProps) {
  const openSubscribe = useOpenPlusSubscribe();
  const plan = PLANS.find((p) => p.id === selected) ?? PLANS[0];
  const style = PLAN_STYLE[plan.id] ?? PLAN_STYLE.plus;
  const activeIndex = PLANS.findIndex((p) => p.id === selected);

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Choose plan"
        title="Find your fit"
        subtitle="Swipe plans · One membership, your rules"
        icon="layers-outline"
        compact
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
        {PLANS.map((p) => {
          const on = selected === p.id;
          const meta = PLAN_STYLE[p.id];
          return (
            <Pressable
              key={p.id}
              style={[styles.chip, on && styles.chipOn]}
              onPress={() => {
                Haptics.selectionAsync();
                onSelect(p.id);
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
            >
              {on ? (
                <LinearGradient
                  colors={[...meta.header]}
                  style={styles.chipIconOn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={meta.icon} size={20} color={colors.white} />
                </LinearGradient>
              ) : (
                <View style={styles.chipIcon}>
                  <Ionicons name={meta.icon} size={20} color={colors.primary} />
                </View>
              )}
              <Text style={[styles.chipName, on && styles.chipNameOn]} numberOfLines={1}>
                {p.name.replace('QuickMaid ', '')}
              </Text>
              <Text style={[styles.chipPrice, on && styles.chipPriceOn]}>{p.price}</Text>
              {on ? <View style={styles.chipBar} /> : <View style={styles.chipBarOff} />}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.dots}>
        {PLANS.map((p, i) => (
          <View key={p.id} style={[styles.dot, i === activeIndex && styles.dotOn]} />
        ))}
      </View>

      <View style={styles.card}>
        <LinearGradient colors={[...style.header]} style={styles.cardHeader}>
          <View style={[styles.cardGlow, { backgroundColor: style.glow }]} />
          <View style={styles.cardHeaderLeft}>
            <View style={styles.cardIcon}>
              <Ionicons name={style.icon} size={22} color={colors.white} />
            </View>
            <View style={styles.cardHeaderCopy}>
              <View style={styles.tagRow}>
                <Text style={styles.tag}>{style.tag}</Text>
                {plan.popular ? (
                  <View style={styles.popular}>
                    <Ionicons name="star" size={9} color="#FBBF24" />
                    <Text style={styles.popularText}>Popular</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.cardName}>{plan.name}</Text>
              <Text style={styles.cardVisits}>{plan.visits}</Text>
            </View>
          </View>
          <View style={styles.priceBlock}>
            <Text style={[styles.price, plan.popular && styles.priceGold]}>{plan.price}</Text>
            <Text style={styles.period}>{plan.period}</Text>
          </View>
        </LinearGradient>

        <View style={styles.cardBody}>
          <View style={styles.savings}>
            <Ionicons name="trending-down" size={14} color={colors.success} />
            <Text style={styles.savingsText}>{plan.savings}</Text>
          </View>

          {plan.features.map((f) => (
            <View key={f} style={styles.feature}>
              <View style={styles.featureCheck}>
                <Ionicons name="checkmark" size={12} color={colors.primaryDark} />
              </View>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}

          <Pressable
            style={styles.cta}
            onPress={() => openSubscribe(plan.id)}
            accessibilityRole="button"
            accessibilityLabel={`Start ${plan.name}`}
          >
            {plan.popular ? (
              <LinearGradient
                colors={['#6EE7B7', '#34D399']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            ) : (
              <View style={styles.ctaSecondaryBg} />
            )}
            <Text style={[styles.ctaText, plan.popular && styles.ctaTextDark]}>
              {plan.id === 'plus'
                ? 'Start Plus membership'
                : plan.id === 'flex'
                  ? 'Get Flex 6'
                  : 'Book a single visit'}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={plan.popular ? colors.ink : colors.primaryDark}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const CHIP_W = 100;

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  rail: {
    paddingHorizontal: layout.pad,
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  chip: {
    width: CHIP_W,
    alignItems: 'center',
    gap: 5,
    paddingTop: spacing.xs,
  },
  chipOn: {},
  chipIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.xl,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  chipIconOn: {
    width: 52,
    height: 52,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipName: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
  },
  chipNameOn: { color: colors.ink },
  chipPrice: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.mutedLight,
  },
  chipPriceOn: { color: colors.primary },
  chipBar: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
  chipBarOff: {
    width: 20,
    height: 3,
    marginTop: 2,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.bgMuted,
  },
  dotOn: {
    width: 18,
    backgroundColor: colors.primary,
  },
  card: {
    marginHorizontal: layout.pad,
    overflow: 'hidden',
    borderRadius: radius.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    right: -20,
    top: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cardHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderCopy: { flex: 1, gap: 2 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tag: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  popular: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(251,191,36,0.2)',
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  popularText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: '#FBBF24',
  },
  cardName: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: -0.3,
  },
  cardVisits: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.72)',
  },
  priceBlock: { alignItems: 'flex-end' },
  price: {
    fontFamily: fonts.extraBold,
    fontSize: 26,
    color: colors.white,
    letterSpacing: -0.5,
  },
  priceGold: { color: '#6EE7B7' },
  period: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
  },
  cardBody: {
    backgroundColor: colors.bg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  savings: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.successBg,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 4,
  },
  savingsText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.success,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 2,
  },
  featureCheck: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.inkSecondary,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radius.pill,
    paddingVertical: 15,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  ctaSecondaryBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.primaryLight,
  },
  ctaText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.primaryDark,
  },
  ctaTextDark: {
    color: colors.ink,
  },
});
