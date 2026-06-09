import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getProfileAccount, subscribeProfileAccount } from '@/features/profile/lib/profile.storage';

import { en } from './en';
import { getGreetingPeriod } from './greeting';
import { hi } from './hi';
import { formatTranslation, resolveTranslation } from './resolve';
import type { AppLocale } from './types';

interface LanguageContextValue {
  locale: AppLocale;
  t: (key: string, vars?: Record<string, string | number>) => string;
  greeting: (firstName?: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<AppLocale>('en');

  const reload = useCallback(async () => {
    const account = await getProfileAccount();
    setLocale(account.language ?? 'en');
  }, []);

  useEffect(() => {
    void reload();
    return subscribeProfileAccount(() => {
      void reload();
    });
  }, [reload]);

  const tree = locale === 'hi' ? hi : en;

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const raw = resolveTranslation(tree, key);
      return formatTranslation(raw, vars);
    },
    [tree],
  );

  const greeting = useCallback(
    (firstName?: string) => {
      const base = t(`greeting.${getGreetingPeriod()}`);
      return firstName ? `${base}, ${firstName}` : base;
    },
    [t],
  );

  const value = useMemo(() => ({ locale, t, greeting }), [locale, t, greeting]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return ctx;
}
