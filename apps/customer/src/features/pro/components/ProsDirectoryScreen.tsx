import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MaidProfileDetail } from '@/features/bookings/lib/maid.profile';
import { listMaidProfiles } from '@/features/bookings/lib/maid.profile';
import { useOpenProProfile } from '../hooks/useOpenProProfile';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const SKILL_FILTERS = ['All', 'Deep clean', 'Regular', 'Kitchen', 'Bathroom', 'Sofa'] as const;

function matchesQuery(maid: MaidProfileDetail, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    maid.name.toLowerCase().includes(q) ||
    maid.skills.some((s) => s.toLowerCase().includes(q)) ||
    maid.zones.some((z) => z.toLowerCase().includes(q))
  );
}

function matchesSkill(maid: MaidProfileDetail, filter: (typeof SKILL_FILTERS)[number]) {
  if (filter === 'All') return true;
  return maid.skills.some((s) => s.toLowerCase().includes(filter.toLowerCase()));
}

function ProListCard({ maid, onPress }: { maid: MaidProfileDetail; onPress: () => void }) {
  const topSkill = maid.skills[0] ?? 'Home cleaning';

  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button">
      <LinearGradient colors={['#E6F4F2', '#FFFFFF']} style={styles.cardBg} />
      <View style={styles.avatar}>
        <Text style={styles.initial}>{maid.name.charAt(0)}</Text>
        <View style={styles.verified}>
          <Ionicons name="shield-checkmark" size={9} color={colors.white} />
        </View>
      </View>
      <View style={styles.cardCopy}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {maid.name}
          </Text>
          {maid.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{maid.badge}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.skill} numberOfLines={1}>
          {topSkill}
        </Text>
        <View style={styles.meta}>
          <Ionicons name="star" size={11} color={colors.star} />
          <Text style={styles.rating}>{maid.rating}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.jobs}>{maid.jobs.toLocaleString('en-IN')} visits</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.onTime}>{maid.onTimeRate}% on time</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
    </Pressable>
  );
}

export function ProsDirectoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const openPro = useOpenProProfile();
  const [query, setQuery] = useState('');
  const [skill, setSkill] = useState<(typeof SKILL_FILTERS)[number]>('All');

  const pros = useMemo(() => listMaidProfiles(), []);
  const filtered = useMemo(
    () => pros.filter((m) => matchesQuery(m, query) && matchesSkill(m, skill)),
    [pros, query, skill],
  );

  const avgRating = useMemo(() => {
    if (!pros.length) return '—';
    const sum = pros.reduce((acc, m) => acc + m.rating, 0);
    return (sum / pros.length).toFixed(1);
  }, [pros]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#010F0E', '#053D3A', '#084F4A', '#0B6E67']}
        locations={[0, 0.3, 0.65, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerGlow} pointerEvents="none" />
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>VERIFIED TEAM</Text>
            <Text style={styles.headerTitle}>Browse pros</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryPill}>
            <Text style={styles.summaryVal}>{pros.length}</Text>
            <Text style={styles.summaryLbl}>Pros</Text>
          </View>
          <View style={styles.summaryPill}>
            <Text style={styles.summaryVal}>{avgRating}★</Text>
            <Text style={styles.summaryLbl}>Avg rating</Text>
          </View>
          <View style={styles.summaryPill}>
            <Text style={styles.summaryVal}>98%</Text>
            <Text style={styles.summaryLbl}>Verified</Text>
          </View>
        </View>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, skill or area"
            placeholderTextColor={colors.mutedLight}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.mutedLight} />
            </Pressable>
          ) : null}
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            {SKILL_FILTERS.map((f) => {
              const active = skill === f;
              return (
                <Pressable
                  key={f}
                  style={[styles.filterPill, active && styles.filterPillActive]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSkill(f);
                  }}
                >
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>{f}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={32} color={colors.muted} />
              <Text style={styles.emptyTitle}>No pros found</Text>
              <Text style={styles.emptySub}>Try another skill or clear your search.</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {filtered.map((maid) => (
                <ProListCard
                  key={maid.id}
                  maid={maid}
                  onPress={() => openPro(maid.id, { name: maid.name })}
                />
              ))}
            </View>
          )}

          <View style={styles.trust}>
            <Ionicons name="shield-checkmark" size={18} color={colors.primaryDark} />
            <Text style={styles.trustText}>
              Every pro is background-checked, ID verified and trained for Raipur homes before
              their first visit.
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
    top: -40,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(110,231,183,0.12)',
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
    color: 'rgba(255,255,255,0.55)',
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 24,
    color: colors.white,
    letterSpacing: -0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  summaryPill: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.xl,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  summaryVal: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
  summaryLbl: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.ink,
    padding: 0,
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  filterPillActive: {
    backgroundColor: colors.primaryLight,
    borderColor: 'rgba(11,110,103,0.2)',
  },
  filterText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted },
  filterTextActive: { color: colors.primaryDark },
  list: {
    marginHorizontal: layout.pad,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.12)',
    backgroundColor: colors.white,
  },
  cardBg: { ...StyleSheet.absoluteFill, opacity: 0.5 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  initial: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.primaryDark },
  verified: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  cardCopy: { flex: 1, minWidth: 0, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink, flexShrink: 1 },
  badge: {
    backgroundColor: '#FFFAEB',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgeText: { fontFamily: fonts.bold, fontSize: 9, color: '#B54708' },
  skill: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2, flexWrap: 'wrap' },
  rating: { fontFamily: fonts.bold, fontSize: 11, color: colors.ink },
  dot: { fontFamily: fonts.regular, fontSize: 11, color: colors.mutedLight },
  jobs: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  onTime: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  empty: {
    alignItems: 'center',
    paddingHorizontal: layout.pad,
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  emptySub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
  },
  trust: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginHorizontal: layout.pad,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryLight,
  },
  trustText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.primaryDark,
    lineHeight: 17,
  },
});
