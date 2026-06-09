import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface ProfileWalletPassProps {
  balance: number;
  afterAmount?: number;
  compact?: boolean;
  onTopUp?: () => void;
}

const PERKS = [
  { icon: 'flash' as const, label: 'Instant', color: '#FCD34D' },
  { icon: 'shield-checkmark' as const, label: 'Secure', color: '#6EE7B7' },
  { icon: 'gift' as const, label: '5% bonus', sub: '₹500+', color: '#FCD34D' },
];

export function ProfileWalletPass({ balance, afterAmount, compact, onTopUp }: ProfileWalletPassProps) {
  const { width, contentWidth, isCompact, isNarrow } = useLayoutMetrics();
  const narrow = isCompact;
  const tight = isNarrow;
  const perkScrollW = ((contentWidth - spacing.sm * 2) / 3) * 0.88;
  const display = afterAmount !== undefined && afterAmount > 0 ? balance + afterAmount : balance;
  const showDelta = afterAmount !== undefined && afterAmount > 0;

  const pad = tight ? spacing.md : spacing.lg;
  const amountSize = tight ? 30 : narrow || compact ? 34 : 40;
  const brandSize = tight ? 11 : 13;
  const stackBalance = narrow && !showDelta;

  return (
    <View style={[styles.wrap, { padding: pad, minHeight: compact || narrow ? 168 : 196 }]}>
      <LinearGradient
        colors={['#010F0E', '#084F4A', '#0B6E67', '#12A598']}
        locations={[0, 0.28, 0.62, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.meshA, tight && styles.meshASm]} pointerEvents="none" />
      <View style={[styles.meshB, tight && styles.meshBSm]} pointerEvents="none" />
      <View style={styles.meshC} pointerEvents="none" />
      <View style={styles.watermark} pointerEvents="none">
        <Ionicons name="wallet" size={tight ? 72 : 88} color="rgba(255,255,255,0.04)" />
      </View>

      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={[styles.logo, tight && styles.logoSm]}>
            <Ionicons name="wallet" size={tight ? 14 : 16} color={colors.primaryDark} />
          </View>
          <View style={styles.brandCopy}>
            <Text style={[styles.brand, { fontSize: brandSize }]} numberOfLines={1}>
              QuickMaid Wallet
            </Text>
            <Text style={styles.brandSub} numberOfLines={1}>
              Pay faster on every booking
            </Text>
          </View>
        </View>
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Active</Text>
        </View>
      </View>

      <View style={[styles.balanceRow, stackBalance && styles.balanceRowStack]}>
        <View style={[styles.balanceBlock, stackBalance && styles.balanceBlockFull]}>
          <Text style={styles.eyebrow}>{showDelta ? 'Balance after top-up' : 'Available balance'}</Text>
          <Text
            style={[styles.amount, { fontSize: amountSize, lineHeight: amountSize + 4 }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
          >
            ₹{display.toLocaleString('en-IN')}
          </Text>
          {showDelta ? (
            <View style={styles.deltaRow}>
              <Ionicons name="arrow-up" size={12} color="#6EE7B7" />
              <Text style={styles.delta}>+₹{afterAmount} added</Text>
              <Text style={styles.deltaFrom} numberOfLines={1}>
                from ₹{balance.toLocaleString('en-IN')}
              </Text>
            </View>
          ) : (
            <Text style={styles.sub} numberOfLines={2}>
              Instant credits · No expiry · Use on bookings
            </Text>
          )}
        </View>

        {onTopUp && !showDelta ? (
          <Pressable
            style={[styles.topUpBtn, stackBalance && styles.topUpBtnFull]}
            onPress={onTopUp}
            accessibilityRole="button"
            accessibilityLabel="Top up wallet"
          >
            <LinearGradient colors={['#6EE7B7', '#34D399']} style={StyleSheet.absoluteFill} />
            <Ionicons name="add" size={stackBalance ? 18 : 20} color={colors.primaryDark} />
            <Text style={styles.topUpText}>Top up</Text>
          </Pressable>
        ) : null}
      </View>

      {narrow ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.perksScroll}
        >
          {PERKS.map((perk) => (
            <View key={perk.label} style={[styles.perk, styles.perkScroll, { minWidth: perkScrollW }]}>
              <Ionicons name={perk.icon} size={11} color={perk.color} />
              <Text style={styles.perkText} numberOfLines={1}>
                {perk.label}
                {perk.sub ? ` ${perk.sub}` : ''}
              </Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.perksRow}>
          {PERKS.map((perk) => (
            <View key={perk.label} style={styles.perk}>
              <Ionicons name={perk.icon} size={12} color={perk.color} />
              <Text style={styles.perkText} numberOfLines={1}>
                {perk.label}
                {perk.sub ? (
                  <Text style={styles.perkSub}> {perk.sub}</Text>
                ) : null}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: radius.xxl + 6,
    overflow: 'hidden',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.18)',
  },
  meshA: {
    position: 'absolute',
    top: -48,
    right: -36,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(110,231,183,0.14)',
  },
  meshASm: { width: 110, height: 110, top: -36, right: -24 },
  meshB: {
    position: 'absolute',
    bottom: 12,
    left: -56,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  meshBSm: { width: 90, height: 90, left: -40 },
  meshC: {
    position: 'absolute',
    top: 52,
    right: 72,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(252,211,77,0.1)',
  },
  watermark: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    zIndex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#6EE7B7',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoSm: { width: 30, height: 30, borderRadius: 15 },
  brandCopy: { flex: 1, minWidth: 0, gap: 1 },
  brand: {
    fontFamily: fonts.bold,
    color: colors.white,
    letterSpacing: 0.2,
  },
  brandSub: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.22)',
    flexShrink: 0,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6EE7B7',
  },
  liveText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: '#6EE7B7',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
    zIndex: 1,
  },
  balanceRowStack: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  balanceBlock: { flex: 1, minWidth: 0, gap: 4 },
  balanceBlockFull: { flex: 0 },
  eyebrow: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
  },
  amount: {
    fontFamily: fonts.extraBold,
    color: colors.white,
    letterSpacing: -1.2,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 15,
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
  },
  delta: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: '#6EE7B7',
  },
  deltaFrom: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    flexShrink: 1,
  },
  topUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: radius.pill,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    flexShrink: 0,
    minWidth: 96,
  },
  topUpBtnFull: {
    alignSelf: 'flex-start',
    minWidth: 120,
  },
  topUpText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.primaryDark,
  },
  perksRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    zIndex: 1,
  },
  perksScroll: {
    gap: spacing.sm,
    paddingRight: spacing.xs,
    zIndex: 1,
  },
  perk: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  perkScroll: {
    flex: 0,
  },
  perkText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.78)',
    flexShrink: 1,
  },
  perkSub: {
    fontFamily: fonts.medium,
    color: 'rgba(255,255,255,0.55)',
  },
});
