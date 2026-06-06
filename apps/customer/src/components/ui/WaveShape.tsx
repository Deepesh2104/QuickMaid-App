import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';

interface WaveShapeProps {
  fill?: string;
  style?: ViewStyle;
  height?: number;
}

export function WaveShape({
  fill = colors.primaryDark,
  style,
  height = 72,
}: WaveShapeProps) {
  return (
    <View style={[styles.wrap, { height }, style]}>
      <View style={[styles.waveMain, { backgroundColor: fill }]} />
      <View style={[styles.waveBump, { backgroundColor: fill }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  waveMain: {
    position: 'absolute',
    bottom: 0,
    left: -24,
    right: -24,
    height: '100%',
    borderTopLeftRadius: 200,
    borderTopRightRadius: 48,
  },
  waveBump: {
    position: 'absolute',
    bottom: 0,
    right: -60,
    width: 220,
    height: '85%',
    borderTopLeftRadius: 120,
  },
});
