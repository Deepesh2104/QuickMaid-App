/** Cross-app visit completion handoff (customer UI after partner OTP verify). */

export const VISIT_COMPLETE_BRIDGE_KEY = '@qm/pending_visit_complete';

export interface VisitCompleteBridgePayload {
  bookingId: string;
  bookingRef?: string;
  maidName: string;
  service: string;
  completedAt: string;
}
