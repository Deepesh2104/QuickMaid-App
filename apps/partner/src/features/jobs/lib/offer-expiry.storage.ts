import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@qmp/offer_listed_at_v1';

type ListedAtMap = Record<string, number>;

async function readMap(): Promise<ListedAtMap> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ListedAtMap) : {};
  } catch {
    return {};
  }
}

async function writeMap(map: ListedAtMap): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(map));
}

/** First time a pending offer is seen — starts the response window. */
export async function ensureOfferListedAt(jobId: string): Promise<number> {
  const map = await readMap();
  if (!map[jobId]) {
    map[jobId] = Date.now();
    await writeMap(map);
  }
  return map[jobId];
}

export async function getOfferListedAt(jobId: string): Promise<number | null> {
  const map = await readMap();
  return map[jobId] ?? null;
}

export async function primeOfferTimers(jobIds: string[]): Promise<void> {
  const map = await readMap();
  const now = Date.now();
  let dirty = false;
  for (const id of jobIds) {
    if (!map[id]) {
      map[id] = now;
      dirty = true;
    }
  }
  if (dirty) await writeMap(map);
}

export async function clearOfferListedAt(jobId: string): Promise<void> {
  const map = await readMap();
  if (!map[jobId]) return;
  delete map[jobId];
  await writeMap(map);
}
