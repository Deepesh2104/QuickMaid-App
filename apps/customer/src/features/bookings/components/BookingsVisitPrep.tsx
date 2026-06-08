import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DemoBooking } from '@/constants/demo';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const CHECKLIST = [
  { id: 'access', icon: 'key-outline' as const, label: 'Keep gate key ready', sub: 'Or share OTP with security' },
  { id: 'water', icon: 'water-outline' as const, label: 'Water & power on', sub: 'For bathroom & kitchen clean' },
  { id: 'pets', icon: 'paw-outline' as const, label: 'Secure pets', sub: 'Keep them in a safe room' },
  { id: 'valuables', icon: 'lock-closed-outline' as const, label: 'Lock valuables', sub: 'Jewellery & cash in locker' },
];

interface BookingsVisitPrepProps {
  booking: DemoBooking;
}

export function BookingsVisitPrep({ booking }: BookingsVisitPrepProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    Haptics.selectionAsync();
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const done = Object.values(checked).filter(Boolean).length;

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Before visit"
        title="Prep checklist"
        subtitle={`${booking.date} · ${booking.time}`}
        icon="checkbox-outline"
        compact
      />

      <View style={styles.card}>
        <LinearGradient colors={['#E6F4F2', '#FFFFFF']} style={StyleSheet.absoluteFill} />

        <View style={styles.progressHead}>
          <Text style={styles.progressLabel}>{done}/{CHECKLIST.length} ready</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(done / CHECKLIST.length) * 100}%` }]} />
          </View>
        </View>

        {CHECKLIST.map((item) => {
          const on = checked[item.id];
          return (
            <Pressable
              key={item.id}
              style={[styles.row, on && styles.rowOn]}
              onPress={() => toggle(item.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
            >
              <View style={[styles.check, on && styles.checkOn]}>
                {on ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
              </View>
              <View style={[styles.rowIcon, on && styles.rowIconOn]}>
                <Ionicons name={item.icon} size={16} color={on ? colors.primaryDark : colors.muted} />
              </View>
              <View style={styles.rowCopy}>
                <Text style={[styles.rowLabel, on && styles.rowLabelOn]}>{item.label}</Text>
                <Text style={styles.rowSub}>{item.sub}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  card: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  progressHead: { gap: 6, marginBottom: spacing.xs },
  progressLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
  progressBar: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.bgMuted,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
  },
  rowOn: { backgroundColor: 'rgba(11,110,103,0.06)' },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconOn: { backgroundColor: colors.primaryLight },
  rowCopy: { flex: 1, gap: 1 },
  rowLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
  },
  rowLabelOn: { color: colors.primaryDark },
  rowSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
});
