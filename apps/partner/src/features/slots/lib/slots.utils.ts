import type { PartnerProfile } from '@/constants/app';
import {
  DEFAULT_PREFERRED_SLOT_IDS,
  PREFERRED_SLOTS,
  type PreferredSlotId,
} from '@/features/slots/constants/slots.premium';

export function resolvePreferredSlotIds(profile: PartnerProfile | null | undefined): PreferredSlotId[] {
  const saved = profile?.preferredSlotIds;
  if (saved?.length) {
    return saved.filter((id): id is PreferredSlotId =>
      PREFERRED_SLOTS.some((s) => s.id === id),
    );
  }
  return [...DEFAULT_PREFERRED_SLOT_IDS];
}

export function isSlotActive(ids: readonly string[], slotId: string): boolean {
  return ids.includes(slotId);
}

export function togglePreferredSlot(ids: readonly string[], slotId: PreferredSlotId): PreferredSlotId[] {
  const current = ids as PreferredSlotId[];
  if (current.includes(slotId)) {
    if (current.length <= 1) return current;
    return current.filter((id) => id !== slotId);
  }
  return [...current, slotId];
}

export function activeSlotCount(ids: readonly string[]): number {
  return PREFERRED_SLOTS.filter((s) => isSlotActive(ids, s.id)).length;
}

export function slotsSummaryLabel(ids: readonly string[]): string {
  const active = PREFERRED_SLOTS.filter((s) => isSlotActive(ids, s.id));
  if (active.length === 0) return 'No slots selected';
  if (active.length === PREFERRED_SLOTS.length) return 'All windows active';
  if (active.length === 1) return active[0]!.label;
  return `${active.length} slots active`;
}
