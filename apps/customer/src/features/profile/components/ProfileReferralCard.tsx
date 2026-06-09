import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface ProfileReferralCardProps {
  code: string;
}

export function ProfileReferralCard({ code }: ProfileReferralCardProps) {
  const router = useRouter();

  const share = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `Book home cleaning on QuickMaid with my code ${code} — we both get ₹100! https://quickmaid.app`,
      });
    } catch {
      // dismissed
    }
  };

  const openRewards = () => {
    Haptics.selectionAsync();
    router.push('/account/referrals' as Href);
  };

  return (
    <Pressable style={styles.wrap} onPress={openRewards} accessibilityRole="button">
      <LinearGradient colors={['#6941C6', '#53389E']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={styles.glow} />

      <View style={styles.left}>
        <View style={styles.icon}>
          <Ionicons name="gift" size={22} color="#E9D7FE" />
        </View>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>Refer & earn</Text>
          <Text style={styles.title}>Give ₹100, get ₹100</Text>
          <Text style={styles.sub}>View rewards · Track invites</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
      </View>

      <View style={styles.codeBox}>
        <Text style={styles.code}>{code}</Text>
        <Pressable
          style={styles.shareBtn}
          onPress={(e) => {
            e.stopPropagation?.();
            void share();
          }}
          accessibilityRole="button"
          accessibilityLabel="Share referral code"
        >
          <Ionicons name="share-social" size={14} color="#53389E" />
          <Text style={styles.shareText}>Share</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    overflow: 'hidden',
    marginBottom: spacing.section,
  },
  glow: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(233,215,254,0.15)',
  },
  left: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  eyebrow: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: -0.3,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 15,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  code: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.white,
    letterSpacing: 2,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  shareText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: '#53389E',
  },
});
