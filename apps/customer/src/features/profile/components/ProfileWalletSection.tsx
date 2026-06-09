import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import type { PaymentMethod } from '../types/profile.types';
import { ProfileWalletPass } from './ProfileWalletPass';

const TYPE_GRAD: Record<string, readonly [string, string, string]> = {
  upi: ['#1A3A6B', '#2D5AA0', '#1E4080'],
  card: ['#0F1419', '#1A2E2C', '#084F4A'],
  wallet: ['#084F4A', '#0B6E67', '#12A598'],
};

interface ProfileWalletSectionProps {
  balance: number;
  payments: PaymentMethod[];
  onTopUp: () => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
}

export function ProfileWalletSection({ balance, payments, onTopUp, onAdd, onEdit }: ProfileWalletSectionProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const narrow = width < 360;
  const methods = payments.filter((p) => p.type !== 'wallet');
  const defaultPm = payments.find((p) => p.isDefault && p.type !== 'wallet');

  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Payments"
        title="Wallet & methods"
        subtitle="Instant checkout · Pay after service"
        icon="wallet-outline"
        actionLabel="Add"
        onAction={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onAdd();
        }}
        compact
      />

      <View style={styles.walletWrap}>
        <ProfileWalletPass
          balance={balance}
          compact={narrow}
          onTopUp={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onTopUp();
          }}
        />
        <Pressable
          style={styles.historyLink}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/account/wallet-transactions' as Href);
          }}
          accessibilityRole="button"
        >
          <Ionicons name="receipt-outline" size={14} color={colors.primary} />
          <Text style={styles.historyText}>View transaction history</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.mutedLight} />
        </Pressable>
      </View>

      <View style={styles.statsStrip}>
        <View style={styles.stat}>
          <Text style={[styles.statVal, narrow && styles.statValSm]}>{methods.length}</Text>
          <Text style={styles.statLabel}>{narrow ? 'Methods' : 'Saved methods'}</Text>
        </View>
        <View style={styles.statSep} />
        <View style={styles.stat}>
          <Text style={[styles.statVal, narrow && styles.statValSm]} numberOfLines={1}>
            {defaultPm?.label ?? '—'}
          </Text>
          <Text style={styles.statLabel}>Default</Text>
        </View>
        <View style={styles.statSep} />
        <View style={styles.stat}>
          <Ionicons name="shield-checkmark" size={narrow ? 12 : 14} color={colors.primary} />
          <Text style={styles.statLabel}>{narrow ? 'Secure' : 'Encrypted'}</Text>
        </View>
      </View>

      <Text style={styles.methodsEyebrow}>PAYMENT METHODS</Text>
      <View style={styles.methods}>
        {methods.map((pm) => {
          const grad = TYPE_GRAD[pm.type] ?? TYPE_GRAD.card;
          return (
            <Pressable
              key={pm.id}
              style={styles.methodCard}
              onPress={() => {
                Haptics.selectionAsync();
                onEdit(pm.id);
              }}
              accessibilityRole="button"
            >
              <LinearGradient colors={[...grad]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <View style={styles.methodShine} pointerEvents="none" />

              <View style={styles.methodTop}>
                <View style={styles.methodChip} />
                {pm.isDefault ? (
                  <View style={styles.methodDefault}>
                    <Ionicons name="star" size={9} color="#FCD34D" />
                    <Text style={styles.methodDefaultText}>DEFAULT</Text>
                  </View>
                ) : (
                  <Ionicons name={pm.icon} size={18} color="rgba(255,255,255,0.45)" />
                )}
              </View>

              <Text style={styles.methodType}>{pm.type === 'upi' ? 'UPI' : 'CARD'}</Text>
              <Text style={styles.methodLabel}>{pm.label}</Text>
              <Text style={styles.methodDetail}>{pm.detail}</Text>

              <View style={styles.methodFoot}>
                <Ionicons name="create-outline" size={14} color="rgba(255,255,255,0.6)" />
                <Text style={styles.methodEdit}>Tap to edit</Text>
              </View>
            </Pressable>
          );
        })}

        <Pressable
          style={styles.addCard}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onAdd();
          }}
          accessibilityRole="button"
          accessibilityLabel="Add payment method"
        >
          <View style={styles.addIcon}>
            <Ionicons name="add" size={24} color={colors.primary} />
          </View>
          <Text style={styles.addLabel}>Add payment method</Text>
          <Text style={styles.addSub}>UPI · Debit · Credit</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  walletWrap: {
    marginHorizontal: layout.pad,
    marginBottom: spacing.md,
    alignSelf: 'stretch',
    gap: spacing.sm,
  },
  historyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 2,
  },
  historyText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primaryDark,
    flex: 1,
  },
  statsStrip: {
    flexDirection: 'row',
    marginHorizontal: layout.pad,
    marginBottom: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.xs,
  },
  statSep: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: 4,
  },
  statVal: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.ink,
    textAlign: 'center',
    maxWidth: '100%',
  },
  statValSm: {
    fontSize: 11,
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
  },
  methodsEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 1.2,
    marginHorizontal: layout.pad,
    marginBottom: spacing.sm,
  },
  methods: {
    marginHorizontal: layout.pad,
    gap: spacing.md,
  },
  methodCard: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    minHeight: 130,
    overflow: 'hidden',
    gap: 2,
  },
  methodShine: {
    position: 'absolute',
    top: -40,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  methodTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  methodChip: {
    width: 32,
    height: 22,
    borderRadius: 5,
    backgroundColor: 'rgba(252,211,77,0.8)',
  },
  methodDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  methodDefaultText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: '#FCD34D',
    letterSpacing: 0.6,
  },
  methodType: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 1.2,
  },
  methodLabel: {
    fontFamily: fonts.extraBold,
    fontSize: 17,
    color: colors.white,
    letterSpacing: -0.3,
  },
  methodDetail: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },
  methodFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
  },
  methodEdit: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  addCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderRadius: radius.xxl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(11,110,103,0.25)',
    backgroundColor: colors.primaryLight,
    gap: spacing.xs,
  },
  addIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.15)',
  },
  addLabel: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.primaryDark,
  },
  addSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
});
