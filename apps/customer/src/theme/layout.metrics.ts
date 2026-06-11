import { Platform } from 'react-native';

import { layout, spacing } from './spacing';

/** Must match `app/(tabs)/_layout.tsx` tab bar content height */
export const TAB_BAR_CONTENT_HEIGHT = 52;
const TAB_BAR_TOP_PADDING = 6;

export function tabBarBottomInset(bottomInset: number): number {
  return Math.max(bottomInset, Platform.OS === 'android' ? 10 : 8);
}

export function tabBarTotalHeight(bottomInset: number): number {
  return TAB_BAR_CONTENT_HEIGHT + tabBarBottomInset(bottomInset) + TAB_BAR_TOP_PADDING;
}

/** Small tail gap for tab scroll content. Tab scenes already sit above the tab bar. */
export function tabScrollPadding(_bottomInset: number, extra: number = spacing.md): number {
  return extra;
}

/** Clears the floating subscribe CTA on the Plus tab (tab bar is already in layout). */
export function plusStickyScrollPadding(_bottomInset: number): number {
  return 96 + spacing.md;
}

export function contentInnerWidth(screenWidth: number): number {
  return screenWidth - layout.pad * 2;
}

export function twoColWidth(screenWidth: number, gap = spacing.md): number {
  return (contentInnerWidth(screenWidth) - gap) / 2;
}

export function threeColWidth(screenWidth: number, gap = spacing.sm): number {
  return (contentInnerWidth(screenWidth) - gap * 2) / 3;
}

export function railCardWidth(screenWidth: number, ratio = 0.82): number {
  return Math.round(screenWidth * ratio);
}

export function serviceCardWidth(screenWidth: number): number {
  return (screenWidth - layout.pad * 2 - layout.cardGap) / 2;
}

export function isCompactWidth(screenWidth: number): boolean {
  return screenWidth < 360;
}

export function isNarrowWidth(screenWidth: number): boolean {
  return screenWidth < 340;
}

export function isShortScreen(screenHeight: number): boolean {
  return screenHeight < 700;
}
