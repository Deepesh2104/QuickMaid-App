import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { useOpenSupport } from '@/features/help/hooks/useOpenSupport';
import { useOpenBookingDocument } from '../hooks/useOpenBookingDocument';
import { useOpenCancelBooking } from '../hooks/useOpenCancelBooking';
import { useOpenReschedule } from '../hooks/useOpenReschedule';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const HERO = {
  icon: 'calendar' as const,
  title: 'Reschedule visit',
  sub: 'Free up to 2 hours before your slot',
  cta: 'Change slot',
};

const ROWS = [
  {
    id: 'invoice',
    icon: 'document-text-outline' as const,
    label: 'Download invoice',
    sub: 'PDF for your records',
    tone: '#EEF6FF',
    ink: '#175CD3',
  },
  {
    id: 'receipt',
    icon: 'receipt-outline' as const,
    label: 'Payment receipt',
    sub: 'UPI or card proof',
    tone: '#FFF8EE',
    ink: '#B54708',
  },
  {
    id: 'cancel',
    icon: 'close-circle-outline' as const,
    label: 'Cancel booking',
    sub: 'No fee if 2+ hrs left',
    tone: '#FEF3F2',
    ink: '#D92D20',
  },
  {
    id: 'help',
    icon: 'chatbubble-ellipses-outline' as const,
    label: 'Chat with support',
    sub: 'Typical reply under 5 min',
    tone: '#E6F4F2',
    ink: colors.primaryDark,
  },
];

interface BookingsQuickActionsProps {
  upcomingBookingId?: string;
  documentBookingId?: string;
}

export function BookingsQuickActions({ upcomingBookingId, documentBookingId }: BookingsQuickActionsProps) {
  const openReschedule = useOpenReschedule();
  const openCancel = useOpenCancelBooking();
  const openDocument = useOpenBookingDocument();
  const openSupport = useOpenSupport();

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Quick actions"
        title="Manage your visit"
        subtitle="Reschedule, invoices & support"
        icon="flash-outline"
        compact
      />

      <Pressable
        style={styles.hero}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          if (upcomingBookingId) openReschedule(upcomingBookingId);
        }}
        accessibilityRole="button"
        accessibilityLabel={HERO.title}
      >
        <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={StyleSheet.absoluteFill} />
        <View style={styles.heroGlow} />
        <View style={styles.heroLeft}>
          <View style={styles.heroIcon}>
            <Ionicons name={HERO.icon} size={22} color={colors.primaryDark} />
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>{HERO.title}</Text>
            <Text style={styles.heroSub}>{HERO.sub}</Text>
          </View>
        </View>
        <View style={styles.heroCta}>
          <Text style={styles.heroCtaText}>{HERO.cta}</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.primaryDark} />
        </View>
      </Pressable>

      <View style={styles.list}>
        {ROWS.map((r, i) => (
          <Pressable
            key={r.id}
            style={[styles.row, i < ROWS.length - 1 && styles.rowBorder]}
            onPress={() => {
              Haptics.selectionAsync();
              if (r.id === 'cancel' && upcomingBookingId) openCancel(upcomingBookingId);
              if (r.id === 'invoice' && documentBookingId) openDocument(documentBookingId, 'invoice');
              if (r.id === 'receipt' && documentBookingId) openDocument(documentBookingId, 'receipt');
              if (r.id === 'help') openSupport({ chat: true, topic: 'Booking help' });
            }}
            accessibilityRole="button"
            accessibilityLabel={r.label}
          >
            <View style={[styles.rowIcon, { backgroundColor: r.tone }]}>
              <Ionicons name={r.icon} size={18} color={r.ink} />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowLabel}>{r.label}</Text>
              <Text style={styles.rowSub}>{r.sub}</Text>
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
  hero: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  heroGlow: {
    position: 'absolute',
    right: -20,
    top: -30,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(110,231,183,0.2)',
  },
  heroLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: { flex: 1, gap: 2 },
  heroTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.white,
    letterSpacing: -0.2,
  },
  heroSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 15,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  heroCtaText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  list: {
    marginHorizontal: layout.pad,
    backgroundColor: colors.bg,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
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
