import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCheckout } from '@/context/CheckoutContext';
import { computeOrderSummary } from '../lib/checkout.utils';
import { CheckoutShell } from './CheckoutShell';
import { CheckoutStickyFooter } from './CheckoutStickyFooter';
import { ProfileEditAddressModal } from '@/features/profile/components/ProfileEditAddressModal';
import { useProfileAccount } from '@/features/profile/hooks/useProfileAccount';
import { getAddressDisplayLabel, getAddressLabelIonicon } from '@/features/profile/lib/profile.utils';
import { getProfileAccount } from '@/features/profile/lib/profile.storage';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function CheckoutAddressScreen() {
  const router = useRouter();
  const { draft, account, updateDraft, refreshAccount } = useCheckout();
  const profileState = useProfileAccount();
  const [showAdd, setShowAdd] = useState(false);
  const summary = account ? computeOrderSummary(draft, account) : null;

  const select = (id: string) => {
    Haptics.selectionAsync();
    updateDraft({ addressId: id });
  };

  return (
    <CheckoutShell
      step="address"
      title="Select address"
      footer={
        summary ? (
          <CheckoutStickyFooter
            amount={summary.payable}
            label="Choose slot"
            sub={draft.addressId ? 'Address selected' : 'Pick a delivery address'}
            disabled={!draft.addressId}
            onPress={() => router.push('/checkout/schedule' as Href)}
          />
        ) : null
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.hint}>Deliver service at</Text>

        {account?.addresses.map((addr) => {
          const on = draft.addressId === addr.id;
          return (
            <Pressable
              key={addr.id}
              style={[styles.card, on && styles.cardOn]}
              onPress={() => select(addr.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
            >
              <View style={styles.radio}>{on ? <View style={styles.radioDot} /> : null}</View>
              <View style={styles.copy}>
                <View style={styles.head}>
                  <View style={styles.labelPill}>
                    <Ionicons name={getAddressLabelIonicon(addr.label)} size={12} color={colors.primaryDark} />
                    <Text style={styles.labelText}>{getAddressDisplayLabel(addr)}</Text>
                  </View>
                  {addr.isDefault ? <Text style={styles.default}>DEFAULT</Text> : null}
                </View>
                <Text style={styles.line}>{addr.line}</Text>
                <Text style={styles.meta}>{addr.zone} · PIN {addr.pincode}</Text>
              </View>
            </Pressable>
          );
        })}

        <Pressable
          style={styles.mapBtn}
          onPress={() => router.push('/account/address-picker?returnTo=checkout' as Href)}
          accessibilityRole="button"
        >
          <Ionicons name="map-outline" size={22} color={colors.primaryDark} />
          <View style={styles.mapCopy}>
            <Text style={styles.mapTitle}>Pick on map</Text>
            <Text style={styles.mapSub}>Drop pin · GPS · Raipur zones</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
        </Pressable>

        <Pressable style={styles.addBtn} onPress={() => setShowAdd(true)} accessibilityRole="button">
          <Ionicons name="create-outline" size={20} color={colors.primary} />
          <Text style={styles.addText}>Enter address manually</Text>
        </Pressable>
      </ScrollView>

      <ProfileEditAddressModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={async (addr) => {
          await profileState.upsertAddress(addr);
          await refreshAccount();
          await profileState.refresh();
          const latest = await getProfileAccount();
          const match = addr.id
            ? latest.addresses.find((a) => a.id === addr.id)
            : latest.addresses.find((a) => a.street === addr.street?.trim());
          if (match) updateDraft({ addressId: match.id });
          setShowAdd(false);
        }}
      />
    </CheckoutShell>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: layout.pad, gap: spacing.md, paddingBottom: 120 },
  hint: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.muted,
    letterSpacing: 0.3,
  },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  cardOn: {
    borderColor: colors.primary,
    backgroundColor: '#F8FDFC',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  copy: { flex: 1, gap: 4 },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  labelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  labelText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.primaryDark,
  },
  default: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.6,
  },
  line: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.ink,
    lineHeight: 20,
  },
  meta: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xxl,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.18)',
  },
  mapCopy: { flex: 1, gap: 2 },
  mapTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  mapSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(11,110,103,0.25)',
    backgroundColor: colors.primaryLight,
  },
  addText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.primaryDark,
  },
});
