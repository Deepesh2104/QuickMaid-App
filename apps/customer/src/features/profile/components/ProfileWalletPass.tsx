import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface ProfileWalletPassProps {
  balance: number;
  afterAmount?: number;
  compact?: boolean;
}

export function ProfileWalletPass({ balance, afterAmount, compact }: ProfileWalletPassProps) {
  const display = afterAmount !== undefined && afterAmount > 0 ? balance + afterAmount : balance;
  const showDelta = afterAmount !== undefined && afterAmount > 0;

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598', '#0F1419']} locations={[0, 0.35, 0.7, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={styles.meshA} pointerEvents="none" />
      <View style={styles.meshB} pointerEvents="none" />
      <View style={styles.meshC} pointerEvents="none" />

      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Ionicons name="wallet" size={16} color={colors.primaryDark} />
          </View>
          <Text style={styles.brand}>QuickMaid Wallet</Text>
        </View>
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Active</Text>
        </View>
      </View>

      <View style={styles.balanceBlock}>
        <Text style={styles.eyebrow}>{showDelta ? 'Balance after top-up' : 'Available balance'}</Text>
        <Text style={styles.amount}>₹{display.toLocaleString('en-IN')}</Text>
        {showDelta ? (
          <View style={styles.deltaRow}>
            <Ionicons name="arrow-up" size={12} color="#6EE7B7" />
            <Text style={styles.delta}>+₹{afterAmount} added</Text>
            <Text style={styles.deltaFrom}>from ₹{balance.toLocaleString('en-IN')}</Text>
          </View>
        ) : (
          <Text style={styles.sub}>Instant credits · No expiry · Use on bookings</Text>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.perk}>
          <Ionicons name="flash" size={12} color="#FCD34D" />
          <Text style={styles.perkText}>Instant</Text>
        </View>
        <View style={styles.perk}>
          <Ionicons name="shield-checkmark" size={12} color="#6EE7B7" />
          <Text style={styles.perkText}>Secure</Text>
        </View>
        <View style={styles.perk}>
          <Ionicons name="gift" size={12} color="#FCD34D" />
          <Text style={styles.perkText}>5% bonus ₹500+</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.xxl + 6,
    padding: spacing.lg + 2,
    minHeight: 200,
    overflow: 'hidden',
    gap: spacing.lg,
  },
  wrapCompact: {
    minHeight: 176,
  },
  meshA: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(110,231,183,0.15)',
  },
  meshB: {
    position: 'absolute',
    bottom: 20,
    left: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  meshC: {
    position: 'absolute',
    top: 60,
    right: 80,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(252,211,77,0.12)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6EE7B7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.3,
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
    borderColor: 'rgba(110,231,183,0.25)',
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
  balanceBlock: { gap: 4 },
  eyebrow: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
  },
  amount: {
    fontFamily: fonts.extraBold,
    fontSize: 40,
    color: colors.white,
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
  },
  delta: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: '#6EE7B7',
  },
  deltaFrom: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  perkText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
  },
});
