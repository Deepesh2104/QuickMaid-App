export type DispatchEvent =
  | { type: 'new_offer'; jobId: string; bookingRef: string }
  | { type: 'offer_expired'; jobId: string; bookingRef: string }
  | { type: 'online_pulse' };

type DispatchListener = (event: DispatchEvent) => void;

const listeners = new Set<DispatchListener>();

export function subscribeDispatchEvents(listener: DispatchListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitDispatchEvent(event: DispatchEvent): void {
  queueMicrotask(() => listeners.forEach((fn) => fn(event)));
}
