import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function ProfileSectionCard({
  icon,
  title,
  hint,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={sectionStyles.card}>
      <View style={sectionStyles.head}>
        <View style={sectionStyles.icon}>
          <Ionicons name={icon} size={18} color={colors.primaryDark} />
        </View>
        <View style={sectionStyles.copy}>
          <Text style={sectionStyles.title}>{title}</Text>
          {hint ? <Text style={sectionStyles.hint}>{hint}</Text> : null}
        </View>
      </View>
      <View style={sectionStyles.body}>{children}</View>
    </View>
  );
}

export function ProfilePremiumToggle({
  label,
  sub,
  value,
  onChange,
}: {
  label: string;
  sub?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={toggleStyles.row}>
      <View style={toggleStyles.copy}>
        <Text style={toggleStyles.label}>{label}</Text>
        {sub ? <Text style={toggleStyles.sub}>{sub}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={(v) => {
          Haptics.selectionAsync();
          onChange(v);
        }}
        trackColor={{ false: colors.bgMuted, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : colors.mutedLight}
      />
    </View>
  );
}

export function ProfilePremiumSaveBtn({
  label,
  onPress,
  loading,
  disabled,
  icon = 'checkmark-circle',
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Pressable
      style={[saveStyles.btn, disabled && saveStyles.disabled]}
      onPress={() => {
        if (disabled || loading) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      disabled={disabled || loading}
      accessibilityRole="button"
    >
      <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
      <Ionicons name={icon} size={20} color={colors.white} />
      <Text style={saveStyles.text}>{loading ? 'Saving…' : label}</Text>
    </Pressable>
  );
}

export function ProfilePremiumDeleteBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      style={deleteStyles.btn}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      accessibilityRole="button"
    >
      <Ionicons name="trash-outline" size={16} color="#D92D20" />
      <Text style={deleteStyles.text}>{label}</Text>
    </Pressable>
  );
}

export function ProfileTrustNote({ text }: { text: string }) {
  return (
    <View style={trustStyles.wrap}>
      <Ionicons name="lock-closed-outline" size={16} color={colors.primaryDark} />
      <Text style={trustStyles.text}>{text}</Text>
    </View>
  );
}

export function ProfileHeroIcon({ icon }: { icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={heroStyles.iconWrap}>
      <LinearGradient colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.08)']} style={StyleSheet.absoluteFill} />
      <Ionicons name={icon} size={32} color={colors.white} />
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    overflow: 'hidden',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
    backgroundColor: '#FAFBFC',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.ink,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  body: {
    padding: spacing.lg,
    gap: 4,
  },
});

const toggleStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFBFC',
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.05)',
    marginTop: spacing.xs,
  },
  copy: { flex: 1, gap: 2 },
  label: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
});

const saveStyles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingVertical: 16,
    overflow: 'hidden',
  },
  disabled: { opacity: 0.5 },
  text: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.white,
  },
});

const deleteStyles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
  },
  text: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: '#D92D20',
  },
});

const trustStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryLight,
  },
  text: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primaryDark,
    lineHeight: 18,
  },
});

const heroStyles = StyleSheet.create({
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    marginBottom: spacing.sm,
  },
});

export const premiumFormStyles = StyleSheet.create({
  form: {
    marginTop: -spacing.md,
    paddingHorizontal: layout.pad,
    gap: spacing.lg,
    paddingBottom: spacing.md,
  },
});
