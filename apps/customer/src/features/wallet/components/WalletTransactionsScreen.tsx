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
import { useProfileAccount } from '@/features/profile/hooks/useProfileAccount';
import { ProfileWalletPass } from '@/features/profile/components/ProfileWalletPass';
import { listWalletTransactions } from '../lib/wallet.storage';
import {
  formatWalletWhen,
  isWalletCredit,
  walletFilterMatch,
  walletKindSign,
  walletSourceMeta,
} from '../lib/wallet.utils';
import type { WalletTransaction } from '../types/wallet.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

type TxnFilter = 'all' | 'credit' | 'debit';

const FILTERS: { id: TxnFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'credit', label: 'Credits' },
  { id: 'debit', label: 'Debits' },
];

export function WalletTransactionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { account, refresh } = useProfileAccount();
  const [rows, setRows] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<TxnFilter>('all');

  const load = useCallback(async () => {
    const [txns] = await Promise.all([listWalletTransactions(), refresh()]);
    setRows(txns);
    setLoading(false);
  }, [refresh]);

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

  const filtered = useMemo(() => rows.filter((r) => walletFilterMatch(r, filter)), [rows, filter]);

  const credits = rows.filter((r) => isWalletCredit(r.kind)).reduce((s, r) => s + r.amount, 0);
  const debits = rows.filter((r) => r.kind === 'debit').reduce((s, r) => s + r.amount, 0);
  const balance = account?.walletBalance ?? 0;

  const openRef = (txn: WalletTransaction) => {
    Haptics.selectionAsync();
    if (txn.source === 'booking' && txn.refId) {
      router.push(`/booking/${txn.refId}` as Href);
      return;
    }
    if (txn.source === 'plus') {
      router.push('/plus/manage' as Href);
      return;
    }
    if (txn.source === 'topup') {
      router.push('/(tabs)/profile' as Href);
    }
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
            <Text style={styles.headerEyebrow}>WALLET</Text>
            <Text style={styles.headerTitle}>Transactions</Text>
          </View>
          <Pressable
            style={styles.topUpBtn}
            onPress={() => router.push('/(tabs)/profile' as Href)}
            accessibilityRole="button"
            accessibilityLabel="Top up wallet"
          >
            <Ionicons name="add" size={20} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.passWrap}>
          <ProfileWalletPass balance={balance} compact />
        </View>

        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>{formatInr(credits)}</Text>
            <Text style={styles.headerStatLbl}>Credited</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>{formatInr(debits)}</Text>
            <Text style={styles.headerStatLbl}>Spent</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>{rows.length}</Text>
            <Text style={styles.headerStatLbl}>Entries</Text>
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
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons name="wallet-outline" size={28} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptySub}>
                Top up your wallet or pay with wallet on bookings — activity shows up here.
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {filtered.map((txn) => {
                const meta = walletSourceMeta(txn.source);
                const credit = isWalletCredit(txn.kind);
                return (
                  <Pressable
                    key={txn.id}
                    style={styles.card}
                    onPress={() => openRef(txn)}
                    accessibilityRole="button"
                  >
                    <View style={[styles.topicIcon, { backgroundColor: meta.tone }]}>
                      <Ionicons name={meta.icon} size={18} color={colors.primaryDark} />
                    </View>

                    <View style={styles.cardCopy}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {txn.title}
                      </Text>
                      <Text style={styles.cardSub} numberOfLines={1}>
                        {txn.subtitle ?? meta.label}
                      </Text>
                      <Text style={styles.cardMeta}>
                        {meta.label} · {formatWalletWhen(txn.createdAt)}
                      </Text>
                    </View>

                    <View style={styles.amtCol}>
                      <Text style={[styles.amt, credit ? styles.amtCredit : styles.amtDebit]}>
                        {walletKindSign(txn.kind)}
                        {formatInr(txn.amount)}
                      </Text>
                      <Text style={styles.kind}>{txn.kind}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.lg,
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
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.72)',
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.white,
    letterSpacing: -0.4,
  },
  topUpBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  passWrap: {
    marginBottom: spacing.md,
  },
  headerStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingVertical: spacing.md,
  },
  headerStat: { flex: 1, alignItems: 'center', gap: 2 },
  headerStatVal: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    color: colors.white,
  },
  headerStatLbl: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.72)',
  },
  headerDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginVertical: 4,
  },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    marginTop: -8,
    paddingTop: spacing.md,
    minHeight: 320,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.bgMuted,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  filters: {
    paddingHorizontal: layout.pad,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSubtle,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  filterPillActive: {
    backgroundColor: colors.primaryLight,
    borderColor: 'rgba(11,110,103,0.2)',
  },
  filterText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.muted,
  },
  filterTextActive: {
    color: colors.primaryDark,
  },
  loader: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  empty: {
    marginHorizontal: layout.pad,
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.ink,
  },
  emptySub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 280,
  },
  list: {
    marginHorizontal: layout.pad,
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  topicIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCopy: { flex: 1, minWidth: 0, gap: 2 },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  cardSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  cardMeta: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.mutedLight,
    marginTop: 2,
  },
  amtCol: { alignItems: 'flex-end', gap: 2 },
  amt: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
  },
  amtCredit: { color: '#059669' },
  amtDebit: { color: colors.ink },
  kind: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: colors.mutedLight,
    textTransform: 'uppercase',
  },
});
