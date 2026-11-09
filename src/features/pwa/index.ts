/**
 * PWA：Service Worker 註冊（離線快取、程式更新提示）與「加到主畫面」。
 * 在原生 APP（Capacitor）內不註冊 Service Worker（程式已打包在 APP 中）。
 */
import { create } from 'zustand';
import { isNative, isStandalone } from '@/services/platform';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PwaState {
  /** 已有新版程式，等待使用者按「重新整理」 */
  needRefresh: boolean;
  /** 首次完成離線快取 */
  offlineReady: boolean;
  /** 瀏覽器支援一鍵安裝（Android Chrome / 桌機 Chrome、Edge） */
  canInstall: boolean;
  installed: boolean;
}

export const usePwa = create<PwaState>(() => ({
  needRefresh: false,
  offlineReady: false,
  canInstall: false,
  installed: typeof window !== 'undefined' && (isStandalone() || isNative()),
}));

let updateSW: ((reload?: boolean) => Promise<void>) | null = null;
let deferredPrompt: BeforeInstallPromptEvent | null = null;

export async function setupPwa() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    usePwa.setState({ canInstall: true });
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    usePwa.setState({ canInstall: false, installed: true });
  });

  if (isNative() || !('serviceWorker' in navigator) || !import.meta.env.PROD) return;
  const { registerSW } = await import('virtual:pwa-register');
  updateSW = registerSW({
    onNeedRefresh: () => usePwa.setState({ needRefresh: true }),
    onOfflineReady: () => usePwa.setState({ offlineReady: true }),
    onRegisteredSW: (_url, reg) => {
      // App 長時間開著時，每小時檢查一次是否有新版程式
      if (reg) setInterval(() => navigator.onLine && reg.update(), 60 * 60 * 1000);
    },
  });
}

export const applyAppUpdate = () => updateSW?.(true);
export const dismissOfflineReady = () => usePwa.setState({ offlineReady: false });
export const dismissAppUpdate = () => usePwa.setState({ needRefresh: false });

export async function promptInstall() {
  if (!deferredPrompt) return false;
  await deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  usePwa.setState({ canInstall: false });
  return outcome === 'accepted';
}
