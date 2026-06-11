import type { ReactNode } from 'react';
import {
  type AccessibilityRole,
  type GestureResponderEvent,
  type StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  type ViewStyle,
  View,
} from 'react-native';

type TabBarButtonProps = {
  children: ReactNode;
  onPress?: ((event: GestureResponderEvent) => void) | null;
  onLongPress?: ((event: GestureResponderEvent) => void) | null;
  style?: StyleProp<ViewStyle>;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: { selected?: boolean; disabled?: boolean };
  accessibilityLabel?: string;
  testID?: string;
};

/** Bottom tab item without Android ripple / gray press circle. */
export function TabBarButton({
  children,
  onPress,
  onLongPress,
  style,
  accessibilityRole,
  accessibilityState,
  accessibilityLabel,
  testID,
}: TabBarButtonProps) {
  return (
    <TouchableWithoutFeedback
      onPress={onPress ?? undefined}
      onLongPress={onLongPress ?? undefined}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <View style={[style, styles.item]}>{children}</View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
