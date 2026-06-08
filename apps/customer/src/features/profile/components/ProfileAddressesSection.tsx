import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import type { SavedAddress } from '../types/profile.types';

interface ProfileAddressesSectionProps {
  addresses: SavedAddress[];
  onAdd: () => void;
  onEdit: (id: string) => void;
}

export function ProfileAddressesSection({ addresses, onAdd, onEdit }: ProfileAddressesSectionProps) {
  return (
    <View style={styles.block}>
      <HomeSectionHeader
        eyebrow="Locations"
        title="Saved addresses"
        subtitle={`${addresses.length} place${addresses.length === 1 ? '' : 's'} · Tap to edit`}
        icon="location-outline"
        actionLabel="Add new"
        onAction={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onAdd();
        }}
        compact
      />

      <View style={styles.list}>
        {addresses.map((addr) => (
          <Pressable
            key={addr.id}
            style={styles.card}
            onPress={() => {
              Haptics.selectionAsync();
              onEdit(addr.id);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${addr.label} address`}
          >
            <LinearGradient colors={addr.isDefault ? ['#E6F4F2', '#FFFFFF'] : ['#FAFBFC', '#FFFFFF']} style={StyleSheet.absoluteFill} />
            <View style={[styles.icon, addr.isDefault && styles.iconDefault]}>
              <Ionicons name={addr.label === 'Home' ? 'home' : addr.label === 'Office' ? 'business' : 'location'} size={18} color={colors.primaryDark} />
            </View>
            <View style={styles.copy}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>{addr.label}</Text>
                {addr.isDefault ? (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.line} numberOfLines={2}>{addr.line}</Text>
              <Text style={styles.meta}>{addr.zone} · PIN {addr.pincode}</Text>
              {addr.landmark ? <Text style={styles.landmark}>{addr.landmark}</Text> : null}
            </View>
            <View style={styles.editIcon}>
              <Ionicons name="create-outline" size={16} color={colors.primary} />
            </View>
          </Pressable>
        ))}

        <Pressable style={styles.addCard} onPress={onAdd} accessibilityRole="button">
          <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
          <Text style={styles.addText}>Add another address</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  list: {
    paddingHorizontal: layout.pad,
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconDefault: { backgroundColor: colors.primaryLight },
  copy: { flex: 1, gap: 2, minWidth: 0 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  defaultBadge: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  defaultText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.white,
    textTransform: 'uppercase',
  },
  line: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
  meta: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.primaryDark,
  },
  landmark: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.mutedLight,
  },
  editIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(11,110,103,0.2)',
    borderStyle: 'dashed',
  },
  addText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.primaryDark,
  },
});
