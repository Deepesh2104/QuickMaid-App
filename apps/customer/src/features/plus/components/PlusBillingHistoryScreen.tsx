import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatInr } from '@/features/checkout/lib/checkout.utils';
import {
  formatPaymentDateShort,
  PAYMENT_STATUS_THEME,
  paymentTitle,
} from '@/features/payment/lib/payment.utils';
import type { PaymentRecord } from '@/features/payment/types/payment.types';
import { getProfileAccount } from '@/features/profile/lib/profile.storage';
import type { ProfileAccountData } from '@/features/profile/types/profile.types';

import { listPlusBillingRecords, plusBillingTotal } from '../lib/plus.billing';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

type BillFilter = 'all' | 'paid' | 'refunded';

const FILTERS: { id: BillFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'paid', label: 'Paid' },
  { id: 'refunded', label: 'Refunded' },
];

function matchesFilter(record: PaymentRecord, filter: BillFilter) {
  if (filter === 'all') return true;
  if (filter === 'refunded') return record.status === 'refunded';
  return record.status === 'captured' || record.status === 'authorized';
}

export function PlusBillingHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [rows, setRows] = useState<PaymentRecord[]>([]);
  const [account, setAccount] = useState<ProfileAccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<BillFilter>('all');

  const load = useCallback(async () => {
    const [billing, acc] = await Promise.all([listPlusBillingRecords(), getProfileAccount()]);
    setRows(billing);
    setAccount(acc);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const filtered = useMemo(() => rows.filter((r) => matchesFilter(r, filter)), [rows, filter]);
  const totalPaid = plusBillingTotal(rows);
  const paidCount = rows.filter((r) => r.status === 'captured' || r.status === 'authorized').length;

  const openRecord = (id: string) => {
    Haptics.selectionAsync();
    router.push(`/payments/${id}` as Href);
  };

  if (!loading && account && !account.isPlusMember) {
    return (
      <View style={[styles.emptyRoot, { paddingTop: insets.top + spacing.xl }]}>
        <Pressable style={styles.backFab} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <View style={styles.emptyIcon}>
          <Ionicons name="diamond-outline" size={40} color={colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>No membership billing</Text>
        <Text style={styles.emptySub}>Subscribe to QuickMaid Plus to see renewal charges here.</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.replace('/plus/subscribe')}>
          <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.emptyBtnGrad}>
            <Text style={styles.emptyBtnText}>Explore Plus plans</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#010F0E', '#0F1419', '#1A2332', '#2D1B4E']}
        locations={[0, 0.35, 0.7, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerGlow} />
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>QUICKMAID PLUS</Text>
            <Text style={styles.headerTitle}>Billing history</Text>
          </View>
          <Pressable
            style={styles.manageBtn}
            onPress={() => router.push('/plus/manage' as Href)}
            accessibilityRole="button"
            accessibilityLabel="Manage membership"
          >
            <Ionicons name="settings-outline" size={20} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          <LinearGradient
            colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.04)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.summaryTop}>
            <View style={styles.diamondWrap}>
              <Ionicons name="diamond" size={22} color="#FCD34D" />
            </View>
            <View style={styles.summaryCopy}>
              <Text style={styles.summaryLabel}>Total membership spend</Text>
              <Text style={styles.summaryAmt}>{formatInr(totalPaid)}</Text>
            </View>
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatVal}>{paidCount}</Text>
              <Text style={styles.summaryStatLbl}>Charges</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatVal}>{account?.plusRenewDate ?? '—'}</Text>
              <Text style={styles.summaryStatLbl}>Next renewal</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatVal}>{account?.plusVisitsLeft ?? 0}</Text>
              <Text style={styles.summaryStatLbl}>Visits left</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <Pressable
                  key={f.id}
                  style={[styles.filterPill, active && styles.filterPillActive]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setFilter(f.id);
                  }}
                >
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>{f.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : filtered.length === 0 ? (
            <View style={styles.emptyList}>
              <View style={styles.emptyListIcon}>
                <Ionicons name="receipt-outline" size={28} color="#B54708" />
              </View>
              <Text style={styles.emptyListTitle}>No charges in this filter</Text>
              <Text style={styles.emptyListSub}>
                Plus renewals and subscription payments appear here after each billing cycle.
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {filtered.map((record) => {
                const theme = PAYMENT_STATUS_THEME[record.status];
                const walletNote =
                  record.walletUsed > 0 ? ` · Wallet ${formatInr(record.walletUsed)}` : '';
                return (
                  <Pressable
                    key={record.id}
                    style={styles.card}
                    onPress={() => openRecord(record.id)}
                    accessibilityRole="button"
                  >
                    <View style={styles.cardIcon}>
                      <Ionicons name="diamond" size={16} color="#B54708" />
                    </View>
                    <View style={styles.cardCopy}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {paymentTitle(record)}
                      </Text>
                      <Text style={styles.cardSub} numberOfLines={1}>
                        {record.methodLabel}
                        {walletNote}
                      </Text>
                      <Text style={styles.cardMeta}>
                        {formatPaymentDateShort(record.createdAt)}
                        {record.bookingRef ? ` · ${record.bookingRef}` : ''}
                      </Text>
                    </View>
                    <View style={styles.cardRight}>
                      <Text style={styles.cardAmt}>{formatInr(record.amount + record.walletUsed)}</Text>
                      <View style={[styles.statusPill, { backgroundColor: theme.tone }]}>
                        <Ionicons name={theme.icon} size={10} color={theme.ink} />
                        <Text style={[styles.statusText, { color: theme.ink }]}>{theme.label}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color={colors.mutedLight} />
                  </Pressable>
                );
              })}
            </View>
          )}

          <View style={styles.trustCard}>
            <Ionicons name="information-circle-outline" size={20} color="#93370D" />
            <Text style={styles.trustText}>
              Tap any charge for full receipt, payment ID and download options. Refunds may take 5–7
              working days on UPI/card.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  header: {
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.lg,
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(252,211,77,0.1)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.65)',
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.white,
    letterSpacing: -0.4,
  },
  manageBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  diamondWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(252,211,77,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCopy: { flex: 1, gap: 2 },
  summaryLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  summaryAmt: {
    fontFamily: fonts.extraBold,
    fontSize: 28,
    color: colors.white,
    letterSpacing: -0.6,
  },
  summaryStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
  },
  summaryStat: { flex: 1, alignItems: 'center', gap: 2 },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  summaryStatVal: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.white,
    textAlign: 'center',
  },
  summaryStatLbl: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  sheet: {
    marginTop: -spacing.lg,
    backgroundColor: '#F4F6F8',
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingTop: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginBottom: spacing.md,
  },
  filters: {
    paddingHorizontal: layout.pad,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  filterPillActive: {
    backgroundColor: '#FFFAEB',
    borderColor: 'rgba(181,71,8,0.2)',
  },
  filterText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.muted,
  },
  filterTextActive: {
    color: '#93370D',
  },
  loader: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  list: {
    marginHorizontal: layout.pad,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: '#FFFAEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCopy: { flex: 1, gap: 2, minWidth: 0 },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  cardSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
  cardMeta: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.mutedLight,
    marginTop: 2,
  },
  cardRight: { alignItems: 'flex-end', gap: 4 },
  cardAmt: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  statusText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  emptyList: {
    alignItems: 'center',
    paddingHorizontal: layout.pad,
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  emptyListIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFAEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.ink,
  },
  emptyListSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 19,
  },
  trustCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginHorizontal: layout.pad,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: '#FFFAEB',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(181,71,8,0.12)',
  },
  trustText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#93370D',
    lineHeight: 17,
  },
  emptyRoot: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingHorizontal: layout.pad,
    alignItems: 'center',
  },
  backFab: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.ink,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  emptyBtn: { borderRadius: radius.pill, overflow: 'hidden', width: '100%' },
  emptyBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
  },
  emptyBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
});
