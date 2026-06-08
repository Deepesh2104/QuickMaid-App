import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';

import type { LegalDocId } from '../types/legal.types';

export function useOpenLegal() {
  const router = useRouter();

  return (doc: LegalDocId | 'hub') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (doc === 'hub') {
      router.push('/legal' as Href);
      return;
    }
    router.push(`/legal/${doc}` as Href);
  };
}
