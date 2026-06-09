import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ListPagination } from '@/components/ui/ListPagination';
import { PAGE_SIZE_PAYMENTS } from '@/constants/pagination';
import { usePagination } from '@/hooks/usePagination';
import { getPaymentHistory } from '@/features/payment/lib/payment.storage';
import type { PaymentRecord } from '@/features/payment/types/payment.types';
import { formatInr } from '@/features/checkout/lib/checkout.utils';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function ProfilePaymentHistorySection() {
  const router = useRouter();
  const [records, setRecords] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    getPaymentHistory().then(setRecords);
  }, []);

  const { page, setPage, totalPages, start, end, slice, total } = usePagination(
    records,
    PAGE_SIZE_PAYMENTS,
    'payments',
  );

  if (!records.length) return null;

  return (
    <View style={styles.block}>
      <HomeSectionHeader eyebrow="Transactions" title="Payment history" subtitle="Via Razorpay" icon="receipt-outline" compact />

      <View style={styles.list}>
        {slice.map((r, i) => (
          <Pressable
            key={r.id}
            style={[styles.row, i < slice.length - 1 && styles.rowBorder]}
            onPress={() => {
              Haptics.selectionAsync();
              router.push(`/payments/${r.id}` as Href);
            }}
            accessibilityRole="button"
          >
            <View style={[styles.icon, r.status === 'captured' ? styles.iconOk : styles.iconPending]}>
              <Ionicons name={r.status === 'captured' ? 'checkmark' : 'time'} size={14} color={r.status === 'captured' ? '#059669' : '#B45309'} />
            </View>
            <View style={styles.copy}>
              <Text style={styles.label}>{r.methodLabel}</Text>
              <Text style={styles.meta}>{r.bookingRef ?? r.orderId} · {r.gateway}</Text>
            </View>
            <View style={styles.amtCol}>
              <Text style={styles.amt}>{formatInr(r.amount)}</Text>
              <Text style={styles.status}>{r.status}</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.mutedLight} />
          </Pressable>
        ))}
      </View>

      <View style={styles.pager}>
        <ListPagination
          page={page}
          totalPages={totalPages}
          start={start}
          end={end}
          total={total}
          onPageChange={setPage}
          label="Payments"
          itemLabel="transactions"
          compact
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  pager: { marginHorizontal: layout.pad, marginTop: spacing.sm },
  list: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, gap: spacing.md },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
  icon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  iconOk: { backgroundColor: '#ECFDF3' },
  iconPending: { backgroundColor: '#FFFBEB' },
  copy: { flex: 1, gap: 2 },
  label: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  meta: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
  amtCol: { alignItems: 'flex-end', gap: 2 },
  amt: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  status: { fontFamily: fonts.medium, fontSize: 9, color: colors.muted, textTransform: 'uppercase' },
});
