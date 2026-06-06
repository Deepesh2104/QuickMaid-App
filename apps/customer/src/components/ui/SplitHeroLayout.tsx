import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { WaveShape } from './WaveShape';

interface SplitHeroLayoutProps {
  top: ReactNode;
  bottom: ReactNode;
  bottomColor?: string;
  style?: ViewStyle;
}

export function SplitHeroLayout({
  top,
  bottom,
  bottomColor = colors.primaryDark,
  style,
}: SplitHeroLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.top, { paddingTop: insets.top + spacing.lg }]}>
        {top}
      </View>

      <WaveShape fill={bottomColor} height={72} style={styles.wave} />

      <View style={[styles.bottom, { backgroundColor: bottomColor, paddingBottom: insets.bottom + spacing.xl }]}>
        {bottom}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  top: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'center',
    minHeight: '42%',
  },
  wave: {
    marginTop: -1,
  },
  bottom: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    minHeight: '38%',
    justifyContent: 'space-between',
  },
});
