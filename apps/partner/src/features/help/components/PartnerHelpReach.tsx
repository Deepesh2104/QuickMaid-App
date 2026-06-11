import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { usePartnerAlert } from '@/context/PartnerAlertContext';

import { PARTNER_FAQ_ITEMS, SUPPORT_CONTACT } from '@/constants/demo';
import { useOpenSupportChat } from '@/features/support/hooks/useOpenSupportChat';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, shadow, spacing } from '@/theme/spacing';

const QUICK_FIXES = [
  { id: 'payout', icon: 'wallet-outline' as const, label: 'Payout status' },
  { id: 'job', icon: 'briefcase-outline' as const, label: 'Job issue' },
  { id: 'kyc', icon: 'shield-checkmark-outline' as const, label: 'KYC help' },
];

const TRUST_STATS = [
  { icon: 'star' as const, value: '4.9', label: 'Support rating' },
  { icon: 'people-outline' as const, value: 'Local', label: 'Raipur team' },
  { icon: 'flash-outline' as const, value: '<5m', label: 'Avg reply' },
];

function openWhatsApp(topic?: string) {
  const text = topic
    ? encodeURIComponent(`Hi QuickMaid Partner support — I need help with: ${topic}`)
    : encodeURIComponent('Hi QuickMaid Partner support');
  void Linking.openURL(`https://wa.me/${SUPPORT_CONTACT.whatsapp}?text=${text}`);
}

export function PartnerHelpReach() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const { alert } = usePartnerAlert();
  const openSupportChat = useOpenSupportChat();

  const dial = () => void Linking.openURL(`tel:${SUPPORT_CONTACT.phone.replace(/\s/g, '')}`);
  const mail = () => void Linking.openURL(`mailto:${SUPPORT_CONTACT.email}`);
  const chat = (topic?: string, context?: string) => {
    openSupportChat({ topic, context: context ?? topic });
  };

  return (
    <View style={styles.block}>
      <Pressable
        style={styles.chatHero}
        onPress={() => chat()}
        accessibilityRole="button"
        accessibilityLabel="Open partner support chat"
      >
        <LinearGradient colors={['#084F4A', '#0B6E67', '#0D7A72']} style={StyleSheet.absoluteFill} />
        <View style={styles.chatHeroGlow} />
        <View style={styles.chatHeroTop}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Team online now</Text>
          </View>
          <Ionicons name="chatbubbles" size={28} color="rgba(255,255,255,0.35)" />
        </View>
        <Text style={styles.chatHeroTitle}>Need help right away?</Text>
        <Text style={styles.chatHeroSub}>{SUPPORT_CONTACT.replyTime} · Real humans, not bots</Text>
        <View style={styles.chatNowBtn}>
          <Ionicons name="chatbubble-ellipses" size={18} color={colors.primaryDark} />
          <Text style={styles.chatNowText}>Chat now</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primaryDark} />
        </View>
      </Pressable>

      <SectionHeader
        eyebrow="Reach us"
        title="Pick how you'd like help"
        subtitle="Instant channels · Real people"
        icon="call-outline"
      />

      <Pressable
        style={styles.callHero}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          dial();
        }}
        accessibilityRole="button"
        accessibilityLabel={`Call ${SUPPORT_CONTACT.phone}`}
      >
        <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={StyleSheet.absoluteFill} />
        <View style={styles.callGlow} />
        <View style={styles.callLeft}>
          <View style={styles.callIconWrap}>
            <Ionicons name="call" size={22} color={colors.primaryDark} />
          </View>
          <View style={styles.callCopy}>
            <Text style={styles.callEyebrow}>Fastest response</Text>
            <Text style={styles.callTitle}>Call partner ops</Text>
            <Text style={styles.callNumber}>{SUPPORT_CONTACT.phone}</Text>
          </View>
        </View>
        <Ionicons name="arrow-forward-circle" size={32} color="rgba(255,255,255,0.9)" />
      </Pressable>

      <View style={styles.channelRow}>
        <Pressable
          style={styles.channelTile}
          onPress={() => {
            Haptics.selectionAsync();
            openWhatsApp();
          }}
          accessibilityRole="button"
        >
          <LinearGradient colors={['#ECFDF5', '#D1FAE5']} style={StyleSheet.absoluteFill} />
          <View style={[styles.channelIcon, { backgroundColor: colors.white }]}>
            <Ionicons name="logo-whatsapp" size={22} color="#027A48" />
          </View>
          <Text style={styles.channelLabel}>WhatsApp</Text>
          <Text style={[styles.channelValue, { color: '#027A48' }]}>Quick text chat</Text>
          <Text style={styles.channelSub}>Best for job updates</Text>
        </Pressable>

        <Pressable
          style={styles.channelTile}
          onPress={() => {
            Haptics.selectionAsync();
            mail();
          }}
          accessibilityRole="button"
        >
          <LinearGradient colors={['#EEF6FF', '#DBEAFE']} style={StyleSheet.absoluteFill} />
          <View style={[styles.channelIcon, { backgroundColor: colors.white }]}>
            <Ionicons name="mail" size={22} color="#175CD3" />
          </View>
          <Text style={styles.channelLabel}>Email us</Text>
          <Text style={[styles.channelValue, { color: '#175CD3' }]} numberOfLines={1}>
            {SUPPORT_CONTACT.email}
          </Text>
          <Text style={styles.channelSub}>Payout & KYC queries</Text>
        </Pressable>
      </View>

      <View style={styles.quickFixRow}>
        {QUICK_FIXES.map((q) => (
          <Pressable
            key={q.id}
            style={styles.quickFix}
            onPress={() => {
              Haptics.selectionAsync();
              chat(q.id, q.label);
            }}
            accessibilityRole="button"
          >
            <Ionicons name={q.icon} size={16} color={colors.primary} />
            <Text style={styles.quickFixText}>{q.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={styles.safetyCard}
        onPress={() => {
          Haptics.selectionAsync();
          alert({
            title: 'Safety & emergencies',
            message:
              'If you feel unsafe at a visit, leave immediately and contact partner ops. We will reassign the job and support you.',
            variant: 'warning',
            icon: 'shield-outline',
            hint: 'Your safety comes first — never stay in an unsafe situation',
            buttons: [
              { text: 'Chat now', onPress: () => chat('safety', 'Safety at visit') },
              { text: 'Call now', onPress: dial },
              { text: 'Dismiss', style: 'cancel' },
            ],
          });
        }}
      >
        <Ionicons name="warning" size={20} color={colors.warning} />
        <View style={styles.safetyCopy}>
          <Text style={styles.safetyTitle}>Safety at a visit</Text>
          <Text style={styles.safetySub}>Tap for emergency steps · 24/7 escalation</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
      </Pressable>

      <SectionHeader
        eyebrow="Self-serve"
        title="Answers in seconds"
        subtitle="Tap to expand"
        icon="help-circle-outline"
      />

      <View style={styles.faqStack}>
        {PARTNER_FAQ_ITEMS.map((item, i) => {
          const open = expandedFaq === i;
          return (
            <Pressable
              key={item.q}
              style={[styles.faqCard, open && styles.faqCardOpen]}
              onPress={() => {
                Haptics.selectionAsync();
                setExpandedFaq(open ? null : i);
              }}
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
            >
              {open ? (
                <LinearGradient colors={['rgba(230,244,242,0.65)', colors.white]} style={StyleSheet.absoluteFill} />
              ) : null}
              <View style={styles.faqHead}>
                <View style={[styles.faqBadge, open && styles.faqBadgeOn]}>
                  <Text style={[styles.faqBadgeText, open && styles.faqBadgeTextOn]}>
                    {String(i + 1).padStart(2, '0')}
                  </Text>
                </View>
                <Text style={[styles.faqQ, open && styles.faqQOpen]}>{item.q}</Text>
                <View style={[styles.faqToggle, open && styles.faqToggleOn]}>
                  <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={open ? colors.white : colors.muted} />
                </View>
              </View>
              {open ? (
                <View style={styles.faqBody}>
                  <Text style={styles.faqA}>{item.a}</Text>
                  <Pressable style={styles.faqChatLink} onPress={() => chat(item.q)} accessibilityRole="button">
                    <Text style={styles.faqChatLinkText}>Still need help? Chat with us</Text>
                    <Ionicons name="arrow-forward" size={14} color={colors.primary} />
                  </Pressable>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.trustStrip}>
        {TRUST_STATS.map((s, i) => (
          <View key={s.label} style={[styles.trustStat, i > 0 && styles.trustStatSep]}>
            <Ionicons name={s.icon} size={14} color={colors.primary} />
            <Text style={styles.trustValue}>{s.value}</Text>
            <Text style={styles.trustLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.hoursBanner}>
        <LinearGradient colors={['#FFF8EE', '#FFFBF5']} style={StyleSheet.absoluteFill} />
        <View style={styles.hoursIcon}>
          <Ionicons name="time" size={20} color="#B54708" />
        </View>
        <View style={styles.hoursCopy}>
          <Text style={styles.hoursTitle}>We&apos;re here {SUPPORT_CONTACT.hours.toLowerCase()}</Text>
          <Text style={styles.hoursSub}>{SUPPORT_CONTACT.replyTime}</Text>
        </View>
        <View style={styles.hoursLive}>
          <View style={styles.hoursDot} />
          <Text style={styles.hoursLiveText}>Open</Text>
        </View>
      </View>
    </View>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.sectionHead}>
      <View style={styles.sectionIcon}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.sectionCopy}>
        <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSub}>{subtitle}</Text>
      </View>
    </View>
  );
}

const GAP = spacing.sm;

const styles = StyleSheet.create({
  block: { marginBottom: spacing.sm },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingHorizontal: layout.pad,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCopy: { flex: 1, gap: 2 },
  sectionEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  sectionTitle: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.ink, letterSpacing: -0.3 },
  sectionSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  chatHero: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
    marginBottom: spacing.md,
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
  chatHeroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#6EE7B7' },
  liveText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.white },
  chatHeroTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    color: colors.white,
    letterSpacing: -0.4,
    marginTop: spacing.xs,
  },
  chatHeroSub: { fontFamily: fonts.regular, fontSize: 13, color: 'rgba(255,255,255,0.78)', lineHeight: 18 },
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
  chatNowText: { fontFamily: fonts.bold, fontSize: 15, color: colors.primaryDark },
  callHero: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  callGlow: {
    position: 'absolute',
    right: -20,
    top: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(110,231,183,0.2)',
  },
  callLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  callIconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callCopy: { flex: 1, gap: 2 },
  callEyebrow: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  callTitle: { fontFamily: fonts.extraBold, fontSize: 18, color: colors.white, letterSpacing: -0.3 },
  callNumber: { fontFamily: fonts.bold, fontSize: 14, color: '#6EE7B7', marginTop: 2 },
  channelRow: { flexDirection: 'row', gap: GAP, paddingHorizontal: layout.pad, marginBottom: spacing.md },
  channelTile: {
    flex: 1,
    minWidth: 0,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: 4,
    overflow: 'hidden',
    minHeight: 148,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.05)',
  },
  channelIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  channelLabel: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  channelValue: { fontFamily: fonts.semiBold, fontSize: 11, lineHeight: 15 },
  channelSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted, marginTop: 2 },
  quickFixRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: layout.pad,
    marginBottom: spacing.md,
  },
  quickFix: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.12)',
  },
  quickFixText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.primaryDark },
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: layout.pad,
    backgroundColor: colors.warningBg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(180,71,8,0.15)',
    marginBottom: spacing.lg,
  },
  safetyCopy: { flex: 1, gap: 2 },
  safetyTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.warning },
  safetySub: { fontFamily: fonts.regular, fontSize: 11, color: colors.inkSecondary },
  faqStack: { paddingHorizontal: layout.pad, gap: spacing.sm, marginBottom: spacing.lg },
  faqCard: {
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    ...shadow.sm,
  },
  faqCardOpen: { borderColor: 'rgba(11,110,103,0.18)' },
  faqHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  faqBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqBadgeOn: { backgroundColor: colors.primary },
  faqBadgeText: { fontFamily: fonts.bold, fontSize: 11, color: colors.muted },
  faqBadgeTextOn: { color: colors.white },
  faqQ: { flex: 1, fontFamily: fonts.bold, fontSize: 14, color: colors.ink, lineHeight: 19 },
  faqQOpen: { color: colors.primaryDark },
  faqToggle: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqToggleOn: { backgroundColor: colors.primary },
  faqBody: { gap: spacing.md, paddingLeft: 42 },
  faqA: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, lineHeight: 20 },
  faqChatLink: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  faqChatLinkText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primary },
  trustStrip: {
    flexDirection: 'row',
    marginHorizontal: layout.pad,
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  trustStat: { flex: 1, alignItems: 'center', gap: 2 },
  trustStatSep: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: colors.divider },
  trustValue: { fontFamily: fonts.extraBold, fontSize: 15, color: colors.ink },
  trustLabel: { fontFamily: fonts.medium, fontSize: 9, color: colors.muted, textAlign: 'center' },
  hoursBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(181,71,8,0.12)',
  },
  hoursIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: '#FFFAEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hoursCopy: { flex: 1, gap: 2 },
  hoursTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  hoursSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  hoursLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.successBg,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  hoursDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  hoursLiveText: { fontFamily: fonts.bold, fontSize: 10, color: colors.success },
});
