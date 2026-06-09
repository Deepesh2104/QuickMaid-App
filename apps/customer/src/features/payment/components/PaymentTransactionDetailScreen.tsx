import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatInr } from '@/features/checkout/lib/checkout.utils';
import { getAllBookings } from '@/features/checkout/lib/bookings.storage';
import { useOpenBookingDocument } from '@/features/bookings/hooks/useOpenBookingDocument';
import { getPaymentById } from '../lib/payment.storage';
import {
  formatPaymentDate,
  formatPaymentDateShort,
  isPlusCharge,
  PAYMENT_STATUS_THEME,
  paymentTitle,
} from '../lib/payment.utils';
import type { PaymentRecord } from '../types/payment.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

function DetailRow({
  label,
  value,
  mono,
  onCopy,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onCopy?: () => void;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <View style={styles.detailValueWrap}>
        <Text style={[styles.detailValue, mono && styles.detailMono]} numberOfLines={2}>
          {value}
        </Text>
        {onCopy ? (
          <Pressable style={styles.copyBtn} onPress={onCopy} accessibilityLabel={`Copy ${label}`}>
            <Ionicons name="copy-outline" size={14} color={colors.primaryDark} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export function PaymentTransactionDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const openDocument = useOpenBookingDocument();
  const [record, setRecord] = useState<PaymentRecord | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const payment = await getPaymentById(id);
    setRecord(payment ?? null);

    if (payment?.bookingRef && !isPlusCharge(payment)) {
      const bookings = await getAllBookings();
      const match = bookings.find(
        (b) => b.bookingRef === payment.bookingRef || b.id === payment.bookingRef,
      );
      setBookingId(match?.id ?? null);
    } else {
      setBookingId(null);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const copy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const shareReceipt = async () => {
    if (!record) return;
    try {
      await Share.share({
        message: [
          `QuickMaid payment receipt`,
          `${paymentTitle(record)}`,
          `Amount: ${formatInr(record.amount)}`,
          `Status: ${record.status}`,
          `Ref: ${record.paymentId}`,
          record.bookingRef ? `Booking: ${record.bookingRef}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
      });
    } catch {
      // dismissed
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!record) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <Ionicons name="receipt-outline" size={42} color={colors.muted} />
        <Text style={styles.emptyTitle}>Transaction not found</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const status = PAYMENT_STATUS_THEME[record.status];
  const plus = isPlusCharge(record);

  const onPrimary = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (plus) {
      router.push('/plus/manage' as Href);
      return;
    }
    if (bookingId) {
      router.push(`/booking/${bookingId}` as Href);
      return;
    }
    void shareReceipt();
  };

  const primaryLabel = plus
    ? 'View Plus membership'
    : bookingId
      ? 'View booking'
      : 'Share receipt';

  const onSecondary = () => {
    if (!bookingId) return;
    Haptics.selectionAsync();
    openDocument(bookingId, 'receipt');
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#010F0E', '#084F4A', '#0B6E67', '#12A598']}
        locations={[0, 0.3, 0.65, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>TRANSACTION</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {paymentTitle(record)}
            </Text>
          </View>
          <Pressable style={styles.backBtn} onPress={() => void shareReceipt()} accessibilityLabel="Share receipt">
            <Ionicons name="share-outline" size={20} color={colors.white} />
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 130 }}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <LinearGradient colors={['#FFFFFF', '#F8FDFC']} style={styles.amountCard}>
            <View style={styles.amountTop}>
              <View style={[styles.statusPill, { backgroundColor: status.tone }]}>
                <Ionicons name={status.icon} size={12} color={status.ink} />
                <Text style={[styles.statusText, { color: status.ink }]}>{status.label}</Text>
              </View>
              <Text style={styles.amountDate}>{formatPaymentDateShort(record.createdAt)}</Text>
            </View>
            <Text style={styles.amountVal}>{formatInr(record.amount)}</Text>
            <Text style={styles.amountSub}>
              {record.methodLabel} · {record.gateway.toUpperCase()}
            </Text>
            {record.walletUsed > 0 ? (
              <View style={styles.walletChip}>
                <Ionicons name="wallet-outline" size={12} color={colors.primaryDark} />
                <Text style={styles.walletChipText}>
                  Includes {formatInr(record.walletUsed)} from wallet
                </Text>
              </View>
            ) : null}
          </LinearGradient>

          <View style={styles.detailCard}>
            <Text style={styles.detailEyebrow}>PAYMENT DETAILS</Text>
            <DetailRow label="Payment ID" value={record.paymentId} mono onCopy={() => void copy(record.paymentId)} />
            <DetailRow label="Order ID" value={record.orderId} mono onCopy={() => void copy(record.orderId)} />
            {record.bookingRef ? (
              <DetailRow
                label={plus ? 'Subscription' : 'Booking ref'}
                value={record.bookingRef}
                mono
                onCopy={() => void copy(record.bookingRef!)}
              />
            ) : null}
            <DetailRow label="Method" value={record.methodLabel} />
            <DetailRow label="Mode" value={record.mode.replace(/_/g, ' ')} />
            <DetailRow label="Date & time" value={formatPaymentDate(record.createdAt)} />
            <DetailRow label="Gateway" value="Razorpay · PCI-DSS secure" />
          </View>

          <View style={styles.trustCard}>
            <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
            <Text style={styles.trustText}>
              Payments are processed by Razorpay. QuickMaid never stores your full card or UPI PIN.
            </Text>
          </View>

          {record.status === 'refunded' ? (
            <View style={styles.refundCard}>
              <Ionicons name="refresh" size={18} color="#6941C6" />
              <View style={styles.refundCopy}>
                <Text style={styles.refundTitle}>Refund processed</Text>
                <Text style={styles.refundSub}>
                  Amount returns to your original payment method in 5–7 business days.
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <Pressable style={styles.primaryBtn} onPress={onPrimary}>
          <LinearGradient
            colors={['#084F4A', '#0B6E67', '#12A598']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryGrad}
          >
            <Text style={styles.primaryText}>{primaryLabel}</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </LinearGradient>
        </Pressable>
        {bookingId ? (
          <Pressable style={styles.secondaryBtn} onPress={onSecondary}>
            <Ionicons name="receipt-outline" size={16} color={colors.primaryDark} />
            <Text style={styles.secondaryText}>View receipt</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F8' },

  header: { paddingBottom: spacing.lg },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.pad,
    gap: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1, gap: 2 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: -0.3,
  },

  sheet: {
    marginTop: -spacing.md,
    backgroundColor: '#F4F6F8',
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginBottom: spacing.xs,
  },

  amountCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.12)',
    overflow: 'hidden',
  },
  amountTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  statusText: { fontFamily: fonts.bold, fontSize: 11 },
  amountDate: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  amountVal: {
    fontFamily: fonts.extraBold,
    fontSize: 40,
    color: colors.primaryDark,
    letterSpacing: -1.5,
  },
  amountSub: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkSecondary },
  walletChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginTop: 4,
  },
  walletChipText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.primaryDark },

  detailCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  detailEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1.1,
  },
  detailRow: {
    gap: 4,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  detailLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  detailValueWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  detailValue: { flex: 1, fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink },
  detailMono: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkSecondary },
  copyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  trustCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  trustText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
  },

  refundCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: '#F4F3FF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(105,65,198,0.15)',
  },
  refundCopy: { flex: 1, gap: 4 },
  refundTitle: { fontFamily: fonts.bold, fontSize: 14, color: '#53389E' },
  refundSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 17 },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    backgroundColor: 'rgba(244,246,248,0.96)',
  },
  primaryBtn: { borderRadius: radius.pill, overflow: 'hidden' },
  primaryGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
  },
  primaryText: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  secondaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryDark },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: layout.pad,
    backgroundColor: '#F4F6F8',
  },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  emptyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  emptyBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
});
