import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { BookingStatus } from '@/constants/demo';
import { getBookingById } from '@/features/bookings/lib/booking.lookup';
import { resolveServiceIdFromSpecialty } from '@/features/bookings/utils/bookings.utils';
import { getMaidProfileById, getMaidProfileByName, resolveMaidProfile } from '@/features/bookings/lib/maid.profile';
import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';
import { useOpenSupport } from '@/features/help/hooks/useOpenSupport';
import { useOpenTrackBooking } from '@/features/bookings/hooks/useOpenTrackBooking';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import { ProProfileBody } from './ProProfileBody';

export function ProProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, name, bookingId, status } = useLocalSearchParams<{
    id?: string;
    name?: string;
    bookingId?: string;
    status?: BookingStatus;
  }>();
  const openSupport = useOpenSupport();
  const openTrack = useOpenTrackBooking();
  const { bookById, bookDefault } = useStartBooking();

  const maid = useMemo(() => {
    if (id) {
      const found = getMaidProfileById(id);
      if (found) return found;
    }
    if (name) {
      const found = getMaidProfileByName(name);
      if (found) return found;
    }
    if (name) {
      return resolveMaidProfile({ maid: name, maidId: id, maidRating: undefined, maidJobs: undefined });
    }
    return undefined;
  }, [id, name]);

  const bookingStatus = status;

  if (!maid) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <View style={styles.emptyIcon}>
          <Ionicons name="person-outline" size={32} color={colors.muted} />
        </View>
        <Text style={styles.emptyTitle}>Pro not found</Text>
        <Text style={styles.emptySub}>This profile may have been removed or is no longer available.</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const handleMessage = async () => {
    if (bookingId) {
      const booking = await getBookingById(bookingId);
      openSupport({ chat: true, topic: `Message ${booking?.maid ?? maid.name}` });
      return;
    }
    openSupport({ chat: true, topic: `Message ${maid.name}` });
  };

  const handleTrack = () => {
    if (bookingId) openTrack(bookingId);
  };

  const handleBook = () => {
    for (const skill of maid.skills) {
      const serviceId = resolveServiceIdFromSpecialty(skill);
      if (serviceId) {
        bookById(serviceId);
        return;
      }
    }
    bookDefault();
  };

  const showBookCta = !bookingId && bookingStatus !== 'upcoming';

  return (
    <View style={styles.root}>
      <ProProfileBody
        maid={maid}
        mode="page"
        topInset={insets.top}
        bottomInset={insets.bottom}
        onClose={() => router.back()}
        bookingStatus={bookingStatus}
        onMessage={bookingStatus === 'upcoming' ? handleMessage : undefined}
        onTrack={bookingStatus === 'upcoming' && bookingId ? handleTrack : undefined}
        onBook={showBookCta ? handleBook : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  empty: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.pad,
    gap: spacing.md,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.ink },
  emptySub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 21,
  },
  emptyBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  emptyBtnText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryDark },
});
