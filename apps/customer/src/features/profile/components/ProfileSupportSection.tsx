import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { Alert, Linking, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { useOpenLegal } from '@/features/legal/hooks/useOpenLegal';
import { SUPPORT_LINKS } from '../constants/profile.demo';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function ProfileSupportSection() {
  const router = useRouter();
  const openLegal = useOpenLegal();

  const onLink = (id: string) => {
    Haptics.selectionAsync();
    if (id === 'help') router.push('/(tabs)/support' as Href);
    else if (id === 'terms') openLegal('hub');
    else if (id === 'about') {
      Alert.alert('QuickMaid', 'Customer app demo · v1.0.0\nBuilt with Expo Router & Razorpay.');
    }     else if (id === 'rate') {
      void Share.share({
        message: 'Loving QuickMaid for home cleaning in Raipur! ⭐⭐⭐⭐⭐ https://quickmaid.app',
      });
      void Linking.openURL('market://details?id=com.quickmaid.app').catch(() => {
        Alert.alert('Rate QuickMaid', 'Thanks! Play Store link opens in production build.');
      });
    }
  };

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="More"
        title="Support & legal"
        subtitle="Help · Feedback · Policies"
        icon="help-circle-outline"
        compact
      />

      <View style={styles.list}>
        {SUPPORT_LINKS.map((item, i) => (
          <Pressable
            key={item.id}
            style={[styles.row, i < SUPPORT_LINKS.length - 1 && styles.rowBorder]}
            onPress={() => onLink(item.id)}
            accessibilityRole="button"
          >
            <View style={styles.rowIcon}>
              <Ionicons name={item.icon} size={18} color={colors.primaryDark} />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowSub}>{item.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  list: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCopy: { flex: 1, gap: 2 },
  rowLabel: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  rowSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
});
