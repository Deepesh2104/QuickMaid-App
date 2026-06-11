import { radius, spacing } from '@/theme/spacing';

/** Must match BookingsHeader `paddingBottom` — white sheet overlaps this much into the hero. */
export const BOOKINGS_SHEET_OVERLAP = 28;

export const BOOKINGS_HEADER_TAIL = '#0F1419';

export const BOOKINGS_SHEET_RADIUS = radius.xxl + 4;

/** Dark bridge behind curved sheet corners (same as Profile / Help / Plus). */
export const BOOKINGS_SHEET_BRIDGE_HEIGHT = BOOKINGS_SHEET_OVERLAP + BOOKINGS_SHEET_RADIUS + spacing.sm;
