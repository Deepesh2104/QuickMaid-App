/**

 * QuickMaid image registry — Unsplash only (free license).

 * Strict: home cleaning, mopping, vacuuming, sanitizing & housekeeping only.

 * All IDs verified live on images.unsplash.com (no 404s).

 */



export type ImagePair = { primary: string; fallback: string };



/** Verified cleaning-action Unsplash photo IDs */

const PHOTO = {

  mopLiving: 'photo-1758272421516-9593de0fb5bf',

  mopHeadphones: 'photo-1758272422189-b10f36fd4ddd',

  mopHappy: 'photo-1758273238847-bc2c2548e210',

  /** Woman dancing while mopping — modern apartment, gloves, wireless headphones */
  mopDance: 'photo-1758273238368-1e2ada245183',

  mopMan: 'photo-1549996647-190b679b33d7',

  mopMask: 'photo-1631365696563-4990f4e9302c',

  floorScrub: 'photo-1571019613454-1cb2f99b2d8b',

  mopBucket: 'photo-1689127903369-aef916b0c40d',

  mopPowder: 'photo-1749214317455-efbdd57df844',

  broom: 'photo-1664008760004-182420e58e7c',

  broomPorch: 'photo-1581578785417-e2cae8cb6af5',

  vacuum: 'photo-1765970101634-9cb341a94ea0',

  robotVac: 'photo-1762500825366-ba34b0c5352e',

  sanitize: 'photo-1581578731548-c64695cc6952',

  spray: 'photo-1587937533577-0ba337fbd436',

  ecoSpray: 'photo-1649072994935-50963475f24b',

  sinkClean: 'photo-1736433622548-4adbbc1c2cf2',

  kitchenSink: 'photo-1556910638-6cdac31d44dc',

  cleanerBottle: 'photo-1681718616298-5cfc1dab6dd5',

  toilet: 'photo-1589824783837-6169889fa20f',

  bathSink: 'photo-1628602813558-8c6ad5eafe4f',

  window: 'photo-1628177142898-93e36e4e3a50',

  laundry: 'photo-1582735689369-4fe89db7114c',

} as const;



const unsplash = (id: string, w: number) =>

  `https://images.unsplash.com/${id}?ixlib=rb-4.0.3&fm=jpg&auto=format&fit=crop&w=${w}&q=80`;



function pair(primaryId: string, fallbackId: string, w = 600, fallbackW = w): ImagePair {

  return {

    primary: unsplash(primaryId, w),

    fallback: unsplash(fallbackId, fallbackW),

  };

}



/** Wide hero crop — 4K home-cleaning shots, entropy-focused for pro framing */
function heroPair(primaryId: string, fallbackId: string): ImagePair {

  const heroUrl = (id: string) =>

    `https://images.unsplash.com/${id}?ixlib=rb-4.0.3&fm=jpg&auto=format&fit=crop&w=1400&h=960&q=85&crop=entropy`;

  return { primary: heroUrl(primaryId), fallback: heroUrl(fallbackId) };

}



const SERVICE_POOL: Record<string, ImagePair> = {

  deep: pair(PHOTO.vacuum, PHOTO.mopLiving, 600),

  regular: pair(PHOTO.mopHeadphones, PHOTO.floorScrub, 600),

  kitchen: pair(PHOTO.sinkClean, PHOTO.cleanerBottle, 600),

  bathroom: pair(PHOTO.sanitize, PHOTO.toilet, 600),

  sofa: pair(PHOTO.vacuum, PHOTO.mopLiving, 600),

  mattress: pair(PHOTO.vacuum, PHOTO.floorScrub, 600),

  window: pair(PHOTO.window, PHOTO.mopMask, 600),

  balcony: pair(PHOTO.broomPorch, PHOTO.broom, 600),

  movein: pair(PHOTO.mopLiving, PHOTO.mopHappy, 600),

  ac: pair(PHOTO.sanitize, PHOTO.spray, 600),

  ironing: pair(PHOTO.laundry, PHOTO.floorScrub, 600),

  cobweb: pair(PHOTO.broom, PHOTO.mopBucket, 600),

  fan: pair(PHOTO.mopBucket, PHOTO.mopPowder, 600),

  fridge: pair(PHOTO.sinkClean, PHOTO.cleanerBottle, 600),

  dining: pair(PHOTO.mopLiving, PHOTO.sinkClean, 600),

  wardrobe: pair(PHOTO.laundry, PHOTO.broom, 600),

  floor: pair(PHOTO.mopMan, PHOTO.floorScrub, 600),

  carpet: pair(PHOTO.vacuum, PHOTO.robotVac, 600),

  office: pair(PHOTO.mopMask, PHOTO.floorScrub, 600),

  postparty: pair(PHOTO.mopHappy, PHOTO.mopMan, 600),

  laundry: pair(PHOTO.laundry, PHOTO.sinkClean, 600),

  disinfection: pair(PHOTO.sanitize, PHOTO.spray, 600),

  puja: pair(PHOTO.mopLiving, PHOTO.sanitize, 600),

  tank: pair(PHOTO.toilet, PHOTO.bathSink, 600),

};



export const HOME_IMAGES: Record<string, ImagePair> = {

  /** Modern living-room mop — Vitaly Gariev 4K home-cleaning series */
  hero: heroPair(PHOTO.mopLiving, PHOTO.mopHeadphones),

  promo: pair(PHOTO.sanitize, PHOTO.spray, 900, 700),

  plus: pair(PHOTO.vacuum, PHOTO.mopLiving, 700, 600),

  rebook: pair(PHOTO.sinkClean, PHOTO.mopMan, 600),

  bookingsHero: pair(PHOTO.vacuum, PHOTO.mopLiving, 1200, 900),

  helpHero: pair(PHOTO.sanitize, PHOTO.ecoSpray, 1200, 900),

  profileHero: pair(PHOTO.mopHeadphones, PHOTO.floorScrub, 1200, 900),

  catalogue: pair(PHOTO.vacuum, PHOTO.sinkClean, 1200, 900),

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



/** Build a one-off Unsplash URL (cleaning IDs only — use PHOTO keys via getServiceImages when possible). */

export function unsplashPhoto(id: keyof typeof PHOTO, width = 600): string {

  return unsplash(PHOTO[id], width);

}


