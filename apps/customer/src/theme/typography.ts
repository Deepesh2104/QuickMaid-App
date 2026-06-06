import { TextStyle } from 'react-native';

export const type: Record<string, TextStyle> = {
  display: { fontSize: 32, fontWeight: '700', letterSpacing: -0.8, lineHeight: 38 },
  hero: { fontSize: 28, fontWeight: '700', letterSpacing: -0.6, lineHeight: 34 },
  h1: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5, lineHeight: 30 },
  h2: { fontSize: 20, fontWeight: '600', letterSpacing: -0.3, lineHeight: 26 },
  h3: { fontSize: 17, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodySm: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.4, textTransform: 'uppercase' },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600', letterSpacing: 0 },
  overline: { fontSize: 11, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase' },
};
