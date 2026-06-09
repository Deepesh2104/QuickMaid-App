import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { useHomeProfile } from '@/features/home/hooks/useHomeProfile';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

import { useOpenRateBooking } from '../hooks/useOpenRateBooking';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { usePendingVisitComplete } from '../hooks/usePendingVisitComplete';
import { useUserBookings } from '../hooks/useUserBookings';
import { filterBookings } from '../utils/bookings.utils';
import { BookingsBody } from './BookingsBody';
import { BookingVisitCompleteModal } from './BookingVisitCompleteModal';
import { BookingsFilterRail, type BookingFilter } from './BookingsFilterRail';
import { BookingsHeader } from './BookingsHeader';

export function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const { tabScrollPad } = useLayoutMetrics();
  const { profile, refresh: refreshProfile } = useHomeProfile();
  const { bookings, refresh: refreshBookings } = useUserBookings();
  const { payload, visible, checkPending, dismiss } = usePendingVisitComplete();
  const openRate = useOpenRateBooking();
  const { unreadCount } = useNotifications();
  const [filter, setFilter] = useState<BookingFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const counts = useMemo(
    () => ({
      all: bookings.length,
      upcoming: bookings.filter((b) => b.status === 'upcoming').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    }),
    [bookings],
  );

  const filteredBookings = useMemo(() => filterBookings(bookings, filter), [bookings, filter]);

  const upcomingBookings = useMemo(
    () => filterBookings(bookings, 'upcoming'),
    [bookings],
  );

  const completedBookings = useMemo(
    () => bookings.filter((b) => b.status === 'completed'),
    [bookings],
  );

  useFocusEffect(
    useCallback(() => {
      refreshBookings();
      void checkPending();
    }, [refreshBookings, checkPending]),
  );

  const onOtpVerified = useCallback(async () => {
    await refreshBookings();
    await checkPending();
  }, [refreshBookings, checkPending]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshProfile(), refreshBookings()]);
    setRefreshing(false);
  }, [refreshProfile, refreshBookings]);

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={{ paddingBottom: tabScrollPad }}
      >
        <BookingsHeader
          paddingTop={insets.top}
          firstName={profile?.name?.split(' ')[0]}
          upcoming={counts.upcoming}
          completed={counts.completed}
          total={counts.all}
          unreadCount={unreadCount}
        />

        <View style={styles.canvas}>
          <View style={styles.sheetBridge} pointerEvents="none" />
          <View style={[styles.lowerSheet, { paddingBottom: insets.bottom + spacing.md }]}>
            <View style={styles.sheetHandle} />
            <BookingsFilterRail active={filter} counts={counts} onSelect={setFilter} />
            <BookingsBody
              filter={filter}
              filteredBookings={filteredBookings}
              upcomingBookings={upcomingBookings}
              completedBookings={completedBookings}
              onOtpVerified={onOtpVerified}
            />
          </View>
        </View>
      </ScrollView>

      <BookingVisitCompleteModal
        visible={visible}
        payload={payload}
        onClose={dismiss}
        onRate={() => {
          if (payload) {
            dismiss();
            openRate(payload.bookingId);
          }
        }}
      />
    </View>
  );
}

const SHEET_OVERLAP = 18;
const HEADER_TAIL = '#0F1419';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  canvas: {
    backgroundColor: colors.bg,
    marginTop: -SHEET_OVERLAP,
    paddingTop: SHEET_OVERLAP,
  },
  sheetBridge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SHEET_OVERLAP + radius.xxl + 8,
    backgroundColor: HEADER_TAIL,
    zIndex: 0,
  },
  lowerSheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    paddingTop: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: 'rgba(15,20,25,0.05)',
    zIndex: 1,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.bgMuted,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
});
