import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { SUPPORT_CONTACT } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

function isWithinSupportHours(): boolean {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 22;
}

export function HelpHoursBanner() {
  if (isWithinSupportHours()) return null;

  return (
    <View style={styles.banner}>
      <Ionicons name="moon-outline" size={18} color="#93370D" />
      <View style={styles.copy}>
        <Text style={styles.title}>We're offline right now</Text>
        <Text style={styles.sub}>
          Support hours: {SUPPORT_CONTACT.hours}. Leave a message — we'll reply first thing.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginHorizontal: layout.pad,
    marginBottom: spacing.md,
    backgroundColor: '#FFFAEB',
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(181,71,8,0.15)',
  },
  copy: { flex: 1, gap: 2 },
  title: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: '#93370D',
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
});
