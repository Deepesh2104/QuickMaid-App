import type { PartnerAlertOptions } from '@/lib/partner-alert.types';

type PartnerAlertHandler = (options: PartnerAlertOptions) => void;

let alertHandler: PartnerAlertHandler | null = null;

export function registerPartnerAlert(handler: PartnerAlertHandler | null) {
  alertHandler = handler;
}

/** Imperative premium alert — works outside React components when provider is mounted. */
export function partnerAlert(options: PartnerAlertOptions) {
  alertHandler?.(options);
}
