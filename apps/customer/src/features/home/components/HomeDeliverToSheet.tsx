import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getAddressDisplayLabel, getAddressLabelIonicon } from '@/features/profile/lib/profile.utils';
import type { SavedAddress } from '@/features/profile/types/profile.types';
import { useTranslation } from '@/i18n/LanguageProvider';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface HomeDeliverToSheetProps {
  visible: boolean;
  addresses: SavedAddress[];
  activeId?: string;
  onClose: () => void;
  onSelect: (addr: SavedAddress) => void;
}

export function HomeDeliverToSheet({
  visible,
  addresses,
  activeId,
  onClose,
  onSelect,
}: HomeDeliverToSheetProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const openMap = (id?: string) => {
    Haptics.selectionAsync();
    onClose();
    const query = id ? `?id=${id}` : '';
    router.push(`/account/address-picker${query}` as Href);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <View style={styles.handle} />
        <View style={styles.head}>
          <Text style={styles.title}>{t('home.deliverSheetTitle')}</Text>
          <Text style={styles.sub}>{t('home.deliverSheetSub')}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {addresses.map((addr) => {
            const on = addr.id === activeId;
            return (
              <Pressable
                key={addr.id}
                style={[styles.card, on && styles.cardOn]}
                onPress={() => {
                  Haptics.selectionAsync();
                  onSelect(addr);
                  onClose();
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
              >
                <View style={styles.radio}>{on ? <View style={styles.radioDot} /> : null}</View>
                <View style={styles.copy}>
                  <View style={styles.labelRow}>
                    <View style={styles.labelPill}>
                      <Ionicons name={getAddressLabelIonicon(addr.label)} size={12} color={colors.primaryDark} />
                      <Text style={styles.labelText}>{getAddressDisplayLabel(addr)}</Text>
                    </View>
                    {on ? <Text style={styles.activeTag}>ACTIVE</Text> : null}
                  </View>
                  <Text style={styles.line} numberOfLines={2}>
                    {addr.line}
                  </Text>
                  <Text style={styles.meta}>
                    {addr.zone} · PIN {addr.pincode}
                  </Text>
                </View>
                <Pressable
                  style={styles.editBtn}
                  onPress={() => openMap(addr.id)}
                  accessibilityLabel={`Edit ${getAddressDisplayLabel(addr)} on map`}
                >
                  <Ionicons name="map-outline" size={16} color={colors.primary} />
                </Pressable>
              </Pressable>
            );
          })}

          <Pressable style={styles.mapBtn} onPress={() => openMap()} accessibilityRole="button">
            <LinearGradient colors={['#E6F4F2', '#FFFFFF']} style={StyleSheet.absoluteFill} />
            <Ionicons name="map" size={20} color={colors.primaryDark} />
            <View style={styles.mapCopy}>
              <Text style={styles.mapTitle}>Pick on map</Text>
              <Text style={styles.mapSub}>GPS · Raipur zones · Drop pin</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,20,25,0.45)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    maxHeight: '72%',
    paddingTop: spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginBottom: spacing.md,
  },
  head: {
    paddingHorizontal: layout.pad,
    marginBottom: spacing.md,
    gap: 4,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  list: {
    paddingHorizontal: layout.pad,
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: 'rgba(15,20,25,0.06)',
    backgroundColor: colors.white,
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
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  copy: { flex: 1, gap: 4, minWidth: 0 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
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
  activeTag: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  line: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.ink,
    lineHeight: 18,
  },
  meta: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.18)',
    marginTop: spacing.xs,
  },
  mapCopy: { flex: 1, gap: 2 },
  mapTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  mapSub: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
});
