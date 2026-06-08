/** QuickMaid — cleaning & home-service images only */

export type ImagePair = { primary: string; fallback: string };

const u = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?ixlib=rb-4.0.3&fm=jpg&auto=format&fit=crop&w=${w}&q=80`;

const p = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const SERVICE_POOL: Record<string, ImagePair> = {
  deep: { primary: u('photo-1527515637462-cff94eecc458', 600), fallback: p('qm-deep', 600, 400) },
  regular: { primary: u('photo-1556911220-bff31c812dba', 600), fallback: p('qm-regular', 600, 400) },
  kitchen: { primary: u('photo-1556912172-52f733b9a49e', 600), fallback: p('qm-kitchen', 600, 400) },
  bathroom: { primary: u('photo-1620626011764-996317b8d101', 600), fallback: p('qm-bathroom', 600, 400) },
  sofa: { primary: u('photo-1555041469-a586c61e9bc2', 600), fallback: p('qm-sofa', 600, 400) },
  mattress: { primary: u('photo-1631049307264-da0ec51d2b24', 600), fallback: p('qm-mattress', 600, 400) },
  window: { primary: u('photo-1628177142898-93e36e4e3a50', 600), fallback: p('qm-window', 600, 400) },
  balcony: { primary: u('photo-1563453392213-326e5ee7db1b', 600), fallback: p('qm-balcony', 600, 400) },
  movein: { primary: u('photo-1484154218962-a197022257aa', 600), fallback: p('qm-movein', 600, 400) },
  ac: { primary: u('photo-1631545956767-25d6b7bdc2a6', 600), fallback: p('qm-ac', 600, 400) },
  ironing: { primary: u('photo-1582735689369-4fe89db7114c', 600), fallback: p('qm-iron', 600, 400) },
  cobweb: { primary: u('photo-1584622781867-7d0e6d585e70', 600), fallback: p('qm-ceiling', 600, 400) },
  fan: { primary: u('photo-1558618666-fcd25c85f82e', 600), fallback: p('qm-fan', 600, 400) },
  fridge: { primary: u('photo-1556912172-52f733b9a49e', 600), fallback: p('qm-fridge', 600, 400) },
  dining: { primary: u('photo-1563453392213-326e5ee7db1b', 600), fallback: p('qm-dining', 600, 400) },
  wardrobe: { primary: u('photo-1555041469-a586c61e9bc2', 600), fallback: p('qm-wardrobe', 600, 400) },
  floor: { primary: u('photo-1558618666-fcd25c85f82e', 600), fallback: p('qm-floor', 600, 400) },
  carpet: { primary: u('photo-1527515637462-cff94eecc458', 600), fallback: p('qm-carpet', 600, 400) },
  office: { primary: u('photo-1484154218962-a197022257aa', 600), fallback: p('qm-office', 600, 400) },
  postparty: { primary: u('photo-1556911220-bff31c812dba', 600), fallback: p('qm-party', 600, 400) },
  laundry: { primary: u('photo-1582735689369-4fe89db7114c', 600), fallback: p('qm-laundry', 600, 400) },
  disinfection: { primary: u('photo-1581578731548-c64695cc6952', 600), fallback: p('qm-disinfect', 600, 400) },
  puja: { primary: u('photo-1563453392213-326e5ee7db1b', 600), fallback: p('qm-puja', 600, 400) },
  tank: { primary: u('photo-1628177142898-93e36e4e3a50', 600), fallback: p('qm-tank', 600, 400) },
};

export const HOME_IMAGES: Record<string, ImagePair> = {
  hero: {
    primary: u('photo-1558618666-fcd25c85f82e', 1200),
    fallback: p('qm-hero-mop-clean', 1200, 800),
  },
  promo: {
    primary: u('photo-1581578731548-c64695cc6952', 900),
    fallback: p('qm-promo-sanitize', 900, 500),
  },
  plus: {
    primary: u('photo-1527515637462-cff94eecc458', 700),
    fallback: p('qm-plus-vacuum', 700, 400),
  },
  rebook: {
    primary: u('photo-1556911220-bff31c812dba', 600),
    fallback: p('qm-rebook-kitchen', 600, 360),
  },
  bookingsHero: {
    primary: u('photo-1527515637462-cff94eecc458', 1200),
    fallback: p('qm-bookings-deep-clean', 1200, 800),
  },
  helpHero: {
    primary: u('photo-1581578731548-c64695cc6952', 1200),
    fallback: p('qm-help-support', 1200, 800),
  },
  profileHero: {
    primary: u('photo-1556911220-bff31c812dba', 1200),
    fallback: p('qm-profile-account', 1200, 800),
  },
  ...SERVICE_POOL,
};

/** Map catalogue IDs without dedicated photos to the closest pool image */
const IMAGE_ALIAS: Record<string, keyof typeof SERVICE_POOL> = {
  bhk1deep: 'deep',
  bhk2deep: 'deep',
  bhk3deep: 'deep',
  bhk1regular: 'regular',
  bhk2regular: 'regular',
  bedroom: 'regular',
  kidsroom: 'regular',
  study: 'regular',
  hall: 'regular',
  tvunit: 'regular',
  bookshelf: 'regular',
  shoerack: 'regular',
  chimney: 'kitchen',
  microwave: 'kitchen',
  utensils: 'kitchen',
  slab: 'kitchen',
  toilet: 'bathroom',
  showerglass: 'bathroom',
  bathfan: 'bathroom',
  mould: 'bathroom',
  washingmachine: 'laundry',
  geyser: 'ac',
  cooler: 'ac',
  purifier: 'ac',
  terrace: 'balcony',
  garage: 'balcony',
  garden: 'balcony',
  stairwell: 'balcony',
  diwali: 'deep',
  construction: 'movein',
  marble: 'floor',
  curtain: 'wardrobe',
  pestprep: 'disinfection',
  sofa3plus: 'sofa',
  mattressdouble: 'mattress',
  petfriendly: 'regular',
  senior: 'regular',
  monthly: 'regular',
};

export function getServiceImages(serviceId: string): ImagePair {
  if (serviceId in SERVICE_POOL) return SERVICE_POOL[serviceId];
  const alias = IMAGE_ALIAS[serviceId];
  if (alias) return SERVICE_POOL[alias];
  return SERVICE_POOL.regular;
}

export function getServiceImage(serviceId: string): string {
  return getServiceImages(serviceId).primary;
}
