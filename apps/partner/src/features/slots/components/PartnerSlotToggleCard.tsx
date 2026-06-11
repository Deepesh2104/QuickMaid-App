import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PreferredSlotId } from '@/features/slots/constants/slots.premium';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface PartnerSlotToggleCardProps {
  slotId: PreferredSlotId;
  label: string;
  sub: string;
  icon: 'sunny-outline' | 'partly-sunny-outline' | 'calendar-outline';
  peak?: boolean;
  active: boolean;
  interactive?: boolean;
  onToggle?: () => void;
}

export function PartnerSlotToggleCard({
  label,
  sub,
  icon,
  peak,
  active,
  interactive = false,
  onToggle,
}: PartnerSlotToggleCardProps) {
  const Wrapper = interactive ? Pressable : View;

  return (
    <Wrapper
      style={[styles.card, active && styles.cardOn, !active && styles.cardOff]}
      onPress={interactive ? onToggle : undefined}
    >
      {active ? (
        <LinearGradient colors={['#E6F4F2', '#FFFFFF']} style={StyleSheet.absoluteFill} />
      ) : null}
      <View style={[styles.icon, active ? styles.iconOn : styles.iconOff]}>
        <Ionicons name={icon} size={18} color={active ? colors.primary : colors.muted} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.label, !active && styles.labelOff]}>{label}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      <View style={styles.badges}>
        {peak ? (
          <View style={[styles.peakBadge, !active && styles.peakBadgeOff]}>
            <Text style={[styles.peakText, !active && styles.peakTextOff]}>PEAK</Text>
          </View>
        ) : null}
        <View style={[styles.statusBadge, active ? styles.statusOn : styles.statusOff]}>
          <Text style={[styles.statusText, active ? styles.statusTextOn : styles.statusTextOff]}>
            {active ? 'On' : 'Off'}
          </Text>
        </View>
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
    overflow: 'hidden',
    ...shadow.sm,
  },
  cardOn: { borderColor: 'rgba(11,110,103,0.22)' },
  cardOff: { opacity: 0.72 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOn: { backgroundColor: colors.primaryLight },
  iconOff: { backgroundColor: colors.bgMuted },
  copy: { flex: 1, gap: 2, minWidth: 0 },
  label: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  labelOff: { color: colors.muted },
  sub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },
  badges: { alignItems: 'flex-end', gap: 4 },
  peakBadge: {
    backgroundColor: 'rgba(245,158,11,0.14)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  peakBadgeOff: { backgroundColor: colors.bgMuted },
  peakText: { fontFamily: fonts.bold, fontSize: 8, color: colors.warning, letterSpacing: 0.4 },
  peakTextOff: { color: colors.muted },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  statusOn: { backgroundColor: colors.successBg },
  statusOff: { backgroundColor: colors.bgMuted },
  statusText: { fontFamily: fonts.bold, fontSize: 9, letterSpacing: 0.3 },
  statusTextOn: { color: colors.success },
  statusTextOff: { color: colors.muted },
});
