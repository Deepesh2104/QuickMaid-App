import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  contentInnerWidth,
  isCompactWidth,
  isNarrowWidth,
  isShortScreen,
  railCardWidth,
  serviceCardWidth,
  tabBarTotalHeight,
  plusStickyScrollPadding,
  tabScrollPadding,
  threeColWidth,
  twoColWidth,
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
      twoColW: twoColWidth(width),
      threeColW: threeColWidth(width),
      railCardW: railCardWidth(width),
      railCardW58: railCardWidth(width, 0.58),
      railCardW78: railCardWidth(width, 0.78),
      serviceCardW: serviceCardWidth(width),
      tabBarH: tabBarTotalHeight(insets.bottom),
      tabScrollPad: tabScrollPadding(insets.bottom),
      plusStickyScrollPad: plusStickyScrollPadding(insets.bottom),
    }),
    [width, height, insets.bottom, insets.top],
  );
}
