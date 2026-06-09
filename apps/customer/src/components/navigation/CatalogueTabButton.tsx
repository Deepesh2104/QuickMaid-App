import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/spacing';

import { useTranslation } from '@/i18n/LanguageProvider';

import { TabBarButton } from './TabBarButton';

type CatalogueTabButtonProps = {
  onPress?: ((event: GestureResponderEvent) => void) | null;
  onLongPress?: ((event: GestureResponderEvent) => void) | null;
  style?: StyleProp<ViewStyle>;
  accessibilityState?: { selected?: boolean; disabled?: boolean };
  accessibilityLabel?: string;
  testID?: string;
};

export function CatalogueTabButton({
  onPress,
  onLongPress,
  style,
  accessibilityState,
  accessibilityLabel,
  testID,
}: CatalogueTabButtonProps) {
  const { t } = useTranslation();
  const focused = accessibilityState?.selected;
  const label = t('tabs.catalogue');

  return (
    <TabBarButton
      onPress={onPress}
      onLongPress={onLongPress}
      style={[style, styles.wrap]}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel ?? label}
      testID={testID}
    >
      <LinearGradient
        colors={focused ? ['#0B6E67', '#0D9488'] : ['#14B8A6', '#0B6E67']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fab}
      >
        <Ionicons name="grid" size={22} color={colors.white} />
      </LinearGradient>
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
    </TabBarButton>
  );
}

const styles = StyleSheet.create({
  wrap: {
    top: -14,
    justifyContent: 'flex-start',
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.bg,
    shadowColor: '#0B6E67',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 8,
  },
  label: {
    marginTop: 4,
    fontFamily: fonts.semiBold,
    fontSize: 10,
    lineHeight: 13,
    color: colors.mutedLight,
  },
  labelFocused: {
    color: colors.primary,
  },
});
