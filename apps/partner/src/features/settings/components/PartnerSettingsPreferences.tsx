import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import {
  PREFERENCE_LANGUAGE_OPTIONS,
  PREFERENCE_TOGGLES,
} from '@/features/settings/constants/settings.premium';
import { usePartnerPreferences } from '@/features/settings/hooks/usePartnerPreferences';
import type { PartnerAppLanguage } from '@/features/settings/types/settings.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

export function PartnerSettingsPreferences() {
  const { prefs, update } = usePartnerPreferences();

  const onToggle = (
    key: 'jobAlerts' | 'payoutAlerts' | 'kycAlerts' | 'hapticFeedback',
    value: boolean,
  ) => {
    if (prefs.hapticFeedback) void Haptics.selectionAsync();
    void update({ [key]: value });
  };

  const onLanguage = (language: PartnerAppLanguage) => {
    if (prefs.hapticFeedback) void Haptics.selectionAsync();
    void update({ language });
  };

  return (
    <Animated.View entering={FadeInDown.duration(280)} style={styles.block}>
      <PartnerRequestsSectionHeader
        eyebrow="App"
        title="Preferences"
        subtitle="In-app alerts & language — saved on device"
        icon="options-outline"
        compact
      />

      <LinearGradient
        colors={['#E6F4F2', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroIcon}>
          <Ionicons name="notifications-outline" size={20} color={colors.primaryDark} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>In-app inbox alerts</Text>
          <Text style={styles.heroSub}>
            Job, payout & KYC updates appear in Notifications tab. OS push is off by design.
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.groupLabel}>LANGUAGE</Text>
        <View style={styles.langRow}>
          {PREFERENCE_LANGUAGE_OPTIONS.map((opt) => {
            const on = prefs.language === opt.id;
            return (
              <Pressable
                key={opt.id}
                style={[styles.langChip, on && styles.langChipOn]}
                onPress={() => onLanguage(opt.id)}
              >
                <Text style={[styles.langChipText, on && styles.langChipTextOn]}>{opt.label}</Text>
                <Text style={[styles.langChipSub, on && styles.langChipSubOn]}>{opt.sub}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.divider} />

        <Text style={styles.groupLabel}>IN-APP ALERT TYPES</Text>
        {PREFERENCE_TOGGLES.map((item, i) => {
          const value = prefs[item.key];
          return (
            <View
              key={item.key}
              style={[styles.toggleRow, i < PREFERENCE_TOGGLES.length - 1 && styles.toggleBorder]}
            >
              <View style={[styles.toggleIcon, { backgroundColor: item.tone }]}>
                <Ionicons name={item.icon} size={16} color={item.ink} />
              </View>
              <View style={styles.toggleCopy}>
                <Text style={styles.toggleTitle}>{item.label}</Text>
                <Text style={styles.toggleSub}>{item.sub}</Text>
              </View>
              <Switch
                value={value}
                onValueChange={(v) => onToggle(item.key, v)}
                trackColor={{ false: colors.bgMuted, true: 'rgba(11,110,103,0.35)' }}
                thumbColor={value ? colors.primary : colors.white}
              />
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.sm },
  hero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.14)',
    ...shadow.sm,
  },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: { flex: 1, gap: 4 },
  heroTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  heroSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 16 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  groupLabel: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  langRow: { flexDirection: 'row', gap: spacing.sm },
  langChip: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.bgSubtle,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 2,
  },
  langChipOn: {
    backgroundColor: colors.primaryLight,
    borderColor: 'rgba(11,110,103,0.28)',
  },
  langChipText: { fontFamily: fonts.bold, fontSize: 14, color: colors.muted },
  langChipTextOn: { color: colors.primaryDark },
  langChipSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.mutedLight },
  langChipSubOn: { color: colors.primary },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  toggleBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  toggleIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleCopy: { flex: 1, gap: 2 },
  toggleTitle: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink },
  toggleSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted, lineHeight: 14 },
});
