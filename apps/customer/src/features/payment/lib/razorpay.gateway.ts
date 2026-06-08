import { PAYMENT_GATEWAY } from '../constants/gateway';
import type { GatewayOrder, GatewayPaymentResult, GatewayMethod } from '../types/payment.types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function createGatewayOrder(amount: number, receipt: string): GatewayOrder {
  return {
    orderId: `order_${Date.now().toString(36)}`,
    amount: Math.round(amount * 100),
    currency: PAYMENT_GATEWAY.currency,
    receipt,
    gateway: PAYMENT_GATEWAY.id,
  };
}

export interface GatewayPayInput {
  order: GatewayOrder;
  method: GatewayMethod;
  methodLabel: string;
  upiAppId?: string;
  vpa?: string;
  cardLast4?: string;
  cvv?: string;
  bankId?: string;
  emiMonths?: number;
}

/** Demo Razorpay charge — swap body with Razorpay SDK / WebView in production */
export async function chargeRazorpayGateway(input: GatewayPayInput): Promise<GatewayPaymentResult> {
  await delay(900);

  if (input.method === 'card' && (!input.cvv || input.cvv.length < 3)) {
    return {
      success: false,
      gateway: 'razorpay',
      orderId: input.order.orderId,
      paymentId: '',
      signature: '',
      method: input.method,
      methodLabel: input.methodLabel,
      amount: input.order.amount / 100,
      error: 'Enter a valid CVV to continue',
    };
  }

  if (input.method === 'netbanking' && !input.bankId) {
    return {
      success: false,
      gateway: 'razorpay',
      orderId: input.order.orderId,
      paymentId: '',
      signature: '',
      method: input.method,
      methodLabel: input.methodLabel,
      amount: input.order.amount / 100,
      error: 'Select your bank to continue',
    };
  }

  if (input.method === 'emi' && (!input.emiMonths || !input.cvv || input.cvv.length < 3)) {
    return {
      success: false,
      gateway: 'razorpay',
      orderId: input.order.orderId,
      paymentId: '',
      signature: '',
      method: input.method,
      methodLabel: input.methodLabel,
      amount: input.order.amount / 100,
      error: input.emiMonths ? 'Enter a valid CVV to continue' : 'Select an EMI tenure',
    };
  }

  if (input.method === 'upi' && !input.upiAppId && !input.vpa?.includes('@')) {
    return {
      success: false,
      gateway: 'razorpay',
      orderId: input.order.orderId,
      paymentId: '',
      signature: '',
      method: input.method,
      methodLabel: input.methodLabel,
      amount: input.order.amount / 100,
      error: 'Select a UPI app or enter a valid UPI ID',
    };
  }

  await delay(1100);

  const paymentId = `pay_${Date.now().toString(36)}`;
  return {
    success: true,
    gateway: 'razorpay',
    orderId: input.order.orderId,
    paymentId,
    signature: `sig_demo_${paymentId}`,
    method: input.method,
    methodLabel: input.methodLabel,
    amount: input.order.amount / 100,
  };
}
