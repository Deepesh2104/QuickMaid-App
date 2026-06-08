import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../../theme/fonts';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface LocationHeaderProps {
  city: string;
  address?: string;
  onPress?: () => void;
}

export function LocationHeader({ city, address, onPress }: LocationHeaderProps) {
  return (
    <Pressable style={styles.wrap} onPress={onPress}>
      <View style={styles.icon}>
        <Ionicons name="location" size={16} color={colors.primary} />
      </View>
      <View style={styles.text}>
        <View style={styles.cityRow}>
          <Text style={styles.city}>{city}</Text>
          <Ionicons name="chevron-down" size={14} color={colors.muted} />
        </View>
        {address && <Text style={styles.address} numberOfLines={1}>{address}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
  cityRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  city: { ...type.bodySm, fontFamily: fonts.bold, color: colors.ink },
  address: { ...type.caption, color: colors.muted, marginTop: 1 },
});
