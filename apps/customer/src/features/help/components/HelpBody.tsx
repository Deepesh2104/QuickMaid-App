import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SUPPORT_CONTACT } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import { HelpEmergencyRow } from './HelpEmergencyRow';
import { HelpFeedbackCard } from './HelpFeedbackCard';
import { HelpHoursBanner } from './HelpHoursBanner';
import { HelpPolicyBento } from './HelpPolicyBento';
import { HelpReachSection } from './HelpReachSection';
import { HelpSelfHelpRail } from './HelpSelfHelpRail';
import { HelpTrustBoard } from './HelpTrustBoard';

interface HelpBodyProps {
  onOpenChat: (topic?: string) => void;
}

export function HelpBody({ onOpenChat }: HelpBodyProps) {
  const openChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onOpenChat();
  };

  return (
    <View style={styles.block}>
      <HelpHoursBanner />
      <HelpTrustBoard />

      <Pressable
        style={styles.chatHero}
        onPress={openChat}
        accessibilityRole="button"
        accessibilityLabel="Chat now with support"
      >
        <LinearGradient colors={['#084F4A', '#0B6E67', '#0D7A72']} style={StyleSheet.absoluteFill} />
        <View style={styles.chatHeroGlow} />

        <View style={styles.chatHeroTop}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Team online now</Text>
          </View>
          <Ionicons name="chatbubbles" size={28} color="rgba(255,255,255,0.25)" />
        </View>

        <Text style={styles.chatHeroTitle}>Need help right away?</Text>
        <Text style={styles.chatHeroSub}>
          {SUPPORT_CONTACT.replyTime} · Real humans, not bots
        </Text>

        <View style={styles.chatNowBtn}>
          <Ionicons name="chatbubble-ellipses" size={18} color={colors.primaryDark} />
          <Text style={styles.chatNowText}>Chat now</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primaryDark} />
        </View>
      </Pressable>

      <HelpEmergencyRow />
      <HelpSelfHelpRail onOpenChat={onOpenChat} />
      <HelpPolicyBento />
      <HelpReachSection onOpenChat={onOpenChat} />
      <HelpFeedbackCard />
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: 0 },
  chatHero: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
    marginBottom: spacing.section,
  },
  chatHeroGlow: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(110,231,183,0.18)',
  },
  chatHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#6EE7B7',
  },
  liveText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.white,
  },
  chatHeroTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.white,
    letterSpacing: -0.4,
    marginTop: spacing.xs,
  },
  chatHeroSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 18,
  },
  chatNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 14,
    marginTop: spacing.sm,
  },
  chatNowText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.primaryDark,
  },
});
