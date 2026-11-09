import { Trash2 } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { Empty } from '@/components/ui/Card';
import { EntryRow } from '@/components/content/EntryRow';
import { useLibrary } from '@/stores/library';
import { ConfirmButton } from '@/components/ui/ConfirmButton';

export default function History() {
  const history = useLibrary((s) => s.history);
  const clear = useLibrary((s) => s.clearHistory);
  return (
    <>
      <TopBar title="瀏覽紀錄" back />
      <Page>
        {history.length ? (
          <>
            <div className="mb-3 flex justify-end">
              <ConfirmButton onConfirm={clear} confirmText="再按一次清除" className="tap flex items-center gap-2 rounded-2xl px-3 font-bold text-danger">
                <Trash2 className="size-5" aria-hidden />清除紀錄
              </ConfirmButton>
            </div>
            <div className="flex flex-col gap-2">{history.map((x) => <EntryRow key={x.type + x.id} type={x.type} id={x.id} />)}</div>
          </>
        ) : (
          <Empty text="還沒有瀏覽紀錄" />
        )}
      </Page>
    </>
  );
}
