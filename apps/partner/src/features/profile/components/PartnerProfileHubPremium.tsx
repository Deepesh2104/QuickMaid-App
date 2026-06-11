import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import {
  PROFILE_ACTIONS,
  PROFILE_LEGAL_LINKS,
  profilePremium,
} from '@/features/profile/constants/profile.premium';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

const ACTION_TONES: Record<string, { bg: string; ink: string }> = {
  photo: { bg: '#E6F4F2', ink: '#084F4A' },
  rating: { bg: '#FFFBEB', ink: '#B45309' },
  referral: { bg: '#FEF3F2', ink: '#B42318' },
  'book-home': { bg: '#EEF4FF', ink: '#175CD3' },
  history: { bg: '#F4F3FF', ink: '#6D28D9' },
  notifications: { bg: '#ECFDF5', ink: '#047857' },
  help: { bg: '#F0F9FF', ink: '#0369A1' },
};

const LEGAL_TONES: Record<string, string[]> = {
  privacy: ['#F8FAFC', '#FFFFFF'],
  terms: ['#E6F4F2', '#FFFFFF'],
  'referral-policy': ['#FFFBEB', '#FFFFFF'],
};

export function PartnerProfileQuickHub() {
  const router = useRouter();

  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.block}>
      <PartnerRequestsSectionHeader
        eyebrow="Hub"
        title="Quick access"
        subtitle="Jobs, earnings & support — one tap"
        icon="grid-outline"
        compact
      />

      <View style={styles.actionGrid}>
        {PROFILE_ACTIONS.map((action, index) => {
          const tone = ACTION_TONES[action.id] ?? { bg: colors.primaryLight, ink: colors.primaryDark };
          return (
            <Pressable
              key={action.id}
              style={({ pressed }) => [
                styles.actionTile,
                pressed && styles.actionTilePressed,
                index === PROFILE_ACTIONS.length - 1 && styles.actionTileWide,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                router.push(action.route as Href);
              }}
            >
              <LinearGradient
                colors={[tone.bg, colors.white]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionTileGrad}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${tone.ink}14` }]}>
                  <Ionicons name={action.icon} size={18} color={tone.ink} />
                </View>
                <Text style={styles.actionLabel} numberOfLines={1}>
                  {action.label}
                </Text>
                <Text style={styles.actionSub} numberOfLines={2}>
                  {action.sub}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={12}
                  color={colors.mutedLight}
                  style={styles.actionChevron}
                />
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

export function PartnerProfileLegalHub() {
  const router = useRouter();

  return (
    <Animated.View entering={FadeInDown.delay(60).duration(300)} style={styles.block}>
      <PartnerRequestsSectionHeader
        eyebrow="Trust"
        title="Policies & legal"
        subtitle="Privacy, terms & referral rules"
        icon="document-text-outline"
        compact
      />

      <View style={styles.legalStack}>
        {PROFILE_LEGAL_LINKS.map((link) => {
          const grad = LEGAL_TONES[link.id] ?? [...profilePremium.cardGradient];
          return (
            <Pressable
              key={link.id}
              style={({ pressed }) => [styles.legalCard, pressed && styles.legalCardPressed]}
              onPress={() => {
                Haptics.selectionAsync();
                router.push(link.route as Href);
              }}
            >
              <LinearGradient colors={grad as [string, string]} style={styles.legalGrad}>
                <View style={styles.legalIcon}>
                  <Ionicons name={link.icon} size={18} color={colors.primaryDark} />
                </View>
                <View style={styles.legalCopy}>
                  <Text style={styles.legalTitle}>{link.label}</Text>
                  <Text style={styles.legalSub}>{link.sub}</Text>
                </View>
                <View style={styles.legalPill}>
                  <Text style={styles.legalPillText}>Read</Text>
                  <Ionicons name="arrow-forward" size={12} color={colors.primary} />
                </View>
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.sm },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionTile: {
    width: '48.5%',
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  actionTileWide: {
    width: '100%',
  },
  actionTilePressed: { opacity: 0.94, transform: [{ scale: 0.992 }] },
  actionTileGrad: {
    padding: spacing.md,
    minHeight: 108,
    gap: spacing.xs,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
    lineHeight: 17,
  },
  actionSub: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.muted,
    lineHeight: 14,
    paddingRight: spacing.md,
  },
  actionChevron: { position: 'absolute', right: spacing.sm, top: spacing.sm },
  legalStack: { gap: spacing.sm },
  legalCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.1)',
    ...shadow.sm,
  },
  legalCardPressed: { opacity: 0.95 },
  legalGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  legalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  legalCopy: { flex: 1, gap: 2, minWidth: 0 },
  legalTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  legalSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },
  legalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.14)',
  },
  legalPillText: { fontFamily: fonts.bold, fontSize: 10, color: colors.primary },
});
