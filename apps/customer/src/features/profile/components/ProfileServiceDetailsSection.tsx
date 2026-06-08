import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { RAIPUR_ZONES } from '@/constants/customer.zones';
import type { UserProfile } from '@/constants/app';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import type { BookingPrefs, EmergencyContact, VisitAccess } from '../types/profile.types';

function zoneLabel(value?: string) {
  return RAIPUR_ZONES.find((z) => z.value === value)?.label ?? value ?? '—';
}

interface ProfileServiceDetailsSectionProps {
  profile: UserProfile | null;
  bookingPrefs: BookingPrefs;
  emergency: EmergencyContact;
  visitAccess: VisitAccess;
  onEditProfile: () => void;
  onEditBooking: () => void;
  onEditEmergency: () => void;
  onEditVisit: () => void;
}

export function ProfileServiceDetailsSection({
  profile,
  bookingPrefs,
  emergency,
  visitAccess,
  onEditProfile,
  onEditBooking,
  onEditEmergency,
  onEditVisit,
}: ProfileServiceDetailsSectionProps) {
  const rows = [
    {
      icon: 'time-outline' as const,
      label: 'Preferred slot',
      value: bookingPrefs.preferredSlotLabel,
      sub: bookingPrefs.favoriteMaidName ? `Fav: ${bookingPrefs.favoriteMaidName}` : 'No favourite maid',
      onPress: onEditBooking,
      tone: '#EEF6FF',
      ink: '#175CD3',
    },
    {
      icon: 'navigate-outline' as const,
      label: 'Service zone',
      value: zoneLabel(profile?.zone),
      sub: profile?.locality ?? 'Add locality',
      onPress: onEditProfile,
      tone: '#E6F4F2',
      ink: colors.primaryDark,
    },
    {
      icon: 'call-outline' as const,
      label: 'Emergency contact',
      value: emergency.name || 'Not set',
      sub: emergency.phone ? `+91 ${emergency.phone}` : 'Add alternate phone',
      onPress: onEditEmergency,
      tone: '#FEF3F2',
      ink: '#D92D20',
    },
    {
      icon: 'key-outline' as const,
      label: 'Visit access',
      value: visitAccess.gateCode ? `Gate ${visitAccess.gateCode}` : 'Add gate code',
      sub: visitAccess.hasPets ? 'Pets at home' : visitAccess.parkingNotes ?? 'Parking & entry notes',
      onPress: onEditVisit,
      tone: '#FFF8EE',
      ink: '#B54708',
    },
  ];

  return (
    <View style={styles.block}>
      <HomeSectionHeader eyebrow="Service setup" title="Booking & visit details" subtitle="Required for smooth visits" icon="construct-outline" compact />

      <View style={styles.list}>
        {rows.map((r) => (
          <Pressable
            key={r.label}
            style={styles.row}
            onPress={() => {
              Haptics.selectionAsync();
              r.onPress();
            }}
            accessibilityRole="button"
          >
            <LinearGradient colors={[r.tone, '#FFFFFF']} style={StyleSheet.absoluteFill} />
            <View style={[styles.icon, { backgroundColor: colors.white }]}>
              <Ionicons name={r.icon} size={18} color={r.ink} />
            </View>
            <View style={styles.copy}>
              <Text style={styles.label}>{r.label}</Text>
              <Text style={styles.value}>{r.value}</Text>
              <Text style={styles.sub} numberOfLines={1}>{r.sub}</Text>
            </View>
            <Ionicons name="create-outline" size={16} color={colors.primary} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  list: { paddingHorizontal: layout.pad, gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.05)',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 1 },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  value: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
});
