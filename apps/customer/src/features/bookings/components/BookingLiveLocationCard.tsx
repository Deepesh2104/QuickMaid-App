import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { DemoBooking } from '@/constants/demo';
import { getPartnerLiveLocation, type VisitLocationBridgeEntry } from '@/lib/visit-location-bridge';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface BookingLiveLocationCardProps {
  booking: DemoBooking;
}

export function BookingLiveLocationCard({ booking }: BookingLiveLocationCardProps) {
  const [live, setLive] = useState<VisitLocationBridgeEntry | null>(null);

  useEffect(() => {
    if (!booking.bookingRef || booking.status !== 'upcoming') return;
    const load = async () => setLive(await getPartnerLiveLocation(booking.bookingRef!));
    void load();
    const id = setInterval(() => void load(), 8000);
    return () => clearInterval(id);
  }, [booking.bookingRef, booking.status]);

  if (!live || booking.status !== 'upcoming') return null;

  const updated = new Date(live.recordedAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Ionicons name="navigate" size={18} color="#1570EF" />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>Pro is on the way</Text>
        <Text style={styles.sub}>
          {live.partnerName ?? booking.maid ?? 'Your pro'} · updated {updated}
        </Text>
        <Text style={styles.coords}>
          {live.lat.toFixed(4)}, {live.lng.toFixed(4)}
        </Text>
      </View>
      <View style={styles.liveDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#EFF8FF',
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(21,112,239,0.2)',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  sub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  coords: { fontFamily: fonts.semiBold, fontSize: 10, color: '#1570EF' },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1570EF',
  },
});
