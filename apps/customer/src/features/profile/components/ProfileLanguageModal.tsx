import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

import { ProfileEditSheet } from './ProfileEditSheet';
import { premiumFormStyles, ProfileSectionCard } from './ProfilePremiumParts';

const LANGS = [
  { id: 'en' as const, label: 'English', sub: 'Default · Full app support', flag: '🇮🇳' },
  { id: 'hi' as const, label: 'हिंदी', sub: 'Coming soon · Partial', flag: '🇮🇳' },
];

interface ProfileLanguageModalProps {
  visible: boolean;
  value: 'en' | 'hi';
  onClose: () => void;
  onSave: (lang: 'en' | 'hi') => Promise<void>;
}

export function ProfileLanguageModal({ visible, value, onClose, onSave }: ProfileLanguageModalProps) {
  const [selected, setSelected] = useState(value);
  const [saving, setSaving] = useState(false);

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
      badge={selected === 'en' ? 'English' : 'हिंदी'}
      title="Language"
      subtitle="Choose how you read the app"
      onClose={onClose}
      saveLabel="Save language"
      onSave={save}
      saving={saving}
      saveIcon="globe-outline"
    >
      <View style={premiumFormStyles.form}>
        <ProfileSectionCard icon="chatbubbles-outline" title="App language" hint="More languages coming soon">
          {LANGS.map((l) => {
            const on = selected === l.id;
            const disabled = l.id === 'hi';
            return (
              <Pressable
                key={l.id}
                style={[styles.row, on && styles.rowOn, disabled && styles.rowOff]}
                onPress={() => {
                  if (disabled) return;
                  Haptics.selectionAsync();
                  setSelected(l.id);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: on, disabled }}
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
  rowOff: { opacity: 0.55 },
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
