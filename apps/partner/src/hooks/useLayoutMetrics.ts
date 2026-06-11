import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  contentInnerWidth,
  isCompactWidth,
  isNarrowWidth,
  isShortScreen,
  tabBarTotalHeight,
  tabScrollPadding,
} from '@/theme/layout.metrics';
import { layout } from '@/theme/spacing';

export function useLayoutMetrics() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(
    () => ({
      width,
      height,
      insets,
      pad: layout.pad,
      isCompact: isCompactWidth(width),
      isNarrow: isNarrowWidth(width),
      isShort: isShortScreen(height),
      contentWidth: contentInnerWidth(width),
      tabBarH: tabBarTotalHeight(insets.bottom),
      tabScrollPad: tabScrollPadding(insets.bottom),
    }),
    [width, height, insets.bottom, insets.top],
  );
}
