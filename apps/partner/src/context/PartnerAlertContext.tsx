import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { PartnerPremiumAlert } from '@/components/ui/PartnerPremiumAlert';
import { registerPartnerAlert } from '@/lib/partner-alert';
import type { PartnerAlertOptions, PartnerAlertState } from '@/lib/partner-alert.types';

interface PartnerAlertContextValue {
  alert: (options: PartnerAlertOptions) => void;
}

const PartnerAlertContext = createContext<PartnerAlertContextValue | null>(null);

export function PartnerAlertProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PartnerAlertState | null>(null);

  const alert = useCallback((options: PartnerAlertOptions) => {
    setState({ ...options, id: Date.now() });
  }, []);

  const dismiss = useCallback(() => {
    setState(null);
  }, []);

  useEffect(() => {
    registerPartnerAlert(alert);
    return () => registerPartnerAlert(null);
  }, [alert]);

  const value = useMemo(() => ({ alert }), [alert]);

  return (
    <PartnerAlertContext.Provider value={value}>
      {children}
      <PartnerPremiumAlert
        visible={state != null}
        title={state?.title ?? ''}
        message={state?.message}
        variant={state?.variant}
        icon={state?.icon}
        hint={state?.hint}
        buttons={state?.buttons}
        onDismiss={dismiss}
      />
    </PartnerAlertContext.Provider>
  );
}

export function usePartnerAlert() {
  const ctx = useContext(PartnerAlertContext);
  if (!ctx) throw new Error('usePartnerAlert must be used within PartnerAlertProvider');
  return ctx;
}
