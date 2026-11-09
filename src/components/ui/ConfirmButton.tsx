import { useEffect, useState, type ReactNode } from 'react';

/**
 * 兩段式確認按鈕：第一次按顯示「再按一次確認」，3 秒內再按才執行。
 * 取代 window.confirm()（部分嵌入環境與 WebView 會封鎖原生對話框）。
 */
export function ConfirmButton({ onConfirm, children, confirmText = '再按一次確認', className = '' }: { onConfirm: () => void; children: ReactNode; confirmText?: string; className?: string }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button
      type="button"
      onClick={() => (armed ? (setArmed(false), onConfirm()) : setArmed(true))}
      className={`${className} ${armed ? 'bg-danger text-white' : ''}`}
    >
      {armed ? confirmText : children}
    </button>
  );
}
