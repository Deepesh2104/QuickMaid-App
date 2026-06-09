import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { buildCatalogueHref } from '@/features/home/lib/home.catalogue';
import {
  listCouponWallet,
  redeemCouponCode,
  setPendingCheckoutCoupon,
} from '../lib/coupon.storage';
import {
  couponDiscountLabel,
  couponFilterMatch,
  couponStatusTheme,
  formatCouponExpiry,
} from '../lib/coupon.utils';
import type { SavedCoupon } from '../types/coupon.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

type CouponFilter = 'all' | 'active' | 'used';

const FILTERS: { id: CouponFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'used', label: 'Used' },
];

export function CouponWalletScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [coupons, setCoupons] = useState<SavedCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<CouponFilter>('active');
  const [redeemCode, setRedeemCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  const load = useCallback(async () => {
    const data = await listCouponWallet();
    setCoupons(data);
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

  const filtered = useMemo(
    () => coupons.filter((c) => couponFilterMatch(c, filter)),
    [coupons, filter],
  );

  const activeCount = coupons.filter((c) => c.status === 'active').length;
  const usedCount = coupons.filter((c) => c.status === 'used').length;

  const copyCode = async (code: string) => {
    await Clipboard.setStringAsync(code);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied', `${code} copied to clipboard.`);
  };

  const useCoupon = async (coupon: SavedCoupon) => {
    if (coupon.status !== 'active') return;
    Haptics.selectionAsync();
    await setPendingCheckoutCoupon(coupon.code);
    router.push(buildCatalogueHref() as Href);
    Alert.alert('Coupon ready', `${coupon.code} will apply at checkout payment.`);
  };

  const redeem = async () => {
    const code = redeemCode.trim();
    if (!code) return;
    setRedeeming(true);
    const result = await redeemCouponCode(code);
    setRedeeming(false);
    if (!result.ok) {
      Alert.alert('Could not add coupon', result.error);
      return;
    }
    setRedeemCode('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await load();
    Alert.alert('Added to wallet', `${result.coupon.code} is ready to use.`);
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#451A03', '#92400E', '#B45309', '#F59E0B']}
        locations={[0, 0.35, 0.7, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>SAVINGS</Text>
            <Text style={styles.headerTitle}>Coupon wallet</Text>
          </View>
          <View style={styles.ticketIcon}>
            <Ionicons name="pricetag" size={20} color="#FCD34D" />
          </View>
        </View>

        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>{activeCount}</Text>
            <Text style={styles.headerStatLbl}>Active</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>{usedCount}</Text>
            <Text style={styles.headerStatLbl}>Used</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>{coupons.length}</Text>
            <Text style={styles.headerStatLbl}>Total</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#B45309" />
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.redeemBox}>
            <Text style={styles.redeemLabel}>Have a code?</Text>
            <View style={styles.redeemRow}>
              <TextInput
                style={styles.redeemInput}
                value={redeemCode}
                onChangeText={setRedeemCode}
                placeholder="Enter coupon code"
                placeholderTextColor={colors.mutedLight}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <Pressable
                style={[styles.redeemBtn, redeeming && styles.redeemBtnDisabled]}
                onPress={() => void redeem()}
                disabled={redeeming}
              >
                <Text style={styles.redeemBtnText}>{redeeming ? '…' : 'Add'}</Text>
              </Pressable>
            </View>
          </View>

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
              <ActivityIndicator size="large" color="#B45309" />
            </View>
          ) : filtered.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons name="pricetag-outline" size={28} color="#B45309" />
              </View>
              <Text style={styles.emptyTitle}>No coupons here</Text>
              <Text style={styles.emptySub}>
                Add a code above or check offers on the home screen.
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {filtered.map((coupon) => {
                const status = couponStatusTheme(coupon.status);
                const disabled = coupon.status !== 'active';
                return (
                  <View key={coupon.code} style={[styles.ticket, disabled && styles.ticketDisabled]}>
                    <View style={styles.ticketLeft}>
                      <Text style={styles.ticketSave}>
                        {couponDiscountLabel(coupon.discountType, coupon.discountValue)}
                      </Text>
                      <Text style={styles.ticketCode}>{coupon.code}</Text>
                      {coupon.badge ? (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{coupon.badge}</Text>
                        </View>
                      ) : null}
                    </View>

                    <View style={styles.ticketDivider}>
                      <View style={styles.ticketNotchTop} />
                      <View style={styles.ticketDash} />
                      <View style={styles.ticketNotchBottom} />
                    </View>

                    <View style={styles.ticketRight}>
                      <Text style={styles.ticketTitle} numberOfLines={2}>
                        {coupon.title}
                      </Text>
                      <Text style={styles.ticketSub} numberOfLines={2}>
                        {coupon.description}
                      </Text>
                      <View style={styles.ticketMeta}>
                        <View style={[styles.statusBadge, { backgroundColor: status.tone }]}>
                          <Text style={[styles.statusText, { color: status.ink }]}>{status.label}</Text>
                        </View>
                        <Text style={styles.expiry}>{formatCouponExpiry(coupon.expiresAt, coupon.status)}</Text>
                      </View>

                      <View style={styles.actions}>
                        <Pressable
                          style={styles.actionGhost}
                          onPress={() => void copyCode(coupon.code)}
                        >
                          <Ionicons name="copy-outline" size={14} color={colors.primaryDark} />
                          <Text style={styles.actionGhostText}>Copy</Text>
                        </Pressable>
                        {!disabled ? (
                          <Pressable style={styles.actionPrimary} onPress={() => void useCoupon(coupon)}>
                            <Text style={styles.actionPrimaryText}>Use now</Text>
                            <Ionicons name="arrow-forward" size={14} color={colors.white} />
                          </Pressable>
                        ) : null}
                      </View>
                    </View>
                  </View>
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
    marginBottom: spacing.lg,
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
    color: 'rgba(255,255,255,0.78)',
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.white,
    letterSpacing: -0.4,
  },
  ticketIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 15,
    color: colors.white,
  },
  headerStatLbl: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.78)',
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
  redeemBox: {
    marginHorizontal: layout.pad,
    marginBottom: spacing.lg,
    backgroundColor: '#FFFBEB',
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  redeemLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: '#92400E',
  },
  redeemRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  redeemInput: {
    flex: 1,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.ink,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.15)',
  },
  redeemBtn: {
    backgroundColor: '#B45309',
    borderRadius: radius.lg,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redeemBtnDisabled: { opacity: 0.6 },
  redeemBtnText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
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
    backgroundColor: '#FFFBEB',
    borderColor: 'rgba(245,158,11,0.25)',
  },
  filterText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.muted,
  },
  filterTextActive: {
    color: '#92400E',
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
    backgroundColor: '#FFFBEB',
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
  ticket: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(245,158,11,0.18)',
  },
  ticketDisabled: { opacity: 0.72 },
  ticketLeft: {
    width: 108,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    gap: 4,
  },
  ticketSave: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: '#B45309',
    textAlign: 'center',
  },
  ticketCode: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: '#92400E',
    letterSpacing: 0.6,
  },
  badge: {
    marginTop: 4,
    backgroundColor: '#FEF3C7',
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: '#92400E',
    textTransform: 'uppercase',
  },
  ticketDivider: {
    width: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  ticketNotchTop: {
    position: 'absolute',
    top: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.bg,
  },
  ticketNotchBottom: {
    position: 'absolute',
    bottom: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.bg,
  },
  ticketDash: {
    width: 1,
    flex: 1,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(245,158,11,0.35)',
  },
  ticketRight: {
    flex: 1,
    padding: spacing.lg,
    gap: 4,
  },
  ticketTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  ticketSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 15,
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  statusBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontFamily: fonts.bold,
    fontSize: 9,
  },
  expiry: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.mutedLight,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
  },
  actionGhostText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  actionPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#B45309',
    borderRadius: radius.pill,
    paddingVertical: 9,
  },
  actionPrimaryText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
  },
});
