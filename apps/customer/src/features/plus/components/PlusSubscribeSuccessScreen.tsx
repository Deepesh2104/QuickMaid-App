import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatInr } from '@/features/checkout/lib/checkout.utils';
import { getPlusSubscription, plusSubscribeShareMessage } from '../lib/plus.subscribe';
import type { PlusSubscriptionRecord } from '../types/plus.subscription.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function PlusSubscribeSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [record, setRecord] = useState<PlusSubscriptionRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    void getPlusSubscription().then((r) => {
      setRecord(r);
      setLoading(false);
    });
  }, []);

  const share = async () => {
    if (!record) return;
    try {
      await Share.share({ message: plusSubscribeShareMessage(record) });
    } catch {
      // dismissed
    }
  };

  if (loading) {
    return (
      <View style={[styles.loader, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!record) {
    return (
      <View style={[styles.loader, { paddingTop: insets.top }]}>
        <Text style={styles.empty}>Subscription details not found</Text>
        <Pressable onPress={() => router.replace('/(tabs)/plans' as Href)}>
          <Text style={styles.link}>Back to plans</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.hero}>
          <LinearGradient colors={['#0F1419', '#1A2332']} style={styles.iconGrad}>
            <Ionicons name="diamond" size={40} color="#FCD34D" />
          </LinearGradient>
          <Text style={styles.title}>Welcome to {record.planName}!</Text>
          <Text style={styles.sub}>Membership active · Savings unlocked on every visit</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Paid today</Text>
            <Text style={styles.rowValue}>{formatInr(record.amount)}</Text>
          </View>
          {record.walletUsed > 0 ? (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>From wallet</Text>
              <Text style={styles.rowValue}>-{formatInr(record.walletUsed)}</Text>
            </View>
          ) : null}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Visits included</Text>
            <Text style={styles.rowValue}>{record.visitsLeft}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Renews on</Text>
            <Text style={styles.rowValue}>{record.renewDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Payment</Text>
            <Text style={styles.rowValueSmall}>{record.paymentLabel}</Text>
          </View>
        </View>

        <View style={styles.perks}>
          {[
            record.isPlusMember ? '10% off every booking' : 'Member pricing on visits',
            'Priority slots & free reschedule',
            'Same verified pro when available',
          ].map((p) => (
            <View key={p} style={styles.perk}>
              <Ionicons name="checkmark-circle" size={16} color="#027A48" />
              <Text style={styles.perkText}>{p}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.primary} onPress={() => router.replace('/(tabs)' as Href)}>
          <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
          <Text style={styles.primaryText}>Book your first visit</Text>
          <Ionicons name="sparkles" size={18} color={colors.white} />
        </Pressable>

        <Pressable style={styles.ghost} onPress={() => void share()}>
          <Text style={styles.ghostText}>Share confirmation</Text>
        </Pressable>

        <Pressable style={styles.ghost} onPress={() => router.replace('/(tabs)/plans' as Href)}>
          <Text style={styles.ghostText}>View membership</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  empty: { fontFamily: fonts.medium, fontSize: 14, color: colors.muted },
  link: { fontFamily: fonts.bold, fontSize: 14, color: colors.primary },
  scroll: { padding: layout.pad, gap: spacing.lg },
  hero: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xl },
  iconGrad: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 24,
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  sub: { fontFamily: fonts.medium, fontSize: 14, color: colors.muted, textAlign: 'center' },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  rowLabel: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  rowValue: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  rowValueSmall: { flex: 1, fontFamily: fonts.semiBold, fontSize: 11, color: colors.ink, textAlign: 'right' },
  perks: { gap: spacing.sm },
  perk: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  perkText: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 16,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  primaryText: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
  ghost: { alignItems: 'center', paddingVertical: spacing.sm },
  ghostText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.primary },
});
