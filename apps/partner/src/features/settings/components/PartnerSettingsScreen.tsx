import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PartnerStackShell } from '@/components/ui/PartnerStackShell';
import { usePartner } from '@/context/PartnerContext';
import { APP_VERSION } from '@/features/profile/constants/profile.premium';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import { PartnerSettingsDemoTools } from '@/features/settings/components/PartnerSettingsDemoTools';
import { PartnerSettingsPreferences } from '@/features/settings/components/PartnerSettingsPreferences';
import { SETTINGS_SECTIONS, SETTINGS_STATS } from '@/features/settings/constants/settings.premium';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export function PartnerSettingsScreen() {
  const router = useRouter();
  const { profile } = usePartner();

  const stats = [
    { value: profile?.city ?? 'Raipur', label: 'City' },
    { value: profile?.publicId ?? 'MD-—', label: 'Maid ID' },
  ];

  return (
    <PartnerStackShell
      eyebrow="PREFERENCES"
      title="Settings"
      subtitle={`${profile?.name ?? 'Partner'} · account & app preferences`}
      icon="settings-outline"
      stats={stats}
    >
      <PartnerSettingsPreferences />
      <PartnerSettingsDemoTools />

      {SETTINGS_SECTIONS.map((section, sIdx) => (
        <Animated.View
          key={section.id}
          entering={FadeInDown.delay(sIdx * 50).duration(260)}
          style={styles.section}
        >
          <PartnerRequestsSectionHeader
            eyebrow={section.title}
            title={section.title}
            compact
          />
          <View style={styles.card}>
            {section.items.map((item, i) => (
              <Pressable
                key={item.id}
                style={[styles.row, i === section.items.length - 1 && styles.rowLast]}
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push(item.route as Href);
                }}
              >
                <View style={styles.rowIcon}>
                  <Ionicons name={item.icon} size={18} color={colors.primary} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>{item.label}</Text>
                  <Text style={styles.rowSub}>{item.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
              </Pressable>
            ))}
          </View>
        </Animated.View>
      ))}

      <Animated.View entering={FadeInDown.delay(280).duration(260)} style={styles.section}>
        <PartnerRequestsSectionHeader eyebrow="Danger" title="Danger zone" compact />
        <View style={styles.dangerCard}>
          <Pressable
            style={styles.dangerRow}
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/account/delete' as Href);
            }}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
            <View style={styles.dangerCopy}>
              <Text style={styles.dangerRowText}>Delete account</Text>
              <Text style={styles.dangerSub}>7-day restore window · then permanent purge</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.error} />
          </Pressable>
        </View>
      </Animated.View>

      <Text style={styles.version}>QuickMaid Partner · {[...SETTINGS_STATS][0].value}</Text>
    </PartnerStackShell>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  rowLast: { borderBottomWidth: 0 },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCopy: { flex: 1, gap: 2 },
  rowTitle: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink },
  rowSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  dangerCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.15)',
    overflow: 'hidden',
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  dangerCopy: { flex: 1, gap: 2 },
  dangerRowText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.error },
  dangerSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  version: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
