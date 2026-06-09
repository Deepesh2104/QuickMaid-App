import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from '@/i18n/LanguageProvider';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

import { ProfileEditSheet } from './ProfileEditSheet';
import { premiumFormStyles, ProfileSectionCard } from './ProfilePremiumParts';

interface ProfileLanguageModalProps {
  visible: boolean;
  value: 'en' | 'hi';
  onClose: () => void;
  onSave: (lang: 'en' | 'hi') => Promise<void>;
}

export function ProfileLanguageModal({ visible, value, onClose, onSave }: ProfileLanguageModalProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(value);
  const [saving, setSaving] = useState(false);

  const LANGS = [
    { id: 'en' as const, label: t('profile.languageEnglish'), sub: t('profile.langEnSub'), flag: '🇮🇳' },
    { id: 'hi' as const, label: t('profile.languageHindi'), sub: t('profile.langHiSub'), flag: '🇮🇳' },
  ];

  useEffect(() => {
    if (visible) setSelected(value);
  }, [visible, value]);

  const save = async () => {
    setSaving(true);
    await onSave(selected);
    setSaving(false);
    onClose();
  };

  return (
    <ProfileEditSheet
      visible={visible}
      icon="language-outline"
      badge={selected === 'en' ? t('profile.languageModalBadgeEn') : t('profile.languageModalBadgeHi')}
      title={t('profile.languageModalTitle')}
      subtitle={t('profile.languageModalSub')}
      onClose={onClose}
      saveLabel={t('profile.languageModalSave')}
      onSave={save}
      saving={saving}
      saveIcon="globe-outline"
    >
      <View style={premiumFormStyles.form}>
        <ProfileSectionCard
          icon="chatbubbles-outline"
          title={t('profile.languageModalSection')}
          hint={t('profile.languageModalHint')}
        >
          {LANGS.map((l) => {
            const on = selected === l.id;
            return (
              <Pressable
                key={l.id}
                style={[styles.row, on && styles.rowOn]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelected(l.id);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
              >
                <Text style={styles.flag}>{l.flag}</Text>
                <View style={styles.copy}>
                  <Text style={[styles.label, on && styles.labelOn]}>{l.label}</Text>
                  <Text style={styles.sub}>{l.sub}</Text>
                </View>
                {on ? <Ionicons name="checkmark-circle" size={24} color={colors.primary} /> : (
                  <View style={styles.radioEmpty} />
                )}
              </Pressable>
            );
          })}
        </ProfileSectionCard>
      </View>
    </ProfileEditSheet>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: '#FAFBFC',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    marginBottom: spacing.sm,
  },
  rowOn: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  flag: { fontSize: 28 },
  copy: { flex: 1, gap: 2 },
  label: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.ink,
  },
  labelOn: { color: colors.primaryDark },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  radioEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.divider,
  },
});
