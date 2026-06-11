/** Keep in sync with QuickMaid-App/shared/visit-complete-bridge.ts — run: npm run sync:shared */
export const VISIT_COMPLETE_BRIDGE_KEY = '@qm/pending_visit_complete';

export interface VisitCompleteBridgePayload {
  bookingId: string;
  bookingRef?: string;
  maidName: string;
  service: string;
  completedAt: string;
}
