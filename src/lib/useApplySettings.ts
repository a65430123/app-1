import { useEffect } from 'react';
import { useSettings } from '@/stores/settings';

/**
 * 把主題與字級套到 <html>。
 * 「跟隨系統」時：若外層（例：嵌入的預覽環境）在 <html> 設了 data-theme，優先採用；否則看系統深淺色設定。
 */
export function useApplySettings() {
  const theme = useSettings((s) => s.theme);
  const fontScale = useSettings((s) => s.fontScale);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const apply = () => {
      const host = root.dataset.theme;
      const systemDark = host === 'dark' || (host !== 'light' && !!mq?.matches);
      const dark = theme === 'dark' || (theme === 'system' && systemDark);
      root.classList.toggle('dark', dark);
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0B0C0D' : '#2B2F33');
    };
    apply();
    if (theme !== 'system') return;
    mq?.addEventListener('change', apply);
    const obs = new MutationObserver(apply);
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      mq?.removeEventListener('change', apply);
      obs.disconnect();
    };
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.fontScale = fontScale;
  }, [fontScale]);
}
