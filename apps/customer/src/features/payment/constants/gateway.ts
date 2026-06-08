import type { Ionicons } from '@expo/vector-icons';

export const PAYMENT_GATEWAY = {
  id: 'razorpay' as const,
  name: 'Razorpay',
  merchant: 'QuickMaid Services',
  currency: 'INR',
  /** Demo merchant VPA — replace with live Razorpay VPA in production */
  merchantVpa: 'quickmaid@razorpay',
  /** Replace with live key from env / API in production */
  keyId: 'rzp_test_QuickMaid',
  theme: '#0B6E67',
} as const;

export interface UpiAppDef {
  id: string;
  label: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  schemes: string[];
  androidPackage?: string;
}

/** Known Indian UPI apps — filtered at runtime to ones installed on the device */
export const UPI_APPS_CATALOG: UpiAppDef[] = [
  {
    id: 'gpay',
    label: 'Google Pay',
    color: '#4285F4',
    icon: 'logo-google',
    schemes: ['gpay://', 'tez://', 'googlepay://'],
    androidPackage: 'com.google.android.apps.nbu.paisa.user',
  },
  {
    id: 'phonepe',
    label: 'PhonePe',
    color: '#5F259F',
    icon: 'phone-portrait-outline',
    schemes: ['phonepe://'],
    androidPackage: 'com.phonepe.app',
  },
  {
    id: 'paytm',
    label: 'Paytm',
    color: '#00BAF2',
    icon: 'wallet-outline',
    schemes: ['paytmmp://', 'paytm://'],
    androidPackage: 'net.one97.paytm',
  },
  {
    id: 'bhim',
    label: 'BHIM UPI',
    color: '#097969',
    icon: 'flash-outline',
    schemes: ['bhim://', 'upi://'],
    androidPackage: 'in.org.npci.upiapp',
  },
  {
    id: 'amazonpay',
    label: 'Amazon Pay',
    color: '#FF9900',
    icon: 'cart-outline',
    schemes: ['amazonpay://', 'amazonpayin://'],
    androidPackage: 'in.amazon.mShop.android.shopping',
  },
  {
    id: 'cred',
    label: 'CRED',
    color: '#1B1B1B',
    icon: 'diamond-outline',
    schemes: ['credpay://', 'cred://'],
    androidPackage: 'com.dreamplug.androidapp',
  },
  {
    id: 'mobikwik',
    label: 'MobiKwik',
    color: '#0A4A8A',
    icon: 'wallet',
    schemes: ['mobikwik://'],
    androidPackage: 'com.mobikwik_new',
  },
  {
    id: 'navi',
    label: 'Navi',
    color: '#6C2BD9',
    icon: 'navigate-outline',
    schemes: ['navipay://', 'navi://'],
    androidPackage: 'com.naviapp',
  },
  {
    id: 'jupiter',
    label: 'Jupiter',
    color: '#FD5E53',
    icon: 'planet-outline',
    schemes: ['jupiter://', 'jupitermoney://'],
    androidPackage: 'money.jupiter',
  },
  {
    id: 'supermoney',
    label: 'super.money',
    color: '#00C853',
    icon: 'cash-outline',
    schemes: ['supermoney://'],
    androidPackage: 'com.supermoney',
  },
];

/** @deprecated Use UPI_APPS_CATALOG + detectInstalledUpiApps */
export const UPI_APPS = UPI_APPS_CATALOG;

export const CHECKOUT_COUPONS = [
  { code: 'FIRST10', label: '10% off first booking', percent: 10 },
  { code: 'QM50', label: '₹50 off', flat: 50 },
] as const;

export interface NetBankDef {
  id: string;
  name: string;
  short: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const NETBANKING_BANKS_LIST: NetBankDef[] = [
  { id: 'hdfc', name: 'HDFC Bank', short: 'HDFC', color: '#004C8F', icon: 'business-outline' },
  { id: 'icici', name: 'ICICI Bank', short: 'ICICI', color: '#F58220', icon: 'business-outline' },
  { id: 'sbi', name: 'State Bank of India', short: 'SBI', color: '#22409A', icon: 'business-outline' },
  { id: 'axis', name: 'Axis Bank', short: 'Axis', color: '#971237', icon: 'business-outline' },
  { id: 'kotak', name: 'Kotak Mahindra', short: 'Kotak', color: '#ED1C24', icon: 'business-outline' },
  { id: 'pnb', name: 'Punjab National Bank', short: 'PNB', color: '#582C83', icon: 'business-outline' },
  { id: 'bob', name: 'Bank of Baroda', short: 'BOB', color: '#F26522', icon: 'business-outline' },
  { id: 'canara', name: 'Canara Bank', short: 'Canara', color: '#00A651', icon: 'business-outline' },
];

/** @deprecated Use NETBANKING_BANKS_LIST */
export const NETBANKING_BANKS = NETBANKING_BANKS_LIST.map((b) => b.short) as readonly string[];

export interface EmiTenureDef {
  months: number;
  interestApr: number;
  label: string;
  badge?: string;
}

export const EMI_TENURES: EmiTenureDef[] = [
  { months: 3, interestApr: 0, label: '3 months', badge: 'No cost' },
  { months: 6, interestApr: 12, label: '6 months' },
  { months: 9, interestApr: 14, label: '9 months' },
  { months: 12, interestApr: 15, label: '12 months', badge: 'Popular' },
];

export function computeEmiInstallment(amount: number, months: number, interestApr: number): number {
  if (months <= 0) return amount;
  if (interestApr <= 0) return Math.ceil(amount / months);
  const r = interestApr / 12 / 100;
  const emi = (amount * r * (1 + r) ** months) / ((1 + r) ** months - 1);
  return Math.ceil(emi);
}
