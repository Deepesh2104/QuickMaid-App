type NotificationListener = () => void;

const listeners = new Set<NotificationListener>();

export function notifyNotificationsChanged(): void {
  listeners.forEach((fn) => fn());
}

export function subscribeNotificationsChanged(fn: NotificationListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
