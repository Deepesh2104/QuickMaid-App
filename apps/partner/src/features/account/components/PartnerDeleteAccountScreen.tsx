import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PartnerStackShell } from '@/components/ui/PartnerStackShell';
import { QmButton } from '@/components/ui/QmButton';
import { usePartner } from '@/context/PartnerContext';
import { usePartnerAlert } from '@/context/PartnerAlertContext';
import {
  DELETE_HELP_OPTIONS,
  DELETE_LOSS_ITEMS,
  DELETE_STATS,
  DELETE_TIMELINE,
} from '@/features/account/constants/account.premium';
import { PartnerRequestsSectionHeader } from '@/features/jobs/components/PartnerRequestsSections';
import { ACCOUNT_DELETION_GRACE_DAYS } from '@/constants/app';
import { deletePartnerAccount } from '@/lib/storage';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

const DELETE_WORD = 'DELETE';

const androidText = Platform.OS === 'android' ? { includeFontPadding: false as const } : {};

export function PartnerDeleteAccountScreen() {
  const router = useRouter();
  const { profile } = usePartner();
  const { alert } = usePartnerAlert();
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const canDelete = confirmText.trim().toUpperCase() === DELETE_WORD && Boolean(profile?.phone);

  const stats = useMemo(
    () => [
      { value: profile?.publicId ?? 'MD—', label: 'Maid ID' },
      { value: profile?.city ?? 'Raipur', label: 'City' },
      ...DELETE_STATS.slice(0, 1),
    ],
    [profile?.city, profile?.publicId],
  );

  const performDelete = async () => {
    if (!profile?.phone || !canDelete) return;
    setDeleting(true);
    await deletePartnerAccount(profile.phone);
    setDeleting(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(auth)/login');
  };

  const onDeletePress = () => {
    alert({
      title: 'Delete account?',
      message: `Account turant deactivate ho jayega. ${ACCOUNT_DELETION_GRACE_DAYS} din ke andar same number se login karoge toh account automatic restore ho jayega. Uske baad data permanently purge hoga.`,
      variant: 'danger',
      icon: 'trash-outline',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete account', style: 'destructive', onPress: () => void performDelete() },
      ],
    });
  };

  const headerExtra = (
    <View style={styles.dangerBadge}>
      <View style={styles.dangerDot} />
      <Text style={styles.dangerBadgeText}>7-DAY PURGE WINDOW</Text>
    </View>
  );

  return (
    <PartnerStackShell
      eyebrow="DANGER ZONE"
      title="Delete partner account"
      subtitle={
        profile?.name
          ? `${profile.name} · ${ACCOUNT_DELETION_GRACE_DAYS} din mein login se restore possible`
          : 'Self-serve delete — logout now, purge after 7 days'
      }
      icon="trash-outline"
      headerColors={['#2B0A0A', '#7F1D1D', '#B91C1C']}
      stats={stats}
      headerExtra={headerExtra}
      sheetBg="#FBF5F5"
      keyboardShouldPersistTaps="handled"
      footer={
        <>
          <View style={[styles.readyPill, canDelete ? styles.readyPillOk : styles.readyPillWait]}>
            <Ionicons
              name={canDelete ? 'checkmark-circle' : 'ellipse-outline'}
              size={14}
              color={canDelete ? colors.success : colors.mutedLight}
            />
            <Text style={[styles.readyText, canDelete && styles.readyTextOk]}>
              {canDelete ? 'Ready — delete button enabled' : `Type ${DELETE_WORD} below to continue`}
            </Text>
          </View>
          <QmButton
            label="Delete account"
            icon="trash-outline"
            variant="dark"
            onPress={onDeletePress}
            loading={deleting}
            disabled={!canDelete}
          />
          <QmButton label="Keep my account" variant="secondary" onPress={() => router.back()} />
        </>
      }
    >
      <Animated.View entering={FadeInDown.duration(300)}>
        <LinearGradient
          colors={['#FEF2F2', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroIcon}>
            <Ionicons name="warning" size={22} color={colors.error} />
          </View>
          <Text style={styles.heroTitle}>Delete = deactivate + 7-day grace</Text>
          <Text style={styles.heroSub}>
            Turant logout ho jayega. {ACCOUNT_DELETION_GRACE_DAYS} din ke andar wapas login karoge toh account
            automatic restore ho jayega — profile, jobs aur KYC wapas mil jayega. Grace ke baad permanent
            purge.
          </Text>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(40).duration(300)} style={styles.block}>
        <PartnerRequestsSectionHeader
          eyebrow="Data loss"
          title="Ye sab delete hoga"
          icon="layers-outline"
          compact
        />
        <View style={styles.lossCard}>
          {DELETE_LOSS_ITEMS.map((item, i) => (
            <View
              key={item.text}
              style={[styles.lossRow, i < DELETE_LOSS_ITEMS.length - 1 && styles.lossBorder]}
            >
              <View style={[styles.lossIcon, { backgroundColor: item.tone }]}>
                <Ionicons name={item.icon} size={18} color={item.ink} />
              </View>
              <Text style={styles.lossText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(300)} style={styles.block}>
        <PartnerRequestsSectionHeader
          eyebrow="Process"
          title="Deletion timeline"
          icon="git-branch-outline"
          compact
        />
        <View style={styles.timelineCard}>
          {DELETE_TIMELINE.map((step, i) => (
            <View key={step.title} style={styles.timelineRow}>
              <View style={styles.timelineRail}>
                <View style={styles.timelineNum}>
                  <Text style={styles.timelineNumText}>{i + 1}</Text>
                </View>
                {i < DELETE_TIMELINE.length - 1 ? <View style={styles.timelineLine} /> : null}
              </View>
              <View style={styles.timelineCopy}>
                <View style={styles.timelineTitleRow}>
                  <Ionicons name={step.icon} size={14} color={colors.error} />
                  <Text style={styles.timelineTitle}>{step.title}</Text>
                </View>
                <Text style={styles.timelineSub}>{step.sub}</Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(300)} style={styles.block}>
        <PartnerRequestsSectionHeader eyebrow="Confirm" title="Verify identity" icon="shield-outline" compact />
        <View style={styles.identityCard}>
          <LinearGradient
            colors={['rgba(185,28,28,0.08)', 'rgba(255,255,255,0)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.identityRow}>
            <View style={styles.avatarRing}>
              <Text style={styles.avatarLetter}>{(profile?.name ?? 'P').charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.identityCopy}>
              <Text style={styles.identityName}>{profile?.name ?? 'Partner'}</Text>
              <Text style={styles.identityMeta}>
                {profile?.publicId ?? 'MD—'} · +91 {profile?.phone ?? '—'}
              </Text>
            </View>
            <View style={styles.verifiedChip}>
              <Ionicons name="call-outline" size={12} color={colors.error} />
              <Text style={styles.verifiedChipText}>Mobile</Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.confirmCard,
            inputFocused && styles.confirmCardFocused,
            canDelete && styles.confirmCardReady,
          ]}
        >
          <Text style={styles.fieldLabel}>Type {DELETE_WORD} to confirm</Text>
          <Text style={styles.fieldHint}>Capital letters — case sensitive nahi</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={confirmText}
              onChangeText={setConfirmText}
              autoCapitalize="characters"
              placeholder={DELETE_WORD}
              placeholderTextColor={colors.placeholder}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
            {canDelete ? (
              <View style={styles.inputOk}>
                <Ionicons name="checkmark" size={16} color={colors.success} />
              </View>
            ) : null}
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(160).duration(300)} style={styles.block}>
        <PartnerRequestsSectionHeader
          eyebrow="Alternatives"
          title="Delete se pehle try karo"
          icon="heart-outline"
          compact
        />
        <View style={styles.helpGrid}>
          {DELETE_HELP_OPTIONS.map((opt) => (
            <Pressable
              key={opt.id}
              style={({ pressed }) => [styles.helpCard, pressed && styles.helpCardPressed]}
              onPress={() => {
                Haptics.selectionAsync();
                router.push(opt.route as Href);
              }}
            >
              <View style={styles.helpIcon}>
                <Ionicons name={opt.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.helpLabel}>{opt.label}</Text>
              <Text style={styles.helpSub}>{opt.sub}</Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={colors.mutedLight}
                style={styles.helpChevron}
              />
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </PartnerStackShell>
  );
}

const styles = StyleSheet.create({
  dangerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(254,202,202,0.35)',
  },
  dangerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FCA5A5',
  },
  dangerBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.white,
    letterSpacing: 0.9,
    ...androidText,
  },
  readyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    marginBottom: spacing.xs,
  },
  readyPillWait: {
    backgroundColor: colors.bgSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  readyPillOk: {
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: 'rgba(2,122,72,0.2)',
  },
  readyText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 16,
    ...androidText,
  },
  readyTextOk: {
    fontFamily: fonts.semiBold,
    color: colors.success,
  },
  heroCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.22)',
    ...shadow.card,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 17,
    color: colors.ink,
    letterSpacing: -0.3,
    lineHeight: 24,
    ...androidText,
  },
  heroSub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 19,
    ...androidText,
  },
  block: { gap: spacing.sm },
  lossCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.12)',
    ...shadow.sm,
  },
  lossRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  lossBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  lossIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lossText: {
    flex: 1,
    flexShrink: 1,
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.inkSecondary,
    lineHeight: 18,
    ...androidText,
  },
  timelineCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(185,28,28,0.1)',
    ...shadow.sm,
  },
  timelineRow: { flexDirection: 'row', gap: spacing.sm, minHeight: 56 },
  timelineRail: { alignItems: 'center', width: 28 },
  timelineNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  timelineNumText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.error,
    ...androidText,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: 'rgba(239,68,68,0.15)',
    marginVertical: 4,
    borderRadius: 1,
  },
  timelineCopy: { flex: 1, gap: 3, paddingBottom: spacing.sm },
  timelineTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timelineTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
    lineHeight: 18,
    ...androidText,
  },
  timelineSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 17,
    ...androidText,
  },
  identityCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.14)',
    ...shadow.sm,
  },
  identityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatarRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: 'rgba(239,68,68,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.error,
    ...androidText,
  },
  identityCopy: { flex: 1, gap: 2, minWidth: 0 },
  identityName: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.ink,
    lineHeight: 20,
    ...androidText,
  },
  identityMeta: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 16,
    ...androidText,
  },
  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.errorBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  verifiedChipText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.error,
    ...androidText,
  },
  confirmCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.08)',
    ...shadow.sm,
  },
  confirmCardFocused: {
    borderColor: 'rgba(239,68,68,0.35)',
  },
  confirmCardReady: {
    borderColor: 'rgba(2,122,72,0.35)',
    backgroundColor: '#FAFFFC',
  },
  fieldLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
    lineHeight: 18,
    ...androidText,
  },
  fieldHint: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.mutedLight,
    lineHeight: 14,
    ...androidText,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  input: {
    flex: 1,
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.error,
    letterSpacing: 4,
    paddingVertical: spacing.sm,
    ...androidText,
  },
  inputOk: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpGrid: { gap: spacing.sm },
  helpCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    paddingRight: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.12)',
    ...shadow.sm,
  },
  helpCardPressed: { opacity: 0.92, transform: [{ scale: 0.995 }] },
  helpIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  helpLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.ink,
    lineHeight: 18,
    ...androidText,
  },
  helpSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 17,
    marginTop: 2,
    paddingRight: spacing.lg,
    ...androidText,
  },
  helpChevron: { position: 'absolute', right: spacing.md, top: spacing.md + 10 },
});
