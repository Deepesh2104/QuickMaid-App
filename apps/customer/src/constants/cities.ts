export interface CityOption {
  id: string;
  name: string;
  state: string;
  live: boolean;
  tag?: string;
}

export const CITIES: CityOption[] = [
  { id: 'raipur', name: 'Raipur', state: 'Chhattisgarh', live: true, tag: 'Live now' },
  { id: 'bilaspur', name: 'Bilaspur', state: 'Chhattisgarh', live: false, tag: 'Coming soon' },
  { id: 'durg', name: 'Durg', state: 'Chhattisgarh', live: false, tag: 'Coming soon' },
  { id: 'bhilai', name: 'Bhilai', state: 'Chhattisgarh', live: false, tag: 'Coming soon' },
  { id: 'nagpur', name: 'Nagpur', state: 'Maharashtra', live: false, tag: 'Coming soon' },
];
