import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { useTranslation } from '@/i18n/LanguageProvider';
import { useOpenNotifications } from '@/features/notifications/hooks/useOpenNotifications';
import { HOME_IMAGES } from '../constants/unsplash.images';
import { HomePhoto } from './HomePhoto';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface HomeHeaderProps {
  paddingTop: number;
  firstName?: string;
  avatarUri?: string;
  deliverTitle: string;
  deliverLine: string;
  unreadCount?: number;
  onDeliverTo: () => void;
}

const STATS = [
  { icon: 'shield-checkmark' as const, value: '4.85★', labelKey: 'home.statRated' },
  { icon: 'home' as const, value: '50k+', labelKey: 'home.statHomes' },
  { icon: 'flash' as const, value: '98%', labelKey: 'home.statOnTime' },
];

export function HomeHeader({
  paddingTop,
  firstName,
  avatarUri,
  deliverTitle,
  deliverLine,
  unreadCount = 0,
  onDeliverTo,
}: HomeHeaderProps) {
  const router = useRouter();
  const { t, greeting } = useTranslation();
  const openNotifications = useOpenNotifications();
  const line = greeting(firstName);

  const openProfile = () => {
    Haptics.selectionAsync();
    router.push('/(tabs)/profile' as Href);
  };

  return (
    <View style={styles.wrap}>
      <HomePhoto uri={HOME_IMAGES.hero} style={styles.photo} overlay="hero" />

      <View style={[styles.content, { paddingTop: paddingTop + 8 }]}>
        <View style={styles.topBar}>
          <Pressable
            style={styles.locationBlock}
            onPress={() => {
              Haptics.selectionAsync();
              onDeliverTo();
            }}
            accessibilityRole="button"
            accessibilityLabel={`Delivery location, ${deliverTitle}`}
          >
            <Ionicons name="navigate" size={17} color={colors.white} />
            <View style={styles.locationText}>
              <View style={styles.locationTitleRow}>
                <Text style={styles.locationTitle} numberOfLines={1}>
                  {deliverTitle}
                </Text>
                <Ionicons name="chevron-down" size={14} color={colors.white} />
              </View>
              <Text style={styles.locationSub} numberOfLines={1}>
                {deliverLine}
              </Text>
            </View>
          </Pressable>

          <View style={styles.topRight}>
            <Pressable
              style={styles.profileWrap}
              onPress={openProfile}
              accessibilityRole="button"
              accessibilityLabel={t('home.myProfile')}
            >
              <View style={styles.profileCircle}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.profilePhoto} contentFit="cover" />
                ) : (
                  <Ionicons name="person" size={24} color="#5C5C5C" />
                )}
              </View>
            </Pressable>

            <Pressable
              onPress={openNotifications}
              accessibilityLabel={t('home.notifications')}
              accessibilityRole="button"
              hitSlop={8}
              style={styles.notifBtn}
            >
              <Ionicons name="notifications-outline" size={23} color={colors.white} />
              {unreadCount > 0 ? <View style={styles.notifDot} /> : null}
            </Pressable>
          </View>
        </View>

        <View style={styles.heroCopy}>
          <Text style={styles.greeting}>{line}</Text>
          <Text style={styles.headline}>
            {t('home.headline1')}
            {'\n'}
            <Text style={styles.headlineAccent}>{t('home.headline2')}</Text> {t('home.headline3')}
          </Text>
        </View>

        <View style={styles.statsGlass} accessibilityRole="summary">
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
    minHeight: 296,
    paddingBottom: 36,
    overflow: 'hidden',
  },
  photo: { ...fill },
  content: {
    flex: 1,
    paddingHorizontal: layout.pad,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  locationBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  locationText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  locationTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.white,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  locationSub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.68)',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flexShrink: 0,
  },
  profileWrap: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  notifBtn: {
    position: 'relative',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FBBF24',
    borderWidth: 1.5,
    borderColor: '#0B6E67',
  },
  profileCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.95)',
  },
  profilePhoto: {
    width: 42,
    height: 42,
  },
  heroCopy: { gap: spacing.sm, marginBottom: spacing.lg },
  greeting: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.88)',
  },
  headline: {
    fontFamily: fonts.extraBold,
    fontSize: 32,
    color: colors.white,
    letterSpacing: -1,
    lineHeight: 38,
  },
  headlineAccent: {
    color: '#6EE7B7',
  },
  statsGlass: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statSep: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.18)' },
  statValue: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: colors.white,
  },
  statLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.72)',
    letterSpacing: 0.3,
  },
});
