import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { DEMO_BOOKINGS, type BookingStatus } from '../../src/constants/demo';
import { colors } from '../../src/theme/colors';
import { layout, radius, shadow, spacing } from '../../src/theme/spacing';
import { type } from '../../src/theme/typography';

const FILTERS: { id: 'all' | BookingStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Past' },
];

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<'all' | BookingStatus>('all');
  const bookings =
    filter === 'all' ? DEMO_BOOKINGS : DEMO_BOOKINGS.filter((b) => b.status === filter);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <SectionHeader title="Bookings" subtitle="Manage your cleaning visits" />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.id}
            onPress={() => setFilter(f.id)}
            style={[styles.tab, filter === f.id && styles.tabOn]}
          >
            <Text style={[styles.tabText, filter === f.id && styles.tabTextOn]}>{f.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 28, paddingHorizontal: layout.pad }}>
        {bookings.map((b) => (
          <Pressable key={b.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.iconWrap}>
                <Ionicons name={b.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.service}>{b.service}</Text>
                <Text style={styles.meta}>{b.date} · {b.time}</Text>
              </View>
              <View style={[styles.badge, b.status === 'upcoming' ? styles.badgeUp : styles.badgeDone]}>
                <Text style={styles.badgeText}>
                  {b.status === 'upcoming' ? 'Upcoming' : 'Done'}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.maid}>{b.maid}</Text>
                <View style={styles.addrRow}>
                  <Ionicons name="location-outline" size={13} color={colors.muted} />
                  <Text style={styles.address} numberOfLines={1}>{b.address}</Text>
                </View>
              </View>
              <Text style={styles.price}>{b.price}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSubtle },
  header: { paddingHorizontal: layout.pad },
  tabs: { paddingHorizontal: layout.pad, gap: spacing.sm, paddingBottom: spacing.lg },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { ...type.bodySm, color: colors.muted, fontWeight: '500' },
  tabTextOn: { color: colors.white, fontWeight: '600' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...shadow.card,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  service: { ...type.body, fontWeight: '600', color: colors.ink },
  meta: { ...type.caption, color: colors.muted, marginTop: 2 },
  badge: { borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 4 },
  badgeUp: { backgroundColor: colors.primaryLight },
  badgeDone: { backgroundColor: colors.successBg },
  badgeText: { ...type.overline, fontSize: 9, color: colors.primaryDark },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  maid: { ...type.bodySm, fontWeight: '500', color: colors.inkSecondary },
  addrRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, maxWidth: 200 },
  address: { ...type.caption, color: colors.muted, flex: 1 },
  price: { ...type.h3, color: colors.primary },
});
