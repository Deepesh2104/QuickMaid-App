import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@qmp/partner_customer_reviews_v1';

export interface PartnerCustomerReview {
  id: string;
  bookingRef: string;
  customerName: string;
  service: string;
  stars: number;
  text?: string;
  tags?: string[];
  createdAt: string;
}

export async function getPartnerCustomerReviews(): Promise<PartnerCustomerReview[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as PartnerCustomerReview[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function appendPartnerCustomerReview(
  review: Omit<PartnerCustomerReview, 'id'> & { id?: string },
): Promise<PartnerCustomerReview> {
  const list = await getPartnerCustomerReviews();
  const entry: PartnerCustomerReview = {
    id: review.id ?? `rv-bridge-${review.bookingRef}-${review.createdAt}`,
    bookingRef: review.bookingRef,
    customerName: review.customerName,
    service: review.service,
    stars: review.stars,
    text: review.text,
    tags: review.tags,
    createdAt: review.createdAt,
  };
  const withoutDup = list.filter((r) => r.bookingRef !== entry.bookingRef);
  const next = [entry, ...withoutDup].slice(0, 50);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return entry;
}
