import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import type { UpiAppDef } from '../constants/gateway';
import { canOpenGenericUpi, detectInstalledUpiApps } from '../lib/upi.apps';

export function useInstalledUpiApps(enabled = true) {
  const [apps, setApps] = useState<UpiAppDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [chooserAvailable, setChooserAvailable] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const [installed, generic] = await Promise.all([
        detectInstalledUpiApps(),
        canOpenGenericUpi(),
      ]);

      if (cancelled) return;

      setApps(installed);
      setChooserAvailable(generic || Platform.OS === 'android');
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { apps, loading, chooserAvailable };
}
