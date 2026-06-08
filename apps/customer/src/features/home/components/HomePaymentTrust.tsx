import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { premium } from '../constants/home.premium';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const METHODS = [
  { icon: 'phone-portrait-outline' as const, label: 'UPI', tone: '#E6F4F2' },
  { icon: 'card-outline' as const, label: 'Cards', tone: '#EEF6FF' },
  { icon: 'wallet-outline' as const, label: 'Pay later', tone: '#FFF8EE' },
  { icon: 'shield-checkmark-outline' as const, label: 'Secure', tone: '#ECFDF3' },
];

export function HomePaymentTrust() {
  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#FAFBFC', '#FFFFFF']} style={styles.bg} />
      <Text style={styles.title}>Safe & flexible payments</Text>
      <View style={styles.row}>
        {METHODS.map((m) => (
          <View key={m.label} style={styles.item}>
            <View style={[styles.icon, { backgroundColor: m.tone }]}>
              <Ionicons name={m.icon} size={17} color={colors.primaryDark} />
            </View>
            <Text style={styles.label}>{m.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.divider} />
      <Text style={styles.note}>Aadhaar-verified partners · Insured visits · No hidden fees</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: layout.pad,
    marginBottom: 0,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    ...premium.surface,
  },
  bg: { ...StyleSheet.absoluteFill },
  title: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    alignItems: 'center',
    gap: 7,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.05)',
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.muted,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },
  note: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.mutedLight,
    textAlign: 'center',
    lineHeight: 16,
  },
});
