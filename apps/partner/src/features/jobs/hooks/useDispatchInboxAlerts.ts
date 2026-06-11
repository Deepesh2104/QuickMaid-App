import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';

import { usePartnerAlert } from '@/context/PartnerAlertContext';
import { subscribeDispatchEvents } from '@/features/jobs/lib/dispatch.events';
import { usePartnerI18n } from '@/i18n/usePartnerI18n';

/** Manual dispatch: haptic + lightweight alerts when offers change. */
export function useDispatchInboxAlerts(enabled: boolean) {
  const { alert } = usePartnerAlert();
  const { t } = usePartnerI18n();

  useEffect(() => {
    if (!enabled) return;
    return subscribeDispatchEvents((event) => {
      if (event.type === 'new_offer') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        alert({
          title: t('dispatchPulse'),
          message: `${event.bookingRef} — ${t('manualOffers')}`,
        });
      } else if (event.type === 'offer_expired') {
        alert({
          title: t('offerExpired'),
          message: `${event.bookingRef} — ${t('offerPassedNext')}`,
        });
      }
    });
  }, [enabled, alert, t]);
}
