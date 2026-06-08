/** Curated images — Unsplash primary + Picsum fallback (always loads) */

export type ImagePair = { primary: string; fallback: string };

const u = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?ixlib=rb-4.0.3&fm=jpg&auto=format&fit=crop&w=${w}&q=80`;

const p = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const HOME_IMAGES: Record<string, ImagePair> = {
  hero: {
    primary: u('photo-1581578731548-c64695cc6952', 1200),
    fallback: p('qm-hero-clean', 1200, 800),
  },
  promo: {
    primary: u('photo-1628177142898-93e36e4e3a50', 900),
    fallback: p('qm-promo-home', 900, 500),
  },
  plus: {
    primary: u('photo-1563453392213-326e5ee7db1b', 700),
    fallback: p('qm-plus-living', 700, 400),
  },
  rebook: {
    primary: u('photo-1558618666-fcd25c85f82e', 600),
    fallback: p('qm-rebook', 600, 360),
  },
  deep: {
    primary: u('photo-1527515637462-cff94eecc458', 600),
    fallback: p('qm-deep', 600, 400),
  },
  regular: {
    primary: u('photo-1556911220-bff31c812dba', 600),
    fallback: p('qm-regular', 600, 400),
  },
  kitchen: {
    primary: u('photo-1556912172-52f733b9a49e', 600),
    fallback: p('qm-kitchen', 600, 400),
  },
  bathroom: {
    primary: u('photo-1620626011764-996317b8d101', 600),
    fallback: p('qm-bathroom', 600, 400),
  },
};

export function getServiceImages(serviceId: string): ImagePair {
  if (serviceId in HOME_IMAGES && serviceId !== 'hero' && serviceId !== 'promo') {
    return HOME_IMAGES[serviceId];
  }
  return HOME_IMAGES.regular;
}

/** @deprecated use HOME_IMAGES */
export const UNSPLASH = {
  hero: HOME_IMAGES.hero.primary,
  promo: HOME_IMAGES.promo.primary,
  plus: HOME_IMAGES.plus.primary,
  rebook: HOME_IMAGES.rebook.primary,
  services: {
    deep: HOME_IMAGES.deep.primary,
    regular: HOME_IMAGES.regular.primary,
    kitchen: HOME_IMAGES.kitchen.primary,
    bathroom: HOME_IMAGES.bathroom.primary,
  },
};

export function getServiceImage(serviceId: string): string {
  return getServiceImages(serviceId).primary;
}
