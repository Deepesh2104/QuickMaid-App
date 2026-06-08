import { StyleSheet, Text, View } from 'react-native';

import type { DemoBooking } from '@/constants/demo';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, spacing } from '@/theme/spacing';

import { BookingCard } from './BookingCard';
import { BookingCompletionOtpCard } from './BookingCompletionOtpCard';
import { BookingUpcomingHero } from './BookingUpcomingHero';
import { BookingsEmptyState } from './BookingsEmptyState';
import { BookingsFooterCta } from './BookingsFooterCta';
import { BookingsInsightsStrip } from './BookingsInsightsStrip';
import { BookingsInvoiceRail } from './BookingsInvoiceRail';
import { BookingsQuickActions } from './BookingsQuickActions';
import { BookingsRebookRail } from './BookingsRebookRail';
import { BookingsTrackStrip } from './BookingsTrackStrip';
import { BookingsTrustSection } from './BookingsTrustSection';
import { BookingsVisitPrep } from './BookingsVisitPrep';
import type { BookingFilter } from './BookingsFilterRail';

const FILTER_LABELS: Record<BookingFilter, string> = {
  all: 'All',
  upcoming: 'Upcoming',
  completed: 'Past',
  cancelled: 'Cancelled',
};

interface BookingsBodyProps {
  filter: BookingFilter;
  counts: Record<BookingFilter, number>;
  upcomingHero?: DemoBooking;
  listBookings: DemoBooking[];
  rebookBookings: DemoBooking[];
  completedBookings: DemoBooking[];
  showHero: boolean;
  onOtpVerified?: () => void;
}

export function BookingsBody({
  filter,
  upcomingHero,
  listBookings,
  rebookBookings,
  completedBookings,
  showHero,
  onOtpVerified,
}: BookingsBodyProps) {
  const showRebook = rebookBookings.length > 0;

  return (
    <View style={styles.block}>
      <BookingsInsightsStrip />

      {showHero && upcomingHero ? <BookingsTrackStrip booking={upcomingHero} /> : null}

      {showHero && upcomingHero ? <BookingUpcomingHero booking={upcomingHero} /> : null}

      {showHero && upcomingHero?.completionOtp ? (
        <BookingCompletionOtpCard booking={upcomingHero} onVerified={onOtpVerified} />
      ) : null}

      {showHero && upcomingHero ? <BookingsVisitPrep booking={upcomingHero} /> : null}

      {showRebook ? <BookingsRebookRail bookings={rebookBookings} /> : null}

      {listBookings.length > 0 ? (
        <View style={styles.list}>
          <HomeSectionHeader
            eyebrow="History"
            title={filter === 'all' ? 'Past & other visits' : FILTER_LABELS[filter]}
            subtitle={`${listBookings.length} booking${listBookings.length === 1 ? '' : 's'}`}
            icon="albums-outline"
            compact
          />
          {listBookings.map((b, i) => (
            <BookingCard key={b.id} booking={b} index={i} showRebook />
          ))}
        </View>
      ) : !showHero ? (
        <BookingsEmptyState filterLabel={FILTER_LABELS[filter]} />
      ) : null}

      <BookingsInvoiceRail bookings={completedBookings} />
      <BookingsQuickActions
        upcomingBookingId={upcomingHero?.id}
        documentBookingId={upcomingHero?.id ?? completedBookings[0]?.id}
      />
      <BookingsFooterCta />
      <BookingsTrustSection />

      <View style={styles.footer}>
        <Text style={styles.footerBrand}>QuickMaid Bookings</Text>
        <Text style={styles.footerSub}>Verified pros · Pay after service · Raipur</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {},
  list: { marginBottom: spacing.section },
  footer: {
    alignItems: 'center',
    gap: 4,
    marginHorizontal: layout.pad,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  footerBrand: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: colors.muted,
    letterSpacing: 0.4,
  },
  footerSub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.mutedLight,
    textAlign: 'center',
  },
});
