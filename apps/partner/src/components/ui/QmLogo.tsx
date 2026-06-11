import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';
import { radius } from '@/theme/spacing';

interface QmLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  light?: boolean;
}

const SIZES = { sm: 36, md: 44, lg: 52 };

export function QmLogo({ size = 'md', showText = true, light = false }: QmLogoProps) {
  const box = SIZES[size];
  const markSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const textSize = size === 'sm' ? 20 : size === 'md' ? 22 : 26;

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.box,
          light && styles.boxLight,
          { width: box, height: box, borderRadius: radius.md },
        ]}
      >
        <Text style={[styles.mark, { fontSize: markSize }]}>Q</Text>
      </View>
      {showText ? (
        <View>
          <Text style={[styles.text, { fontSize: textSize, color: light ? colors.white : colors.ink }]}>
            QuickMaid
          </Text>
          <Text style={[styles.sub, { color: light ? 'rgba(255,255,255,0.82)' : colors.muted }]}>Partner</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  box: {
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxLight: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  mark: { fontFamily: fonts.extraBold, color: colors.white },
  text: { fontFamily: fonts.bold, letterSpacing: -0.5, lineHeight: 26 },
  sub: { fontFamily: fonts.semiBold, fontSize: 11, letterSpacing: 0.6, marginTop: -2 },
});
