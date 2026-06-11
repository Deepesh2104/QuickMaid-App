import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PartnerJob } from '@/constants/demo';
import { formatRs, netEarningPaise } from '@/features/home/lib/home.greeting';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface PartnerJobHistoryCardProps {
  job: PartnerJob;
}

export function PartnerJobHistoryCard({ job }: PartnerJobHistoryCardProps) {
  const router = useRouter();
  const net = netEarningPaise(job.amountPaise);
  const isCompleted = job.status === 'completed';

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => {
        Haptics.selectionAsync();
        router.push({ pathname: `/job/${job.id}`, params: { from: 'history' } } as Href);
      }}
    >
      <View style={[styles.accent, !isCompleted && styles.accentDeclined]} />
      <View style={styles.body}>
        <View style={styles.row}>
          <View style={[styles.icon, isCompleted ? styles.iconDone : styles.iconDeclined]}>
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={isCompleted ? colors.success : colors.muted}
            />
          </View>
          <View style={styles.copy}>
            <Text style={styles.title} numberOfLines={1}>{job.service}</Text>
            <Text style={styles.sub} numberOfLines={1}>
              {job.visitDate} · {job.customerName} · {job.bookingRef}
            </Text>
          </View>
          <Text style={[styles.earn, !isCompleted && styles.earnMuted]}>
            {isCompleted ? formatRs(net) : '—'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  pressed: { opacity: 0.92 },
  accent: { width: 3, backgroundColor: colors.success },
  accentDeclined: { backgroundColor: colors.mutedLight },
  body: { flex: 1, paddingVertical: spacing.sm + 2, paddingRight: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  iconDone: { backgroundColor: colors.successBg },
  iconDeclined: { backgroundColor: colors.bgMuted },
  copy: { flex: 1, gap: 2, minWidth: 0 },
  title: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  sub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
  earn: { fontFamily: fonts.extraBold, fontSize: 12, color: colors.success, flexShrink: 0 },
  earnMuted: { color: colors.muted, fontSize: 11 },
});
