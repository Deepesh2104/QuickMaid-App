import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PAYMENT_GATEWAY } from '../constants/gateway';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export function PaymentGatewayBadge() {
  return (
    <View style={styles.wrap}>
      <Ionicons name="shield-checkmark" size={14} color="#2563EB" />
      <Text style={styles.text}>
        Payments via <Text style={styles.brand}>{PAYMENT_GATEWAY.name}</Text> · Secure checkout
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#EFF6FF',
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.15)',
  },
  text: { flex: 1, fontFamily: fonts.medium, fontSize: 12, color: '#1E40AF' },
  brand: { fontFamily: fonts.bold },
});
