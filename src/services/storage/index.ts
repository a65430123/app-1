/**
 * 本機儲存抽象層。
 * 網頁版：localStorage（P3 起收藏/紀錄改 IndexedDB）。
 * APP 版（P6）：換成 Capacitor Preferences / Filesystem，頁面與 store 不需修改。
 */
import type { StateStorage } from 'zustand/middleware';

const memory = new Map<string, string>();

function safeLocal(): Storage | null {
  try {
    const k = '__gct_test__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return window.localStorage;
  } catch {
    return null; // 隱私模式或被封鎖 → 降級為記憶體
  }
}

const ls = typeof window !== 'undefined' ? safeLocal() : null;

export const appStorage: StateStorage = {
  getItem: (name) => (ls ? ls.getItem(name) : memory.get(name) ?? null),
  setItem: (name, value) => {
    if (ls) ls.setItem(name, value);
    else memory.set(name, value);
  },
  removeItem: (name) => {
    if (ls) ls.removeItem(name);
    else memory.delete(name);
  },
};
