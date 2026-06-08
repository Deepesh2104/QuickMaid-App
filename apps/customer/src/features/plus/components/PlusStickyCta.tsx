import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PLANS } from '@/constants/demo';
import { useOpenPlusSubscribe } from '../hooks/useOpenPlusSubscribe';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const CTA: Record<string, { label: string; sub: string }> = {
  plus: { label: 'Start Plus — ₹1,199/mo', sub: 'Save 20% · 12 visits' },
  flex: { label: 'Get Flex 6 — ₹699/mo', sub: '6 visits · flexible' },
  onetime: { label: 'Book single visit — ₹149', sub: 'No commitment' },
};

interface PlusStickyCtaProps {
  selectedPlan: string;
}

export function PlusStickyCta({ selectedPlan }: PlusStickyCtaProps) {
  const insets = useSafeAreaInsets();
  const openSubscribe = useOpenPlusSubscribe();
  const plan = PLANS.find((p) => p.id === selectedPlan);
  const copy = CTA[selectedPlan] ?? CTA.plus;

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom + spacing.sm }]}>
      <LinearGradient colors={['transparent', 'rgba(255,255,255,0.92)', colors.bg]} style={styles.fade} />
      <Pressable
        style={styles.btn}
        onPress={() => openSubscribe(selectedPlan)}
        accessibilityRole="button"
        accessibilityLabel={copy.label}
      >
        <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
        <View style={styles.btnCopy}>
          <Text style={styles.btnLabel}>{copy.label}</Text>
          <Text style={styles.btnSub}>{copy.sub}</Text>
        </View>
        <View style={styles.btnIcon}>
          <Ionicons name="arrow-forward" size={18} color={colors.primaryDark} />
        </View>
      </Pressable>
      {plan?.popular ? (
        <Text style={styles.hint}>Most popular for regular homes</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.lg,
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 40,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
    gap: spacing.md,
  },
  btnCopy: { flex: 1, gap: 1 },
  btnLabel: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  btnSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
  },
  btnIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    backgroundColor: '#6EE7B7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 6,
  },
});
