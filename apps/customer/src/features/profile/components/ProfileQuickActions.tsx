import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useStartBooking } from '@/features/checkout/hooks/useStartBooking';
import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface ProfileQuickActionsProps {
  addressCount: number;
  paymentCount: number;
  onEditProfile: () => void;
  onAddAddress: () => void;
  onAddPayment: () => void;
}

const ACTIONS = [
  { id: 'profile', icon: 'person' as const, label: 'Edit profile', getSub: () => 'Personal info', tone: ['#E6F4F2', '#FFFFFF'] as const, ink: colors.primaryDark },
  { id: 'address', icon: 'location' as const, label: 'Addresses', getSub: (a: number) => `${a} saved`, tone: ['#EEF6FF', '#FFFFFF'] as const, ink: '#175CD3' },
  { id: 'pay', icon: 'card' as const, label: 'Payments', getSub: (p: number) => `${p} methods`, tone: ['#FFF8EE', '#FFFFFF'] as const, ink: '#B54708' },
  { id: 'book', icon: 'sparkles' as const, label: 'Book clean', getSub: () => 'New visit', tone: ['#FDF2F8', '#FFFFFF'] as const, ink: '#6941C6' },
];

export function ProfileQuickActions({ addressCount, paymentCount, onEditProfile, onAddAddress, onAddPayment }: ProfileQuickActionsProps) {
  const { bookDefault } = useStartBooking();
  const handlers: Record<string, () => void> = {
    profile: onEditProfile,
    address: onAddAddress,
    pay: onAddPayment,
    book: () => bookDefault(),
  };

  return (
    <View style={styles.block}>
      <HomeSectionHeader eyebrow="Shortcuts" title="Quick actions" subtitle="Tap to edit instantly" icon="flash-outline" compact />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {ACTIONS.map((a) => {
          const sub = a.id === 'address' ? a.getSub(addressCount) : a.id === 'pay' ? a.getSub(paymentCount) : a.getSub(0);
          return (
            <Pressable
              key={a.id}
              style={styles.card}
              onPress={() => {
                Haptics.selectionAsync();
                handlers[a.id]?.();
              }}
              accessibilityRole="button"
            >
              <LinearGradient colors={[...a.tone]} style={StyleSheet.absoluteFill} />
              <View style={[styles.icon, { backgroundColor: colors.white }]}>
                <Ionicons name={a.icon} size={20} color={a.ink} />
              </View>
              <Text style={styles.label}>{a.label}</Text>
              <Text style={styles.sub}>{sub}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const CARD_W = 108;

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  row: {
    paddingHorizontal: layout.pad,
    gap: spacing.sm,
    paddingRight: layout.pad + spacing.sm,
  },
  card: {
    width: CARD_W,
    borderRadius: radius.xl,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    overflow: 'hidden',
    minHeight: 108,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.05)',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.ink,
    textAlign: 'center',
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 9,
    color: colors.muted,
    textAlign: 'center',
  },
});
