import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ListPagination } from '@/components/ui/ListPagination';
import type { DemoBooking } from '@/constants/demo';
import { PAGE_SIZE_REBOOK } from '@/constants/pagination';
import { usePagination } from '@/hooks/usePagination';
import { HomePhoto } from '@/features/home/components/HomePhoto';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { getServiceImages } from '@/features/home/constants/unsplash.images';
import { useRebookBooking } from '../hooks/useRebookBooking';
import { getBookingImageId } from '../utils/bookings.utils';
import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface BookingsRebookRailProps {
  bookings: DemoBooking[];
}

const GAP = layout.cardGap;

export function BookingsRebookRail({ bookings }: BookingsRebookRailProps) {
  const { serviceCardW } = useLayoutMetrics();
  const rebook = useRebookBooking();
  const { page, setPage, totalPages, start, end, slice, total } = usePagination(
    bookings,
    PAGE_SIZE_REBOOK,
    'rebook',
  );
  if (bookings.length === 0) return null;

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Quick repeat"
        title="Book again"
        subtitle="Same pro · One tap"
        icon="refresh-circle"
        compact
      />

      <View style={styles.row}>
        {slice.map((b) => {
          const imageId = getBookingImageId(b.service);
          return (
            <Pressable
              key={b.id}
              style={[styles.card, { width: serviceCardW }]}
              onPress={() => {
                Haptics.selectionAsync();
                rebook(b.service);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Rebook ${b.service}`}
            >
              <HomePhoto uri={getServiceImages(imageId)} style={styles.photo} overlay="none" borderRadius={radius.lg} />
              <LinearGradient colors={['transparent', 'rgba(15,20,25,0.78)']} style={styles.photoGrad} />
              <View style={styles.cardBody}>
                <Text style={styles.service} numberOfLines={1}>
                  {b.service}
                </Text>
                <Text style={styles.maid} numberOfLines={1}>
                  {b.maid}
                </Text>
                <View style={styles.meta}>
                  <Text style={styles.price}>{b.price}</Text>
                  <View style={styles.rebookBtn}>
                    <Ionicons name="refresh" size={11} color={colors.white} />
                    <Text style={styles.rebookText}>Rebook</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.pager}>
        <ListPagination
          page={page}
          totalPages={totalPages}
          start={start}
          end={end}
          total={total}
          onPageChange={setPage}
          label="Book again"
          itemLabel="services"
          compact
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  row: {
    flexDirection: 'row',
    paddingHorizontal: layout.pad,
    gap: GAP,
  },
  pager: { marginHorizontal: layout.pad },
  card: {
    height: 196,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.bgSubtle,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  photo: { width: '100%', height: '100%' },
  photoGrad: { ...StyleSheet.absoluteFill },
  cardBody: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
    gap: 2,
  },
  service: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: colors.white,
  },
  maid: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: '#6EE7B7',
    flex: 1,
  },
  rebookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rebookText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.white,
  },
});
