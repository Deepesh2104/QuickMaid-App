import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { useOpenNotifications } from '@/features/notifications/hooks/useOpenNotifications';
import { useTranslation } from '@/i18n/LanguageProvider';
import { HomePhoto } from '@/features/home/components/HomePhoto';
import { HOME_IMAGES } from '@/features/home/constants/unsplash.images';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface PlusHeaderProps {
  paddingTop: number;
}

const STATS = [
  { icon: 'pricetag' as const, value: '20%', labelKey: 'plus.statSavings' },
  { icon: 'calendar' as const, value: '12', labelKey: 'plus.statVisits' },
  { icon: 'flash' as const, value: 'Priority', labelKey: 'plus.statSlots' },
];

export function PlusHeader({ paddingTop }: PlusHeaderProps) {
  const { t } = useTranslation();
  const openNotifications = useOpenNotifications();

  return (
    <View style={styles.wrap}>
      <HomePhoto uri={HOME_IMAGES.plus} style={styles.photo} overlay="none" />
      <LinearGradient
        colors={['rgba(15,20,25,0.55)', 'rgba(15,20,25,0.88)', 'rgba(15,20,25,0.95)']}
        locations={[0, 0.5, 1]}
        style={fill}
      />

      <View style={[styles.content, { paddingTop: paddingTop + spacing.lg }]}>
        <View style={styles.topRow}>
          <View style={styles.diamond}>
            <Ionicons name="diamond" size={24} color="#FBBF24" />
          </View>
          <Pressable
            style={styles.bell}
            onPress={openNotifications}
            accessibilityRole="button"
            accessibilityLabel="Plus member alerts"
          >
            <Ionicons name="notifications-outline" size={19} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.copy}>
          <Text style={styles.eyebrow}>{t('plus.eyebrow')}</Text>
          <Text style={styles.title}>{t('plus.title')}</Text>
          <Text style={styles.sub}>{t('plus.sub')}</Text>
        </View>

        <View style={styles.stats}>
          {STATS.map((s, i) => (
            <View key={s.labelKey} style={[styles.stat, i > 0 && styles.statSep]}>
              <Ionicons name={s.icon} size={13} color="#6EE7B7" />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{t(s.labelKey)}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const fill: ViewStyle = StyleSheet.absoluteFill;

const styles = StyleSheet.create({
  wrap: {
    minHeight: 300,
    paddingBottom: 28,
    overflow: 'hidden',
    backgroundColor: '#0F1419',
  },
  photo: { ...fill },
  content: {
    flex: 1,
    paddingHorizontal: layout.pad,
    justifyContent: 'space-between',
    zIndex: 2,
    gap: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diamond: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(251,191,36,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { gap: 6 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: '#FBBF24',
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 32,
    color: colors.white,
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 18,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    paddingVertical: spacing.md,
  },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statSep: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.12)' },
  statValue: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.white,
  },
  statLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.65)',
  },
});
