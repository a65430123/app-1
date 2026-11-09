import { useEffect, useState } from 'react';
import { RefreshCw, Download, WifiOff, CircleCheck, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { usePwa, applyAppUpdate, dismissAppUpdate, dismissOfflineReady } from '@/features/pwa';
import { useContentUpdate, applyPending } from '@/features/content-update';
import { useOnline } from '@/services/platform';

/** 底部導覽列上方的提示條：一次只顯示一則（程式更新 > 內容更新 > 離線 > 可離線使用） */
export function UpdateBanner() {
  const { needRefresh, offlineReady } = usePwa();
  const { status, pendingVersion } = useContentUpdate();
  const online = useOnline((s) => s.online);
  const [hiddenVersion, setHiddenVersion] = useState<string>();

  useEffect(() => {
    if (!offlineReady) return;
    const t = setTimeout(dismissOfflineReady, 5000);
    return () => clearTimeout(t);
  }, [offlineReady]);

  if (needRefresh)
    return (
      <Bar icon={<RefreshCw className="size-6 text-primary" />} text="工程通有新版本" onClose={dismissAppUpdate}>
        <Action onClick={() => applyAppUpdate()}>重新整理</Action>
      </Bar>
    );
  // 關閉後不再提示這個版本；下次開啟 App 會自動套用
  if (status === 'ready' && pendingVersion && hiddenVersion !== pendingVersion)
    return (
      <Bar icon={<Download className="size-6 shrink-0 text-primary" />} text="內容有新版" sub={pendingVersion} onClose={() => setHiddenVersion(pendingVersion)}>
        <Action onClick={applyPending}>套用</Action>
      </Bar>
    );
  if (!online) return <Bar icon={<WifiOff className="size-6 text-warning" />} text="目前離線，仍可瀏覽已下載的內容" />;
  if (offlineReady)
    return <Bar icon={<CircleCheck className="size-6 text-success" />} text="已可離線使用" onClose={dismissOfflineReady} />;
  return null;
}

function Bar({ icon, text, sub, children, onClose }: { icon: ReactNode; text: string; sub?: string; children?: ReactNode; onClose?: () => void }) {
  return (
    <div role="status" className="fixed inset-x-0 bottom-[calc(68px+env(safe-area-inset-bottom))] z-40 px-3 pb-2">
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl bg-charcoal py-2 pl-4 pr-2 text-on-charcoal shadow-lg">
        {icon}
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block font-bold">{text}</span>
          {sub && <span className="block text-sm opacity-80">{sub}</span>}
        </span>
        {children}
        {onClose && (
          <button type="button" onClick={onClose} className="tap flex items-center justify-center rounded-full active:bg-white/10" aria-label="關閉">
            <X className="size-6" />
          </button>
        )}
      </div>
    </div>
  );
}

function Action({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="tap shrink-0 rounded-xl bg-primary px-4 text-lg font-bold text-on-primary">
      {children}
    </button>
  );
}
