import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { getAuthComplete } from '@/lib/storage';

import { getAppLockSettings, subscribeAppLockSettings } from '../lib/appLock.storage';
import type { AppLockSettings } from '../types/appLock.types';
import { AppLockOverlay } from './AppLockOverlay';

interface AppLockGateProps {
  children: React.ReactNode;
}

export function AppLockGate({ children }: AppLockGateProps) {
  const [settings, setSettings] = useState<AppLockSettings | null>(null);
  const [locked, setLocked] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const appState = useRef(AppState.currentState);
  const initialCheckDone = useRef(false);

  const reload = useCallback(async () => {
    const [auth, lockSettings] = await Promise.all([getAuthComplete(), getAppLockSettings()]);
    setAuthReady(auth);
    setSettings(lockSettings);

    if (!auth || !lockSettings.enabled) {
      setLocked(false);
      initialCheckDone.current = true;
      return;
    }

    if (!initialCheckDone.current) {
      setLocked(true);
      initialCheckDone.current = true;
    }
  }, []);

  useEffect(() => {
    void reload();
    return subscribeAppLockSettings(() => {
      void reload();
    });
  }, [reload]);

  useEffect(() => {
    const onChange = (next: AppStateStatus) => {
      const wasBackground = appState.current.match(/inactive|background/);
      const isActive = next === 'active';

      if (wasBackground && isActive && authReady && settings?.enabled) {
        setLocked(true);
      }
      appState.current = next;
    };

    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [authReady, settings?.enabled]);

  const showLock = Boolean(authReady && settings?.enabled && locked && settings.pinHash);

  return (
    <>
      {children}
      {settings ? (
        <AppLockOverlay
          visible={showLock}
          settings={settings}
          onUnlock={() => setLocked(false)}
        />
      ) : null}
    </>
  );
}
