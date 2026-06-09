import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { useTranslation } from '@/i18n/LanguageProvider';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import type { NotificationPrefs } from '../types/profile.types';

interface ProfilePreferencesSectionProps {
  prefs: NotificationPrefs;
  language: 'en' | 'hi';
  onPrefChange: (prefs: NotificationPrefs) => Promise<void>;
  onEditLanguage: () => void;
}

export function ProfilePreferencesSection({ prefs, language, onPrefChange, onEditLanguage }: ProfilePreferencesSectionProps) {
  const { t } = useTranslation();

  const PREFS: {
    id: keyof NotificationPrefs;
    icon: 'calendar-outline' | 'pricetag-outline' | 'person-outline' | 'chatbox-outline';
    labelKey: string;
    subKey: string;
  }[] = [
    { id: 'booking', icon: 'calendar-outline', labelKey: 'profile.prefBooking', subKey: 'profile.prefBookingSub' },
    { id: 'offers', icon: 'pricetag-outline', labelKey: 'profile.prefOffers', subKey: 'profile.prefOffersSub' },
    { id: 'pro', icon: 'person-outline', labelKey: 'profile.prefPro', subKey: 'profile.prefProSub' },
    { id: 'sms', icon: 'chatbox-outline', labelKey: 'profile.prefSms', subKey: 'profile.prefSmsSub' },
  ];

  const flip = async (id: keyof NotificationPrefs, val: boolean) => {
    Haptics.selectionAsync();
    await onPrefChange({ ...prefs, [id]: val });
  };

  const langLabel = language === 'en' ? t('profile.languageEnglish') : t('profile.languageHindi');

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow={t('profile.preferencesEyebrow')}
        title={t('profile.notificationsTitle')}
        subtitle={t('profile.notificationsSub')}
        icon="notifications-outline"
        compact
      />

      <View style={styles.card}>
        {PREFS.map((p, i) => (
          <View key={p.id} style={[styles.row, i < PREFS.length - 1 && styles.rowBorder]}>
            <View style={styles.rowIcon}>
              <Ionicons name={p.icon} size={18} color={colors.primaryDark} />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowLabel}>{t(p.labelKey)}</Text>
              <Text style={styles.rowSub}>{t(p.subKey)}</Text>
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
          <Text style={styles.rowLabel}>{t('profile.language')}</Text>
          <Text style={styles.rowSub}>{t('profile.languageTap', { lang: langLabel })}</Text>
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
