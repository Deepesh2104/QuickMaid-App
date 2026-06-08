import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface ProfilePaymentPreviewProps {
  type: 'upi' | 'card';
  label: string;
  detail: string;
  isDefault?: boolean;
}

function maskDetail(type: 'upi' | 'card', detail: string) {
  if (!detail) return type === 'upi' ? 'name@upi' : '•••• •••• •••• 0000';
  if (type === 'upi') return detail;
  const last4 = detail.replace(/\D/g, '').slice(-4) || '0000';
  return `•••• •••• •••• ${last4}`;
}

export function ProfilePaymentPreview({ type, label, detail, isDefault }: ProfilePaymentPreviewProps) {
  const isUpi = type === 'upi';
  const grad = isUpi
    ? (['#1A3A6B', '#2D5AA0', '#1E4080'] as const)
    : (['#0F1419', '#1A2E2C', '#084F4A'] as const);

  return (
    <View style={styles.wrap}>
      <LinearGradient colors={[...grad]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={styles.shine} pointerEvents="none" />
      <View style={styles.orb} pointerEvents="none" />

      <View style={styles.top}>
        <View style={styles.chip}>
          <View style={styles.chipLine} />
          <View style={styles.chipLine} />
        </View>
        {isDefault ? (
          <View style={styles.defaultPill}>
            <Ionicons name="star" size={10} color="#FCD34D" />
            <Text style={styles.defaultText}>DEFAULT</Text>
          </View>
        ) : (
          <Ionicons name={isUpi ? 'phone-portrait-outline' : 'card'} size={22} color="rgba(255,255,255,0.5)" />
        )}
      </View>

      <Text style={styles.type}>{isUpi ? 'UPI' : 'DEBIT CARD'}</Text>
      <Text style={styles.label}>{label || (isUpi ? 'Google Pay' : 'HDFC Debit')}</Text>
      <Text style={[styles.detail, !isUpi && styles.detailCard]}>{maskDetail(type, detail)}</Text>

      <View style={styles.bottom}>
        <View style={styles.secure}>
          <Ionicons name="shield-checkmark" size={12} color="#6EE7B7" />
          <Text style={styles.secureText}>256-bit encrypted</Text>
        </View>
        <Text style={styles.brand}>QuickMaid Pay</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.xxl + 4,
    padding: spacing.lg + 4,
    minHeight: 168,
    overflow: 'hidden',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  shine: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  orb: {
    position: 'absolute',
    bottom: -30,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(110,231,183,0.12)',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chip: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(252,211,77,0.85)',
    padding: 5,
    gap: 3,
    justifyContent: 'center',
  },
  chipLine: {
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(15,20,25,0.25)',
  },
  defaultPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.3)',
  },
  defaultText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: '#FCD34D',
    letterSpacing: 0.8,
  },
  type: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.4,
    marginTop: spacing.sm,
  },
  label: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.white,
    letterSpacing: -0.4,
  },
  detail: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
  },
  detailCard: {
    letterSpacing: 1.2,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  secure: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  secureText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
  },
  brand: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.6,
  },
});
