import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { usePartnerI18n } from '@/i18n/usePartnerI18n';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface PartnerGoToRequestsStripProps {
  offerCount: number;
  isOnline: boolean;
}

/** Jobs tab: manual mode — offers live on Requests tab only. */
export function PartnerGoToRequestsStrip({ offerCount, isOnline }: PartnerGoToRequestsStripProps) {
  const router = useRouter();
  const { t } = usePartnerI18n();

  if (!isOnline) return null;

  return (
    <Pressable
      style={styles.wrap}
      onPress={() => {
        Haptics.selectionAsync();
        router.push('/(tabs)/requests' as Href);
      }}
      accessibilityRole="button"
    >
      <View style={styles.icon}>
        <Ionicons name="mail-open" size={18} color={colors.primary} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>
          {offerCount > 0
            ? `${offerCount} ${t('manualOffersCount')}`
            : t('manualRequestsStrip')}
        </Text>
        <Text style={styles.sub}>{t('acceptDeclineThere')}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 3 },
  title: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  sub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },
});
