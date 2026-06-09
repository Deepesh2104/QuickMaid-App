import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { useOpenNotifications } from '@/features/notifications/hooks/useOpenNotifications';
import { HomePhoto } from '@/features/home/components/HomePhoto';
import { HOME_IMAGES } from '@/features/home/constants/unsplash.images';
import { useTranslation } from '@/i18n/LanguageProvider';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface BookingsHeaderProps {
  paddingTop: number;
  firstName?: string;
  upcoming: number;
  completed: number;
  total: number;
  unreadCount?: number;
}

const STATS = [
  { icon: 'calendar' as const, valueKey: 'upcoming' as const, labelKey: 'bookings.statUpcoming' },
  { icon: 'checkmark-circle' as const, valueKey: 'completed' as const, labelKey: 'bookings.statDone' },
  { icon: 'layers' as const, valueKey: 'total' as const, labelKey: 'bookings.statTotal' },
];

export function BookingsHeader({
  paddingTop,
  firstName,
  upcoming,
  completed,
  total,
  unreadCount = 0,
}: BookingsHeaderProps) {
  const { t, greeting } = useTranslation();
  const openNotifications = useOpenNotifications();
  const values = { upcoming, completed, total };
  const greetingLine = greeting(firstName);

  return (
    <View style={styles.wrap}>
      <HomePhoto uri={HOME_IMAGES.bookingsHero} style={styles.photo} overlay="none" />
      <LinearGradient
        colors={['rgba(15,20,25,0.55)', 'rgba(15,20,25,0.88)', 'rgba(15,20,25,0.95)']}
        locations={[0, 0.5, 1]}
        style={fill}
      />

      <View style={[styles.content, { paddingTop: paddingTop + spacing.lg }]}>
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Ionicons name="calendar" size={24} color="#6EE7B7" />
          </View>
          <Pressable
            style={styles.bell}
            onPress={openNotifications}
            accessibilityLabel="Booking alerts"
            accessibilityRole="button"
          >
            <Ionicons name="notifications-outline" size={19} color={colors.white} />
            {unreadCount > 0 ? <View style={styles.dot} /> : null}
          </Pressable>
        </View>

        <View style={styles.copy}>
          <Text style={styles.eyebrow}>{t('bookings.eyebrow')}</Text>
          <Text style={styles.title}>{t('bookings.title')}</Text>
          <Text style={styles.sub}>{t('bookings.sub', { greeting: greetingLine })}</Text>
        </View>

        <View style={styles.stats} accessibilityRole="summary">
          {STATS.map((s, i) => (
            <View key={s.labelKey} style={[styles.stat, i > 0 && styles.statSep]}>
              <Ionicons name={s.icon} size={13} color="#6EE7B7" />
              <Text style={styles.statValue}>{values[s.valueKey]}</Text>
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
  badge: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(110,231,183,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.35)',
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
  dot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FBBF24',
    borderWidth: 1.5,
    borderColor: '#0F1419',
  },
  copy: { gap: 6 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: '#6EE7B7',
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
