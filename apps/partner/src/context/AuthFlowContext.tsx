import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface AuthFlowState {
  phone: string;
  setPhone: (phone: string) => void;
  /** Referral code entered during new-partner signup (optional) */
  referralCode: string;
  setReferralCode: (code: string) => void;
}

const AuthFlowContext = createContext<AuthFlowState | null>(null);

export function AuthFlowProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const value = useMemo(
    () => ({ phone, setPhone, referralCode, setReferralCode }),
    [phone, referralCode],
  );

  return <AuthFlowContext.Provider value={value}>{children}</AuthFlowContext.Provider>;
}

export function useAuthFlow() {
  const ctx = useContext(AuthFlowContext);
  if (!ctx) throw new Error('useAuthFlow must be used within AuthFlowProvider');
  return ctx;
}
