import type { PartnerJob } from '@/constants/demo';

const DEMO_CUSTOMER_PHONE = '9876501234';

export function jobCustomerPhone(job: PartnerJob): string {
  return job.customerPhone?.replace(/\D/g, '').slice(-10) || DEMO_CUSTOMER_PHONE;
}

export function maskCustomerPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  if (digits.length < 10) return '+91 —';
  return `+91 ${digits.slice(0, 2)}XX XXX${digits.slice(-3)}`;
}

export function customerTelUri(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  return `tel:+91${digits}`;
}

export function canCallCustomer(job: PartnerJob): boolean {
  return job.status === 'accepted' || job.status === 'in_progress';
}
