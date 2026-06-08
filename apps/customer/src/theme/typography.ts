import { TextStyle } from 'react-native';

import { fonts } from './fonts';

export const type: Record<string, TextStyle> = {
  display: {
    fontFamily: fonts.extraBold,
    fontSize: 32,
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  hero: {
    fontFamily: fonts.bold,
    fontSize: 28,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  h1: {
    fontFamily: fonts.bold,
    fontSize: 24,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  h2: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  h3: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    lineHeight: 24,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodySm: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    letterSpacing: 0,
  },
  overline: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
};
