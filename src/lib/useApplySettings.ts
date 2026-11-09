import { useEffect } from 'react';
import { useSettings } from '@/stores/settings';

/** 把主題與字級套到 <html>；「跟隨系統」時監聽系統切換 */
export function useApplySettings() {
  const theme = useSettings((s) => s.theme);
  const fontScale = useSettings((s) => s.fontScale);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && !!mq?.matches);
      root.classList.toggle('dark', dark);
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', dark ? '#0B0C0D' : '#2B2F33');
    };
    apply();
    if (theme === 'system' && mq) {
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.fontScale = fontScale;
  }, [fontScale]);
}
