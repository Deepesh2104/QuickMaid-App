type JobsListener = () => void;

const listeners = new Set<JobsListener>();

export function notifyPartnerJobsChanged(): void {
  listeners.forEach((fn) => fn());
}

export function subscribePartnerJobsChanged(fn: JobsListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
