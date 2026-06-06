import { Ionicons } from '@expo/vector-icons';

export interface ServiceItem {
  id: string;
  name: string;
  price: string;
  rating: string;
  reviews: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  duration?: string;
  location?: string;
  category: string;
  desc?: string;
}

export const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'apps-outline' as const },
  { id: 'deep', label: 'Deep', icon: 'home-outline' as const },
  { id: 'regular', label: 'Regular', icon: 'sparkles-outline' as const },
  { id: 'kitchen', label: 'Kitchen', icon: 'restaurant-outline' as const },
  { id: 'bathroom', label: 'Bathroom', icon: 'water-outline' as const },
];

export const HOME_SERVICES: ServiceItem[] = [
  {
    id: 'deep',
    name: 'Deep Cleaning',
    price: '₹499',
    rating: '4.85',
    reviews: '12k',
    icon: 'home-outline',
    tint: '#E6F4F2',
    duration: '3–4 hrs',
    location: 'Raipur',
    category: 'deep',
    desc: 'Full home deep clean',
  },
  {
    id: 'regular',
    name: 'Regular Cleaning',
    price: '₹149',
    rating: '4.82',
    reviews: '28k',
    icon: 'sparkles-outline',
    tint: '#EEF6FF',
    duration: '1–2 hrs',
    location: 'Raipur',
    category: 'regular',
    desc: 'Weekly maintenance clean',
  },
  {
    id: 'kitchen',
    name: 'Kitchen Cleaning',
    price: '₹299',
    rating: '4.80',
    reviews: '8k',
    icon: 'restaurant-outline',
    tint: '#FFF8EE',
    duration: '2 hrs',
    location: 'Raipur',
    category: 'kitchen',
    desc: 'Degrease & sanitize kitchen',
  },
  {
    id: 'bathroom',
    name: 'Bathroom Cleaning',
    price: '₹199',
    rating: '4.78',
    reviews: '6k',
    icon: 'water-outline',
    tint: '#F3EEFF',
    duration: '1.5 hrs',
    location: 'Raipur',
    category: 'bathroom',
    desc: 'Tiles, taps & fittings',
  },
];

export const FEATURED_SERVICES = HOME_SERVICES.slice(0, 3);
