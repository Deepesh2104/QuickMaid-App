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

import { listSupportTickets } from '../lib/support.storage';
import {
  formatTicketWhen,
  lastMessagePreview,
  supportTopicMeta,
  ticketStatusTheme,
} from '../lib/support.utils';
import type { SupportTicket, TicketStatus } from '../types/support.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

type TicketFilter = 'all' | 'open' | 'resolved';

const FILTERS: { id: TicketFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'resolved', label: 'Resolved' },
];

function matchesFilter(ticket: SupportTicket, filter: TicketFilter) {
  if (filter === 'all') return true;
  if (filter === 'resolved') return ticket.status === 'resolved';
  return ticket.status !== 'resolved';
}

export function SupportTicketsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<TicketFilter>('all');

  const load = useCallback(async () => {
    const data = await listSupportTickets();
    setTickets(data);
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
    () => tickets.filter((t) => matchesFilter(t, filter)),
    [tickets, filter],
  );

  const openCount = tickets.filter((t) => t.status !== 'resolved').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;

  const openChat = (ticketId?: string) => {
    Haptics.selectionAsync();
    if (ticketId) {
      router.push({ pathname: '/support/chat', params: { ticketId } } as Href);
      return;
    }
    router.push('/support/chat' as Href);
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
            <Text style={styles.headerEyebrow}>SUPPORT</Text>
            <Text style={styles.headerTitle}>My tickets</Text>
          </View>
          <Pressable style={styles.newBtn} onPress={() => openChat()} accessibilityRole="button">
            <Ionicons name="add" size={20} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>{tickets.length}</Text>
            <Text style={styles.headerStatLbl}>Total</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>{openCount}</Text>
            <Text style={styles.headerStatLbl}>Open</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatVal}>{resolvedCount}</Text>
            <Text style={styles.headerStatLbl}>Resolved</Text>
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
                <Ionicons name="chatbubbles-outline" size={28} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>
                {filter === 'all' ? 'No tickets yet' : `No ${filter} tickets`}
              </Text>
              <Text style={styles.emptySub}>
                Chat with support for bookings, payments, or disputes — conversations appear here.
              </Text>
              <Pressable style={styles.emptyBtn} onPress={() => openChat()}>
                <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.white} />
                <Text style={styles.emptyBtnText}>Start chat</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.list}>
              {filtered.map((ticket) => {
                const topic = supportTopicMeta(ticket.topic);
                const status = ticketStatusTheme(ticket.status);
                return (
                  <Pressable
                    key={ticket.id}
                    style={styles.card}
                    onPress={() => openChat(ticket.id)}
                    accessibilityRole="button"
                  >
                    <View style={[styles.topicIcon, { backgroundColor: topic.tone }]}>
                      <Ionicons name={topic.icon} size={18} color={colors.primaryDark} />
                    </View>

                    <View style={styles.cardCopy}>
                      <View style={styles.cardTop}>
                        <Text style={styles.cardSubject} numberOfLines={1}>
                          {ticket.subject}
                        </Text>
                        <View style={[styles.statusBadge, { backgroundColor: status.tone }]}>
                          <Text style={[styles.statusText, { color: status.ink }]}>{status.label}</Text>
                        </View>
                      </View>

                      <Text style={styles.cardPreview} numberOfLines={2}>
                        {lastMessagePreview(ticket.messages)}
                      </Text>

                      <View style={styles.cardFoot}>
                        <Text style={styles.cardMeta}>{topic.label}</Text>
                        {ticket.bookingRef ? (
                          <>
                            <Text style={styles.cardDot}>·</Text>
                            <Text style={styles.cardMeta}>{ticket.bookingRef}</Text>
                          </>
                        ) : null}
                        <Text style={styles.cardDot}>·</Text>
                        <Text style={styles.cardMeta}>{formatTicketWhen(ticket.updatedAt)}</Text>
                      </View>
                    </View>

                    <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
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
    color: 'rgba(255,255,255,0.72)',
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.white,
    letterSpacing: -0.4,
  },
  newBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
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
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  emptyBtnText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
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
  cardCopy: { flex: 1, minWidth: 0, gap: 4 },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardSubject: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  statusBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 0.2,
  },
  cardPreview: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
  cardFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  cardMeta: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.mutedLight,
  },
  cardDot: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.mutedLight,
  },
});
