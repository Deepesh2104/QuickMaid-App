import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../../src/theme/fonts';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AUTH_HERO_BG } from '../../src/components/ui/AuthScreenLayout';
import { QmButton } from '../../src/components/ui/QmButton';
import { UserProfile } from '../../src/constants/app';
import { clearSession, getUserProfile } from '../../src/lib/storage';
import { colors } from '../../src/theme/colors';
import { layout, radius, shadow, spacing } from '../../src/theme/spacing';
import { type } from '../../src/theme/typography';

const SHEET_OVERLAP = 28;

const MENU = [
  {
    title: 'Account',
    items: [
      { icon: 'person-outline' as const, label: 'Edit profile' },
      { icon: 'location-outline' as const, label: 'Saved addresses' },
      { icon: 'card-outline' as const, label: 'Payment methods' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: 'notifications-outline' as const, label: 'Notifications' },
      { icon: 'language-outline' as const, label: 'Language' },
      { icon: 'shield-outline' as const, label: 'Privacy & security' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'star-outline' as const, label: 'Rate QuickMaid' },
      { icon: 'document-text-outline' as const, label: 'Terms & privacy' },
      { icon: 'help-circle-outline' as const, label: 'Help centre' },
    ],
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getUserProfile().then(setProfile);
  }, []);

  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'QM';

  const logout = () => {
    Alert.alert('Log out?', 'Sign back in anytime with your mobile number.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await clearSession();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <View style={[styles.heroWrap, { paddingTop: insets.top + 16 }]}>
        <LinearGradient
          colors={['#084F4A', '#0B6E67', '#0D8A82']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroDecor} pointerEvents="none">
          <View style={[styles.decorCircle, styles.decor1]} />
          <View style={[styles.decorCircle, styles.decor2]} />
        </View>

        <View style={styles.heroContent}>
          <Text style={styles.heroLabel}>Account</Text>
          <Text style={styles.heroSub}>Manage your profile & preferences</Text>
        </View>
      </View>

      <ScrollView
        style={[styles.sheet, { marginTop: -SHEET_OVERLAP }]}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile?.name ?? 'Guest'}</Text>
            <Text style={styles.phone}>+91 {profile?.phone ?? '—'}</Text>
            {profile?.email ? (
              <Text style={styles.email}>{profile.email}</Text>
            ) : null}
            {profile?.locality ? (
              <Text style={styles.locality}>{profile.locality}</Text>
            ) : null}
            <View style={styles.metaRow}>
              <View style={styles.cityBadge}>
              <Ionicons name="location" size={12} color={colors.primary} />
              <Text style={styles.cityText}>{profile?.city ?? 'Raipur'}</Text>
              </View>
              {profile?.homeType ? (
                <View style={styles.homeBadge}>
                  <Ionicons name="home-outline" size={12} color={colors.primary} />
                  <Text style={styles.cityText}>
                    {profile.homeType === '1bhk'
                      ? '1 BHK'
                      : profile.homeType === '2bhk'
                        ? '2 BHK'
                        : profile.homeType === '3bhk'
                          ? '3 BHK+'
                          : 'Villa'}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <Pressable style={styles.editBtn}>
            <Ionicons name="create-outline" size={18} color={colors.primary} />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <StatBox value="12" label="Visits" icon="calendar-outline" />
          <StatBox value="4.9" label="Rating" icon="star" />
          <StatBox value="₹840" label="Saved" icon="wallet-outline" />
        </View>

        {MENU.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, i) => (
                <Pressable
                  key={item.label}
                  style={[styles.menuRow, i < section.items.length - 1 && styles.menuBorder]}
                >
                  <View style={styles.menuIcon}>
                    <Ionicons name={item.icon} size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <QmButton label="Log out" variant="secondary" onPress={logout} style={styles.logout} />
        <Text style={styles.version}>QuickMaid v1.0.0 · Demo build</Text>
      </ScrollView>
    </View>
  );
}

function StatBox({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.statBox}>
      <Ionicons name={icon} size={16} color={colors.primary} style={styles.statIcon} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AUTH_HERO_BG,
  },
  heroWrap: {
    minHeight: 168,
    paddingHorizontal: layout.pad,
    paddingBottom: SHEET_OVERLAP + spacing.xl,
    overflow: 'hidden',
  },
  heroDecor: {
    position: 'absolute',
    right: 0,
    bottom: SHEET_OVERLAP,
    width: 140,
    height: 120,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  decor1: { width: 120, height: 120, right: 10, bottom: 10 },
  decor2: { width: 80, height: 80, right: 70, bottom: 50 },
  heroContent: {
    gap: spacing.xs,
    paddingRight: spacing.xxl,
  },
  heroLabel: {
    ...type.hero,
    color: colors.white,
    fontSize: 28,
  },
  heroSub: {
    ...type.bodySm,
    color: 'rgba(255,255,255,0.85)',
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.bgSubtle,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    ...shadow.lg,
  },
  body: {
    paddingHorizontal: layout.pad,
    paddingTop: spacing.xl,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadow.card,
    marginBottom: spacing.lg,
    marginTop: -spacing.md,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  avatarText: { ...type.h2, color: colors.white, fontFamily: fonts.extraBold },
  profileInfo: { flex: 1 },
  name: { ...type.h2, color: colors.ink },
  phone: { ...type.bodySm, color: colors.muted, marginTop: 2 },
  email: { ...type.caption, color: colors.muted, marginTop: 2 },
  locality: { ...type.caption, color: colors.mutedLight, marginTop: 2 },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  homeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cityText: { ...type.caption, color: colors.primaryDark, fontFamily: fonts.semiBold },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xxl },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadow.sm,
  },
  statIcon: { marginBottom: 4 },
  statValue: { ...type.h3, color: colors.primary },
  statLabel: { ...type.caption, color: colors.muted, marginTop: 2 },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...type.overline, color: colors.muted, marginBottom: spacing.sm },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  menuLabel: { ...type.body, color: colors.ink, flex: 1, fontFamily: fonts.medium },
  logout: { marginBottom: spacing.lg },
  version: { ...type.caption, color: colors.mutedLight, textAlign: 'center' },
});
