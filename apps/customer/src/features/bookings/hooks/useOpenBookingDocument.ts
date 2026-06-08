import { type Href, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import type { DocumentType } from '../lib/booking.document';

export function useOpenBookingDocument() {
  const router = useRouter();

  return (id: string, type: DocumentType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const path = type === 'invoice' ? '/booking/invoice/[id]' : '/booking/receipt/[id]';
    router.push({ pathname: path, params: { id } } as Href);
  };
}
