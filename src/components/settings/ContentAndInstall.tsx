import { Download, RefreshCw, Smartphone, Share, SquarePlus, CircleCheck, LoaderCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { activeContent, procedures, materials, terms, calculators } from '@/content';
import { useContentUpdate, checkForUpdate, applyPending, resetToBuiltin } from '@/features/content-update';
import { usePwa, promptInstall } from '@/features/pwa';
import { isIOS, isNative } from '@/services/platform';
import { ConfirmButton } from '@/components/ui/ConfirmButton';

/** 試用版（單一頁面）沒有內容主機與離線快取 */
const isTrial = import.meta.env.MODE === 'artifact';

const statusText: Record<string, string> = {
  checking: '檢查中…',
  downloading: '下載新內容中…',
};

export function ContentVersionCard() {
  const { status, message, pendingVersion, lastCheckedAt } = useContentUpdate();
  const busy = status === 'checking' || status === 'downloading';
  return (
    <Card className="mb-3">
      <div className="mb-2 text-lg font-bold">內容版本</div>
      <dl className="mb-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="text-muted">目前版本</dt>
        <dd className="font-bold">
          {activeContent.version}
          <span className="ml-2 rounded-full bg-surface-2 px-2 py-0.5 text-sm font-normal text-muted">{activeContent.source === 'builtin' ? '內建' : '已線上更新'}</span>
        </dd>
        <dt className="text-muted">內容</dt>
        <dd>工序 {procedures.length}・材料 {materials.length}・術語 {terms.length}・計算機 {calculators.length}</dd>
        <dt className="text-muted">上次檢查</dt>
        <dd>{lastCheckedAt ? new Date(lastCheckedAt).toLocaleString('zh-TW', { hour12: false }) : '尚未檢查'}</dd>
      </dl>

      {(busy || message) && (
        <p className={`mb-3 flex items-center gap-2 rounded-xl px-3 py-2 ${status === 'error' ? 'bg-danger-bg' : 'bg-surface-2'}`} role="status">
          {busy ? <LoaderCircle className="size-5 animate-spin text-primary" /> : status !== 'error' && <CircleCheck className="size-5 text-success" />}
          {busy ? statusText[status] : message}
        </p>
      )}

      {isTrial ? (
        <p className="rounded-xl bg-surface-2 px-3 py-2 text-muted">試用版不連線檢查更新；正式網頁版與 App 會在開啟時自動檢查。</p>
      ) : status === 'ready' && pendingVersion ? (
        <button type="button" onClick={applyPending} className="tap flex w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-bold text-on-primary">
          <Download className="size-6" />套用新內容（{pendingVersion}）
        </button>
      ) : (
        <button type="button" disabled={busy} onClick={() => checkForUpdate({ manual: true })}
          className="tap flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary text-lg font-bold text-primary-ink disabled:opacity-50">
          <RefreshCw className={`size-6 ${busy ? 'animate-spin' : ''}`} />檢查內容更新
        </button>
      )}
      {activeContent.source === 'remote' && (
        <ConfirmButton onConfirm={resetToBuiltin} confirmText="再按一次還原" className="tap mt-2 w-full rounded-2xl font-bold text-muted">
          還原為內建內容
        </ConfirmButton>
      )}
      <p className="mt-2 text-sm text-muted">App 開啟時會自動檢查。內容更新不需重新安裝 App。</p>
    </Card>
  );
}

export function InstallCard() {
  const { canInstall, installed } = usePwa();
  if (isNative() || isTrial) return null;
  return (
    <Card className="mb-3">
      <div className="mb-2 flex items-center gap-2 text-lg font-bold"><Smartphone className="size-6 text-primary" />加到主畫面</div>
      {installed ? (
        <p className="flex items-center gap-2 text-success"><CircleCheck className="size-5" />已安裝，可從主畫面開啟、離線使用</p>
      ) : canInstall ? (
        <>
          <p className="mb-3 text-muted">安裝後可像 App 一樣從主畫面開啟，沒有網路也能看。</p>
          <button type="button" onClick={promptInstall} className="tap flex w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-bold text-on-primary">
            <SquarePlus className="size-6" />安裝工程通
          </button>
        </>
      ) : isIOS() ? (
        <ol className="flex list-decimal flex-col gap-1 pl-6">
          <li>用 Safari 開啟本網站</li>
          <li>點下方的「分享」<Share className="mx-1 inline size-5 align-text-bottom" />按鈕</li>
          <li>選「加入主畫面」</li>
        </ol>
      ) : (
        <p className="text-muted">請用瀏覽器選單中的「安裝應用程式」或「加到主畫面」。</p>
      )}
    </Card>
  );
}
