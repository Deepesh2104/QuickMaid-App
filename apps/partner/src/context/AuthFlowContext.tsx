import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface AuthFlowState {
  phone: string;
  setPhone: (phone: string) => void;
}

const AuthFlowContext = createContext<AuthFlowState | null>(null);

export function AuthFlowProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState('');

  const value = useMemo(() => ({ phone, setPhone }), [phone]);

  return <AuthFlowContext.Provider value={value}>{children}</AuthFlowContext.Provider>;
}

export function useAuthFlow() {
  const ctx = useContext(AuthFlowContext);
  if (!ctx) throw new Error('useAuthFlow must be used within AuthFlowProvider');
  return ctx;
}
