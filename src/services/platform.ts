/**
 * 平台偵測與瀏覽器 API 降級。
 * P6 加入 Capacitor 後，window.Capacitor 會存在，isNative() 回傳 true。
 */
import { create } from 'zustand';

type CapacitorGlobal = { isNativePlatform?: () => boolean; getPlatform?: () => string };

export const isNative = () => !!(window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor?.isNativePlatform?.();

export const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/** 是否已以「加到主畫面／已安裝」的方式開啟 */
export const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true;

/** 網路狀態（navigator.onLine 不保證準確，只作為提示與略過檢查用） */
export const useOnline = create<{ online: boolean }>(() => ({ online: typeof navigator === 'undefined' ? true : navigator.onLine }));
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useOnline.setState({ online: true }));
  window.addEventListener('offline', () => useOnline.setState({ online: false }));
}
