/**
 * 大型資料用的 key-value 儲存（例：下載的內容包）。
 * 網頁版：IndexedDB；無法使用時降級為記憶體（關閉 App 即消失，但不影響使用）。
 * APP 版（P6）：可換成 Capacitor Filesystem，介面不變。
 */
export interface KVStore {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T): Promise<void>;
  del(key: string): Promise<void>;
}

const DB = 'gct';
const STORE = 'kv';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbStore(): KVStore {
  let dbp: Promise<IDBDatabase> | null = null;
  const db = () => (dbp ??= openDB());
  const run = <T,>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest) =>
    db().then(
      (d) =>
        new Promise<T>((resolve, reject) => {
          const req = fn(d.transaction(STORE, mode).objectStore(STORE));
          req.onsuccess = () => resolve(req.result as T);
          req.onerror = () => reject(req.error);
        }),
    );
  return {
    get: (k) => run('readonly', (s) => s.get(k)),
    set: (k, v) => run('readwrite', (s) => s.put(v, k)),
    del: (k) => run('readwrite', (s) => s.delete(k)),
  };
}

function memoryStore(): KVStore {
  const m = new Map<string, unknown>();
  return {
    get: async (k) => m.get(k) as never,
    set: async (k, v) => void m.set(k, v),
    del: async (k) => void m.delete(k),
  };
}

/** 先試 IndexedDB，任何一次失敗就整個改用記憶體 */
function resilient(): KVStore {
  const mem = memoryStore();
  let primary: KVStore | null = typeof indexedDB !== 'undefined' ? idbStore() : null;
  const wrap =
    <A extends unknown[], R>(fn: (s: KVStore, ...a: A) => Promise<R>) =>
    async (...a: A): Promise<R> => {
      if (primary) {
        try {
          return await fn(primary, ...a);
        } catch {
          primary = null;
        }
      }
      return fn(mem, ...a);
    };
  return {
    get: wrap((s, k: string) => s.get(k)) as KVStore['get'],
    set: wrap((s, k: string, v: unknown) => s.set(k, v)) as KVStore['set'],
    del: wrap((s, k: string) => s.del(k)),
  };
}

export const kv = resilient();
