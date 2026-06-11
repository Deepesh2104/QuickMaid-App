import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type {
  PartnerAlertButton,
  PartnerAlertOptions,
  PartnerAlertVariant,
} from '@/lib/partner-alert.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, shadow, spacing } from '@/theme/spacing';

const VARIANT_META: Record<
  PartnerAlertVariant,
  {
    icon: keyof typeof Ionicons.glyphMap;
    gradient: readonly [string, string];
    bar: string;
    cardBorder: string;
    cardBg: readonly [string, string, string];
  }
> = {
  teal: {
    icon: 'sparkles',
    gradient: ['#084F4A', '#0B6E67'],
    bar: '#0B6E67',
    cardBorder: 'rgba(11,110,103,0.18)',
    cardBg: ['#E6F4F2', '#FFFFFF', '#F8FDFC'],
  },
  info: {
    icon: 'information-circle',
    gradient: ['#175CD3', '#1570EF'],
    bar: '#1570EF',
    cardBorder: 'rgba(23,92,211,0.16)',
    cardBg: ['#EEF6FF', '#FFFFFF', '#F8FDFC'],
  },
  warning: {
    icon: 'warning',
    gradient: ['#B54708', '#D97706'],
    bar: '#D97706',
    cardBorder: 'rgba(217,119,6,0.2)',
    cardBg: ['#FFFBEB', '#FFFFFF', '#F8FDFC'],
  },
  danger: {
    icon: 'alert-circle',
    gradient: ['#B42318', '#D92D20'],
    bar: '#F04438',
    cardBorder: 'rgba(217,45,32,0.16)',
    cardBg: ['#FFF5F5', '#FFFFFF', '#F8FDFC'],
  },
  success: {
    icon: 'checkmark-circle',
    gradient: ['#027A48', '#039855'],
    bar: '#039855',
    cardBorder: 'rgba(3,152,85,0.18)',
    cardBg: ['#ECFDF3', '#FFFFFF', '#F8FDFC'],
  },
};

interface PartnerPremiumAlertProps extends PartnerAlertOptions {
  visible: boolean;
  onDismiss: () => void;
}

export function PartnerPremiumAlert({
  visible,
  title,
  message,
  variant = 'teal',
  icon,
  hint,
  buttons,
  onDismiss,
}: PartnerPremiumAlertProps) {
  const insets = useSafeAreaInsets();
  const meta = VARIANT_META[variant];
  const iconName = icon ?? meta.icon;
  const resolvedButtons = buttons?.length ? buttons : [{ text: 'OK', style: 'default' as const }];
  const actionButtons = resolvedButtons.filter((b) => b.style !== 'cancel');
  const cancelButtons = resolvedButtons.filter((b) => b.style === 'cancel');

  const runButton = (button: PartnerAlertButton) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDismiss();
    button.onPress?.();
  };

  const close = () => {
    Haptics.selectionAsync();
    onDismiss();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Animated.View
        entering={FadeIn.duration(220)}
        style={[
          styles.backdrop,
          { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.sm },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityRole="button" />
        <Animated.View entering={FadeInDown.duration(320).springify()} style={[styles.card, { borderColor: meta.cardBorder }]}>
          <LinearGradient colors={[...meta.cardBg]} style={styles.cardBg} />
          <View style={[styles.topBar, { backgroundColor: meta.bar }]} />

          <View style={styles.body}>
            <LinearGradient colors={[...meta.gradient]} style={styles.iconGrad}>
              <Ionicons name={iconName} size={26} color={colors.white} />
            </LinearGradient>

            <Text style={styles.title}>{title}</Text>
            {message ? <Text style={styles.sub}>{message}</Text> : null}

            {hint ? (
              <View style={styles.hint}>
                <Ionicons name="bulb-outline" size={14} color={colors.warning} />
                <Text style={styles.hintText}>{hint}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.footer}>
            {actionButtons.map((button, index) => {
              const isDestructive = button.style === 'destructive';
              const isPrimary = isDestructive || index === 0;

              if (isPrimary) {
                const grad = isDestructive ? (['#B42318', '#D92D20'] as const) : meta.gradient;
                return (
                  <Pressable
                    key={`${button.text}-${index}`}
                    style={styles.primary}
                    onPress={() => runButton(button)}
                    accessibilityRole="button"
                  >
                    <LinearGradient colors={[...grad]} style={StyleSheet.absoluteFill} />
                    <Text style={styles.primaryText}>{button.text}</Text>
                  </Pressable>
                );
              }

              return (
                <Pressable
                  key={`${button.text}-${index}`}
                  style={styles.secondary}
                  onPress={() => runButton(button)}
                  accessibilityRole="button"
                >
                  <Text style={styles.secondaryText}>{button.text}</Text>
                </Pressable>
              );
            })}

            {cancelButtons.map((button, index) => (
              <Pressable
                key={`cancel-${button.text}-${index}`}
                style={styles.cancel}
                onPress={() => runButton(button)}
                accessibilityRole="button"
              >
                <Text style={styles.cancelText}>{button.text}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(1,15,14,0.62)',
    justifyContent: 'center',
    paddingHorizontal: layout.pad,
  },
  card: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    ...shadow.lg,
  },
  cardBg: { ...StyleSheet.absoluteFill },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    zIndex: 1,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconGrad: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 19,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.warningBg,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
    width: '100%',
  },
  hintText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.warning,
    lineHeight: 15,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(15,20,25,0.06)',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  primary: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingVertical: 12,
    overflow: 'hidden',
    minHeight: 46,
  },
  primaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  secondary: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.2)',
    backgroundColor: colors.white,
  },
  secondaryText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primaryDark },
  cancel: { alignItems: 'center', paddingVertical: 8 },
  cancelText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.muted },
});
