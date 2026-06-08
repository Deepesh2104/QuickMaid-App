import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export const PAGE_SIZE = 5;

export const premium = {
  section: {
    marginBottom: spacing.section,
  } as const,
  surface: {
    backgroundColor: colors.bg,
    borderRadius: radius.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  } as const,
  surfaceSoft: {
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.05)',
  } as const,
  pad: layout.pad,
  iconGradient: ['#E6F4F2', '#FFFFFF'] as const,
  heroGradient: ['rgba(11,110,103,0.95)', 'rgba(8,79,74,0.88)'] as const,
  glass: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  } as const,
};
