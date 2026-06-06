import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface AuthFlowState {
  city: string;
  phone: string;
  name: string;
  email: string;
  gender: string;
  homeType: string;
  locality: string;
  setCity: (city: string) => void;
  setPhone: (phone: string) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setGender: (gender: string) => void;
  setHomeType: (homeType: string) => void;
  setLocality: (locality: string) => void;
}

const AuthFlowContext = createContext<AuthFlowState | null>(null);

export function AuthFlowProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState('Raipur');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [homeType, setHomeType] = useState('');
  const [locality, setLocality] = useState('');

  const value = useMemo(
    () => ({
      city,
      phone,
      name,
      email,
      gender,
      homeType,
      locality,
      setCity,
      setPhone,
      setName,
      setEmail,
      setGender,
      setHomeType,
      setLocality,
    }),
    [city, phone, name, email, gender, homeType, locality],
  );

  return <AuthFlowContext.Provider value={value}>{children}</AuthFlowContext.Provider>;
}

export function useAuthFlow() {
  const ctx = useContext(AuthFlowContext);
  if (!ctx) throw new Error('useAuthFlow must be used within AuthFlowProvider');
  return ctx;
}
