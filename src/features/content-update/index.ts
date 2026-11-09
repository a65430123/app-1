/**
 * 遠端內容更新
 *
 * 流程：
 *  1. 啟動時 initContent()：讀取本機已下載的內容包，若比內建新且相容就套用（在首次畫面前完成，不會閃）。
 *  2. 啟動後 checkForUpdate()：抓遠端 manifest.json → 比對版本、schemaVersion、minAppVersion
 *     → 有新版就下載 bundle → 驗證 SHA-256 與資料格式 → 存到本機 → 狀態變成 ready，畫面出現「套用」提示。
 *  3. 使用者按「套用」→ applyPending()；沒按的話，下次開啟 App 也會自動套用。
 *  任何一步失敗都保留目前內容，不影響使用。
 *
 * 只更新「內容資料」，不更新程式碼。
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ContentBundle, ContentManifest, SCHEMA_VERSION } from '@/schema';
import { activeContent, applyBundle, builtinBundle } from '@/content';
import { compareVersions, sha256Hex } from '@/lib/version';
import { kv } from '@/services/storage/kv';
import { appStorage } from '@/services/storage';

const KEY = 'content-bundle';
export const CONTENT_BASE_URL = import.meta.env.VITE_CONTENT_BASE_URL || `${import.meta.env.BASE_URL}content-api/`;
const APP_VERSION = __APP_VERSION__;

export type UpdateStatus = 'idle' | 'checking' | 'downloading' | 'up-to-date' | 'ready' | 'offline' | 'error';

interface State {
  status: UpdateStatus;
  message?: string;
  pendingVersion?: string;
  lastCheckedAt?: number;
  /** 內容被替換的次數；畫面以此作為 key 重新渲染 */
  revision: number;
}

export const useContentUpdate = create<State>()(
  persist<State>(() => ({ status: 'idle', revision: 0 }), {
    name: 'gct-content-update',
    storage: createJSONStorage(() => appStorage),
    partialize: (s: State) => ({ lastCheckedAt: s.lastCheckedAt }) as State,
  }),
);
const set = useContentUpdate.setState;

let pending: ContentBundle | null = null;

/** 檢查內容包是否可在這個 App 版本使用 */
function compatible(b: { schemaVersion: number; minAppVersion: string }) {
  if (b.schemaVersion !== SCHEMA_VERSION) return `資料結構版本不相容（需要 ${b.schemaVersion}，App 支援 ${SCHEMA_VERSION}），請更新 App`;
  if (compareVersions(APP_VERSION, b.minAppVersion) < 0) return `此內容需要 App ${b.minAppVersion} 以上，請更新 App`;
  return null;
}

/** 啟動時呼叫：套用本機已下載、且比內建新的內容 */
export async function initContent() {
  try {
    const saved = await kv.get<ContentBundle>(KEY);
    if (!saved) return;
    const parsed = ContentBundle.safeParse(saved);
    if (!parsed.success || compatible(parsed.data) || compareVersions(parsed.data.contentVersion, builtinBundle.contentVersion) <= 0) {
      // 格式錯誤、不相容，或 App 更新後內建內容已經更新 → 丟掉舊的下載內容
      await kv.del(KEY);
      return;
    }
    applyBundle(parsed.data, 'remote');
  } catch (e) {
    console.warn('[內容] 讀取本機內容失敗，使用內建內容', e);
  }
}

async function fetchText(url: string, timeoutMs = 15000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: 'no-store', signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

let running: Promise<void> | null = null;

/** 檢查並下載新內容（不會自動套用）。manual=true 時錯誤訊息較完整。 */
export function checkForUpdate({ manual = false } = {}): Promise<void> {
  if (running) return running;
  running = (async () => {
    if (!navigator.onLine) {
      set({ status: 'offline', message: '目前離線，連上網路後再檢查' });
      return;
    }
    set({ status: 'checking', message: undefined });
    try {
      const m = ContentManifest.parse(JSON.parse(await fetchText(`${CONTENT_BASE_URL}manifest.json`)));
      set({ lastCheckedAt: Date.now() });
      const current = pending?.contentVersion ?? activeContent.version;
      if (compareVersions(m.contentVersion, current) <= 0) {
        set({ status: pending ? 'ready' : 'up-to-date', message: pending ? undefined : '已是最新內容' });
        return;
      }
      const incompatible = compatible(m);
      if (incompatible) {
        set({ status: 'error', message: incompatible });
        return;
      }

      set({ status: 'downloading' });
      const text = await fetchText(new URL(m.bundle, new URL(CONTENT_BASE_URL, location.href)).href, 60000);
      const hash = await sha256Hex(text);
      if (hash && hash !== m.hash) throw new Error('檔案驗證失敗（雜湊值不符）');
      const bundle = ContentBundle.parse(JSON.parse(text));
      if (bundle.contentVersion !== m.contentVersion) throw new Error('內容版本與清單不一致');

      await kv.set(KEY, bundle);
      pending = bundle;
      set({ status: 'ready', pendingVersion: bundle.contentVersion, message: undefined });
    } catch (e) {
      console.warn('[內容] 檢查更新失敗', e);
      set({ status: 'error', message: manual ? `更新失敗：${(e as Error).message}，目前內容不受影響` : '暫時無法檢查更新' });
    }
  })().finally(() => (running = null));
  return running;
}

/** 套用已下載的新內容 */
export function applyPending() {
  if (!pending) return;
  applyBundle(pending, 'remote');
  pending = null;
  set((s) => ({ status: 'up-to-date', pendingVersion: undefined, message: '內容已更新', revision: s.revision + 1 }));
}

/** 還原為 App 內建內容（刪除下載的內容） */
export async function resetToBuiltin() {
  await kv.del(KEY);
  pending = null;
  applyBundle(builtinBundle, 'builtin');
  set((s) => ({ status: 'idle', pendingVersion: undefined, message: '已還原為內建內容', revision: s.revision + 1 }));
}
