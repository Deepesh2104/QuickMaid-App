import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ListPagination } from '@/components/ui/ListPagination';
import type { DemoBooking } from '@/constants/demo';
import { PAGE_SIZE_BOOKINGS } from '@/constants/pagination';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { useTranslation } from '@/i18n/LanguageProvider';
import { usePagination } from '@/hooks/usePagination';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, spacing } from '@/theme/spacing';

import { BookingCard } from './BookingCard';
import { BookingsEmptyState } from './BookingsEmptyState';
import { BookingsFooterCta } from './BookingsFooterCta';
import { BookingsInvoiceRail } from './BookingsInvoiceRail';
import { BookingsRebookRail } from './BookingsRebookRail';
import { BookingsTrustSection } from './BookingsTrustSection';
import type { BookingFilter } from './BookingsFilterRail';

interface BookingsBodyProps {
  filter: BookingFilter;
  filteredBookings: DemoBooking[];
  upcomingBookings: DemoBooking[];
  completedBookings: DemoBooking[];
  onOtpVerified?: () => void;
}

function PaginatedBookingSection({
  sectionKey,
  eyebrow,
  title,
  subtitle,
  icon,
  items,
}: {
  sectionKey: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  items: DemoBooking[];
}) {
  const { t } = useTranslation();
  const { page, setPage, totalPages, start, end, slice, total } = usePagination(
    items,
    PAGE_SIZE_BOOKINGS,
    sectionKey,
  );

  return (
    <View style={styles.section}>
      <HomeSectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} icon={icon} compact />
      {slice.map((b, i) => (
        <BookingCard key={b.id} booking={b} index={start + i} showRebook showQuickActions />
      ))}
      <View style={styles.pager}>
        <ListPagination
          page={page}
          totalPages={totalPages}
          start={start}
          end={end}
          total={total}
          onPageChange={setPage}
          label={title}
          itemLabel={t('bookings.itemLabel')}
          compact
        />
      </View>
    </View>
  );
}

export function BookingsBody({
  filter,
  filteredBookings,
  upcomingBookings,
  completedBookings,
}: BookingsBodyProps) {
  const { t } = useTranslation();
  const showRebook = filter === 'all' || filter === 'completed';
  const showInvoices = filter === 'all' || filter === 'completed';
  const historyCount = filteredBookings.filter((b) => b.status !== 'upcoming').length;

  const sections =
    filter === 'all'
      ? [
          ...(upcomingBookings.length
            ? [{
                key: 'upcoming',
                title: t('bookings.sectionUpcoming'),
                subtitle: t('bookings.scheduled', { count: upcomingBookings.length }),
                items: upcomingBookings,
              }]
            : []),
          ...(historyCount
            ? [{
                key: 'history',
                title: t('bookings.sectionHistory'),
                subtitle: t('bookings.visits', { count: historyCount }),
                items: filteredBookings.filter((b) => b.status !== 'upcoming'),
              }]
            : []),
        ]
      : [];

  const sectionTitleForFilter = (f: BookingFilter) => {
    if (f === 'upcoming') return t('bookings.sectionUpcoming');
    if (f === 'completed') return t('bookings.filterPast');
    if (f === 'cancelled') return t('bookings.filterCancelled');
    return t('bookings.sectionAll');
  };

  const singleFilterSections = [
    {
      key: filter,
      title: sectionTitleForFilter(filter),
      subtitle: t('bookings.visits', { count: filteredBookings.length }),
      items: filteredBookings,
    },
  ];

  const resolvedSections = filter === 'all' ? sections : singleFilterSections;
  const hasBookings = filteredBookings.length > 0;

  return (
    <View style={styles.block}>
      {hasBookings ? (
        resolvedSections.map((section) => (
          <PaginatedBookingSection
            key={section.key}
            sectionKey={section.key}
            eyebrow={section.key === 'upcoming' ? t('bookings.eyebrowScheduled') : t('bookings.eyebrowHistory')}
            title={section.title}
            subtitle={section.subtitle}
            icon={section.key === 'upcoming' ? 'time-outline' : 'albums-outline'}
            items={section.items}
          />
        ))
      ) : (
        <BookingsEmptyState filter={filter} />
      )}

      {showRebook && completedBookings.length > 0 ? (
        <BookingsRebookRail bookings={completedBookings} />
      ) : null}

      {showInvoices && completedBookings.length > 0 ? (
        <BookingsInvoiceRail bookings={completedBookings} />
      ) : null}

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
  section: { marginBottom: spacing.section },
  pager: { marginHorizontal: layout.pad },
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
