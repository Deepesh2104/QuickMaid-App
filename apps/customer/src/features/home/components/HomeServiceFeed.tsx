import { StyleSheet, Text, View } from 'react-native';

import type { ServiceItem } from '@/constants/services';
import { ListPagination } from '@/components/ui/ListPagination';
import { PAGE_SIZE } from '@/constants/pagination';
import { usePagination } from '@/hooks/usePagination';
import { spacing } from '@/theme/spacing';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';

import { HomeServiceCard, HomeServiceEmpty } from './HomeServiceCard';

interface HomeServiceFeedProps {
  services: ServiceItem[];
  query: string;
}

/** Full catalogue list with pagination — use on /catalogue screen only. */
export function HomeServiceFeed({ services, query }: HomeServiceFeedProps) {
  const { page, setPage, totalPages, start, end, slice: shown, canPrev, canNext } = usePagination(
    services,
    PAGE_SIZE,
    query,
  );

  if (services.length === 0) {
    return <HomeServiceEmpty query={query} />;
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.list} key={`page-${page}`}>
        {shown.map((s, i) => (
          <HomeServiceCard key={s.id} service={s} index={start + i} />
        ))}
      </View>

      <ListPagination
        page={page}
        totalPages={totalPages}
        start={start}
        end={end}
        total={services.length}
        onPageChange={setPage}
        label="Catalogue page"
        itemLabel="services"
      />

      <Text style={styles.pagerHint}>
        {canPrev ? 'Tap Previous to go back' : 'You are on the first page'}
        {canNext ? ' · Tap Next for more' : canPrev ? ' · Last page reached' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  list: { gap: spacing.md },
  pagerHint: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.mutedLight,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: spacing.sm,
  },
});
