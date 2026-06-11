import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { EarningRow } from '@/constants/demo';
import { formatRsSigned } from '@/features/earnings/lib/earnings.utils';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface PartnerEarningsActivityCardProps {
  row: EarningRow;
  compact?: boolean;
  highlighted?: boolean;
  onPress?: () => void;
}

export function PartnerEarningsActivityCard({
  row,
  compact,
  highlighted,
  onPress,
}: PartnerEarningsActivityCardProps) {
  const isPayout = row.kind === 'payout';
  const isCredit = row.kind === 'credit';

  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      style={[styles.card, isPayout && styles.cardPayout, highlighted && styles.cardHighlight]}
      onPress={
        onPress
          ? () => {
              Haptics.selectionAsync();
              onPress();
            }
          : undefined
      }
    >
      {isCredit ? <View style={styles.accent} /> : <View style={[styles.accent, styles.accentPayout]} />}

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={[styles.icon, isPayout ? styles.iconPayout : styles.iconCredit]}>
            {isCredit ? (
              <LinearGradient colors={['#ECFDF3', '#D1FAE5']} style={StyleSheet.absoluteFill} />
            ) : null}
            <Ionicons
              name={isPayout ? 'arrow-up-circle' : 'add-circle'}
              size={compact ? 15 : 16}
              color={isPayout ? colors.muted : colors.success}
            />
          </View>
          <View style={styles.copy}>
            <Text style={styles.title} numberOfLines={1}>{row.title}</Text>
            <Text style={styles.sub} numberOfLines={1}>
              {row.subtitle} · {row.date}
            </Text>
          </View>
          <View style={styles.rightCol}>
            <Text style={[styles.amt, row.amountPaise < 0 && styles.amtNeg]}>{formatRsSigned(row.amountPaise)}</Text>
            <View style={[styles.kindPill, isPayout ? styles.kindPayout : styles.kindCredit]}>
              <Text style={[styles.kindText, isPayout ? styles.kindTextPayout : styles.kindTextCredit]}>
                {isPayout ? 'PAY' : 'JOB'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  cardPayout: { borderColor: 'rgba(15,20,25,0.04)' },
  cardHighlight: {
    borderColor: 'rgba(11,110,103,0.35)',
    borderWidth: 1.5,
    backgroundColor: '#F6FCFB',
  },
  accent: { width: 4, backgroundColor: colors.success },
  accentPayout: { backgroundColor: colors.mutedLight },
  body: { flex: 1, paddingVertical: spacing.sm + 2, paddingRight: spacing.md, gap: 0 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  iconCredit: { backgroundColor: colors.successBg },
  iconPayout: { backgroundColor: colors.bgMuted },
  copy: { flex: 1, gap: 2, minWidth: 0 },
  title: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  kindPill: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: radius.pill, alignSelf: 'flex-end' },
  kindCredit: { backgroundColor: colors.successBg },
  kindPayout: { backgroundColor: colors.bgMuted },
  kindText: { fontFamily: fonts.bold, fontSize: 7, letterSpacing: 0.3 },
  kindTextCredit: { color: colors.success },
  kindTextPayout: { color: colors.muted },
  sub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
  rightCol: { alignItems: 'flex-end', gap: 3, flexShrink: 0 },
  amt: { fontFamily: fonts.extraBold, fontSize: 12, color: colors.success },
  amtNeg: { color: colors.inkSecondary },
});
