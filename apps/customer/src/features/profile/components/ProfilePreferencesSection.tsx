import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import type { NotificationPrefs } from '../types/profile.types';

const PREFS: { id: keyof NotificationPrefs; icon: 'calendar-outline' | 'pricetag-outline' | 'person-outline' | 'chatbox-outline'; label: string; sub: string }[] = [
  { id: 'booking', icon: 'calendar-outline', label: 'Booking updates', sub: 'Confirmations & reminders' },
  { id: 'offers', icon: 'pricetag-outline', label: 'Offers & deals', sub: 'Member discounts & promos' },
  { id: 'pro', icon: 'person-outline', label: 'Pro arrival alerts', sub: 'Live tracking notifications' },
  { id: 'sms', icon: 'chatbox-outline', label: 'SMS updates', sub: 'OTP & visit summaries' },
];

interface ProfilePreferencesSectionProps {
  prefs: NotificationPrefs;
  language: 'en' | 'hi';
  onPrefChange: (prefs: NotificationPrefs) => Promise<void>;
  onEditLanguage: () => void;
}

export function ProfilePreferencesSection({ prefs, language, onPrefChange, onEditLanguage }: ProfilePreferencesSectionProps) {
  const flip = async (id: keyof NotificationPrefs, val: boolean) => {
    Haptics.selectionAsync();
    await onPrefChange({ ...prefs, [id]: val });
  };

  return (
    <View style={styles.block}>
      <HomeSectionHeader eyebrow="Preferences" title="Notifications" subtitle="Saved automatically" icon="notifications-outline" compact />

      <View style={styles.card}>
        {PREFS.map((p, i) => (
          <View key={p.id} style={[styles.row, i < PREFS.length - 1 && styles.rowBorder]}>
            <View style={styles.rowIcon}>
              <Ionicons name={p.icon} size={18} color={colors.primaryDark} />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowLabel}>{p.label}</Text>
              <Text style={styles.rowSub}>{p.sub}</Text>
            </View>
            <Switch
              value={prefs[p.id]}
              onValueChange={(v) => flip(p.id, v)}
              trackColor={{ false: colors.bgMuted, true: colors.primaryLight }}
              thumbColor={prefs[p.id] ? colors.primary : colors.mutedLight}
            />
          </View>
        ))}
      </View>

      <Pressable style={styles.langRow} onPress={onEditLanguage} accessibilityRole="button">
        <View style={styles.rowIcon}>
          <Ionicons name="language-outline" size={18} color={colors.primaryDark} />
        </View>
        <View style={styles.rowCopy}>
          <Text style={styles.rowLabel}>Language</Text>
          <Text style={styles.rowSub}>{language === 'en' ? 'English' : 'हिंदी'} · Tap to change</Text>
        </View>
        <View style={styles.langBadge}>
          <Text style={styles.langText}>{language.toUpperCase()}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  card: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowCopy: { flex: 1, gap: 2 },
  rowLabel: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  rowSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: layout.pad,
    padding: spacing.lg,
    gap: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  langBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  langText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.primaryDark,
  },
});
