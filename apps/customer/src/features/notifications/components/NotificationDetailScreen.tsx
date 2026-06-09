import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNotificationNavigation } from '../hooks/useNotificationNavigation';
import { getNotificationById, markNotificationRead } from '../lib/notifications.storage';
import {
  CATEGORY_META,
  formatNotificationDate,
  formatNotificationTime,
  getActionLabel,
  hasDeepLink,
} from '../lib/notifications.utils';
import type { AppNotification } from '../types/notification.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function NotificationDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigateAction = useNotificationNavigation();
  const [item, setItem] = useState<AppNotification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      const notification = await getNotificationById(id);
      if (!active) return;

      if (notification && !notification.read) {
        await markNotificationRead(notification.id);
        setItem({ ...notification, read: true });
      } else {
        setItem(notification);
      }
      setLoading(false);
    };

    void load();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.loader}>
        <Ionicons name="alert-circle-outline" size={42} color={colors.muted} />
        <Text style={styles.missingTitle}>Notification not found</Text>
        <Pressable style={styles.missingBtn} onPress={() => router.back()}>
          <Text style={styles.missingBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const meta = CATEGORY_META[item.category];
  const deepLink = hasDeepLink(item.action);
  const ctaLabel = getActionLabel(item.action);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#010F0E', '#084F4A', '#0B6E67', '#12A598']}
        locations={[0, 0.35, 0.7, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerGlow} />
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>ALERT DETAIL</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 120 }]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.98)', 'rgba(250,253,252,0.96)']}
          style={styles.heroCard}
        >
          <View style={styles.heroTop}>
            <LinearGradient colors={[item.tone, '#FFFFFF']} style={styles.iconRing}>
              <View style={[styles.iconCore, { backgroundColor: item.tone }]}>
                <Ionicons name={item.icon} size={28} color={item.ink} />
              </View>
            </LinearGradient>
            <View style={[styles.categoryPill, { borderColor: `${meta.accent}33` }]}>
              <Ionicons name={meta.icon} size={11} color={meta.accent} />
              <Text style={[styles.categoryText, { color: meta.accent }]}>{meta.label}</Text>
            </View>
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.body}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="time-outline" size={13} color={colors.muted} />
              <Text style={styles.metaText}>{formatNotificationTime(item.createdAt)}</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="calendar-outline" size={13} color={colors.muted} />
              <Text style={styles.metaText}>{formatNotificationDate(item.createdAt)}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.detailCard}>
          <Text style={styles.detailEyebrow}>FULL MESSAGE</Text>
          <Text style={styles.detailBody}>{item.detail ?? item.body}</Text>
        </View>

        <View style={styles.trustCard}>
          <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
          <Text style={styles.trustText}>
            QuickMaid alerts are verified and secure. Never share your OTP outside the app.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        {deepLink ? (
          <Pressable
            style={styles.primaryBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigateAction(item.action);
            }}
          >
            <LinearGradient
              colors={['#084F4A', '#0B6E67', '#12A598']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryGrad}
            >
              <Text style={styles.primaryText}>{ctaLabel}</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            </LinearGradient>
          </Pressable>
        ) : null}
        <Pressable
          style={[styles.secondaryBtn, !deepLink && styles.secondaryBtnSolo]}
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
        >
          <Text style={[styles.secondaryText, !deepLink && styles.secondaryTextSolo]}>
            {deepLink ? 'Back to inbox' : ctaLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: '#F4F6F8',
    padding: layout.pad,
  },
  missingTitle: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
  missingBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  missingBtnText: { fontFamily: fonts.bold, fontSize: 13, color: colors.white },
  header: {
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.xl,
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    right: -24,
    top: -10,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(110,231,183,0.2)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  headerCopy: { flex: 1, gap: 2 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(252,211,77,0.9)',
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.white,
    letterSpacing: -0.3,
  },
  headerSpacer: { width: 42 },
  body: {
    paddingHorizontal: layout.pad,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  heroCard: {
    borderRadius: radius.xxl,
    padding: spacing.xl,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: 24,
    padding: 3,
  },
  iconCore: {
    flex: 1,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
  },
  categoryText: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 0.3 },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.ink,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.muted,
    lineHeight: 21,
  },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSubtle,
  },
  metaText: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  detailCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  detailEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 1,
  },
  detailBody: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.inkSecondary,
    lineHeight: 22,
  },
  trustCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  trustText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primaryDark,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    gap: spacing.sm,
    backgroundColor: 'rgba(244,246,248,0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,20,25,0.06)',
  },
  primaryBtn: { borderRadius: radius.xl, overflow: 'hidden' },
  primaryGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
  },
  primaryText: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  secondaryBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  secondaryBtnSolo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondaryText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink },
  secondaryTextSolo: { color: colors.white },
});
