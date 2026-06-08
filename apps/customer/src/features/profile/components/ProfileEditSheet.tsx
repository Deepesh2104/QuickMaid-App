import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import { ProfileHeroIcon, ProfilePremiumDeleteBtn, ProfilePremiumSaveBtn } from './ProfilePremiumParts';

interface ProfileEditSheetProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  badge?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  saveLabel?: string;
  onSave?: () => void;
  saving?: boolean;
  saveDisabled?: boolean;
  saveIcon?: keyof typeof Ionicons.glyphMap;
  deleteLabel?: string;
  onDelete?: () => void;
}

export function ProfileEditSheet({
  visible,
  title,
  subtitle,
  icon = 'create-outline',
  badge,
  onClose,
  children,
  footer,
  saveLabel,
  onSave,
  saving,
  saveDisabled,
  saveIcon,
  deleteLabel,
  onDelete,
}: ProfileEditSheetProps) {
  const insets = useSafeAreaInsets();

  const close = () => {
    Haptics.selectionAsync();
    onClose();
  };

  const hasBuiltInFooter = Boolean(footer || (saveLabel && onSave));

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + (hasBuiltInFooter ? 100 : spacing.xl) }}
        >
          <LinearGradient colors={['#084F4A', '#0B6E67', '#0F1419']} locations={[0, 0.5, 1]} style={styles.hero}>
            <View style={[styles.heroTop, { paddingTop: insets.top + spacing.sm }]}>
              <Pressable style={styles.closeBtn} onPress={close} accessibilityRole="button" accessibilityLabel="Close">
                <Ionicons name="close" size={20} color={colors.white} />
              </Pressable>
              {badge ? (
                <View style={styles.badge}>
                  <Ionicons name="sparkles" size={12} color="#FCD34D" />
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ) : (
                <View style={styles.badgeSpacer} />
              )}
            </View>

            <View style={styles.heroBody}>
              <ProfileHeroIcon icon={icon} />
              <Text style={styles.heroTitle}>{title}</Text>
              {subtitle ? <Text style={styles.heroSub}>{subtitle}</Text> : null}
            </View>

            <View style={styles.heroFade} pointerEvents="none" />
            <View style={styles.orbA} pointerEvents="none" />
            <View style={styles.orbB} pointerEvents="none" />
          </LinearGradient>

          {children}
        </ScrollView>

        {hasBuiltInFooter ? (
          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
            {footer ?? (
              <View style={styles.footerStack}>
                {onDelete && deleteLabel ? <ProfilePremiumDeleteBtn label={deleteLabel} onPress={onDelete} /> : null}
                {saveLabel && onSave ? (
                  <ProfilePremiumSaveBtn
                    label={saveLabel}
                    onPress={onSave}
                    loading={saving}
                    disabled={saveDisabled}
                    icon={saveIcon}
                  />
                ) : null}
              </View>
            )}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: {
    paddingBottom: spacing.xxl,
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.pad,
    marginBottom: spacing.lg,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.25)',
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: '#FCD34D',
  },
  badgeSpacer: { width: 40 },
  heroBody: {
    alignItems: 'center',
    paddingHorizontal: layout.pad,
    gap: spacing.xs,
  },
  heroTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 26,
    color: colors.white,
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  heroSub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
  },
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
  },
  orbA: {
    position: 'absolute',
    top: -20,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(110,231,183,0.1)',
  },
  orbB: {
    position: 'absolute',
    bottom: 60,
    left: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  footerStack: { gap: spacing.xs },
});
