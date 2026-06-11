import type { Ionicons } from '@expo/vector-icons';

export type PartnerAlertVariant = 'teal' | 'info' | 'warning' | 'danger' | 'success';

export type PartnerAlertButtonStyle = 'default' | 'cancel' | 'destructive';

export interface PartnerAlertButton {
  text: string;
  style?: PartnerAlertButtonStyle;
  onPress?: () => void;
}

export interface PartnerAlertOptions {
  title: string;
  message?: string;
  variant?: PartnerAlertVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  hint?: string;
  buttons?: PartnerAlertButton[];
}

export interface PartnerAlertState extends PartnerAlertOptions {
  id: number;
}
