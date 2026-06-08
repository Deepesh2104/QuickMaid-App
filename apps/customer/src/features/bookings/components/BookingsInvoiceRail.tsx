import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { DemoBooking } from '@/constants/demo';
import { useOpenBookingDocument } from '../hooks/useOpenBookingDocument';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface BookingsInvoiceRailProps {
  bookings: DemoBooking[];
}

export function BookingsInvoiceRail({ bookings }: BookingsInvoiceRailProps) {
  const openDocument = useOpenBookingDocument();
  const paid = bookings.filter((b) => b.status === 'completed');
  if (paid.length === 0) return null;

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Payments"
        title="Invoices & receipts"
        subtitle="Download anytime"
        icon="receipt-outline"
        compact
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {paid.map((b) => (
          <Pressable
            key={b.id}
            style={styles.card}
            onPress={() => openDocument(b.id, 'invoice')}
            accessibilityRole="button"
            accessibilityLabel={`Invoice ${b.bookingRef}`}
          >
            <LinearGradient colors={['#FAFBFC', '#FFFFFF']} style={StyleSheet.absoluteFill} />
            <View style={styles.cardTop}>
              <View style={styles.paidBadge}>
                <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                <Text style={styles.paidText}>Paid</Text>
              </View>
              <Ionicons name="download-outline" size={16} color={colors.muted} />
            </View>
            <Text style={styles.ref}>{b.bookingRef ?? b.id}</Text>
            <Text style={styles.service} numberOfLines={1}>{b.service}</Text>
            <Text style={styles.date}>{b.date}</Text>
            <View style={styles.amountRow}>
              <Text style={styles.amount}>{b.price}</Text>
              <Text style={styles.method}>UPI</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const CARD_W = 156;

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  row: {
    paddingHorizontal: layout.pad,
    gap: spacing.sm,
    paddingRight: layout.pad + spacing.sm,
  },
  card: {
    width: CARD_W,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: 4,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  paidText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.success,
    textTransform: 'uppercase',
  },
  ref: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.3,
  },
  service: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
  },
  date: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  amount: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.ink,
  },
  method: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.muted,
  },
});
